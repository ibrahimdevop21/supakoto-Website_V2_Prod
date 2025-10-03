import * as React from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

// No-op function for TikTok tracking while disabled
function trackTikTok(_event: string, _props: Record<string, unknown> = {}) {
  // Intentionally a no-op while TikTok is disabled.
  // TODO: Re-enable later with guarded calls (if (window.ttq?.track) window.ttq.track(...))
}

// Types
export interface GalleryItem {
  id: string;
  src: string;
  thumbSrc: string;
  alt: string;
  blurDataURL?: string;
}

export interface GalleryProps {
  items: GalleryItem[];
  initialIndex?: number;
  className?: string;
}

// Helper: IntersectionObserver hook for virtualization
const useInView = (options?: IntersectionObserverInit) => {
  const [isInView, setIsInView] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const target = targetRef.current;
    if (!target) return;

    // Fallback for environments without IntersectionObserver
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    observer.observe(target);
    return () => observer.disconnect();
  }, [options, isClient]);

  return { targetRef, isInView: isClient ? isInView : true };
};

// Helper: Prefetch image with requestIdleCallback
const prefetchImage = (src: string) => {
  if (typeof window === 'undefined') return;
  
  const prefetch = () => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = src;
    document.head.appendChild(link);
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(prefetch, { timeout: 2000 });
  } else {
    setTimeout(prefetch, 100);
  }
};

// Thumbnail component with virtualization
const Thumb: React.FC<{
  item: GalleryItem;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}> = ({ item, isSelected, onClick, index }) => {
  const { targetRef, isInView } = useInView({
    threshold: 0.1,
    rootMargin: '200px'
  });
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div ref={targetRef} className="shrink-0">
      {isInView ? (
        <button
          type="button"
          onClick={onClick}
          role="option"
          aria-selected={isSelected}
          aria-label={`View image ${index + 1}: ${item.alt}`}
          className={cn(
            "h-20 w-20 rounded-xl border overflow-hidden transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 relative",
            isSelected 
              ? "border-white/70 ring-2 ring-white/40 scale-105" 
              : "border-white/20 hover:border-white/40 hover:scale-102"
          )}
        >
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-neutral-800 animate-pulse flex items-center justify-center">
              <div className="w-4 h-4 border border-neutral-600 border-t-white rounded-full animate-spin" />
            </div>
          )}
          {imageError ? (
            <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-500 text-xs">
              Error
            </div>
          ) : (
            <img
              src={item.thumbSrc}
              alt=""
              loading="lazy"
              decoding="async"
              width={80}
              height={80}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-300",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}
        </button>
      ) : (
        // Skeleton placeholder
        <div className="h-20 w-20 rounded-xl bg-neutral-800 animate-pulse" />
      )}
    </div>
  );
};

