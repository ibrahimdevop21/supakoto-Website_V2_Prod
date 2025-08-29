import React from 'react';
import { createTranslator } from '../../i18n/index';

interface ServicesCTAProps {
  currentLocale: string;
  isRTL: boolean;
}

const ServicesCTA: React.FC<ServicesCTAProps> = ({ currentLocale, isRTL }) => {
  const t = createTranslator(currentLocale as 'en' | 'ar');

  const handleBookInstallation = () => {
    // Navigate to contact page based on locale
    window.location.href = currentLocale === 'ar' ? '/ar/contact' : '/contact';
  };

  return (
    <div className={`py-8 sm:py-12 md:py-16 ${isRTL ? 'rtl font-arabic' : 'ltr'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl border border-slate-700/30 bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/80 shadow-xl backdrop-blur-sm p-6 sm:p-8 md:p-12 text-center overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-orange-600/5 rounded-2xl sm:rounded-3xl"></div>
          
          <div className="relative z-10">
            {/* Main Headline - More compact */}
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white tracking-tight bg-gradient-to-r from-[#bf1e2e] via-red-500 to-[#bf1e2e] bg-clip-text text-transparent ${isRTL ? 'font-arabic' : ''}`}>
              {t('services.cta.title')}
            </h2>
            
            <p className={`text-base sm:text-lg text-gray-300 max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
              {t('services.cta.subtitle')}
            </p>
            
            {/* Main CTA Button - Properly Sized */}
            <div className="flex justify-center mb-8">
              <button
                onClick={handleBookInstallation}
                data-track="services-bottom-cta"
                className={`group relative overflow-hidden inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-[#bf1e2e] to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-500/50 min-h-[48px] touch-manipulation gap-2.5 ${isRTL ? 'font-arabic flex-row-reverse' : ''}`}
              >
                {/* Subtle shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                
                {/* Calendar icon */}
                <svg className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                
                <span className="font-semibold">{t('services.cta.bookInstallation')}</span>
                
                {/* Arrow icon */}
                <svg className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 ${isRTL ? 'group-hover:-translate-x-0.5 rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Trust Elements - Clean Badge Style */}
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                <span className={`text-emerald-200 font-medium ${isRTL ? 'font-arabic' : ''}`}>{t('services.cta.freeConsultation')}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className={`text-blue-200 font-medium ${isRTL ? 'font-arabic' : ''}`}>{t('services.cta.expertInstallation')}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                <div className="w-2 h-2 bg-violet-500 rounded-full flex-shrink-0"></div>
                <span className={`text-violet-200 font-medium ${isRTL ? 'font-arabic' : ''}`}>{t('services.cta.warrantyIncluded')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesCTA;
