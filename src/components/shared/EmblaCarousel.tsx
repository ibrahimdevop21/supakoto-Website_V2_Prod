import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaOptionsType } from 'embla-carousel';

interface EmblaCarouselProps {
  options?: EmblaOptionsType;
  children: React.ReactNode;
  showNavButtons?: boolean;
  showDots?: boolean;
  className?: string;
  isRTL?: boolean;
}

const EmblaCarousel: React.FC<EmblaCarouselProps> = ({
  options = {},
  children,
  showNavButtons = true,
  showDots = true,
  className = '',
  isRTL = false
}) => {
  // Merge default options with provided options
  const carouselOptions: EmblaOptionsType = {
    loop: false,
    align: 'start',
    skipSnaps: false,
    direction: isRTL ? 'rtl' : 'ltr',
    ...options
  };

  // Embla carousel setup
  const [viewportRef, embla] = useEmblaCarousel(carouselOptions);
  
  // Navigation state
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Navigation callbacks
  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);
  const scrollTo = useCallback((index: number) => embla && embla.scrollTo(index), [embla]);

  // Update navigation button states
  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());
  }, [embla]);

  // Initialize
  useEffect(() => {
    if (!embla) return;
    
    setScrollSnaps(embla.scrollSnapList());
    embla.on('select', onSelect);
    onSelect();
    
    return () => {
      embla.off('select', onSelect);
    };
  }, [embla, onSelect]);

  return (
    <div className={`embla relative ${className}`}>
      <div className="embla__viewport overflow-hidden" ref={viewportRef}>
        <div className="embla__container flex">
          {children}
        </div>
      </div>
      
      {showNavButtons && (
        <div className="embla__buttons absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4 z-10">
          <button
            className={`embla__button embla__button--prev p-2 rounded-full bg-background/80 backdrop-blur-sm shadow-md ${
              !prevBtnEnabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-background'
            }`}
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
          >
            <svg className={`w-6 h-6 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            className={`embla__button embla__button--next p-2 rounded-full bg-background/80 backdrop-blur-sm shadow-md ${
              !nextBtnEnabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-background'
            }`}
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
          >
            <svg className={`w-6 h-6 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
      
      {showDots && scrollSnaps.length > 0 && (
        <div className="embla__dots flex justify-center gap-2 mt-4">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`embla__dot w-2 h-2 rounded-full transition-all ${
                index === selectedIndex 
                  ? 'bg-primary w-6' 
                  : 'bg-primary/30 hover:bg-primary/50'
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EmblaCarousel;
