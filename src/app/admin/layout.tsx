import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Users, FileText, LogOut, Home } from "lucide-react";

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
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r bg-navy-950 lg:flex">
        <div className="flex h-16 items-center border-b border-white/10 px-5">
          <Logo light />
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-navy-400">
            Administration
          </p>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-200 transition-colors hover:bg-white/10 hover:text-white",
              )}
            >
              <link.icon className="h-4 w-4 text-sky-400" />
              {link.label}
            </Link>
          ))}
          <div className="pt-6">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Home className="h-4 w-4" />
              Public Website
            </Link>
            <a
              href="/api/auth/signout"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </a>
          </div>
        </nav>
      </aside>

      <div className="flex-1 lg:pl-60">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="lg:hidden">
            <Logo />
          </div>
          <p className="hidden text-sm font-medium text-muted-foreground lg:block">
            University of Antique · Admin Console
          </p>
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-navy-900 text-sky-400">{initials}</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-tight text-navy-900">{session.user.name}</p>
              <p className="text-xs text-muted-foreground">{role.replace("_", " ")}</p>
            </div>
          </div>
        </header>

        {/* Mobile nav */}
        <nav className="flex border-b bg-white lg:hidden" aria-label="Admin mobile navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium text-muted-foreground"
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
