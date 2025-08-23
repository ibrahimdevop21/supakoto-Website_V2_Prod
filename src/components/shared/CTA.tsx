import React from 'react';

interface CTAProps {
  currentLocale: string;
  isRTL: boolean;
  contactUrl: string;
}

const CTA: React.FC<CTAProps> = ({ currentLocale, isRTL, contactUrl }) => {
  const isArabic = currentLocale === 'ar';

  const headline = {
    en: 'Ready for the Ultimate Protection?',
    ar: 'هل أنت مستعد للحماية القصوى؟',
  };

  const subheadline = {
    en: 'Let our experts provide a free, no-obligation quote for your vehicle. Elevate your ride today.',
    ar: 'دع خبرائنا يقدمون عرض أسعار مجانيًا وغير ملزم لسيارتك. ارتقِ بسيارتك اليوم.',
  };

  const buttonText = {
    en: 'Get a Free Quote',
    ar: 'احصل على عرض أسعار مجاني',
  };

  return (
    <div className={`py-16 md:py-24 my-16 ${isArabic ? 'rtl font-arabic' : 'ltr'} relative overflow-hidden`}>
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl p-10 md:p-16 text-center shadow-2xl animate-fadeInUp bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-sm border border-slate-700/50 overflow-hidden">
          {/* Glowing background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-red-500/15 to-orange-500/20 opacity-80"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-orange-500/25 to-red-500/25 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          
          <div className="relative z-10">
            <div className="relative">
              <h2 className={`text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight bg-gradient-to-r from-red-400 via-red-300 to-orange-300 bg-clip-text text-transparent ${isArabic ? 'font-arabic' : ''}`}>
                {headline[isArabic ? 'ar' : 'en']}
              </h2>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
            </div>
            
            <p className={`text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed ${isArabic ? 'font-arabic' : ''}`}>
              {subheadline[isArabic ? 'ar' : 'en']}
            </p>
            
            {/* Decorative Elements */}
            <div className="flex justify-center items-center space-x-4 mb-8">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-red-400/50 to-transparent"></div>
              <div className="relative">
                <div className="h-1.5 w-16 bg-gradient-to-r from-red-500 via-red-400 to-orange-400 rounded-full"></div>
                <div className="absolute inset-0 h-1.5 w-16 bg-gradient-to-r from-red-500 via-red-400 to-orange-400 rounded-full animate-pulse opacity-75"></div>
              </div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent via-red-400/50 to-transparent"></div>
            </div>
            
            <a
              href={contactUrl}
              className="group inline-block bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white font-bold text-lg px-10 py-4 rounded-full transition-all duration-500 ease-in-out transform hover:scale-110 hover:shadow-2xl hover:shadow-red-500/25 shadow-lg relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10">{buttonText[isArabic ? 'ar' : 'en']}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;
