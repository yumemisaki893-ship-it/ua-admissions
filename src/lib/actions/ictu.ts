"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

type ActionResult = { ok: true } | { ok: false; error: string };

const registrarSchema = z.object({
  name: z.string().trim().min(2, "Enter the registrar's full name.").max(120),
  email: z.string().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72),
});

async function requireIctu(): Promise<string> {
  const session = await auth();
  if (session?.user?.role !== "ICTU") {
    throw new Error("Only ICTU administrators can perform this action.");
  }
  return session.user.id;
}

async function run(label: string, action: () => Promise<void>, details?: unknown): Promise<ActionResult> {
  try {
    await action();
    await recordAudit({ action: label, entity: "user", details });
    revalidatePath("/admin/ictu/registrars");
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { ok: false, error: error.errors[0]?.message ?? "Please check your inputs and try again." };
    }
    return { ok: false, error: error instanceof Error ? error.message : "Something went wrong." };
  }
}

export async function createRegistrarAccount(input: unknown): Promise<ActionResult> {
  return run(
    "ADMIN_ACCOUNT_CREATE",
    async () => {
      await requireIctu();
      const parsed = registrarSchema.parse(input);
      const email = parsed.email.toLowerCase().trim();
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        throw new Error("An account with this email already exists.");
      }
      await prisma.user.create({
        data: {
          email,
          name: parsed.name,
          passwordHash: await bcrypt.hash(parsed.password, 12),
          role: "REGISTRAR",
          isVerified: true,
          isActive: true,
        },
      });
    },
    { email: (input as { email?: string })?.email, name: (input as { name?: string })?.name },
  );
}

export async function setRegistrarActive(userId: string, active: boolean): Promise<ActionResult> {
  return run(
    "ADMIN_ACCOUNT_TOGGLE_ACTIVE",
    async () => {
      await requireIctu();
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || user.role !== "REGISTRAR") {
        throw new Error("Registrar account not found.");
      }
      await prisma.user.update({ where: { id: userId }, data: { isActive: active } });
    },
    { userId, active },
  );
}
