// components/TimelineAlt.tsx  (v2.1 — same-year pairs share one row/badge)
import * as React from "react";
import { useTranslations, useIsRTL } from "@/i18n/react";

type Dir = "ltr" | "rtl";

export interface TimelineEvent {
  year: string;
  title: string;
  desc: string;
  icon?: React.ReactNode;
}

interface TimelineProps {
  locale?: "en" | "ar";
  events?: TimelineEvent[];
  connectorClass?: string; // desktop connector length from spine → card (default: w-24)
  density?: "compact" | "cozy";
}

function useVisibleOnce(ref: React.RefObject<Element>) {
  const [v, setV] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(true); return; }
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setV(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return v;
}

/* ---- Row types after grouping ---- */
type RowItem =
  | { year: string; left: TimelineEvent; right?: undefined }   // single (one side)
  | { year: string; left: TimelineEvent; right: TimelineEvent } // pair (both sides)

/* ---- Group consecutive same-year items into one row (pairs) ---- */
function groupIntoRows(events: TimelineEvent[]): RowItem[] {
  const rows: RowItem[] = [];
  let i = 0;
  while (i < events.length) {
    const a = events[i];
    const b = events[i + 1];
    if (b && b.year === a.year) {
      rows.push({ year: a.year, left: a, right: b });
      i += 2;
    } else {
      rows.push({ year: a.year, left: a });
      i += 1;
    }
  }
  return rows;
}

