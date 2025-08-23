import React from 'react';
import { Award, Users, ThumbsUp } from './icons';

interface WhyChooseUsProps {
  currentLocale: string;
  isRTL: boolean;
}

const benefits = [
  {
    icon: Award,
    title: {
      en: 'Certified Technicians',
      ar: 'فنيون معتمدون',
    },
    description: {
      en: 'Our team consists of industry-certified experts who are passionate about perfection and trained in the latest techniques.',
      ar: 'يتألف فريقنا من خبراء معتمدين في الصناعة وشغوفين بالكمال ومدربين على أحدث التقنيات.',
    },
  },
  {
    icon: ThumbsUp,
    title: {
      en: 'World-Class Materials',
      ar: 'مواد عالمية المستوى',
    },
    description: {
      en: 'We use only the highest-grade films, coatings, and products from leading global brands to ensure lasting quality.',
      ar: 'نحن نستخدم فقط أجود أنواع الأفلام والطلاءات والمنتجات من العلامات التجارية العالمية الرائدة لضمان جودة تدوم طويلاً.',
    },
  },
  {
    icon: Users,
    title: {
      en: 'Unmatched Warranty',
      ar: 'ضمان لا مثيل له',
    },
    description: {
      en: 'We stand behind our work with a comprehensive warranty for your peace of mind, covering both materials and labor.',
      ar: 'نحن ندعم عملنا بضمان شامل لراحة بالك، يغطي المواد والعمالة على حد سواء.',
    },
  },
];

const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ currentLocale, isRTL }) => {
  const isArabic = currentLocale === 'ar';

  const sectionTitle = {
    en: 'Why Choose Supakoto',
    ar: 'لماذا تختار سوباكوتو',
  };

  const sectionSubtitle = {
    en: 'Experience the difference that true craftsmanship and dedication to quality can make.',
    ar: 'جرب الفرق الذي يمكن أن تحدثه الحرفية الحقيقية والتفاني في الجودة.',
  };

  return (
    <div className={`py-16 md:py-24 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-sm rounded-3xl my-16 border border-slate-700/50 shadow-2xl ${isArabic ? 'rtl font-arabic' : 'ltr'} relative overflow-hidden`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-red-500/8 to-orange-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-orange-500/6 to-red-500/6 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 md:mb-20 lg:mb-24 animate-fadeInUp ${isArabic ? 'font-arabic' : ''}`}>
          <div className="relative">
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent ${isArabic ? 'font-arabic' : ''}`}>
              {sectionTitle[isArabic ? 'ar' : 'en']}
            </h2>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          </div>
          <p className={`text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8 ${isArabic ? 'font-arabic' : ''}`}>
            {sectionSubtitle[isArabic ? 'ar' : 'en']}
          </p>
          
          {/* Decorative Elements */}
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
            <div className="relative">
              <div className="h-2 w-20 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-full"></div>
              <div className="absolute inset-0 h-2 w-20 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-full animate-pulse opacity-75"></div>
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent via-red-500/50 to-transparent"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-sm border border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-[1.02] hover:border-red-500/60 cursor-pointer p-8 text-left animate-fadeInUp"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Glowing border effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
              
              <div className="relative z-10">
                <div className="mb-5 flex items-center gap-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 group-hover:border-red-500/60 transition-all duration-500">
                    <benefit.icon className="w-6 h-6 text-red-400 group-hover:text-red-300 transition-colors duration-500" />
                  </div>
                  <h3 className={`text-2xl font-bold text-white group-hover:text-red-100 transition-colors duration-500 ${isArabic ? 'font-arabic' : ''}`}>
                    {benefit.title[isArabic ? 'ar' : 'en']}
                  </h3>
                </div>
                <p className={`text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-500 ${isArabic ? 'font-arabic' : ''}`}>
                  {benefit.description[isArabic ? 'ar' : 'en']}
                </p>
                
                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