// Main Gallery component
export default function Gallery({ 
  items, 
  initialIndex = 0, 
  className 
}: GalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(() => 
    Math.max(0, Math.min(initialIndex, items.length - 1))
  );
  const [isMobile, setIsMobile] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const idleCallbackRef = useRef<number | null>(null);

  const currentItem = items[currentIndex];

  // Mobile detection
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);

  // Navigation functions
  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      // Fire tracking as NO-OP for now (kept for future parity)
      trackTikTok('ClickButton', { button: 'Gallery Previous' });
    }
  }, [currentIndex]);

  const goToNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      // Fire tracking as NO-OP for now (kept for future parity)
      trackTikTok('ClickButton', { button: 'Gallery Next' });
    }
  }, [currentIndex, items.length]);

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < items.length) {
      setCurrentIndex(index);
      // Fire tracking as NO-OP for now (kept for future parity)
      trackTikTok('ClickButton', { button: 'Gallery Thumbnail' });
    }
  }, [items.length]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNext();
    }
  }, [goToPrev, goToNext]);

  // Touch handlers for swipe (mobile only)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, [isMobile]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    
    // Only handle horizontal swipes that are significant and more horizontal than vertical
    if (Math.abs(dx) > 50 && Math.abs(dx) > 1.5 * Math.abs(dy)) {
      e.preventDefault();
      if (dx > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    }
  }, [isMobile, goToPrev, goToNext]);

  // Prefetch neighbor images
  useEffect(() => {
    if (idleCallbackRef.current) {
      cancelIdleCallback(idleCallbackRef.current);
    }

    idleCallbackRef.current = requestIdleCallback(() => {
      // Prefetch previous and next 2 images
      for (let i = -2; i <= 2; i++) {
        const index = currentIndex + i;
        if (index >= 0 && index < items.length && index !== currentIndex) {
          prefetchImage(items[index].src);
        }
      }
    }, { timeout: 2000 });

    return () => {
      if (idleCallbackRef.current) {
        cancelIdleCallback(idleCallbackRef.current);
      }
    };
  }, [currentIndex, items]);

  // Calculate visible thumbnails (virtualization: current ±20)
  const visibleStart = Math.max(0, currentIndex - 20);
  const visibleEnd = Math.min(items.length, currentIndex + 21);
  const visibleThumbs = items.slice(visibleStart, visibleEnd);

  if (!items.length) return null;

  return (
    <div 
      className={cn("w-full space-y-6", className)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Image gallery"
    >
      {/* Stage (main image) */}
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-900 border border-white/10">
        <div
          ref={mainRef}
          className="relative w-full h-full"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'pan-y' }}
        >
          {/* Blur placeholder if available */}
          {currentItem.blurDataURL && (
            <div 
              className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110 z-0"
              style={{ backgroundImage: `url(${currentItem.blurDataURL})` }}
            />
          )}
          
          {/* Main image */}
          <img
            src={currentItem.src}
            alt={currentItem.alt}
            loading={currentIndex === 0 ? "eager" : "lazy"}
            decoding="async"
            {...(currentIndex === 0 && { fetchpriority: "high" } as any)}
            className="relative z-10 w-full h-full object-cover transition-opacity duration-300"
            onError={(e) => {
              console.error('Failed to load image:', currentItem.src);
              // Show error state
              e.currentTarget.style.display = 'none';
              const errorDiv = document.createElement('div');
              errorDiv.className = 'absolute inset-0 bg-neutral-800 flex items-center justify-center text-neutral-400 z-20';
              errorDiv.innerHTML = '<span>Failed to load image</span>';
              e.currentTarget.parentElement?.appendChild(errorDiv);
            }}
          />

          {/* Navigation arrows */}
          <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
            <button
              type="button"
              onClick={goToPrev}
              disabled={currentIndex === 0}
              aria-label="Previous image"
              className="pointer-events-auto h-12 w-12 bg-black/50 hover:bg-black/70 text-white rounded-xl border border-white/20 hover:border-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              type="button"
              onClick={goToNext}
              disabled={currentIndex === items.length - 1}
              aria-label="Next image"
              className="pointer-events-auto h-12 w-12 bg-black/50 hover:bg-black/70 text-white rounded-xl border border-white/20 hover:border-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Image counter */}
          <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 text-white text-sm rounded-lg border border-white/20">
            {currentIndex + 1} / {items.length}
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="relative">
        <div 
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-neutral-800 scrollbar-thumb-neutral-600"
          role="listbox"
          aria-label="Gallery thumbnails"
        >
          {/* Spacer for items before visible range */}
          {visibleStart > 0 && (
            <div style={{ width: `${visibleStart * 92}px` }} className="shrink-0" />
          )}
          
          {/* Visible thumbnails */}
          {visibleThumbs.map((item, i) => {
            const actualIndex = visibleStart + i;
            return (
              <Thumb
                key={item.id}
                item={item}
                isSelected={actualIndex === currentIndex}
                onClick={() => goToIndex(actualIndex)}
                index={actualIndex}
              />
            );
          })}
          
          {/* Spacer for items after visible range */}
          {visibleEnd < items.length && (
            <div style={{ width: `${(items.length - visibleEnd) * 92}px` }} className="shrink-0" />
          )}
        </div>
      </div>
    </div>
  );
}
