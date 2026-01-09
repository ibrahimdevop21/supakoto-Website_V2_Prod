import React from 'react';
import { createTranslator } from '../../i18n/index';
import { Shield, Award } from '../icons/LightweightIcons';
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
      id: 'gold',
      icon: Shield,
      title: t('services.tiers.gold.title'),
      subtitle: t('services.tiers.gold.subtitle'),
      description: t('services.tiers.gold.description'),
      warranty: t('services.tiers.gold.warranty'),
      specs: [
        t('services.tiers.gold.spec1'),
        t('services.tiers.gold.spec2'),
        t('services.tiers.gold.spec3'),
        t('services.tiers.gold.spec4'),
        t('services.tiers.gold.spec5'),
        t('services.tiers.gold.spec6')
      ],
      useCase: t('services.tiers.gold.useCase')
    },
    {
      id: 'goldPlus',
      icon: Shield,
      title: t('services.tiers.goldPlus.title'),
      subtitle: t('services.tiers.goldPlus.subtitle'),
      description: t('services.tiers.goldPlus.description'),
      warranty: t('services.tiers.goldPlus.warranty'),
      specs: [
        t('services.tiers.goldPlus.spec1'),
        t('services.tiers.goldPlus.spec2'),
        t('services.tiers.goldPlus.spec3'),
        t('services.tiers.goldPlus.spec4'),
        t('services.tiers.goldPlus.spec5'),
        t('services.tiers.goldPlus.spec6')
      ],
      useCase: t('services.tiers.goldPlus.useCase')
    },
    {
      id: 'steel',
      icon: Award,
      title: t('services.tiers.steel.title'),
      subtitle: t('services.tiers.steel.subtitle'),
      description: t('services.tiers.steel.description'),
      warranty: t('services.tiers.steel.warranty'),
      specs: [
        t('services.tiers.steel.spec1'),
        t('services.tiers.steel.spec2'),
        t('services.tiers.steel.spec3'),
        t('services.tiers.steel.spec4'),
        t('services.tiers.steel.spec5'),
        t('services.tiers.steel.spec6')
      ],
      useCase: t('services.tiers.steel.useCase')
    },
    {
      id: 'steelPlus',
      icon: Award,
      title: t('services.tiers.steelPlus.title'),
      subtitle: t('services.tiers.steelPlus.subtitle'),
      description: t('services.tiers.steelPlus.description'),
      warranty: t('services.tiers.steelPlus.warranty'),
      specs: [
        t('services.tiers.steelPlus.spec1'),
        t('services.tiers.steelPlus.spec2'),
        t('services.tiers.steelPlus.spec3'),
        t('services.tiers.steelPlus.spec4'),
        t('services.tiers.steelPlus.spec5'),
        t('services.tiers.steelPlus.spec6')
      ],
      useCase: t('services.tiers.steelPlus.useCase')
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tiers.map((tier) => {
          const IconComponent = tier.icon;
          
          return (
            <div
              key={tier.id}
              className="group relative rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-xl overflow-hidden"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              {/* Subtle hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className={`flex items-start gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <IconComponent size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl md:text-2xl font-bold mb-1 ${isRTL ? 'font-arabic text-right' : 'text-left'}`} style={{color: 'var(--text-primary)'}}>
                      {tier.title}
                    </h3>
                    <p className={`text-sm font-medium ${isRTL ? 'font-arabic text-right' : 'text-left'}`} style={{color: 'var(--text-secondary)'}}>
                      {tier.subtitle}
                    </p>
                  </div>
                </div>

                {/* Warranty Badge */}
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full mb-4 ${isRTL ? 'font-arabic' : ''}`} style={{backgroundColor: 'var(--bg-section)', border: '1px solid var(--border-default)'}}>
                  <span className="text-xs font-semibold" style={{color: 'var(--text-primary)'}}>{tier.warranty}</span>
                </div>

                {/* Description */}
                <p className={`mb-6 leading-relaxed ${isRTL ? 'font-arabic text-right' : 'text-left'}`} style={{color: 'var(--text-secondary)'}}>
                  {tier.description}
                </p>

                {/* Technical Specs */}
                <div className="space-y-2 mb-6">
                  {tier.specs.map((spec, idx) => (
                    <div key={idx} className={`flex items-start gap-3 text-sm ${isRTL ? 'flex-row-reverse font-arabic text-right' : 'text-left'}`}>
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span style={{color: 'var(--text-primary)'}}>{spec}</span>
                    </div>
                  ))}
                </div>

                {/* Use Case */}
                <div className="pt-4" style={{borderTop: '1px solid var(--border-default)'}}>
                  <p className={`text-sm leading-relaxed ${isRTL ? 'font-arabic text-right' : 'text-left'}`} style={{color: 'var(--text-muted)'}}>
                    {tier.useCase}
                  </p>
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
