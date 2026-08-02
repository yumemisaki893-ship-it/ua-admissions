"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSubject, deleteSubject, updateSubject } from "@/lib/actions/academics";

type SubjectRow = {
  id: string;
  code: string;
  title: string;
  units: number;
  collegeId: string | null;
};

export function SubjectsManager({
  subjects,
  colleges,
}: {
  subjects: SubjectRow[];
  colleges: { id: string; code: string; name: string }[];
}) {
  const [rows] = useState(subjects);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SubjectRow | null>(null);
  const [form, setForm] = useState({ code: "", title: "", units: "3", collegeId: "" });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setForm({ code: "", title: "", units: "3", collegeId: "" });
    setOpen(true);
  }

  function openEdit(row: SubjectRow) {
    setEditing(row);
    setForm({ code: row.code, title: row.title, units: String(row.units), collegeId: row.collegeId ?? "" });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    const result = editing
      ? await updateSubject(editing.id, form)
      : await createSubject(form);
    setSaving(false);
    if (!result.ok) {
      toast.error("Save failed", { description: result.error });
      return;
    }
    toast.success(editing ? "Subject updated" : "Subject created");
    setOpen(false);
    window.location.reload();
  }

  async function remove(row: SubjectRow) {
    if (!confirm(`Delete subject ${row.code}?`)) return;
    setDeleting(row.id);
    const result = await deleteSubject(row.id);
    setDeleting(null);
    if (!result.ok) {
      toast.error("Delete failed", { description: result.error });
      return;
    }
    toast.success("Subject deleted");
    window.location.reload();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{rows.length} subjects</p>
        <Button
          size="sm"
          className="bg-crimson-700 text-white hover:bg-yellow-400 hover:text-slate-900"
          onClick={openCreate}
        >
          <Plus className="mr-1 h-4 w-4" /> New Subject
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Code</th>
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Units</th>
                  <th className="px-5 py-3 font-medium">College</th>
                  <th className="px-5 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-semibold text-crimson-700">{row.code}</td>
                    <td className="px-5 py-3 text-slate-900">{row.title}</td>
                    <td className="px-5 py-3 text-muted-foreground">{row.units}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {colleges.find((c) => c.id === row.collegeId)?.code ?? "—"}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => remove(row)}
                          disabled={deleting === row.id}
                        >
                          {deleting === row.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                      No subjects yet. Create the first subject.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Subject" : "New Subject"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Subject Code</Label>
              <Input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="MATH101"
              />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="College Algebra"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Units</Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={form.units}
                  onChange={(e) => setForm({ ...form, units: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>College</Label>
                <Select value={form.collegeId} onValueChange={(v) => setForm({ ...form, collegeId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {colleges.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.code} — {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={save}
              disabled={saving || !form.code || !form.title}
              className="w-full bg-crimson-700 text-white hover:bg-yellow-400 hover:text-slate-900"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Saving…" : editing ? "Save Changes" : "Create Subject"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
