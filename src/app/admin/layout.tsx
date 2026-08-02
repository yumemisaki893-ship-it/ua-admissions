import Link from "next/link";
import { redirect } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { Logo } from "@/components/shared/logo";
import { AdminSidebar, adminLinks } from "@/components/admin/admin-sidebar";

export const dynamic = "force-dynamic";

const ADMIN_ROLES = ["SUPER_ADMIN", "REGISTRAR", "ADMISSIONS_OFFICER"];

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
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-white/10 bg-slate-950/90 backdrop-blur-xl lg:flex">
        <div className="flex h-16 items-center border-b border-white/10 px-5">
          <Logo compact />
        </div>
        <AdminSidebar role={role} />
      </aside>

      <div className="flex-1 lg:pl-60">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="lg:hidden">
            <Logo compact />
          </div>
          <p className="hidden text-sm font-medium text-slate-400 lg:block">
            University of Antique · Admin Console
          </p>
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-gradient-to-br from-crimson-700 to-crimson-900 text-yellow-200">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-tight text-white">{session.user.name}</p>
              <p className="text-xs text-slate-400">{role.replace("_", " ")}</p>
            </div>
          </div>
        </header>

        {/* Mobile nav */}
        <nav
          className="flex overflow-x-auto border-b border-white/10 bg-slate-950/80 backdrop-blur-xl lg:hidden"
          aria-label="Admin mobile navigation"
        >
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-w-20 flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium text-slate-400"
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
