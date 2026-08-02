"use client";

import { useState, useTransition } from "react";
import { ExternalLink as ExternalLinkIcon, Link2, Plus, RotateCcw, Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  createExternalLink,
  deleteExternalLink,
  restoreDefaultLinks,
  updateExternalLink,
} from "@/lib/actions/external-links";
import { externalLinkCategories } from "@/lib/external-links";
import { cn } from "@/lib/utils";

interface LinkRow {
  id: string;
  slug: string;
  label: string;
  url: string;
  category: string;
  description: string | null;
  order: number;
  active: boolean;
}

const emptyForm = {
  slug: "",
  label: "",
  url: "",
  category: "quick",
  description: "",
  order: 0,
  active: true,
};

export function ExternalLinksManager({ initialLinks }: { initialLinks: LinkRow[] }) {
  const [links] = useState<LinkRow[]>(initialLinks);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const visible = filter === "all" ? links : links.filter((l) => l.category === filter);

  function startCreate() {
    setEditingId("new");
    setError(null);
    setForm({ ...emptyForm, category: filter === "all" ? "quick" : filter });
  }

  function startEdit(link: LinkRow) {
    setEditingId(link.id);
    setError(null);
    setForm({
      slug: link.slug,
      label: link.label,
      url: link.url,
      category: link.category,
      description: link.description ?? "",
      order: link.order,
      active: link.active,
    });
  }

  function cancel() {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      const res =
        editingId === "new"
          ? await createExternalLink(form)
          : await updateExternalLink(editingId!, form);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      cancel();
      const refreshed = await fetch("/admin/links");
      if (refreshed.ok) window.location.reload();
    });
  }

  function toggleActive(link: LinkRow) {
    startTransition(async () => {
      await updateExternalLink(link.id, {
        slug: link.slug,
        label: link.label,
        url: link.url,
        category: link.category,
        description: link.description,
        order: link.order,
        active: !link.active,
      });
      window.location.reload();
    });
  }

  function remove(link: LinkRow) {
    if (!window.confirm(`Delete "${link.label}"?`)) return;
    startTransition(async () => {
      await deleteExternalLink(link.id);
      window.location.reload();
    });
  }

  function restore() {
    if (!window.confirm("Replace all links with the system defaults?")) return;
    startTransition(async () => {
      await restoreDefaultLinks();
      window.location.reload();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {["all", ...externalLinkCategories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                filter === c
                  ? "bg-crimson-700 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:text-crimson-700",
              )}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={restore} disabled={isPending}>
            <RotateCcw className="mr-1 h-3.5 w-3.5" /> Restore defaults
          </Button>
          <Button size="sm" onClick={startCreate} disabled={isPending}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Add link
          </Button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {editingId && (
        <div className="rounded-xl border border-amber-300 bg-yellow-50 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-crimson-800">
            <Link2 className="h-4 w-4" />
            {editingId === "new" ? "New external link" : `Edit "${links.find((l) => l.id === editingId)?.label ?? ""}"`}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-xs font-medium text-slate-600">
              Label
              <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. Library Services" />
            </label>
            <label className="space-y-1 text-xs font-medium text-slate-600">
              URL
              <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://…" />
            </label>
            <label className="space-y-1 text-xs font-medium text-slate-600">
              Slug (unique, auto-suggested)
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="e.g. service-library-services" />
            </label>
            <label className="space-y-1 text-xs font-medium text-slate-600">
              Category
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-crimson-400 focus:ring-2 focus:ring-crimson-100"
              >
                {externalLinkCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-xs font-medium text-slate-600 sm:col-span-2">
              Description (optional)
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Short description shown next to the link" />
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-600 sm:col-span-2">
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                className="h-9 w-20 rounded-md border border-slate-300 bg-white px-2 text-sm outline-none focus:border-crimson-400"
              />
              Order
              <label className="ml-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="h-4 w-4 accent-crimson-700"
                />
                Active
              </label>
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="sm" onClick={submit} disabled={isPending}>
              <Save className="mr-1 h-3.5 w-3.5" /> Save
            </Button>
            <Button size="sm" variant="outline" onClick={cancel} disabled={isPending}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 font-semibold">Label</th>
                <th className="px-4 py-3 font-semibold">URL</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map((link) => (
                <tr key={link.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{link.label}</p>
                    <p className="font-mono text-xs text-slate-400">{link.slug}</p>
                  </td>
                  <td className="max-w-56 px-4 py-3">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 truncate text-crimson-700 hover:underline"
                    >
                      <ExternalLinkIcon className="h-3 w-3 shrink-0" />
                      {link.url}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className="bg-crimson-700/10 text-crimson-700 ring-1 ring-crimson-700/30">{link.category}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleActive(link)}
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
                        link.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500",
                      )}
                    >
                      {link.active ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button variant="outline" size="sm" onClick={() => startEdit(link)} disabled={isPending}>
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => remove(link)} disabled={isPending}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">
                    No links in this category yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
