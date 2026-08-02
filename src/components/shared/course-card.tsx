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
      <Card className="flex h-full flex-col border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg hover:shadow-red-900/10">
        <CardContent className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-md bg-crimson-700/10 px-2.5 py-1 font-mono text-xs font-semibold text-crimson-700 ring-1 ring-crimson-700/30">
              {code}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3.5 w-3.5" />
              {durationYears} yrs
            </span>
          </div>
          <h3 className="font-display text-lg font-semibold leading-snug text-slate-900 group-hover:text-crimson-800">
            {name}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-3">{description}</p>
          <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-crimson-700">
            View program <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

export function CourseCardSkeleton() {
  return (
    <Card className="border-slate-200 bg-white">
      <CardContent className="space-y-3 p-6">
        <div className="flex justify-between">
          <div className="h-6 w-20 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-12 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
      </CardContent>
    </Card>
  );
}

export function CollegeBadge({ code, name }: { code: string; name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-crimson-700/10 px-3 py-1 text-xs font-medium text-crimson-700 ring-1 ring-crimson-700/30">
      <BookOpen className="h-3.5 w-3.5" />
      {code} — {name}
    </span>
  );
}
