import React from 'react';

interface CallToActionProps {
  locale?: 'en' | 'ar';
  className?: string;
}

const CallToAction: React.FC<CallToActionProps> = ({ 
  locale = 'en',
  className = '' 
}) => {
  const isRTL = locale === 'ar';

  return (
    <section className={`py-20 md:py-28 lg:py-32 ${className}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Centered */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="relative">
            <h2 
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent mb-6 sm:mb-8 leading-tight ${isRTL ? 'font-arabic' : ''}`}
            >
              {locale === 'en' 
                ? 'Ready to Protect Your Vehicle?'
                : 'هل أنت مستعد لحماية مركبتك؟'
              }
            </h2>
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          </div>
          <p className={`text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
            {locale === 'en'
              ? 'Experience the ultimate protection with our certified Takai PPF technology. Contact us for a free consultation and quote.'
              : 'اختبر الحماية المثلى مع تقنية تاكاي المعتمدة لأفلام حماية الطلاء. اتصل بنا للحصول على استشارة وعرض سعر مجاني.'
            }
          </p>
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
            <div className="relative">
              <div className="h-3 w-24 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-full"></div>
              <div className="absolute inset-0 h-3 w-24 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-full animate-pulse opacity-75"></div>
            </div>
            <div className="h-px w-20 bg-gradient-to-l from-transparent via-red-500/50 to-transparent"></div>
          </div>
        </div>

        {/* CTA Buttons Container */}
        <div className="relative group max-w-2xl mx-auto">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />
          
          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
          
          {/* Inner content container */}
          <div className="relative bg-gradient-to-br from-white/5 to-white/2 rounded-3xl p-8 sm:p-12 border border-white/10 backdrop-blur-sm">
            <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch w-full max-w-lg mx-auto px-4 sm:px-0 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              {/* Call Button - Primary Style */}
              <a 
                href="tel:+971501234567" 
                className={`group relative overflow-hidden flex-1 sm:flex-none sm:min-w-[200px] inline-flex items-center justify-center px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-red-500/50 ${isRTL ? 'flex-row-reverse' : ''}`}
                aria-label={locale === 'en' ? 'Call Now' : 'اتصل الآن'}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -top-10 -left-10 w-20 h-20 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <svg className={`relative z-10 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 transition-transform duration-300 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="relative z-10 font-bold tracking-wide">
                  {locale === 'en' ? 'Call Now' : 'اتصل الآن'}
                </span>
              </a>

              {/* WhatsApp Button - Secondary Style */}
              <a 
                href="https://wa.me/971501234567" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`group flex-1 sm:flex-none sm:min-w-[200px] inline-flex items-center justify-center px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-green-500/50 ${isRTL ? 'flex-row-reverse' : ''}`}
                aria-label={locale === 'en' ? 'WhatsApp' : 'واتساب'}
              >
                <svg className={`relative z-10 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 transition-transform duration-300 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.097"/>
                </svg>
                <span className="relative z-10 font-bold tracking-wide transition-colors duration-300">
                  {locale === 'en' ? 'WhatsApp' : 'واتساب'}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
