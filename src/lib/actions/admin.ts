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
import { recordAudit } from "@/lib/audit";
import { SETTING_ADMISSION_OPEN, SETTING_APPLICATION_FEE } from "@/lib/site-config";
import type { Prisma } from "@prisma/client";

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

async function run(
  label: string,
  action: () => Promise<void>,
  pathToRevalidate?: string,
  details?: unknown,
): Promise<ActionResult> {
  try {
    await action();
    await recordAudit({ action: label, details });
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
  return run(
    "APPLICATION_STATUS_UPDATE",
    async () => {
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
    },
    "/admin/applicants",
    { applicationId: (input as { applicationId?: string })?.applicationId, status: (input as { status?: string })?.status },
  );
}

export async function createNews(input: unknown): Promise<ActionResult> {
  return run(
    "NEWS_CREATE",
    async () => {
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
    },
    "/news",
    { title: (input as { title?: string })?.title },
  );
}

export async function updateNews(id: string, input: unknown): Promise<ActionResult> {
  return run(
    "NEWS_UPDATE",
    async () => {
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
    },
    "/news",
    { id, title: (input as { title?: string })?.title },
  );
}

export async function deleteNews(id: string): Promise<ActionResult> {
  return run("NEWS_DELETE", async () => {
    await requireAdmin();
    await prisma.news.delete({ where: { id } });
  }, "/news", { id });
}

export async function updateSiteContent(key: string, content: unknown): Promise<ActionResult> {
  return run("SITE_CONTENT_UPDATE", async () => {
    await requireAdmin();
    const record = await prisma.siteContent.findUnique({ where: { key } });
    if (record) {
      await prisma.siteContent.update({ where: { key }, data: { content: content as object } });
    } else {
      await prisma.siteContent.create({ data: { key, content: content as object } });
    }
  }, "/about", { key });
}

export async function createCollege(input: unknown): Promise<ActionResult> {
  return run("COLLEGE_CREATE", async () => {
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
  }, "/academics", { code: (input as { code?: string })?.code });
}

export async function updateCollege(id: string, input: unknown): Promise<ActionResult> {
  return run("COLLEGE_UPDATE", async () => {
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
  }, "/academics", { id });
}

export async function deleteCollege(id: string): Promise<ActionResult> {
  return run("COLLEGE_DELETE", async () => {
    await requireAdmin();
    await prisma.college.delete({ where: { id } });
  }, "/academics", { id });
}

export async function createCourse(input: unknown): Promise<ActionResult> {
  return run("COURSE_CREATE", async () => {
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
  }, "/academics", { code: (input as { code?: string })?.code });
}

export async function updateCourse(id: string, input: unknown): Promise<ActionResult> {
  return run("COURSE_UPDATE", async () => {
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
  }, "/academics", { id });
}

export async function deleteCourse(id: string): Promise<ActionResult> {
  return run("COURSE_DELETE", async () => {
    await requireAdmin();
    await prisma.course.delete({ where: { id } });
  }, "/academics", { id });
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

export async function getSettings() {
  const rows = await prisma.siteContent.findMany({
    where: { key: { in: [SETTING_ADMISSION_OPEN, SETTING_APPLICATION_FEE] } },
    select: { key: true, content: true },
  });
  const map = new Map(rows.map((r) => [r.key, r.content]));
  const admissionOpen = map.get(SETTING_ADMISSION_OPEN);
  const fee = map.get(SETTING_APPLICATION_FEE);

  return {
    admissionOpen: admissionOpen === undefined ? true : Boolean(admissionOpen),
    applicationFee: typeof fee === "number" && fee > 0 ? fee : null,
  };
}

export async function updateSettings(input: {
  admissionOpen: boolean;
  applicationFee: string;
}): Promise<ActionResult> {
  return run("SETTINGS_UPDATE", async () => {
    await requireAdmin();
    const fee = Number(input.applicationFee);
    if (!Number.isFinite(fee) || fee <= 0) {
      throw new Error("Please enter a valid application fee in Philippine Pesos.");
    }

    const upsert = async (key: string, content: Prisma.InputJsonValue) => {
      await prisma.siteContent.upsert({
        where: { key },
        create: { key, content },
        update: { content },
      });
    };

    await upsert(SETTING_ADMISSION_OPEN, input.admissionOpen);
    await upsert(SETTING_APPLICATION_FEE, fee);
    revalidatePath("/admin/settings");
    revalidatePath("/apply");
    revalidatePath("/portal/apply");
  }, undefined, input);
}

export async function sendAnnouncement(input: {
  title: string;
  message: string;
}): Promise<ActionResult> {
  return run("ANNOUNCEMENT_SEND", async () => {
    await requireAdmin();
    const title = input.title.trim();
    const message = input.message.trim();
    if (title.length < 3) throw new Error("Please enter a short title for the announcement.");
    if (message.length < 10) throw new Error("Please write an announcement of at least 10 characters.");

    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: { id: true },
    });

    if (students.length === 0) throw new Error("There are no student accounts to notify.");

    await prisma.notification.createMany({
      data: students.map((s) => ({
        userId: s.id,
        title,
        message,
      })),
    });
  }, undefined, { title: input.title });
}
