"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Power, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { roleLabel } from "@/lib/roles";
import { createAccount, deleteAccount, setAccountActive } from "@/lib/actions/ictu";

export type ManagedAccount = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  actionCount: number;
  lastLoginAt: Date | null;
  deletable: boolean;
  manageable: boolean;
};

const ROLE_OPTIONS: { value: string; label: string; supervisorOnly: boolean }[] = [
  { value: "SUPER_ADMIN", label: "Developer (SUPER_ADMIN)", supervisorOnly: true },
  { value: "ICTU_SUPERVISOR", label: "ICTU Supervisor", supervisorOnly: true },
  { value: "ICTU_STAFF", label: "ICTU Staff", supervisorOnly: false },
  { value: "REGISTRAR", label: "Registrar", supervisorOnly: false },
  { value: "ADMISSIONS_OFFICER", label: "Admissions Officer", supervisorOnly: false },
  { value: "TEACHER", label: "Teacher", supervisorOnly: false },
];

export function AccountsManager({
  canDelete,
  canCreateDevelopers,
  accounts,
}: {
  canDelete: boolean;
  canCreateDevelopers: boolean;
  accounts: ManagedAccount[];
}) {
  const [rows] = useState(accounts);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "REGISTRAR" });
  const [busy, setBusy] = useState<string | null>(null);

  const availableRoles = ROLE_OPTIONS.filter(
    (r) => !r.supervisorOnly || canCreateDevelopers,
  );

  async function handleCreate() {
    setCreating(true);
    const result = await createAccount(form);
    setCreating(false);
    if (!result.ok) {
      toast.error("Could not create account", { description: result.error });
      return;
    }
    toast.success("Account created", { description: `${form.email} can now sign in.` });
    setForm({ name: "", email: "", password: "", role: "REGISTRAR" });
    window.location.reload();
  }

  async function handleToggle(row: ManagedAccount) {
    setBusy(row.id);
    const result = await setAccountActive(row.id, !row.isActive);
    setBusy(null);
    if (!result.ok) {
      toast.error("Update failed", { description: result.error });
      return;
    }
    toast.success(row.isActive ? "Account deactivated" : "Account activated");
    window.location.reload();
  }

  async function handleDelete(row: ManagedAccount) {
    if (!confirm(`Delete the account for ${row.name} (${row.email})? This cannot be undone.`)) return;
    setBusy(row.id);
    const result = await deleteAccount(row.id);
    setBusy(null);
    if (!result.ok) {
      toast.error("Delete failed", { description: result.error });
      return;
    }
    toast.success("Account deleted");
    window.location.reload();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4 text-crimson-700" /> New Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="acct-role">Account Type</Label>
            <Select value={form.role} onValueChange={(role) => setForm({ ...form, role })}>
              <SelectTrigger id="acct-role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!canCreateDevelopers && (
              <p className="text-xs text-muted-foreground">
                Developer and supervisor accounts require an ICTU supervisor.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="acct-name">Full Name</Label>
            <Input
              id="acct-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Juan A. Dela Cruz"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="acct-email">Email Address</Label>
            <Input
              id="acct-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@antiquespride.edu.ph"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="acct-password">Temporary Password</Label>
            <Input
              id="acct-password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Minimum 8 characters"
            />
          </div>
          <Button
            onClick={handleCreate}
            disabled={creating || !form.name || !form.email || form.password.length < 8}
            className="w-full bg-crimson-700 text-white hover:bg-yellow-400 hover:text-slate-900"
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Create Account
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3 lg:col-span-2">
        {rows.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No accounts yet. Create the first one using the form.
            </CardContent>
          </Card>
        )}
        {rows.map((row) => (
          <Card key={row.id} className={row.isActive ? "" : "border-slate-200 opacity-75"}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium text-slate-900">{row.name}</p>
                  <Badge variant="secondary">{roleLabel(row.role)}</Badge>
                  <Badge variant={row.isActive ? "success" : "secondary"}>
                    {row.isActive ? "Active" : "Deactivated"}
                  </Badge>
                </div>
                <p className="truncate text-sm text-muted-foreground">{row.email}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Created {formatDate(row.createdAt)} · {row.actionCount} recorded actions
                  {row.lastLoginAt ? ` · Last sign in ${formatDate(row.lastLoginAt, "MMM d, yyyy h:mm a")}` : " · Never signed in"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {row.role === "REGISTRAR" && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/ictu/registrars/${row.id}`}>
                      Footprint <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                )}
                {row.manageable && (
                  <Button
                    variant={row.isActive ? "ghost" : "outline"}
                    size="sm"
                    onClick={() => handleToggle(row)}
                    disabled={busy === row.id}
                    className={
                      row.isActive
                        ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                        : "text-emerald-700 hover:bg-emerald-50"
                    }
                  >
                    {busy === row.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Power className="h-3.5 w-3.5" />}
                    {row.isActive ? "Deactivate" : "Activate"}
                  </Button>
                )}
                {canDelete && row.deletable && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(row)}
                    disabled={busy === row.id}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    {busy === row.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    Delete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
