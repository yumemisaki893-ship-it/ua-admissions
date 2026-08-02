import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { isIctuRole } from "@/lib/roles";
import { listManagedAccounts } from "@/lib/actions/ictu";
import { AccountsManager } from "@/components/admin/ictu/accounts-manager";

export const dynamic = "force-dynamic";

export default async function IctuAccountsPage() {
  const session = await auth();
  if (!isIctuRole(session?.user?.role)) notFound();

  const data = await listManagedAccounts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-900">Account Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create and manage system accounts. Developer and supervisor accounts may only be created
          by an ICTU supervisor.
        </p>
      </div>

      <AccountsManager
        canDelete={data.canDelete}
        canCreateDevelopers={data.canCreateDevelopers}
        accounts={data.accounts}
      />
    </div>
  );
}
