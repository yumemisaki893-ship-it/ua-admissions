"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { useRef } from "react";

interface Slide {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string | null;
  category: string;
  publishedAt: Date | null;
  href: string;
  gradient: string;
}

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const apiRef = useRef<CarouselApi | null>(null);

  const fallbackGradients = [
    "from-crimson-700 via-crimson-800 to-crimson-950",
    "from-crimson-800 via-crimson-950 to-crimson-900",
    "from-crimson-900 via-crimson-800 to-crimson-950",
  ];

  return (
    <section className="relative bg-white">
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
              <div className="relative flex min-h-[420px] items-center overflow-hidden sm:min-h-[520px]">
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
                <div className="absolute inset-0 bg-gradient-to-r from-crimson-950/95 via-crimson-950/75 to-crimson-950/25" />
                <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                  <div className="max-w-2xl space-y-5">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-yellow-300 text-crimson-900">{slide.category}</Badge>
                      {slide.publishedAt && (
                        <span className="flex items-center gap-1.5 text-sm text-yellow-100">
                          <CalendarDays className="h-4 w-4" />
                          {formatDate(slide.publishedAt)}
                        </span>
                      )}
                    </div>
                    <h1 className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                      {slide.title}
                    </h1>
                    <p className="max-w-xl text-base text-red-50 sm:text-lg">{slide.excerpt}</p>
                    <Link
                      href={slide.href}
                      className="inline-flex h-11 items-center rounded-md bg-yellow-300 px-6 text-sm font-semibold text-crimson-900 shadow-lg transition-colors hover:bg-white"
                    >
                      Read more
                    </Link>
                  </div>
                </div>
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
              className="rounded-full bg-white/15 p-2 text-white backdrop-blur transition-colors hover:bg-white/30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => apiRef.current?.scrollNext()}
              aria-label="Next slide"
              className="rounded-full bg-white/15 p-2 text-white backdrop-blur transition-colors hover:bg-white/30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </Carousel>
    </section>
  );
}
