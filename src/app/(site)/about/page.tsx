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
    year: "1954",
    title: "Antique School of Arts and Trades",
    desc: "Established on January 19, 1954 by virtue of Republic Act No. 851 through the efforts of Cong. Tobias A. Fornier. First classes opened on July 1, 1954 with 188 Secondary Trade and 53 Trade-Technical Education students.",
  },
  {
    year: "1982",
    title: "Polytechnic State College of Antique",
    desc: "Converted from a trade school into a state college on November 14, 1982 by Batas Pambansa Blg. 281, with Dr. Godofredo E. Gallega as its first president.",
  },
  {
    year: "2009",
    title: "University of Antique",
    desc: "Converted into a state university on November 10, 2009 by virtue of Republic Act No. 9746 signed by President Gloria Macapagal-Arroyo.",
  },
  {
    year: "Today",
    title: "Five Campuses & 25,000+ Students",
    desc: "Serving Antique from the main campus in Sibalom and campuses in Tibiao, Hamtic, Libertad, and Caluya.",
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
      <section className="relative overflow-hidden border-b border-amber-200 bg-gradient-to-br from-crimson-700 via-crimson-800 to-crimson-950 py-16 text-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle at 25% 25%, #dfae19 0, transparent 40%), radial-gradient(circle at 80% 70%, #3f0608 0, transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">About the University</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
            A Legacy of Excellence Since 1954
          </h1>
          <p className="mt-4 text-red-50">
            From a modest school of arts and trades to a Level IV state university serving the province of Antique.
          </p>
        </div>
      </section>

      {/* Quick facts band */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { value: "1954", label: "Year Established" },
            { value: "Level IV", label: "SUC Level Status" },
            { value: "5", label: "Campuses" },
            { value: "25,722", label: "Students Enrolled" },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 70} className="text-center">
              <p className="font-display text-3xl font-bold text-crimson-700">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">{stat.label}</p>
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
            description="From a school of arts and trades in 1954 to the University of Antique today."
          />
        </Reveal>

        <div className="relative mx-auto mt-14 max-w-3xl">
          <span className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-amber-400 via-crimson-700 to-transparent sm:left-1/2" />
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
                    className={`absolute left-5 top-1 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2 border-amber-400 bg-white sm:left-auto ${
                      i % 2 === 0 ? "sm:-right-2 sm:translate-x-1/2" : "sm:-left-2 sm:-translate-x-1/2"
                    }`}
                  />
                  <div>
                    <Badge className="bg-crimson-700 text-white">{m.year}</Badge>
                    <h3 className="mt-2 font-display text-lg font-semibold text-slate-900">{m.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{m.desc}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        {history && (
          <Reveal delay={100}>
            <Card className="mt-14 border-slate-200 bg-white shadow-sm">
              <CardContent className="p-8">
                <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-crimson-700">
                  <CalendarCheck className="h-5 w-5" /> The Full Story
                </h3>
                <div className="rich-text mt-4" dangerouslySetInnerHTML={{ __html: history }} />
              </CardContent>
            </Card>
          </Reveal>
        )}
      </section>

      {/* VMGO */}
      <section id="vision-mission" className="scroll-mt-24 border-y border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow="Direction" title="Vision, Mission & Quality Policy" />
          </Reveal>
          <div className="stagger mt-12 grid gap-6 md:grid-cols-2">
            <Card className="border-t-4 border-t-amber-400 border-slate-200 bg-white transition-all hover:shadow-lg hover:shadow-red-900/10">
              <CardContent className="space-y-4 p-8">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-crimson-700/10 text-crimson-700 ring-1 ring-crimson-700/30">
                  <Target className="h-6 w-6" />
                </span>
                <h3 className="font-display text-xl font-semibold text-slate-900">Vision</h3>
                <div className="rich-text" dangerouslySetInnerHTML={{ __html: vision }} />
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-crimson-700 border-slate-200 bg-white transition-all hover:shadow-lg hover:shadow-red-900/10">
              <CardContent className="space-y-4 p-8">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-crimson-700/10 text-crimson-700 ring-1 ring-crimson-700/30">
                  <Landmark className="h-6 w-6" />
                </span>
                <h3 className="font-display text-xl font-semibold text-slate-900">Mission</h3>
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
                  { label: "Colors", value: "Crimson and Gold" },
                  { label: "Main Campus", value: siteConfig.address },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-3 text-sm">
                    <ScrollText className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    <p>
                      <strong className="text-slate-900">{row.label}:</strong>{" "}
                      <span className="text-slate-500">{row.value}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 text-crimson-700">
                  <Music className="h-6 w-6" />
                  <h3 className="font-display text-lg font-semibold text-slate-900">UA Hymn</h3>
                </div>
                <div className="mt-6 space-y-3 text-slate-600 [&_p]:my-3">
                  <div dangerouslySetInnerHTML={{ __html: hymn || "" }} />
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* Seal */}
      <section id="seal" className="border-y border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <SectionHeading eyebrow="Symbol" title="The University Seal" />
          </Reveal>
          <Reveal delay={80}>
            <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-6">
              <div className="flex h-44 w-44 items-center justify-center overflow-hidden rounded-full bg-white shadow-xl transition-transform duration-300 hover:scale-105">
                <Image
                  src="/ua/ua-seal.png"
                  alt="The University of Antique official seal"
                  width={176}
                  height={176}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <ShieldCheck className="h-4 w-4 text-amber-500" />
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
              className={`flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-amber-300 ${
                unit.level > 0 ? "ml-4 border-l-2 border-l-amber-400 sm:ml-10" : "border-l-2 border-l-crimson-700"
              }`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-crimson-700/10 font-mono text-xs font-bold text-crimson-700">
                {i + 1}
              </span>
              <div>
                <p className="font-medium text-slate-900">{unit.name}</p>
                <p className="text-sm text-slate-500">{unit.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
