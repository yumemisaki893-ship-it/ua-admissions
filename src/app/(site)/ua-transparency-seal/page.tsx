import { ExternalLink, FileSearch, Landmark, Scale } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const mandatedItems = [
  {
    title: "Agency Mandate, Vision, Mission",
    description:
      "The legal basis for the University's existence, its functions, and its statement of vision, mission, and goals.",
  },
  {
    title: "Annual Reports",
    description:
      "Reports on the University's accomplishments, programs, and utilization of funds for the fiscal year.",
  },
  {
    title: "DBM-Approved Budget and Targets",
    description:
      "The University's approved budget, financial targets, and corresponding performance indicators.",
  },
  {
    title: "Major Programs and Projects",
    description:
      "Ongoing and completed programs, projects, and activities, together with their status and funding.",
  },
  {
    title: "Quality Management System (QMS)",
    description:
      "Information on the University's ISO-certified processes and its commitments to quality service.",
  },
  {
    title: "Annual Procurement Plan",
    description:
      "Goods, infrastructure, and consulting services to be procured by the University for the year.",
  },
  {
    title: "System of Ranking Delivery Units",
    description:
      "The University's ranking system for its delivery units and assessment of frontline services.",
  },
  {
    title: "Agency Review and Compliance Procedure",
    description:
      "The procedure for auditing and reviewing the University's compliance with its mandates.",
  },
  {
    title: "People's Freedom of Information (FOI)",
    description:
      "Guidelines and the procedure for requesting access to official records under Executive Order No. 2, s. 2016.",
  },
];

const resources = [
  {
    title: "Official Transparency Seal",
    description: "The full transparency seal page on the official University website, including downloadable reports and documents.",
    href: "https://antiquespride.edu.ph/ua-transparency-seal/",
  },
  {
    title: "Bids and Awards",
    description: "Procurement opportunities, bid notices, and award announcements.",
    href: "https://antiquespride.edu.ph/bids-and-awards/",
  },
  {
    title: "Freedom of Information (FOI)",
    description: "File an FOI request through the official government FOI portal.",
    href: "https://www.foi.gov.ph/",
  },
];

export default function TransparencySealPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-amber-200 bg-gradient-to-br from-crimson-700 via-crimson-800 to-crimson-950 py-16 text-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, #dfae19 0, transparent 40%), radial-gradient(circle at 80% 70%, #3f0608 0, transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">
            Open Government
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
            Transparency Seal &amp; FOI
          </h1>
          <p className="mt-4 text-red-50">
            The University of Antique upholds transparency, accountability, and public access to
            information mandated by law.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-white/10 bg-white/[0.05] shadow-sm transition-all hover:-translate-y-1 hover:border-amber-400/60 hover:shadow-lg hover:shadow-black/40">
            <CardContent className="p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-crimson-500/15 text-crimson-300 ring-1 ring-crimson-400/30">
                <Landmark className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold text-white">
                Legal Basis
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                The Transparency Seal is required by Section 93 of the General Appropriations Act,
                while access to public records is governed by Executive Order No. 2, s. 2016.
              </p>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/[0.05] shadow-sm transition-all hover:-translate-y-1 hover:border-amber-400/60 hover:shadow-lg hover:shadow-black/40">
            <CardContent className="p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-crimson-500/15 text-crimson-300 ring-1 ring-crimson-400/30">
                <FileSearch className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold text-white">
                What It Contains
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                Budget and financial documents, annual reports, mandates, procurement plans, and
                compliance information published for public scrutiny.
              </p>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/[0.05] shadow-sm transition-all hover:-translate-y-1 hover:border-amber-400/60 hover:shadow-lg hover:shadow-black/40">
            <CardContent className="p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-crimson-500/15 text-crimson-300 ring-1 ring-crimson-400/30">
                <Scale className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold text-white">
                FOI Requests
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                Any person may request access to official records. Requests are processed by the
                University&apos;s FOI Receiving Officer within the period prescribed by law.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-14">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crimson-300">
              Mandated Contents
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-white">
              What the Seal publishes
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Per the General Appropriations Act, the following information must be made available
              on the University website.
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {mandatedItems.map((item, i) => (
              <details
                key={item.title}
                className="group rounded-xl border border-white/10 bg-white/[0.05] shadow-sm transition-colors open:border-amber-400/50 hover:border-amber-400/60"
              >
                <summary className="flex cursor-pointer items-start gap-3 p-5 [&::-webkit-details-marker]:hidden">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-crimson-500/15 text-xs font-bold text-crimson-300 ring-1 ring-crimson-400/30">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </summary>
              </details>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crimson-300">
              Official Resources
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-white">
              Access the documents
            </h2>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {resources.map((resource) => (
              <a
                key={resource.title}
                href={resource.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-white/10 bg-white/[0.05] p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-amber-400/60 hover:shadow-lg hover:shadow-black/40"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-white group-hover:text-crimson-300">
                    {resource.title}
                  </h3>
                  <ExternalLink className="h-4 w-4 text-slate-400 transition-colors group-hover:text-crimson-300" />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {resource.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
