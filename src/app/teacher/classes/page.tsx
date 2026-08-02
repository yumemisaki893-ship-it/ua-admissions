import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function TeacherClassesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const classes = await prisma.class.findMany({
    where: { teacherId: session.user.id },
    include: { subject: true, _count: { select: { enrollments: true } } },
    orderBy: [{ academicYear: "desc" }, { semester: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Classes</h1>
        <p className="text-sm text-muted-foreground">
          Open a class to manage its roster and submit grades.
        </p>
      </div>

      {classes.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No classes assigned yet.
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
  );
}
