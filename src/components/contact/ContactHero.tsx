import React from 'react';

interface ContactHeroProps {
  currentLocale: string;
  isRTL: boolean;
}

const ContactHero: React.FC<ContactHeroProps> = ({ currentLocale, isRTL }) => {
  const isArabic = currentLocale === 'ar';

  const title = {
    en: 'Get in Touch',
    ar: 'تواصل معنا',
  };

  const subtitle = {
    en: 'We are here to help. Whether you have a question about our services or want to discuss a partnership, we look forward to hearing from you.',
    ar: 'نحن هنا للمساعدة. سواء كان لديك سؤال حول خدماتنا أو ترغب في مناقشة شراكة، فإننا نتطلع إلى الاستماع منك.',
  };

  return (
    <section className={`py-16 md:py-24 text-center text-white bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden ${isArabic ? 'rtl font-arabic' : 'ltr'}`}>
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-transparent to-orange-500/10 pointer-events-none" />
      
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-orange-500/15 to-red-500/15 rounded-full blur-2xl animate-pulse delay-1000" />
      
      <div className="container mx-auto px-4 animate-fadeInUp relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
          {title[isArabic ? 'ar' : 'en']}
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
          {subtitle[isArabic ? 'ar' : 'en']}
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto rounded-full" />
      </div>
    </section>
  );
};

export default ContactHero;
