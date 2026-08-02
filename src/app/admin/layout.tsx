import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Home,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";

export const dynamic = "force-dynamic";

const ADMIN_ROLES = ["SUPER_ADMIN", "REGISTRAR", "ADMISSIONS_OFFICER"];

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/applicants", label: "Applicants", icon: Users },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = session?.user?.role;

  if (!session?.user) redirect("/login");
  if (!role || !ADMIN_ROLES.includes(role)) redirect("/portal/dashboard");

  const initials = (session.user.name ?? "A")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-slate-100 px-5">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Administration
          </p>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-yellow-50 hover:text-crimson-700",
              )}
            >
              <link.icon className="h-4 w-4 text-slate-400 transition-colors group-hover:text-crimson-700" />
              {link.label}
            </Link>
          ))}
          <div className="border-t border-slate-100 pt-4">
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
        </nav>
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-2 rounded-lg bg-crimson-50 px-3 py-2.5 ring-1 ring-crimson-100">
            <ShieldCheck className="h-4 w-4 shrink-0 text-crimson-700" />
            <p className="text-xs font-medium text-crimson-800">{role.replace("_", " ")}</p>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:pl-60">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="lg:hidden">
            <Logo />
          </div>
          <p className="hidden text-sm font-medium text-slate-500 lg:block">
            University of Antique · Admin Console
          </p>
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-gradient-to-br from-crimson-700 to-crimson-900 text-yellow-200">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-tight text-slate-900">{session.user.name}</p>
              <p className="text-xs text-slate-500">{role.replace("_", " ")}</p>
            </div>
          </div>
        </header>

        {/* Mobile nav */}
        <nav
          className="flex overflow-x-auto border-b border-slate-200 bg-white lg:hidden"
          aria-label="Admin mobile navigation"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-w-20 flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium text-slate-500"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
