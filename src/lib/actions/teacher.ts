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

function run(action: string, fn: () => Promise<void>): Promise<ActionResult> {
  return auth()
    .then(async (session) => {
      await fn();
      if (session?.user) {
        await recordAudit({ action, entity: "class", entityId: "teacher", details: { by: session.user.email } }).catch(() => {});
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
  return run("CLASS_ENROLL_STUDENT", async () => {
    await requireTeacher();
    const classRow = await prisma.class.findFirst({ where: { id: classId } });
    if (!classRow) throw new Error("Class not found.");
    const session = await auth();
    if (classRow.teacherId !== session?.user?.id) throw new Error("You do not teach this class.");

    await prisma.enrollment.create({
      data: { classId, studentProfileId },
    }).catch(() => {
      throw new Error("This student is already enrolled in the class.");
    });
  });
}

export async function unenrollStudent(enrollmentId: string): Promise<ActionResult> {
  return run("CLASS_UNENROLL_STUDENT", async () => {
    await requireTeacher();
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { class: true },
    });
    if (!enrollment) throw new Error("Enrollment not found.");
    const session = await auth();
    if (enrollment.class.teacherId !== session?.user?.id) throw new Error("You do not teach this class.");
    await prisma.enrollment.delete({ where: { id: enrollmentId } });
  });
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

  return run("GRADE_SUBMIT", async () => {
    await requireTeacher();
    const session = await auth();
    const ids = parsed.data.enrollmentIds;
    const enrollments = await prisma.enrollment.findMany({
      where: { id: { in: ids } },
      include: { class: true },
    });
    if (enrollments.length !== ids.length) throw new Error("Some enrollments no longer exist.");

    await prisma.$transaction(
      enrollments.map((enrollment, i) => {
        if (enrollment.class.teacherId !== session?.user?.id) {
          throw new Error("You do not teach this class.");
        }
        return prisma.enrollment.update({
          where: { id: enrollment.id },
          data: { grade: parsed.data.grades[i], remarks: parsed.data.remarks?.[i] ?? null },
        });
      })
    );
  });
}
