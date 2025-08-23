import React from 'react';
import { createTranslator } from '../../i18n/index';
import { Clock, Shield, Zap, Gem } from '../icons/LightweightIcons';

interface LifestyleUseCasesProps {
  currentLocale: string;
  isRTL: boolean;
}

const LifestyleUseCases: React.FC<LifestyleUseCasesProps> = ({ currentLocale, isRTL }) => {
  const t = createTranslator(currentLocale as 'en' | 'ar');

  const useCases = [
    {
      icon: Clock,
      title: t('services.lifestyle.longTerm.title'),
      description: t('services.lifestyle.longTerm.description'),
      benefits: [
        t('services.lifestyle.longTerm.benefit1'),
        t('services.lifestyle.longTerm.benefit2')
      ],
      gradient: 'from-green-500 to-emerald-500',
      bgPattern: 'bg-green-500/10'
    },
    {
      icon: Shield,
      title: t('services.lifestyle.harsh.title'),
      description: t('services.lifestyle.harsh.description'),
      benefits: [
        t('services.lifestyle.harsh.benefit1'),
        t('services.lifestyle.harsh.benefit2')
      ],
      gradient: 'from-orange-500 to-red-500',
      bgPattern: 'bg-orange-500/10'
    },
    {
      icon: Zap,
      title: t('services.lifestyle.performance.title'),
      description: t('services.lifestyle.performance.description'),
      benefits: [
        t('services.lifestyle.performance.benefit1'),
        t('services.lifestyle.performance.benefit2')
      ],
      gradient: 'from-blue-500 to-cyan-500',
      bgPattern: 'bg-blue-500/10'
    },
    {
      icon: Gem,
      title: t('services.lifestyle.luxury.title'),
      description: t('services.lifestyle.luxury.description'),
      benefits: [
        t('services.lifestyle.luxury.benefit1'),
        t('services.lifestyle.luxury.benefit2')
      ],
      gradient: 'from-purple-500 to-pink-500',
      bgPattern: 'bg-purple-500/10'
    }
  ];

  return (
    <div className={`${isRTL ? 'rtl font-arabic' : 'ltr'}`}>
      <div className="text-center mb-12">
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-white ${isRTL ? 'font-arabic' : ''}`}>
          {t('services.lifestyle.title')}
        </h2>
        <p className={`text-lg text-gray-300 max-w-2xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
          {t('services.lifestyle.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {useCases.map((useCase, index) => {
          const IconComponent = useCase.icon;
          
          return (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-slate-500/10 overflow-hidden"
            >
              {/* Background pattern */}
              <div className={`absolute inset-0 ${useCase.bgPattern} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${useCase.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                    <IconComponent size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold text-white mb-2 group-hover:text-gray-100 transition-colors ${isRTL ? 'font-arabic' : ''}`}>
                      {useCase.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className={`text-gray-300 mb-4 leading-relaxed group-hover:text-gray-200 transition-colors ${isRTL ? 'font-arabic' : ''}`}>
                  {useCase.description}
                </p>

                {/* Benefits */}
                <div className="space-y-2">
                  {useCase.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className={`flex items-start gap-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors ${isRTL ? 'font-arabic' : ''}`}>
                      <div className={`w-1.5 h-1.5 bg-gradient-to-r ${useCase.gradient} rounded-full mt-2 flex-shrink-0`}></div>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Decorative elements */}
                <div className="absolute bottom-4 right-4 flex gap-1">
                  <div className={`w-1 h-1 bg-gradient-to-r ${useCase.gradient} rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-300`}></div>
                  <div className={`w-1 h-1 bg-gradient-to-r ${useCase.gradient} rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-300`} style={{transitionDelay: '100ms'}}></div>
                  <div className={`w-1 h-1 bg-gradient-to-r ${useCase.gradient} rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300`} style={{transitionDelay: '200ms'}}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA hint */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-full">
          <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse"></div>
          <span className={`text-sm text-gray-300 ${isRTL ? 'font-arabic' : ''}`}>
            {t('services.lifestyle.cta')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LifestyleUseCases;
