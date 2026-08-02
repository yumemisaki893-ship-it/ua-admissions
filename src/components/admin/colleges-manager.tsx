"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createCollege,
  updateCollege,
  deleteCollege,
  createCourse,
  updateCourse,
  deleteCourse,
} from "@/lib/actions/admin";

interface CollegeItem {
  id: string;
  code: string;
  name: string;
  description: string | null;
  courses: {
    id: string;
    code: string;
    name: string;
    description: string;
    durationYears: number;
    careerOpportunities: string[];
  }[];
}

export function CollegesManager({ colleges }: { colleges: CollegeItem[] }) {
  const router = useRouter();

  // College dialog state
  const [collegeOpen, setCollegeOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<CollegeItem | null>(null);
  const [collegeForm, setCollegeForm] = useState({ code: "", name: "", description: "" });
  const [collegeSaving, setCollegeSaving] = useState(false);
  const [deletingCollege, setDeletingCollege] = useState<CollegeItem | null>(null);

  // Course dialog state
  const [courseOpen, setCourseOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<{ id: string; collegeId: string } | null>(null);
  const [courseForm, setCourseForm] = useState({
    collegeId: "",
    code: "",
    name: "",
    description: "",
    durationYears: "4",
    careerOpportunities: "",
  });
  const [courseSaving, setCourseSaving] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState<{ id: string; name: string } | null>(null);

  function openCreateCollege() {
    setEditingCollege(null);
    setCollegeForm({ code: "", name: "", description: "" });
    setCollegeOpen(true);
  }

  function openEditCollege(c: CollegeItem) {
    setEditingCollege(c);
    setCollegeForm({ code: c.code, name: c.name, description: c.description ?? "" });
    setCollegeOpen(true);
  }

  function openCreateCourse(collegeId: string) {
    setEditingCourse(null);
    setCourseForm({ collegeId, code: "", name: "", description: "", durationYears: "4", careerOpportunities: "" });
    setCourseOpen(true);
  }

  function openEditCourse(
    course: { id: string; code: string; name: string; description: string; durationYears: number; careerOpportunities: string[] },
    collegeId: string,
  ) {
    setEditingCourse({ id: course.id, collegeId });
    setCourseForm({
      collegeId,
      code: course.code,
      name: course.name,
      description: course.description,
      durationYears: String(course.durationYears),
      careerOpportunities: course.careerOpportunities.join(", "),
    });
    setCourseOpen(true);
  }

  async function saveCollege() {
    if (!collegeForm.code || !collegeForm.name) {
      toast.error("Missing fields", { description: "Code and name are required." });
      return;
    }
    setCollegeSaving(true);
    const result = editingCollege
      ? await updateCollege(editingCollege.id, collegeForm)
      : await createCollege(collegeForm);
    setCollegeSaving(false);
    if (result.ok) {
      toast.success(editingCollege ? "College updated" : "College created");
      setCollegeOpen(false);
      router.refresh();
    } else {
      toast.error("Save failed", { description: result.error });
    }
  }

  async function saveCourse() {
    if (!courseForm.collegeId || !courseForm.code || !courseForm.name) {
      toast.error("Missing fields", { description: "College, code, and name are required." });
      return;
    }
    const careerOpportunities = courseForm.careerOpportunities
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setCourseSaving(true);
    const result = editingCourse
      ? await updateCourse(editingCourse.id, { ...courseForm, careerOpportunities })
      : await createCourse({ ...courseForm, careerOpportunities });
    setCourseSaving(false);
    if (result.ok) {
      toast.success(editingCourse ? "Course updated" : "Course created");
      setCourseOpen(false);
      router.refresh();
    } else {
      toast.error("Save failed", { description: result.error });
    }
  }

  async function removeCollege() {
    if (!deletingCollege) return;
    const result = await deleteCollege(deletingCollege.id);
    if (result.ok) {
      toast.success("College deleted");
      setDeletingCollege(null);
      router.refresh();
    } else {
      toast.error("Delete failed", { description: result.error });
    }
  }

  async function removeCourse() {
    if (!deletingCourse) return;
    const result = await deleteCourse(deletingCourse.id);
    if (result.ok) {
      toast.success("Course deleted");
      setDeletingCourse(null);
      router.refresh();
    } else {
      toast.error("Delete failed", { description: result.error });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={openCreateCollege}>
          <Plus className="mr-1 h-4 w-4" /> New College
        </Button>
      </div>

      {colleges.map((college) => (
        <section key={college.id} className="rounded-xl border bg-card">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-crimson-900 text-yellow-300">{college.code}</Badge>
                <h3 className="font-display font-semibold text-white">{college.name}</h3>
              </div>
              {college.description && (
                <p className="mt-1 max-w-2xl text-xs text-muted-foreground">{college.description}</p>
              )}
            </div>
            <div className="flex gap-1.5">
              <Button variant="ghost" size="sm" onClick={() => openEditCollege(college)}>
                <Edit className="mr-1 h-3.5 w-3.5" /> Edit
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeletingCollege(college)}>
                <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
              </Button>
            </div>
          </header>
          <div className="divide-y">
            {college.courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">
                    {course.name} <span className="font-mono text-xs text-crimson-300">({course.code})</span>
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {course.description} · {course.durationYears} years
                  </p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <Button variant="ghost" size="icon" title="Edit course" onClick={() => openEditCourse(course, college.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Delete course" className="text-destructive" onClick={() => setDeletingCourse({ id: course.id, name: course.name })}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => openCreateCourse(college.id)}
              className="w-full px-5 py-3 text-left text-sm font-medium text-crimson-300 transition-colors hover:bg-yellow-500/10"
            >
              + Add course to {college.code}
            </button>
          </div>
        </section>
      ))}

      {/* College dialog */}
      <Dialog open={collegeOpen} onOpenChange={setCollegeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCollege ? "Edit College" : "New College"}</DialogTitle>
            <DialogDescription>Colleges are displayed on the Academics page.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="college-code">Code</Label>
                <Input id="college-code" value={collegeForm.code} onChange={(e) => setCollegeForm({ ...collegeForm, code: e.target.value.toUpperCase() })} placeholder="CAS" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="college-name">Name</Label>
                <Input id="college-name" value={collegeForm.name} onChange={(e) => setCollegeForm({ ...collegeForm, name: e.target.value })} placeholder="College of Arts and Sciences" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="college-desc">Description</Label>
              <Textarea id="college-desc" value={collegeForm.description} onChange={(e) => setCollegeForm({ ...collegeForm, description: e.target.value })} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setCollegeOpen(false)}>Cancel</Button>
              <Button onClick={saveCollege} disabled={collegeSaving}>
                {collegeSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingCollege ? "Save Changes" : "Create College"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Course dialog */}
      <Dialog open={courseOpen} onOpenChange={setCourseOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCourse ? "Edit Course" : "New Course"}</DialogTitle>
            <DialogDescription>Courses appear in the application wizard&apos;s course selector.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="course-college">College</Label>
              <Select value={courseForm.collegeId} onValueChange={(v) => setCourseForm({ ...courseForm, collegeId: v })}>
                <SelectTrigger id="course-college">
                  <SelectValue placeholder="Select college" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.code} — {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course-code">Code</Label>
                <Input id="course-code" value={courseForm.code} onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value.toUpperCase() })} placeholder="BSIT" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="course-name">Name</Label>
                <Input id="course-name" value={courseForm.name} onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })} placeholder="Bachelor of Science in Information Technology" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-desc">Description</Label>
              <Textarea id="course-desc" value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course-years">Duration (years)</Label>
                <Input id="course-years" type="number" min={1} max={8} value={courseForm.durationYears} onChange={(e) => setCourseForm({ ...courseForm, durationYears: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-careers">Career Opportunities</Label>
                <Input id="course-careers" value={courseForm.careerOpportunities} onChange={(e) => setCourseForm({ ...courseForm, careerOpportunities: e.target.value })} placeholder="Comma-separated list" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setCourseOpen(false)}>Cancel</Button>
              <Button onClick={saveCourse} disabled={courseSaving}>
                {courseSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingCourse ? "Save Changes" : "Create Course"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmations */}
      <AlertDialog open={Boolean(deletingCollege)} onOpenChange={(v) => !v && setDeletingCollege(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this college?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deletingCollege?.name}&rdquo; and all of its courses will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={removeCollege}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={Boolean(deletingCourse)} onOpenChange={(v) => !v && setDeletingCourse(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this course?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deletingCourse?.name}&rdquo; will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={removeCourse}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
