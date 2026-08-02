"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, Inbox, Megaphone, Newspaper, Search, X } from "lucide-react";

import { NewsCard } from "@/components/shared/news-card";
import { cn } from "@/lib/utils";

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  imageUrl: string | null;
  category: string;
  publishedAt: Date | null;
};

const TABS = [
  { value: "ALL", label: "All", icon: Newspaper },
  { value: "NEWS", label: "News", icon: Newspaper },
  { value: "EVENT", label: "Events", icon: CalendarDays },
  { value: "ANNOUNCEMENT", label: "Announcements", icon: Megaphone },
] as const;

const TAB_VALUES = TABS.map((t) => t.value);

export function NewsBrowser({ items, initialCategory }: { items: NewsItem[]; initialCategory: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = TAB_VALUES.includes(initialCategory as (typeof TAB_VALUES)[number]) ? initialCategory : "ALL";
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) map.set(item.category, (map.get(item.category) ?? 0) + 1);
    return map;
  }, [items]);

  const setCategory = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL") params.delete("category");
    else params.set("category", value);
    if (query.trim()) params.set("q", query.trim());
    else params.delete("q");
    router.replace(`/news?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const id = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) params.set("q", query.trim());
      else params.delete("q");
      if (params.toString() !== searchParams.toString()) {
        router.replace(`/news?${params.toString()}`, { scroll: false });
      }
    }, 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (active !== "ALL" && item.category !== active) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        (item.excerpt ?? "").toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [items, active, query]);

  return (
    <div>
      {/* Tabs + search */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="tablist"
          aria-label="Filter news by category"
          className="grid w-full grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm sm:grid-cols-4 lg:w-auto lg:grid-cols-4 xl:flex xl:w-auto"
        >
          {TABS.map((tab) => {
            const count = tab.value === "ALL" ? items.length : (counts.get(tab.value) ?? 0);
            const isActive = active === tab.value;
            return (
              <button
                key={tab.value}
                role="tab"
                aria-selected={isActive}
                onClick={() => setCategory(tab.value)}
                className={cn(
                  "inline-flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium transition-all sm:gap-2 sm:px-4 xl:justify-start",
                  isActive
                    ? "bg-crimson-700 text-white shadow-md shadow-crimson-900/25"
                    : "text-slate-600 hover:bg-slate-100 hover:text-crimson-700",
                )}
              >
                <tab.icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{tab.label}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums sm:px-2",
                    isActive ? "bg-yellow-300 text-crimson-900" : "bg-slate-100 text-slate-500",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news, events, announcements…"
            aria-label="Search stories"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-700 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-200 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results meta */}
      <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-slate-200 pb-4">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <strong className="font-semibold text-slate-900">
            {filtered.length} {filtered.length === 1 ? "story" : "stories"}
          </strong>
          {query.trim() && (
            <>
              {" "}
              matching <strong className="font-semibold text-crimson-700">&ldquo;{query.trim()}&rdquo;</strong>
            </>
          )}
        </p>
        <p className="flex items-center gap-1.5 text-sm text-slate-500">
          <CalendarDays className="h-3.5 w-3.5 text-amber-500" />
          Sorted by latest first
        </p>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="stagger mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
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
        <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-crimson-700/10 text-crimson-700 ring-1 ring-crimson-700/20">
            <Inbox className="h-7 w-7" />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold text-slate-900">
              {query.trim()
                ? "No matching stories"
                : `No ${active === "ALL" ? "stories" : active === "NEWS" ? "news" : active === "EVENT" ? "events" : "announcements"} yet`}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {query.trim()
                ? "Nothing matches your search. Try a different keyword or switch tabs."
                : "New stories are on the way — check back soon."}
            </p>
          </div>
          {query.trim() && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-crimson-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
}
