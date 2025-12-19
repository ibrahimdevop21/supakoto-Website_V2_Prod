import React, { useEffect, useRef, useState } from "react";
import type { Locale, ServicedBrand } from "../../data/servicedBrands";
import { SERVICED_BRANDS } from "../../data/servicedBrands";
import clsx from "clsx";
import "./ModernTrustedBy.css";

interface ServicedBrandStripProps {
  locale: Locale;
  items?: ServicedBrand[];
  partners?: ServicedBrand[];
  /** Optional: override animation duration in seconds (both carousels) */
  durationSec?: number;
}

const DEFAULT_PARTNERS: ServicedBrand[] = [
  {
    slug: "mansour-group",
    name: "Mansour Group",
    logoSrc: "/partners/mansour-group-logo.svg",
    url: "https://www.mansourgroup.com",
    alt: { en: "Mansour Group", ar: "مجموعة منصور" },
  },
  {
    slug: "mercedes-benz",
    name: "Mercedes-Benz",
    logoSrc: "/partners/mercedes-benz-9.svg",
    url: "https://www.mercedes-benz.com",
    alt: { en: "Mercedes-Benz", ar: "مرسيدس-بنز" },
  },
  {
    slug: "avatar-technology",
    name: "Avatar Technology",
    logoSrc: "/partners/Avatr_Technology_logo.svg",
    url: "https://www.avatr.com",
    alt: { en: "Avatar Technology", ar: "أفاتار تكنولوجي" },
  },
  {
    slug: "skoda",
    name: "Škoda",
    logoSrc: "/partners/skoda.svg",
    url: "https://www.skoda-auto.com",
    alt: { en: "Škoda", ar: "سكودا" },
  },
  {
    slug: "citroen",
    name: "Citroën",
    logoSrc: "/partners/citroen.svg",
    url: "https://www.citroen.com",
    alt: { en: "Citroën", ar: "ستروين" },
  },
  {
    slug: "samir-rayan",
    name: "Samir Rayan",
    logoSrc: "/partners/samer.webp",
    url: "https://samirrayan.com",
    alt: { en: "Samir Rayan", ar: "سمير ريان" },
  },
  {
    slug: "jetour",
    name: "Jetour",
    logoSrc: "/partners/jetour.svg",
    url: "https://www.jetour.com",
    alt: { en: "Jetour", ar: "جيتور" },
  },
];

