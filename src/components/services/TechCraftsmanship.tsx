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
      <div className="text-center mb-12">
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-white ${isRTL ? 'font-arabic' : ''}`}>
          {t('services.tech.title')}
        </h2>
        <p className={`text-lg text-gray-300 max-w-2xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
          {t('services.tech.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((benefit, index) => {
          const IconComponent = benefit.icon;
          
          return (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-slate-500/10 hover:transform hover:scale-105"
            >
              {/* Background gradient effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${benefit.gradient} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent size={32} className="text-white" />
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className={`text-lg font-semibold text-white mb-3 group-hover:text-gray-100 transition-colors ${isRTL ? 'font-arabic' : ''}`}>
                    {benefit.title}
                  </h3>
                  <p className={`text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors ${isRTL ? 'font-arabic' : ''}`}>
                    {benefit.description}
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-br from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-gradient-to-br from-white/30 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{transitionDelay: '100ms'}}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional trust elements */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-4 px-6 py-3 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-full">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className={`text-sm text-gray-300 ${isRTL ? 'font-arabic' : ''}`}>
              {t('services.tech.certified')}
            </span>
          </div>
          <div className="w-px h-4 bg-slate-600"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            <span className={`text-sm text-gray-300 ${isRTL ? 'font-arabic' : ''}`}>
              {t('services.tech.professional')}
            </span>
          </div>
          <div className="w-px h-4 bg-slate-600"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
            <span className={`text-sm text-gray-300 ${isRTL ? 'font-arabic' : ''}`}>
              {t('services.tech.guaranteed')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechCraftsmanship;
