import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from '../../i18n/react';
import StandardizedHeading from '../shared/StandardizedHeading';

interface Testimonial {
  id: number;
  name: string;
  branch: string;
  content: string;
  rating: number;
}

interface TestimonialsProps {
  currentLocale?: 'en' | 'ar';
}

const Testimonials = ({ currentLocale = 'en' }: TestimonialsProps): JSX.Element => {
  // Ensure we have a consistent boolean for Arabic detection
  const isArabic = currentLocale === 'ar';
  const t = useTranslations(isArabic ? 'ar' : 'en');
  
  // Debug logging to help identify issues
  console.log('Testimonials component:', { currentLocale, isArabic });
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [expandedTestimonials, setExpandedTestimonials] = useState<number[]>([]);
  const [screenWidth, setScreenWidth] = useState(1024); // Start with desktop width to prevent hydration mismatch
  const [isVisible, setIsVisible] = useState(true); // Start true to prevent hydration mismatch
  const [startAnimation, setStartAnimation] = useState(true); // Start true for immediate visibility
  const [isClient, setIsClient] = useState(true); // Start true to prevent hydration mismatch

  // Function to toggle expanded state of a testimonial
  const toggleExpand = (id: number) => {
    setExpandedTestimonials(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Client-side only effects
  useEffect(() => {
    // Double-check we're on client and setup responsive behavior
    if (typeof window === 'undefined') return;
    
    // Set actual screen width
    setScreenWidth(window.innerWidth);
    
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty dependency array for single setup

  // Enhanced testimonial content with read more/less toggle
  const renderTestimonialContent = (testimonial: Testimonial) => {
    // Default truncation length for server-side rendering
    const defaultMaxLength = 150;
    // Use screenWidth only on client-side
    const maxLength = screenWidth === 0 ? defaultMaxLength : (screenWidth < 768 ? 120 : 180);
    const isExpanded = expandedTestimonials.includes(testimonial.id);
    const needsTruncation = testimonial.content.length > maxLength;
    
    return (
      <div className="mb-4">
        <div className="overflow-hidden transition-all duration-500 ease-in-out">
          <p className="text-foreground/90 text-sm sm:text-base mb-4 leading-relaxed">
            {needsTruncation && !isExpanded ? `${testimonial.content.substring(0, maxLength)}...` : testimonial.content}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {needsTruncation && (
            <button
              onClick={() => toggleExpand(testimonial.id)}
              className="text-primary hover:text-primary/90 text-xs sm:text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded-md transition-all duration-300 hover:scale-105"
            >
              {isExpanded ? t('testimonials.readLess') : t('testimonials.readMore')}
            </button>
          )}
        </div>
      </div>
    );
  };

  // Sample testimonial data
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Michaelangelo D\'Sa',
      branch: 'Dubai Al Quoz',
      content: "I had done a month of research, which included reading about PPF and the options I had here in Dubai. I even visited the 3 companies shortlisted for the job. I decided to use Supakoto purely due to the fact that Japan quality goes without question, and moreover, I managed to get the Ramadan deal that was on offer. This also included complete window tinting. After meeting up with Mr Hisham, I was convinced that I would not be disappointed. On the day I received my 2025 Lexus nx350h from the showroom, I drove directly to Al quoz and handed my car to Mr Hisham. It took almost a week, but the final outcome was nice.",
      rating: 5,
    },
    {
      id: 2,
      name: 'Mahmoud Fathy',
      branch: 'Al Sheikh Zayed',
      content: "انا سعيد بتجربتي مع سوباكوتو … ان شاءالله تتكرر في السيارات القادمة … مستوى عالي من الاحترافية والمهنية في التعامل و الدقة في المواعيد والاسعار مناسبة جدا وكذلك المصداقية في المنتج من خلال التاكيد على انه اصلي بالسريال من الشركة المصنعة و كذلك المتابعة وخدمة ما بعد البيع …. كل شئ كان ممتازت",
      rating: 5
    },
    {
      id: 3,
      name: 'Ahmed Ali',
      branch: 'Maadi, Inside Skoda Center',
      content: "I recently had a protection Film for 2 Cars in New Cairo Branch.They really have an excellent Professional Team and a very good customer service. A very good after sale follow up. I am very satisfied with their provided service. A big thank you to Mr Mohamed - The Branch Manager for handling all the issues.",
      rating: 5,
    },
    {
      id: 4,
      name: 'Alber Wadea',
      branch: 'Al Sheikh Zayed',
      content: "I recently had a PPF installed on my vehicle, and I couldn't be more impressed with the quality of service and the final result. From start to finish, the team demonstrated top-tier professionalism, attention to detail, and deep product knowledge. The consultation was clear and informative—they explained the different film options, coverage areas, and long-term benefits, helping me choose the best package for my needs. The installation itself was meticulous. The film was applied seamlessly, with no bubbles, visible edges, or imperfections. You can barely tell it's there, but the protection is immediately noticeable. What truly stood out was the pride the team took in their work. They treated my car with care as if it were their own. I was also impressed with the turnaround time and the follow-up instructions to ensure the film cures properly.",
      rating: 5
    },
    {
      id: 5,
      name: 'Amel Fathy',
      branch: 'Maadi, Inside Skoda Center',
      content: "I had a protection film as well as internal protection 3 months ago. I was really impressed by the quality of the products and the professionality of the staff.The results were outstanding. And what is really special is their after sale follow up every now and then to check on the film and if I have any comments ❤️comments ❤️ To sum up, I am totally satisfied with the service and I highly recommend them to everyone.",
      rating: 5
    },
    {
      id: 6,
      name: 'Mohamed Samy',
      branch: 'New Cairo, 5th Settlement',
      content: "من أحسن التجارب اللي مريت بيها بصراحة بعد مقارنة بين كذا شركة. اخترت شركة Supa Koto بناءً على ترشيحات كتير وفعلاً كانوا قد التوقعات. فريق العمل محترم جدًا وملتزم من أول ما تواصلت معاهم لحد ما استلمت العربية، كل حاجة كانت ماشية بسلاسة ومنظمة جدًا. خامات ممتازة حسيت إني واخد قيمة حقيقية مقابل اللي دفعتُه. الأستاذ محمد سويلم قمة في الذوق والرُقي وخلاني مرتاح جدًا في التعامل معاهم. استلمت العربية قبل الميعاد وده خلاني أحترمهم أكتر. تجربة محترمة وأنصح أي حد بيهم.",
      rating: 5
    },
  ];

  // Control continuous scrolling animation - client-side only
  useEffect(() => {
    // Double-check we're on client
    if (typeof window === 'undefined') return;
    if (!startAnimation) return;
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (scrollTrackRef.current) {
        // Calculate track width to adjust animation speed properly based on content
        const trackWidth = scrollTrackRef.current.scrollWidth;
        const containerWidth = scrollContainerRef.current?.clientWidth || 800;
        
        // Calculate optimal duration based on content amount
        const duration = 40;
        const optimalDuration = Math.max(duration, trackWidth / containerWidth * 20);
        
        // Use the same animation approach as other components
        // Add the animate-scroll class which handles RTL automatically via CSS
        scrollTrackRef.current.classList.add('animate-scroll');
        
        // Override duration if needed
        if (optimalDuration !== 40) {
          scrollTrackRef.current.style.animationDuration = `${optimalDuration}s`;
        }
      }
      
      // Optional: add event listener to pause on hover if desired
      const scrollContainer = scrollContainerRef.current;
      const scrollTrack = scrollTrackRef.current;
      
      if (scrollContainer && scrollTrack) {
        const handleMouseEnter = () => {
          scrollTrack.style.animationPlayState = 'paused';
        };
        
        const handleMouseLeave = () => {
          scrollTrack.style.animationPlayState = 'running';
        };
        
        scrollContainer.addEventListener('mouseenter', handleMouseEnter);
        scrollContainer.addEventListener('mouseleave', handleMouseLeave);
        
        return () => {
          scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
          scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
        };
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array for single setup
  
  // Intersection observer for visibility and performance - client-side only
  useEffect(() => {
    // Double-check we're on client
    if (typeof window === 'undefined') return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (scrollTrackRef.current) {
              scrollTrackRef.current.style.animationPlayState = 'running';
            }
          } else {
            // Pause animations when not visible for performance
            if (scrollTrackRef.current) {
              scrollTrackRef.current.style.animationPlayState = 'paused';
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []); // Empty dependency array for single setup

  // Create 3 sets of testimonials for continuous loop effect
  const duplicateTestimonials = [...testimonials, ...testimonials, ...testimonials];

  // Create testimonial card component for reuse
  const TestimonialCard = ({ testimonial, index }: { testimonial: Testimonial, index: number }) => (
    <div 
      key={`${testimonial.id}-${index}`} 
      className={`testimonial-card flex-none min-w-[300px] w-[300px] sm:min-w-[350px] sm:w-[350px] md:min-w-[400px] md:w-[400px] mx-4 opacity-100 transition-opacity duration-700`}
    >
      <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-sm border border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-[1.02] hover:border-red-500/60 cursor-pointer h-full">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
        
        {/* Inner content container */}
        <div className="relative h-full bg-gradient-to-br from-white/5 to-white/2 rounded-2xl">
          {/* Testimonial Card */}
          <div className="p-8 sm:p-10 h-full flex flex-col relative z-10">
          {/* Rating stars */}
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
          
          {/* Quote mark */}
          <div className="absolute top-0 right-0 sm:-top-2 sm:-right-2 text-red-500 opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>
          
          {/* Testimonial text */}
          <div className="flex-grow">
            {renderTestimonialContent(testimonial)}
          </div>
          
          {/* Client info */}
          <div className="mt-4 flex items-center">

            <div>
              <h4 className="font-bold text-white text-sm sm:text-base">
                {testimonial.name}
              </h4>
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
  
  // Don't render until client-side to prevent hydration mismatch
  if (!isClient) {
    return (
      <section 
        className="w-full overflow-hidden opacity-0 h-96"
        aria-labelledby="testimonials-heading"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Placeholder during SSR */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading testimonials...</div>
        </div>
      </section>
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
        {/* Section Header */}
        <StandardizedHeading
          title={t('testimonials.subtitle')}
          subtitle={t('testimonials.description')}
          locale={currentLocale}
          size="large"
          className="mb-12 sm:mb-16 md:mb-20 lg:mb-24"
        />
        
        {/* Continuous Scrolling Testimonials */}
        <div 
          ref={scrollContainerRef}
          className="relative w-full overflow-hidden testimonials-container"
          style={{ WebkitMask: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)' }}
        >
          <div 
            ref={scrollTrackRef} 
            className={`testimonials-track flex ${startAnimation ? 'animate-scroll' : ''}`}
            style={{
              // Ensure the track is wide enough for all items
              minWidth: 'max-content',
            }}
          >
            {duplicateTestimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={`testimonial-${testimonial.id}-${index}`} 
                testimonial={testimonial} 
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
