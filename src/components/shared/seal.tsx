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
      <span
        className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-crimson-800 to-crimson-950 p-[2px] shadow-lg shadow-crimson-950/40"
        aria-hidden
      >
        <span className="block h-full w-full rounded-full bg-crimson-900" />
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
