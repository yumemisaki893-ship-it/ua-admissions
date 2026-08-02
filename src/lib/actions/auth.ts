"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations";
import { auth, signIn } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

export async function registerUser(input: unknown) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const email = parsed.data.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists. Please sign in instead." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.create({
    data: {
      email,
      name: parsed.data.name.trim(),
      passwordHash,
      role: "STUDENT",
      isVerified: true,
    },
  });

  return { ok: true };
}

export async function loginWithCredentials(input: unknown) {
  const parsed = z
    .object({ email: z.string().email(), password: z.string().min(1) })
    .safeParse(input);
  if (!parsed.success) return { error: "Invalid email or password." };

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase().trim() },
  });
  if (!user?.passwordHash) return { error: "Invalid email or password." };
  if (user.isActive === false) {
    return { error: "This account has been deactivated. Please contact the ICTU office." };
  }

  await recordAudit({
    action: "AUTH_LOGIN",
    entity: "user",
    entityId: user.id,
    details: { email: user.email, method: "credentials", role: user.role },
  });

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: user.role === "STUDENT" ? "/portal/dashboard" : "/admin",
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error; // NextAuth redirects by throwing; let it propagate.
    }
    return { error: "Invalid email or password." };
  }
  return { ok: true, redirectTo: user.role === "STUDENT" ? "/portal/dashboard" : "/admin" };
}

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function getOrCreateStudentProfileForOAuth() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "STUDENT") return null;

  let profile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) {
    profile = await prisma.studentProfile.create({
      data: {
        userId: session.user.id,
        firstName: session.user.name?.split(" ")[0] ?? "",
        lastName: session.user.name?.split(" ").slice(1).join(" ") || session.user.name || "",
        gender: "MALE",
        birthDate: new Date("2000-01-01"),
        address: "",
        city: "",
        province: "",
        contactNumber: "00000000000",
        guardianName: "",
      },
    });
  }
  return profile;
}
