import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from '../../i18n/react';
import StandardizedHeading from '../shared/StandardizedHeading';
import { TESTIMONIALS, type Testimonial } from '../../data/testimonials';

interface TestimonialsProps {
  currentLocale?: 'en' | 'ar';
}

const Testimonials = ({ currentLocale = 'en' }: TestimonialsProps): JSX.Element => {
  const isArabic = currentLocale === 'ar';
  const t = useTranslations(isArabic ? 'ar' : 'en');

  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);

  // --- Client/runtime guards to avoid hydration mismatches ---
  const [isClient, setIsClient] = useState(false);          // false on SSR; true after mount
  const [screenWidth, setScreenWidth] = useState(0);        // 0 on SSR (we’ll fall back to default lengths)
  const [isVisible, setIsVisible] = useState(false);        // become true via IntersectionObserver
  const [startAnimation, setStartAnimation] = useState(false); // start after mount & slight delay
  const [expandedTestimonials, setExpandedTestimonials] = useState<number[]>([]);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      setScreenWidth(window.innerWidth);
      const handleResize = () => setScreenWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Start animation after a tiny delay (lets layout settle)
  useEffect(() => {
    if (!isClient) return;
    const timer = setTimeout(() => setStartAnimation(true), 120);
    return () => clearTimeout(timer);
  }, [isClient]);

  // Intersection observer to pause when offscreen
  useEffect(() => {
    if (!isClient || !sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsVisible(entry.isIntersecting);
        if (scrollTrackRef.current) {
          scrollTrackRef.current.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
        }
      },
      { threshold: 0.1, rootMargin: '64px' }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isClient]);

  // Hover pause/resume
  useEffect(() => {
    if (!isClient || !scrollContainerRef.current || !scrollTrackRef.current) return;
    const el = scrollContainerRef.current;
    const track = scrollTrackRef.current;
    const onEnter = () => (track.style.animationPlayState = 'paused');
    const onLeave = () => (track.style.animationPlayState = 'running');
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [isClient]);

  const toggleExpand = (id: number) => {
    setExpandedTestimonials((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Content rendering with truncation that’s SSR-safe
  const renderTestimonialContent = (testimonial: Testimonial) => {
    const defaultMaxLength = 150;
    const maxLength = screenWidth === 0 ? defaultMaxLength : screenWidth < 768 ? 120 : 180;
    const isExpanded = expandedTestimonials.includes(testimonial.id);
    const needsTrunc = testimonial.content.length > maxLength;

    return (
      <div className="mb-4">
        <div className="overflow-hidden transition-all duration-500 ease-in-out">
          <p className="text-foreground/90 text-sm sm:text-base mb-4 leading-relaxed">
            {needsTrunc && !isExpanded
              ? `${testimonial.content.substring(0, maxLength)}…`
              : testimonial.content}
          </p>
        </div>
        {needsTrunc && (
          <button
            onClick={() => toggleExpand(testimonial.id)}
            className="text-primary hover:text-primary/90 text-xs sm:text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-md hover:scale-105"
          >
            {isExpanded ? t('testimonials.readLess') : t('testimonials.readMore')}
          </button>
        )}
      </div>
    );
  };


  // Duplicate for seamless loop - need enough copies for continuous scroll
  const duplicateTestimonials = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

  const TestimonialCard = ({
    testimonial,
    index,
  }: {
    testimonial: Testimonial;
    index: number;
  }) => (
    <div
      key={`${testimonial.id}-${index}`}
      className="testimonial-card flex-none min-w-[300px] w-[300px] sm:min-w-[350px] sm:w-[350px] md:min-w-[400px] md:w-[400px] mx-4 opacity-100 transition-opacity duration-700"
    >
      <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-sm border border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-[1.02] hover:border-red-500/60 cursor-pointer h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
        <div className="relative h-full bg-gradient-to-br from-white/5 to-white/2 rounded-2xl">
          <div className="p-8 sm:p-10 h-full flex flex-col relative z-10">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-500' : 'text-neutral-600'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            <div className="absolute top-0 right-0 sm:-top-2 sm:-right-2 text-red-500 opacity-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>

            <div className="flex-grow">{renderTestimonialContent(testimonial)}</div>

            <div className="mt-4 flex items-center">
              <div>
                <h4 className="font-bold text-white text-sm sm:text-base">{testimonial.name}</h4>
                <p className="text-neutral-300 text-xs sm:text-sm">
                  <span className="text-red-400 flex items-center branch-location">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {t('testimonials.location')}: {testimonial.branch}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // SSR placeholder that doesn’t cause layout shift
  if (!isClient) {
    return (
      <section
        className="w-full overflow-hidden opacity-0 h-96"
        aria-labelledby="testimonials-heading"
        dir={isArabic ? 'rtl' : 'ltr'}
      />
    );
  }

  return (
    <section
      ref={sectionRef}
      className={`w-full overflow-hidden ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
      aria-labelledby="testimonials-heading"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="w-full">
        <StandardizedHeading
          title={t('testimonials.subtitle')}
          subtitle={t('testimonials.description')}
          locale={currentLocale}
          size="large"
          className="mb-12 sm:mb-16 md:mb-20 lg:mb-24"
        />

        <div
          ref={scrollContainerRef}
          className="relative w-full overflow-hidden testimonials-container"
          style={{ WebkitMask: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)' }}
        >
          <div
            ref={scrollTrackRef}
            className={`testimonials-track flex ${startAnimation ? 'is-animating' : ''}`}
            style={{
              minWidth: 'max-content',
              '--testimonial-duration': '120s',
              animationDuration: '120s',
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              animationPlayState: startAnimation ? 'running' : 'paused',
              animationName: isArabic ? 'testimonial-scroll-rtl' : 'testimonial-scroll-ltr',
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)'
            } as React.CSSProperties}
          >
            {duplicateTestimonials.map((testimonial, index) => (
              <TestimonialCard key={`t-${testimonial.id}-${index}`} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
