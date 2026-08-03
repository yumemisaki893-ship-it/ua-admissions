"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface Slide {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string | null;
  category: string;
  publishedAt: Date | null;
  href: string;
  gradient: string;
  poster?: boolean;
}

const AUTOPLAY_MS = 6000;

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const apiRef = useRef<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [paused, setPaused] = useState(false);

  const fallbackGradients = [
    "from-crimson-700 via-crimson-800 to-crimson-950",
    "from-crimson-800 via-crimson-950 to-crimson-900",
    "from-crimson-900 via-crimson-800 to-crimson-950",
  ];

  useEffect(() => {
    const api = apiRef.current;
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, []);

  useEffect(() => {
    if (paused || count < 2) return;
    const id = setInterval(() => apiRef.current?.scrollNext(), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, count, current]);

  return (
    <section
      className="relative bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Carousel
        opts={{ loop: true, align: "start" }}
        className="relative"
        setApi={(api) => {
          apiRef.current = api;
        }}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id}>
              <div className="relative flex h-[100svh] min-h-[560px] items-center overflow-hidden">
                {slide.imageUrl ? (
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient ?? fallbackGradients[index % fallbackGradients.length]}`} />
                )}
                {!slide.imageUrl && (
                  <div className="absolute inset-0 bg-gradient-to-r from-crimson-950/95 via-crimson-950/70 to-crimson-950/30" />
                )}
                {slide.imageUrl && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/50 to-transparent" />
                )}

                {/* Glass content panel */}
                <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                  <div className="max-w-2xl">
                    <div className="animate-scale-in rounded-2xl border border-white/15 bg-white/10 p-6 shadow-2xl shadow-crimson-950/40 backdrop-blur-md sm:p-8">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge className="bg-yellow-300 text-crimson-900 shadow-md shadow-yellow-500/30">
                          {slide.category}
                        </Badge>
                        {slide.publishedAt && (
                          <span className="flex items-center gap-1.5 text-sm text-yellow-100">
                            <CalendarDays className="h-4 w-4" />
                            {formatDate(slide.publishedAt)}
                          </span>
                        )}
                      </div>
                      <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                        {slide.title}
                      </h1>
                      <p className="mt-3 max-w-xl text-base text-red-50 sm:text-lg">{slide.excerpt}</p>
                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Link
                          href={slide.href}
                          className="inline-flex h-11 items-center gap-2 rounded-lg bg-yellow-300 px-6 text-sm font-semibold text-crimson-900 shadow-lg shadow-yellow-500/30 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-xl"
                        >
                          Read more
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slide counter */}
                {count > 1 && (
                  <span className="absolute bottom-6 left-4 font-mono text-xs tracking-widest text-white/60 sm:left-8">
                    {String(current + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                  </span>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {slides.length > 1 && (
          <div className="absolute bottom-5 right-5 z-10 flex gap-2 sm:right-8">
            <button
              type="button"
              onClick={() => apiRef.current?.scrollPrev()}
              aria-label="Previous slide"
              className="rounded-xl border border-white/20 bg-white/10 p-2.5 text-white shadow-lg backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-yellow-300 hover:text-crimson-900"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => apiRef.current?.scrollNext()}
              aria-label="Next slide"
              className="rounded-xl border border-white/20 bg-white/10 p-2.5 text-white shadow-lg backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-yellow-300 hover:text-crimson-900"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </Carousel>

      {/* Progress dots */}
      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => apiRef.current?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="group relative h-1.5 overflow-hidden rounded-full bg-white/25 transition-all duration-300"
              style={{ width: current === i ? 36 : 12 }}
            >
              {current === i && (
                <span
                  key={current}
                  className="absolute inset-y-0 left-0 rounded-full bg-yellow-300"
                  style={{ animation: `hero-progress ${AUTOPLAY_MS}ms linear forwards` }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