export default function ServicedBrandStrip({
  locale,
  items = SERVICED_BRANDS,
  partners = DEFAULT_PARTNERS,
  durationSec = 28, // unified speed (same for both); tweak if you want
}: ServicedBrandStripProps) {
  const isRTL = locale === "ar";
  const title = isRTL ? "السيارات التي خدمناها" : "Vehicles We've Protected";
  const partnersTitle = isRTL ? "الشركاء الرسميون" : "Official Partners";
  const partnersSubtitle = isRTL
    ? "نفخر بشراكتنا مع أفضل العلامات التجارية في صناعة السيارات"
    : "Proud to partner with the finest brands in the automotive industry";

  const sectionRef = useRef<HTMLDivElement>(null);
  const partnersTrackRef = useRef<HTMLDivElement>(null);
  const servicedTrackRef = useRef<HTMLDivElement>(null);

  // Start true to avoid hydration mismatch flashes
  const [isVisible, setIsVisible] = useState(true);
  const [startAnimation, setStartAnimation] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setStartAnimation(false);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const running = entry.isIntersecting ? "running" : "paused";
          setIsVisible(entry.isIntersecting);
          if (partnersTrackRef.current)
            partnersTrackRef.current.style.animationPlayState = running;
          if (servicedTrackRef.current)
            servicedTrackRef.current.style.animationPlayState = running;
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const hasAnimated = !!items?.length;
  const hasPartners = !!partners?.length;
  if (!hasAnimated && !hasPartners) return null;

  // 3x duplication for a seamless loop
  const brandItems = hasAnimated ? [...items, ...items, ...items] : [];
  const partnerItems = hasPartners ? [...partners, ...partners, ...partners] : [];

  // Calculate proportional duration for serviced brands to match visual speed
  // Both carousels should move at the same pixels-per-second rate
  const partnersDuration = durationSec;
  const servicedDuration = hasAnimated && hasPartners 
    ? durationSec * (items.length / partners.length) 
    : durationSec;

  // Shared card classes (make both carousels identical styling)
  const cardCls =
    "shrink-0 flex items-center justify-center rounded-xl bg-black/10 hover:bg-black/15 " +
    "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/40 " +
    "hover:shadow-lg hover:scale-105 h-28 w-52 md:h-32 md:w-64 p-5 md:p-6";

  const imgCls =
    "max-h-full max-w-full object-contain opacity-90 hover:opacity-100 transition";

  return (
    <section
      ref={sectionRef}
      className={`relative my-12 ${
        isVisible ? "opacity-100" : "opacity-0"
      } transition-opacity duration-700`}
      dir={isRTL ? "rtl" : "ltr"}
      aria-labelledby="partners-title"
    >
      {/* Official Partners */}
      {hasPartners && (
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="relative mb-6">
              <h2
                id="partners-title"
                className={clsx(
                  "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight",
                  isRTL && "font-arabic"
                )}
              >
                {partnersTitle}
              </h2>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" />
            </div>

            <p
              className={clsx(
                "text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto px-4 leading-relaxed font-medium",
                isRTL && "font-arabic"
              )}
            >
              {partnersSubtitle}
            </p>

            <div className="flex justify-center items-center gap-6 mb-6">
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
              <div className="relative">
                <div className="h-3 w-24 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-full shadow-lg" />
                <div className="absolute inset-0 h-3 w-24 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-full animate-pulse opacity-75" />
                <div className="absolute -inset-1 h-5 w-26 bg-gradient-to-r from-red-600/20 via-red-500/20 to-orange-500/20 rounded-full blur-sm" />
              </div>
              <div className="h-px w-20 bg-gradient-to-l from-transparent via-red-500/60 to-transparent" />
            </div>
          </div>

          {/* Partners Carousel — LEFT (or RIGHT in RTL) */}
          <div
            className="relative w-full overflow-hidden"
            style={{
              WebkitMask:
                "linear-gradient(90deg, transparent, black 5%, black 95%, transparent)",
            }}
          >
            <div
              ref={partnersTrackRef}
              className={clsx(
                "scroll-track flex gap-10 md:gap-12 py-6 px-6",
                startAnimation && "is-animating"
              )}
              style={
                {
                  "--sk-duration": `${partnersDuration}s`,
                  "--sk-direction": isRTL ? "marquee-right-rtl" : "marquee-left",
                } as React.CSSProperties
              }
            >
              {partnerItems.map((brand, i) => (
                <a
                  key={`${brand.slug}-${i}`}
                  href={brand.url || "#"}
                  target={brand.url ? "_blank" : undefined}
                  rel={brand.url ? "noopener noreferrer" : undefined}
                  className={cardCls}
                  aria-label={brand.alt?.[locale] || `${brand.name}`}
                >
                  <img
                    src={brand.logoSrc}
                    alt={brand.alt?.[locale] || `${brand.name}`}
                    width={240}
                    height={140}
                    loading="lazy"
                    className={imgCls}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Vehicles We've Protected */}
      {hasAnimated && (
        <div>
          <div className="text-center mb-8">
            <p
              id="serviced-brands-title"
              className={clsx(
                "text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4 leading-relaxed",
                isRTL && "font-arabic"
              )}
            >
              {title}
            </p>
          </div>

          {/* Serviced Brands Carousel — RIGHT (opposite direction, or LEFT in RTL) */}
          <div
            className="relative w-full overflow-hidden"
            style={{
              WebkitMask:
                "linear-gradient(90deg, transparent, black 5%, black 95%, transparent)",
            }}
          >
            <div
              ref={servicedTrackRef}
              className={clsx(
                "scroll-track flex gap-10 md:gap-12 py-6 px-6",
                startAnimation && "is-animating"
              )}
              style={
                {
                  "--sk-duration": `${servicedDuration}s`,
                  "--sk-direction": isRTL ? "marquee-left-rtl" : "marquee-right",
                } as React.CSSProperties
              }
            >
              {brandItems.map((brand, i) => (
                <a
                  key={`${brand.slug}-${i}`}
                  href={brand.url || "#"}
                  target={brand.url ? "_blank" : undefined}
                  rel={brand.url ? "noopener noreferrer" : undefined}
                  className={cardCls}
                  aria-label={brand.alt?.[locale] || `${brand.name}`}
                >
                  <img
                    src={brand.logoSrc}
                    alt={brand.alt?.[locale] || `${brand.name}`}
                    width={240}
                    height={140}
                    loading="lazy"
                    className={imgCls}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
