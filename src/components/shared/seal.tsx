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
      {/* Seal image */}
      <span className="absolute inset-0 overflow-hidden rounded-full bg-white shadow-sm">
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
