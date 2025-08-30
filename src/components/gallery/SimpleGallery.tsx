import * as React from "react";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Intersection Observer hook for lazy loading with production safety
const useIntersectionObserver = (options?: IntersectionObserverInit) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  // Ensure we're on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const target = targetRef.current;
    if (!target) return;

    // Fallback for environments without IntersectionObserver
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(target);
    return () => observer.disconnect();
  }, [options, isClient]);

  return { targetRef, isIntersecting: isClient ? isIntersecting : true };
};

// Optimized image component with lazy loading and error handling
const OptimizedImage = ({ 
  src, 
  alt, 
  className, 
  loading = "lazy",
  onLoad,
  onError,
  width,
  height,
  ...props 
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  width?: number;
  height?: number;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  if (imageError) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-neutral-800 text-neutral-400",
        className
      )}>
        <span className="text-sm">Failed to load</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Loading state overlay */}
      {!imageLoaded && isClient && (
        <div className="absolute inset-0 bg-neutral-800 animate-pulse motion-reduce:animate-none flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-neutral-600 border-t-white rounded-full animate-spin motion-reduce:animate-none" />
        </div>
      )}
      
      {/* Always render the image so it can load */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={loading === "eager" ? "high" : undefined}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300 motion-reduce:transition-none",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
        {...props}
      />
    </div>
  );
};

// Inline SVG icons to avoid new dependencies
const ChevronLeft = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ExpandIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export type SimpleGalleryImage = {
  src: string;
  alt?: string;
  caption?: string;
  srcSet?: string[];
};

export type SimpleGalleryProps = {
  locale?: "en" | "ar";
  images: SimpleGalleryImage[];
  initialIndex?: number;
  heightClass?: string;
  showCounter?: boolean;
  showCaptions?: boolean;
  className?: string;
  thumbSizeClass?: string;
  itemsPerPage?: number;
};

