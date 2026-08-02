"use client";

import { useEffect, useRef, useState } from "react";

function useInView<T extends HTMLElement>(threshold = 0.4) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(node);
          }
        });
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export function AnimatedCounter({
  value,
  duration = 1600,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;

    const hasComma = value.includes(",");
    const target = parseInt(value.replace(/[^\d]/g, ""), 10);
    const start = performance.now();

    let frame: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setDisplay(hasComma ? current.toLocaleString("en-US") : String(current));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
