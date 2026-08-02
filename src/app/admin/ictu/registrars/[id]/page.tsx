import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Fingerprint, LogIn, Activity, Monitor } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isIctuRole } from "@/lib/roles";
import { formatDate, formatDateTime } from "@/lib/utils";
import { actionLabel } from "@/components/admin/ictu/ictu-dashboard";

export const dynamic = "force-dynamic";

export default async function RegistrarFootprintPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!isIctuRole(session?.user?.role)) notFound();

  const registrar = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!registrar || registrar.role !== "REGISTRAR") notFound();

  const [totalActions, loginCount, logins, logs, ipSummary] = await Promise.all([
    prisma.auditLog.count({ where: { userId: params.id } }),
    prisma.auditLog.count({ where: { userId: params.id, action: "AUTH_LOGIN" } }),
    prisma.auditLog.findMany({
      where: { userId: params.id, action: "AUTH_LOGIN" },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { createdAt: true, ip: true },
    }),
    prisma.auditLog.findMany({
      where: { userId: params.id },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        action: true,
        entity: true,
        entityId: true,
        details: true,
        ip: true,
        createdAt: true,
      },
    }),
    prisma.auditLog.groupBy({
      by: ["ip"],
      where: { userId: params.id, ip: { not: null } },
      _count: { ip: true },
      orderBy: { _count: { ip: "desc" } },
      take: 5,
    }),
  ]);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/ictu/registrars"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-crimson-700 transition-colors hover:text-crimson-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Registrars
      </Link>

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-semibold text-slate-900">{registrar.name}</h1>
              <Badge variant={registrar.isActive ? "success" : "secondary"}>
                {registrar.isActive ? "Active" : "Deactivated"}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{registrar.email}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Account created {formatDate(registrar.createdAt)} · Last updated {formatDate(registrar.updatedAt)}
            </p>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="font-display text-3xl font-semibold text-slate-900">{totalActions}</p>
              <p className="text-xs text-muted-foreground">Total actions</p>
            </div>
            <div>
              <p className="font-display text-3xl font-semibold text-slate-900">{loginCount}</p>
              <p className="text-xs text-muted-foreground">Sign ins</p>
            </div>
            <div>
              <p className="font-display text-3xl font-semibold text-slate-900">{ipSummary.length}</p>
              <p className="text-xs text-muted-foreground">Devices / IPs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Fingerprint className="h-4 w-4 text-crimson-700" /> Digital Footprint Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            {logs.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No recorded activity for this account yet.
              </p>
            )}
            <ol className="relative space-y-6 border-l-2 border-slate-100 pl-6">
              {logs.map((log) => (
                <li key={log.id} className="relative">
                  <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-crimson-700 ring-1 ring-crimson-200" />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-900">{actionLabel(log.action)}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(log.createdAt)}</p>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {log.entity ?? "system"}
                    {log.entityId ? ` · ${log.entityId.slice(0, 24)}` : ""}
                    {log.ip ? ` · IP ${log.ip}` : ""}
                  </p>
                  {log.details && (
                    <pre className="mt-1.5 overflow-x-auto rounded-lg bg-slate-50 p-2 text-[10px] leading-relaxed text-slate-500">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  )}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <LogIn className="h-4 w-4 text-crimson-700" /> Recent Sign Ins
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {logins.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">No sign-ins recorded.</p>
              )}
              {logins.map((login, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm"
                >
                  <span className="text-slate-600">{formatDateTime(login.createdAt)}</span>
                  <span className="font-mono text-xs text-muted-foreground">{login.ip ?? "—"}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Monitor className="h-4 w-4 text-crimson-700" /> Frequently Used IPs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {ipSummary.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">No IP data recorded.</p>
              )}
              {ipSummary.map((ip) => (
                <div
                  key={ip.ip}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
                >
                  <span className="font-mono text-xs text-slate-600">{ip.ip}</span>
                  <Badge className="bg-slate-200 text-slate-700">{ip._count?.ip ?? 0}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4 text-crimson-700" /> Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">First recorded action</span>
                <span className="font-medium text-slate-900">
                  {logs.length > 0 ? formatDateTime(logs[logs.length - 1].createdAt) : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Most recent action</span>
                <span className="font-medium text-slate-900">
                  {logs.length > 0 ? formatDateTime(logs[0].createdAt) : "—"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
