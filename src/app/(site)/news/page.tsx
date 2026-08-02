import { prisma } from "@/lib/prisma";
import { NewsCard, NewsCardSkeleton } from "@/components/shared/news-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

const tabs = [
  { value: "ALL", label: "All" },
  { value: "NEWS", label: "News" },
  { value: "EVENT", label: "Events" },
  { value: "ANNOUNCEMENT", label: "Announcements" },
] as const;

async function getNews(category?: string) {
  return prisma.news.findMany({
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
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const category = (searchParams.category ?? "ALL").toUpperCase();
  const allNews = await getNews(category);
  const valid = category === "ALL" || tabs.some((t) => t.value === category) ? category : "ALL";

  return (
    <>
      <section className="border-b border-gold-300/20 bg-gradient-to-br from-crimson-900 via-navy-950 to-navy-950 py-16 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">Stay Informed</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">News & Events</h1>
          <p className="mt-4 text-navy-100">
            Press releases, announcements, and updates from across the University of Antique.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Tabs defaultValue={valid}>
          <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => {
            const items = tab.value === "ALL" ? allNews : allNews.filter((n) => n.category === tab.value);
            return (
              <TabsContent key={tab.value} value={tab.value} className="mt-8">
                {items.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                    <p className="col-span-full pt-2 text-center text-sm text-muted-foreground">
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
