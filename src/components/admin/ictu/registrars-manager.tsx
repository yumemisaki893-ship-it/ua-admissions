"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Plus, UserPlus, Power, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/utils";
import { createAccount, setAccountActive } from "@/lib/actions/ictu";

export type RegistrarRow = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  actionCount: number;
  lastLoginAt: Date | null;
  lastLoginIp: string | null;
};

export function RegistrarsManager({ registrars }: { registrars: RegistrarRow[] }) {
  const [rows] = useState(registrars);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [toggling, setToggling] = useState<string | null>(null);

  async function handleCreate() {
    setCreating(true);
    const result = await createAccount({ ...form, role: "REGISTRAR" });
    setCreating(false);
    if (!result.ok) {
      toast.error("Could not create account", { description: result.error });
      return;
    }
    toast.success("Registrar account created", { description: `${form.email} can now sign in.` });
    setForm({ name: "", email: "", password: "" });
    window.location.reload();
  }

  async function handleToggle(row: RegistrarRow) {
    setToggling(row.id);
    const result = await setAccountActive(row.id, !row.isActive);
    setToggling(null);
    if (!result.ok) {
      toast.error("Update failed", { description: result.error });
      return;
    }
    toast.success(row.isActive ? "Account deactivated" : "Account activated");
    window.location.reload();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserPlus className="h-4 w-4 text-crimson-700" /> New Registrar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reg-name">Full Name</Label>
            <Input
              id="reg-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Maria C. Dela Cruz"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-email">Email Address</Label>
            <Input
              id="reg-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="registrar@antiquespride.edu.ph"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-password">Temporary Password</Label>
            <Input
              id="reg-password"
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
            Create Registrar Account
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-2">
        {rows.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No registrar accounts yet. Create the first one using the form.
            </CardContent>
          </Card>
        )}
        {rows.map((row) => (
          <Card key={row.id} className={row.isActive ? "" : "border-slate-200 opacity-75"}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-slate-900">{row.name}</p>
                  <Badge variant={row.isActive ? "success" : "secondary"}>
                    {row.isActive ? "Active" : "Deactivated"}
                  </Badge>
                </div>
                <p className="truncate text-sm text-muted-foreground">{row.email}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Created {formatDate(row.createdAt)} · {row.actionCount} recorded actions
                  {row.lastLoginAt
                    ? ` · Last sign in ${formatDate(row.lastLoginAt, "MMM d, yyyy h:mm a")}${row.lastLoginIp ? ` (${row.lastLoginIp})` : ""}`
                    : " · Never signed in"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/ictu/registrars/${row.id}`}>
                    Digital Footprint <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button
                  variant={row.isActive ? "ghost" : "outline"}
                  size="sm"
                  onClick={() => handleToggle(row)}
                  disabled={toggling === row.id}
                  className={row.isActive ? "text-red-600 hover:bg-red-50 hover:text-red-700" : "text-emerald-700 hover:bg-emerald-50"}
                >
                  {toggling === row.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Power className="h-3.5 w-3.5" />
                  )}
                  {row.isActive ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
