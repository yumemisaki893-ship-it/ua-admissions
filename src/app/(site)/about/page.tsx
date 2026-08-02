import { Landmark, Target, ScrollText, Music, ShieldCheck } from "lucide-react";
import Image from "next/image";

import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/prisma";
import { renderRichText } from "@/lib/rich-text";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

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
      <section className="border-b border-gold-300/20 bg-gradient-to-br from-crimson-900 via-navy-950 to-navy-950 py-16 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">About the University</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
            A Legacy of Excellence Since 1954
          </h1>
          <p className="mt-4 text-navy-100">
            From a modest school of arts and trades to a Level IV state university serving the province of Antique.
          </p>
        </div>
      </section>

      <section id="history" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Our Story"
              title="History of the University"
              description="A century of service through every chapter of our growth."
            />
          </div>
          <Card>
            <CardContent className="p-8">
              <div className="rich-text" dangerouslySetInnerHTML={{ __html: history || "" }} />
              {!history && (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="vision-mission" className="scroll-mt-24 border-y border-white/10 bg-navy-900/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Direction" title="Vision, Mission & Quality Policy" />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Card className="border-t-4 border-t-gold-300 border-white/10 bg-navy-900/60">
              <CardContent className="space-y-4 p-8">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-crimson-700/30 text-gold-300 ring-1 ring-crimson-700/50">
                  <Target className="h-6 w-6" />
                </span>
                <h3 className="font-display text-xl font-semibold text-white">Vision</h3>
                <div className="rich-text" dangerouslySetInnerHTML={{ __html: vision }} />
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-white/60 border-white/10 bg-navy-900/60">
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

      <section id="hymn" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
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
          <Card className="bg-navy-900 border-white/10">
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
        </div>
      </section>

      <section id="seal" className="border-y border-white/10 bg-navy-900/40 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <SectionHeading eyebrow="Symbol" title="The University Seal" />
          <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-6">
            <div className="flex h-44 w-44 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-gold-300 to-crimson-800 shadow-xl ring-8 ring-white/10">
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
        </div>
      </section>

      <section id="organization" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Governance"
          title="Organizational Structure"
          description="The University is led by the Board of Regents and administered by the Office of the University President."
        />
        <div className="mt-12 space-y-3">
          {[
            { name: "Board of Regents", role: "Highest policy-making body of the University" },
            { name: "Office of the University President", role: "Chief executive of the University" },
            { name: "Office of the Vice President for Academic Affairs", role: "Oversees colleges and academic programs" },
            { name: "Office of the Vice President for Administration & Finance", role: "Administrative and financial services" },
            { name: "Office of the Vice President for Research, Extension & Production", role: "Research, extension, and production programs" },
            { name: "Colleges & Graduate School", role: "Academic units offering degree programs" },
            { name: "Registrar, Admissions, Student Services, Library, ICT", role: "Support services for students and faculty" },
          ].map((unit, i) => (
            <div key={unit.name} className="flex items-start gap-4 rounded-lg border border-white/10 bg-navy-900/60 p-4 shadow-sm">
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
