import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

function toGWA(grade: number): number {
  return grade >= 96 ? 1.0 : grade >= 91 ? 1.25 : grade >= 86 ? 1.5 : grade >= 81 ? 1.75 : grade >= 76 ? 2.0 : grade >= 71 ? 2.25 : grade >= 66 ? 2.5 : grade >= 61 ? 2.75 : grade >= 56 ? 3.0 : 5.0;
}

export default async function GradesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "STUDENT") redirect("/admin");

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      enrollments: {
        include: {
          class: {
            include: {
              subject: true,
              teacher: { select: { name: true } },
            },
          },
        },
        orderBy: [{ class: { academicYear: "desc" } }, { class: { semester: "asc" } }],
      },
    },
  });

  const graded = profile?.enrollments.filter((e) => e.grade != null) ?? [];
  const totalUnits = graded.reduce((sum, e) => sum + (e.class.subject.units ?? 0), 0);
  const weighted = graded.reduce(
    (sum, e) => sum + (e.grade ?? 0) * (e.class.subject.units ?? 0),
    0,
  );
  const gwa = totalUnits > 0 ? (weighted / totalUnits).toFixed(2) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Grades</h1>
          <p className="text-sm text-muted-foreground">
            {profile?.studentNumber ? `Student No. ${profile.studentNumber} · ` : ""}
            {graded.length} graded subject{graded.length === 1 ? "" : "s"}
            {gwa ? ` · GWA ${gwa}` : ""}
          </p>
        </div>
        {gwa && (
          <Card className="min-w-40">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">General Weighted Average</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-crimson-700">{gwa}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {!profile ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Your student profile has not been set up yet. Contact the registrar&apos;s office.
          </CardContent>
        </Card>
      ) : profile.enrollments.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            You are not enrolled in any classes yet. Grades will appear here once your teachers submit them.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Subject</th>
                  <th className="px-4 py-3 font-medium">Section</th>
                  <th className="px-4 py-3 font-medium">Semester</th>
                  <th className="px-4 py-3 font-medium">Teacher</th>
                  <th className="px-4 py-3 text-center font-medium">Units</th>
                  <th className="px-4 py-3 text-center font-medium">Grade</th>
                  <th className="px-4 py-3 text-center font-medium">Equiv.</th>
                </tr>
              </thead>
              <tbody>
                {profile.enrollments.map((e) => (
                  <tr key={e.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">
                        {e.class.subject.code} — {e.class.subject.title}
                      </p>
                      {e.remarks && <p className="text-xs text-muted-foreground">{e.remarks}</p>}
                    </td>
                    <td className="px-4 py-3">{e.class.section}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {e.class.semester} · {e.class.academicYear}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{e.class.teacher.name ?? "—"}</td>
                    <td className="px-4 py-3 text-center">{e.class.subject.units}</td>
                    <td className="px-4 py-3 text-center">
                      {e.grade == null ? (
                        <Badge variant="outline">In progress</Badge>
                      ) : (
                        <span className="font-semibold text-crimson-700">{e.grade}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground">
                      {e.grade == null ? "—" : toGWA(e.grade).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground">
        Grade equivalent scale: 96–100 = 1.00, 91–95 = 1.25, 86–90 = 1.50, 81–85 = 1.75, 76–80 = 2.00,
        71–75 = 2.25, 66–70 = 2.50, 61–65 = 2.75, 56–60 = 3.00, below 56 = 5.00. Questions about grades
        should be directed to your teacher or the registrar&apos;s office.
      </p>
    </div>
  );
}
