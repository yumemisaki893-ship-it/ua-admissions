import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { Seal } from "@/components/shared/seal";

export function Logo({
  className,
  light = false,
  iconOnly = false,
  compact = false,
}: {
  className?: string;
  light?: boolean;
  iconOnly?: boolean;
  compact?: boolean;
}) {
  return (
    <Link href="/" className={cn("group flex items-center gap-3", className)} aria-label="University of Antique - Home">
      <Seal size={compact ? 40 : 46} className="transition-transform duration-300 group-hover:rotate-6" />
      {!iconOnly && (
        <span className="flex flex-col leading-tight">
          <span
            className={cn(
              "font-display font-semibold tracking-tight transition-colors duration-300 group-hover:text-crimson-700",
              light ? "text-white group-hover:text-yellow-200" : "text-slate-900",
              compact ? "text-sm" : "text-base",
            )}
          >
            University of Antique
          </span>
          <span
            className={cn(
              "text-[10px] font-semibold uppercase tracking-[0.22em]",
              light ? "text-yellow-100" : "text-crimson-700",
            )}
          >
            {siteConfig.tagline}
          </span>
        </span>
      )}
    </Link>
  );
}
