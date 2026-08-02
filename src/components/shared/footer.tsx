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
    <footer className="border-t border-white/10 bg-slate-950/80 text-slate-300 backdrop-blur-xl">
      {/* Masthead strip */}
      <div className="border-b border-amber-400/30 bg-gradient-to-r from-crimson-700 via-crimson-800 to-crimson-900">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-10 sm:px-6 md:flex-row md:justify-between lg:px-8">
          <div className="flex items-center gap-4">
            <Image
              src="/ua/ua-seal.png"
              alt="University of Antique seal"
              width={72}
              height={72}
              className="h-[4.5rem] w-[4.5rem] rounded-full bg-white/10 p-1 ring-1 ring-yellow-300/60"
            />
            <div>
              <p className="font-display text-lg font-semibold text-white">{siteConfig.name}</p>
              <p className="font-display text-sm italic text-yellow-200">{siteConfig.tagline}</p>
            </div>
          </div>
          <div className="w-full max-w-md space-y-2 md:w-80">
            <p className="text-sm font-medium text-red-50">Stay updated with UA news &amp; announcements</p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-slate-400">{siteConfig.description}</p>
          <div className="flex gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="rounded-full border border-white/10 bg-white/[0.06] p-2 text-slate-300 transition-all hover:-translate-y-0.5 hover:border-amber-400/60 hover:bg-yellow-300 hover:text-slate-900"
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
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-slate-400 transition-colors hover:border-amber-400/70 hover:text-amber-300"
                >
                  <ShieldCheck className="h-3 w-3 text-amber-300" />
                  {seal.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-crimson-300">Quick Links</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {siteConfig.nav.slice(0, 6).map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-slate-400 transition-colors hover:text-crimson-300">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/register" className="text-slate-400 transition-colors hover:text-crimson-300">
                Apply Online
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-slate-400 transition-colors hover:text-crimson-300">
                Student Portal
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-crimson-300">Online Services</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {Object.entries(siteConfig.quickLinks).map(([, group]) =>
              group.items.slice(0, 1).map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 transition-colors hover:text-crimson-300"
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
                className="text-slate-400 transition-colors hover:text-crimson-300"
              >
                Transparency Seal
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-crimson-300">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              University of Antique Main Campus Sibalom, Antique 5713, Philippines
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              {siteConfig.phone}
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              {siteConfig.email}
            </li>
            <li className="flex gap-2.5">
              <Landmark className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <a
                href={siteConfig.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-crimson-300"
              >
                www.antiquespride.edu.ph
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>
            <Link
              href={siteConfig.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-crimson-300"
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
