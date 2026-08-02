import Link from "next/link";
import Image from "next/image";
import { Globe, AtSign, Video, Mail, Phone, MapPin, Landmark, ShieldCheck } from "lucide-react";

import { NewsletterForm } from "@/components/shared/newsletter-form";
import { siteConfig } from "@/lib/site-config";

const socialLinks = [
  { label: "Facebook", href: siteConfig.socials.facebook, icon: Globe },
  { label: "YouTube", href: siteConfig.socials.youtube, icon: Video },
  { label: "X (Twitter)", href: siteConfig.socials.twitter, icon: AtSign },
];

export function Footer() {
  return (
    <footer className="border-t border-crimson-900/40 bg-navy-950 text-navy-100">
      {/* Masthead strip */}
      <div className="border-b border-white/10 bg-gradient-to-r from-crimson-900 via-crimson-950 to-navy-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-10 sm:px-6 md:flex-row md:justify-between lg:px-8">
          <div className="flex items-center gap-4">
            <Image
              src="/ua/ua-seal.png"
              alt="University of Antique seal"
              width={72}
              height={72}
              className="h-[4.5rem] w-[4.5rem] rounded-full bg-white/10 p-1 ring-1 ring-gold-300/40"
            />
            <div>
              <p className="font-display text-lg font-semibold text-white">
                Republic of the Philippines · {siteConfig.name}
              </p>
              <p className="font-display text-sm italic text-gold-300">{siteConfig.tagline}</p>
            </div>
          </div>
          <div className="w-full max-w-md space-y-2 md:w-80">
            <p className="text-sm font-medium text-navy-100">Stay updated with UA news &amp; announcements</p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-navy-300">{siteConfig.description}</p>
          <div className="flex gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="rounded-full bg-white/10 p-2 transition-all hover:-translate-y-0.5 hover:bg-gold-300 hover:text-navy-950"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <ul className="flex flex-wrap gap-2 pt-1">
            {siteConfig.transparencySeals.slice(0, 3).map((seal) => (
              <li key={seal.label}>
                <a
                  href={seal.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-navy-300 transition-colors hover:border-gold-300/50 hover:text-gold-300"
                >
                  <ShieldCheck className="h-3 w-3 text-gold-300/70" />
                  {seal.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-gold-300">Quick Links</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {siteConfig.nav.slice(0, 6).map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-navy-300 transition-colors hover:text-gold-300">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/register" className="text-navy-300 transition-colors hover:text-gold-300">
                Apply Online
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-navy-300 transition-colors hover:text-gold-300">
                Student Portal
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-gold-300">Online Services</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {Object.entries(siteConfig.quickLinks).map(([, group]) =>
              group.items.slice(0, 1).map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-navy-300 transition-colors hover:text-gold-300"
                  >
                    {item.label}
                  </a>
                </li>
              )),
            )}
            <li>
              <a
                href="https://antiquespride.edu.ph/ua-transparency-seal/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-navy-300 transition-colors hover:text-gold-300"
              >
                Transparency Seal
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-gold-300">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-navy-300">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
              University of Antique Main Campus Sibalom, Antique 5713, Philippines
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
              {siteConfig.phone}
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
              {siteConfig.email}
            </li>
            <li className="flex gap-2.5">
              <Landmark className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
              <a
                href={siteConfig.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gold-300"
              >
                www.antiquespride.edu.ph
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-navy-400 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>
            <Link
              href={siteConfig.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-gold-300"
            >
              antiquespride.edu.ph
            </Link>{" "}
            · Sibalom, Antique, Philippines · {siteConfig.email}
          </p>
        </div>
      </div>
    </footer>
  );
}
