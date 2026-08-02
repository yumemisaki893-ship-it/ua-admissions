import { prisma } from "@/lib/prisma";
import { CourseCard, CourseCardSkeleton } from "@/components/shared/course-card";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AcademicsPage() {
  const colleges = await prisma.college.findMany({
    include: { courses: { orderBy: { code: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });

  const totalCourses = colleges.reduce((sum, c) => sum + c.courses.length, 0);

  return (
    <>
      <section className="border-b bg-gradient-to-br from-sky-800 to-navy-900 py-16 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Academics</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
            Colleges & Degree Programs
          </h1>
          <p className="mt-4 text-sky-100">
            {colleges.length} colleges · {totalCourses} degree programs · one shared commitment to excellence.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-20 px-4 py-16 sm:px-6 lg:px-8">
        {colleges.map((college) => (
          <section key={college.id} id={college.slug} className="scroll-mt-24">
            <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="font-mono text-sm font-semibold text-sky-600">{college.code}</span>
                <h2 className="mt-1 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
                  {college.name}
                </h2>
                {college.description && (
                  <p className="mt-2 max-w-2xl text-muted-foreground">{college.description}</p>
                )}
              </div>
            </div>

            {college.courses.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {college.courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    slug={course.slug}
                    code={course.code}
                    name={course.name}
                    description={course.description}
                    durationYears={course.durationYears}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Program details are being updated. Please check back soon.
                </CardContent>
              </Card>
            )}
          </section>
        ))}

        {colleges.length === 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        )}

        <section id="graduate-school" className="scroll-mt-24 rounded-2xl bg-navy-950 p-8 sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">Graduate School</p>
              <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                Advance your education with masteral & doctoral programs
              </h2>
              <p className="text-navy-300">
                The UA Graduate School offers advanced degrees in education, management, public administration,
                and more — designed for working professionals.
              </p>
            </div>
            <Card className="bg-white/5 ring-1 ring-white/10">
              <CardContent className="space-y-4 p-8 text-sm text-navy-200">
                <p>
                  <strong className="text-white">Admission tip:</strong> Graduate school applicants should
                  prepare their Transcript of Records (TOR), diploma, and recommendation letters.
                </p>
                <p>
                  For inquiries, contact the Graduate School Office or email{" "}
                  <span className="text-sky-400">gradschool@universityofantique.edu.ph</span>.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
