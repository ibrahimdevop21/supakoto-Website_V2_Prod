import React from 'react';
import StandardizedHeading from './StandardizedHeading';

interface CallToActionProps {
  locale?: 'en' | 'ar';
  className?: string;
}

const CallToAction: React.FC<CallToActionProps> = ({ 
  locale = 'en',
  className = '' 
}) => {
  const isRTL = locale === 'ar';

  return (
    <section className={`py-8 sm:py-12 md:py-16 lg:py-20 ${className}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Centered */}
        <StandardizedHeading
          title={locale === 'en' 
            ? 'Ready to Protect Your Vehicle?'
            : 'هل أنت مستعد لحماية مركبتك؟'
          }
          subtitle={locale === 'en'
            ? 'Experience the ultimate protection with our certified Takai PPF technology. Contact us for a free consultation and quote.'
            : 'اختبر الحماية المثلى مع تقنية تاكاي المعتمدة لأفلام حماية الطلاء. اتصل بنا للحصول على استشارة وعرض سعر مجاني.'
          }
          locale={locale}
          size="large"
          className="mb-6 sm:mb-8 md:mb-10"
        />

        {/* CTA Button Container */}
        <div className="relative group max-w-md mx-auto">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/8 via-transparent to-orange-600/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-sm" />
          
          {/* Main CTA Button */}
          <a 
            href={locale === 'en' ? '/contact' : '/ar/contact'}
            className={`group relative overflow-hidden w-full inline-flex items-center justify-center px-8 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-lg sm:text-xl rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-red-500/50 min-h-[56px] touch-manipulation ${isRTL ? 'flex-row-reverse' : ''}`}
            aria-label={locale === 'en' ? 'Book Your Installation' : 'احجز تركيبك'}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 -top-10 -left-10 w-20 h-20 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Calendar icon */}
            <svg className={`relative z-10 w-6 h-6 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${isRTL ? 'ml-3' : 'mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            
            {/* Button text */}
            <span className="relative z-10 font-bold tracking-wide">
              {locale === 'en' ? 'Book Your Installation' : 'احجز تركيبك'}
            </span>
            
            {/* Arrow icon */}
            <svg className={`relative z-10 w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'mr-3 group-hover:-translate-x-1' : 'ml-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M19 12H5m7-7l-7 7 7 7" : "M5 12h14m-7-7l7 7-7 7"} />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
