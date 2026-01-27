"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CatalogSlide } from "@/types/Catalog";
import { Button } from "@/components/ui/button";

interface CatalogSliderProps {
  slides: CatalogSlide[];
}

export const CatalogSlider = ({ slides }: CatalogSliderProps) => {
  if (!slides || slides.length === 0) return null;

  return (
    <div className="mb-12">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative aspect-[16/6] rounded-lg overflow-hidden">
                {slide.image ? (
                  <img
                    src={slide.image}
                    alt={slide.title || "Slide"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                )}

                {/* Overlay content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white ">{/* bg-black/20 */}
                  {slide.title && (
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                      {slide.title}
                    </h2>
                  )}
                  {slide.description && (
                    <p className="text-lg md:text-xl mb-6 max-w-2xl text-center px-4">
                      {slide.description}
                    </p>
                  )}
                  {slide.link_url && (
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() =>
                        window.open(slide.link_url || "", "_blank")
                      }
                    >
                      Shop Now
                    </Button>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {slides.length > 1 && (
          <>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </>
        )}
      </Carousel>

      {/* Dots indicator */}
      {slides.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="w-2 h-2 rounded-full bg-muted-foreground/30"
            />
          ))}
        </div>
      )}
    </div>
  );
};
