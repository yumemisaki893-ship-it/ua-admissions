"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Home, LogOut, Bell, GraduationCap, ChevronDown, UserRound, BookOpenCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";

export function PortalNav({
  initials,
  name,
  unreadCount,
}: {
  initials: string;
  name: string;
  unreadCount: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const listRef = React.useRef<HTMLUListElement>(null);
  const [pill, setPill] = React.useState<{ left: number; width: number } | null>(null);

  const links = [
    { href: "/portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/portal/grades", label: "My Grades", icon: BookOpenCheck },
    { href: "/portal/apply", label: "Application", icon: FileText },
    { href: "/portal/notifications", label: "Notifications", icon: Bell },
    { href: "/portal/profile", label: "Profile", icon: UserRound },
  ];

  React.useEffect(() => {
    const active = listRef.current?.querySelector<HTMLLIElement>("li[data-active='true']");
    if (active) setPill({ left: active.offsetLeft, width: active.offsetWidth });
  }, [pathname]);

  function handleHover(e: React.MouseEvent<HTMLUListElement>) {
    const li = (e.target as HTMLElement).closest("li");
    if (li && li.parentElement === listRef.current) {
      setPill({ left: li.offsetLeft, width: li.offsetWidth });
    }
  }

  function handleLeave() {
    const active = listRef.current?.querySelector<HTMLLIElement>("li[data-active='true']");
    if (active) setPill({ left: active.offsetLeft, width: active.offsetWidth });
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6" aria-label="Portal navigation">
        <div className="flex items-center gap-6">
          <Logo />
          <ul
            ref={listRef}
            onMouseMove={handleHover}
            onMouseLeave={handleLeave}
            className="relative hidden items-center gap-1 sm:flex"
          >
            <span
              className={cn(
                "pointer-events-none absolute inset-y-0 rounded-md bg-crimson-50 ring-1 ring-crimson-700/20 transition-all duration-300 ease-out",
                pill ? "opacity-100" : "opacity-0",
              )}
              style={pill ? { left: pill.left, width: pill.width } : undefined}
            />
            {links.map((link) => (
              <li
                key={link.href}
                data-active={pathname.startsWith(link.href) ? "true" : "false"}
                className="relative"
              >
                <Link
                  href={link.href}
                  className={cn(
                    "relative inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200",
                    pathname.startsWith(link.href) ? "text-crimson-800" : "text-slate-600 hover:text-crimson-800",
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/portal/notifications"
            aria-label={`Notifications (${unreadCount} unread)`}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-yellow-50 hover:text-crimson-700"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-accent">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-crimson-700 to-crimson-900 text-white">{initials}</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="truncate text-sm font-medium">{name}</p>
                <p className="text-xs font-normal text-muted-foreground">Student</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/portal/dashboard" className="cursor-pointer">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/portal/apply" className="cursor-pointer">
                  <GraduationCap className="h-4 w-4" /> Application
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/portal/grades" className="cursor-pointer">
                  <BookOpenCheck className="h-4 w-4" /> My Grades
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/portal/notifications" className="cursor-pointer">
                  <Bell className="h-4 w-4" /> Notifications
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/portal/profile" className="cursor-pointer">
                  <UserRound className="h-4 w-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/" className="cursor-pointer">
                  <Home className="h-4 w-4" /> Public Website
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={async () => {
                  router.push("/api/auth/signout");
                }}
              >
                <LogOut className="h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" className="sm:hidden" asChild>
            <Link href="/portal/apply">Apply</Link>
          </Button>
        </div>
      </nav>
      {/* Mobile bottom links */}
      <nav className="flex border-t sm:hidden" aria-label="Portal mobile navigation">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium",
              pathname.startsWith(link.href) ? "text-crimson-700" : "text-muted-foreground",
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
