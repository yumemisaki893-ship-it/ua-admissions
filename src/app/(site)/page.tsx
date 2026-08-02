import Link from "next/link";
import {
  GraduationCap,
  ClipboardCheck,
  FileCheck2,
  ArrowRight,
  Landmark,
  Users,
  Globe2,
  FlaskConical,
  ShieldCheck,
  ScrollText,
  ExternalLink,
  BookOpen,
  Briefcase,
  MapPin,
  CalendarDays,
  PlayCircle,
  MonitorCheck,
  MessagesSquare,
} from "lucide-react";

import { HeroCarousel } from "@/components/shared/hero-carousel";
import { SectionHeading } from "@/components/shared/section-heading";
import { NewsCard, NewsCardSkeleton } from "@/components/shared/news-card";
import { CardCarousel } from "@/components/shared/card-carousel";
import { Seal } from "@/components/shared/seal";
import { Reveal } from "@/components/shared/reveal";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

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
    gradient: "from-crimson-700 via-crimson-800 to-crimson-950",
  }));
}

const corporate = [
  { icon: Landmark, name: "College of Arts and Sciences", code: "CAS", desc: "Communication, Psychology, Biology and more." },
  { icon: Users, name: "College of Management and Governance", code: "CMG", desc: "Business, Accountancy, Hospitality Management." },
  { icon: GraduationCap, name: "College of Teacher Education", code: "CTE", desc: "Elementary and Secondary Education majors." },
  { icon: Globe2, name: "College of Engineering & Architecture", code: "COEA", desc: "Information Technology, Civil, Electronics." },
  { icon: FlaskConical, name: "College of Computing & Information Sciences", code: "CCIS", desc: "Computer Science, Information Systems." },
  { icon: Briefcase, name: "College of Criminal Justice Education", code: "CCJE", desc: "Bachelor of Science in Criminology." },
];

const quickLinkKeys = ["admission", "student", "faculty", "other"] as const;
const quickLinkIcons = [MonitorCheck, Users, GraduationCap, MessagesSquare];

const campuses = [
  { name: "Main Campus", location: "Sibalom, Antique", href: "/about" },
  { name: "Tario Lim Memorial Campus", location: "Tobias Fornier, Antique", href: "https://tlmc.antiquespride.edu.ph" },
  { name: "Libertad Campus", location: "Libertad, Antique", href: "https://lc.antiquespride.edu.ph" },
  { name: "Caluya Campus", location: "Caluya, Antique", href: "https://www.antiquespride.edu.ph" },
  { name: "Hamtic Campus", location: "Hamtic, Antique", href: "https://hc.antiquespride.edu.ph" },
];

const careers = [
  {
    title: "Administrative Officer V (SG 18), Main Campus Sibalom",
    href: "https://www.antiquespride.edu.ph/we-are-hiring-18/",
  },
  {
    title: "Faculty — Filipino, College of Arts and Sciences (COS)",
    href: "https://www.antiquespride.edu.ph/we-are-hiring-17/",
  },
  {
    title: "Faculty — Hospitality Management and Criminology",
    href: "https://www.antiquespride.edu.ph/we-are-hiring-16/",
  },
];

/** Gradient icon tile — the new "clipart" style used across sections. */
function IconTile({
  icon: Icon,
  className,
  size = "h-11 w-11",
}: {
  icon: typeof Users;
  className?: string;
  size?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-crimson-700 to-crimson-900 text-white shadow-md shadow-crimson-900/25 ring-1 ring-amber-400/40",
        size,
        className,
      )}
    >
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-yellow-200/20" />
      <Icon className="relative h-[45%] w-[45%]" />
    </span>
  );
}

