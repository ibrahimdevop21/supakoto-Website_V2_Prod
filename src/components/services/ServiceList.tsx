import React from 'react';
import { Shield, Gem, Wind, Star } from './icons';

interface ServiceListProps {
  currentLocale: string;
  isRTL: boolean;
}

const services = [
  {
    icon: Shield,
    title: {
      en: 'Paint Protection Film',
      ar: 'فيلم حماية الطلاء',
    },
    description: {
      en: 'Virtually invisible film that protects your car’s paint from scratches, chips, and environmental damage.',
      ar: 'فيلم غير مرئي فعليًا يحمي طلاء سيارتك من الخدوش والضربات والأضرار البيئية.',
    },
  },
  {
    icon: Gem,
    title: {
      en: 'Ceramic Coating',
      ar: 'الطلاء السيراميكي',
    },
    description: {
      en: 'A liquid polymer that bonds with the factory paint, creating a durable layer of hydrophobic protection and incredible gloss.',
      ar: 'بوليمر سائل يترابط مع طلاء المصنع، مما يخلق طبقة متينة من الحماية المقاومة للماء واللمعان المذهل.',
    },
  },
  {
    icon: Wind,
    title: {
      en: 'Window Tinting',
      ar: 'تظليل النوافذ',
    },
    description: {
      en: 'High-performance window films that provide UV protection, heat rejection, and enhanced privacy and style.',
      ar: 'أفلام نوافذ عالية الأداء توفر حماية من الأشعة فوق البنفسجية ورفضًا للحرارة وخصوصية وأناقة معززة.',
    },
  },
  {
    icon: Star,
    title: {
      en: 'Luxury Detailing',
      ar: 'التلميع الفاخر',
    },
    description: {
      en: 'Meticulous interior and exterior cleaning, restoration, and finishing to bring your car to a show-ready standard.',
      ar: 'تنظيف داخلي وخارجي دقيق وترميم وتشطيب لإيصال سيارتك إلى مستوى جاهز للعرض.',
    },
  },
];

const ServiceList: React.FC<ServiceListProps> = ({ currentLocale, isRTL }) => {
  const isArabic = currentLocale === 'ar';

  const sectionTitle = {
    en: 'Our Premium Automotive Services',
    ar: 'خدماتنا المتميزة للسيارات',
  };

  const sectionSubtitle = {
    en: 'From flawless protection to concours-level detailing, we provide a comprehensive suite of services to keep your vehicle in pristine condition.',
    ar: 'من الحماية الخالية من العيوب إلى التلميع على مستوى المسابقات، نقدم مجموعة شاملة من الخدمات للحفاظ على سيارتك في حالة ممتازة.',
  };

  return (
    <div className={`py-16 md:py-24 text-white ${isArabic ? 'rtl font-arabic' : 'ltr'} relative overflow-hidden`}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-sm border border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-[1.02] hover:border-red-500/60 cursor-pointer p-8 text-center animate-fadeInUp"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Glowing border effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
              
              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 group-hover:border-red-500/60 transition-all duration-500">
                  <service.icon className="w-8 h-8 text-red-400 group-hover:text-red-300 transition-colors duration-500" />
                </div>
                <h3 className={`text-2xl font-bold mb-3 text-white group-hover:text-red-100 transition-colors duration-500 ${isArabic ? 'font-arabic' : ''}`}>
                  {service.title[isArabic ? 'ar' : 'en']}
                </h3>
                <p className={`text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-500 ${isArabic ? 'font-arabic' : ''}`}>
                  {service.description[isArabic ? 'ar' : 'en']}
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

export default ServiceList;
