import { Landmark, Target, ScrollText, Music, ShieldCheck, CalendarCheck } from "lucide-react";
import Image from "next/image";

import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { renderRichText } from "@/lib/rich-text";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

const milestones = [
  {
    year: "1945",
    title: "Sibalom Municipal College",
    desc: "The University traces its roots to the post-war era educational institutions of Sibalom.",
  },
  {
    year: "1954",
    title: "School of Arts and Trades",
    desc: "Established as a vocational-technical school, the seed of today's university.",
  },
  {
    year: "1963",
    title: "National College of Agriculture and Technology",
    desc: "Expanded into agricultural and technological education for the province.",
  },
  {
    year: "1995",
    title: "Polytechnic State College of Antique",
    desc: "Became a chartered polytechnic state college serving the whole province.",
  },
  {
    year: "2010",
    title: "University of Antique",
    desc: "Converted into a state university by Republic Act 10082, growing into a Level IV institution.",
  },
  {
    year: "Today",
    title: "Five Campuses & 25,000+ Students",
    desc: "Serving Antique from Sibalom, Tobias Fornier, Libertad, Caluya and Hamtic.",
  },
];

const orgUnits = [
  { name: "Board of Regents", role: "Highest policy-making body of the University", level: 0 },
  { name: "Office of the University President", role: "Chief executive of the University", level: 1 },
  { name: "Office of the Vice President for Academic Affairs", role: "Oversees colleges and academic programs", level: 2 },
  { name: "Office of the Vice President for Administration & Finance", role: "Administrative and financial services", level: 2 },
  { name: "Office of the Vice President for Research, Extension & Production", role: "Research, extension, and production programs", level: 2 },
  { name: "Colleges & Graduate School", role: "Academic units offering degree programs", level: 3 },
  { name: "Registrar, Admissions, Student Services, Library, ICT", role: "Support services for students and faculty", level: 3 },
];

async function getContent() {
  const records = await prisma.siteContent.findMany({
    where: { key: { in: ["about_history", "about_vision", "about_mission", "about_hymn", "about_seal"] } },
  });
  const map = new Map(records.map((r) => [r.key, r.content]));
  return map;
}