export default async function HomePage() {
  const [slides, news, announcements] = await Promise.all([
    getHeroSlides(),
    prisma.news.findMany({
      where: { published: true, category: "NEWS" },
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
    prisma.news.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 6,
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

      {/* Welcome + quick links */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, #dfae19 0, transparent 35%), radial-gradient(circle at 85% 75%, #9d0505 0, transparent 35%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-10">
            <Reveal className="shrink-0">
              <Seal size={128} className="animate-float" />
            </Reveal>
            <Reveal delay={100} className="text-center lg:text-left">
              <Badge className="border-amber-400/50 bg-yellow-500/10 text-yellow-200 ring-1 ring-amber-400/40">
                Transforming Lives &amp; Building Communities
              </Badge>
              <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Welcome to the{" "}
                <span className="bg-gradient-to-r from-crimson-300 to-amber-300 bg-clip-text text-transparent">
                  University of Antique
                </span>
              </h1>
              <p className="mt-4 max-w-2xl text-slate-400">
                A proud state university serving the province of Antique and Western Visayas through
                instruction, research, extension and production — with five campuses, one community.
              </p>
            </Reveal>
          </div>

          {/* Quick links — glassy sharp cards */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinkKeys.map((key, i) => {
              const group = siteConfig.quickLinks[key];
              const Icon = quickLinkIcons[i];
              return (
                <Reveal key={key} delay={i * 80}>
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-xl hover:shadow-black/40">
                    <span className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-yellow-500/20 to-amber-500/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative flex items-center justify-between gap-2">
                      <IconTile icon={Icon} size="h-10 w-10" />
                      <span className="rounded-full bg-crimson-700 px-2.5 py-0.5 font-mono text-[11px] font-bold text-white shadow-sm">
                        {group.items.length}
                      </span>
                    </div>
                    <h2 className="relative mt-4 font-display text-base font-semibold text-white">
                      {group.title}
                    </h2>
                    <p className="relative mt-1 text-xs text-slate-400">{group.description}</p>
                    <ul className="relative mt-3 space-y-1">
                      {group.items.slice(0, 3).map((item) => (
                        <li key={item.label}>
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm text-slate-300 transition-colors hover:text-crimson-300"
                          >
                            <ExternalLink className="h-3 w-3 shrink-0 text-amber-300" />
                            <span className="truncate">{item.label}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                    <span className="relative mt-3 inline-flex items-center gap-1 text-xs font-semibold text-crimson-300 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                      Explore <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats — glass over crimson */}
      <section className="relative overflow-hidden bg-gradient-to-br from-crimson-700 via-crimson-800 to-crimson-950">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 85% 15%, #dfae19 0, transparent 35%), radial-gradient(circle at 15% 85%, #3f0608 0, transparent 40%)",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-14 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            { value: siteConfig.stats.students, label: siteConfig.stats.studentsLabel, icon: Users },
            { value: siteConfig.stats.faculty, label: siteConfig.stats.facultyLabel, icon: GraduationCap },
            { value: siteConfig.stats.programs, label: siteConfig.stats.programsLabel, icon: BookOpen },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 100}>
              <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-7 text-center shadow-xl shadow-crimson-950/30 backdrop-blur-md">
                <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-yellow-300/10 blur-2xl" />
                <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-yellow-300 ring-1 ring-white/20">
                  <stat.icon className="h-6 w-6" />
                </span>
                <p className="mt-4 font-display text-4xl font-bold tabular-nums text-white sm:text-5xl">
                  <AnimatedCounter value={stat.value} />
                  <span className="text-yellow-300">+</span>
                </p>
                <p className="mt-2 text-sm text-red-50/90">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Institutional video */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] shadow-xl shadow-black/40">
              <iframe
                src="https://www.youtube.com/embed/TRLYbelduhc"
                title="University of Antique Institutional Video"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="space-y-4">
              <Badge className="bg-crimson-700 text-white shadow-md shadow-black/30">
                <PlayCircle className="mr-1 h-3.5 w-3.5" /> Institutional Video
              </Badge>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Experience the University of Antique
              </h2>
              <p className="text-slate-400">
                From our historic roots in Sibalom to a proud state university serving Western Visayas —
                watch the official institutional video and discover the community that awaits you.
              </p>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                  Accredited state university with a commitment to instruction, research, extension and production.
                </li>
                <li className="flex items-start gap-3">
                  <Users className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                  Five campuses across the province of Antique.
                </li>
                <li className="flex items-start gap-3">
                  <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                  A vibrant community of more than 25,000 students.
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How to apply */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Admission"
            title="Apply Online in Four Easy Steps"
            description="Our streamlined online application makes it easier than ever to become a University of Antique student."
          />
        </Reveal>
        <div className="stagger mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
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
              icon: FileCheck2,
              title: "Pay the Fee",
              description: "Settle the non-refundable application fee securely via GCash, Maya, or card.",
            },
            {
              icon: ArrowRight,
              title: "Track & Get Accepted",
              description: "Receive a reference number and monitor your status in real time.",
            },
          ].map((step, i) => (
            <Card
              key={step.title}
              className="group relative overflow-hidden border-white/10 bg-white/[0.05] shadow-sm transition-all hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-xl hover:shadow-black/40"
            >
              <CardContent className="space-y-4 p-6">
                <span className="pointer-events-none absolute -right-5 -top-5 font-display text-6xl font-bold text-white/[0.06] transition-colors duration-300 group-hover:text-yellow-500/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <IconTile icon={step.icon} className="transition-transform duration-300 group-hover:scale-110" />
                <h3 className="font-display text-lg font-semibold text-white">{step.title}</h3>
                <p className="text-sm text-slate-400">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Reveal delay={100}>
          <div className="mt-10 text-center">
            <Button
              size="lg"
              className="bg-crimson-700 text-white shadow-lg shadow-black/30 hover:bg-yellow-400 hover:text-slate-900"
              asChild
            >
              <Link href="/register">
                Start Your Application <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </section>

      {/* Programs preview */}
      <section className="border-y border-white/10 bg-white/[0.03] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Academics"
              title="Colleges & Degree Programs"
              description="Explore programs across our colleges — from education and engineering to business and nursing."
            />
          </Reveal>
          <Reveal delay={80}>
            <CardCarousel className="mt-12">
              {corporate.map((c) => (
                <Link key={c.code} href="/academics" className="group block h-full">
                  <Card className="h-full border-white/10 bg-white/[0.05] shadow-sm transition-all hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-xl hover:shadow-black/40">
                    <CardContent className="flex items-start gap-4 p-5">
                      <IconTile icon={c.icon} className="transition-transform duration-300 group-hover:scale-110" />
                      <div>
                        <p className="font-mono text-xs font-semibold text-crimson-300">{c.code}</p>
                        <h3 className="mt-0.5 font-display font-semibold text-white group-hover:text-crimson-300">
                          {c.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-400">{c.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </CardCarousel>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-10 text-center">
              <Button
                variant="outline"
                size="lg"
                className="border-amber-400/50 text-crimson-300 hover:bg-yellow-300 hover:text-slate-900"
                asChild
              >
                <Link href="/academics">
                  View All Programs <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* News, Announcements & Careers */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Updates"
            title="What's Happening at UA"
            description="Press releases, announcements, and careers from across the University of Antique."
          />
        </Reveal>
        <Reveal delay={80}>
          <Tabs defaultValue="news" className="mt-12">
            <div className="flex justify-center">
              <TabsList className="border border-white/10 bg-white/[0.05] shadow-sm">
                <TabsTrigger value="news" className="flex items-center gap-1.5 data-[state=active]:bg-crimson-700 data-[state=active]:text-white">
                  <ScrollText className="h-3.5 w-3.5" /> News
                </TabsTrigger>
                <TabsTrigger value="announcements" className="flex items-center gap-1.5 data-[state=active]:bg-crimson-700 data-[state=active]:text-white">
                  <ShieldCheck className="h-3.5 w-3.5" /> Announcements
                </TabsTrigger>
                <TabsTrigger value="careers" className="flex items-center gap-1.5 data-[state=active]:bg-crimson-700 data-[state=active]:text-white">
                  <Briefcase className="h-3.5 w-3.5" /> Careers
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="news" className="mt-10">
              <CardCarousel>
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
              </CardCarousel>
              <div className="mt-10 text-center">
                <Button
                  variant="outline"
                  className="border-amber-400/70 text-crimson-300 hover:bg-yellow-300 hover:text-slate-900"
                  asChild
                >
                  <Link href="/news">
                    View All News <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="announcements" className="mt-10">
              <div className="mx-auto grid max-w-3xl gap-3">
                {announcements.slice(0, 6).map((item) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.slug}`}
                    className="group flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.05] p-4 shadow-sm transition-all hover:border-amber-400/40 hover:shadow-md hover:shadow-black/40"
                  >
                    <span className="mt-1 inline-flex h-2.5 w-2.5 shrink-0 animate-pulse-ring rounded-full bg-crimson-500" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-200 group-hover:text-crimson-300">
                        {item.title}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                        <CalendarDays className="h-3 w-3" />
                        {formatDate(item.publishedAt)}
                      </p>
                    </div>
                    <ArrowRight className="ml-auto mt-1 h-4 w-4 shrink-0 text-amber-300 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="careers" className="mt-10">
              <div className="mx-auto grid max-w-3xl gap-3">
                {careers.map((job) => (
                  <a
                    key={job.title}
                    href={job.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.05] p-4 shadow-sm transition-all hover:border-amber-400/40 hover:shadow-md hover:shadow-black/40"
                  >
                    <IconTile icon={Briefcase} size="h-10 w-10" />
                    <div>
                      <p className="text-sm font-medium text-slate-200 group-hover:text-crimson-300">{job.title}</p>
                      <p className="mt-1 text-xs text-slate-400">University of Antique · Hiring</p>
                    </div>
                    <ExternalLink className="ml-auto mt-1 h-4 w-4 shrink-0 text-amber-300" />
                  </a>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Reveal>
      </section>

      {/* Campuses */}
      <section className="border-y border-white/10 bg-white/[0.03] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Locations"
              title="Five Campuses, One University"
              description="The University of Antique serves the whole province through its main campus in Sibalom and four satellite campuses."
            />
          </Reveal>
          <Reveal delay={80}>
            <CardCarousel className="mt-12" itemsPerView="md">
              {campuses.map((campus) => (
                <a
                  key={campus.name}
                  href={campus.href}
                  {...(campus.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex h-full flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.05] p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-lg hover:shadow-black/40"
                >
                  <IconTile icon={MapPin} className="transition-transform duration-300 group-hover:scale-110" />
                  <div>
                    <h3 className="font-display font-semibold text-white group-hover:text-crimson-300">{campus.name}</h3>
                    <p className="mt-1 text-xs text-slate-400">{campus.location}</p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-crimson-300">
                    Visit campus <ExternalLink className="h-3 w-3" />
                  </span>
                </a>
              ))}
            </CardCarousel>
          </Reveal>
        </div>
      </section>

      {/* Transparency seals */}
      <section className="border-b border-white/10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-crimson-300">
            Transparency &amp; Accountability
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {siteConfig.transparencySeals.map((seal) => (
              <a
                key={seal.label}
                href={seal.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-5 py-2.5 text-sm font-medium text-slate-300 shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-400/70 hover:shadow-md hover:text-crimson-300"
              >
                <ShieldCheck className="h-4 w-4 text-amber-300" />
                {seal.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-crimson-700 py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, #dfae19 0, transparent 40%), radial-gradient(circle at 20% 90%, #3f0608 0, transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-white/15 bg-white/10 p-8 shadow-2xl shadow-crimson-950/40 backdrop-blur-md sm:p-10 lg:flex-row lg:text-left">
            <div className="max-w-xl space-y-2 text-center lg:text-left">
              <Badge className="bg-yellow-300/15 text-yellow-200 ring-1 ring-yellow-300/40">Admissions open</Badge>
              <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                Take the first step toward your future at UA.
              </h2>
              <p className="text-red-50">
                Online applications for the upcoming academic year are now being accepted through the UA Student Services.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="bg-yellow-300 text-crimson-900 shadow-lg shadow-crimson-950/30 hover:bg-white"
                asChild
              >
                <Link href="/register">Apply Now</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-yellow-300 hover:text-crimson-900"
                asChild
              >
                <Link href="/news">Read Campus News</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
