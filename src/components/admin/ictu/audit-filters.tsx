"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FilterX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AuditFilters({
  basePath = "/admin/audit",
  users,
  actions,
  selectedUserId,
  selectedAction,
}: {
  basePath?: string;
  users: { id: string; name: string }[];
  actions: { value: string; label: string }[];
  selectedUserId?: string;
  selectedAction?: string;
}) {
  const router = useRouter();
  const [userId, setUserId] = useState(selectedUserId ?? "all");
  const [action, setAction] = useState(selectedAction ?? "all");

  function apply() {
    const params = new URLSearchParams();
    if (userId && userId !== "all") params.set("userId", userId);
    if (action && action !== "all") params.set("action", action);
    router.push(`${basePath}?${params.toString()}`);
  }

  function clear() {
    setUserId("all");
    setAction("all");
    router.push(basePath);
  }

  return (
    <Card>
      <CardContent className="flex flex-wrap items-end gap-4 p-4">
        <div className="min-w-[220px] space-y-1.5">
          <Label htmlFor="filter-user" className="text-xs text-muted-foreground">User</Label>
          <Select value={userId} onValueChange={setUserId}>
            <SelectTrigger id="filter-user" className="w-full">
              <SelectValue placeholder="All users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All users</SelectItem>
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[220px] space-y-1.5">
          <Label htmlFor="filter-action" className="text-xs text-muted-foreground">Action</Label>
          <Select value={action} onValueChange={setAction}>
            <SelectTrigger id="filter-action" className="w-full">
              <SelectValue placeholder="All actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              {actions.map((a) => (
                <SelectItem key={a.value} value={a.value}>
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={apply}
            className="bg-crimson-700 text-white hover:bg-yellow-400 hover:text-slate-900"
          >
            Apply Filters
          </Button>
          <Button variant="outline" onClick={clear}>
            <FilterX className="mr-1 h-3.5 w-3.5" /> Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
