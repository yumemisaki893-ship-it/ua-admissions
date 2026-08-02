import Link from "next/link";
import {
  Users,
  Fingerprint,
  Activity,
  CalendarDays,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

const ACTION_LABELS: Record<string, string> = {
  AUTH_LOGIN: "Sign in",
  NEWS_CREATE: "Created news",
  NEWS_UPDATE: "Updated news",
  NEWS_DELETE: "Deleted news",
  APPLICATION_STATUS_UPDATE: "Application status change",
  COLLEGE_CREATE: "Created college",
  COLLEGE_UPDATE: "Updated college",
  COLLEGE_DELETE: "Deleted college",
  COURSE_CREATE: "Created course",
  COURSE_UPDATE: "Updated course",
  COURSE_DELETE: "Deleted course",
  SITE_CONTENT_UPDATE: "Edited site content",
  SETTINGS_UPDATE: "Updated settings",
  ANNOUNCEMENT_SEND: "Sent announcement",
  EXTERNAL_LINK_CREATE: "Added link",
  EXTERNAL_LINK_UPDATE: "Updated link",
  EXTERNAL_LINK_DELETE: "Deleted link",
  EXTERNAL_LINK_RESTORE_DEFAULTS: "Restored default links",
  ADMIN_ACCOUNT_CREATE: "Created admin account",
  ADMIN_ACCOUNT_TOGGLE_ACTIVE: "Changed account status",
};

export function actionLabel(action: string) {
  return ACTION_LABELS[action] ?? action.replaceAll("_", " ").toLowerCase();
}

export async function IctuDashboard() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const [registrarCount, totalActions, actionsToday, actionsThisWeek, recent, topRegistrars, actionBreakdown] =
    await Promise.all([
      prisma.user.count({ where: { role: "REGISTRAR" } }),
      prisma.auditLog.count(),
      prisma.auditLog.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.auditLog.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
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
      prisma.auditLog.groupBy({
        by: ["userId"],
        where: { userRole: "REGISTRAR" },
        _count: { _all: true },
        _max: { createdAt: true },
        orderBy: { _count: { userId: "desc" } },
        take: 5,
      }),
      prisma.auditLog.groupBy({
        by: ["action"],
        _count: { action: true },
        orderBy: { _count: { action: "desc" } },
        take: 8,
      }),
    ]);

  const registrarDetails = await prisma.user.findMany({
    where: { id: { in: topRegistrars.map((r) => r.userId) } },
    select: { id: true, name: true, email: true, isActive: true },
  });
  const registrarMap = new Map(registrarDetails.map((u) => [u.id, u]));
  const topRegistrarNames = await Promise.all(
    topRegistrars.map(async (r) => {
      const u = registrarMap.get(r.userId);
      return {
        userId: r.userId,
        name: u?.name ?? "Unknown",
        email: u?.email ?? "",
        isActive: u?.isActive ?? true,
        count: r._count?._all ?? 0,
        lastActive: r._max?.createdAt ?? null,
      };
    }),
  );

  const stats = [
    {
      label: "Registrar Accounts",
      value: registrarCount.toLocaleString(),
      icon: Users,
      href: "/admin/ictu/registrars",
      tone: "bg-crimson-50 text-crimson-700 ring-crimson-200",
    },
    {
      label: "Total Footprint Entries",
      value: totalActions.toLocaleString(),
      icon: Fingerprint,
      href: "/admin/ictu/audit",
      tone: "bg-yellow-50 text-amber-700 ring-amber-200",
    },
    {
      label: "Actions Today",
      value: actionsToday.toLocaleString(),
      icon: Activity,
      href: "/admin/ictu/audit",
      tone: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
    {
      label: "Actions This Week",
      value: actionsThisWeek.toLocaleString(),
      icon: CalendarDays,
      href: "/admin/ictu/audit",
      tone: "bg-sky-50 text-sky-700 ring-sky-200",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-900">ICTU Oversight Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor registrar accounts and their digital footprints across the system.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-colors hover:border-amber-300">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 font-display text-3xl font-semibold text-slate-900">{stat.value}</p>
                </div>
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${stat.tone}`}>
                  <stat.icon className="h-5 w-5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <Link
              href="/admin/ictu/audit"
              className="flex items-center gap-1 text-xs font-medium text-crimson-700 hover:underline"
            >
              Full audit trail <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recent.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No activity recorded yet. Sign-ins and admin actions will appear here.
              </p>
            )}
            {recent.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-crimson-700 to-crimson-900 text-yellow-200">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {log.userName ?? "System"}{" "}
                      <span className="font-normal text-muted-foreground">{actionLabel(log.action)}</span>
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {log.entity ?? "system"} · {formatDateTime(log.createdAt)}
                      {log.ip ? ` · ${log.ip}` : ""}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {log.userRole ?? "SYSTEM"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Registrar Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topRegistrarNames.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">No registrar activity yet.</p>
              )}
              {topRegistrarNames.map((r, i) => (
                <Link
                  key={r.userId}
                  href={`/admin/ictu/registrars/${r.userId}`}
                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 px-3 py-2.5 transition-colors hover:border-amber-300"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-crimson-700 text-xs font-semibold text-white">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">{r.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {r.count} actions{r.lastActive ? ` · last ${formatDateTime(r.lastActive)}` : ""}
                      </p>
                    </div>
                  </div>
                  <Badge variant={r.isActive ? "success" : "secondary"}>{r.isActive ? "Active" : "Inactive"}</Badge>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Action Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {actionBreakdown.map((a) => (
                <div key={a.action} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{actionLabel(a.action)}</span>
                  <Badge className="bg-slate-100 text-slate-700">{a._count?.action ?? 0}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
