import React, { useEffect, useRef, useState } from 'react';
import type { Locale, ServicedBrand } from '../../data/servicedBrands';
import { SERVICED_BRANDS } from '../../data/servicedBrands';
import clsx from 'clsx';
import './ModernTrustedBy.css';

interface ServicedBrandStripProps {
  locale: Locale;
  /** Animated strip items (existing list) */
  items?: ServicedBrand[];
  /** Static partners strip (defaults to 4 partners) */
  partners?: ServicedBrand[];
}

const DEFAULT_PARTNERS: ServicedBrand[] = [
  {
    slug: 'skoda',
    name: 'Škoda',
    logoSrc: 'partners/skoda.svg',
    url: 'https://www.skoda-auto.com',
    alt: { en: 'Škoda', ar: 'سكودا' },
  },
  {
    slug: 'citroen',
    name: 'Citroën',
    logoSrc: 'partners/citroen.svg',
    url: 'https://www.citroen.com',
    alt: { en: 'Citroën', ar: 'ستروين' },
  },
  {
    slug: 'jetour',
    name: 'Jetour',
    logoSrc: 'partners/jetour.svg',
    url: 'https://www.jetour.com',
    alt: { en: 'Jetour', ar: 'جيتور' },
  },
  {
    slug: 'samir-rayan',
    name: 'Samir Rayan',
    logoSrc: 'partners/samer.webp',
    url: 'https://samirrayan.com',
    alt: { en: 'Samir Rayan', ar: 'سمير ريان' },
  },
];

export default function ServicedBrandStrip({
  locale,
  items = SERVICED_BRANDS,
  partners = DEFAULT_PARTNERS,
}: ServicedBrandStripProps) {
  const isRTL = locale === 'ar';
  const title = isRTL ? 'السيارات التي خدمناها' : "Vehicles We've Protected";
  const partnersTitle = isRTL ? 'الشركاء الرسميون' : 'Official Partners';
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const partnersTrackRef = useRef<HTMLDivElement>(null);
  const servicedTrackRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set client state and start animation
  useEffect(() => {
    setIsClient(true);
    // Check for reduced motion preference
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mq.matches) {
      setTimeout(() => setStartAnimation(true), 100);
    }
  }, []);

  // Intersection observer for visibility
  useEffect(() => {
    if (!isClient) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (partnersTrackRef.current) {
              partnersTrackRef.current.style.animationPlayState = 'running';
            }
            if (servicedTrackRef.current) {
              servicedTrackRef.current.style.animationPlayState = 'running';
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isClient]);

  const hasAnimated = !!items?.length;
  const hasPartners = !!partners?.length;

  if (!hasAnimated && !hasPartners) return null;

  // Create multiple copies for seamless loop
  const brandItems = hasAnimated ? [...items, ...items, ...items] : [];
  const partnerItems = hasPartners ? [...partners, ...partners, ...partners] : [];

  return (
    <section 
      ref={sectionRef}
      className={`relative my-12 ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
      dir={isRTL ? 'rtl' : 'ltr'} 
      aria-labelledby="partners-title"
    >
      {/* Official Partners Section */}
      {hasPartners && (
        <div className="mb-16">
          {/* Partners Title - Same style as Testimonials main heading */}
          <div className="text-center mb-8">
            <div className="relative">
              <h2 
                id="partners-title"
                className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight ${isRTL ? 'font-arabic' : ''}`}
              >
                {partnersTitle}
              </h2>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
            </div>
            <div className="flex justify-center items-center space-x-4 mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
              <div className="relative">
                <div className="h-2 w-20 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-full"></div>
                <div className="absolute inset-0 h-2 w-20 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-full animate-pulse opacity-75"></div>
              </div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent via-red-500/50 to-transparent"></div>
            </div>
          </div>

          {/* Partners Carousel */}
          <div 
            className="relative w-full overflow-hidden"
            style={{ WebkitMask: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)' }}
          >
            <div 
              ref={partnersTrackRef}
              className={`flex gap-10 md:gap-12 py-6 px-6 ${startAnimation ? 'animate-scroll' : ''}`}
              style={{
                minWidth: 'max-content',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)'
              }}
            >
              {partnerItems.map((brand, index) => (
                <a
                  key={`${brand.slug}-${index}`}
                  href={brand.url || '#'}
                  target={brand.url ? '_blank' : undefined}
                  rel={brand.url ? 'noopener noreferrer' : undefined}
                  className="shrink-0 flex items-center justify-center rounded-xl bg-black/10 hover:bg-black/15 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40 h-24 w-44 md:h-28 md:w-56 p-4 md:p-5"
                  aria-label={brand.alt?.[locale] || `${brand.name}`}
                >
                  <img
                    src={brand.logoSrc}
                    alt={brand.alt?.[locale] || `${brand.name}`}
                    width={200}
                    height={112}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain opacity-90 hover:opacity-100 transition"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Serviced Brands Section */}
      {hasAnimated && (
        <div>
          {/* Serviced Brands Subtitle - Same style as Testimonials subtitle */}
          <div className="text-center mb-8">
            <p 
              id="serviced-brands-title"
              className={`text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4 leading-relaxed ${isRTL ? 'font-arabic' : ''}`}
            >
              {title}
            </p>
          </div>

          {/* Serviced Brands Carousel */}
          <div 
            className="relative w-full overflow-hidden"
            style={{ WebkitMask: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)' }}
          >
            <div 
              ref={servicedTrackRef}
              className={`flex gap-10 md:gap-12 py-6 px-6 ${startAnimation ? 'animate-scroll' : ''}`}
              style={{
                minWidth: 'max-content',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)'
              }}
            >
              {brandItems.map((brand, index) => (
                <a
                  key={`${brand.slug}-${index}`}
                  href={brand.url || '#'}
                  target={brand.url ? '_blank' : undefined}
                  rel={brand.url ? 'noopener noreferrer' : undefined}
                  className="shrink-0 flex items-center justify-center rounded-xl bg-black/10 hover:bg-black/15 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40 h-16 w-32 md:h-20 md:w-40 p-3"
                  aria-label={brand.alt?.[locale] || `${brand.name}`}
                >
                  <img
                    src={brand.logoSrc}
                    alt={brand.alt?.[locale] || `${brand.name}`}
                    width={160}
                    height={80}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain opacity-90 hover:opacity-100 transition"
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
