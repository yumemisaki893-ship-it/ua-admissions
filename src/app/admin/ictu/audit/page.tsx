import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Fingerprint } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { actionLabel } from "@/components/admin/ictu/ictu-dashboard";
import { AuditFilters } from "@/components/admin/ictu/audit-filters";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

export default async function AuditTrailPage({
  searchParams,
}: {
  searchParams: { userId?: string; action?: string; page?: string };
}) {
  const session = await auth();
  if (session?.user?.role !== "ICTU") notFound();

  const userId = searchParams.userId;
  const action = searchParams.action;
  const page = Math.max(1, Number(searchParams.page) || 1);

  const where = {
    ...(userId ? { userId } : {}),
    ...(action ? { action } : {}),
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
        ip: true,
        createdAt: true,
      },
    }),
    prisma.auditLog.count({ where }),
    prisma.user.findMany({
      where: { role: { in: ["REGISTRAR", "SUPER_ADMIN", "ADMISSIONS_OFFICER", "ICTU"] } },
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true, role: true },
    }),
    prisma.auditLog.groupBy({
      by: ["action"],
      orderBy: { _count: { action: "desc" } },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const prevHref = `/admin/ictu/audit?${new URLSearchParams({ ...(userId ? { userId } : {}), ...(action ? { action } : {}), page: String(page - 1) }).toString()}`;
  const nextHref = `/admin/ictu/audit?${new URLSearchParams({ ...(userId ? { userId } : {}), ...(action ? { action } : {}), page: String(page + 1) }).toString()}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-slate-900">
          <Fingerprint className="h-6 w-6 text-crimson-700" /> Audit Trail
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every sign-in and administrative action recorded across the system, with device IPs.
        </p>
      </div>

      <AuditFilters
        users={users.map((u) => ({ id: u.id, name: `${u.name ?? "Unnamed"} (${u.role.replace("_", " ")})` }))}
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
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                  <th className="px-5 py-3 font-medium">Target</th>
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
                      <Link
                        href={log.userRole === "REGISTRAR" && log.userName ? `/admin/ictu/registrars` : "#"}
                        className="font-medium text-slate-900 hover:text-crimson-700"
                      >
                        {log.userName ?? "System"}
                      </Link>
                      <p className="text-xs text-muted-foreground">{log.userRole ?? "SYSTEM"}</p>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="secondary">{actionLabel(log.action)}</Badge>
                    </td>
                    <td className="max-w-[220px] truncate px-5 py-3 text-muted-foreground">
                      {log.entity ?? "system"}
                      {log.entityId ? <span className="font-mono text-xs"> · {log.entityId.slice(0, 16)}</span> : null}
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
