import {
  CalendarDays,
  GraduationCap,
  Hammer,
  Landmark,
  MapPin,
  Music,
  Play,
  ScrollText,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import Image from "next/image";
import type { JSONContent } from "@tiptap/react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { renderRichText } from "@/lib/rich-text";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

const journey = [
  {
    year: "1954",
    title: "ASAT",
    desc: "The Antique School of Arts and Trades is established by Republic Act No. 851.",
    icon: Hammer,
  },
  {
    year: "1982",
    title: "PSCA",
    desc: "Converted into a chartered state college by Batas Pambansa Blg. 281.",
    icon: Landmark,
  },
  {
    year: "2009",
    title: "UA",
    desc: "Elevated to the University of Antique by Republic Act No. 9746.",
    icon: GraduationCap,
  },
  {
    year: "Today",
    title: "Five Campuses",
    desc: "Sibalom, Tibiao, Hamtic, Libertad and Caluya — one university, one community.",
    icon: Users,
  },
];

const eraMeta = [
  { range: "1954 – 1982", act: "Republic Act No. 851", icon: Hammer },
  { range: "1982 – 2009", act: "Batas Pambansa Blg. 281", icon: Landmark },
  { range: "2009 – Present", act: "Republic Act No. 9746", icon: GraduationCap },
];

type EraMedia =
  | { kind: "image"; src: string; alt: string; caption: string; w: number; h: number }
  | { kind: "video"; src: string; caption: string };

const eraMedia: EraMedia[] = [
  {
    kind: "image",
    src: "/ua/asat.jpg",
    alt: "The Antique School of Arts and Trades, predecessor of the University of Antique",
    caption: "The Antique School of Arts and Trades",
    w: 960,
    h: 540,
  },
  {
    kind: "image",
    src: "/ua/ua-gate.jpg",
    alt: "The University of Antique gate",
    caption: "The University of Antique gate",
    w: 573,
    h: 632,
  },
  {
    kind: "video",
    src: "https://antiquespride.edu.ph/wp-content/uploads/2021/11/University-Of-Antique.mp4",
    caption: "A film on the University of Antique",
  },
];

const stats = [
  { value: "1954", label: "Year Established", icon: CalendarDays },
  { value: "Level IV", label: "SUC Level Status", icon: ShieldCheck },
  { value: "5", label: "Campuses", icon: MapPin },
  { value: "25,722", label: "Students Enrolled", icon: Users },
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

const UA_VIDEO_URL = "https://antiquespride.edu.ph/wp-content/uploads/2021/11/University-Of-Antique.mp4";

type EraBlock = { title: string; body: string };

function parseHistoryEras(raw: string | null | undefined): EraBlock[] {
  if (!raw || typeof raw !== "string") return [];
  try {
    const doc = JSON.parse(raw) as JSONContent;
    const eras: EraBlock[] = [];
    let current: EraBlock | null = null;
    for (const node of doc.content ?? []) {
      if (node.type === "heading") {
        current = { title: "", body: "" };
        eras.push(current);
        current.title = renderRichText({ type: "doc", content: [node] }).replace(/<\/?h\d>/g, "");
      } else if (node.type === "paragraph" && current) {
        current.body += renderRichText({ type: "doc", content: [node] });
      }
    }
    return eras.filter((e) => e.body.trim());
  } catch {
    return [];
  }
}

async function getContent() {
  const records = await prisma.siteContent.findMany({
    where: { key: { in: ["about_history", "about_vision", "about_mission", "about_hymn", "about_seal"] } },
  });
  const map = new Map(records.map((r) => [r.key, typeof r.content === "string" ? r.content : ""]));
  return map;
}

export default async function AboutPage() {
  const content = await getContent();

  const historyEras = parseHistoryEras(content.get("about_history"));
  const vision = renderRichText(content.get("about_vision")) || "Vision statement coming soon.";
  const mission = renderRichText(content.get("about_mission")) || "Mission statement coming soon.";
  const hymn = renderRichText(content.get("about_hymn"));
  const sealDesc = renderRichText(content.get("about_seal"));

  return (
    <>
      <section className="relative overflow-hidden border-b border-amber-200 bg-gradient-to-br from-crimson-700 via-crimson-800 to-crimson-950 py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle at 25% 25%, #dfae19 0, transparent 40%), radial-gradient(circle at 80% 70%, #3f0608 0, transparent 45%)",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">About the University</p>
            <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
              A Legacy of Excellence Since 1954
            </h1>
            <p className="mt-4 max-w-xl text-red-50">
              From a modest school of arts and trades to a Level IV state university serving the province of
              Antique — witness the story behind Antique&apos;s pride.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Badge className="bg-yellow-300 text-crimson-900">ASAT · 1954</Badge>
              <Badge variant="outline" className="border-white/40 text-white">
                PSCA · 1982
              </Badge>
              <Badge variant="outline" className="border-white/40 text-white">
                UA · 2009
              </Badge>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="overflow-hidden rounded-2xl bg-black/20 shadow-2xl ring-1 ring-white/15">
              <video
                controls
                playsInline
                preload="metadata"
                className="aspect-video w-full object-cover"
                src={UA_VIDEO_URL}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quick facts band */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 70} className="text-center">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-crimson-700/10 text-crimson-700 ring-1 ring-crimson-700/20">
                <stat.icon className="h-5 w-5" />
              </span>
              <p className="mt-3 font-display text-3xl font-bold text-crimson-700">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* History */}
      <section id="history" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Our Story"
            title="History of the University"
            description="Three eras, one journey — from a trade school in 1954 to the University of Antique today."
          />
        </Reveal>

        {/* Era journey */}
        <Reveal delay={60}>
          <div className="relative mt-14 rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-8 shadow-sm sm:p-10">
            <span className="absolute inset-x-12 top-[4.5rem] hidden h-0.5 bg-gradient-to-r from-amber-400 via-crimson-700 to-crimson-950 lg:block" />
            <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {journey.map((j) => (
                <li key={j.year} className="relative flex flex-col items-center text-center">
                  <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-amber-400 bg-white text-crimson-700 shadow-md transition-transform duration-300 hover:scale-110">
                    <j.icon className="h-6 w-6" />
                  </span>
                  <p className="mt-4 font-display text-3xl font-bold text-crimson-700">{j.year}</p>
                  <p className="font-display font-semibold uppercase tracking-wide text-slate-900">{j.title}</p>
                  <p className="mt-1.5 max-w-[15rem] text-sm leading-relaxed text-slate-500">{j.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        {/* Full story */}
        <div className="mt-16 flex items-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-200" />
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-crimson-700">
            The Full Story
          </p>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-200" />
        </div>

        <div className="mt-12 space-y-20">
          {historyEras.length > 0 ? (
            historyEras.map((era, i) => {
              const meta = eraMeta[i % eraMeta.length];
              const media = eraMedia[i % eraMedia.length];
              const flip = i % 2 === 1;
              return (
                <div key={`${era.title}-${i}`} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
                  <Reveal className={flip ? "lg:order-2" : undefined}>
                    <div className="flex items-center gap-4">
                      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-crimson-700/10 text-crimson-700 ring-1 ring-crimson-700/30">
                        <meta.icon className="h-6 w-6" />
                      </span>
                      <div>
                        <Badge className="bg-crimson-700 text-white">{meta.range}</Badge>
                        <p className="mt-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-amber-600">
                          {meta.act}
                        </p>
                      </div>
                    </div>
                    <h3 className="mt-5 font-display text-2xl font-semibold text-slate-900">{era.title}</h3>
                    <div
                      className="rich-text mt-4 text-[15px] leading-7 text-slate-600 [&_p]:my-4 first:[&_p]:mt-0"
                      dangerouslySetInnerHTML={{ __html: era.body }}
                    />
                  </Reveal>
                  <Reveal delay={120} className={flip ? "lg:order-1" : undefined}>
                    {media.kind === "video" ? (
                      <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                        <video
                          controls
                          playsInline
                          preload="metadata"
                          className="aspect-video w-full object-cover"
                          src={media.src}
                        />
                        <figcaption className="flex items-center gap-2 px-5 py-3 text-sm text-slate-500">
                          <Play className="h-4 w-4 text-amber-500" /> {media.caption}
                        </figcaption>
                      </figure>
                    ) : (
                      <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-900/10">
                        <Image
                          src={media.src}
                          alt={media.alt}
                          width={media.w}
                          height={media.h}
                          className="h-auto w-full rounded-xl object-cover"
                        />
                        <figcaption className="px-3 py-3 text-center text-sm italic text-slate-500">
                          {media.caption}
                        </figcaption>
                      </figure>
                    )}
                  </Reveal>
                </div>
              );
            })
          ) : (
            <Reveal>
              <p className="text-center text-slate-400">The full history is being prepared. Please check back soon.</p>
            </Reveal>
          )}
        </div>
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
