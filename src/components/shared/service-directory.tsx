"use client";

import { useMemo, useState } from "react";
import { Search, ExternalLink, Stethoscope, GraduationCap, Users, BookOpen, LifeBuoy, FileText, MessageSquare } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const iconMap: Record<string, typeof Stethoscope> = {
  Stethoscope,
  GraduationCap,
  Users,
  BookOpen,
  LifeBuoy,
  FileText,
  MessageSquare,
};

type Service = {
  title: string;
  description: string;
  href: string;
  category: string;
  icon: string;
  phone?: string;
};

const services: Service[] = [
  {
    title: "Health Services",
    description: "Medical and dental care for students, including consultations, first aid, and referrals to partner hospitals.",
    href: "https://www.antiquespride.edu.ph/health-services/",
    category: "Health & Welfare",
    icon: "Stethoscope",
  },
  {
    title: "Student Affairs & Services",
    description: "Guidance and counseling, student discipline, organizations, and overall student welfare programs.",
    href: "https://www.antiquespride.edu.ph/student-affairs-services-2/",
    category: "Health & Welfare",
    icon: "Users",
  },
  {
    title: "Scholarship & Financial Assistance",
    description: "Scholarships, grants-in-aid, and financial assistance programs from the SFAU to support deserving students.",
    href: "https://www.antiquespride.edu.ph/scholarship-and-financial-assistance-unit/",
    category: "Financial",
    icon: "GraduationCap",
  },
  {
    title: "Library Services",
    description: "Learning resources, e-library access, research assistance, and study spaces across all campuses.",
    href: "https://www.antiquespride.edu.ph/library-services/",
    category: "Academic",
    icon: "BookOpen",
  },
  {
    title: "ICTU Helpdesk",
    description: "Technical support for student accounts, e-mail, Wi-Fi, the AIMS portal, and other university systems.",
    href: "https://support.universityofantique.edu.ph",
    category: "Technology",
    icon: "LifeBuoy",
  },
  {
    title: "Document Request",
    description: "Request official school documents online — transcripts, certificates of enrollment, and diploma verifications.",
    href: "https://www.antiquespride.edu.ph/studentdocumentonlinerequest/",
    category: "Administrative",
    icon: "FileText",
  },
  {
    title: "Feedback & Complaints",
    description: "Send feedback, suggestions, or complaints to the university's quality management and feedback unit.",
    href: "https://www.antiquespride.edu.ph/feedback/",
    category: "Administrative",
    icon: "MessageSquare",
  },
];

const categories = ["All", ...Array.from(new Set(services.map((s) => s.category)))];

export function ServiceDirectory() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services.filter((s) => {
      const matchesCategory = category === "All" || s.category === category;
      const matchesQuery =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services…"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition-colors focus:border-crimson-400 focus:ring-2 focus:ring-crimson-100"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                category === c
                  ? "bg-crimson-700 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:text-crimson-700",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((service) => {
          const Icon = iconMap[service.icon] ?? Users;
          return (
            <Card
              key={service.title}
              className="group flex flex-col border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg hover:shadow-red-900/10"
            >
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-crimson-700/10 text-crimson-700 ring-1 ring-crimson-700/30 transition-colors group-hover:bg-yellow-300 group-hover:text-crimson-900 group-hover:ring-amber-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    {service.category}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">{service.title}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-500">{service.description}</p>
                <a
                  href={service.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-crimson-700 transition-colors hover:text-amber-600"
                >
                  Visit service <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white py-14 text-center">
          <p className="text-sm text-slate-500">No services match your search.</p>
          <p className="mt-1 text-xs text-slate-400">Try a different keyword or clear the filters.</p>
        </div>
      )}
    </div>
  );
}
