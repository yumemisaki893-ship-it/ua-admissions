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
      <Image
        src="/ua/ua-seal.png"
        alt="University of Antique seal"
        width={size}
        height={size}
        className="h-full w-full object-contain drop-shadow-md"
      />
    </span>
  );
}
