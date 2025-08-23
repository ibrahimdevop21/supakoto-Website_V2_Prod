import React from 'react';
import { Search, ClipboardList, Wand2, CheckCircle } from './icons';

interface OurProcessProps {
  currentLocale: string;
  isRTL: boolean;
}

const processSteps = [
  {
    icon: Search,
    title: {
      en: '1. Consultation & Assessment',
      ar: '1. الاستشارة والتقييم',
    },
    description: {
      en: 'We begin with a thorough evaluation of your vehicle and discuss your specific needs and desired outcomes.',
      ar: 'نبدأ بتقييم شامل لسيارتك ونناقش احتياجاتك الخاصة والنتائج المرجوة.',
    },
  },
  {
    icon: ClipboardList,
    title: {
      en: '2. Meticulous Preparation',
      ar: '2. التحضير الدقيق',
    },
    description: {
      en: 'Our team meticulously decontaminates and prepares every surface, ensuring a pristine foundation for a flawless application.',
      ar: 'يقوم فريقنا بتطهير وتحضير كل سطح بدقة، مما يضمن أساسًا نقيًا لتطبيق لا تشوبه شائبة.',
    },
  },
  {
    icon: Wand2,
    title: {
      en: '3. Expert Installation',
      ar: '3. التركيب الاحترافي',
    },
    description: {
      en: 'Using state-of-the-art tools and precision techniques, our certified technicians apply the chosen protection or treatment.',
      ar: 'باستخدام أحدث الأدوات والتقنيات الدقيقة، يقوم الفنيون المعتمدون لدينا بتطبيق الحماية أو المعالجة المختارة.',
    },
  },
  {
    icon: CheckCircle,
    title: {
      en: '4. Quality Assurance & Delivery',
      ar: '4. ضمان الجودة والتسليم',
    },
    description: {
      en: 'A final, multi-point inspection guarantees perfection before we proudly present your vehicle back to you.',
      ar: 'يضمن الفحص النهائي متعدد النقاط الكمال قبل أن نقدم سيارتك بفخر إليك مرة أخرى.',
    },
  },
];

const OurProcess: React.FC<OurProcessProps> = ({ currentLocale, isRTL }) => {
  const isArabic = currentLocale === 'ar';

  const sectionTitle = {
    en: 'Our Proven Process',
    ar: 'عمليتنا الموثوقة',
  };

  const sectionSubtitle = {
    en: 'We follow a meticulous, step-by-step process to ensure flawless results every time.',
    ar: 'نحن نتبع عملية دقيقة وخطوة بخطوة لضمان نتائج لا تشوبها شائبة في كل مرة.',
  };

  return (
    <div className={`py-16 md:py-24 text-white ${isArabic ? 'rtl font-arabic' : 'ltr'} relative overflow-hidden`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-red-500/6 to-orange-500/6 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-r from-orange-500/4 to-red-500/4 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 animate-fadeInUp ${isArabic ? 'font-arabic' : ''}`}>
          <div className="relative">
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent ${isArabic ? 'font-arabic' : ''}`}>
              {sectionTitle[isArabic ? 'ar' : 'en']}
            </h2>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-red-500/15 to-orange-500/15 rounded-full blur-3xl animate-pulse"></div>
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
        <div className="relative">
          {/* The connecting line with gradient */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-red-500/30 via-orange-500/50 to-red-500/30" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {processSteps.map((step, index) => (
              <div 
                key={index}
                className="group relative flex flex-col items-center text-center animate-fadeInUp hover:scale-105 transition-all duration-500"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="mb-5 z-10 flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-sm border-2 border-red-500/50 group-hover:border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)] group-hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all duration-500">
                  <step.icon className="w-10 h-10 text-red-400 group-hover:text-red-300 transition-colors duration-500" />
                </div>
                <h3 className={`text-2xl font-bold mb-3 text-white group-hover:text-red-100 transition-colors duration-500 ${isArabic ? 'font-arabic' : ''}`}>
                  {step.title[isArabic ? 'ar' : 'en']}
                </h3>
                <p className={`text-gray-400 leading-relaxed max-w-xs group-hover:text-gray-300 transition-colors duration-500 ${isArabic ? 'font-arabic' : ''}`}>
                  {step.description[isArabic ? 'ar' : 'en']}
                </p>
                
                {/* Step number indicator */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurProcess;
