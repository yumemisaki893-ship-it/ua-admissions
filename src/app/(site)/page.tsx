import Link from "next/link";
import Image from "next/image";
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
import { Reveal } from "@/components/shared/reveal";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";
import { formatDate } from "@/lib/utils";

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
    gradient: "from-crimson-800 via-crimson-950 to-navy-950",
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

      {/* Official header strip */}
      <section className="relative overflow-hidden border-b border-gold-300/20 bg-gradient-to-br from-crimson-900 via-navy-950 to-navy-950">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle at 25% 25%, #f2de5e 0, transparent 40%), radial-gradient(circle at 80% 70%, #9d0505 0, transparent 45%)",
          }}
        />
        <div className="relative py-14 text-center">
          <Image
            src="/ua/ua-seal.png"
            alt="University of Antique seal"
            width={88}
            height={88}
            className="mx-auto animate-scale-in rounded-full bg-white/10 p-1.5 ring-2 ring-gold-300/50"
          />
          <div className="mx-auto mt-5 max-w-3xl px-4 sm:px-6">
            <Badge className="border-gold-300/40 bg-gold-300/10 text-gold-300 ring-1 ring-gold-300/40">
              Republic of the Philippines
            </Badge>
            <h1 className="mt-4 font-display text-3xl font-semibold text-white sm:text-5xl">
              {siteConfig.name}
            </h1>
            <p className="mt-4 font-display text-xl italic text-gold-300 sm:text-2xl">{siteConfig.tagline}</p>
            <div className="mx-auto mt-6 flex max-w-md items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-300/60" />
              <span className="h-2 w-2 rotate-45 border border-gold-300/70" />
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-300/60" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="border-b border-white/10 bg-navy-950">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {quickLinkKeys.map((key, i) => {
            const group = siteConfig.quickLinks[key];
            const Icon = quickLinkIcons[i];
            return (
              <Reveal key={key} delay={i * 80}>
                <Card className="group h-full border-white/10 bg-navy-900/70 transition-all hover:-translate-y-1 hover:border-gold-300/40 hover:shadow-lg hover:shadow-crimson-950/40">
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-crimson-700/40 text-gold-300 ring-1 ring-crimson-700/50">
                          <Icon className="h-4 w-4" />
                        </span>
                        <h2 className="font-display font-semibold text-white">{group.title}</h2>
                      </div>
                      <Badge className="bg-crimson-700 text-white">{group.items.length}</Badge>
                    </div>
                    <p className="text-xs text-navy-400">{group.description}</p>
                    <ul className="space-y-1">
                      {group.items.map((item) => (
                        <li key={item.label}>
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link flex items-center gap-1.5 text-sm text-navy-200 transition-colors hover:text-gold-300"
                          >
                            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-gold-300/60" />
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Stats counters */}
      <section className="border-y border-gold-300/20 bg-crimson-900">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-gold-300/15 px-4 py-14 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
          {[
            { value: siteConfig.stats.students, label: siteConfig.stats.studentsLabel, icon: Users },
            { value: siteConfig.stats.faculty, label: siteConfig.stats.facultyLabel, icon: GraduationCap },
            { value: siteConfig.stats.programs, label: siteConfig.stats.programsLabel, icon: BookOpen },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 100} className="py-6 text-center sm:py-0">
              <stat.icon className="mx-auto h-7 w-7 text-gold-300" />
              <p className="mt-3 font-display text-5xl font-bold tabular-nums text-white">
                <AnimatedCounter value={stat.value} />
                <span className="text-gold-300">+</span>
              </p>
              <p className="mt-2 text-sm text-navy-100">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Institutional video */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-gold-300/20 bg-navy-900 shadow-2xl shadow-crimson-950/40">
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
              <Badge className="bg-crimson-700/30 text-gold-300 ring-1 ring-crimson-700/50">
                <PlayCircle className="mr-1 h-3.5 w-3.5" /> Institutional Video
              </Badge>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Experience the University of Antique
              </h2>
              <p className="text-navy-200">
                From our historic roots in Sibalom to a proud state university serving Western Visayas —
                watch the official institutional video and discover the community that awaits you.
              </p>
              <ul className="space-y-3 text-sm text-navy-100">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                  Accredited state university with a commitment to instruction, research, extension and production.
                </li>
                <li className="flex items-start gap-3">
                  <Users className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                  Five campuses across the province of Antique.
                </li>
                <li className="flex items-start gap-3">
                  <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                  A vibrant community of more than 25,000 students.
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How to apply */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Admission"
            title="Apply Online in Four Easy Steps"
            description="Our streamlined online application makes it easier than ever to become a University of Antique student."
          />
        </Reveal>
        <div className="stagger mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
            <Card key={step.title} className="relative overflow-hidden border-white/10 bg-navy-900/60 transition-all hover:-translate-y-1 hover:border-gold-300/40 hover:shadow-lg hover:shadow-crimson-950/40">
              <CardContent className="space-y-4 p-6">
                <span className="absolute right-4 top-4 font-display text-5xl font-bold text-white/10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-crimson-700/30 text-gold-300 ring-1 ring-crimson-700/50 transition-transform group-hover:scale-110">
                  <step.icon className="h-6 w-6" />
                </span>
                <h3 className="font-display text-lg font-semibold text-white">{step.title}</h3>
                <p className="text-sm text-navy-300">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Reveal delay={100}>
          <div className="mt-10 text-center">
            <Button
              size="lg"
              className="bg-crimson-700 text-white shadow-lg shadow-crimson-950/50 hover:bg-gold-300 hover:text-navy-950"
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
      <section className="border-y border-white/10 bg-navy-900/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Academics"
              title="Colleges & Degree Programs"
              description="Explore programs across our colleges — from education and engineering to business and nursing."
            />
          </Reveal>
          <div className="stagger mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {corporate.map((c) => (
              <Link key={c.code} href="/academics" className="group">
                <Card className="h-full border-white/10 bg-navy-900/60 transition-all hover:-translate-y-1 hover:border-gold-300/50 hover:shadow-md hover:shadow-crimson-900/20">
                  <CardContent className="flex items-start gap-4 p-5">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-crimson-700/40 text-gold-300 transition-transform group-hover:scale-110">
                      <c.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-mono text-xs font-semibold text-gold-300">{c.code}</p>
                      <h3 className="mt-0.5 font-display font-semibold text-white group-hover:text-gold-300">
                        {c.name}
                      </h3>
                      <p className="mt-1 text-sm text-navy-300">{c.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <Reveal delay={100}>
            <div className="mt-10 text-center">
              <Button
                variant="outline"
                size="lg"
                className="border-gold-300/40 text-gold-300 hover:bg-gold-300 hover:text-navy-950"
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
              <TabsList className="border border-white/10 bg-navy-900/70">
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
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              <div className="mt-10 text-center">
                <Button
                  variant="outline"
                  className="border-gold-300/40 text-gold-300 hover:bg-gold-300 hover:text-navy-950"
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
                    className="group flex items-start gap-4 rounded-xl border border-white/10 bg-navy-900/60 p-4 transition-all hover:border-gold-300/50 hover:bg-navy-900"
                  >
                    <span className="mt-1 inline-flex h-2.5 w-2.5 shrink-0 animate-pulse-ring rounded-full bg-gold-300" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-navy-100 group-hover:text-gold-300">
                        {item.title}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-navy-400">
                        <CalendarDays className="h-3 w-3" />
                        {formatDate(item.publishedAt)}
                      </p>
                    </div>
                    <ArrowRight className="ml-auto mt-1 h-4 w-4 shrink-0 text-gold-300/50 transition-transform group-hover:translate-x-0.5" />
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
                    className="group flex items-start gap-4 rounded-xl border border-white/10 bg-navy-900/60 p-4 transition-all hover:border-gold-300/50 hover:bg-navy-900"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-crimson-700/40 text-gold-300">
                      <Briefcase className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-navy-100 group-hover:text-gold-300">{job.title}</p>
                      <p className="mt-1 text-xs text-navy-400">University of Antique · Hiring</p>
                    </div>
                    <ExternalLink className="ml-auto mt-1 h-4 w-4 shrink-0 text-gold-300/50" />
                  </a>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Reveal>
      </section>

      {/* Campuses */}
      <section className="border-y border-white/10 bg-navy-900/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Locations"
              title="Five Campuses, One University"
              description="The University of Antique serves the whole province through its main campus in Sibalom and four satellite campuses."
            />
          </Reveal>
          <div className="stagger mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {campuses.map((campus) => (
              <a
                key={campus.name}
                href={campus.href}
                {...(campus.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex flex-col gap-3 rounded-xl border border-white/10 bg-navy-950/80 p-5 transition-all hover:-translate-y-1 hover:border-gold-300/50 hover:shadow-lg hover:shadow-crimson-950/40"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-crimson-700/40 text-gold-300 transition-transform group-hover:scale-110">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display font-semibold text-white group-hover:text-gold-300">{campus.name}</h3>
                  <p className="mt-1 text-xs text-navy-300">{campus.location}</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-gold-300">
                  Visit campus <ExternalLink className="h-3 w-3" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency seals */}
      <section className="border-t border-white/10 bg-navy-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            Transparency & Accountability
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {siteConfig.transparencySeals.map((seal) => (
              <a
                key={seal.label}
                href={seal.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-navy-900/60 px-5 py-2.5 text-sm font-medium text-navy-200 transition-all hover:-translate-y-0.5 hover:border-gold-300/50 hover:text-gold-300"
              >
                <ShieldCheck className="h-4 w-4 text-gold-300" />
                {seal.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-navy-950 py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle at 80% 20%, #f2de5e 0, transparent 40%), radial-gradient(circle at 20% 90%, #9d0505 0, transparent 45%)",
          }}
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 lg:flex-row lg:px-8 lg:text-left">
          <div className="max-w-xl space-y-2">
            <Badge className="bg-gold-300/15 text-gold-300 ring-1 ring-gold-300/40">Admissions open</Badge>
            <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
              Take the first step toward your future at UA.
            </h2>
            <p className="text-navy-300">
              Online applications for the upcoming academic year are now being accepted through the UA Student Services.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="bg-crimson-700 text-white shadow-lg shadow-crimson-950/60 hover:bg-gold-300 hover:text-navy-950"
              asChild
            >
              <Link href="/register">Apply Now</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-gold-300 hover:text-navy-950"
              asChild
            >
              <Link href="/news">Read Campus News</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
