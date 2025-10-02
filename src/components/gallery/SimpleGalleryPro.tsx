import * as React from "react";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type GalleryImage = {
  id?: string | number;
  full: string;   // /gallery/full/xxx.webp (or .avif variant)
  thumb: string;  // /gallery/thumbs/xxx.webp (≈320–480w)
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
};

export type GalleryProps = {
  locale?: "en" | "ar";
  images: GalleryImage[];
  initialIndex?: number;
  fallbackRatio?: number;
  className?: string;
  heightClass?: string;
  showCounter?: boolean;
  showCaptions?: boolean;
  thumbSizeClass?: string;
  randomize?: boolean;
  randomSeed?: string;
  wrapAround?: boolean;
};

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seededShuffle<T>(arr: T[], seedStr?: string) {
  const out = [...arr];
  if (!seedStr) return out;
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  const rnd = mulberry32(seed || 1);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function ProgressiveImage({
  img, eager = false, fit = "cover", className, ratio,
  fillParent = true,
}: {
  img: GalleryImage; eager?: boolean; fit?: "cover" | "contain"; className?: string; ratio?: number; fillParent?: boolean;
}) {
  const [ready, setReady] = useState(eager);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      const i = new Image();
      i.decoding = "async";
      i.src = img.full;
      i.onload = () => {
        if (cancelled) return;
        // decode if supported; fall back gracefully
        (i as HTMLImageElement).decode?.().finally(() => setReady(true)) ?? setReady(true);
      };
      i.onerror = () => setReady(true);
    };
    if (eager) load();
    else {
      const idle = typeof window !== "undefined" && "requestIdleCallback" in window
        ? (cb: () => void) => (window as any).requestIdleCallback(cb, { timeout: 1000 })
        : (cb: () => void) => setTimeout(cb, 150);
      idle(load);
    }
    return () => { cancelled = true; };
  }, [img.full, eager]);

  const ar = img.width && img.height ? img.width / img.height : ratio || 16/9;
  const sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 960px";

  return (
    <div
      className={cn(
        fillParent ? "absolute inset-0 h-full w-full" : "relative",
        "overflow-hidden",
        className
      )}
      style={fillParent ? undefined : { aspectRatio: `${ar}`, containIntrinsicSize: img.width && img.height ? undefined : "960px 540px" }}
    >
      <img
        src={img.thumb}
        alt={img.alt || ""}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "auto"}
        draggable={false}
        className={cn("absolute inset-0 h-full w-full object-cover blur-[2px] transition-opacity", ready ? "opacity-0" : "opacity-100")}
        style={{ objectFit: fit }}
      />
      <picture>
        {/* If you also export AVIF, uncomment the next line:
        <source srcSet={img.full.replace(/\.webp$/i, ".avif")} type="image/avif" />
        */}
        <source srcSet={img.full} type="image/webp" />
        <img
          src={img.full}
          alt={img.alt || ""}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          sizes={sizes}
          fetchPriority={eager ? "high" : "auto"}
          draggable={false}
          className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-200", ready ? "opacity-100" : "opacity-0")}
          style={{ objectFit: fit }}
        />
      </picture>
    </div>
  );
}

const ChevronLeft = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
);
const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
);

