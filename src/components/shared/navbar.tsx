"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, ExternalLink, Mail, Menu, Phone, UserRound, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40">
      {/* Top utility strip */}
      <div className="hidden bg-crimson-900 text-[13px] text-navy-100 lg:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <p className="truncate font-medium text-gold-300/90">Republic of the Philippines · University of Antique</p>
          <div className="flex items-center gap-6">
            <a
              href={`tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-gold-300"
            >
              <Phone className="h-3.5 w-3.5" /> {siteConfig.phone}
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-gold-300"
            >
              <Mail className="h-3.5 w-3.5" /> {siteConfig.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav
        aria-label="Main navigation"
        className={cn(
          "border-b transition-all duration-300",
          scrolled
            ? "border-crimson-900/60 bg-navy-950/95 shadow-lg shadow-black/30 backdrop-blur supports-[backdrop-filter]:bg-navy-950/90"
            : "border-crimson-900/40 bg-navy-950/90 backdrop-blur supports-[backdrop-filter]:bg-navy-950/80",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo light />

          {/* Desktop nav */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {siteConfig.nav.map((item) =>
              item.children ? (
                <li key={item.label}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          "group inline-flex h-10 items-center gap-1 rounded-md px-3 text-sm font-medium text-navy-100 transition-colors hover:bg-crimson-700/40 hover:text-white",
                          pathname.startsWith(item.href) && "text-gold-300",
                        )}
                      >
                        {item.label}
                        <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[340px] border-crimson-900/40 bg-navy-900 p-2">
                      <div className="grid grid-cols-1">
                        {item.children.map((child) => (
                          <DropdownMenuItem
                            key={child.href + child.label}
                            asChild
                            className="cursor-pointer flex-col items-start gap-0.5 rounded-md p-3 text-navy-100 focus:bg-crimson-700/40 focus:text-white"
                          >
                            {child.external ? (
                              <a href={child.href} target="_blank" rel="noopener noreferrer">
                                <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                                  {child.label}
                                  <ExternalLink className="h-3 w-3 text-gold-300/70" />
                                </span>
                                {child.description && (
                                  <span className="text-xs font-normal text-navy-400">{child.description}</span>
                                )}
                              </a>
                            ) : (
                              <Link href={child.href}>
                                <span className="text-sm font-medium">{child.label}</span>
                                {child.description && (
                                  <span className="block text-xs font-normal text-navy-400">{child.description}</span>
                                )}
                              </Link>
                            )}
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              ) : (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative inline-flex h-10 items-center rounded-md px-3 text-sm font-medium text-navy-100 transition-colors hover:bg-white/10 hover:text-white",
                      pathname.startsWith(item.href) && "text-gold-300",
                    )}
                  >
                    {item.label}
                    {pathname.startsWith(item.href) && (
                      <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gold-300" />
                    )}
                  </Link>
                </li>
              ),
            )}
          </ul>

          <div className="hidden items-center gap-2 lg:flex">
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-navy-100 hover:border-gold-300 hover:bg-gold-300 hover:text-navy-950"
              asChild
            >
              <Link href="/login">
                <UserRound className="mr-1 h-4 w-4" /> Student Portal
              </Link>
            </Button>
            <Button
              size="sm"
              className="bg-crimson-700 text-white shadow-md shadow-crimson-950/50 hover:bg-gold-300 hover:text-navy-950"
              asChild
            >
              <Link href="/register">
                <GraduationCap className="mr-1 h-4 w-4" /> Apply Now
              </Link>
            </Button>
          </div>

          {/* Mobile menu */}
          <div className="flex items-center gap-2 lg:hidden">
            <Button variant="outline" size="icon" className="border-white/20 text-navy-100" asChild aria-label="Student portal">
              <Link href="/login">
                <UserRound className="h-4 w-4" />
              </Link>
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-navy-100 hover:bg-white/10" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto bg-navy-950">
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <div className="mt-4 flex flex-col gap-1">
                  {siteConfig.nav.map((item) => (
                    <div key={item.label} className="flex flex-col">
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "rounded-md px-3 py-2.5 text-sm font-medium text-navy-100 hover:bg-white/10 hover:text-white",
                          pathname.startsWith(item.href) && "text-gold-300",
                        )}
                      >
                        {item.label}
                      </Link>
                      {item.children && (
                        <div className="ml-3 flex flex-col border-l border-white/10 pl-3">
                          {item.children.map((child) => (
                            <Link
                              key={child.href + child.label}
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className="flex flex-col gap-0.5 rounded-md px-3 py-2 text-navy-300 hover:bg-white/10 hover:text-white"
                            >
                              <span className="inline-flex items-center gap-1.5 text-sm">
                                {child.label}
                                {child.external && <ExternalLink className="h-3 w-3 text-gold-300/70" />}
                              </span>
                              {child.description && (
                                <span className="text-xs text-navy-500">{child.description}</span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
                    <Button className="bg-crimson-700 text-white shadow-md shadow-crimson-950/50 hover:bg-gold-300 hover:text-navy-950" asChild>
                      <Link href="/register" onClick={() => setOpen(false)}>
                        <GraduationCap className="mr-1 h-4 w-4" /> Apply Now
                      </Link>
                    </Button>
                    <Button variant="outline" className="border-white/20 text-navy-100 hover:bg-white/10" asChild>
                      <Link href="/login" onClick={() => setOpen(false)}>
                        <UserRound className="mr-1 h-4 w-4" /> Student Portal
                      </Link>
                    </Button>
                    <div className="mt-2 space-y-1 border-t border-white/10 pt-3 text-xs text-navy-400">
                      <p className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-gold-300/70" /> {siteConfig.phone}</p>
                      <p className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-gold-300/70" /> {siteConfig.email}</p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
