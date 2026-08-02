import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

interface NewsCardProps {
  slug: string;
  title: string;
  excerpt: string | null;
  imageUrl: string | null;
  category: string;
  publishedAt: Date | null;
}

export function NewsCard({ slug, title, excerpt, imageUrl, category, publishedAt }: NewsCardProps) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={`/news/${slug}`} className="flex h-full flex-col">
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-700 to-navy-900">
              <span className="font-display text-4xl font-bold text-white/30">{category.slice(0, 2)}</span>
            </div>
          )}
          <Badge className="absolute left-3 top-3 bg-white/95 text-navy-900 shadow">{category}</Badge>
        </div>
        <CardContent className="flex flex-1 flex-col gap-3 p-5">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(publishedAt)}
          </p>
          <h3 className="font-display text-lg font-semibold leading-snug text-navy-900 line-clamp-2 group-hover:text-sky-700">
            {title}
          </h3>
          {excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{excerpt}</p>}
          <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-sky-600">
            Read more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </CardContent>
      </Link>
    </Card>
  );
}

export function NewsCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <CardContent className="space-y-3 p-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-2/3" />
      </CardContent>
    </Card>
  );
}
