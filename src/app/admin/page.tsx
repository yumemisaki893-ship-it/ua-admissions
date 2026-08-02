import Link from "next/link";
import { Users, FileCheck2, Wallet, TrendingUp, ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { StatusChart } from "@/components/admin/status-chart";
import { auth } from "@/lib/auth";
import { IctuDashboard } from "@/components/admin/ictu/ictu-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (session?.user?.role === "ICTU_SUPERVISOR" || session?.user?.role === "ICTU_STAFF") {
    return <IctuDashboard />;
  }

  const [totalApplicants, pending, underReview, accepted, rejected, revenue, recent] = await Promise.all([
    prisma.application.count({ where: { status: { not: "DRAFT" } } }),
    prisma.application.count({ where: { status: "PENDING" } }),
    prisma.application.count({ where: { status: "UNDER_REVIEW" } }),
    prisma.application.count({ where: { status: "ACCEPTED" } }),
    prisma.application.count({ where: { status: "REJECTED" } }),
    prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
    prisma.application.findMany({
      where: { status: { not: "DRAFT" } },
      orderBy: { submittedAt: "desc" },
      take: 8,
      include: {
        studentProfile: { select: { firstName: true, lastName: true } },
        course: { select: { code: true, name: true } },
      },
    }),
  ]);

  const revenueTotal = revenue._sum.amount ?? 0;

  const stats = [
    {
      label: "Total Applicants",
      value: totalApplicants.toLocaleString(),
      icon: Users,
      tone: "bg-crimson-50 text-crimson-700 ring-crimson-200",
    },
    {
      label: "Qualified",
      value: accepted.toLocaleString(),
      icon: FileCheck2,
      tone: "bg-emerald-50 text-emerald-600 ring-emerald-200",
    },
    {
      label: "Pending Review",
      value: (pending + underReview).toLocaleString(),
      icon: TrendingUp,
      tone: "bg-amber-50 text-amber-600 ring-amber-200",
    },
    {
      label: "Revenue (Fees)",
      value: formatCurrency(revenueTotal),
      icon: Wallet,
      tone: "bg-crimson-50 text-crimson-700 ring-crimson-200",
    },
  ];

  const statusData = [
    { name: "Pending", value: pending, color: "#9d0505" },
    { name: "Under Review", value: underReview, color: "#f59e0b" },
    { name: "Qualified", value: accepted, color: "#059669" },
    { name: "Not Qualified", value: rejected, color: "#dc2626" },
  ];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-900 via-navy-950 to-crimson-950 p-6 shadow-lg sm:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 90% 10%, #f2de5e 0, transparent 40%)",
          }}
        />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">Admissions Office</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-white sm:text-3xl">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-navy-100">
            Admission overview · applications and fee revenue at a glance.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-start justify-between p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-1.5 font-display text-2xl font-semibold text-slate-900">{stat.value}</p>
              </div>
              <span className={`flex h-10 w-10 items-center justify-center rounded-lg ring-1 ${stat.tone}`}>
                <stat.icon className="h-5 w-5" />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Applications by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusChart data={statusData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Applications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {recent.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No submitted applications yet.
              </p>
            )}
            {recent.map((app) => (
              <Link
                key={app.id}
                href={`/admin/applicants/${app.id}`}
                className="flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3 transition-colors hover:border-amber-300"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {app.studentProfile.firstName} {app.studentProfile.lastName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {app.course.name} ({app.course.code})
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={app.status === "ACCEPTED" ? "success" : app.status === "REJECTED" ? "destructive" : app.status === "UNDER_REVIEW" ? "warning" : "secondary"}>
                    {app.status.replace("_", " ")}
                  </Badge>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
