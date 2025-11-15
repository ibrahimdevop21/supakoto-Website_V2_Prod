import React, { useState } from 'react';
import { createTranslator } from '../../i18n/index';
import { Shield, Gem, Star, Award } from '../icons/LightweightIcons';
import StandardizedHeading from '../shared/StandardizedHeading';

interface ServiceTiersProps {
  currentLocale: string;
  isRTL: boolean;
}

const ServiceTiers: React.FC<ServiceTiersProps> = ({ currentLocale, isRTL }) => {
  const t = createTranslator(currentLocale as 'en' | 'ar');
  // Removed expandedTier state as we're simplifying the design

  const tiers = [
    {
      id: 'ultimate',
      icon: Award,
      title: t('services.tiers.ultimate.title'),
      description: t('services.tiers.ultimate.description'),
      features: [
        t('services.tiers.ultimate.feature1'),
        t('services.tiers.ultimate.feature2'),
        t('services.tiers.ultimate.feature3')
      ],
      specs: {
        thickness: '9.6 mil',
        stretchability: '400%',
        selfHealing: true,
        uvProtection: true
      }
    },
    {
      id: 'premium',
      icon: Gem,
      title: t('services.tiers.premium.title'),
      description: t('services.tiers.premium.description'),
      features: [
        t('services.tiers.premium.feature1'),
        t('services.tiers.premium.feature2'),
        t('services.tiers.premium.feature3')
      ],
      specs: {
        thickness: '8.5 mil',
        stretchability: '375%',
        selfHealing: true,
        uvProtection: true
      }
    },
    {
      id: 'standard',
      icon: Shield,
      title: t('services.tiers.standard.title'),
      description: t('services.tiers.standard.description'),
      features: [
        t('services.tiers.standard.feature1'),
        t('services.tiers.standard.feature2'),
        t('services.tiers.standard.feature3')
      ],
      specs: {
        thickness: '8.0 mil',
        stretchability: '350%',
        selfHealing: true,
        uvProtection: true
      }
    },
    {
      id: 'essential',
      icon: Star,
      title: t('services.tiers.essential.title'),
      description: t('services.tiers.essential.description'),
      features: [
        t('services.tiers.essential.feature1'),
        t('services.tiers.essential.feature2'),
        t('services.tiers.essential.feature3')
      ],
      specs: {
        thickness: '7.6 mil',
        stretchability: '350%',
        selfHealing: true,
        uvProtection: true
      }
    }
  ];


  return (
    <div className={`${isRTL ? 'rtl font-arabic' : 'ltr'}`}>
      <StandardizedHeading
        title={t('services.tiers.title')}
        subtitle={t('services.tiers.subtitle')}
        locale={currentLocale as 'en' | 'ar'}
        size="medium"
        className="mb-8"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {tiers.map((tier, index) => {
          const IconComponent = tier.icon;
          
          return (
            <div
              key={tier.id}
              className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-slate-500/10 overflow-hidden"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <IconComponent size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold text-white mb-2 group-hover:text-gray-100 transition-colors ${isRTL ? 'font-arabic' : ''}`}>
                      {tier.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className={`text-gray-300 mb-4 leading-relaxed group-hover:text-gray-200 transition-colors ${isRTL ? 'font-arabic' : ''}`}>
                  {tier.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  {tier.features.slice(0, 3).map((feature, featureIndex) => (
                    <div key={featureIndex} className={`flex items-start gap-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors ${isRTL ? 'font-arabic' : ''}`}>
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-red-600 to-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Specs Footer */}
                <div className="text-xs text-gray-500 border-t border-slate-700/30 pt-3 mt-4">
                  <span className={isRTL ? 'font-arabic' : ''}>
                    {tier.specs.stretchability} stretch
                  </span>
                </div>

                {/* Decorative elements */}
                <div className="absolute bottom-4 right-4 flex gap-1">
                  <div className="w-1 h-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <div className="w-1 h-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-300" style={{transitionDelay: '100ms'}}></div>
                  <div className="w-1 h-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" style={{transitionDelay: '200ms'}}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>


    </div>
  );
};

export default ServiceTiers;
