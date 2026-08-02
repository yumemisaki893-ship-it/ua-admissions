import Link from "next/link";
import { Globe, AtSign, Video, Mail, Phone, MapPin, Landmark } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t border-crimson-900/40 bg-navy-950 text-navy-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Logo light />
          <p className="text-sm leading-relaxed text-navy-300">{siteConfig.description}</p>
          <div className="flex gap-3">
            <a
              href={siteConfig.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="rounded-full bg-white/10 p-2 transition-colors hover:bg-gold-300 hover:text-navy-950"
            >
              <Globe className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="rounded-full bg-white/10 p-2 transition-colors hover:bg-gold-300 hover:text-navy-950"
            >
              <Video className="h-4 w-4" />
            </a>
            <a
              href="https://twitter.com/universityantique"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="rounded-full bg-white/10 p-2 transition-colors hover:bg-gold-300 hover:text-navy-950"
            >
              <AtSign className="h-4 w-4" />
            </a>
          </div>
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
          <p>© {new Date().getFullYear()} University of Antique. All rights reserved.</p>
          <p>
            <Link href={siteConfig.url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gold-300">
              antiquespride.edu.ph
            </Link>{" "}
            · Sibalom, Antique, Philippines
          </p>
        </div>
      </div>
    </footer>
  );
}