import { Settings as SettingsIcon } from "lucide-react";
import { redirect } from "next/navigation";

import { SettingsForm } from "@/components/admin/settings-form";
import { getSettings } from "@/lib/actions/admin";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isContentManager } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id || !isContentManager(session.user.role)) redirect("/admin");

  const [settings, studentCount] = await Promise.all([
    getSettings(),
    prisma.user.count({ where: { role: "STUDENT" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-slate-900">
          <SettingsIcon className="h-6 w-6 text-crimson-700" /> Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage the admission period, application fee, and student announcements.
        </p>
      </div>

      <SettingsForm
        admissionOpen={settings.admissionOpen}
        applicationFee={settings.applicationFee}
        studentCount={studentCount}
      />
    </div>
  );
}
