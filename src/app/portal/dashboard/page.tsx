import Link from "next/link";
import { CheckCircle2, CircleDashed, FileText, ArrowRight, BellRing, Clock, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getMyApplication } from "@/lib/actions/application";
import { markNotificationRead, markAllNotificationsRead } from "@/lib/actions/admin";
import { applicationStatusMeta } from "@/lib/site-config";
import { formatDate, formatDateTime, formatBytes } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const statusOrder = ["DRAFT", "PENDING", "UNDER_REVIEW", "ACCEPTED"];

const documentLabels: Record<string, string> = {
  BIRTH_CERT: "PSA Birth Certificate",
  FORM_137: "Form 137",
  PHOTO: "2x2 ID Photo",
};

export default async function PortalDashboardPage() {
  const session = await auth();
  const application = await getMyApplication();
  const items = session?.user?.id
    ? await prisma.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 20,
      })
    : [];

  const currentIndex = application ? statusOrder.indexOf(application.status) : -1;
  const isTerminal = application?.status === "ACCEPTED" || application?.status === "REJECTED";
  const meta = application ? applicationStatusMeta[application.status] : null;
  const firstName = session?.user?.name?.split(" ")[0] ?? "Student";

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-crimson-800 via-crimson-900 to-navy-950 p-6 shadow-lg sm:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 90% 10%, #f2de5e 0, transparent 40%)",
          }}
        />
        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">Student Portal</p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-white sm:text-3xl">
              Welcome back, {firstName}!
            </h1>
            <p className="mt-1 text-sm text-red-100">
              Track your admission application and receive updates here.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {application?.referenceNumber && (
              <Badge className="border-gold-300/40 bg-gold-300/10 font-mono text-gold-300">
                {application.referenceNumber}
              </Badge>
            )}
            {!application && (
              <Button
                size="lg"
                className="bg-white text-crimson-800 shadow-lg hover:bg-gold-300 hover:text-navy-950"
                asChild
              >
                <Link href="/portal/apply">
                  <FileText className="mr-1 h-4 w-4" /> Start Application
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {!application ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-crimson-50 text-crimson-700 ring-1 ring-crimson-200">
              <FileText className="h-8 w-8" />
            </span>
            <div className="space-y-1">
              <h2 className="font-display text-lg font-semibold text-slate-900">No application yet</h2>
              <p className="max-w-md text-sm text-muted-foreground">
                You have not started an application. Begin now and complete it in about 10 minutes.
              </p>
            </div>
            <Button asChild>
              <Link href="/portal/apply">
                Start My Application <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            {/* Status card */}
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg">Application Status</CardTitle>
                {application.referenceNumber && (
                  <Badge variant="outline" className="font-mono">
                    {application.referenceNumber}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Current status</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        meta?.tone === "success"
                          ? "success"
                          : meta?.tone === "destructive"
                            ? "destructive"
                            : meta?.tone === "warning"
                              ? "warning"
                              : meta?.tone === "primary"
                                ? "default"
                                : "secondary"
                      }
                      className="px-3 py-1 text-sm"
                    >
                      {meta?.label ?? application.status}
                    </Badge>
                    {application.applicationFeePaid && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <Wallet className="h-3.5 w-3.5" /> Fee paid
                      </span>
                    )}
                  </div>
                  {meta && <p className="mt-2 text-sm text-muted-foreground">{meta.description}</p>}
                  {application.remarks && (
                    <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-2.5 text-sm text-amber-800">
                      <strong>Registrar&apos;s note:</strong> {application.remarks}
                    </p>
                  )}
                </div>

                {/* Timeline */}
                {!isTerminal && (
                  <ol className="space-y-0">
                    {statusOrder.map((status, i) => {
                      const stepMeta = applicationStatusMeta[status];
                      const reached = i <= currentIndex;
                      return (
                        <li key={status} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            {reached ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            ) : (
                              <CircleDashed className="h-5 w-5 text-muted-foreground/40" />
                            )}
                            {i < statusOrder.length - 1 && (
                              <span className={`my-1 h-full w-0.5 ${i < currentIndex ? "bg-emerald-300" : "bg-muted"}`} />
                            )}
                          </div>
                          <div className={reached ? "pb-6" : "pb-6 opacity-50"}>
                            <p className="text-sm font-medium text-slate-900">{stepMeta.label}</p>
                            <p className="text-xs text-muted-foreground">{stepMeta.description}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}

                <Separator />

                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">Course</dt>
                    <dd className="mt-0.5 font-medium text-slate-900">
                      {application.course.name}{" "}
                      <span className="font-mono text-xs text-crimson-700">({application.course.code})</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">College</dt>
                    <dd className="mt-0.5 font-medium text-slate-900">{application.course.college.name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">Submitted</dt>
                    <dd className="mt-0.5 font-medium text-slate-900">
                      {application.submittedAt ? formatDate(application.submittedAt) : "Not yet submitted"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">Last updated</dt>
                    <dd className="mt-0.5 font-medium text-slate-900">{formatDate(application.updatedAt)}</dd>
                  </div>
                </dl>

                {application.status === "DRAFT" && (
                  <Button asChild className="w-full">
                    <Link href="/portal/apply">
                      Continue Application <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Uploaded Documents</CardTitle>
                <CardDescription>
                  {application.documents.length}/3 complete — all three are required to submit.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {Object.entries(documentLabels).map(([type, label]) => {
                  const doc = application.documents.find((d) => d.type === type);
                  return (
                    <div
                      key={type}
                      className="flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        {doc ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <FileText className="h-5 w-5 text-muted-foreground/50" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-slate-900">{label}</p>
                          {doc && (
                            <p className="text-xs text-muted-foreground">
                              {doc.fileName} · {formatBytes(doc.sizeBytes)}
                            </p>
                          )}
                        </div>
                      </div>
                      {doc && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-crimson-700 hover:underline"
                        >
                          View
                        </a>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Notifications */}
          <Card id="notifications" className="scroll-mt-24 h-fit">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BellRing className="h-5 w-5 text-crimson-700" /> Notifications
              </CardTitle>
              {items.some((n) => !n.read) && (
                <form action={markAllNotificationsRead}>
                  <button className="text-xs font-medium text-crimson-700 hover:underline">Mark all read</button>
                </form>
              )}
            </CardHeader>
            <CardContent className="space-y-2.5">
              {items.length === 0 && (
                <div className="py-8 text-center">
                  <Clock className="mx-auto h-8 w-8 text-muted-foreground/40" />
                  <p className="mt-2 text-sm text-muted-foreground">No notifications yet.</p>
                </div>
              )}
              {items.map((n) => (
                <form key={n.id} action={markNotificationRead.bind(null, n.id)}>
                  <button
                    type="submit"
                    className={`w-full rounded-lg border px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                      n.read ? "opacity-60" : "border-crimson-200 bg-crimson-50/50"
                    }`}
                  >
                    <p className="text-sm font-medium text-slate-900">{n.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{n.message}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground/70">{formatDateTime(n.createdAt)}</p>
                  </button>
                </form>
              ))}
              {items.some((n) => !n.read) && (
                <p className="text-center text-[11px] text-muted-foreground">
                  Click a notification to mark it as read.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
