import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TeacherDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [classes, totalStudents] = await Promise.all([
    prisma.class.findMany({
      where: { teacherId: session.user.id },
      include: { subject: true, _count: { select: { enrollments: true } } },
      orderBy: [{ academicYear: "desc" }, { semester: "asc" }],
    }),
    prisma.enrollment.count({ where: { class: { teacherId: session.user.id } } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Welcome back, {session.user.name?.split(" ")[0] ?? "Teacher"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your class sections, rosters, and submit grades.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">{classes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">{totalStudents}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">My Classes</h2>
        {classes.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No classes assigned yet. The registrar or ICTU will assign your class sections here.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {classes.map((c) => (
              <Link key={c.id} href={`/teacher/classes/${c.id}`} className="block">
                <Card className="h-full transition-colors hover:border-amber-300">
                  <CardContent className="space-y-2 p-5">
                    <p className="font-semibold text-slate-900">
                      {c.subject.code} · {c.subject.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {c.section} · {c.semester} · {c.academicYear}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {c.schedule ? `${c.schedule} · ` : ""}
                      {c.room ? `Room ${c.room}` : "No room set"}
                    </p>
                    <p className="text-sm font-medium text-crimson-700">
                      {c._count.enrollments} students enrolled
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
