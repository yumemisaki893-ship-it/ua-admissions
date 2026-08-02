import { Briefcase } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Seal } from "@/components/shared/seal";
import { NewsBrowser, type NewsItem } from "@/components/shared/news-browser";

export const dynamic = "force-dynamic";

const TAB_VALUES = ["ALL", "NEWS", "EVENT", "ANNOUNCEMENT"];

export default async function NewsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const category = (searchParams.category ?? "ALL").toUpperCase();
  const valid = TAB_VALUES.includes(category) ? category : "ALL";

  const items = (await prisma.news.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      excerpt: true,
      imageUrl: true,
      category: true,
      publishedAt: true,
      slug: true,
    },
  })) as NewsItem[];

  const countFor = (value: string) =>
    value === "ALL" ? items.length : items.filter((n) => n.category === value).length;

  return (
    <>
      <section className="relative overflow-hidden border-b border-amber-200 bg-gradient-to-br from-crimson-700 via-crimson-800 to-crimson-950 py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 30%, #dfae19 0, transparent 40%), radial-gradient(circle at 80% 80%, #3f0608 0, transparent 45%)",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">Stay Informed</p>
            <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
              News &amp; Events
            </h1>
            <p className="mt-4 max-w-xl text-red-50">
              Press releases, announcements, and updates from across the University of Antique.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { value: countFor("NEWS"), label: "News stories" },
                { value: countFor("EVENT"), label: "Upcoming events" },
                { value: countFor("ANNOUNCEMENT"), label: "Announcements" },
              ].map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-md"
                >
                  <span className="font-mono text-sm font-bold text-yellow-300">{chip.value}</span>
                  {chip.label}
                </span>
              ))}
            </div>
          </div>
          <Seal size={104} className="animate-float hidden lg:block" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <NewsBrowser items={items} initialCategory={valid} />

        <a
          href="/apply"
          className="mt-12 flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3.5 text-sm font-medium text-crimson-700 transition-colors hover:bg-amber-100"
        >
          <Briefcase className="h-4 w-4 text-amber-500" />
          New to UA? Read the admission guide
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
        </a>
      </section>
    </>
  );
}
