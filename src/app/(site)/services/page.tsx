import { Clock, HeartHandshake, PhoneCall } from "lucide-react";

import { ServiceDirectory } from "@/components/shared/service-directory";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

const quickContacts = [
  {
    icon: HeartHandshake,
    title: "Guidance & Counseling",
    value: siteConfig.phone,
    note: "Monday–Friday, 8:00 AM – 5:00 PM",
  },
  {
    icon: PhoneCall,
    title: "ICTU Helpdesk",
    value: "support.universityofantique.edu.ph",
    note: "Open an online ticket 24/7",
  },
  {
    icon: Clock,
    title: "Office Hours",
    value: "8:00 AM – 5:00 PM",
    note: "Monday to Friday, except holidays",
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-amber-200 bg-gradient-to-br from-crimson-700 via-crimson-800 to-crimson-950 py-16 text-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, #dfae19 0, transparent 40%), radial-gradient(circle at 80% 70%, #3f0608 0, transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">
            Student Life Support
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
            Student Services
          </h1>
          <p className="mt-4 text-red-50">
            Everything you need to thrive at the University of Antique — health, welfare, financial
            aid, academics, and technology — in one place.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="stagger grid gap-4 sm:grid-cols-3">
          {quickContacts.map((card) => (
            <Card
              key={card.title}
              className="border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg hover:shadow-red-900/10"
            >
              <CardContent className="flex items-start gap-4 p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-crimson-700/10 text-crimson-700 ring-1 ring-crimson-700/30">
                  <card.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {card.title}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{card.value}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{card.note}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-14">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crimson-700">
              Service Directory
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">
              Explore university services
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-500">
              Search, filter, and jump straight to the service you need. Most services can be
              accessed online through the official university portals.
            </p>
          </div>
          <div className="mt-8">
            <ServiceDirectory />
          </div>
        </div>
      </section>
    </>
  );
}