export default async function AboutPage() {
  const content = await getContent();

  const history = renderRichText(content.get("about_history"));
  const vision = renderRichText(content.get("about_vision")) || "Vision statement coming soon.";
  const mission = renderRichText(content.get("about_mission")) || "Mission statement coming soon.";
  const hymn = renderRichText(content.get("about_hymn"));
  const sealDesc = renderRichText(content.get("about_seal"));

  return (
    <>
      <section className="relative overflow-hidden border-b border-gold-300/20 bg-gradient-to-br from-crimson-900 via-navy-950 to-navy-950 py-16 text-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle at 25% 25%, #f2de5e 0, transparent 40%), radial-gradient(circle at 80% 70%, #9d0505 0, transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">About the University</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
            A Legacy of Excellence Since 1954
          </h1>
          <p className="mt-4 text-navy-100">
            From a modest school of arts and trades to a Level IV state university serving the province of Antique.
          </p>
        </div>
      </section>

      {/* Quick facts band */}
      <section className="border-b border-white/10 bg-navy-950">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { value: "1954", label: "Year Established" },
            { value: "Level IV", label: "SUC Level Status" },
            { value: "5", label: "Campuses" },
            { value: "25,722", label: "Students Enrolled" },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 70} className="text-center">
              <p className="font-display text-3xl font-bold text-gold-300">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-navy-300">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* History timeline */}
      <section id="history" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Our Story"
            title="History of the University"
            description="A century of service through every chapter of our growth."
          />
        </Reveal>

        <div className="relative mx-auto mt-14 max-w-3xl">
          <span className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-gold-300/60 via-crimson-700/50 to-transparent sm:left-1/2" />
          <ol className="space-y-8">
            {milestones.map((m, i) => (
              <li key={m.year} className="relative">
                <Reveal
                  delay={i * 60}
                  className={`flex flex-col gap-3 pl-14 sm:w-1/2 sm:pl-0 ${
                    i % 2 === 0 ? "sm:pr-10 sm:text-right" : "sm:ml-auto sm:pl-10"
                  }`}
                >
                  <span
                    className={`absolute left-5 top-1 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2 border-gold-300 bg-navy-950 sm:left-auto ${
                      i % 2 === 0 ? "sm:-right-2 sm:translate-x-1/2" : "sm:-left-2 sm:-translate-x-1/2"
                    }`}
                  />
                  <div>
                    <Badge className="bg-crimson-700/40 text-gold-300 ring-1 ring-crimson-700/60">{m.year}</Badge>
                    <h3 className="mt-2 font-display text-lg font-semibold text-white">{m.title}</h3>
                    <p className="mt-1 text-sm text-navy-300">{m.desc}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        {history && (
          <Reveal delay={100}>
            <Card className="mt-14 border-white/10 bg-navy-900/60">
              <CardContent className="p-8">
                <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-gold-300">
                  <CalendarCheck className="h-5 w-5" /> A Closer Look
                </h3>
                <div className="rich-text mt-4" dangerouslySetInnerHTML={{ __html: history }} />
              </CardContent>
            </Card>
          </Reveal>
        )}
      </section>

      {/* VMGO */}
      <section id="vision-mission" className="scroll-mt-24 border-y border-white/10 bg-navy-900/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow="Direction" title="Vision, Mission & Quality Policy" />
          </Reveal>
          <div className="stagger mt-12 grid gap-6 md:grid-cols-2">
            <Card className="border-t-4 border-t-gold-300 border-white/10 bg-navy-900/60 transition-all hover:shadow-lg hover:shadow-crimson-950/40">
              <CardContent className="space-y-4 p-8">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-crimson-700/30 text-gold-300 ring-1 ring-crimson-700/50">
                  <Target className="h-6 w-6" />
                </span>
                <h3 className="font-display text-xl font-semibold text-white">Vision</h3>
                <div className="rich-text" dangerouslySetInnerHTML={{ __html: vision }} />
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-white/60 border-white/10 bg-navy-900/60 transition-all hover:shadow-lg hover:shadow-crimson-950/40">
              <CardContent className="space-y-4 p-8">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-crimson-700/30 text-gold-300 ring-1 ring-crimson-700/50">
                  <Landmark className="h-6 w-6" />
                </span>
                <h3 className="font-display text-xl font-semibold text-white">Mission</h3>
                <div className="rich-text" dangerouslySetInnerHTML={{ __html: mission }} />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Hymn */}
      <section id="hymn" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div>
              <SectionHeading
                align="left"
                eyebrow="School Pride"
                title="The University Hymn"
                description="Every UAntiqueno stands tall in song."
              />
              <div className="mt-8 space-y-4">
                {[
                  { label: "Motto", value: "Transforming Lives & Building Communities" },
                  { label: "Colors", value: "Crimson, Gold, and Dark Navy" },
                  { label: "Main Campus", value: siteConfig.address },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-3 text-sm">
                    <ScrollText className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                    <p>
                      <strong className="text-white">{row.label}:</strong>{" "}
                      <span className="text-navy-300">{row.value}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <Card className="border-white/10 bg-navy-900/60">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 text-gold-300">
                  <Music className="h-6 w-6" />
                  <h3 className="font-display text-lg font-semibold text-white">UA Hymn</h3>
                </div>
                <div className="mt-6 space-y-3 text-navy-100 [&_p]:my-3">
                  <div dangerouslySetInnerHTML={{ __html: hymn || "" }} />
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* Seal */}
      <section id="seal" className="border-y border-white/10 bg-navy-900/40 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <SectionHeading eyebrow="Symbol" title="The University Seal" />
          </Reveal>
          <Reveal delay={80}>
            <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-6">
              <div className="flex h-44 w-44 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-gold-300 to-crimson-800 shadow-xl ring-8 ring-white/10 transition-transform duration-300 hover:scale-105">
                <Image
                  src="/ua/ua-seal.png"
                  alt="The University of Antique official seal"
                  width={176}
                  height={176}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-navy-300">
                <ShieldCheck className="h-4 w-4 text-gold-300" />
                <span dangerouslySetInnerHTML={{ __html: sealDesc }} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Organization */}
      <section id="organization" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Governance"
            title="Organizational Structure"
            description="The University is led by the Board of Regents and administered by the Office of the University President."
          />
        </Reveal>
        <div className="stagger mt-12 mx-auto max-w-3xl space-y-3">
          {orgUnits.map((unit, i) => (
            <div
              key={unit.name}
              className={`flex items-start gap-4 rounded-lg border border-white/10 bg-navy-900/60 p-4 shadow-sm transition-all hover:border-gold-300/40 hover:bg-navy-900 ${
                unit.level > 0 ? "ml-4 border-l-2 border-l-gold-300/40 sm:ml-10" : "border-l-2 border-l-gold-300"
              }`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-crimson-700/30 font-mono text-xs font-bold text-gold-300">
                {i + 1}
              </span>
              <div>
                <p className="font-medium text-white">{unit.name}</p>
                <p className="text-sm text-navy-300">{unit.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
