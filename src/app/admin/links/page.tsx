import { Link2 } from "lucide-react";
import { redirect } from "next/navigation";

import { ExternalLinksManager } from "@/components/admin/external-links-manager";
import { listExternalLinks } from "@/lib/actions/external-links";
import { auth } from "@/lib/auth";
import { isContentManager } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function LinksPage() {
  const session = await auth();
  if (!session?.user?.id || !isContentManager(session.user.role)) redirect("/admin");

  const links = await listExternalLinks();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-slate-900">
          <Link2 className="h-6 w-6 text-crimson-700" /> External Links
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          Central registry of every external link used across the website — social media, campus
          sites, online systems, services, careers, and navigation. Edit a URL here and it updates
          everywhere immediately, no redeploy needed.
        </p>
      </div>

      <ExternalLinksManager initialLinks={links} />
    </div>
  );
}
