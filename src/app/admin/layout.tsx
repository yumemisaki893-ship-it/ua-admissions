import Link from "next/link";
import { redirect } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { Logo } from "@/components/shared/logo";
import { AdminSidebar, adminLinks, ictuLinks } from "@/components/admin/admin-sidebar";

export const dynamic = "force-dynamic";

const ADMIN_ROLES = ["SUPER_ADMIN", "REGISTRAR", "ADMISSIONS_OFFICER", "ICTU"];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = session?.user?.role;

  if (!session?.user) redirect("/login");
  if (!role || !ADMIN_ROLES.includes(role)) redirect("/portal/dashboard");

  const isIctu = role === "ICTU";
  const navLinks = isIctu ? ictuLinks : adminLinks;

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
          <Logo compact />
        </div>
        <AdminSidebar role={role} links={navLinks} />
      </aside>

      <div className="flex-1 lg:pl-60">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="lg:hidden">
            <Logo compact />
          </div>
          <p className="hidden text-sm font-medium text-slate-500 lg:block">
            University of Antique · {isIctu ? "ICTU Oversight Console" : "Admin Console"}
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
          {navLinks.map((link) => (
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
