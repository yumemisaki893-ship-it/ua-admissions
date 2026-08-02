import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

export function Logo({
  className,
  light = false,
  iconOnly = false,
}: {
  className?: string;
  light?: boolean;
  iconOnly?: boolean;
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)} aria-label="University of Antique - Home">
      <span
        className={cn(
          "relative inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2",
          light ? "ring-gold-300/70" : "ring-crimson-800/60",
        )}
      >
        <Image
          src="/ua/ua-logo.png"
          alt="University of Antique seal"
          width={44}
          height={44}
          priority
          className="h-full w-full object-cover"
        />
      </span>
      {!iconOnly && (
        <span className="flex flex-col leading-tight">
          <span
            className={cn(
              "text-[11px] font-semibold uppercase tracking-[0.18em]",
              light ? "text-gold-300" : "text-gold-600",
            )}
          >
            Republic of the Philippines
          </span>
          <span
            className={cn(
              "font-display text-base font-semibold tracking-tight",
              light ? "text-white" : "text-navy-900",
            )}
          >
            University of Antique
          </span>
          <span
            className={cn("text-[10px] uppercase tracking-[0.22em]", light ? "text-navy-200" : "text-muted-foreground")}
          >
            {siteConfig.tagline}
          </span>
        </span>
      )}
    </Link>
  );
}