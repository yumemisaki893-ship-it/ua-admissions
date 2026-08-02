"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  Home,
  ShieldCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { AdminNavLink } from "@/components/admin/admin-links";

export function AdminSidebar({ role, links }: { role: string; links: AdminNavLink[] }) {
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
          "pointer-events-none absolute left-4 right-4 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 ring-1 ring-amber-300/60 transition-all duration-300 ease-out",
          pill ? "opacity-100" : "opacity-0",
        )}
        style={pill ? { top: pill.top, height: pill.height } : undefined}
      />
      <p className="relative px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
        {role === "ICTU" ? "ICTU Oversight" : "Administration"}
      </p>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          data-active={pathname.startsWith(link.href) ? "true" : "false"}
          className={cn(
            "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-200",
            pathname.startsWith(link.href) ? "text-crimson-800" : "hover:text-crimson-700",
          )}
        >
          <link.icon
            className={cn(
              "h-4 w-4 transition-colors duration-200",
              pathname.startsWith(link.href)
                ? "text-crimson-700"
                : "text-slate-400 group-hover:text-crimson-700",
            )}
          />
          {link.label}
        </Link>
      ))}
      <div className="relative border-t border-slate-100 pt-4">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Session
        </p>
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-yellow-50 hover:text-crimson-700"
        >
          <Home className="h-4 w-4 text-slate-400 transition-colors group-hover:text-crimson-700" />
          Public Website
        </Link>
        <a
          href="/api/auth/signout"
          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="h-4 w-4 text-slate-400 transition-colors group-hover:text-red-600" />
          Sign Out
        </a>
      </div>
      <div className="relative pt-4">
        <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-crimson-700 to-crimson-900 px-3 py-2.5 shadow-md shadow-crimson-900/20">
          <ShieldCheck className="h-4 w-4 shrink-0 text-yellow-300" />
          <p className="text-xs font-semibold text-white">{role.replace("_", " ")}</p>
        </div>
      </div>
    </nav>
  );
}
