import Link from "next/link";
import { ArrowLeft, Mail, UserRound } from "lucide-react";

import { ProfileForm } from "@/components/portal/profile-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getMyProfile } from "@/lib/actions/profile";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  const data = await getMyProfile();

  const application = session?.user?.id
    ? await prisma.application.findFirst({
        where: { userId: session.user.id },
        select: { status: true, referenceNumber: true },
      })
    : null;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/portal/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-crimson-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <h1 className="mt-2 font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your personal details and contact information.
        </p>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="flex flex-wrap items-center gap-4 p-6">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-crimson-700 to-crimson-900 text-lg font-bold text-white">
            {(data?.name ?? "S")
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg font-semibold text-slate-900">
              {data?.name ?? "Student"}
            </p>
            <p className="flex items-center gap-1.5 text-sm text-slate-500">
              <Mail className="h-3.5 w-3.5" /> {data?.email}
            </p>
          </div>
          {application && (
            <Badge className="border-crimson-200 bg-crimson-50 font-mono text-crimson-700">
              {application.referenceNumber ?? "DRAFT"}
            </Badge>
          )}
          <Badge variant="outline">
            <UserRound className="mr-1 h-3 w-3" /> Student
          </Badge>
        </CardContent>
      </Card>

      <ProfileForm profile={data?.profile ?? null} />
    </div>
  );
}
