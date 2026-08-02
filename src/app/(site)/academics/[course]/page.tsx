import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Briefcase, Clock, GraduationCap, Calendar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { renderRichText } from "@/lib/rich-text";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: { course: string } }) {
  const course = await prisma.course.findUnique({ where: { slug: params.course } });
  if (!course) return { title: "Course Not Found" };
  return { title: `${course.name} (${course.code})`, description: course.description };
}

export default async function CourseDetailPage({ params }: { params: { course: string } }) {
  const course = await prisma.course.findUnique({
    where: { slug: params.course },
    include: { college: true },
  });

  if (!course) notFound();

  const curriculumHtml = renderRichText(course.curriculum);

  return (
    <>
      <section className="border-b border-amber-200 bg-gradient-to-br from-crimson-700 via-crimson-800 to-crimson-950 py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/academics"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-yellow-200 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> All Programs
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Badge className="bg-yellow-300 text-crimson-900">{course.college.code}</Badge>
            <Badge variant="outline" className="border-white/40 text-white">
              {course.durationYears} year{coursePlural(course.durationYears)}
            </Badge>
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
            {course.name} <span className="font-mono text-xl text-yellow-200">({course.code})</span>
          </h1>
          <p className="mt-3 max-w-2xl text-red-50">{course.college.name}</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-10">
            <section className="space-y-3">
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-white">
                <GraduationCap className="h-5 w-5 text-crimson-300" /> Program Overview
              </h2>
              <p className="leading-relaxed text-slate-400">{course.description}</p>
            </section>

            <section className="space-y-3">
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-white">
                <Briefcase className="h-5 w-5 text-crimson-300" /> Career Opportunities
              </h2>
              {course.careerOpportunities.length > 0 ? (
                <ul className="grid gap-2 sm:grid-cols-2">
                  {course.careerOpportunities.map((career) => (
                    <li
                      key={career}
                      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2.5 text-sm shadow-sm"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                      <span className="text-slate-300">{career}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400">Career information is being updated.</p>
              )}
            </section>

            {curriculumHtml && (
              <section className="space-y-3">
                <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-white">
                  <Calendar className="h-5 w-5 text-crimson-300" /> Curriculum
                </h2>
                <Card className="border-white/10 bg-white/[0.05] shadow-sm">
                  <CardContent className="rich-text p-6" dangerouslySetInnerHTML={{ __html: curriculumHtml }} />
                </Card>
              </section>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <Card className="border-white/10 bg-white/[0.05] shadow-sm transition-all hover:shadow-lg hover:shadow-black/40">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-crimson-500/15 text-crimson-300 ring-1 ring-crimson-400/30">
                    <Clock className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs text-slate-400">Duration</p>
                    <p className="font-medium text-white">{course.durationYears} years</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-crimson-500/15 text-crimson-300 ring-1 ring-crimson-400/30">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs text-slate-400">College</p>
                    <p className="font-medium text-white">{course.college.name}</p>
                  </div>
                </div>
                <Button
                  className="w-full bg-crimson-700 text-white hover:bg-yellow-400 hover:text-slate-900"
                  size="lg"
                  asChild
                >
                  <Link href="/register">Apply for this program</Link>
                </Button>
                <p className="text-center text-xs text-slate-400">
                  Non-refundable application fee of PHP {course.applicationFee.toLocaleString()} applies.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-amber-400/50 bg-yellow-500/10">
              <CardContent className="p-6 text-sm leading-relaxed text-slate-300">
                <p className="font-display font-semibold text-yellow-200">Need help choosing?</p>
                <p className="mt-2">
                  Our admissions office is happy to guide you. Call us at (036) 540-9208 or visit the Office of
                  Admissions.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}

function coursePlural(years: number) {
  return years > 1 ? "s" : "";
}
