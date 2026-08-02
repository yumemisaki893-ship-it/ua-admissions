"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { isSupervisor, isIctuRole } from "@/lib/roles";

type ActionResult = { ok: true } | { ok: false; error: string };

const accountSchema = z.object({
  name: z.string().trim().min(2, "Enter the account holder's full name.").max(120),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.").max(72),
  role: z.enum(["SUPER_ADMIN", "ICTU_SUPERVISOR", "ICTU_STAFF", "REGISTRAR", "ADMISSIONS_OFFICER", "TEACHER"]),
});

// Which roles each ICTU class may create. Supervisor-only roles are checked in createAccount.
const STAFF_CAN_CREATE = new Set(["REGISTRAR", "ADMISSIONS_OFFICER", "TEACHER"]);

// Only ICTU supervisors may delete accounts, and only non-supervisor accounts.
const SUPERVISOR_CAN_DELETE = new Set(["SUPER_ADMIN", "ICTU_STAFF", "REGISTRAR", "ADMISSIONS_OFFICER", "TEACHER"]);

async function requireIctu(): Promise<{ id: string; role: string }> {
  const session = await auth();
  if (!isIctuRole(session?.user?.role)) {
    throw new Error("Only ICTU accounts can perform this action.");
  }
  return { id: session!.user!.id, role: session!.user!.role! };
}

async function run(label: string, action: () => Promise<void>, details?: unknown): Promise<ActionResult> {
  try {
    await action();
    await recordAudit({ action: label, entity: "user", details });
    revalidatePath("/admin/ictu/accounts");
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

export async function createAccount(input: unknown): Promise<ActionResult> {
  return run(
    "ACCOUNT_CREATE",
    async () => {
      const { role: actorRole } = await requireIctu();
      const parsed = accountSchema.parse(input);

      if (parsed.role === "SUPER_ADMIN" || parsed.role === "ICTU_SUPERVISOR") {
        if (!isSupervisor(actorRole)) {
          throw new Error("Only an ICTU supervisor may create developer or supervisor accounts.");
        }
      } else if (!STAFF_CAN_CREATE.has(parsed.role)) {
        throw new Error("You are not allowed to create this type of account.");
      }

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
          role: parsed.role,
          isVerified: true,
          isActive: true,
        },
      });
    },
    {
      email: (input as { email?: string })?.email,
      name: (input as { name?: string })?.name,
      role: (input as { role?: string })?.role,
    },
  );
}

export async function deleteAccount(userId: string): Promise<ActionResult> {
  const target = await prisma.user.findUnique({ where: { id: userId } });
  return run(
    "ACCOUNT_DELETE",
    async () => {
      const { id: actorId, role: actorRole } = await requireIctu();
      if (!isSupervisor(actorRole)) {
        throw new Error("Only an ICTU supervisor may delete accounts.");
      }
      if (!target) throw new Error("Account not found.");
      if (!SUPERVISOR_CAN_DELETE.has(target.role)) {
        throw new Error("This account cannot be deleted.");
      }
      if (target.id === actorId) throw new Error("You cannot delete your own account.");
      await prisma.user.delete({ where: { id: userId } });
    },
    { userId, email: target?.email },
  );
}

export async function setAccountActive(userId: string, active: boolean): Promise<ActionResult> {
  return run(
    "ACCOUNT_TOGGLE_ACTIVE",
    async () => {
      const { id: actorId, role: actorRole } = await requireIctu();
      const target = await prisma.user.findUnique({ where: { id: userId } });
      if (!target) throw new Error("Account not found.");
      const managed = SUPERVISOR_CAN_DELETE.has(target.role) || target.role === "ICTU_SUPERVISOR";
      if (!managed) throw new Error("This account cannot be managed here.");
      if (!isSupervisor(actorRole) && target.role === "ICTU_SUPERVISOR") {
        throw new Error("Only an ICTU supervisor may manage supervisor accounts.");
      }
      if (target.id === actorId) {
        throw new Error("You cannot change your own account status.");
      }
      await prisma.user.update({ where: { id: userId }, data: { isActive: active } });
    },
    { userId, active },
  );
}

export async function listManagedAccounts() {
  const { role } = await requireIctu();
  const accounts = await prisma.user.findMany({
    where: { role: { not: "STUDENT" } },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: { select: { auditLogs: true } },
    },
  });
  const lastLogins = await prisma.auditLog.findMany({
    where: { action: "AUTH_LOGIN", userId: { in: accounts.map((a) => a.id) } },
    orderBy: { createdAt: "desc" },
    take: 1000,
    select: { userId: true, createdAt: true },
  });
  const loginMap = new Map<string, Date>();
  for (const log of lastLogins) {
    if (!loginMap.has(log.userId)) loginMap.set(log.userId, log.createdAt);
  }
  return {
    actorRole: role,
    canDelete: isSupervisor(role),
    canCreateDevelopers: isSupervisor(role),
    accounts: accounts.map((a) => ({
      id: a.id,
      name: a.name ?? "Unnamed",
      email: a.email,
      role: a.role,
      isActive: a.isActive,
      createdAt: a.createdAt,
      actionCount: a._count.auditLogs,
      lastLoginAt: loginMap.get(a.id) ?? null,
      deletable: isSupervisor(role) && SUPERVISOR_CAN_DELETE.has(a.role),
      manageable: SUPERVISOR_CAN_DELETE.has(a.role) || a.role === "ICTU_SUPERVISOR",
    })),
  };
}

export async function listTeachers() {
  await requireIctu();
  const teachers = await prisma.user.findMany({
    where: { role: "TEACHER" },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
      _count: { select: { classes: true } },
    },
  });
  return teachers;
}

export async function listRegistrars() {
  await requireIctu();
  return prisma.user.findMany({
    where: { role: "REGISTRAR" },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, isActive: true, createdAt: true },
  });
}
