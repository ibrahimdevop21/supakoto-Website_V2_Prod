import React from 'react';
import { createTranslator } from '../../i18n/index';
import { Shield, Wand2, Gem, Award } from '../icons/LightweightIcons';

interface TechCraftsmanshipProps {
  currentLocale: string;
  isRTL: boolean;
}

const TechCraftsmanship: React.FC<TechCraftsmanshipProps> = ({ currentLocale, isRTL }) => {
  const t = createTranslator(currentLocale as 'en' | 'ar');

  const benefits = [
    {
      icon: Shield,
      title: t('services.tech.takai.title'),
      description: t('services.tech.takai.description'),
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Wand2,
      title: t('services.tech.precision.title'),
      description: t('services.tech.precision.description'),
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Gem,
      title: t('services.tech.nano.title'),
      description: t('services.tech.nano.description'),
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Award,
      title: t('services.tech.warranty.title'),
      description: t('services.tech.warranty.description'),
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className={`${isRTL ? 'rtl font-arabic' : 'ltr'}`}>
      <div className="text-center mb-8 sm:mb-10 md:mb-12">
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white ${isRTL ? 'font-arabic' : ''}`}>
          {t('services.tech.title')}
        </h2>
        <p className={`text-base sm:text-lg text-gray-300 max-w-xl mx-auto px-4 sm:px-0 ${isRTL ? 'font-arabic' : ''}`}>
          {t('services.tech.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {benefits.map((benefit, index) => {
          const IconComponent = benefit.icon;
          
          return (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/40 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 hover:border-slate-600/50 transition-all duration-200 hover:shadow-lg hover:shadow-slate-500/5"
            >
              {/* Subtle background gradient effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-5 rounded-xl sm:rounded-2xl transition-opacity duration-200`}></div>
              
              <div className="relative z-10">
                {/* Icon - Mobile Optimized */}
                <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br ${benefit.gradient} rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
                  <IconComponent size={24} className="text-white sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </div>

                {/* Content - Mobile Optimized */}
                <div className="text-center">
                  <h3 className={`text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3 group-hover:text-gray-100 transition-colors ${isRTL ? 'font-arabic' : ''}`}>
                    {benefit.title}
                  </h3>
                  <p className={`text-gray-300 text-sm sm:text-sm leading-relaxed group-hover:text-gray-200 transition-colors ${isRTL ? 'font-arabic' : ''}`}>
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional trust elements - Mobile Friendly */}
      <div className="mt-8 sm:mt-10 md:mt-12 text-center">
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 px-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className={`text-xs sm:text-sm text-green-200 font-medium ${isRTL ? 'font-arabic' : ''}`}>
              {t('services.tech.certified')}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            <span className={`text-xs sm:text-sm text-blue-200 font-medium ${isRTL ? 'font-arabic' : ''}`}>
              {t('services.tech.professional')}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
            <span className={`text-xs sm:text-sm text-purple-200 font-medium ${isRTL ? 'font-arabic' : ''}`}>
              {t('services.tech.guaranteed')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechCraftsmanship;
