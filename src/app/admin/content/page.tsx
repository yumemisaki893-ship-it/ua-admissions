import dynamicImport from "next/dynamic";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const NewsManager = dynamicImport(() => import("@/components/admin/news-manager").then((m) => m.NewsManager), {
  ssr: false,
  loading: () => <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>,
});

const AboutEditor = dynamicImport(() => import("@/components/admin/about-editor").then((m) => m.AboutEditor), {
  ssr: false,
  loading: () => <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>,
});

const CollegesManager = dynamicImport(
  () => import("@/components/admin/colleges-manager").then((m) => m.CollegesManager),
  {
    ssr: false,
    loading: () => <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>,
  },
);

export default async function ContentPage() {
  const [news, contentBlocks, colleges] = await Promise.all([
    prisma.news.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        imageUrl: true,
        published: true,
        publishedAt: true,
        content: true,
      },
    }),
    prisma.siteContent.findMany({
      where: { key: { startsWith: "about_" } },
      select: { key: true, title: true, content: true },
    }),
    prisma.college.findMany({
      orderBy: { sortOrder: "asc" },
      include: { courses: { orderBy: { code: "asc" } } },
    }),
  ]);

  const blockMeta: Record<string, { title: string; description: string }> = {
    about_history: { title: "History", description: "The story of the University, shown on the About page." },
    about_vision: { title: "Vision", description: "The University's vision statement." },
    about_mission: { title: "Mission", description: "The University's mission statement." },
    about_hymn: { title: "University Hymn", description: "The lyrics of the UA Hymn." },
    about_seal: { title: "Seal Description", description: "A short description of the University seal." },
  };

  const blocks = contentBlocks.map((b) => ({
    key: b.key,
    title: blockMeta[b.key]?.title ?? b.key,
    description: blockMeta[b.key]?.description ?? "",
    content: b.content,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">Content Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage news articles, the About page, and the course catalog.
        </p>
      </div>

      <Tabs defaultValue="news">
        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
          <TabsTrigger value="news">News &amp; Events</TabsTrigger>
          <TabsTrigger value="about">About Page</TabsTrigger>
          <TabsTrigger value="courses">Colleges &amp; Courses</TabsTrigger>
        </TabsList>
        <TabsContent value="news" className="mt-5">
          <NewsManager items={news} />
        </TabsContent>
        <TabsContent value="about" className="mt-5">
          <AboutEditor blocks={blocks} />
        </TabsContent>
        <TabsContent value="courses" className="mt-5">
          <CollegesManager colleges={colleges} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
