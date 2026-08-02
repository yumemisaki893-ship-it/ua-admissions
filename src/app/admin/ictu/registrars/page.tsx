import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isIctuRole } from "@/lib/roles";
import { RegistrarsManager } from "@/components/admin/ictu/registrars-manager";

export const dynamic = "force-dynamic";

export default async function RegistrarsPage() {
  const session = await auth();
  if (!isIctuRole(session?.user?.role)) notFound();

  const registrars = await prisma.user.findMany({
    where: { role: "REGISTRAR" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
      createdAt: true,
      _count: { select: { auditLogs: true } },
    },
  });

  const lastLogins = await prisma.auditLog.findMany({
    where: {
      action: "AUTH_LOGIN",
      userId: { in: registrars.map((r) => r.id) },
    },
    orderBy: { createdAt: "desc" },
    take: 1000,
    select: { userId: true, createdAt: true, ip: true },
  });
  const loginMap = new Map<string, { lastAt: Date; ip: string | null }>();
  for (const log of lastLogins) {
    if (!loginMap.has(log.userId)) loginMap.set(log.userId, { lastAt: log.createdAt, ip: log.ip });
  }

  const rows = registrars.map((r) => ({
    id: r.id,
    name: r.name ?? "Unnamed",
    email: r.email,
    isActive: r.isActive,
    createdAt: r.createdAt,
    actionCount: r._count.auditLogs,
    lastLoginAt: loginMap.get(r.id)?.lastAt ?? null,
    lastLoginIp: loginMap.get(r.id)?.ip ?? null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-900">Registrar Accounts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create registrar accounts and manage their access. Every registrar action is recorded and
          visible in the audit trail.
        </p>
      </div>

      <RegistrarsManager registrars={rows} />
    </div>
  );
}