export default function SimpleGalleryPro({
  locale = "en", images: originalImages, initialIndex = 0, fallbackRatio, className,
  heightClass = "h-[58vw] max-h-[72vh] md:h-[520px]",
  showCounter = true, showCaptions = true, thumbSizeClass = "h-16 w-24 md:h-20 md:w-28",
  randomize = false, randomSeed,
  wrapAround = true,
}: GalleryProps) {
  const isRTL = locale === "ar";
  const [index, setIndex] = useState(
    Math.min(Math.max(0, initialIndex), Math.max(0, (Array.isArray(originalImages) ? originalImages.length : 0) - 1))
  );
  const stripRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const deltaX = useRef(0);
  const loadedRef = useRef<Set<string>>(new Set());

  // Track mobile breakpoint to only apply aspect ratio on mobile without SSR mismatch
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia === "undefined") return;
    const mq = window.matchMedia("(max-width: 639.98px)");
    const apply = () => setIsMobile(!!mq.matches);
    apply();
    if (typeof mq.addEventListener === "function") mq.addEventListener("change", apply);
    else if (typeof mq.addListener === "function") mq.addListener(apply);
    return () => {
      if (typeof mq.removeEventListener === "function") mq.removeEventListener("change", apply);
      else if (typeof mq.removeListener === "function") mq.removeListener(apply);
    };
  }, []);

  // Apply sm: prefix to each height token so fixed height only kicks in at sm+
  const smHeightClass = useMemo(() => {
    const cls = (heightClass || "").trim();
    if (!cls) return "";
    return cls
      .split(/\s+/)
      .filter(Boolean)
      .map((c) => /^(sm:|md:|lg:|xl:|2xl:)/.test(c) ? c : `sm:${c}`)
      .join(" ");
  }, [heightClass]);

  const images = useMemo(
    () => {
      const base = randomize ? seededShuffle(originalImages, randomSeed) : originalImages;
      return [...base];
    },
    [originalImages, randomize, randomSeed]
  );
  useEffect(() => { setIndex((i) => Math.max(0, Math.min(i, images.length - 1))); }, [images.length]);

  const t = useMemo(() => ({
    prev: isRTL ? "السابق" : "Previous", next: isRTL ? "التالي" : "Next",
    of: isRTL ? "من" : "of", image: isRTL ? "الصورة" : "Image",
  }), [isRTL]);

  const prev = useCallback(() => setIndex(i => (i > 0 ? i - 1 : (wrapAround ? images.length - 1 : i))), [images.length, wrapAround]);
  const next = useCallback(() => setIndex(i => (i < images.length - 1 ? i + 1 : (wrapAround ? 0 : i))), [images.length, wrapAround]);

  useEffect(() => {
    const active = stripRef.current?.querySelector<HTMLElement>(`[data-idx="${index}"]`);
    active?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  useEffect(() => {
    const ids = [index - 1, index + 1]
      .map(i => (wrapAround ? (i + images.length) % images.length : i))
      .filter(i => i >= 0 && i < images.length);

    const idle = typeof window !== "undefined" && "requestIdleCallback" in window
      ? (cb: () => void) => (window as any).requestIdleCallback(cb, { timeout: 800 })
      : (cb: () => void) => setTimeout(cb, 120);

    ids.forEach(i => idle(() => {
      const src = images[i].full;
      if (loadedRef.current.has(src)) return;
      loadedRef.current.add(src);
      const im = new Image();
      im.decoding = "async";
      im.src = src;
    }));
  }, [index, images, wrapAround]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "PageUp") (isRTL ? next : prev)();
    if (e.key === "ArrowRight" || e.key === "PageDown") (isRTL ? prev : next)();
    if (e.key === "Home") setIndex(0);
    if (e.key === "End") setIndex(images.length - 1);
  }, [isRTL, next, prev, images.length]);

  if (!images.length) return null;
  const current = images[index];

  return (
    <section
      className={cn("py-6 md:py-10", className)}
      dir={isRTL ? "rtl" : "ltr"}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={isRTL ? "معرض الصور" : "Image gallery"}
      aria-live="polite"
      onKeyDown={(e) => {
        // prevent page scroll for nav keys
        const navKeys = ["ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown"];
        if (navKeys.includes(e.key)) e.preventDefault();
        onKeyDown(e);
      }}
    >
      <div className="rounded-2xl bg-neutral-900/60 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.25)] p-2">
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl bg-black/60 border border-white/10 select-none",
            // Only apply fixed heights at sm+ breakpoints
            smHeightClass,
            // Ensure mobile height is auto so aspectRatio controls size
            "h-auto"
          )}
          style={{
            touchAction: "pan-y",
            // Only apply aspectRatio on mobile; sm+ heights come from classes
            aspectRatio: isMobile
              ? ((current.width && current.height)
                  ? `${current.width}/${current.height}`
                  : (typeof fallbackRatio === "number" ? String(fallbackRatio) : "4/3"))
              : undefined
          }}
          onPointerDown={(e) => { startX.current = e.clientX; deltaX.current = 0; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); }}
          onPointerMove={(e) => { if (startX.current != null) deltaX.current = e.clientX - startX.current; }}
          onPointerUp={() => {
            // a slightly higher threshold avoids accidental swipes
            const THRESHOLD = 48;
            if (Math.abs(deltaX.current) > THRESHOLD) {
              (deltaX.current > 0) ? (isRTL ? next() : prev()) : (isRTL ? prev() : next());
            }
            startX.current = null; deltaX.current = 0;
          }}
        >
          <ProgressiveImage img={current} eager ratio={current.width && current.height ? current.width / current.height : fallbackRatio} fillParent />
          <div className="absolute inset-0 flex items-center justify-between p-2 md:p-4">
            <Button type="button" variant="outline" size="icon" onClick={isRTL ? next : prev} aria-label={t.prev} className="h-10 w-10 md:h-12 md:w-12 bg-black/35 hover:bg-black/55 border-white/25 hover:border-white/40 text-white">
              <ChevronLeft className={cn("h-5 w-5 md:h-6 md:w-6", isRTL && "rotate-180")} />
            </Button>
            <Button type="button" variant="outline" size="icon" onClick={isRTL ? prev : next} aria-label={t.next} className="h-10 w-10 md:h-12 md:w-12 bg-black/35 hover:bg-black/55 border-white/25 hover:border-white/40 text-white">
              <ChevronRight className={cn("h-5 w-5 md:h-6 md:w-6", isRTL && "rotate-180")} />
            </Button>
          </div>
          <div className="sm:hidden absolute bottom-3 left-1/2 -translate-x-1/2">
            <div className="text-[11px] text-white/95 px-3 py-1.5 rounded-full bg-black/65 border border-white/20">{isRTL ? `الصورة ${index + 1} من ${images.length}` : `Image ${index + 1} of ${images.length}`}</div>
          </div>
        </div>
        {(showCaptions || showCounter) && (
          <div className="flex items-center justify-between gap-3 px-2 py-2 sm:py-3">
            {showCaptions ? <div className="text-xs sm:text-sm text-neutral-300/90 line-clamp-2">{current.caption || current.alt || ""}</div> : <span />}
            {showCounter && <div className="hidden sm:block text-xs text-neutral-400">{isRTL ? `الصورة ${index + 1} من ${images.length}` : `Image ${index + 1} of ${images.length}`}</div>}
          </div>
        )}
      </div>
      <div className="mt-4 rounded-2xl bg-white/5 supports-[backdrop-filter]:backdrop-blur-md border border-white/10">
        <div ref={stripRef} className={cn(
          "flex gap-3 overflow-x-auto px-3 py-3 scrollbar-thin",
          "[-webkit-overflow-scrolling:touch]"
        )}>
          {images.map((img, i) => {
            const active = i === index;
            return (
              <button
                key={img.id ?? i}
                data-idx={i}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  "relative shrink-0 overflow-hidden rounded-xl border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-white/50",
                  thumbSizeClass,
                  active ? "border-white/70 ring-2 ring-white/30 scale-105" : "border-white/10 hover:border-white/30 hover:scale-102"
                )}
                aria-pressed={active}
                aria-current={active ? "true" : undefined}
                aria-label={img.alt || img.caption || `Image ${i + 1}`}
              >
                <img src={img.thumb} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" draggable={false} />
                {active && <span className="pointer-events-none absolute inset-0 ring-2 ring-white/30 rounded-xl" />}
              </button>
            );
          })}
        </div>
      </div>
      <div className="sr-only" aria-live="polite">
        {isRTL ? `الصورة ${index + 1} من ${images.length}` : `Image ${index + 1} of ${images.length}`}
      </div>
    </section>
  );
}
