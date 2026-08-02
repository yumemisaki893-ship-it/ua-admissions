import Link from "next/link";
import { GraduationCap, ClipboardCheck, FileCheck2, CreditCard, ArrowRight, Landmark, Users, Globe2, FlaskConical } from "lucide-react";

import { HeroCarousel } from "@/components/shared/hero-carousel";
import { SectionHeading } from "@/components/shared/section-heading";
import { NewsCard, NewsCardSkeleton } from "@/components/shared/news-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getHeroSlides() {
  const items = await prisma.news.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      excerpt: true,
      imageUrl: true,
      category: true,
      publishedAt: true,
      slug: true,
    },
  });

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    excerpt: item.excerpt ?? "Read the latest updates from the University of Antique.",
    imageUrl: item.imageUrl,
    category: item.category,
    publishedAt: item.publishedAt,
    href: `/news/${item.slug}`,
    gradient: "from-sky-700 via-sky-800 to-navy-900",
  }));
}

const steps = [
  {
    icon: GraduationCap,
    title: "Create an Account",
    description: "Sign up with your email and password to start your application.",
  },
  {
    icon: ClipboardCheck,
    title: "Fill Out & Upload",
    description: "Complete your personal information, pick a course, and upload requirements.",
  },
  {
    icon: CreditCard,
    title: "Pay the Fee",
    description: "Settle the non-refundable application fee securely via GCash, Maya, or card.",
  },
  {
    icon: FileCheck2,
    title: "Track & Get Accepted",
    description: "Receive a reference number and monitor your status in real time.",
  },
];

const stats = [
  { value: "70+", label: "Degree Programs" },
  { value: "10+", label: "Colleges & Campuses" },
  { value: "20k+", label: "Students" },
  { value: "60+", label: "Years of Excellence" },
];

export default async function HomePage() {
  const [slides, news] = await Promise.all([
    getHeroSlides(),
    prisma.news.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        excerpt: true,
        imageUrl: true,
        category: true,
        publishedAt: true,
        slug: true,
      },
    }),
  ]);

  return (
    <>
      <HeroCarousel slides={slides} />

      {/* Stats strip */}
      <section className="border-b bg-sky-700">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl font-semibold text-white sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-sky-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How to apply */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Admission"
          title="Apply Online in Four Easy Steps"
          description="Our streamlined online application makes it easier than ever to become a University of Antique student."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Card key={step.title} className="relative overflow-hidden">
              <CardContent className="space-y-4 p-6">
                <span className="absolute right-4 top-4 font-display text-5xl font-bold text-muted/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-200">
                  <step.icon className="h-6 w-6" />
                </span>
                <h3 className="font-display text-lg font-semibold text-navy-900">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button size="lg" asChild>
            <Link href="/register">
              Start Your Application <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Programs preview */}
      <section className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Academics"
            title="Colleges & Degree Programs"
            description="Explore programs across our colleges — from education and engineering to business and nursing."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Landmark, name: "College of Arts and Sciences", code: "CAS", desc: "Communication, Psychology, Biology and more." },
              { icon: Users, name: "College of Business and Accountancy", code: "CBA", desc: "Accountancy, Financial Management, Marketing." },
              { icon: GraduationCap, name: "College of Education", code: "COE", desc: "Elementary and Secondary Education majors." },
              { icon: Globe2, name: "College of Engineering and Design", code: "COED", desc: "Information Technology, Civil, Electronics." },
              { icon: FlaskConical, name: "College of Nursing", code: "CON", desc: "Bachelor of Science in Nursing." },
              { icon: GraduationCap, name: "Graduate School", code: "GS", desc: "Masteral and doctoral programs." },
            ].map((c) => (
              <Link key={c.code} href="/academics" className="group">
                <Card className="h-full transition-all hover:border-sky-300 hover:shadow-md">
                  <CardContent className="flex items-start gap-4 p-5">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-sky-400">
                      <c.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-mono text-xs font-semibold text-sky-600">{c.code}</p>
                      <h3 className="mt-0.5 font-display font-semibold text-navy-900 group-hover:text-sky-700">
                        {c.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/academics">
                View All Programs <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* News preview */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Updates"
          title="News & Events"
          description="Press releases, announcements, and campus life at the University of Antique."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.length > 0
            ? news.map((item) => (
                <NewsCard
                  key={item.id}
                  slug={item.slug}
                  title={item.title}
                  excerpt={item.excerpt}
                  imageUrl={item.imageUrl}
                  category={item.category}
                  publishedAt={item.publishedAt}
                />
              ))
            : [0, 1, 2].map((i) => <NewsCardSkeleton key={i} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-950 py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 lg:flex-row lg:px-8 lg:text-left">
          <div className="max-w-xl space-y-2">
            <Badge className="bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/40">Admissions open</Badge>
            <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
              Take the first step toward your future at UA.
            </h2>
            <p className="text-navy-300">
              Applications for Academic Year 2026-2027 are now being accepted.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/register">Apply Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white" asChild>
              <Link href="/news">Read Campus News</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
