import Link from "next/link";
import { ArrowLeft, BellRing, CheckCheck, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/actions/admin";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const session = await auth();
  const items = session?.user?.id
    ? await prisma.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 100,
      })
    : [];

  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/portal/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-crimson-300 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">
              Notifications
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Updates about your application and university announcements.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <Badge className="bg-crimson-700">
                {unread} unread
              </Badge>
            )}
            {unread > 0 && (
              <form action={markAllNotificationsRead}>
                <button className="rounded-lg border border-crimson-500/40 bg-crimson-500/10 px-3 py-1.5 text-xs font-semibold text-crimson-300 transition-colors hover:bg-yellow-300 hover:text-crimson-900">
                  <CheckCheck className="mr-1 inline h-3.5 w-3.5" />
                  Mark all read
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Card className="border-white/10 bg-white/[0.06] shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BellRing className="h-5 w-5 text-crimson-300" /> All Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {items.length === 0 && (
            <div className="py-14 text-center">
              <Clock className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-400">No notifications yet.</p>
              <p className="mt-1 text-xs text-slate-400">
                You will see application updates here as soon as they arrive.
              </p>
            </div>
          )}
          {items.map((n) => (
            <form key={n.id} action={markNotificationRead.bind(null, n.id)}>
              <button
                type="submit"
                className={`w-full rounded-xl border px-4 py-3.5 text-left transition-colors ${
                  n.read
                    ? "border-white/10 bg-white/[0.06] opacity-60 hover:bg-white/[0.04]"
                    : "border-crimson-500/40 bg-crimson-500/10 hover:bg-yellow-500/10"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{n.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{n.message}</p>
                  </div>
                  {!n.read && <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-crimson-600" />}
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400">{formatDateTime(n.createdAt)}</p>
              </button>
            </form>
          ))}
          {items.length > 0 && unread > 0 && (
            <p className="pt-1 text-center text-[11px] text-slate-400">
              Click a notification to mark it as read.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
