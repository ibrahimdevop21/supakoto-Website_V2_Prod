import React from 'react';
import { createTranslator } from '../../i18n/index';

interface ServicesHeroProps {
  currentLocale: string;
  isRTL: boolean;
}

const ServicesHero: React.FC<ServicesHeroProps> = ({ currentLocale, isRTL }) => {
  const t = createTranslator(currentLocale as 'en' | 'ar');

  const scrollToTiers = () => {
    const tiersSection = document.querySelector('#tiers');
    if (tiersSection) {
      tiersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`relative min-h-[80vh] flex items-center justify-center ${isRTL ? 'rtl font-arabic' : 'ltr'}`}>
      {/* Background with video/image pattern - reusing existing hero pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-red-500/15 to-orange-500/20 opacity-80"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-orange-500/25 to-red-500/25 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <header>
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white tracking-tight bg-gradient-to-r from-red-400 via-red-300 to-orange-300 bg-clip-text text-transparent ${isRTL ? 'font-arabic' : ''}`}>
            {t('services.hero.title')}
          </h1>
          <p className={`text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto mb-8 leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
            {t('services.hero.subtitle')}
          </p>
          <div className="mt-8">
            <button
              onClick={scrollToTiers}
              data-track="services-hero-cta"
              aria-label={t('services.hero.cta')}
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${isRTL ? 'font-arabic' : ''}`}
            >
              {t('services.hero.cta')}
            </button>
          </div>
        </header>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ServicesHero;
