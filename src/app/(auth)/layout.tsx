import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, Clock4, Headset } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { siteConfig } from "@/lib/site-config";

const perks = [
  { icon: Clock4, title: "Track in Real Time", desc: "Follow your application status from draft to decision." },
  { icon: ShieldCheck, title: "Secure & Official", desc: "Official UA admissions portal with encrypted data." },
  { icon: Headset, title: "Admissions Support", desc: "Reach our admissions team anytime via email or phone." },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-navy-950 lg:flex-row">
      {/* Left branding panel */}
      <aside className="relative hidden overflow-hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-crimson-900 via-navy-950 to-navy-950" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 30%, #f2de5e 0, transparent 40%), radial-gradient(circle at 85% 85%, #9d0505 0, transparent 50%)",
          }}
        />
        <Link href="/" className="relative z-10 inline-flex items-center gap-2 text-sm text-gold-300 transition-colors hover:text-gold-200">
          <ArrowLeft className="h-4 w-4" /> Back to website
        </Link>

        <div className="relative z-10 max-w-md space-y-8">
          <Image
            src="/ua/ua-seal.png"
            alt="University of Antique seal"
            width={96}
            height={96}
            className="rounded-full bg-white/10 p-1.5 ring-2 ring-gold-300/50"
          />
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
              Republic of the Philippines
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight text-white">
              Transforming Lives &amp; Building Communities
            </h1>
            <p className="text-navy-200">
              Welcome to the {siteConfig.name} Student Information Management and Admission System.
            </p>
          </div>
          <ul className="space-y-4">
            {perks.map((perk) => (
              <li key={perk.title} className="flex items-start gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-crimson-700/40 text-gold-300 ring-1 ring-crimson-700/50">
                  <perk.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{perk.title}</p>
                  <p className="text-xs text-navy-300">{perk.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-navy-400">
          © {new Date().getFullYear()} {siteConfig.name} · {siteConfig.address}
        </p>
      </aside>

      {/* Right form panel */}
      <div className="relative flex min-h-screen flex-col bg-navy-950 lg:min-h-0 lg:w-1/2">
        <div
          className="pointer-events-none absolute inset-0 lg:hidden"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 10%, #7c0f12 0, transparent 45%), radial-gradient(circle at 90% 90%, #f2de5e 0, transparent 35%)",
            opacity: 0.15,
          }}
        />
        <header className="relative z-10 mx-auto w-full max-w-md px-4 py-6 sm:px-6">
          <Logo light />
        </header>
        <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-10 sm:px-6">
          <div className="w-full max-w-md">{children}</div>
        </main>
        <footer className="relative z-10 pb-6 text-center text-xs text-navy-400 lg:hidden">
          © {new Date().getFullYear()} University of Antique ·{" "}
          <Link href="/" className="underline-offset-2 hover:underline">
            Back to website
          </Link>
        </footer>
      </div>
    </div>
  );
}
