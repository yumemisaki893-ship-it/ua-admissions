"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ExternalLink, Menu, UserRound, GraduationCap, ArrowRight } from "lucide-react";

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
  const listRef = useRef<HTMLUListElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Snap the sliding pill to the active item on mount/navigation.
  useEffect(() => {
    const active = listRef.current?.querySelector<HTMLLIElement>("li[data-active='true']");
    if (active) {
      setPill({ left: active.offsetLeft, width: active.offsetWidth });
    }
  }, [pathname]);

  function handleHover(e: React.MouseEvent<HTMLUListElement>) {
    const li = (e.target as HTMLElement).closest("li");
    if (li && li.parentElement === listRef.current) {
      setPill({ left: li.offsetLeft, width: li.offsetWidth });
    }
  }

  function handleLeave() {
    const active = listRef.current?.querySelector<HTMLLIElement>("li[data-active='true']");
    if (active) {
      setPill({ left: active.offsetLeft, width: active.offsetWidth });
    } else {
      setPill(null);
    }
  }

  return (
    <header className="sticky top-0 z-40">
      <nav
        aria-label="Main navigation"
        className={cn(
          "border-b bg-white/95 backdrop-blur transition-all duration-300 supports-[backdrop-filter]:bg-white/90",
          scrolled ? "border-slate-200 shadow-md shadow-slate-900/5" : "border-slate-200/70",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />

          {/* Desktop nav */}
          <ul
            ref={listRef}
            onMouseMove={handleHover}
            onMouseLeave={handleLeave}
            className="relative hidden items-center gap-0.5 lg:flex"
          >
            {/* Sliding hover pill */}
            <span
              className={cn(
                "pointer-events-none absolute -bottom-0 top-0 rounded-md bg-crimson-700/10 ring-1 ring-crimson-700/20 transition-all duration-300 ease-out",
                pill ? "opacity-100" : "opacity-0",
              )}
              style={pill ? { left: pill.left, width: pill.width } : undefined}
            />
            {siteConfig.nav.map((item) =>
              item.children ? (
                <li
                  key={item.label}
                  data-active={pathname.startsWith(item.href) ? "true" : "false"}
                  className="relative"
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          "group inline-flex h-10 items-center gap-1 rounded-md px-3 text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-crimson-800",
                          pathname.startsWith(item.href) && "text-crimson-800",
                        )}
                      >
                        {item.label}
                        <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-all duration-300 group-data-[state=open]:rotate-180 group-data-[state=open]:opacity-100 group-hover:-translate-y-px" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-[340px] border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur data-[state=open]:slide-in-from-top-2"
                    >
                      <div className="grid grid-cols-1">
                        {item.children.map((child) => (
                          <DropdownMenuItem
                            key={child.href + child.label}
                            asChild
                            className="group/item cursor-pointer flex-col items-start gap-0.5 rounded-md p-3 text-slate-700 transition-colors duration-150 hover:bg-yellow-50 focus:bg-yellow-50 focus:text-crimson-800 data-[highlighted]:bg-yellow-50"
                          >
                            {child.external ? (
                              <a href={child.href} target="_blank" rel="noopener noreferrer">
                                <span className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors group-hover/item:text-crimson-800">
                                  {child.label}
                                  <ExternalLink className="h-3 w-3 text-amber-500 transition-transform duration-200 group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5" />
                                </span>
                                {child.description && (
                                  <span className="text-xs font-normal text-slate-500 transition-colors group-hover/item:text-slate-600">
                                    {child.description}
                                  </span>
                                )}
                              </a>
                            ) : (
                              <Link href={child.href}>
                                <span className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors group-hover/item:text-crimson-800">
                                  {child.label}
                                  <ArrowRight className="h-3 w-3 -translate-x-1 text-crimson-700 opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                                </span>
                                {child.description && (
                                  <span className="block text-xs font-normal text-slate-500 transition-colors group-hover/item:text-slate-600">
                                    {child.description}
                                  </span>
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
                <li
                  key={item.label}
                  data-active={pathname.startsWith(item.href) ? "true" : "false"}
                  className="relative"
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "group relative inline-flex h-10 items-center rounded-md px-3 text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-crimson-800",
                      pathname.startsWith(item.href) && "text-crimson-800",
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute inset-x-3 -bottom-px h-0.5 origin-left rounded-full bg-crimson-700 transition-transform duration-300 ease-out",
                        pathname.startsWith(item.href)
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </Link>
                </li>
              ),
            )}
          </ul>

          <div className="hidden items-center gap-2 lg:flex">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-300 text-slate-700 hover:border-amber-400 hover:bg-yellow-300 hover:text-slate-900"
              asChild
            >
              <Link href="/login">
                <UserRound className="mr-1 h-4 w-4" /> Student Portal
              </Link>
            </Button>
            <Button
              size="sm"
              className="bg-crimson-700 text-white shadow-md shadow-crimson-900/20 hover:bg-yellow-400 hover:text-slate-900"
              asChild
            >
              <Link href="/register">
                <GraduationCap className="mr-1 h-4 w-4" /> Apply Now
              </Link>
            </Button>
          </div>

          {/* Mobile menu */}
          <div className="flex items-center gap-2 lg:hidden">
            <Button variant="outline" size="icon" className="border-slate-300 text-slate-700" asChild aria-label="Student portal">
              <Link href="/login">
                <UserRound className="h-4 w-4" />
              </Link>
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-700 hover:bg-slate-100" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto bg-white">
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <div className="mt-4 flex flex-col gap-1">
                  {siteConfig.nav.map((item) => (
                    <div key={item.label} className="flex flex-col">
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-crimson-800",
                          pathname.startsWith(item.href) && "text-crimson-800",
                        )}
                      >
                        {item.label}
                      </Link>
                      {item.children && (
                        <div className="ml-3 flex flex-col border-l border-slate-200 pl-3">
                          {item.children.map((child) => (
                            <Link
                              key={child.href + child.label}
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className="flex flex-col gap-0.5 rounded-md px-3 py-2 text-slate-500 hover:bg-slate-100 hover:text-crimson-800"
                            >
                              <span className="inline-flex items-center gap-1.5 text-sm">
                                {child.label}
                                {child.external && <ExternalLink className="h-3 w-3 text-amber-500" />}
                              </span>
                              {child.description && (
                                <span className="text-xs text-slate-400">{child.description}</span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4">
                    <Button className="bg-crimson-700 text-white shadow-md shadow-crimson-900/20 hover:bg-yellow-400 hover:text-slate-900" asChild>
                      <Link href="/register" onClick={() => setOpen(false)}>
                        <GraduationCap className="mr-1 h-4 w-4" /> Apply Now
                      </Link>
                    </Button>
                    <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100" asChild>
                      <Link href="/login" onClick={() => setOpen(false)}>
                        <UserRound className="mr-1 h-4 w-4" /> Student Portal
                      </Link>
                    </Button>
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
