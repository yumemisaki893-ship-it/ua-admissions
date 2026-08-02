import Link from "next/link";
import { Globe, AtSign, Video, Mail, Phone, MapPin } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Logo light />
          <p className="text-sm leading-relaxed text-navy-300">{siteConfig.description}</p>
          <div className="flex gap-3">
            <a href={siteConfig.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="rounded-full bg-white/10 p-2 transition-colors hover:bg-sky-600">
              <Globe className="h-4 w-4" />
            </a>
            <a href={siteConfig.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="rounded-full bg-white/10 p-2 transition-colors hover:bg-sky-600">
              <AtSign className="h-4 w-4" />
            </a>
            <a href={siteConfig.socials.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="rounded-full bg-white/10 p-2 transition-colors hover:bg-sky-600">
              <Video className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {siteConfig.nav.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-navy-300 transition-colors hover:text-sky-400">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/register" className="text-navy-300 transition-colors hover:text-sky-400">
                Apply Online
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-navy-300 transition-colors hover:text-sky-400">
                Student Portal
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Academics</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/academics" className="text-navy-300 transition-colors hover:text-sky-400">Colleges &amp; Programs</Link></li>
            <li><Link href="/academics#graduate-school" className="text-navy-300 transition-colors hover:text-sky-400">Graduate School</Link></li>
            <li><Link href="/news" className="text-navy-300 transition-colors hover:text-sky-400">News &amp; Events</Link></li>
            <li><Link href="/about" className="text-navy-300 transition-colors hover:text-sky-400">About the University</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-navy-300">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
              {siteConfig.address}
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
              {siteConfig.phone}
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
              {siteConfig.email}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-navy-400 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} University of Antique. All rights reserved.</p>
          <p>State University — Sibalom, Antique, Philippines</p>
        </div>
      </div>
    </footer>
  );
}
