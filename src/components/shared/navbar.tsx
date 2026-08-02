"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ExternalLink, Menu, UserRound, GraduationCap, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
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
          "border-b bg-slate-950/75 backdrop-blur-xl transition-all duration-300 supports-[backdrop-filter]:bg-slate-950/65",
          scrolled
            ? "border-white/10 shadow-lg shadow-black/40"
            : "border-white/5",
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
                "pointer-events-none absolute -bottom-0 top-0 rounded-md bg-crimson-500/15 ring-1 ring-crimson-400/30 transition-all duration-300 ease-out",
                pill ? "opacity-100" : "opacity-0",
              )}
              style={pill ? { left: pill.left, width: pill.width } : undefined}
            />
            {siteConfig.nav.map((item) =>
              item.children ? (
                <li
                  key={item.label}
                  data-active={pathname.startsWith(item.href) ? "true" : "false"}
                  className="group relative"
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                    className={cn(
                      "inline-flex h-10 items-center gap-1 rounded-md px-3 text-sm font-medium text-slate-300 transition-colors duration-200 hover:text-crimson-300 group-focus-within:text-crimson-300",
                      pathname.startsWith(item.href) && "text-crimson-300",
                    )}
                  >
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-all duration-300 group-hover:rotate-180 group-hover:opacity-100 group-hover:-translate-y-px" />
                  </button>
                  <div className="invisible absolute left-0 top-full z-50 -translate-y-1 pt-2 opacity-0 transition-all duration-200 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <div className="w-[340px] rounded-xl border border-white/10 bg-slate-950/90 p-2 shadow-2xl shadow-black/50 backdrop-blur-2xl">
                      <div className="grid grid-cols-1">
                        {item.children.map((child) => (
                          <div
                            key={child.href + child.label}
                            className="group/item cursor-pointer rounded-md p-3 transition-colors duration-150 hover:bg-yellow-500/10"
                          >
                            {child.external ? (
                              <a
                                href={child.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col gap-0.5 text-slate-200"
                              >
                                <span className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors group-hover/item:text-crimson-300">
                                  {child.label}
                                  <ExternalLink className="h-3 w-3 text-amber-300 transition-transform duration-200 group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5" />
                                </span>
                                {child.description && (
                                  <span className="text-xs font-normal text-slate-400 transition-colors group-hover/item:text-slate-300">
                                    {child.description}
                                  </span>
                                )}
                              </a>
                            ) : (
                              <Link
                                href={child.href}
                                className="flex flex-col gap-0.5 text-slate-200"
                              >
                                <span className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors group-hover/item:text-crimson-300">
                                  {child.label}
                                  <ArrowRight className="h-3 w-3 -translate-x-1 text-crimson-400 opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                                </span>
                                {child.description && (
                                  <span className="block text-xs font-normal text-slate-400 transition-colors group-hover/item:text-slate-300">
                                    {child.description}
                                  </span>
                                )}
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
                      "group relative inline-flex h-10 items-center rounded-md px-3 text-sm font-medium text-slate-300 transition-colors duration-200 hover:text-crimson-300",
                      pathname.startsWith(item.href) && "text-crimson-300",
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute inset-x-3 -bottom-px h-0.5 origin-left rounded-full bg-crimson-400 transition-transform duration-300 ease-out",
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
              className="border-white/15 text-slate-200 hover:border-amber-400/70 hover:bg-yellow-300 hover:text-slate-900"
              asChild
            >
              <Link href="/login">
                <UserRound className="mr-1 h-4 w-4" /> Student Portal
              </Link>
            </Button>
            <Button
              size="sm"
className="bg-crimson-700 text-white shadow-md shadow-black/30 hover:bg-yellow-400 hover:text-slate-900"
              asChild
            >
              <Link href="/register">
                <GraduationCap className="mr-1 h-4 w-4" /> Apply Now
              </Link>
            </Button>
          </div>

          {/* Mobile menu */}
          <div className="flex items-center gap-2 lg:hidden">
            <Button variant="outline" size="icon" className="border-white/15 text-slate-200" asChild aria-label="Student portal">
              <Link href="/login">
                <UserRound className="h-4 w-4" />
              </Link>
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-300 hover:bg-white/[0.06]" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto border-white/10 bg-slate-950/90 backdrop-blur-2xl">
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <div className="mt-4 flex flex-col gap-1">
                  {siteConfig.nav.map((item) => (
                    <div key={item.label} className="flex flex-col">
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "rounded-md px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/[0.06] hover:text-crimson-300",
                          pathname.startsWith(item.href) && "text-crimson-300",
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
                              className="flex flex-col gap-0.5 rounded-md px-3 py-2 text-slate-400 hover:bg-white/[0.06] hover:text-crimson-300"
                            >
                              <span className="inline-flex items-center gap-1.5 text-sm">
                                {child.label}
                                {child.external && <ExternalLink className="h-3 w-3 text-amber-300" />}
                              </span>
                              {child.description && (
                                <span className="text-xs text-slate-500">{child.description}</span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
                    <Button className="bg-crimson-700 text-white shadow-md shadow-black/30 hover:bg-yellow-400 hover:text-slate-900" asChild>
                      <Link href="/register" onClick={() => setOpen(false)}>
                        <GraduationCap className="mr-1 h-4 w-4" /> Apply Now
                      </Link>
                    </Button>
                    <Button variant="outline" className="border-white/15 text-slate-200 hover:bg-white/[0.06]" asChild>
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
