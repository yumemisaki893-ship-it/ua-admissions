import Image from "next/image";
import { Newspaper, Megaphone, CalendarDays, Briefcase } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { NewsCard, NewsCardSkeleton } from "@/components/shared/news-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const tabs = [
  { value: "ALL", label: "All", icon: Newspaper },
  { value: "NEWS", label: "News", icon: Newspaper },
  { value: "EVENT", label: "Events", icon: CalendarDays },
  { value: "ANNOUNCEMENT", label: "Announcements", icon: Megaphone },
] as const;

async function getNews(category?: string) {
  const items = await prisma.news.findMany({
    where: { published: true, ...(category && category !== "ALL" ? { category: category as "NEWS" } : {}) },
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
  });
  return items;
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const category = (searchParams.category ?? "ALL").toUpperCase();
  const allNews = await getNews(category);
  const valid = category === "ALL" || tabs.some((t) => t.value === category) ? category : "ALL";

  const countFor = (value: string) =>
    value === "ALL" ? allNews.length : allNews.filter((n) => n.category === value).length;

  return (
    <>
      <section className="relative overflow-hidden border-b border-amber-200 bg-gradient-to-br from-crimson-700 via-crimson-800 to-crimson-950 py-16 text-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 30%, #dfae19 0, transparent 40%), radial-gradient(circle at 80% 80%, #3f0608 0, transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <Image
            src="/ua/ua-seal.png"
            alt="University of Antique seal"
            width={72}
            height={72}
            className="mx-auto rounded-full bg-white/10 p-1 ring-1 ring-yellow-300/60"
          />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">Stay Informed</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">News &amp; Events</h1>
          <p className="mt-4 text-red-50">
            Press releases, announcements, and updates from across the University of Antique.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Tabs defaultValue={valid}>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="w-full justify-start overflow-x-auto border border-slate-200 bg-slate-100 sm:w-auto">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="gap-1.5 data-[state=active]:bg-crimson-700 data-[state=active]:text-white"
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                  <Badge className="ml-0.5 bg-slate-200 px-1.5 py-0 text-[10px] text-slate-600 data-[state=active]:bg-yellow-300 data-[state=active]:text-crimson-900">
                    {countFor(tab.value)}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
            <p className="flex items-center gap-1.5 text-sm text-slate-500">
              <Briefcase className="h-4 w-4 text-amber-500" />
              New to UA? Read the{" "}
              <a
                href="/apply"
                className="font-medium text-crimson-700 underline-offset-4 hover:underline"
              >
                admission guide
              </a>
              .
            </p>
          </div>

          {tabs.map((tab) => {
            const items = tab.value === "ALL" ? allNews : allNews.filter((n) => n.category === tab.value);
            return (
              <TabsContent key={tab.value} value={tab.value} className="mt-8">
                {items.length > 0 ? (
                  <div className="stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                      <NewsCard
                        key={item.id}
                        slug={item.slug}
                        title={item.title}
                        excerpt={item.excerpt}
                        imageUrl={item.imageUrl}
                        category={item.category}
                        publishedAt={item.publishedAt}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[0, 1, 2].map((i) => (
                      <NewsCardSkeleton key={i} />
                    ))}
                    <p className="col-span-full pt-2 text-center text-sm text-slate-500">
                      No {tab.label.toLowerCase()} posted yet. Check back soon.
                    </p>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </section>
    </>
  );
}
