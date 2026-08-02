"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUSES = ["PENDING", "UNDER_REVIEW", "ACCEPTED", "REJECTED"];

export function ApplicantFilters({ q, status }: { q: string; status: string }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <form
        className="relative flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          const input = new FormData(e.currentTarget).get("q") as string;
          applyStatus(input, status);
        }}
      >
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input name="q" defaultValue={q} placeholder="Search by reference number or name…" className="pl-9" />
      </form>
      <Select value={status} onValueChange={(v) => applyStatus(q, v)}>
        <SelectTrigger className="sm:w-48">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All statuses</SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {s.replace("_", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function applyStatus(query: string, status: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (status && status !== "ALL") params.set("status", status);
  window.location.href = `/admin/applicants${params.toString() ? `?${params.toString()}` : ""}`;
}
