"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

type ActionResult = { ok: true } | { ok: false; error: string };

async function requireTeacher() {
  const session = await auth();
  if (!session?.user || session.user.role !== "TEACHER") {
    throw new Error("Only teachers may perform this action.");
  }
  return session.user;
}

type AuditEntry = {
  action: string;
  entity?: string;
  entityId?: string;
  details?: unknown;
};

function run(entries: AuditEntry[] | ((actorId: string) => Promise<AuditEntry[]>), fn: (actorId: string) => Promise<void>): Promise<ActionResult> {
  return auth()
    .then(async (session) => {
      if (!session?.user) throw new Error("Not signed in.");
      await fn(session.user.id);
      const auditEntries = typeof entries === "function" ? await entries(session.user.id) : entries;
      for (const entry of auditEntries) {
        await recordAudit({ ...entry, details: { ...(entry.details ?? {}), by: session.user.email } }).catch(() => {});
      }
      return { ok: true as const };
    })
    .catch((error) => ({ ok: false as const, error: error instanceof Error ? error.message : "Something went wrong." }));
}

export async function listMyClasses() {
  const session = await auth();
  if (!session?.user || session.user.role !== "TEACHER") return [];
  const classes = await prisma.class.findMany({
    where: { teacherId: session.user.id },
    include: {
      subject: true,
      _count: { select: { enrollments: true } },
    },
    orderBy: [{ academicYear: "desc" }, { semester: "asc" }],
  });
  return classes;
}

export async function getClassWithStudents(classId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "TEACHER") return null;
  return prisma.class.findFirst({
    where: { id: classId, teacherId: session.user.id },
    include: {
      subject: true,
      enrollments: {
        include: {
          studentProfile: { include: { user: { select: { name: true, email: true } } } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function searchStudents(query: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "TEACHER") return [];
  const q = query.trim();
  if (q.length < 2) return [];
  return prisma.studentProfile.findMany({
    where: {
      OR: [
        { studentNumber: { contains: q, mode: "insensitive" } },
        { user: { name: { contains: q, mode: "insensitive" } } },
        { user: { email: { contains: q, mode: "insensitive" } } },
      ],
    },
    include: { user: { select: { name: true, email: true } } },
    take: 20,
  });
}

export async function enrollStudent(classId: string, studentProfileId: string): Promise<ActionResult> {
  return run(async () => {
    const teacher = await requireTeacher();
    const [classRow, studentProfile] = await Promise.all([
      prisma.class.findFirst({ where: { id: classId }, include: { subject: true } }),
      prisma.studentProfile.findUnique({
        where: { id: studentProfileId },
        include: { user: { select: { name: true } } },
      }),
    ]);
    if (!classRow) throw new Error("Class not found.");
    if (!studentProfile) throw new Error("Student not found.");
    if (classRow.teacherId !== teacher.id) throw new Error("You do not teach this class.");

    const enrollment = await prisma.enrollment.create({
      data: { classId, studentProfileId },
    }).catch(() => {
      throw new Error("This student is already enrolled in the class.");
    });

    return [{
      action: "CLASS_ENROLL_STUDENT",
      entity: "enrollment",
      entityId: enrollment.id,
      details: {
        studentName: studentProfile.user.name ?? "Unnamed student",
        studentNumber: studentProfile.studentNumber,
        subjectCode: classRow.subject.code,
        subjectTitle: classRow.subject.title,
        section: classRow.section,
        semester: classRow.semester,
        academicYear: classRow.academicYear,
      },
    }];
  }, async () => {});
}

export async function unenrollStudent(enrollmentId: string): Promise<ActionResult> {
  return run(async () => {
    const teacher = await requireTeacher();
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        class: { include: { subject: true } },
        studentProfile: { include: { user: { select: { name: true } } } },
      },
    });
    if (!enrollment) throw new Error("Enrollment not found.");
    if (enrollment.class.teacherId !== teacher.id) throw new Error("You do not teach this class.");

    const { class: classRow, studentProfile } = enrollment;
    await prisma.enrollment.delete({ where: { id: enrollmentId } });

    return [{
      action: "CLASS_UNENROLL_STUDENT",
      entity: "enrollment",
      entityId: enrollmentId,
      details: {
        studentName: studentProfile.user.name ?? "Unnamed student",
        studentNumber: studentProfile.studentNumber,
        subjectCode: classRow.subject.code,
        subjectTitle: classRow.subject.title,
        section: classRow.section,
        semester: classRow.semester,
        academicYear: classRow.academicYear,
      },
    }];
  }, async () => {});
}

const gradeSchema = z.object({
  enrollmentIds: z.array(z.string().min(1)),
  grades: z.array(z.number().min(0).max(100)),
  remarks: z.array(z.string().max(40)).optional(),
});

export async function saveGrades(input: unknown): Promise<ActionResult> {
  const parsed = gradeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid grade data." };
  if (parsed.data.enrollmentIds.length !== parsed.data.grades.length) {
    return { ok: false, error: "Grade data mismatch." };
  }

  return run(async () => {
    const teacher = await requireTeacher();
    const ids = parsed.data.enrollmentIds;
    const enrollments = await prisma.enrollment.findMany({
      where: { id: { in: ids } },
      include: {
        class: { include: { subject: true } },
        studentProfile: { include: { user: { select: { name: true } } } },
      },
    });
    if (enrollments.length !== ids.length) throw new Error("Some enrollments no longer exist.");

    await prisma.$transaction(
      enrollments.map((enrollment, i) => {
        if (enrollment.class.teacherId !== teacher.id) {
          throw new Error("You do not teach this class.");
        }
        return prisma.enrollment.update({
          where: { id: enrollment.id },
          data: { grade: parsed.data.grades[i], remarks: parsed.data.remarks?.[i] ?? null },
        });
      })
    );

    return enrollments.map((enrollment, i) => ({
      action: "GRADE_SUBMIT",
      entity: "enrollment",
      entityId: enrollment.id,
      details: {
        studentName: enrollment.studentProfile.user.name ?? "Unnamed student",
        studentNumber: enrollment.studentProfile.studentNumber,
        subjectCode: enrollment.class.subject.code,
        subjectTitle: enrollment.class.subject.title,
        section: enrollment.class.section,
        semester: enrollment.class.semester,
        academicYear: enrollment.class.academicYear,
        oldGrade: enrollment.grade ?? null,
        newGrade: parsed.data.grades[i],
      },
    }));
  }, async () => {});
}
