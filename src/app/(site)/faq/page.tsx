"use client";

import { useMemo, useState } from "react";
import { Banknote, ChevronDown, GraduationCap, HelpCircle, Monitor, Search, Users, X } from "lucide-react";

import { cn } from "@/lib/utils";

type FaqItem = { q: string; a: string };
type FaqCategory = { label: string; icon: "admission" | "fees" | "portal" | "life"; items: FaqItem[] };

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    label: "Admission",
    icon: "admission",
    items: [
      {
        q: "When is the application period?",
        a: "Applications are accepted each semester. Watch the News section and the official website for the official application period and deadline announcements for the upcoming academic year.",
      },
      {
        q: "Who can apply?",
        a: "Filipino and foreign students who have completed the requirements for the next level of study — Senior High School graduates for undergraduate programs, college graduates for graduate school, and transferees with good standing records.",
      },
      {
        q: "How do I apply online?",
        a: "Visit the Admission section, review the requirements, pay the application fee, then apply through the AIMS admission portal. You can track your application status anytime through the Student Portal on this site.",
      },
      {
        q: "What documents are required?",
        a: "The admission requirements are listed on the /apply page. These generally include the application form, authenticated report card or transcript of records, certificate of good moral character, and proof of payment of the application fee.",
      },
      {
        q: "Are transferees accepted?",
        a: "Yes. Transferees must be of good standing and must present their credentials, including an honorable dismissal and authenticated transcript of records for evaluation by the Admissions Office.",
      },
      {
        q: "Is the university entrance examination required?",
        a: "Some programs require qualifying examinations. Eligibility is determined by the Admissions Committee based on your credentials and the program requirements.",
      },
    ],
  },
  {
    label: "Fees & Payments",
    icon: "fees",
    items: [
      {
        q: "How much is the application fee?",
        a: "The application fee is ₱500.00 for undergraduate programs. Graduate school fees may differ — check the Graduate School announcements for the latest schedule.",
      },
      {
        q: "How can I pay the application fee?",
        a: "Payments are accepted through the payment channels listed on the /apply page. Keep your payment reference number — you will need it to complete your application.",
      },
      {
        q: "Is there a tuition fee?",
        a: "As a state university, UA does not charge tuition for eligible Filipino students. Other fees such as student council, laboratory, and miscellaneous fees may still apply and are set by the University.",
      },
      {
        q: "Do I need to pay before applying?",
        a: "Yes, the application fee must be paid before or at the time of application submission. Your application is marked Pending once payment is verified.",
      },
    ],
  },
  {
    label: "Student Portal",
    icon: "portal",
    items: [
      {
        q: "How do I check my application status?",
        a: "Log in to the Student Portal using the email and password you registered with. Your application status is shown on the dashboard — Draft, Pending, Under Review, Qualified, or Not Qualified.",
      },
      {
        q: "I forgot my password. What do I do?",
        a: "Use the 'Forgot password' link on the login page to reset it via email. If you still cannot log in, contact the Admissions Office for assistance.",
      },
      {
        q: "My status says 'Under Review'. What does that mean?",
        a: "The Admissions Committee is evaluating your application and documents. This step takes time — you will be notified once a decision has been made.",
      },
      {
        q: "How do I update my information?",
        a: "While your application is still a Draft you can edit your details anytime. Once submitted, contact the Admissions Office to request corrections.",
      },
    ],
  },
  {
    label: "Student Life",
    icon: "life",
    items: [
      {
        q: "What student services are available?",
        a: "The University provides health services, guidance and counseling, scholarship assistance, library services, student organizations, and campus ministry across all campuses.",
      },
      {
        q: "Are scholarships available?",
        a: "Yes — the Scholarship and Financial Assistance Unit administers several scholarships, including DOST, CHED grants, and institutional scholarships. Visit the Student Services section for details.",
      },
      {
        q: "Is dormitory housing available?",
        a: "Selected campuses provide dormitories for students. Inquire with the Student Affairs office of your campus for availability and reservation.",
      },
      {
        q: "How do I get a copy of my transcript or diploma?",
        a: "Request documents through the Registrar — see the Other Services links in the footer for the online document request form.",
      },
    ],
  },
];

const CATEGORY_ICONS: Record<FaqCategory["icon"], React.ComponentType<{ className?: string }>> = {
  admission: GraduationCap,
  fees: Banknote,
  portal: Monitor,
  life: Users,
};

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>("admission-0");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQ_CATEGORIES.map((category) => ({
      ...category,
      items: q
        ? category.items.filter((item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q))
        : category.items,
    })).filter((category) => category.items.length > 0);
  }, [query]);

  const total = FAQ_CATEGORIES.reduce((sum, c) => sum + c.items.length, 0);
  const matches = filtered.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crimson-700">Help Center</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-slate-900 sm:text-5xl">
        Frequently Asked Questions
      </h1>
      <p className="mt-4 max-w-2xl text-slate-600">
        Answers to common questions about admission, fees, the student portal, and life at the University of Antique.
      </p>

      <div className="relative mt-8">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${total} questions…`}
          aria-label="Search frequently asked questions"
          className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 text-sm text-slate-700 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-200 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Showing <strong className="font-semibold text-slate-900">{matches}</strong> of {total} questions
        {query.trim() && <> matching &ldquo;{query.trim()}&rdquo;</>}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <HelpCircle className="h-10 w-10 text-slate-300" />
          <p className="text-sm text-slate-500">
            No questions match your search. Try different keywords or contact us directly.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-10">
          {filtered.map((category) => (
            <section key={category.label}>
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-slate-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-crimson-700/10 text-crimson-700">
                  {(() => {
                    const Icon = CATEGORY_ICONS[category.icon];
                    return <Icon className="h-4 w-4" />;
                  })()}
                </span>
                {category.label}
              </h2>
              <div className="mt-4 space-y-3">
                {category.items.map((item, i) => {
                  const id = `${category.label}-${i}`;
                  const isOpen = open === id;
                  return (
                    <div
                      key={id}
                      className={cn(
                        "overflow-hidden rounded-xl border bg-white transition-colors",
                        isOpen ? "border-amber-300 shadow-md shadow-amber-900/5" : "border-slate-200",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : id)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      >
                        <span className="font-medium text-slate-900">{item.q}</span>
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 shrink-0 text-slate-400 transition-transform",
                            isOpen && "rotate-180 text-crimson-700",
                          )}
                        />
                      </button>
                      {isOpen && (
                        <div className="border-t border-slate-100 px-5 py-4 text-sm leading-relaxed text-slate-600">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <h2 className="font-display text-lg font-semibold text-slate-900">Still have questions?</h2>
        <p className="mt-1 text-sm text-slate-600">
          The Admissions Office is ready to help you.
        </p>
        <a
          href="/contact"
          className="mt-4 inline-flex items-center gap-1 rounded-lg bg-crimson-700 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-crimson-900/25 transition-colors hover:bg-crimson-800"
        >
          Contact the Admissions Office
        </a>
      </div>
    </div>
  );
}
