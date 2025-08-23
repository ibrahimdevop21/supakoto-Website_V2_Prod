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
    <div className={`relative overflow-hidden ${isRTL ? 'rtl font-arabic' : 'ltr'}`}>
      {/* Background with subtle motion */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-red-500/15 to-orange-500/20 opacity-80"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-orange-500/25 to-red-500/25 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl p-10 md:p-16 text-center shadow-2xl bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-sm border border-slate-700/50 overflow-hidden">
            {/* Glowing background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-red-500/15 to-orange-500/20 opacity-80"></div>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-orange-500/25 to-red-500/25 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            
            <div className="relative z-10">
              {/* Main Headline */}
              <div className="relative mb-8">
                <h2 className={`text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight bg-gradient-to-r from-red-400 via-red-300 to-orange-300 bg-clip-text text-transparent ${isRTL ? 'font-arabic' : ''}`}>
                  {t('services.cta.title')}
                </h2>
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
              </div>
              
              <p className={`text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
                {t('services.cta.subtitle')}
              </p>
              
              {/* Decorative Elements */}
              <div className="flex justify-center items-center space-x-4 mb-8">
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-red-400/50 to-transparent"></div>
                <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse"></div>
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-red-400/50 to-transparent"></div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleBookInstallation}
                  data-track="services-bottom-cta"
                  className={`group px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 ${isRTL ? 'font-arabic' : ''}`}
                >
                  <span>{t('services.cta.bookInstallation')}</span>
                  <div className="w-2 h-2 bg-white/30 rounded-full group-hover:bg-white/50 transition-colors"></div>
                </button>
                
                <button
                  onClick={handleRequestQuote}
                  data-track="services-bottom-cta"
                  className={`group px-8 py-4 bg-transparent border-2 border-red-500 hover:bg-red-500/10 text-red-400 hover:text-red-300 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 ${isRTL ? 'font-arabic' : ''}`}
                >
                  <Phone size={20} className="group-hover:scale-110 transition-transform" />
                  <span>{t('services.cta.requestQuote')}</span>
                </button>
              </div>

              {/* Additional Trust Elements */}
              <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className={isRTL ? 'font-arabic' : ''}>{t('services.cta.freeConsultation')}</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-gray-600"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <span className={isRTL ? 'font-arabic' : ''}>{t('services.cta.expertInstallation')}</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-gray-600"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                  <span className={isRTL ? 'font-arabic' : ''}>{t('services.cta.warrantyIncluded')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesCTA;
