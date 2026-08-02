"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { createClass, deleteClass, updateClass } from "@/lib/actions/academics";

type ClassRow = {
  id: string;
  subjectId: string;
  teacherId: string;
  section: string;
  semester: string;
  academicYear: string;
  schedule: string | null;
  room: string | null;
  subject: { code: string; title: string; units: number };
  teacher: { name: string | null; email: string };
  _count: { enrollments: number };
};

export function ClassesManager({
  classes,
  subjects,
  teachers,
}: {
  classes: ClassRow[];
  subjects: { id: string; code: string; title: string }[];
  teachers: { id: string; name: string | null; email: string }[];
}) {
  const [rows] = useState(classes);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ClassRow | null>(null);
  const [form, setForm] = useState({
    subjectId: "",
    teacherId: "",
    section: "",
    semester: "1st Semester",
    academicYear: "2026-2027",
    schedule: "",
    room: "",
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setForm({
      subjectId: subjects[0]?.id ?? "",
      teacherId: teachers[0]?.id ?? "",
      section: "",
      semester: "1st Semester",
      academicYear: "2026-2027",
      schedule: "",
      room: "",
    });
    setOpen(true);
  }

  function openEdit(row: ClassRow) {
    setEditing(row);
    setForm({
      subjectId: row.subjectId,
      teacherId: row.teacherId,
      section: row.section,
      semester: row.semester,
      academicYear: row.academicYear,
      schedule: row.schedule ?? "",
      room: row.room ?? "",
    });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    const result = editing ? await updateClass(editing.id, form) : await createClass(form);
    setSaving(false);
    if (!result.ok) {
      toast.error("Save failed", { description: result.error });
      return;
    }
    toast.success(editing ? "Class updated" : "Class created");
    setOpen(false);
    window.location.reload();
  }

  async function remove(row: ClassRow) {
    if (!confirm(`Delete class ${row.subject.code} · ${row.section} (${row.academicYear})?`)) return;
    setDeleting(row.id);
    const result = await deleteClass(row.id);
    setDeleting(null);
    if (!result.ok) {
      toast.error("Delete failed", { description: result.error });
      return;
    }
    toast.success("Class deleted");
    window.location.reload();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {rows.length} classes · {subjects.length} subjects · {teachers.length} teachers
        </p>
        <Button
          size="sm"
          className="bg-crimson-700 text-white hover:bg-yellow-400 hover:text-slate-900"
          onClick={openCreate}
          disabled={subjects.length === 0 || teachers.length === 0}
        >
          <Plus className="mr-1 h-4 w-4" /> New Class
        </Button>
      </div>

      {subjects.length === 0 || teachers.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Create subjects and teacher accounts first — ICTU creates teacher accounts, then subjects
            can be assigned.
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((row) => (
          <Card key={row.id} className="hover:border-amber-300">
            <CardContent className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">
                    {row.subject.code} <span className="font-normal text-muted-foreground">· {row.subject.units} units</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{row.subject.title}</p>
                </div>
                <div className="flex shrink-0 gap-1">
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
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{row.section}</Badge>
                <Badge variant="secondary">{row.semester} · {row.academicYear}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Teacher: {row.teacher.name ?? row.teacher.email}
                {row.schedule ? ` · ${row.schedule}` : ""}
                {row.room ? ` · Room ${row.room}` : ""}
              </p>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" /> {row._count.enrollments} enrolled
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
        {rows.length === 0 && subjects.length > 0 && teachers.length > 0 && (
          <Card className="md:col-span-2">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No classes yet. Create the first class to assign a teacher to a subject section.
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Class" : "New Class"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select value={form.subjectId} onValueChange={(v) => setForm({ ...form, subjectId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.code} — {s.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Teacher</Label>
              <Select value={form.teacherId} onValueChange={(v) => setForm({ ...form, teacherId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name ?? t.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Section</Label>
                <Input
                  value={form.section}
                  onChange={(e) => setForm({ ...form, section: e.target.value })}
                  placeholder="BSIT-1A"
                />
              </div>
              <div className="space-y-2">
                <Label>Academic Year</Label>
                <Input
                  value={form.academicYear}
                  onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                  placeholder="2026-2027"
                />
              </div>
              <div className="space-y-2">
                <Label>Semester</Label>
                <Input
                  value={form.semester}
                  onChange={(e) => setForm({ ...form, semester: e.target.value })}
                  placeholder="1st Semester"
                />
              </div>
              <div className="space-y-2">
                <Label>Room</Label>
                <Input
                  value={form.room}
                  onChange={(e) => setForm({ ...form, room: e.target.value })}
                  placeholder="Rm. 204"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Schedule</Label>
              <Input
                value={form.schedule}
                onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                placeholder="MWF 9:00–10:30 AM"
              />
            </div>
            <Button
              onClick={save}
              disabled={saving || !form.subjectId || !form.teacherId || !form.section}
              className="w-full bg-crimson-700 text-white hover:bg-yellow-400 hover:text-slate-900"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Saving…" : editing ? "Save Changes" : "Create Class"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
