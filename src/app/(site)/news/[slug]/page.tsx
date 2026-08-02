import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Tag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { renderRichText } from "@/lib/rich-text";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const item = await prisma.news.findUnique({ where: { slug: params.slug } });
  if (!item) return { title: "Not Found" };
  return { title: item.title, description: item.excerpt ?? undefined };
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const [item, related] = await Promise.all([
    prisma.news.findUnique({ where: { slug: params.slug } }),
    prisma.news.findMany({
      where: { published: true, slug: { not: params.slug } },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { slug: true, title: true, publishedAt: true },
    }),
  ]);

  if (!item || !item.published) notFound();

  const html = renderRichText(item.content);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/news"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 transition-colors hover:text-sky-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back to News
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Badge>{item.category}</Badge>
        {item.publishedAt && (
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            {formatDate(item.publishedAt)}
          </span>
        )}
      </div>

      <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-navy-900 sm:text-4xl">
        {item.title}
      </h1>
      {item.excerpt && <p className="mt-4 text-lg text-muted-foreground">{item.excerpt}</p>}

      <div className="rich-text mt-8 border-t border-border pt-8" dangerouslySetInnerHTML={{ __html: html }} />

      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-navy-900">
            <Tag className="h-5 w-5 text-sky-600" /> Related Stories
          </h2>
          <ul className="mt-4 divide-y divide-border rounded-lg border">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/news/${r.slug}`}
                  className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/50"
                >
                  <span className="font-medium text-navy-900 hover:text-sky-700">{r.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatDate(r.publishedAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
