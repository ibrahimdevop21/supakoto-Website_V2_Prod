import React from 'react';

interface OurStoryProps {
  currentLocale: string;
  isRTL: boolean;
}

const OurStory: React.FC<OurStoryProps> = ({ currentLocale, isRTL }) => {
  const isArabic = currentLocale === 'ar';

  const sectionTitle = {
    en: 'About SupaKoto',
    ar: 'حول سوباكوتو',
  };

  const introText = {
    en: 'SupaKoto is a leading provider of protective films for cars, buildings, and other surfaces. We offer paint protection film (PPF), window tint films, safety glass films, and thermal insulation films. SupaKoto is the exclusive distributor of TAKAI PPF in Egypt, and we also offer our own brand of PPF.',
    ar: 'سوباكوتو هي مزود رائد لأفلام الحماية للسيارات والمباني والأسطح الأخرى. نحن نقدم فيلم حماية الطلاء (PPF) وأفلام تظليل النوافذ وأفلام الزجاج الآمن وأفلام العزل الحراري. سوباكوتو هي الموزع الحصري لـ TAKAI PPF في مصر، كما نقدم علامتنا التجارية الخاصة من PPF.',
  };

  const storyContent = {
    en: [
      'Our films protect against scratches, chips, UV rays, and other damage. They\'re used by car owners, building owners, and manufacturers.',
      'We\'re committed to high-quality products and services. Installers are trained to the highest standards using the best materials and equipment. All products include a warranty.',
    ],
    ar: [
      'تحمي أفلامنا من الخدوش والشقوق والأشعة فوق البنفسجية وأضرار أخرى. يستخدمها أصحاب السيارات وأصحاب المباني والمصنعون.',
      'نحن ملتزمون بالمنتجات والخدمات عالية الجودة. يتم تدريب المثبتين وفقًا لأعلى المعايير باستخدام أفضل المواد والمعدات. جميع المنتجات تشمل ضمان.',
    ],
  };

  return (
    <section className={`py-16 md:py-24 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-sm text-white ${isArabic ? 'rtl font-arabic' : 'ltr'} relative overflow-hidden`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-red-500/8 to-orange-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-orange-500/6 to-red-500/6 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slideInLeft group">
            <div className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/70 shadow-2xl backdrop-blur supports-[backdrop-filter]:backdrop-blur-xl">
              <img 
                src="/images/about-story.webp" 
                alt="SupaKoto workshop crafting process" 
                className="rounded-2xl object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              />
              {/* Image overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl"></div>
              {/* Glowing border */}
              <div className="absolute inset-0 rounded-2xl border border-red-500/20 group-hover:border-red-500/40 transition-all duration-700"></div>
            </div>
          </div>
          <div className="animate-slideInRight">
            <div className="relative">
              <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-8 tracking-tight bg-gradient-to-r from-[#bf1e2e] via-orange-400 to-[#bf1e2e] bg-clip-text text-transparent ${isArabic ? 'font-arabic' : ''}`}>
                {sectionTitle[isArabic ? 'ar' : 'en']}
              </h2>
              <div className="absolute -top-2 left-0 w-24 h-24 bg-gradient-to-r from-red-500/15 to-orange-500/15 rounded-full blur-3xl animate-pulse"></div>
            </div>
            
            {/* Decorative accent */}
            <div className="flex items-center mb-6">
              <div className="h-1 w-16 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-full"></div>
              <div className="h-px w-8 bg-gradient-to-r from-orange-500/50 to-transparent ml-2"></div>
            </div>
            
            {/* Intro paragraph */}
            <div className="mb-8">
              <p className={`text-lg text-gray-200 leading-relaxed ${isArabic ? 'font-arabic' : ''}`}>
                {introText[isArabic ? 'ar' : 'en']}
              </p>
            </div>
            
            <div className="space-y-6 text-gray-300 leading-relaxed">
              {storyContent[isArabic ? 'ar' : 'en'].map((paragraph, index) => (
                <p key={index} className={`transition-colors duration-500 hover:text-gray-200 ${isArabic ? 'font-arabic' : ''}`}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
