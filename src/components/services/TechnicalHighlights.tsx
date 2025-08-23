import React, { useState } from 'react';
import { createTranslator } from '../../i18n/index';
import { ChevronDown, ChevronRight } from '../icons/LightweightIcons';

interface TechnicalHighlightsProps {
  currentLocale: string;
  isRTL: boolean;
}

const TechnicalHighlights: React.FC<TechnicalHighlightsProps> = ({ currentLocale, isRTL }) => {
  const t = createTranslator(currentLocale as 'en' | 'ar');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const sections = [
    {
      id: 'material',
      title: t('services.technical.material.title'),
      icon: '🔬',
      items: [
        { label: t('services.technical.material.thickness'), value: '7.6–9.6 mil' },
        { label: t('services.technical.material.stretch'), value: '350–400%' },
        { label: t('services.technical.material.clarity'), value: t('services.technical.material.clarityValue') },
        { label: t('services.technical.material.adhesive'), value: t('services.technical.material.adhesiveValue') }
      ]
    },
    {
      id: 'performance',
      title: t('services.technical.performance.title'),
      icon: '⚡',
      items: [
        { label: t('services.technical.performance.selfHealing'), value: t('services.technical.performance.selfHealingValue') },
        { label: t('services.technical.performance.uvBlocking'), value: '99%+' },
        { label: t('services.technical.performance.irRejection'), value: '95%+' },
        { label: t('services.technical.performance.antiYellowing'), value: t('services.technical.performance.antiYellowingValue') }
      ]
    },
    {
      id: 'craftsmanship',
      title: t('services.technical.craftsmanship.title'),
      icon: '🎯',
      items: [
        { label: t('services.technical.craftsmanship.cutting'), value: t('services.technical.craftsmanship.cuttingValue') },
        { label: t('services.technical.craftsmanship.installation'), value: t('services.technical.craftsmanship.installationValue') },
        { label: t('services.technical.craftsmanship.disassembly'), value: t('services.technical.craftsmanship.disassemblyValue') },
        { label: t('services.technical.craftsmanship.finish'), value: t('services.technical.craftsmanship.finishValue') }
      ]
    },
    {
      id: 'maintenance',
      title: t('services.technical.maintenance.title'),
      icon: '🧽',
      items: [
        { label: t('services.technical.maintenance.washing'), value: t('services.technical.maintenance.washingValue') },
        { label: t('services.technical.maintenance.frequency'), value: t('services.technical.maintenance.frequencyValue') },
        { label: t('services.technical.maintenance.products'), value: t('services.technical.maintenance.productsValue') },
        { label: t('services.technical.maintenance.inspection'), value: t('services.technical.maintenance.inspectionValue') }
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className={`${isRTL ? 'rtl font-arabic' : 'ltr'}`}>
      <div className="text-center mb-12">
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-white ${isRTL ? 'font-arabic' : ''}`}>
          {t('services.technical.title')}
        </h2>
        <p className={`text-lg text-gray-300 max-w-2xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
          {t('services.technical.subtitle')}
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {sections.map((section) => {
          const isExpanded = expandedSection === section.id;
          
          return (
            <div
              key={section.id}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/50 transition-all duration-300"
            >
              {/* Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{section.icon}</span>
                  <h3 className={`text-lg font-semibold text-white ${isRTL ? 'font-arabic' : ''}`}>
                    {section.title}
                  </h3>
                </div>
                <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} ${isRTL ? 'rotate-180' : ''}`}>
                  <ChevronDown size={20} className="text-gray-400" />
                </div>
              </button>

              {/* Expandable Content */}
              {isExpanded && (
                <div className="px-6 pb-6 animate-fadeInUp">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg border border-slate-700/30"
                      >
                        <span className={`text-gray-300 text-sm ${isRTL ? 'font-arabic' : ''}`}>
                          {item.label}
                        </span>
                        <span className={`text-white font-semibold text-sm ${isRTL ? 'font-arabic' : ''}`}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="mt-8 text-center">
        <p className={`text-xs text-gray-400 max-w-2xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
          {t('services.technical.disclaimer')}
        </p>
      </div>
    </div>
  );
};

export default TechnicalHighlights;
