"use client";

import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];

interface CarouselProps {
  opts?: CarouselOptions;
  plugins?: UseCarouselParameters[1];
  setApi?: (api: CarouselApi) => void;
  className?: string;
  children: React.ReactNode;
}

const CarouselContext = React.createContext<{
  api: CarouselApi | null;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}>({ api: null, canScrollPrev: false, canScrollNext: false });

function useCarousel() {
  return React.useContext(CarouselContext);
}

const Carousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(
  ({ opts, setApi, className, children, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(opts ?? { loop: true }, []);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    React.useEffect(() => {
      if (!api || !setApi) return;
      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) return;
      const onSelect = () => {
        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());
      };
      onSelect();
      api.on("reInit", onSelect);
      api.on("select", onSelect);
      return () => {
        api.off("select", onSelect);
        api.off("reInit", onSelect);
      };
    }, [api]);

    return (
      <CarouselContext.Provider value={{ api, canScrollPrev, canScrollNext }}>
        <div ref={ref} className={cn("relative", className)} {...props}>
          <div ref={carouselRef} className="overflow-hidden">
            {children}
          </div>
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex", className)} {...props} />
  ),
);
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="group" aria-roledescription="slide" className={cn("min-w-0 shrink-0 grow-0 basis-full", className)} {...props} />
  ),
);
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { api } = useCarousel();
    return (
      <Button
        ref={ref}
        variant="outline"
        size="icon"
        className={cn("h-8 w-8 rounded-full bg-white/90 border-white shadow", className)}
        onClick={() => api?.scrollPrev()}
        {...props}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
    );
  },
);
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { api } = useCarousel();
    return (
      <Button
        ref={ref}
        variant="outline"
        size="icon"
        className={cn("h-8 w-8 rounded-full bg-white/90 border-white shadow", className)}
        onClick={() => api?.scrollNext()}
        {...props}
      >
        <ArrowRight className="h-4 w-4" />
        <span className="sr-only">Next slide</span>
      </Button>
    );
  },
);
CarouselNext.displayName = "CarouselNext";

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
export type { CarouselApi };
