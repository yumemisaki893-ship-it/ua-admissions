"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { recordAudit } from "@/lib/audit";
import { defaultExternalLinks, externalLinkCategories } from "@/lib/external-links";
import { isContentManager } from "@/lib/roles";

type ActionResult = { ok: true } | { ok: false; error: string };

const linkSchema = z.object({
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers and dashes."),
  label: z.string().min(2).max(120),
  url: z.string().url("Enter a valid URL (include https://)."),
  category: z.enum(externalLinkCategories),
  description: z.string().max(240).optional().nullable(),
  order: z.coerce.number().int().min(0).max(999),
  active: z.coerce.boolean().default(true),
});

async function requireContentManager(): Promise<void> {
  const session = await auth();
  if (!isContentManager(session?.user?.role)) {
    throw new Error("Only ICTU staff and the administrator may edit site links.");
  }
}

async function run(action: () => Promise<void>): Promise<ActionResult> {
  try {
    await action();
    revalidatePath("/admin/links");
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { ok: false, error: error.errors[0]?.message ?? "Please check your inputs and try again." };
    }
    return { ok: false, error: error instanceof Error ? error.message : "Something went wrong." };
  }
}

export async function listExternalLinks() {
  await requireContentManager();
  return prisma.externalLink.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
    select: {
      id: true,
      slug: true,
      label: true,
      url: true,
      category: true,
      description: true,
      order: true,
      active: true,
    },
  });
}

export async function createExternalLink(input: unknown): Promise<ActionResult> {
  await requireContentManager();
  const data = linkSchema.parse(input);
  return run(async () => {
    await prisma.externalLink.create({ data });
    await recordAudit({ action: "EXTERNAL_LINK_CREATE", entity: "ExternalLink", entityId: data.slug, details: { slug: data.slug, label: data.label, category: data.category } });
  });
}

export async function updateExternalLink(id: string, input: unknown): Promise<ActionResult> {
  await requireContentManager();
  const data = linkSchema.parse(input);
  return run(async () => {
    await prisma.externalLink.update({ where: { id }, data });
    await recordAudit({ action: "EXTERNAL_LINK_UPDATE", entity: "ExternalLink", entityId: data.slug, details: { id, slug: data.slug, label: data.label, category: data.category, active: data.active } });
  });
}

export async function deleteExternalLink(id: string): Promise<ActionResult> {
  await requireContentManager();
  return run(async () => {
    await prisma.externalLink.delete({ where: { id } });
    await recordAudit({ action: "EXTERNAL_LINK_DELETE", entity: "ExternalLink", entityId: id, details: { id } });
  });
}

export async function restoreDefaultLinks(): Promise<ActionResult> {
  await requireContentManager();
  return run(async () => {
    await prisma.externalLink.deleteMany();
    await prisma.externalLink.createMany({ data: defaultExternalLinks() });
    await recordAudit({ action: "EXTERNAL_LINK_RESTORE_DEFAULTS" });
  });
}
