import * as React from "react";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  itemsPerPage = 20,
}: SimpleGalleryProps) {
  const isRTL = locale === "ar";
  const [index, setIndex] = useState(() => clamp(initialIndex, 0, Math.max(0, images.length - 1)));
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const current = images[index];
  
  // Calculate pagination
  const totalPages = Math.ceil(images.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, images.length);
  const visibleThumbs = images.slice(startIndex, endIndex);

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
          className={cn("relative overflow-hidden rounded-xl", heightClass)}
          tabIndex={0}
        >
          {/* image */}
          <img
            src={current.src}
            alt={current.alt || ""}
            loading="lazy"
            decoding="async"
            srcSet={current.srcSet?.join(", ")}
            className="h-full w-full object-cover"
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
      <div className="mt-4 rounded-2xl bg-white/5 supports-[backdrop-filter]:backdrop-blur-md border border-white/10">
        <div
          ref={stripRef}
          className="flex gap-3 overflow-x-auto px-3 py-3 scrollbar-thin"
        >
          {visibleThumbs.map((img, i) => {
            const actualIndex = startIndex + i;
            const active = actualIndex === index;
            return (
              <button
                key={actualIndex}
                data-idx={actualIndex}
                type="button"
                onClick={() => setIndex(actualIndex)}
                className={cn(
                  "relative shrink-0 overflow-hidden rounded-lg border",
                  thumbSizeClass,
                  active
                    ? "border-white/70 ring-2 ring-white/40"
                    : "border-white/10 hover:border-white/30"
                )}
                aria-current={active ? "true" : undefined}
                aria-label={img.alt || img.caption || `Image ${actualIndex + 1}`}
              >
                <img
                  src={img.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover opacity-90 hover:opacity-100 transition"
                />
              </button>
            );
          })}
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-4 p-4">
            <div className="text-xs text-muted-foreground">
              {isRTL 
                ? `${t.image} ${startIndex + 1}-${endIndex} ${t.of} ${images.length}`
                : `${t.image} ${startIndex + 1}-${endIndex} ${t.of} ${images.length}`
              }
            </div>
            {currentPage < totalPages - 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={loadMore}
                className="text-xs"
              >
                {t.showMore}
              </Button>
            )}
            {currentPage > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={showLess}
                className="text-xs"
              >
                {t.showLess}
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={current.src}
              alt={current.alt || ""}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              aria-label={t.close}
            >
              ×
            </button>
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
