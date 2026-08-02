import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { CourseCard, CourseCardSkeleton } from "@/components/shared/course-card";
import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
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
      <section className="relative overflow-hidden border-b border-amber-200 bg-gradient-to-br from-crimson-700 via-crimson-800 to-crimson-950 py-16 text-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle at 25% 25%, #dfae19 0, transparent 40%), radial-gradient(circle at 80% 70%, #3f0608 0, transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <Image
            src="/ua/ua-seal.png"
            alt="University of Antique seal"
            width={72}
            height={72}
            className="mx-auto rounded-full bg-white/10 p-1 ring-1 ring-yellow-300/60"
          />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">Academics</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
            Colleges & Degree Programs
          </h1>
          <p className="mt-4 text-red-50">
            {colleges.length} colleges · {totalCourses} degree programs · one shared commitment to excellence.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-20 px-4 py-16 sm:px-6 lg:px-8">
        {colleges.map((college, ci) => (
          <section key={college.id} id={college.slug} className="scroll-mt-24">
            <Reveal delay={ci % 2 === 0 ? 0 : 60}>
              <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="font-mono text-sm font-semibold text-crimson-300">{college.code}</span>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-white sm:text-3xl">
                    {college.name}
                  </h2>
                  {college.description && (
                    <p className="mt-2 max-w-2xl text-slate-400">{college.description}</p>
                  )}
                </div>
                <Badge className="w-fit bg-crimson-700 text-white">
                  {college.courses.length} program{college.courses.length === 1 ? "" : "s"}
                </Badge>
              </div>
            </Reveal>

            {college.courses.length > 0 ? (
              <div className="stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                <CardContent className="p-8 text-center text-slate-400">
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

        <Reveal>
          <section id="graduate-school" className="scroll-mt-24 rounded-2xl border border-amber-400/50 bg-gradient-to-br from-crimson-700/10 via-white/[0.05] to-amber-500/10 p-8 sm:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crimson-300">Graduate School</p>
                <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                  Advance your education with masteral & doctoral programs
                </h2>
                <p className="text-slate-300">
                  The UA Graduate School offers advanced degrees in education, management, public administration,
                  and more — designed for working professionals.
                </p>
              </div>
              <Card className="border-amber-400/40 bg-white/[0.06] shadow-lg ring-1 ring-amber-400/40">
                <CardContent className="space-y-4 p-8 text-sm text-slate-300">
                  <p>
                    <strong className="text-crimson-300">Admission tip:</strong> Graduate school applicants should
                    prepare their Transcript of Records (TOR), diploma, and recommendation letters.
                  </p>
                  <p>
                    For inquiries, contact the Graduate School Office or email{" "}
                    <span className="text-crimson-300">gradschool@universityofantique.edu.ph</span>.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </Reveal>
      </div>
    </>
  );
}
