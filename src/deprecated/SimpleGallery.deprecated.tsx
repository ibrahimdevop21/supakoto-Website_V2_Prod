import * as React from "react";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
// Polyfills for requestIdleCallback/cancelIdleCallback (Safari/Android support)
const ric =
  typeof window !== "undefined" && "requestIdleCallback" in window
    ? window.requestIdleCallback
    : (cb: IdleRequestCallback) =>
        window.setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 } as any), 1) as any;

const cic =
  typeof window !== "undefined" && "cancelIdleCallback" in window
    ? window.cancelIdleCallback
    : (id: any) => clearTimeout(id);

// Shuffle utility with crypto-based randomness when available
function shuffleInPlace<T>(arr: T[]) {
  // Better randomness using crypto when available
  const rand = (n: number) => {
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      return buf[0] / 2 ** 32 * n;
    }
    return Math.random() * n;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand(i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Fallback static list for SSR
const FALLBACK_FILENAMES = Array.from({ length: 238 }, (_, i) => 
  `supa-${String(i + 1).padStart(3, '0')}.webp`
);

// IntersectionObserver hook for virtualized thumbnails
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

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { rootMargin: '300px', ...options });

    observer.observe(target);
    return () => observer.disconnect();
  }, [options, isClient]);

  return { targetRef, isInView: isClient ? isInView : true };
};

// Helper to prefetch images
const prefetchImage = (href: string) => {
  if (typeof document === 'undefined') return;
  
  const existingLink = document.querySelector(`link[href="${href}"]`);
  if (existingLink) return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = 'image';
  link.href = href;
  document.head.appendChild(link);
};

// Build items from manifest
const buildItems = (fileList: string[]): SimpleGalleryImage[] => {
  return fileList.map(f => ({
    id: f,
    src: `/gallery/full/${f}`,
    thumbSrc: `/gallery/thumbs/${f}`,
    alt: f.replace(/\.webp$/, '').toUpperCase(),
    srcSet: undefined,
    blurDataURL: undefined
  }));
};

const ITEMS = buildItems(FALLBACK_FILENAMES);

// Virtualized thumbnail component
const VirtualThumb: React.FC<{
  item: SimpleGalleryImage;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}> = ({ item, isSelected, onClick, index }) => {
  const { targetRef, isInView } = useInView();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div ref={targetRef} className="shrink-0">
      {isInView ? (
        <button
          type="button"
          data-idx={index}
          onClick={onClick}
          aria-selected={isSelected}
          aria-label={`View image ${index + 1}: ${item.alt}`}
          className={cn(
            "h-[84px] w-[84px] md:h-[100px] md:w-[100px] shrink-0 rounded-xl border overflow-hidden transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 relative",
            isSelected
              ? "border-white ring-2 ring-white/50"
              : "border-white/10 hover:border-white/30"
          )}
        >
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
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
              width={100}
              height={100}
              sizes="(max-width: 768px) 84px, 100px"
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
        <div className="h-[84px] w-[84px] md:h-[100px] md:w-[100px] rounded-xl bg-neutral-800 animate-pulse" />
      )}
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
  id: string;
  src: string;
  thumbSrc: string;
  alt?: string;
  caption?: string;
  srcSet?: string[];
  blurDataURL?: string;
};

