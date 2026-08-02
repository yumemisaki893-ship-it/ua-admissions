import Image from "next/image";
import { cn } from "@/lib/utils";

export function Seal({
  size,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        size ? undefined : "h-24 w-24",
        className,
      )}
      style={size ? { width: size, height: size } : undefined}
      aria-hidden
    >
      <Image
        src="/ua/ua-seal.png"
        alt="University of Antique seal"
        width={size ?? 96}
        height={size ?? 96}
        className="h-full w-full object-contain drop-shadow-md"
      />
    </span>
  );
}
