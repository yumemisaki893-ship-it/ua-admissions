import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
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
  Ship,
  Wrench,
  School,
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
import { formatDate, slugify } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { getExternalLinkRows, getExternalLinks } from "@/lib/external-links";
import { isPosterImage } from "@/lib/image-type";

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
    poster: isPosterImage(item.imageUrl),
  }));
}

const corporate = [
  { icon: Landmark, name: "College of Arts and Sciences", code: "CAS", desc: "Psychology, Communication, English Language Studies, Community Development." },
  { icon: Users, name: "College of Management and Governance", code: "CMG", desc: "Accountancy, Business, Hospitality, Tourism, Public Administration." },
  { icon: GraduationCap, name: "College of Teacher Education", code: "CTE", desc: "Elementary, Secondary, Special Needs, Tech-Voc Teacher Education." },
  { icon: Globe2, name: "College of Engineering & Architecture", code: "COEA", desc: "Civil, Mechanical, Electrical, Electronics, Computer, Architecture." },
  { icon: FlaskConical, name: "College of Computing & Information Sciences", code: "CCIS", desc: "Computer Science, Information Technology, Library Science." },
  { icon: Briefcase, name: "College of Criminal Justice and Education", code: "CCJE", desc: "Criminology, Industrial Security Management." },
  { icon: Ship, name: "College of Maritime Studies", code: "CMS", desc: "Marine Engineering, Marine Transportation." },
  { icon: Wrench, name: "College of Industrial Technology", code: "CIT", desc: "Automotive, Electrical, Electronics, Drafting, Food Service." },
  { icon: School, name: "Laboratory High School", code: "LHS", desc: "Junior High School — Regular and STE." },
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
  const [slides, news, announcements, externalLinks, campusRows, careerRows] = await Promise.all([
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
    getExternalLinks(),
    getExternalLinkRows("campus"),
    getExternalLinkRows("career"),
  ]);

  const externalCampuses =
    campusRows.length > 0
      ? campusRows.map((row) => ({
          name: row.label,
          location: row.description ?? "",
          href: row.url,
        }))
      : campuses.filter((c) => c.href.startsWith("http"));
  const allCampuses = [
    { name: "Main Campus", location: "Sibalom, Antique", href: "/about" },
    ...externalCampuses,
  ];

  const careers =
    careerRows.length > 0
      ? careerRows.map((row) => ({ title: row.label, href: row.url }))
      : [
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

  return (
    <>
      <HeroCarousel slides={slides} />

      {/* Welcome + quick links */}
      <section className="relative overflow-hidden bg-white">
        <Image
          src="/ua/no-5.jpg"
          alt=""
          fill
          priority
          aria-hidden
          className="pointer-events-none object-cover blur-[2px] brightness-[0.85] scale-105"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-white/90" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-10">
            <Reveal className="shrink-0">
              <Seal size={128} className="animate-float" />
            </Reveal>
            <Reveal delay={100} className="text-center lg:text-left">
              <Badge className="border-amber-300 bg-yellow-50 text-crimson-700 ring-1 ring-amber-300">
                Transforming Lives &amp; Building Communities
              </Badge>
              <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Welcome to the{" "}
                <span className="bg-gradient-to-r from-crimson-700 to-crimson-900 bg-clip-text text-transparent">
                  University of Antique
                </span>
              </h1>
              <p className="mt-4 max-w-2xl text-slate-500">
                A proud state university serving the province of Antique and Western Visayas through
                instruction, research, extension and production — with five campuses, one community.
              </p>
            </Reveal>
          </div>

          {/* Portal & e-services — bold access cards */}
          <div className="mt-12">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crimson-700">
                    Student Portals &amp; E-Services
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
                    One-click access to UA systems
                  </h2>
                </div>
                <p className="max-w-sm text-sm text-slate-500">
                  Sign in to the Admission Portal, AIMS, LMS, HRIS and more — your gateway to University services.
                </p>
              </div>
            </Reveal>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {quickLinkKeys.map((key, i) => {
                const group = siteConfig.quickLinks[key];
                const Icon = quickLinkIcons[i];
                return (
                  <Reveal key={key} delay={i * 80}>
                    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-900/10">
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-crimson-700 via-crimson-700/60 to-amber-400 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                      />
                      <div className="relative flex items-center gap-3">
                        <IconTile icon={Icon} size="h-12 w-12" />
                        <div className="min-w-0">
                          <h3 className="truncate font-display text-base font-bold text-slate-900">
                            {group.title}
                          </h3>
                          <p className="truncate text-xs text-slate-500">{group.description}</p>
                        </div>
                      </div>
                      <ul className="relative mt-5 flex flex-1 flex-col gap-2.5">
                        {group.items.map((item) => (
                          <li key={item.label}>
                            <a
                              href={externalLinks[`quick-${slugify(item.label)}`] ?? item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/btn flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-bold outline-none transition-all duration-200 hover:border-crimson-700 hover:bg-crimson-700 hover:text-white hover:shadow-md hover:shadow-crimson-900/20 focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2"
                            >
                              <span className="truncate">{item.label}</span>
                              <ArrowRight className="h-4 w-4 shrink-0 text-amber-500 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:text-yellow-300" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                );
              })}
            </div>
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
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-amber-200 bg-slate-100 shadow-xl shadow-red-900/10">
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
              <Badge className="bg-crimson-700 text-white shadow-md shadow-crimson-900/20">
                <PlayCircle className="mr-1 h-3.5 w-3.5" /> Institutional Video
              </Badge>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Experience the University of Antique
              </h2>
              <p className="text-slate-500">
                From our historic roots in Sibalom to a proud state university serving Western Visayas —
                watch the official institutional video and discover the community that awaits you.
              </p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  Accredited state university with a commitment to instruction, research, extension and production.
                </li>
                <li className="flex items-start gap-3">
                  <Users className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  Five campuses across the province of Antique.
                </li>
                <li className="flex items-start gap-3">
                  <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  A vibrant community of more than 25,000 students.
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Programs preview */}
      <section className="border-y border-slate-200 bg-slate-50 py-20">
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
                  <Card className="h-full border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-md hover:shadow-red-900/10">
                    <CardContent className="flex items-start gap-4 p-5">
                      <IconTile icon={c.icon} className="transition-transform duration-300 group-hover:scale-110" />
                      <div>
                        <p className="font-mono text-xs font-semibold text-crimson-700">{c.code}</p>
                        <h3 className="mt-0.5 font-display font-semibold text-slate-900 group-hover:text-crimson-800">
                          {c.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">{c.desc}</p>
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
                className="border-amber-400/70 text-crimson-700 hover:bg-yellow-300 hover:text-slate-900"
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
              <TabsList className="border border-slate-200 bg-white shadow-sm">
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
                  className="border-amber-400/70 text-crimson-700 hover:bg-yellow-300 hover:text-slate-900"
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
                    className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-amber-300 hover:shadow-md hover:shadow-red-900/10"
                  >
                    <span className="mt-1 inline-flex h-2.5 w-2.5 shrink-0 animate-pulse-ring rounded-full bg-crimson-600" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-700 group-hover:text-crimson-700">
                        {item.title}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                        <CalendarDays className="h-3 w-3" />
                        {formatDate(item.publishedAt)}
                      </p>
                    </div>
                    <ArrowRight className="ml-auto mt-1 h-4 w-4 shrink-0 text-amber-500 transition-transform group-hover:translate-x-0.5" />
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
                    className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-amber-300 hover:shadow-md hover:shadow-red-900/10"
                  >
                    <IconTile icon={Briefcase} size="h-10 w-10" />
                    <div>
                      <p className="text-sm font-medium text-slate-700 group-hover:text-crimson-700">{job.title}</p>
                      <p className="mt-1 text-xs text-slate-400">University of Antique · Hiring</p>
                    </div>
                    <ExternalLink className="ml-auto mt-1 h-4 w-4 shrink-0 text-amber-500" />
                  </a>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Reveal>
      </section>

      {/* Campuses */}
      <section className="border-y border-slate-200 bg-slate-50 py-20">
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
              {allCampuses.map((campus) => (
                <a
                  key={campus.name}
                  href={campus.href}
                  {...(campus.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex h-full flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg hover:shadow-red-900/10"
                >
                  <IconTile icon={MapPin} className="transition-transform duration-300 group-hover:scale-110" />
                  <div>
                    <h3 className="font-display font-semibold text-slate-900 group-hover:text-crimson-800">{campus.name}</h3>
                    <p className="mt-1 text-xs text-slate-500">{campus.location}</p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-crimson-700">
                    Visit campus <ExternalLink className="h-3 w-3" />
                  </span>
                </a>
              ))}
            </CardCarousel>
          </Reveal>
        </div>
      </section>

      {/* Transparency seals */}
      <section className="border-b border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-crimson-700">
            Transparency &amp; Accountability
          </p>
          <div className="mt-8 flex flex-wrap items-stretch justify-center gap-5">
            {[
              {
                label: "Transparency Seal",
                href: "https://antiquespride.edu.ph/ua-transparency-seal/",
                src: "/ua/seals/transparency-seal.png",
                alt: "Transparency Seal",
                box: "h-32 w-32",
              },
              {
                label: "Freedom of Information",
                href: "/ua-transparency-seal",
                src: "/ua/seals/foi.png",
                alt: "Freedom of Information logo",
                box: "h-32 w-32",
              },
              {
                label: "Privacy Policy",
                href: "/privacy-policy",
                src: "/ua/seals/privacy-policy.png",
                alt: "Privacy Policy logo",
                box: "h-32 w-32",
              },
            ].map((seal) => (
              <a
                key={seal.label}
                href={seal.href}
                {...(seal.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex w-52 flex-col items-center gap-3 rounded-2xl bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg hover:shadow-red-900/10"
              >
                <span className={cn("flex items-center justify-center", seal.box)}>
                  <Image
                    src={seal.src}
                    alt={seal.alt}
                    width={512}
                    height={512}
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </span>
                <span className="text-sm font-semibold text-slate-700 transition-colors group-hover:text-crimson-800">
                  {seal.label}
                </span>
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
                className="border-white/40 bg-white/10 text-white backdrop-blur transition-all hover:border-white hover:bg-yellow-300 hover:text-crimson-900 hover:shadow-lg hover:shadow-yellow-300/30"
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
