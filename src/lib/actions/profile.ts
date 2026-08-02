"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { personalInfoSchema } from "@/lib/validations";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateProfile(input: unknown): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "STUDENT") {
    return { ok: false, error: "You must be signed in as a student." };
  }

  const parsed = personalInfoSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const data = parsed.data;
  const name = [data.firstName, data.middleName, data.lastName, data.suffix]
    .filter(Boolean)
    .join(" ");

  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (profile) {
      await prisma.studentProfile.update({
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
      await prisma.studentProfile.create({
        data: {
          userId: session.user.id,
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

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    });

    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong while saving your profile." };
  }
}

export async function updateAccountDetails(input: {
  name: string;
  email: string;
}): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "STUDENT") {
    return { ok: false, error: "You must be signed in as a student." };
  }

  const name = input.name.trim();
  if (name.length < 2) return { ok: false, error: "Please enter your full name." };

  const email = input.email.trim().toLowerCase();
  if (!email.includes("@")) return { ok: false, error: "Please enter a valid email address." };

  try {
    const existing = await prisma.user.findFirst({
      where: { email, id: { not: session.user.id } },
      select: { id: true },
    });
    if (existing) {
      return { ok: false, error: "That email address is already in use." };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name, email },
    });

    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong while saving your account." };
  }
}

export async function getMyProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [user, profile] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, select: { email: true, name: true } }),
    prisma.studentProfile.findUnique({ where: { userId: session.user.id } }),
  ]);

  return {
    email: user?.email ?? "",
    name: user?.name ?? "",
    profile: profile
      ? {
          firstName: profile.firstName,
          middleName: profile.middleName ?? "",
          lastName: profile.lastName,
          suffix: profile.suffix ?? "",
          gender: profile.gender,
          birthDate: profile.birthDate.toISOString().slice(0, 10),
          birthplace: profile.birthplace ?? "",
          address: profile.address,
          city: profile.city,
          province: profile.province,
          zipCode: profile.zipCode ?? "",
          contactNumber: profile.contactNumber,
          guardianName: profile.guardianName,
          guardianContact: profile.guardianContact ?? "",
        }
      : null,
  };
}
