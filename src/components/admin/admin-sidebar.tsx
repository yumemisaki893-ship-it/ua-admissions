"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Home,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";

export const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/applicants", label: "Applicants", icon: Users },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const listRef = React.useRef<HTMLDivElement>(null);
  const [pill, setPill] = React.useState<{ top: number; height: number } | null>(null);

  React.useEffect(() => {
    const active = listRef.current?.querySelector<HTMLAnchorElement>("a[data-active='true']");
    if (active) {
      setPill({ top: active.offsetTop, height: active.offsetHeight });
    }
  }, [pathname]);

  function handleHover(e: React.MouseEvent<HTMLDivElement>) {
    const a = (e.target as HTMLElement).closest("a");
    if (a && a.parentElement === listRef.current) {
      setPill({ top: a.offsetTop, height: a.offsetHeight });
    }
  }

  function handleLeave() {
    const active = listRef.current?.querySelector<HTMLAnchorElement>("a[data-active='true']");
    if (active) {
      setPill({ top: active.offsetTop, height: active.offsetHeight });
    }
  }

  return (
    <nav className="relative flex-1 space-y-1 p-4" ref={listRef} onMouseMove={handleHover} onMouseLeave={handleLeave}>
      <span
        className={cn(
          "pointer-events-none absolute left-4 right-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-amber-500/10 ring-1 ring-amber-400/40 transition-all duration-300 ease-out",
          pill ? "opacity-100" : "opacity-0",
        )}
        style={pill ? { top: pill.top, height: pill.height } : undefined}
      />
      <p className="relative px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        Administration
      </p>
      {adminLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          data-active={pathname.startsWith(link.href) ? "true" : "false"}
          className={cn(
            "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors duration-200",
            pathname.startsWith(link.href) ? "text-crimson-300" : "hover:text-crimson-300",
          )}
        >
          <link.icon
            className={cn(
              "h-4 w-4 transition-colors duration-200",
              pathname.startsWith(link.href)
                ? "text-crimson-400"
                : "text-slate-500 group-hover:text-crimson-400",
            )}
          />
          {link.label}
        </Link>
      ))}
      <div className="relative border-t border-white/10 pt-4">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          Session
        </p>
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-yellow-500/10 hover:text-crimson-300"
        >
          <Home className="h-4 w-4 text-slate-500 transition-colors group-hover:text-crimson-400" />
          Public Website
        </Link>
        <a
          href="/api/auth/signout"
          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-4 w-4 text-slate-500 transition-colors group-hover:text-red-400" />
          Sign Out
        </a>
      </div>
      <div className="relative pt-4">
        <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-crimson-700 to-crimson-900 px-3 py-2.5 shadow-md shadow-black/30">
          <ShieldCheck className="h-4 w-4 shrink-0 text-yellow-300" />
          <p className="text-xs font-semibold text-white">{role.replace("_", " ")}</p>
        </div>
      </div>
    </nav>
  );
}
