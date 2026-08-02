import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Fingerprint } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { hasOversight, oversightScope } from "@/lib/roles";
import { formatDateTime } from "@/lib/utils";
import { actionLabel, describeAudit } from "@/lib/audit-display";
import { AuditFilters } from "@/components/admin/ictu/audit-filters";
import { roleLabel } from "@/lib/roles";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

export default async function AuditTrailPage({
  searchParams,
}: {
  searchParams: { userId?: string; action?: string; page?: string };
}) {
  const session = await auth();
  if (!session?.user?.id || !hasOversight(session.user.role)) redirect("/admin");

  const scopedRoles = oversightScope(session.user.role);

  const userId = searchParams.userId;
  const action = searchParams.action;
  const page = Math.max(1, Number(searchParams.page) || 1);

  const where = {
    ...(userId ? { userId } : {}),
    ...(action ? { action } : {}),
    ...(scopedRoles ? { userRole: { in: scopedRoles } } : {}),
  };

  const [logs, total, users, actions] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        action: true,
        userName: true,
        userRole: true,
        entity: true,
        entityId: true,
        details: true,
        ip: true,
        createdAt: true,
      },
    }),
    prisma.auditLog.count({ where }),
    prisma.user.findMany({
      where: { role: { in: scopedRoles as ("SUPER_ADMIN" | "ICTU_SUPERVISOR" | "ICTU_STAFF" | "REGISTRAR" | "ADMISSIONS_OFFICER" | "TEACHER" | "STUDENT")[] } },
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true, role: true },
    }),
    prisma.auditLog.groupBy({
      by: ["action"],
      where: scopedRoles ? { userRole: { in: scopedRoles } } : undefined,
      orderBy: { _count: { action: "desc" } },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const makeHref = (p: number) =>
    `/admin/audit?${new URLSearchParams({
      ...(userId ? { userId } : {}),
      ...(action ? { action } : {}),
      page: String(p),
    }).toString()}`;
  const prevHref = makeHref(page - 1);
  const nextHref = makeHref(page + 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-slate-900">
          <Fingerprint className="h-6 w-6 text-crimson-700" /> Footprint Oversight
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Detailed activity trail — grade changes, class enrollments, and every administrative action,
          including who performed it and the student involved. You can see your own records and those
          of everyone below you in the oversight chain.
        </p>
      </div>

      <AuditFilters
        basePath="/admin/audit"
        users={users.map((u) => ({ id: u.id, name: `${u.name ?? "Unnamed"} (${roleLabel(u.role)})` }))}
        actions={actions.map((a) => ({ value: a.action, label: actionLabel(a.action) }))}
        selectedUserId={userId}
        selectedAction={action}
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">When</th>
                  <th className="px-5 py-3 font-medium">By</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                  <th className="min-w-[260px] px-5 py-3 font-medium">Details</th>
                  <th className="px-5 py-3 font-medium">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                      No audit entries match the current filters.
                    </td>
                  </tr>
                )}
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                    <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-900">{log.userName ?? "System"}</p>
                      <p className="text-xs text-muted-foreground">{log.userRole ? roleLabel(log.userRole) : "System"}</p>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="secondary">{actionLabel(log.action)}</Badge>
                    </td>
                    <td className="px-5 py-3 text-slate-700">
                      {describeAudit(log)}
                      {log.entityId ? (
                        <span className="ml-1 font-mono text-[11px] text-slate-400">#{log.entityId.slice(0, 10)}</span>
                      ) : null}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 font-mono text-xs text-muted-foreground">
                      {log.ip ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
            <p className="text-xs text-muted-foreground">
              Page {page} of {totalPages} · {total.toLocaleString()} entries
            </p>
            <div className="flex items-center gap-2">
              <Link
                href={page > 1 ? prevHref : "#"}
                aria-disabled={page <= 1}
                className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  page > 1
                    ? "border-slate-200 text-slate-700 hover:border-amber-300"
                    : "pointer-events-none border-slate-100 text-slate-300"
                }`}
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Previous
              </Link>
              <Link
                href={page < totalPages ? nextHref : "#"}
                aria-disabled={page >= totalPages}
                className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  page < totalPages
                    ? "border-slate-200 text-slate-700 hover:border-amber-300"
                    : "pointer-events-none border-slate-100 text-slate-300"
                }`}
              >
                Next <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
