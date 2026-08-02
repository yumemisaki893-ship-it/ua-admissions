import Image from "next/image";
import { cn } from "@/lib/utils";

export function Seal({
  size = 96,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* Rotating dashed gold ring */}
      <span className="absolute -inset-2.5 animate-spin-slow rounded-full border-2 border-dashed border-amber-400/80" />
      {/* Gold gradient band */}
      <span className="absolute -inset-1 rounded-full bg-gradient-to-br from-yellow-200 via-amber-400 to-yellow-600 p-[3px] shadow-lg shadow-amber-500/30">
        <span className="block h-full w-full rounded-full bg-gradient-to-br from-crimson-700 via-crimson-800 to-crimson-950" />
      </span>
      {/* Seal image */}
      <span className="absolute inset-[3px] overflow-hidden rounded-full bg-white shadow-inner ring-1 ring-crimson-900/10">
        <Image
          src="/ua/ua-seal.png"
          alt="University of Antique seal"
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      </span>
      {/* Glass highlight */}
      <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-transparent" />
    </span>
  );
}
