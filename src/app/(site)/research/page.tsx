import { ArrowRight, FlaskConical, Globe, HandHeart, Library, Microscope, Sprout, Users, Zap } from "lucide-react";

import { Seal } from "@/components/shared/seal";

const RESEARCH_AREAS = [
  {
    icon: Sprout,
    title: "Agriculture & Fisheries",
    description: "Crop improvement, sustainable farming, and fisheries resource management research for the province.",
  },
  {
    icon: Microscope,
    title: "Health & Biotechnology",
    description: "Community health studies, indigenous health practices, and bioprospecting of local biodiversity.",
  },
  {
    icon: Library,
    title: "Education & Culture",
    description: "Kinaray-a and local heritage documentation, pedagogy innovations, and language preservation.",
  },
  {
    icon: Globe,
    title: "Climate & Disaster Resilience",
    description: "Hazard mapping, DRRM capacity building, and climate adaptation research for a typhoon-prone province.",
  },
  {
    icon: Users,
    title: "Governance & Development",
    description: "Local governance studies, gender and development, and socio-economic policy research.",
  },
  {
    icon: Zap,
    title: "Engineering & Technology",
    description: "Appropriate technologies, renewable energy, and rural innovation for community enterprises.",
  },
];

const EXTENSION_PROGRAMS = [
  {
    title: "Community Extension",
    description: "Livelihood skills training, technology transfer, and cooperative development in partner barangays.",
  },
  {
    title: "Health & Nutrition",
    description: "Medical-dental missions, nutrition programs, and barangay health worker training.",
  },
  {
    title: "Literacy & Instruction",
    description: "Reading programs, tutorial services, and teacher capability building for basic education partners.",
  },
  {
    title: "Gender & Development",
    description: "Gender sensitivity trainings, women's empowerment programs, and GAD mainstreaming support.",
  },
  {
    title: "Environment & Disaster",
    description: "Tree planting initiatives, coastal cleanup, and community DRRM preparedness exercises.",
  },
];

export default function ResearchPage() {
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">Research &amp; Extension</p>
            <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
              Knowledge for the Community
            </h1>
            <p className="mt-4 text-red-50">
              UA pursues research and extension that respond to the needs of Antique — generating knowledge, transferring technology, and transforming communities.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <FlaskConical className="mx-auto h-8 w-8 text-crimson-700" />
            <p className="mt-3 font-display text-3xl font-bold text-slate-900">120+</p>
            <p className="text-sm text-slate-500">Completed research projects</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <HandHeart className="mx-auto h-8 w-8 text-crimson-700" />
            <p className="mt-3 font-display text-3xl font-bold text-slate-900">200+</p>
            <p className="text-sm text-slate-500">Partner communities served</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <Users className="mx-auto h-8 w-8 text-crimson-700" />
            <p className="mt-3 font-display text-3xl font-bold text-slate-900">5</p>
            <p className="text-sm text-slate-500">Campuses engaged in R&amp;E</p>
          </div>
        </div>

        <h2 className="mt-14 font-display text-2xl font-semibold text-slate-900">Research areas</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {RESEARCH_AREAS.map((area) => (
            <div
              key={area.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-crimson-700/10 text-crimson-700">
                <area.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">{area.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{area.description}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-14 font-display text-2xl font-semibold text-slate-900">Extension programs</h2>
        <div className="mt-6 space-y-3">
          {EXTENSION_PROGRAMS.map((program, i) => (
            <div
              key={program.title}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 font-display text-sm font-bold text-amber-700">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-medium text-slate-900">{program.title}</h3>
                <p className="mt-0.5 text-sm text-slate-600">{program.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="font-display text-2xl font-semibold text-slate-900">Partner with UA Research &amp; Extension</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Local government units, agencies, and organizations may partner with the University on research and
                extension projects. Propose your project or request technical assistance from our faculty experts.
              </p>
            </div>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-1 rounded-lg bg-crimson-700 px-5 py-3 text-sm font-medium text-white shadow-md shadow-crimson-900/25 transition-colors hover:bg-crimson-800"
            >
              Propose a project
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
