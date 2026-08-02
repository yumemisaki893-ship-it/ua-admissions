import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap } from "lucide-react";
import { renderRichText } from "@/lib/rich-text";

export const dynamic = "force-dynamic";

export default async function CurriculumPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "STUDENT") redirect("/admin");

  const [profile, application] = await Promise.all([
    prisma.studentProfile.findUnique({ where: { userId: session.user.id } }),
    prisma.application.findFirst({
      where: { userId: session.user.id, status: { in: ["ACCEPTED", "UNDER_REVIEW", "PENDING"] } },
      orderBy: { updatedAt: "desc" },
      include: { course: { include: { college: true } } },
    }),
  ]);

  const course = application?.course ?? null;
  const curriculumHtml = course ? renderRichText(course.curriculum) : "";

  const subjects = course
    ? await prisma.subject.findMany({
        where: { collegeId: course.collegeId },
        orderBy: { code: "asc" },
      })
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
          <BookOpen className="h-6 w-6 text-crimson-700" /> Subjects &amp; Curriculum
        </h1>
        <p className="text-sm text-muted-foreground">
          Your program&apos;s curriculum and the subjects under your college.
        </p>
      </div>

      {!course ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {profile
              ? "No admitted program found yet. Your curriculum will appear here once your application is processed by the admissions office."
              : "Your student profile has not been set up yet. Contact the registrar's office."}
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="bg-gradient-to-br from-crimson-700 to-crimson-900 text-white">
            <CardContent className="flex items-start gap-4 p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                <GraduationCap className="h-6 w-6 text-yellow-300" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-yellow-200">
                  {course.college.name}
                </p>
                <h2 className="mt-1 text-xl font-semibold">
                  {course.code} — {course.name}
                </h2>
                <p className="mt-1 text-sm text-red-100">
                  {course.durationYears}-year program
                  {application?.status === "ACCEPTED" ? " · Admitted" : ` · Status: ${application?.status.replace("_", " ").toLowerCase() ?? "pending"}`}
                </p>
              </div>
            </CardContent>
          </Card>

          {curriculumHtml && (
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3 font-display text-lg font-semibold text-slate-900">Curriculum</h3>
                <div className="rich-text text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: curriculumHtml }} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <h3 className="mb-3 font-display text-lg font-semibold text-slate-900">
                Subjects ({subjects.length})
              </h3>
              {subjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No subjects have been listed for your college yet.</p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {subjects.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-2.5"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {s.code} — {s.title}
                        </p>
                        {s.units > 0 && (
                          <Badge variant="secondary" className="mt-0.5">
                            {s.units} units
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
