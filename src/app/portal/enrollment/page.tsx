import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Clock, MapPin, UserRound } from "lucide-react";

export const dynamic = "force-dynamic";

function toEquiv(grade: number): string {
  return grade >= 96 ? "1.00" : grade >= 91 ? "1.25" : grade >= 86 ? "1.50" : grade >= 81 ? "1.75" : grade >= 76 ? "2.00" : grade >= 71 ? "2.25" : grade >= 66 ? "2.50" : grade >= 61 ? "2.75" : grade >= 56 ? "3.00" : "5.00";
}

export default async function EnrollmentPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "STUDENT") redirect("/admin");

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      enrollments: {
        include: {
          class: {
            include: { subject: true, teacher: { select: { name: true } } },
          },
        },
        orderBy: [{ class: { academicYear: "desc" } }, { class: { semester: "asc" } }],
      },
    },
  });

  const enrollments = profile?.enrollments ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
          <ClipboardList className="h-6 w-6 text-crimson-700" /> My Enrollment
        </h1>
        <p className="text-sm text-muted-foreground">
          Your class enrollment status — which classes you are enrolled in and their current status.
        </p>
      </div>

      {!profile ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Your student profile has not been set up yet. Contact the registrar&apos;s office.
          </CardContent>
        </Card>
      ) : enrollments.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            You are not enrolled in any classes yet. Once your teachers enroll you, your class status
            will appear here.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {enrollments.map((e) => (
            <Card key={e.id} className="hover:border-amber-300">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {e.class.subject.code} — {e.class.subject.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Section {e.class.section} · {e.class.subject.units} units
                    </p>
                  </div>
                  {e.grade == null ? (
                    <Badge variant="outline" className="border-amber-300 bg-yellow-50 text-amber-700">
                      In progress
                    </Badge>
                  ) : (
                    <Badge className="bg-crimson-700 text-white">
                      Grade: {e.grade} · {toEquiv(e.grade)}
                    </Badge>
                  )}
                </div>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 shrink-0 text-amber-500" />
                    {e.class.teacher.name ?? "Teacher assigned"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-amber-500" />
                    {e.class.schedule ?? "Schedule TBA"} · {e.class.semester} {e.class.academicYear}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-amber-500" />
                    {e.class.room ? `Room ${e.class.room}` : "Room TBA"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
