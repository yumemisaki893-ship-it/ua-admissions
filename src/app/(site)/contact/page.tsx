import { Mail, Phone, MapPin, Clock } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { ContactForm } from "@/components/shared/contact-form";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

const contactCards = [
  { icon: MapPin, label: "Visit Us", value: siteConfig.address },
  { icon: Phone, label: "Call Us", value: siteConfig.phone },
  { icon: Mail, label: "Email Us", value: siteConfig.email },
  { icon: Clock, label: "Office Hours", value: "Monday–Friday, 8:00 AM – 5:00 PM" },
];

export default function ContactPage() {
  const mapUrl =
    process.env.NEXT_PUBLIC_MAP_EMBED_URL ??
    "https://maps.google.com/maps?q=University%20of%20Antique%2C%20Sibalom%2C%20Antique&t=&z=14&ie=UTF8&iwloc=&output=embed";

  return (
    <>
      <section className="border-b bg-gradient-to-br from-sky-800 to-navy-900 py-16 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Get in Touch</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">Contact Us</h1>
          <p className="mt-4 text-sky-100">
            Questions about admissions, enrollment, or campus life? We are here to help.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactCards.map((card) => (
            <Card key={card.label}>
              <CardContent className="flex items-start gap-4 p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700 ring-1 ring-sky-200">
                  <card.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {card.label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-navy-900">{card.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Send a Message"
              title="We would love to hear from you"
              description="Fill out the form and our team will respond within 1–2 business days."
            />
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <div className="space-y-5">
            <div className="overflow-hidden rounded-xl border shadow-sm">
              <iframe
                src={mapUrl}
                title="University of Antique map"
                width="100%"
                height="380"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <Card className="bg-navy-950">
              <CardContent className="p-6 text-sm leading-relaxed text-navy-200">
                <p className="font-display text-base font-semibold text-white">Office of Admissions</p>
                <p className="mt-2">
                  For application-related concerns, email{" "}
                  <span className="text-sky-400">admissions@universityofantique.edu.ph</span> or visit the
                  Admissions Office at the Main Campus, Sibalom, Antique.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
