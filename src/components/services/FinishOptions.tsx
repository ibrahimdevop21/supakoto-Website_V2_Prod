import React, { useState } from 'react';
import { createTranslator } from '../../i18n/index';

interface FinishOptionsProps {
  currentLocale: string;
  isRTL: boolean;
}

const FinishOptions: React.FC<FinishOptionsProps> = ({ currentLocale, isRTL }) => {
  const t = createTranslator(currentLocale as 'en' | 'ar');
  const [activeFinish, setActiveFinish] = useState<'gloss' | 'matte'>('gloss');

  const finishOptions = {
    gloss: {
      title: t('services.finishes.gloss.title'),
      description: t('services.finishes.gloss.description'),
      features: [
        t('services.finishes.gloss.feature1'),
        t('services.finishes.gloss.feature2'),
        t('services.finishes.gloss.feature3')
      ],
      image: '/images/gloss-finish.jpg', // Placeholder - would use actual images
      gradient: 'from-blue-600 to-cyan-500'
    },
    matte: {
      title: t('services.finishes.matte.title'),
      description: t('services.finishes.matte.description'),
      features: [
        t('services.finishes.matte.feature1'),
        t('services.finishes.matte.feature2'),
        t('services.finishes.matte.feature3')
      ],
      image: '/images/matte-finish.jpg', // Placeholder - would use actual images
      gradient: 'from-slate-600 to-gray-500'
    }
  };

  return (
    <div className={`${isRTL ? 'rtl font-arabic' : 'ltr'}`}>
      <div className="text-center mb-12">
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-white ${isRTL ? 'font-arabic' : ''}`}>
          {t('services.finishes.title')}
        </h2>
        <p className={`text-lg text-gray-300 max-w-2xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
          {t('services.finishes.subtitle')}
        </p>
      </div>

      {/* Toggle Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full p-1">
          <button
            onClick={() => setActiveFinish('gloss')}
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeFinish === 'gloss'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
            } ${isRTL ? 'font-arabic' : ''}`}
          >
            {t('services.finishes.gloss.title')}
          </button>
          <button
            onClick={() => setActiveFinish('matte')}
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeFinish === 'matte'
                ? 'bg-gradient-to-r from-slate-600 to-gray-500 text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
            } ${isRTL ? 'font-arabic' : ''}`}
          >
            {t('services.finishes.matte.title')}
          </button>
        </div>
      </div>

      {/* Content Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Image Panel */}
        <div className="relative order-2 lg:order-1">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50">
            {/* Placeholder for actual images */}
            <div className={`absolute inset-0 bg-gradient-to-br ${finishOptions[activeFinish].gradient} opacity-20`}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`w-24 h-24 mx-auto mb-4 bg-gradient-to-br ${finishOptions[activeFinish].gradient} rounded-full flex items-center justify-center`}>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <div className={`w-8 h-8 ${activeFinish === 'gloss' ? 'bg-gradient-to-br from-white to-gray-200' : 'bg-gray-400'} rounded-full`}></div>
                  </div>
                </div>
                <p className={`text-gray-300 text-sm ${isRTL ? 'font-arabic' : ''}`}>
                  {t('services.finishes.previewPlaceholder')}
                </p>
              </div>
            </div>
            
            {/* Animated overlay effects */}
            <div className="absolute inset-0 pointer-events-none">
              {activeFinish === 'gloss' && (
                <>
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
                  <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
                </>
              )}
              {activeFinish === 'matte' && (
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-500/5 to-transparent"></div>
              )}
            </div>
          </div>
        </div>

        {/* Content Panel */}
        <div className="order-1 lg:order-2">
          <div className="space-y-6">
            <div>
              <h3 className={`text-2xl font-bold text-white mb-3 ${isRTL ? 'font-arabic' : ''}`}>
                {finishOptions[activeFinish].title}
              </h3>
              <p className={`text-gray-300 text-lg leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
                {finishOptions[activeFinish].description}
              </p>
            </div>

            <div>
              <h4 className={`text-lg font-semibold text-white mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                {t('services.finishes.keyFeatures')}
              </h4>
              <ul className="space-y-3">
                {finishOptions[activeFinish].features.map((feature, index) => (
                  <li key={index} className={`flex items-start gap-3 text-gray-300 ${isRTL ? 'font-arabic' : ''}`}>
                    <div className={`w-2 h-2 bg-gradient-to-r ${finishOptions[activeFinish].gradient} rounded-full mt-2 flex-shrink-0`}></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Comparison highlights */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
              <div className="text-center">
                <div className={`text-2xl font-bold bg-gradient-to-r ${finishOptions[activeFinish].gradient} bg-clip-text text-transparent`}>
                  {activeFinish === 'gloss' ? '95%' : '85%'}
                </div>
                <div className={`text-xs text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
                  {t('services.finishes.clarity')}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold bg-gradient-to-r ${finishOptions[activeFinish].gradient} bg-clip-text text-transparent`}>
                  {activeFinish === 'gloss' ? 'High' : 'Low'}
                </div>
                <div className={`text-xs text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
                  {t('services.finishes.reflection')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinishOptions;
