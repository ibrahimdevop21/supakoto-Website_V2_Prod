import React from 'react';
import { createTranslator } from '../../i18n/index';
import { Phone } from '../icons/LightweightIcons';

interface ServicesCTAProps {
  currentLocale: string;
  isRTL: boolean;
}

const ServicesCTA: React.FC<ServicesCTAProps> = ({ currentLocale, isRTL }) => {
  const t = createTranslator(currentLocale as 'en' | 'ar');

  const handleBookInstallation = () => {
    // This would integrate with existing booking flow
    window.location.href = '/contact';
  };

  const handleRequestQuote = () => {
    // This would integrate with existing quote flow / WhatsApp
    window.open('https://wa.me/966123456789', '_blank');
  };

  return (
    <div className={`py-12 md:py-16 ${isRTL ? 'rtl font-arabic' : 'ltr'}`}>
      <div className="container mx-auto px-4">
        <div className="relative rounded-2xl border border-slate-700/60 bg-slate-900/70 shadow-2xl backdrop-blur supports-[backdrop-filter]:backdrop-blur-xl p-10 md:p-16 text-center overflow-hidden">
          {/* Clean subtle background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/2 rounded-2xl"></div>
          
          <div className="relative z-10">
            {/* Main Headline */}
            <div className="relative mb-8">
              <h2 className={`text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight bg-gradient-to-r from-[#bf1e2e] via-orange-400 to-[#bf1e2e] bg-clip-text text-transparent ${isRTL ? 'font-arabic' : ''}`}>
                {t('services.cta.title')}
              </h2>
            </div>
            
            <p className={`text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
              {t('services.cta.subtitle')}
            </p>
            
            {/* Decorative Elements */}
            <div className="flex justify-center items-center space-x-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-slate-400/50 to-transparent"></div>
              <div className="w-2 h-2 bg-[#bf1e2e] rounded-full"></div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-slate-400/50 to-transparent"></div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleBookInstallation}
                data-track="services-bottom-cta"
                className={`group px-8 py-4 bg-[#bf1e2e] hover:bg-[#a01a26] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 ${isRTL ? 'font-arabic' : ''}`}
              >
                <span>{t('services.cta.bookInstallation')}</span>
                <div className="w-2 h-2 bg-white/40 rounded-full group-hover:bg-white/60 transition-colors"></div>
              </button>
              
              <button
                onClick={handleRequestQuote}
                data-track="services-bottom-cta"
                className={`group px-8 py-4 bg-transparent border-2 border-slate-600 hover:border-slate-500 hover:bg-slate-800/50 text-slate-300 hover:text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 ${isRTL ? 'font-arabic' : ''}`}
              >
                <Phone size={20} className="group-hover:scale-110 transition-transform" />
                <span>{t('services.cta.requestQuote')}</span>
              </button>
            </div>

            {/* Additional Trust Elements */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-slate-300">
              <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div className="w-3 h-3 bg-emerald-500 rounded-full flex-shrink-0"></div>
                <span className={`font-medium ${isRTL ? 'font-arabic' : ''}`}>{t('services.cta.freeConsultation')}</span>
              </div>
              <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className={`font-medium ${isRTL ? 'font-arabic' : ''}`}>{t('services.cta.expertInstallation')}</span>
              </div>
              <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div className="w-3 h-3 bg-violet-500 rounded-full flex-shrink-0"></div>
                <span className={`font-medium ${isRTL ? 'font-arabic' : ''}`}>{t('services.cta.warrantyIncluded')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesCTA;
