import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)} aria-label="University of Antique - Home">
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-sky-700 text-white shadow-md",
        )}
      >
        <span className="font-display text-sm font-bold leading-none">UA</span>
      </span>
      <span className="flex flex-col leading-tight">
        <span className={cn("font-display text-base font-semibold tracking-tight", light ? "text-white" : "text-navy-900")}>
          University of Antique
        </span>
        <span className={cn("text-[11px] uppercase tracking-widest", light ? "text-sky-200" : "text-sky-600")}>
          Building the Future of Antique
        </span>
      </span>
    </Link>
  );
}
