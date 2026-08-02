"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  personalInfoSchema,
  courseSelectionSchema,
  documentTypeSchema,
  uploadSchema,
} from "@/lib/validations";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { generateReferenceNumber } from "@/lib/utils";
import { revalidatePath } from "next/cache";

async function requireStudent() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "STUDENT") {
    throw new Error("You must be signed in as a student.");
  }
  return session.user;
}

export async function getMyApplication() {
  const user = await requireStudent();
  return prisma.application.findFirst({
    where: { userId: user.id },
    include: {
      course: { include: { college: true } },
      studentProfile: true,
      documents: true,
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCoursesForApplication() {
  return prisma.course.findMany({
    include: { college: { select: { id: true, code: true, name: true, sortOrder: true } } },
    orderBy: [{ college: { sortOrder: "asc" } }, { code: "asc" }],
  });
}

export async function savePersonalInfo(input: unknown) {
  const user = await requireStudent();
  const parsed = personalInfoSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your inputs." };
  }

  const data = parsed.data;
  let profile = await prisma.studentProfile.findUnique({ where: { userId: user.id } });

  if (profile) {
    profile = await prisma.studentProfile.update({
      where: { id: profile.id },
      data: {
        firstName: data.firstName,
        middleName: data.middleName || null,
        lastName: data.lastName,
        suffix: data.suffix || null,
        gender: data.gender,
        birthDate: new Date(data.birthDate),
        birthplace: data.birthplace || null,
        address: data.address,
        city: data.city,
        province: data.province,
        zipCode: data.zipCode || null,
        contactNumber: data.contactNumber,
        guardianName: data.guardianName,
        guardianContact: data.guardianContact || null,
      },
    });
  } else {
    profile = await prisma.studentProfile.create({
      data: {
        userId: user.id,
        firstName: data.firstName,
        middleName: data.middleName || null,
        lastName: data.lastName,
        suffix: data.suffix || null,
        gender: data.gender,
        birthDate: new Date(data.birthDate),
        birthplace: data.birthplace || null,
        address: data.address,
        city: data.city,
        province: data.province,
        zipCode: data.zipCode || null,
        contactNumber: data.contactNumber,
        guardianName: data.guardianName,
        guardianContact: data.guardianContact || null,
      },
    });
  }

  const draft = await findOrCreateDraft(user.id, profile.id);
  await prisma.application.update({
    where: { id: draft.id },
    data: { studentProfileId: profile.id },
  });

  revalidatePath("/portal/apply");
  return { ok: true };
}

async function findOrCreateDraft(userId: string, studentProfileId: string) {
  const existing = await prisma.application.findFirst({ where: { userId, status: "DRAFT" } });
  if (existing) return existing;
  return prisma.application.create({
    data: { userId, studentProfileId, courseId: "" },
  });
}

export async function saveCourseSelection(input: unknown) {
  const user = await requireStudent();
  const parsed = courseSelectionSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Please select a course to continue." };
  }
  const profile = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
  if (!profile) return { error: "Please complete your personal information first." };

  const course = await prisma.course.findUnique({ where: { id: parsed.data.courseId } });
  if (!course) return { error: "The selected course was not found." };

  const draft = await findOrCreateDraft(user.id, profile.id);
  await prisma.application.update({
    where: { id: draft.id },
    data: { courseId: course.id },
  });
  return { ok: true };
}

export async function uploadDocument(input: {
  applicationId?: string;
  type: string;
  fileName: string;
  mimeType: string;
  dataUrl: string;
}) {
  const user = await requireStudent();
  const type = documentTypeSchema.parse(input.type);

  const parsed = uploadSchema.safeParse({
    fileName: input.fileName,
    mimeType: input.mimeType,
    sizeBytes: Math.round((input.dataUrl.length - input.dataUrl.indexOf(",") - 1) * 0.75),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid file." };
  }
  if (!input.dataUrl.startsWith("data:")) {
    return { error: "Invalid file payload." };
  }

  const profile = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
  if (!profile) return { error: "Please complete your personal information first." };
  const draft = await findOrCreateDraft(user.id, profile.id);

  const buffer = Buffer.from(input.dataUrl.split(",")[1] ?? "", "base64");
  const result = await uploadToCloudinary(buffer, parsed.data.mimeType, "ua-admissions/documents");

  const existing = await prisma.document.findFirst({
    where: { applicationId: draft.id, type },
  });
  if (existing) {
    await prisma.document.update({
      where: { id: existing.id },
      data: {
        fileName: parsed.data.fileName,
        mimeType: parsed.data.mimeType,
        sizeBytes: buffer.length,
        url: result.url,
        publicId: result.publicId ?? null,
      },
    });
  } else {
    await prisma.document.create({
      data: {
        applicationId: draft.id,
        type,
        fileName: parsed.data.fileName,
        mimeType: parsed.data.mimeType,
        sizeBytes: buffer.length,
        url: result.url,
        publicId: result.publicId ?? null,
      },
    });
  }

  revalidatePath("/portal/apply");
  return { ok: true };
}

export async function submitApplication() {
  const user = await requireStudent();
  const profile = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
  if (!profile) return { error: "Please complete your personal information first." };

  const application = await prisma.application.findFirst({
    where: { userId: user.id, status: "DRAFT" },
    include: { documents: true, course: true },
  });
  if (!application) return { error: "No application draft found." };
  if (!application.courseId) return { error: "Please select a course." };
  if (application.documents.length < 3) {
    return { error: "Please upload all three (3) required documents." };
  }
  if (!application.applicationFeePaid) {
    return { error: "Please settle the application fee first." };
  }

  const now = new Date();
  const count = await prisma.application.count({ where: { submittedAt: { not: null } } });
  const referenceNumber = generateReferenceNumber(now.getFullYear(), count + 1);

  await prisma.application.update({
    where: { id: application.id },
    data: { status: "PENDING", referenceNumber, submittedAt: now },
  });

  await prisma.notification.create({
    data: {
      userId: user.id,
      title: "Application submitted",
      message: `Your application (${referenceNumber}) has been submitted. You can track its status on your dashboard.`,
    },
  });

  revalidatePath("/portal/dashboard");
  return { ok: true, referenceNumber };
}

export async function hasSubmittedApplication() {
  const user = await requireStudent();
  const app = await prisma.application.findFirst({
    where: { userId: user.id, status: { not: "DRAFT" } },
  });
  return Boolean(app);
}
