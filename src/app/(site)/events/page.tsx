import Link from "next/link";
import { CalendarDays, ChevronRight, Clock, MapPin, Sparkles } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Seal } from "@/components/shared/seal";
import { isPosterImage } from "@/lib/image-type";
import Image from "next/image";

export const dynamic = "force-dynamic";

function groupByMonth(items: { id: string; title: string; slug: string; imageUrl: string | null; publishedAt: Date | null }[]) {
  const groups: { key: string; label: string; items: typeof items }[] = [];
  for (const item of items) {
    if (!item.publishedAt) continue;
    const key = item.publishedAt.toLocaleDateString("en-PH", { month: "long", year: "numeric" });
    const existing = groups.find((g) => g.key === key);
    if (existing) existing.items.push(item);
    else groups.push({ key, label: key, items: [item] });
  }
  return groups;
}

export default async function EventsPage() {
  const events = await prisma.news.findMany({
    where: { published: true, category: "EVENT" },
    orderBy: { publishedAt: "desc" },
    select: { id: true, title: true, excerpt: true, slug: true, imageUrl: true, publishedAt: true },
  });

  const [featured, ...rest] = events;
  const groups = groupByMonth(rest);

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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">Campus Calendar</p>
            <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">Events</h1>
            <p className="mt-4 text-red-50">
              Seminars, convocations, campus activities, and community engagements across the University of Antique.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {featured && (
          <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-red-900/5">
            <div className="grid md:grid-cols-2">
              <div className="relative min-h-64 md:min-h-full">
                {featured.imageUrl ? (
                  <Image
                    src={featured.imageUrl}
                    alt={featured.title}
                    fill
                    className={isPosterImage(featured.imageUrl) ? "object-contain p-4" : "object-cover"}
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-crimson-700/5">
                    <CalendarDays className="h-16 w-16 text-crimson-700/30" />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Next featured event
                </span>
                <h2 className="mt-4 font-display text-2xl font-semibold text-slate-900 lg:text-3xl">
                  {featured.title}
                </h2>
                {featured.excerpt && <p className="mt-3 text-slate-600">{featured.excerpt}</p>}
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                  {featured.publishedAt && (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4 text-amber-500" />
                      {formatDate(featured.publishedAt)}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-amber-500" />
                    Sibalom, Antique
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-amber-500" />
                    All day
                  </span>
                </div>
                <Link
                  href={`/news/${featured.slug}`}
                  className="mt-6 inline-flex w-fit items-center gap-1 rounded-lg bg-crimson-700 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-crimson-900/25 transition-colors hover:bg-crimson-800"
                >
                  View event
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-semibold text-slate-900">Campus calendar</h2>
            {groups.length === 0 && (
              <p className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-500">
                No events posted yet — check back soon.
              </p>
            )}
            <div className="mt-6 space-y-8">
              {groups.map((group) => (
                <div key={group.key}>
                  <h3 className="font-display text-lg font-semibold text-crimson-700">{group.label}</h3>
                  <ul className="mt-3 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    {group.items.map((event) => (
                      <li key={event.id}>
                        <Link
                          href={`/news/${event.slug}`}
                          className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50"
                        >
                          <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-crimson-700/5 text-center ring-1 ring-crimson-700/10">
                            <span className="font-display text-lg font-bold leading-none text-crimson-700">
                              {event.publishedAt?.getDate()}
                            </span>
                            <span className="text-[10px] font-semibold uppercase text-slate-500">
                              {event.publishedAt?.toLocaleDateString("en-PH", { month: "short" })}
                            </span>
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium text-slate-900">{event.title}</span>
                            <span className="block text-xs text-slate-500">
                              {event.publishedAt ? formatDate(event.publishedAt) : "Date TBA"}
                            </span>
                          </span>
                          <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h3 className="font-display text-lg font-semibold text-slate-900">Event venues</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  UA Gymnasium, Main Campus
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  Ugnayan Center for Research &amp; Extension
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  Tario Lim Memorial Campus
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  Libertad &amp; Caluya Campuses
                </li>
              </ul>
              <Link
                href="/news?category=EVENT"
                className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-crimson-700 hover:underline"
              >
                Browse all event stories
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
