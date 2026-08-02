import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";
import { SubjectsManager } from "@/components/admin/academics/subjects-manager";
import { ClassesManager } from "@/components/admin/academics/classes-manager";

export const dynamic = "force-dynamic";

export default async function AcademicsPage() {
  const [subjects, classes, colleges, teachers] = await Promise.all([
    prisma.subject.findMany({ orderBy: { code: "asc" } }),
    prisma.class.findMany({
      orderBy: [{ academicYear: "desc" }, { section: "asc" }],
      include: {
        subject: { select: { code: true, title: true, units: true } },
        teacher: { select: { name: true, email: true } },
        _count: { select: { enrollments: true } },
      },
    }),
    prisma.college.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.user.findMany({
      where: { role: "TEACHER", isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-900">Academics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage subjects, sections, and class assignments. Teachers are assigned by the registrar.
        </p>
      </div>

      <Tabs defaultValue="classes">
        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
          <TabsTrigger value="classes">Classes &amp; Sections</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
        </TabsList>
        <TabsContent value="classes" className="mt-5">
          <ClassesManager classes={classes} subjects={subjects} teachers={teachers} />
        </TabsContent>
        <TabsContent value="subjects" className="mt-5">
          <SubjectsManager subjects={subjects} colleges={colleges} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
