"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Search, Trash2, UserPlus } from "lucide-react";

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
  enrollStudent,
  saveGrades,
  searchStudents,
  unenrollStudent,
} from "@/lib/actions/teacher";

type EnrollmentRow = {
  id: string;
  studentNumber: string | null;
  name: string;
  grade: number | null;
  remarks: string | null;
};

type StudentHit = {
  id: string;
  studentNumber: string | null;
  user: { name: string | null; email: string };
};

export function ClassRoster({
  classId,
  enrollments,
}: {
  classId: string;
  enrollments: EnrollmentRow[];
}) {
  const [rows] = useState(enrollments);
  const [grades, setGrades] = useState<Record<string, string>>(() =>
    Object.fromEntries(enrollments.map((e) => [e.id, e.grade == null ? "" : String(e.grade)])),
  );
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<StudentHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  async function handleSearch() {
    setSearching(true);
    const results = await searchStudents(query);
    setSearching(false);
    setHits(results);
  }

  async function handleEnroll(studentId: string) {
    setEnrollingId(studentId);
    const result = await enrollStudent(classId, studentId);
    setEnrollingId(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Student enrolled");
    window.location.reload();
  }

  async function handleUnenroll(enrollmentId: string) {
    if (!confirm("Remove this student from the class? Their grade will be deleted.")) return;
    setBusyId(enrollmentId);
    const result = await unenrollStudent(enrollmentId);
    setBusyId(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Student removed");
    window.location.reload();
  }

  async function handleSave() {
    const entries: { id: string; grade: number }[] = [];
    for (const row of rows) {
      const raw = grades[row.id]?.trim();
      if (!raw) continue;
      const n = Number(raw);
      if (Number.isNaN(n) || n < 0 || n > 100) {
        toast.error(`Invalid grade for ${row.name}. Grades must be 0–100.`);
        return;
      }
      entries.push({ id: row.id, grade: n });
    }
    if (entries.length === 0) return;
    setSaving(true);
    const result = await saveGrades({ enrollmentIds: entries.map((e) => e.id), grades: entries.map((e) => e.grade) });
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Grades submitted");
    window.location.reload();
  }

  const withGrades = rows.filter((r) => grades[r.id]?.trim() !== "");
  const hasUnsaved = withGrades.some((r) => r.grade == null || String(r.grade) !== grades[r.id]?.trim());

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {rows.length} student{rows.length === 1 ? "" : "s"} enrolled
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSearchOpen(true);
              setQuery("");
              setHits([]);
            }}
          >
            <UserPlus className="mr-1 h-4 w-4" /> Enroll Student
          </Button>
          {hasUnsaved && (
            <Button
              size="sm"
              className="bg-crimson-700 text-white hover:bg-yellow-400 hover:text-slate-900"
              onClick={handleSave}
              disabled={saving}
            >
              {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              {saving ? "Saving…" : "Save Grades"}
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Student No.</th>
                <th className="w-28 px-4 py-3 font-medium">Grade (0–100)</th>
                <th className="w-16 px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                    No students enrolled yet. Use “Enroll Student” to add students to this class.
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const raw = grades[row.id]?.trim() ?? "";
                  const dirty = raw !== "" && (row.grade == null || String(row.grade) !== raw);
                  return (
                    <tr key={row.id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium text-slate-900">{row.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.studentNumber ?? "—"}</td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          step={0.01}
                          value={grades[row.id] ?? ""}
                          onChange={(e) => setGrades({ ...grades, [row.id]: e.target.value })}
                          placeholder="—"
                          className={dirty ? "border-amber-400 focus-visible:ring-amber-300" : ""}
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleUnenroll(row.id)}
                          disabled={busyId === row.id}
                        >
                          {busyId === row.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {withGrades.length > 0 && (
        <div className="rounded-lg border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
          <p>
            Unsaved grades: {withGrades.length} student{withGrades.length === 1 ? "" : "s"}. Grades are stored as 0–100
            and converted to the 1.00–5.00 scale for the student&apos;s transcript.
          </p>
        </div>
      )}

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enroll Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Search by name, email, or student number</Label>
              <div className="flex gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="e.g. Juan Dela Cruz"
                />
                <Button variant="outline" onClick={handleSearch} disabled={query.trim().length < 2 || searching}>
                  {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="max-h-72 space-y-2 overflow-y-auto">
              {hits.length === 0 && !searching && query.trim().length >= 2 && (
                <p className="py-6 text-center text-sm text-muted-foreground">No students found.</p>
              )}
              {hits.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-2 rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{s.user.name ?? s.user.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.studentNumber ?? "No student no."} · {s.user.email}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-crimson-700 text-white hover:bg-yellow-400 hover:text-slate-900"
                    disabled={enrollingId === s.id}
                    onClick={() => handleEnroll(s.id)}
                  >
                    {enrollingId === s.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Enroll"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
