import { ArrowRight, Award, Briefcase, Handshake, Mail, Users } from "lucide-react";

import { Seal } from "@/components/shared/seal";
import { siteConfig } from "@/lib/site-config";

const ALUMNI_STORIES = [
  {
    name: "Engr. Rosalinda V. Sampulna",
    role: "Class of 1997 · BS in Mechanical Engineering",
    quote:
      "The skills and values I learned at UA carried me through my career in public service. The University truly transforms lives and builds communities.",
    tag: "Community builder",
  },
  {
    name: "Dr. Michael Angelo R. Cabildo",
    role: "Class of 2005 · BS in Nursing",
    quote:
      "From a small town in Antique to a healthcare career abroad — UA gave me the foundation and the confidence to reach for more.",
    tag: "Global career",
  },
  {
    name: "Prof. Janice E. Oli",
    role: "Class of 2011 · BS in Education",
    quote:
      "I came back home to teach. There is nothing more fulfilling than molding the next generation of Antiqueños in the same halls where I grew up.",
    tag: "Educator",
  },
];

const ALUMNI_BENEFITS = [
  {
    icon: Handshake,
    title: "Networking",
    description: "Reconnect with classmates and mentors through campus reunions and alumni chapters nationwide.",
  },
  {
    icon: Briefcase,
    title: "Career support",
    description: "Job postings, career talks, and industry partnerships arranged by the University placement office.",
  },
  {
    icon: Award,
    title: "Lifelong learning",
    description: "Alumni discounts on select graduate programs and continuing education courses at UA.",
  },
  {
    icon: Users,
    title: "Giving back",
    description: "Mentor students, sponsor scholarships, and contribute to the University's development programs.",
  },
];

export default function AlumniPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-amber-200 bg-gradient-to-br from-crimson-700 via-crimson-800 to-crimson-950 py-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 30%, #dfae19 0, transparent 40%), radial-gradient(circle at 80% 80%, #3f0608 0, transparent 45%)",
          }}
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
          <Seal className="animate-float h-20 w-20 sm:h-24 sm:w-24" />
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">Alumni &amp; Friends</p>
            <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">UA Alumni</h1>
            <p className="mt-4 text-red-50">
              Once an Antiqueño scholar, always part of the UA family. Stay connected, give back, and inspire the next generation.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { value: "68,000+", label: "Living alumni worldwide" },
            { value: "45+", label: "Years producing professionals" },
            { value: "20+", label: "Alumni chapters and communities" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="font-display text-3xl font-bold text-crimson-700">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-14 font-display text-2xl font-semibold text-slate-900">Alumni stories</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {ALUMNI_STORIES.map((story) => (
            <figure
              key={story.name}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-crimson-700/10 text-crimson-700">
                <Users className="h-5 w-5" />
              </span>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
                &ldquo;{story.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 border-t border-slate-100 pt-4">
                <p className="font-semibold text-slate-900">{story.name}</p>
                <p className="text-xs text-slate-500">{story.role}</p>
                <span className="mt-2 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                  {story.tag}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <h2 className="mt-14 font-display text-2xl font-semibold text-slate-900">What alumni can do</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ALUMNI_BENEFITS.map((benefit) => (
            <div key={benefit.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <benefit.icon className="h-6 w-6 text-crimson-700" />
              <h3 className="mt-3 font-display text-lg font-semibold text-slate-900">{benefit.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white">
          <div className="grid gap-6 p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
            <div>
              <h2 className="font-display text-2xl font-semibold text-slate-900">Update your contact details</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Register with the Alumni Affairs Office so you never miss a reunion, job posting, or University milestone.
                Keep us updated with your current email, profession, and location.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-amber-500" />
                  {siteConfig.email}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5 text-amber-500" />
                  Alumni Affairs Office, Main Campus
                </span>
              </div>
            </div>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-1 rounded-lg bg-crimson-700 px-5 py-3 text-sm font-medium text-white shadow-md shadow-crimson-900/25 transition-colors hover:bg-crimson-800"
            >
              Contact alumni affairs
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
