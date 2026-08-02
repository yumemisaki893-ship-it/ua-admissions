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
      <Card className="flex h-full flex-col border-white/10 bg-white/[0.05] shadow-sm transition-all hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-xl hover:shadow-black/40">
        <CardContent className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-md bg-crimson-500/15 px-2.5 py-1 font-mono text-xs font-semibold text-crimson-300 ring-1 ring-crimson-400/30">
              {code}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              {durationYears} yrs
            </span>
          </div>
          <h3 className="font-display text-lg font-semibold leading-snug text-white group-hover:text-crimson-300">
            {name}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-3">{description}</p>
          <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-crimson-300">
            View program <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

export function CourseCardSkeleton() {
  return (
    <Card className="border-white/10 bg-white/[0.05]">
      <CardContent className="space-y-3 p-6">
        <div className="flex justify-between">
          <div className="h-6 w-20 animate-pulse rounded bg-white/[0.08]" />
          <div className="h-4 w-12 animate-pulse rounded bg-white/[0.08]" />
        </div>
        <div className="h-5 w-3/4 animate-pulse rounded bg-white/[0.08]" />
        <div className="h-4 w-full animate-pulse rounded bg-white/[0.08]" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-white/[0.08]" />
      </CardContent>
    </Card>
  );
}

export function CollegeBadge({ code, name }: { code: string; name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-crimson-500/15 px-3 py-1 text-xs font-medium text-crimson-300 ring-1 ring-crimson-400/30">
      <BookOpen className="h-3.5 w-3.5" />
      {code} — {name}
    </span>
  );
}
