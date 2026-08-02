import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface CourseCardProps {
  slug: string;
  code: string;
  name: string;
  description: string;
  durationYears: number;
}

export function CourseCard({ slug, code, name, description, durationYears }: CourseCardProps) {
  return (
    <Link href={`/academics/${slug}`} className="group block h-full">
      <Card className="flex h-full flex-col border-white/10 bg-navy-900/60 transition-all hover:border-gold-300/50 hover:shadow-lg hover:shadow-crimson-900/20">
        <CardContent className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-md bg-crimson-700/30 px-2.5 py-1 font-mono text-xs font-semibold text-gold-300 ring-1 ring-crimson-700/50">
              {code}
            </span>
            <span className="flex items-center gap-1 text-xs text-navy-300">
              <Clock className="h-3.5 w-3.5" />
              {durationYears} yrs
            </span>
          </div>
          <h3 className="font-display text-lg font-semibold leading-snug text-white group-hover:text-gold-300">
            {name}
          </h3>
          <p className="text-sm text-navy-300 line-clamp-3">{description}</p>
          <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-gold-300">
            View program <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

export function CourseCardSkeleton() {
  return (
    <Card className="border-white/10 bg-navy-900/60">
      <CardContent className="space-y-3 p-6">
        <div className="flex justify-between">
          <div className="h-6 w-20 animate-pulse rounded bg-navy-800" />
          <div className="h-4 w-12 animate-pulse rounded bg-navy-800" />
        </div>
        <div className="h-5 w-3/4 animate-pulse rounded bg-navy-800" />
        <div className="h-4 w-full animate-pulse rounded bg-navy-800" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-navy-800" />
      </CardContent>
    </Card>
  );
}

export function CollegeBadge({ code, name }: { code: string; name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-crimson-700/30 px-3 py-1 text-xs font-medium text-gold-200 ring-1 ring-crimson-700/50">
      <BookOpen className="h-3.5 w-3.5" />
      {code} — {name}
    </span>
  );
}