/* ---- Single-card row (keeps zig-zag alternation) ---- */
function SingleRow({
  rowIndex, dir, ev, connectorClass, compact,
}: {
  rowIndex: number; dir: Dir; ev: TimelineEvent;
  connectorClass: string; compact: boolean;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const visible = useVisibleOnce(ref);
  const cardOnLeft = (rowIndex % 2 === 0) ? (dir === "rtl") : (dir !== "rtl");

  return (
    <div ref={ref} className={`relative ${compact ? "py-6 md:py-8" : "py-8 md:py-12"}`}>
      {/* center spine */}
      <span aria-hidden className="hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-[3px] rounded-full bg-gradient-to-b from-white/25 via-white/12 to-white/5" />
      {/* big centered year badge */}
      <span className="hidden md:flex items-center justify-center z-30 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-brand-primary text-white text-base font-semibold border-2 border-white/10 shadow-[0_0_0_8px_rgba(191,30,46,0.18)]">
        {ev.year}
      </span>
      {/* connector to the single card */}
      <span aria-hidden className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-[2px] bg-white/22 z-20 ${connectorClass} ${cardOnLeft ? "right-1/2" : "left-1/2"}`} />

      {/* card */}
      <article
        className={[
          "relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg transition duration-500",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          "w-full md:w-[min(42rem,calc(50%-2.25rem))]",
          cardOnLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8",
        ].join(" ")}
      >
        {/* mobile year chip */}
        <div className="md:hidden mb-2 inline-flex items-center text-sm text-white/80">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-brand-primary text-white mr-2">
            {ev.year}
          </span>
          <span aria-hidden className="h-px w-8 bg-white/15" />
        </div>

        <h3 className="text-xl md:text-2xl font-semibold text-white">{ev.title}</h3>
        <p className="mt-2 text-white/80 leading-relaxed">{ev.desc}</p>
      </article>
    </div>
  );
}

/* ---- Pair row: one badge in the middle, two connectors, two cards ---- */
function PairRow({
  dir, left, right, connectorClass, compact,
}: {
  dir: Dir; left: TimelineEvent; right: TimelineEvent;
  connectorClass: string; compact: boolean;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const visible = useVisibleOnce(ref);
  // For pairs we use both sides; no alternation needed.

  return (
    <div ref={ref} className={`relative ${compact ? "py-6 md:py-8" : "py-8 md:py-12"}`}>
      {/* center spine */}
      <span aria-hidden className="hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-[3px] rounded-full bg-gradient-to-b from-white/25 via-white/12 to-white/5" />
      {/* single big year badge */}
      <span className="hidden md:flex items-center justify-center z-30 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-brand-primary text-white text-base font-semibold border-2 border-white/10 shadow-[0_0_0_8px_rgba(191,30,46,0.18)]">
        {left.year}
      </span>
      {/* connectors to both cards */}
      <span aria-hidden className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-[2px] bg-white/22 z-20 ${connectorClass} right-1/2`} />
      <span aria-hidden className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-[2px] bg-white/22 z-20 ${connectorClass} left-1/2`} />

      {/* LEFT card (mirrors for RTL: still the visual left half) */}
      <article
        className={[
          "relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg transition duration-500",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          "w-full md:w-[min(42rem,calc(50%-2.25rem))] md:mr-auto md:pr-8",
        ].join(" ")}
      >
        {/* mobile chip for first of the two */}
        <div className="md:hidden mb-2 inline-flex items-center text-sm text-white/80">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-brand-primary text-white mr-2">
            {left.year}
          </span>
          <span aria-hidden className="h-px w-8 bg-white/15" />
        </div>
        <h3 className="text-xl md:text-2xl font-semibold text-white">{left.title}</h3>
        <p className="mt-2 text-white/80 leading-relaxed">{left.desc}</p>
      </article>

      {/* RIGHT card */}
      <article
        className={[
          "relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg transition duration-500",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          "w-full md:w-[min(42rem,calc(50%-2.25rem))] md:ml-auto md:pl-8 mt-6 md:mt-0",
        ].join(" ")}
      >
        {/* no chip on mobile for the second card to avoid duplicate year */}
        <h3 className="text-xl md:text-2xl font-semibold text-white">{right.title}</h3>
        <p className="mt-2 text-white/80 leading-relaxed">{right.desc}</p>
      </article>
    </div>
  );
}

/* ---- Main ---- */
export default function TimelineAlt({
  locale = "en",
  events,
  connectorClass = "w-24",
  density = "compact",
}: TimelineProps) {
  const t = useTranslations(locale);
  const isRTL = useIsRTL(locale);
  const dir: Dir = isRTL ? "rtl" : "ltr";

  const title = t("about.journey.title");
  const raw = events ?? t("about.journey.events");
  const list: TimelineEvent[] = Array.isArray(raw) ? raw : [];
  if (!list.length) return null;

  const rows = groupIntoRows(list); // <- magic line
  const compact = density === "compact";

  return (
    <section aria-labelledby="journey" className="relative pt-4 pb-8 md:pt-6 md:pb-10" dir={dir}>
      <div className="relative mx-auto max-w-5xl px-4 md:px-6">
        <h2 
          id="journey" 
          className={[
            "font-bold tracking-tight text-center",
            isRTL ? "font-arabic" : "",
            "text-[clamp(1.75rem,4vw+0.5rem,3.25rem)] md:text-[clamp(2.5rem,2.8vw+1rem,3.75rem)]",
            "leading-[1.15] supports-[text-wrap:balance]:text-balance",
            "bg-gradient-to-r from-[#bf1e2e] via-orange-400 to-[#bf1e2e] bg-clip-text text-transparent",
            "mb-6 md:mb-8"
          ].join(" ")}
        >
          {title}
        </h2>

        {/* Elegant Divider — RTL aware */}
        <div className="flex items-center justify-center gap-6 my-6 md:my-8 mb-10 md:mb-12" aria-hidden="true">
          <div className="h-px w-24 sm:w-32 md:w-40 bg-gradient-to-r from-transparent via-[#bf1e2e]/50 to-transparent" />
          <div className="w-3 h-3 rounded-full bg-brand-primary" />
          <div className="h-px w-24 sm:w-32 md:w-40 bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />
        </div>

        <div className={`relative flex flex-col ${compact ? "gap-6 md:gap-8" : "gap-10 md:gap-12"}`}>
          {rows.map((row, rowIndex) =>
            "right" in row && row.right ? (
              <PairRow
                key={`${row.year}-${rowIndex}-pair`}
                dir={dir}
                left={row.left}
                right={row.right}
                connectorClass={connectorClass}
                compact={compact}
              />
            ) : (
              <SingleRow
                key={`${row.year}-${rowIndex}-single`}
                rowIndex={rowIndex}
                dir={dir}
                ev={row.left}
                connectorClass={connectorClass}
                compact={compact}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}
