"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export function CardCarousel({
  children,
  itemsPerView = "lg",
  autoplay = true,
  className,
}: {
  children: React.ReactNode;
  itemsPerView?: "md" | "lg";
  autoplay?: boolean;
  className?: string;
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  const countItems = React.Children.count(children);

  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
      setCount(api.scrollSnapList().length);
    });
  }, [api]);

  React.useEffect(() => {
    if (!autoplay || paused || count < 2) return;
    const id = setInterval(() => {
      api?.scrollNext();
    }, 5000);
    return () => clearInterval(id);
  }, [api, autoplay, paused, count]);

  if (countItems <= 1) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={cn("group/carousel", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true }}
        className="w-full"
      >
        <CarouselContent className="-ml-3 sm:-ml-4">
          {React.Children.map(children, (child, i) => (
            <CarouselItem
              key={i}
              className={cn(
                "pl-3 sm:pl-4",
                itemsPerView === "lg"
                  ? "basis-full sm:basis-1/2 lg:basis-1/3"
                  : "basis-full md:basis-1/2 xl:basis-1/3",
              )}
            >
              {child}
            </CarouselItem>
          ))}
        </CarouselContent>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => api?.scrollPrev()}
              aria-label="Previous slide"
              className="absolute -left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition-all hover:scale-105 hover:border-amber-300 hover:bg-yellow-300 hover:text-crimson-900 lg:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => api?.scrollNext()}
              aria-label="Next slide"
              className="absolute -right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition-all hover:scale-105 hover:border-amber-300 hover:bg-yellow-300 hover:text-crimson-900 lg:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </Carousel>

      {count > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => api?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                current === i
                  ? "w-7 bg-crimson-700"
                  : "w-2 bg-slate-300 hover:bg-amber-300",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
