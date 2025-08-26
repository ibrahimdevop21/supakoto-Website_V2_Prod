import * as React from "react";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Intersection Observer hook for lazy loading
const useIntersectionObserver = (options?: IntersectionObserverInit) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(target);
    return () => observer.disconnect();
  }, [options]);

  return { targetRef, isIntersecting };
};

// Optimized image component with lazy loading and error handling
const OptimizedImage = ({ 
  src, 
  alt, 
  className, 
  loading = "lazy",
  onLoad,
  onError,
  ...props 
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-neutral-800 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-neutral-600 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
      {imageError && (
        <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
          <div className="text-neutral-500 text-xs text-center p-2">
            <div className="mb-1">⚠️</div>
            <div>Failed to load</div>
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          imageLoaded ? "opacity-100" : "opacity-0",
          className
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
  const [index, setIndex] = useState(() => clamp(initialIndex, 0, Math.max(0, images.length - 1)));
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set<number>());
  const [preloadedPages, setPreloadedPages] = useState(new Set([0])); // Preload first page
  const mainRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const current = images[index];
  
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

  useEffect(() => {
    // Update current page when index changes
    const newPage = Math.floor(index / itemsPerPage);
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  }, [index, itemsPerPage, currentPage]);
  
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

  const prev = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : i)); // no loop
  }, []);
  
  const next = useCallback(() => {
    setIndex((i) => (i < images.length - 1 ? i + 1 : i)); // no loop
  }, [images.length]);
  
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);
  
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
      className={cn("py-8 md:py-12", className)}
      dir={isRTL ? "rtl" : "ltr"}
      onKeyDown={onKeyDown}
      aria-label={isRTL ? "معرض الصور" : "Image gallery"}
    >
      {/* Big image */}
      <div className="rounded-2xl bg-muted/20 border border-white/10 shadow-soft p-2">
        <div
          ref={mainRef}
          className={cn("relative overflow-hidden rounded-2xl bg-neutral-900 border border-white/10", heightClass)}
        >
          <OptimizedImage
            src={current.src}
            alt={current.alt || ""}
            className="h-full w-full object-cover"
            loading="eager"
          />
          {/* overlay controls */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-between p-2">
            <div className="pointer-events-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={isRTL ? next : prev}
                aria-label={t.prev}
              >
                <ChevronLeft className={cn("h-4 w-4", isRTL && "rotate-180")} />
              </Button>
            </div>
            <div className="pointer-events-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={isRTL ? prev : next}
                aria-label={t.next}
              >
                <ChevronRight className={cn("h-4 w-4", isRTL && "rotate-180")} />
              </Button>
            </div>
          </div>
        </div>

        {/* caption + counter */}
        {(showCaptions || showCounter) && (
          <div className="flex items-center justify-between gap-3 px-2 py-3">
            {showCaptions ? (
              <div className="text-sm text-muted-foreground truncate">
                {current.caption || current.alt || ""}
              </div>
            ) : <span />}
            {showCounter && (
              <div className="text-xs text-muted-foreground">
                {isRTL ? `${t.image} ${index + 1} ${t.of} ${images.length}` : `${t.image} ${index + 1} ${t.of} ${images.length}`}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div 
        ref={thumbnailRef}
        className="mt-4 rounded-2xl bg-white/5 supports-[backdrop-filter]:backdrop-blur-md border border-white/10"
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
                onClick={() => setIndex(actualIndex)}
                className={cn(
                  "relative shrink-0 overflow-hidden rounded-lg border transition-all duration-200",
                  thumbSizeClass,
                  active
                    ? "border-white/70 ring-2 ring-white/40 scale-105"
                    : "border-white/10 hover:border-white/30 hover:scale-102"
                )}
                aria-current={active ? "true" : undefined}
                aria-label={img.alt || img.caption || `Image ${actualIndex + 1}`}
              >
                <OptimizedImage
                  src={img.src}
                  alt=""
                  loading={isIntersecting ? "lazy" : "lazy"}
                  className={cn(
                    "h-full w-full object-cover transition-all duration-200",
                    isLoaded ? "opacity-90 hover:opacity-100" : "opacity-70"
                  )}
                />
                {/* Loading indicator for thumbnails */}
                {!isLoaded && (
                  <div className="absolute inset-0 bg-neutral-800/50 flex items-center justify-center">
                    <div className="w-3 h-3 border border-neutral-500 border-t-white rounded-full animate-spin"></div>
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
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <OptimizedImage
              src={current.src}
              alt={current.alt || ""}
              className="max-w-full max-h-full object-contain"
              loading="eager"
            />
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
              aria-label={t.close}
            >
              ×
            </button>
            {/* Fullscreen navigation */}
            <div className="absolute inset-0 flex items-center justify-between p-8 pointer-events-none">
              <button
                onClick={isRTL ? next : prev}
                className="pointer-events-auto p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                aria-label={t.prev}
                disabled={index === 0}
              >
                <ChevronLeft className={cn("h-6 w-6", isRTL && "rotate-180")} />
              </button>
              <button
                onClick={isRTL ? prev : next}
                className="pointer-events-auto p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
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
