"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { isAdminRole } from "@/lib/roles";

type ActionResult = { ok: true } | { ok: false; error: string };

const subjectSchema = z.object({
  code: z.string().trim().min(2, "Enter a subject code (e.g. MATH101).").max(20),
  title: z.string().trim().min(2, "Enter the subject title.").max(120),
  units: z.coerce.number().int().min(1).max(10),
  collegeId: z.string().optional().nullable(),
});

const classSchema = z.object({
  subjectId: z.string().min(1, "Select a subject."),
  teacherId: z.string().min(1, "Select a teacher."),
  section: z.string().trim().min(1, "Enter a section (e.g. BSIT-1A).").max(40),
  semester: z.string().trim().min(1, "Enter the semester (e.g. 1st Semester).").max(40),
  academicYear: z.string().trim().min(4, "Enter the academic year (e.g. 2026-2027).").max(20),
  schedule: z.string().trim().max(80).optional().nullable(),
  room: z.string().trim().max(40).optional().nullable(),
});

async function requireAdmin() {
  const session = await auth();
  if (!isAdminRole(session?.user?.role)) {
    throw new Error("You are not authorized to perform this action.");
  }
  return session!.user!;
}

async function run(label: string, action: () => Promise<void>, details?: unknown): Promise<ActionResult> {
  try {
    await action();
    await recordAudit({ action: label, details });
    revalidatePath("/admin/academics");
    return { ok: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { ok: false, error: error.errors[0]?.message ?? "Please check your inputs and try again." };
    }
    return { ok: false, error: error instanceof Error ? error.message : "Something went wrong." };
  }
}

export async function createSubject(input: unknown): Promise<ActionResult> {
  return run("SUBJECT_CREATE", async () => {
    await requireAdmin();
    const parsed = subjectSchema.parse(input);
    await prisma.subject.create({
      data: {
        code: parsed.code.toUpperCase(),
        title: parsed.title,
        units: parsed.units,
        collegeId: parsed.collegeId || null,
      },
    });
  }, { code: (input as { code?: string })?.code });
}

export async function updateSubject(id: string, input: unknown): Promise<ActionResult> {
  return run("SUBJECT_UPDATE", async () => {
    await requireAdmin();
    const parsed = subjectSchema.parse(input);
    await prisma.subject.update({
      where: { id },
      data: {
        code: parsed.code.toUpperCase(),
        title: parsed.title,
        units: parsed.units,
        collegeId: parsed.collegeId || null,
      },
    });
  }, { id });
}

export async function deleteSubject(id: string): Promise<ActionResult> {
  return run("SUBJECT_DELETE", async () => {
    await requireAdmin();
    await prisma.subject.delete({ where: { id } });
  }, { id });
}

export async function createClass(input: unknown): Promise<ActionResult> {
  return run("CLASS_CREATE", async () => {
    await requireAdmin();
    const parsed = classSchema.parse(input);
    const teacher = await prisma.user.findUnique({ where: { id: parsed.teacherId } });
    if (!teacher || teacher.role !== "TEACHER") {
      throw new Error("Selected account is not a teacher.");
    }
    await prisma.class.create({
      data: {
        subjectId: parsed.subjectId,
        teacherId: parsed.teacherId,
        section: parsed.section,
        semester: parsed.semester,
        academicYear: parsed.academicYear,
        schedule: parsed.schedule || null,
        room: parsed.room || null,
      },
    });
  }, { section: (input as { section?: string })?.section });
}

export async function updateClass(id: string, input: unknown): Promise<ActionResult> {
  return run("CLASS_UPDATE", async () => {
    await requireAdmin();
    const parsed = classSchema.parse(input);
    const teacher = await prisma.user.findUnique({ where: { id: parsed.teacherId } });
    if (!teacher || teacher.role !== "TEACHER") {
      throw new Error("Selected account is not a teacher.");
    }
    await prisma.class.update({
      where: { id },
      data: {
        subjectId: parsed.subjectId,
        teacherId: parsed.teacherId,
        section: parsed.section,
        semester: parsed.semester,
        academicYear: parsed.academicYear,
        schedule: parsed.schedule || null,
        room: parsed.room || null,
      },
    });
  }, { id });
}

export async function deleteClass(id: string): Promise<ActionResult> {
  return run("CLASS_DELETE", async () => {
    await requireAdmin();
    await prisma.class.delete({ where: { id } });
  }, { id });
}

export async function listTeachersForAssignment() {
  await requireAdmin();
  return prisma.user.findMany({
    where: { role: "TEACHER", isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, email: true },
  });
}
