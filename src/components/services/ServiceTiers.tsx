import React, { useState } from 'react';
import { createTranslator } from '../../i18n/index';
import { Shield, Gem, Star, Award, ChevronDown, ChevronRight } from '../icons/LightweightIcons';

interface ServiceTiersProps {
  currentLocale: string;
  isRTL: boolean;
}

const ServiceTiers: React.FC<ServiceTiersProps> = ({ currentLocale, isRTL }) => {
  const t = createTranslator(currentLocale as 'en' | 'ar');
  const [expandedTier, setExpandedTier] = useState<string | null>(null);

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

  const toggleExpanded = (tierId: string) => {
    setExpandedTier(expandedTier === tierId ? null : tierId);
  };

  const handleQuoteRequest = (tierId: string) => {
    // This would integrate with existing quote flow
    window.open('https://wa.me/966123456789', '_blank');
  };

  return (
    <div className={`${isRTL ? 'rtl font-arabic' : 'ltr'}`}>
      <div className="text-center mb-12">
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-white ${isRTL ? 'font-arabic' : ''}`}>
          {t('services.tiers.title')}
        </h2>
        <p className={`text-lg text-gray-300 max-w-2xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
          {t('services.tiers.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {tiers.map((tier) => {
          const IconComponent = tier.icon;
          const isExpanded = expandedTier === tier.id;
          
          return (
            <div
              key={tier.id}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-red-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10"
            >
              {/* Card Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <IconComponent size={32} className="text-white" />
                </div>
                <h3 className={`text-xl font-semibold text-white mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                  {tier.title}
                </h3>
                <p className={`text-gray-300 text-sm ${isRTL ? 'font-arabic' : ''}`}>
                  {tier.description}
                </p>
              </div>

              {/* Features Preview */}
              <div className="mb-6">
                <ul className="space-y-2">
                  {tier.features.slice(0, 2).map((feature, index) => (
                    <li key={index} className={`text-sm text-gray-300 flex items-start gap-2 ${isRTL ? 'font-arabic' : ''}`}>
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specs Preview */}
              <div className="mb-6 p-3 bg-slate-800/30 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
                    {t('services.specs.thickness')}: <span className="text-white">{tier.specs.thickness}</span>
                  </div>
                  <div className={`text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
                    {t('services.specs.stretch')}: <span className="text-white">{tier.specs.stretchability}</span>
                  </div>
                </div>
              </div>

              {/* Expandable Details */}
              {isExpanded && (
                <div className="mb-6 border-t border-slate-700/50 pt-4 animate-fadeInUp">
                  <div className="space-y-3">
                    <div>
                      <h4 className={`text-sm font-semibold text-white mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                        {t('services.specs.features')}
                      </h4>
                      <ul className="space-y-1">
                        {tier.features.map((feature, index) => (
                          <li key={index} className={`text-xs text-gray-300 flex items-start gap-2 ${isRTL ? 'font-arabic' : ''}`}>
                            <div className="w-1 h-1 bg-red-400 rounded-full mt-1.5 flex-shrink-0"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className={`text-sm font-semibold text-white mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                        {t('services.specs.performance')}
                      </h4>
                      <div className="space-y-1 text-xs text-gray-300">
                        <div className={`flex justify-between ${isRTL ? 'font-arabic' : ''}`}>
                          <span>{t('services.specs.selfHealing')}</span>
                          <span className="text-green-400">✓</span>
                        </div>
                        <div className={`flex justify-between ${isRTL ? 'font-arabic' : ''}`}>
                          <span>{t('services.specs.uvProtection')}</span>
                          <span className="text-green-400">✓</span>
                        </div>
                        <div className={`flex justify-between ${isRTL ? 'font-arabic' : ''}`}>
                          <span>{t('services.specs.antiYellowing')}</span>
                          <span className="text-green-400">✓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => toggleExpanded(tier.id)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg transition-colors ${isRTL ? 'font-arabic' : ''}`}
                >
                  {isExpanded ? t('services.tiers.showLess') : t('services.tiers.learnMore')}
                  {isExpanded ? (
                    <ChevronDown size={16} className={`transform transition-transform ${isRTL ? 'rotate-180' : ''}`} />
                  ) : (
                    <ChevronRight size={16} className={`transform transition-transform ${isRTL ? 'rotate-180' : ''}`} />
                  )}
                </button>
                
                <button
                  onClick={() => handleQuoteRequest(tier.id)}
                  data-track={`services-tier:${tier.id}`}
                  className={`w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 ${isRTL ? 'font-arabic' : ''}`}
                >
                  {t('services.tiers.requestQuote')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceTiers;
