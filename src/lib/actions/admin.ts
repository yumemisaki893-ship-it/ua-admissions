"use server";

import { prisma } from "@/lib/prisma";
import {
  applicationStatusUpdateSchema,
  courseSchema,
  collegeSchema,
  newsSchema,
} from "@/lib/validations";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

const ADMIN_ROLES = ["SUPER_ADMIN", "REGISTRAR", "ADMISSIONS_OFFICER"] as const;

type ActionResult = { ok: true } | { ok: false; error: string };

async function requireAdmin(): Promise<string> {
  const session = await auth();
  const role = session?.user?.role;
  if (!role || !(ADMIN_ROLES as readonly string[]).includes(role)) {
    throw new Error("You are not authorized to perform this action.");
  }
  return session!.user!.id;
}

async function run(action: () => Promise<void>, pathToRevalidate?: string): Promise<ActionResult> {
  try {
    await action();
    if (pathToRevalidate) revalidatePath(pathToRevalidate);
    return { ok: true };
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return { ok: false, error: "Please check your inputs and try again." };
    }
    return { ok: false, error: error instanceof Error ? error.message : "Something went wrong." };
  }
}

export async function updateApplicationStatus(input: unknown): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    const parsed = applicationStatusUpdateSchema.parse(input);
    const { applicationId } = input as { applicationId: string };
    const data =
      parsed.status === "ACCEPTED" || parsed.status === "REJECTED"
        ? { status: parsed.status, remarks: parsed.remarks || null, reviewedAt: new Date() }
        : { status: parsed.status, remarks: parsed.remarks || null };

    await prisma.application.update({ where: { id: applicationId }, data });

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      select: { userId: true, referenceNumber: true },
    });
    if (application) {
      await prisma.notification.create({
        data: {
          userId: application.userId,
          title: "Application status updated",
          message:
            parsed.status === "ACCEPTED"
              ? "Congratulations! Your application has been qualified. Please contact the Registrar for enrollment."
              : parsed.status === "REJECTED"
                ? "We regret to inform you that your application was not qualified for the program."
                : `Your application (${application.referenceNumber ?? "N/A"}) is now ${parsed.status.replace("_", " ").toLowerCase()}.`,
        },
      });
    }
  }, "/admin/applicants");
}

export async function createNews(input: unknown): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    const parsed = newsSchema.parse(input);
    const slug = slugify(parsed.title);
    await prisma.news.create({
      data: {
        title: parsed.title,
        slug,
        excerpt: parsed.excerpt || null,
        content: parsed.content ?? { type: "doc", content: [] },
        category: parsed.category,
        imageUrl: parsed.imageUrl || null,
        published: parsed.published,
        publishedAt: parsed.published ? new Date() : null,
      },
    });
  }, "/news");
}

export async function updateNews(id: string, input: unknown): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    const parsed = newsSchema.parse(input);
    await prisma.news.update({
      where: { id },
      data: {
        title: parsed.title,
        excerpt: parsed.excerpt || null,
        content: parsed.content ?? { type: "doc", content: [] },
        category: parsed.category,
        imageUrl: parsed.imageUrl || null,
        published: parsed.published,
        publishedAt: parsed.published ? new Date() : undefined,
      },
    });
  }, "/news");
}

export async function deleteNews(id: string): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    await prisma.news.delete({ where: { id } });
  }, "/news");
}

export async function updateSiteContent(key: string, content: unknown): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    const record = await prisma.siteContent.findUnique({ where: { key } });
    if (record) {
      await prisma.siteContent.update({ where: { key }, data: { content: content as object } });
    } else {
      await prisma.siteContent.create({ data: { key, content: content as object } });
    }
  }, "/about");
}

export async function createCollege(input: unknown): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    const parsed = collegeSchema.parse(input);
    await prisma.college.create({
      data: {
        code: parsed.code,
        name: parsed.name,
        description: parsed.description,
        slug: slugify(parsed.name),
      },
    });
  }, "/academics");
}

export async function updateCollege(id: string, input: unknown): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    const parsed = collegeSchema.parse(input);
    await prisma.college.update({
      where: { id },
      data: {
        code: parsed.code,
        name: parsed.name,
        description: parsed.description,
        slug: slugify(parsed.name),
      },
    });
  }, "/academics");
}

export async function deleteCollege(id: string): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    await prisma.college.delete({ where: { id } });
  }, "/academics");
}

export async function createCourse(input: unknown): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    const parsed = courseSchema.parse(input);
    await prisma.course.create({
      data: {
        code: parsed.code,
        name: parsed.name,
        slug: slugify(`${parsed.code}-${parsed.name}`),
        description: parsed.description,
        durationYears: parsed.durationYears,
        careerOpportunities: parsed.careerOpportunities ?? [],
        collegeId: parsed.collegeId,
      },
    });
  }, "/academics");
}

export async function updateCourse(id: string, input: unknown): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    const parsed = courseSchema.parse(input);
    await prisma.course.update({
      where: { id },
      data: {
        code: parsed.code,
        name: parsed.name,
        description: parsed.description,
        durationYears: parsed.durationYears,
        careerOpportunities: parsed.careerOpportunities ?? [],
        collegeId: parsed.collegeId,
      },
    });
  }, "/academics");
}

export async function deleteCourse(id: string): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    await prisma.course.delete({ where: { id } });
  }, "/academics");
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;
  await prisma.notification.updateMany({
    where: { id: notificationId, userId: session.user.id },
    data: { read: true },
  });
}

export async function markAllNotificationsRead(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;
  await prisma.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  });
}