export type SimpleGalleryProps = {
  locale?: "en" | "ar";
  images?: SimpleGalleryImage[];
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
  images = ITEMS, // Use manifest items as fallback
  initialIndex = 0,
  heightClass = "aspect-[16/9]",
  showCounter = true,
  showCaptions = true,
  className,
  thumbSizeClass = "h-20 w-20",
  itemsPerPage = 24,
}: SimpleGalleryProps) {
  // Component state
  const [dynamicItems, setDynamicItems] = useState<SimpleGalleryImage[]>(images);
  const [isLoaded, setIsLoaded] = useState(false);
  const [thumbScrollPct, setThumbScrollPct] = useState(0);
  
  // Load filenames dynamically on mount
  useEffect(() => {
    let cancelled = false;
    fetch('/gallery/filenames.json')
      .then(res => res.json())
      .then((data: string[]) => {
        if (cancelled) return;
        // 1) build items
        const items = buildItems(data);
        // 2) shuffle once per load
        shuffleInPlace(items);
        // 3) set state
        setDynamicItems(items);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error('Failed to load gallery manifest:', error);
        setIsLoaded(true); // use fallback
      });
    return () => { cancelled = true; };
  }, []);
  
  const finalImages = dynamicItems;
  
  const isRTL = locale === "ar";
  const isIOS = typeof navigator !== 'undefined' && /iP(hone|ad|od)/.test(navigator.userAgent);
  const [index, setIndex] = useState(() => clamp(initialIndex, 0, Math.max(0, finalImages.length - 1)));
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set<number>());
  const [preloadedPages, setPreloadedPages] = useState(new Set([0]));
  const mainRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const idleCallbackRef = useRef<number | null>(null);
  const current = finalImages[index];
  
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
  
  // Calculate pagination with performance optimizations
  const totalPages = Math.ceil(finalImages.length / itemsPerPage);

  const t = useMemo(
    () => ({
      prev: isRTL ? "السابق" : "Previous",
      next: isRTL ? "التالي" : "Next",
      of: isRTL ? "من" : "of",
      image: isRTL ? "صورة" : "Image",
      showMore: isRTL ? "عرض المزيد" : "Show more",
      showLess: isRTL ? "عرض أقل" : "Show less",
      fullscreen: isRTL ? "ملء الشاشة" : "Fullscreen",
      close: isRTL ? "إغلاق" : "Close",
    }),
    [isRTL]
  );

  const prev = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : i)); // no loop
  }, []);
  
  const next = useCallback(() => {
    setIndex((i) => (i < finalImages.length - 1 ? i + 1 : i)); // no loop
  }, [finalImages.length]);
  
  // Preload neighbor images using requestIdleCallback for better performance
  const preloadNeighborImages = useCallback((centerIndex: number) => {
    if (idleCallbackRef.current) {
      cic(idleCallbackRef.current);
    }
    
    const preloadImage = (idx: number) => {
      if (idx >= 0 && idx < finalImages.length && !loadedImages.has(idx)) {
        const img = new Image();
        img.src = finalImages[idx].src;
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, idx]));
        };
      }
    };
    
    // Use requestIdleCallback for non-critical preloading
    idleCallbackRef.current = ric(() => {
      // Preload previous and next 2 images
      for (let i = -2; i <= 2; i++) {
        if (i !== 0) { // Skip current image (already loaded)
          preloadImage(centerIndex + i);
        }
      }
    }, { timeout: 2000 });
  }, [finalImages, loadedImages]);

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
  
  // Intersection observer for thumbnail container
  const [isIntersecting, setIsIntersecting] = useState(true);
  
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setIsIntersecting(true);
      return;
    }
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, { threshold: 0.1, rootMargin: '100px' });
    
    if (mainRef.current) {
      observer.observe(mainRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

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

  // Removed redundant page preloading - neighbor preloading is sufficient
  
  // Preload main image and trigger neighbor preloading
  useEffect(() => {
    if (!current) return;
    
    // Preload current image immediately
    if (!loadedImages.has(index)) {
      const img = new Image();
      img.src = current.src;
      img.onload = () => setLoadedImages(prev => new Set([...prev, index]));
    }
    
    // Trigger neighbor preloading with requestIdleCallback
    preloadNeighborImages(index);
    
    // Cleanup idle callback on unmount
    return () => {
      if (idleCallbackRef.current) {
        cic(idleCallbackRef.current);
      }
    };
  }, [index, current, loadedImages, preloadNeighborImages]);
  
  useEffect(() => {
    // keep active thumb visible
    const strip = stripRef.current;
    if (!strip) return;
    const active = strip.querySelector<HTMLElement>(`[data-idx="${index}"]`);
    active?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index, currentPage]);

  
  // Removed unused loadMore and showLess functions

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      (isRTL ? next : prev)();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      (isRTL ? prev : next)();
    }
    if (e.key === "Home") {
      e.preventDefault();
      setIndex(0);
    }
    if (e.key === "End") {
      e.preventDefault();
      setIndex(finalImages.length - 1);
    }
  }, [isRTL, next, prev, finalImages.length]);

  // Additional neighbor prefetching with requestIdleCallback
  useEffect(() => {
    if (idleCallbackRef.current) {
      cic(idleCallbackRef.current);
    }

    idleCallbackRef.current = ric(() => {
      // Prefetch previous and next images
      const prevIndex = index - 1;
      const nextIndex = index + 1;
      
      if (prevIndex >= 0 && finalImages[prevIndex]) {
        prefetchImage(finalImages[prevIndex].src);
      }
      if (nextIndex < finalImages.length && finalImages[nextIndex]) {
        prefetchImage(finalImages[nextIndex].src);
      }
    }, { timeout: 2000 });

    return () => {
      if (idleCallbackRef.current) {
        cic(idleCallbackRef.current);
      }
    };
  }, [index, finalImages]);

  // Handler for thumb scroll progress
  const onThumbScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const pct = el.scrollWidth <= el.clientWidth
      ? 1
      : el.scrollLeft / (el.scrollWidth - el.clientWidth);
    setThumbScrollPct(pct);
  }, []);

  // Since we're using client:only, this check is no longer needed
  // but keeping for safety in case directive changes
  
  // Show loading state while fetching manifest
  if (!isLoaded) {
    return (
      <section className={cn("py-8 md:py-12 pb-[max(1rem,env(safe-area-inset-bottom))]", className)}>
        <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] xl:aspect-[21/9] overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
            Loading gallery...
          </div>
        </div>
      </section>
    );
  }
  
  if (!finalImages?.length) return null;

  return (
    <section
      className={cn(
        "py-8 md:py-12 pb-[max(1rem,env(safe-area-inset-bottom))]",
        className
      )}
      dir={isRTL ? "rtl" : "ltr"}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label={isRTL ? "معرض الصور" : "Image gallery"}
    >
      {/* Shared container for BOTH stage + thumbs.
          Use the SAME constraints as your site (match navbar/pages). */}
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* === Stage (full image) === */}
        <div
          ref={mainRef}
          className={cn(
            "relative w-full",
            // viewport-based height; no fixed aspect so no letterboxing
            "h-[clamp(240px,60svh,720px)] md:h-[clamp(420px,68svh,820px)]",
            "overflow-hidden rounded-3xl bg-neutral-900/95",
            "border border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
          )}
          style={{ touchAction: "pan-y" }}
          {...touchHandlers}
        >
          {current?.blurDataURL && (
            <div
              className="absolute inset-0 bg-cover bg-center blur-sm scale-110"
              style={{ backgroundImage: `url(${current.blurDataURL})` }}
              aria-hidden
            />
          )}

          <img
            src={current?.src}
            alt={current?.alt || ""}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            {...(index === 0 && { fetchpriority: "high" } as any)}
            sizes="(max-width:768px) 100vw, 1200px"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />

          {/* Arrows – inset from edges, no extra container padding */}
          <button
            type="button"
            onClick={isRTL ? next : prev}
            disabled={index === 0}
            aria-label="Previous image"
            className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2
                       grid place-items-center size-9 md:size-10 rounded-full
                       bg-black/55 backdrop-blur-sm text-white/95 border border-white/10
                       hover:bg-black/70 active:scale-[0.98] transition
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:opacity-30"
          >
            <ChevronLeft className={cn("h-5 w-5", isRTL && "rotate-180")} />
          </button>

          <button
            type="button"
            onClick={isRTL ? prev : next}
            disabled={index === finalImages.length - 1}
            aria-label="Next image"
            className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2
                       grid place-items-center size-9 md:size-10 rounded-full
                       bg-black/55 backdrop-blur-sm text-white/95 border border-white/10
                       hover:bg-black/70 active:scale-[0.98] transition
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:opacity-30"
          >
            <ChevronRight className={cn("h-5 w-5", isRTL && "rotate-180")} />
          </button>

          {showCounter && (
            <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4
                            px-2.5 py-1 rounded-lg text-xs md:text-sm
                            bg-black/60 text-white/95 border border-white/10">
              {index + 1} / {finalImages.length}
            </div>
          )}
        </div>

        {/* Caption */}
        {showCaptions && current?.caption && (
          <div className="mt-4 text-sm text-muted-foreground">
            {current.caption}
          </div>
        )}

        {/* === Thumbs rail (shares the SAME container) === */}
        <div className="mt-5 md:mt-6">
          <div
            ref={stripRef}
            className={cn(
              "relative flex gap-3 md:gap-3.5 overflow-x-auto pb-3 md:pb-3.5",
              "gallery-scroll thumb-fade",
              "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-700/50"
            )}
            role="listbox"
            aria-label={isRTL ? "مصغرات المعرض" : "Gallery thumbnails"}
          >
            {finalImages
              .slice(Math.max(0, index - 20), Math.min(finalImages.length, index + 21))
              .map((item, i) => {
                const actualIndex = Math.max(0, index - 20) + i;
                return (
                  <VirtualThumb
                    key={item.id}
                    item={item}
                    isSelected={actualIndex === index}
                    onClick={() => setIndex(actualIndex)}
                    index={actualIndex}
                  />
                );
              })}
          </div>

          {/* optional slim progress line that aligns with the same container */}
          <div className="mt-1.5 h-[3px] rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white/30 transition-[width]"
              style={{ width: `${Math.min(100, ((index + 1) / finalImages.length) * 100)}%` }}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
