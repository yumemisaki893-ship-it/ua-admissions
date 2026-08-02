import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Tag, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NewsCard } from "@/components/shared/news-card";
import { ShareButtons } from "@/components/shared/share-buttons";
import { prisma } from "@/lib/prisma";
import { renderRichText } from "@/lib/rich-text";
import { formatDate } from "@/lib/utils";
import { isPosterImage } from "@/lib/image-type";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const item = await prisma.news.findUnique({ where: { slug: params.slug } });
  if (!item) return { title: "Not Found" };
  return { title: item.title, description: item.excerpt ?? undefined };
}

function readingTime(content: unknown) {
  try {
    const text = JSON.stringify(content ?? "");
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.round(words / 250));
  } catch {
    return 2;
  }
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const [item, related] = await Promise.all([
    prisma.news.findUnique({ where: { slug: params.slug } }),
    prisma.news.findMany({
      where: { published: true, slug: { not: params.slug } },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        slug: true,
        title: true,
        excerpt: true,
        imageUrl: true,
        category: true,
        publishedAt: true,
      },
    }),
  ]);

  if (!item || !item.published) notFound();

  const html = renderRichText(item.content);
  const minutes = readingTime(item.content);

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/news"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-crimson-700 transition-colors hover:text-crimson-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back to News
      </Link>

      {/* Header */}
      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="bg-crimson-700 text-white">{item.category}</Badge>
          {item.publishedAt && (
            <span className="flex items-center gap-1.5 text-sm text-slate-500">
              <CalendarDays className="h-4 w-4" />
              {formatDate(item.publishedAt)}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-sm text-slate-500">
            <Clock className="h-4 w-4" />
            {minutes} min read
          </span>
        </div>

        <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
          {item.title}
        </h1>
        {item.excerpt && <p className="mt-4 text-lg text-slate-500">{item.excerpt}</p>}
      </header>

      {/* Hero image — photos get a wide crop; graphic posters get a contained frame */}
      {item.imageUrl &&
        (isPosterImage(item.imageUrl) ? (
          <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-lg shadow-red-900/10">
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={1600}
              height={1200}
              sizes="(max-width: 896px) 100vw, 768px"
              className="h-auto w-full rounded-xl object-contain"
            />
          </div>
        ) : (
          <div className="relative mt-8 aspect-[21/9] w-full overflow-hidden rounded-2xl border border-slate-200 shadow-lg shadow-red-900/10">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
              priority
            />
          </div>
        ))}

      {/* Share */}
      <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-6">
        <ShareButtons title={item.title} />
      </div>

      <div className="rich-text mt-8" dangerouslySetInnerHTML={{ __html: html }} />

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-14 border-t border-slate-200 pt-10">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-crimson-700">
            <Tag className="h-5 w-5" /> Related Stories
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <NewsCard
                key={r.slug}
                slug={r.slug}
                title={r.title}
                excerpt={r.excerpt}
                imageUrl={r.imageUrl}
                category={r.category}
                publishedAt={r.publishedAt}
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button
              variant="outline"
              className="border-amber-400/70 text-crimson-700 hover:bg-yellow-300 hover:text-slate-900"
              asChild
            >
              <Link href="/news">
                Browse All News <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </article>
  );
}