export default function SimpleGallery({
  locale = "en",
  images,
  initialIndex = 0,
  heightClass = "aspect-video",
  showCounter = true,
  showCaptions = true,
  className,
  thumbSizeClass = "h-16 w-24 md:h-20 md:w-28",
  itemsPerPage = 24, // Optimized for better grid layout
}: SimpleGalleryProps) {
  const isRTL = locale === "ar";
  const isIOS = typeof navigator !== 'undefined' && /iP(hone|ad|od)/.test(navigator.userAgent);
  const [index, setIndex] = useState(() => clamp(initialIndex, 0, Math.max(0, images.length - 1)));
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbs, setShowThumbs] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set<number>());
  const [preloadedPages, setPreloadedPages] = useState(new Set([0])); // Preload first page
  const mainRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const current = images[index];
  
  // Mobile detection hook
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    window.addEventListener('resize', apply);
    return () => {
      mq.removeEventListener?.('change', apply);
      window.removeEventListener('resize', apply);
    };
  }, []);
  
  // Intersection observer for thumbnail container
  const { targetRef: thumbnailRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });
  
  // Calculate pagination with performance optimizations
  const totalPages = Math.ceil(images.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, images.length);
  const visibleThumbs = images.slice(startIndex, endIndex);
  
  // Preload adjacent pages for smoother navigation
  const preloadPages = useMemo(() => {
    const pages = new Set([currentPage]);
    if (currentPage > 0) pages.add(currentPage - 1);
    if (currentPage < totalPages - 1) pages.add(currentPage + 1);
    return pages;
  }, [currentPage, totalPages]);

  const t = useMemo(
    () => ({
      prev: isRTL ? "السابق" : "Previous",
      next: isRTL ? "التالي" : "Next",
      of: isRTL ? "من" : "of",
      image: isRTL ? "الصورة" : "Image",
      showMore: isRTL ? "عرض المزيد" : "Load More",
      showLess: isRTL ? "عرض أقل" : "Show Less",
      fullscreen: isRTL ? "ملء الشاشة" : "Fullscreen",
      close: isRTL ? "إغلاق" : "Close",
    }),
    [isRTL]
  );

  const prev = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : i)); // no loop
  }, []);
  
  const next = useCallback(() => {
    setIndex((i) => (i < images.length - 1 ? i + 1 : i)); // no loop
  }, [images.length]);
  
  const toggleFullscreen = useCallback(() => {
    if (isMobile) return; // disable on phones
    setIsFullscreen((v) => !v);
  }, [isMobile]);

  // Touch handlers for swipe gestures
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    // Allow vertical scrolling by default
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    
    // Only handle horizontal swipes that are significant and more horizontal than vertical
    if (Math.abs(dx) > 48 && Math.abs(dx) > 1.5 * Math.abs(dy)) {
      e.preventDefault();
      if (dx > 0) {
        // Swipe right
        isRTL ? next() : prev();
      } else {
        // Swipe left
        isRTL ? prev() : next();
      }
    }
  }, [isRTL, next, prev]);

  // Guard React touch handlers for non-iOS devices
  const touchHandlers = !isIOS ? {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  } : {};

  useEffect(() => {
    // Update current page when index changes
    const newPage = Math.floor(index / itemsPerPage);
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  }, [index, itemsPerPage, currentPage]);
  
  // iOS-specific native touch event handlers
  useEffect(() => {
    if (!isIOS) return;
    const el = mainRef.current;
    if (!el) return;

    let startX = 0, startY = 0, dragging = false;

    const ts = (e: TouchEvent) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      dragging = true;
    };

    const tm = (e: TouchEvent) => {
      if (!dragging) return;
      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      // Only block vertical scroll if it's clearly a horizontal swipe
      if (Math.abs(dx) > 16 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        e.preventDefault(); // requires passive:false
      }
    };

    const te = (e: TouchEvent) => {
      if (!dragging) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const threshold = 48;
      if (Math.abs(dx) > threshold) {
        if (dx > 0) { isRTL ? next() : prev(); }
        else { isRTL ? prev() : next(); }
      }
      dragging = false;
    };

    el.addEventListener('touchstart', ts, { passive: true });
    el.addEventListener('touchmove', tm, { passive: false }); // critical on iOS
    el.addEventListener('touchend', te, { passive: true });

    return () => {
      el.removeEventListener('touchstart', ts as any);
      el.removeEventListener('touchmove', tm as any);
      el.removeEventListener('touchend', te as any);
    };
  }, [isIOS, isRTL, next, prev]);

  // Preload images for current and adjacent pages
  useEffect(() => {
    if (!isIntersecting) return;
    
    preloadPages.forEach(pageNum => {
      if (preloadedPages.has(pageNum)) return;
      
      const pageStart = pageNum * itemsPerPage;
      const pageEnd = Math.min(pageStart + itemsPerPage, images.length);
      
      // Preload images for this page
      for (let i = pageStart; i < pageEnd; i++) {
        const img = new Image();
        img.src = images[i].src;
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, i]));
        };
      }
      
      setPreloadedPages(prev => new Set([...prev, pageNum]));
    });
  }, [preloadPages, preloadedPages, itemsPerPage, images, isIntersecting]);
  
  // Preload main image and adjacent images
  useEffect(() => {
    const preloadMainImages = () => {
      // Preload current image
      if (!loadedImages.has(index)) {
        const img = new Image();
        img.src = current.src;
        img.onload = () => setLoadedImages(prev => new Set([...prev, index]));
      }
      
      // Preload next and previous images for smoother navigation
      [index - 1, index + 1].forEach(i => {
        if (i >= 0 && i < images.length && !loadedImages.has(i)) {
          const img = new Image();
          img.src = images[i].src;
          img.onload = () => setLoadedImages(prev => new Set([...prev, i]));
        }
      });
    };
    
    const timer = setTimeout(preloadMainImages, 100);
    return () => clearTimeout(timer);
  }, [index, current.src, images, loadedImages]);
  
  useEffect(() => {
    // keep active thumb visible
    const strip = stripRef.current;
    if (!strip) return;
    const active = strip.querySelector<HTMLElement>(`[data-idx="${index}"]`);
    active?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index, currentPage]);

  
  const loadMore = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);
  
  const showLess = useCallback(() => {
    setCurrentPage(0);
  }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") (isRTL ? next : prev)();
    if (e.key === "ArrowRight") (isRTL ? prev : next)();
    if (e.key === "Home") setIndex(0);
    if (e.key === "End") setIndex(images.length - 1);
    if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
  }, [isRTL, next, prev, images.length, isFullscreen]);

  if (!images?.length) return null;

  return (
    <>
    <section
      className={cn("py-8 md:py-12 pb-[max(1rem,env(safe-area-inset-bottom))]", className)}
      dir={isRTL ? "rtl" : "ltr"}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label={isRTL ? "معرض الصور" : "Image gallery"}
    >
      {/* Big image */}
      <div className="rounded-2xl bg-muted/20 border border-white/10 shadow-soft p-2">
<div
          ref={mainRef}
          className={cn(
            "relative overflow-hidden rounded-2xl bg-neutral-900 border border-white/10",
            heightClass,
            "touch-pan-y select-none sm:cursor-zoom-in"
          )}
          onClick={toggleFullscreen}
          style={{ touchAction: "pan-y" }}
          {...touchHandlers}
        >
          <div className="absolute inset-0">
            <OptimizedImage
              src={current.src}
              alt={current.alt || ""}
              className="h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </div>

          {/* Overlay controls */}
          <div className="pointer-events-none absolute inset-0">
            {/* Desktop overlay: centered arrows */}
            <div className="hidden sm:flex items-center justify-between p-2 pointer-events-auto h-full">
              <Button type="button" variant="outline" size="icon" onClick={isRTL ? next : prev} aria-label={t.prev}
                className="h-10 w-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
                <ChevronLeft className={cn("h-5 w-5", isRTL && "rotate-180")} />
              </Button>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm"
                  onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                  aria-label={t.fullscreen}
                  className="h-9 px-3 text-xs hidden sm:inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
                  {t.fullscreen}
                </Button>
                <Button type="button" variant="outline" size="icon" onClick={isRTL ? prev : next} aria-label={t.next}
                  className="h-10 w-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
                  <ChevronRight className={cn("h-5 w-5", isRTL && "rotate-180")} />
                </Button>
              </div>
            </div>

            {/* Mobile overlay: bottom bar with arrows + counter */}
            <div className="sm:hidden absolute inset-x-0 bottom-0 pointer-events-auto">
              <div className="bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-10 flex items-center justify-between">
                <Button type="button" variant="outline" size="icon" onClick={isRTL ? next : prev} aria-label={t.prev}
                  className="h-11 w-11 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
                  <ChevronLeft className={cn("h-5 w-5", isRTL && "rotate-180")} />
                </Button>
                <div className="text-[11px] text-white/90 px-2 py-1 rounded bg-black/30">
                  {isRTL ? `${t.image} ${index + 1} ${t.of} ${images.length}` : `${t.image} ${index + 1} ${t.of} ${images.length}`}
                </div>
                <Button type="button" variant="outline" size="icon" onClick={isRTL ? prev : next} aria-label={t.next}
                  className="h-11 w-11 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
                  <ChevronRight className={cn("h-5 w-5", isRTL && "rotate-180")} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* caption + counter */}
        {(showCaptions || showCounter) && (
          <div className="flex items-center justify-between gap-3 px-2 py-2 sm:py-3">
            {showCaptions ? (
              <div className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                {current.caption || current.alt || ""}
              </div>
            ) : <span />}
            {showCounter && (
              <div className="hidden sm:block text-xs text-muted-foreground">
                {isRTL ? `${t.image} ${index + 1} ${t.of} ${images.length}` : `${t.image} ${index + 1} ${t.of} ${images.length}`}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile thumb strip */}
      <div className="sm:hidden mt-2 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex gap-3 overflow-x-auto px-3 py-3 scrollbar-thin">
          {images.slice(Math.max(0, index - 6), Math.min(images.length, index + 12)).map((img, i) => {
            const actualIndex = Math.max(0, index - 6) + i;
            const active = actualIndex === index;
            const isLoaded = loadedImages.has(actualIndex);
            return (
              <button
                key={actualIndex}
                type="button"
                onClick={() => setIndex(actualIndex)}
                tabIndex={-1}
                aria-pressed={active}
                aria-current={active ? "true" : undefined}
                aria-label={img.alt || img.caption || `Image ${actualIndex + 1}`}
                className={cn(
                  "relative shrink-0 overflow-hidden rounded-lg border transition-all duration-200 h-16 w-24",
                  active ? "border-white/70 ring-2 ring-white/40 scale-105"
                         : "border-white/10 hover:border-white/30"
                )}
              >
                <OptimizedImage
                  src={img.src}
                  alt=""
                  width={240}
                  height={160}
                  loading="lazy"
                  className={cn("h-full w-full object-cover", isLoaded ? "opacity-90" : "opacity-70")}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Thumbnails */}
      <div 
        ref={thumbnailRef}
        className="hidden sm:block mt-4 rounded-2xl bg-white/5 supports-[backdrop-filter]:backdrop-blur-md border border-white/10"
      >
        <div
          ref={stripRef}
          className="flex gap-3 overflow-x-auto px-3 py-3 scrollbar-thin"
        >
          {visibleThumbs.map((img, i) => {
            const actualIndex = startIndex + i;
            const active = actualIndex === index;
            const isLoaded = loadedImages.has(actualIndex);
            
            return (
              <button
                key={actualIndex}
                data-idx={actualIndex}
                type="button"
                tabIndex={-1}
                onClick={() => setIndex(actualIndex)}
                className={cn(
                  "relative shrink-0 overflow-hidden rounded-lg border transition-all duration-200",
                  thumbSizeClass,
                  active
                    ? "border-white/70 ring-2 ring-white/40 scale-105"
                    : "border-white/10 hover:border-white/30 hover:scale-102"
                )}
                aria-pressed={active}
                aria-current={active ? "true" : undefined}
                aria-label={img.alt || img.caption || `Image ${actualIndex + 1}`}
              >
                <OptimizedImage
                  src={img.src}
                  alt=""
                  loading={isIntersecting ? "lazy" : "lazy"}
                  width={240}
                  height={160}
                  className={cn(
                    "h-full w-full object-cover transition-all duration-200 motion-reduce:transition-none",
                    isLoaded ? "opacity-90 hover:opacity-100" : "opacity-70"
                  )}
                />
                {/* Loading indicator for thumbnails */}
                {!isLoaded && (
                  <div className="absolute inset-0 bg-neutral-800/50 flex items-center justify-center">
                    <div className="w-3 h-3 border border-neutral-500 border-t-white rounded-full animate-spin motion-reduce:animate-none"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 p-4">
            <div className="text-xs text-muted-foreground">
              {isRTL 
                ? `${t.image} ${startIndex + 1}-${endIndex} ${t.of} ${images.length}`
                : `${t.image} ${startIndex + 1}-${endIndex} ${t.of} ${images.length}`
              }
            </div>
            <div className="flex items-center gap-2">
              {/* Previous page button */}
              {currentPage > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={showLess}
                  className="text-xs"
                >
                  ← {t.showLess}
                </Button>
              )}
              
              {/* Page indicator */}
              <div className="text-xs text-muted-foreground px-2">
                Page {currentPage + 1} of {totalPages}
              </div>
              
              {/* Next page button */}
              {currentPage < totalPages - 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadMore}
                  className="text-xs"
                >
                  {t.showMore} →
                </Button>
              )}
            </div>
            
            {/* Performance indicator */}
            <div className="text-xs text-muted-foreground opacity-70">
              {loadedImages.size}/{images.length} loaded
            </div>
          </div>
        )}
      </div>
      
      {/* Fullscreen Modal */}
      {!isMobile && isFullscreen && (
        <div 
          id="sk-fullscreen-root"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsFullscreen(false);
            }
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <OptimizedImage
              src={current.src}
              alt={current.alt || ""}
              className="max-w-full max-h-full object-contain"
              loading="eager"
            />
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 h-12 w-12 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10 flex items-center justify-center"
              aria-label={t.close}
            >
              <CloseIcon className="h-6 w-6" />
            </button>
            {/* Fullscreen navigation */}
            <div className="absolute inset-0 flex items-center justify-between p-8 pointer-events-none">
              <button
                onClick={isRTL ? next : prev}
                className="pointer-events-auto h-12 w-12 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors flex items-center justify-center"
                aria-label={t.prev}
                disabled={index === 0}
              >
                <ChevronLeft className={cn("h-6 w-6", isRTL && "rotate-180")} />
              </button>
              <button
                onClick={isRTL ? prev : next}
                className="pointer-events-auto h-12 w-12 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors flex items-center justify-center"
                aria-label={t.next}
                disabled={index === images.length - 1}
              >
                <ChevronRight className={cn("h-6 w-6", isRTL && "rotate-180")} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
    </>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
