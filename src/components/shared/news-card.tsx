import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { isPosterImage } from "@/lib/image-type";

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
    <Card className="group flex h-full flex-col overflow-hidden border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg hover:shadow-red-900/10">
      <Link href={`/news/${slug}`} className="flex h-full flex-col">
        <div className={`relative h-48 w-full overflow-hidden ${isPosterImage(imageUrl) ? "bg-white" : "bg-slate-100"}`}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={`transition-transform duration-300 group-hover:scale-105 ${
                isPosterImage(imageUrl) ? "inset-0 object-contain p-3" : "object-cover"
              }`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-crimson-700 to-crimson-900">
              <span className="font-display text-4xl font-bold text-white/40">{category.slice(0, 2)}</span>
            </div>
          )}
          <Badge className="absolute left-3 top-3 bg-crimson-700 text-white shadow">{category}</Badge>
        </div>
        <CardContent className="flex flex-1 flex-col gap-3 p-5">
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(publishedAt)}
          </p>
          <h3 className="font-display text-lg font-semibold leading-snug text-slate-900 line-clamp-2 group-hover:text-crimson-800">
            {title}
          </h3>
          {excerpt && <p className="text-sm text-slate-500 line-clamp-2">{excerpt}</p>}
          <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-crimson-700">
            Read more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </CardContent>
      </Link>
    </Card>
  );
}

export function NewsCardSkeleton() {
  return (
    <Card className="overflow-hidden border-slate-200 bg-white">
      <Skeleton className="h-48 w-full rounded-none bg-slate-200" />
      <CardContent className="space-y-3 p-5">
        <Skeleton className="h-3 w-24 bg-slate-200" />
        <Skeleton className="h-5 w-full bg-slate-200" />
        <Skeleton className="h-5 w-3/4 bg-slate-200" />
        <Skeleton className="h-3 w-2/3 bg-slate-200" />
      </CardContent>
    </Card>
  );
}
