import React from 'react';
import { Wrench, Handshake, Award, ShieldCheck, Star, FileText } from 'lucide-react';

interface OurPhilosophyProps {
  currentLocale: string;
  isRTL: boolean;
}

const philosophies = [
  {
    icon: ShieldCheck,
    title: { en: 'Exclusive TAKAI PPF Distributor', ar: 'الموزع الحصري لـ TAKAI PPF' },
    description: { en: 'Exclusive distributor of TAKAI PPF in Egypt - world-renowned, high quality, durable protection films.', ar: 'الموزع الحصري لـ TAKAI PPF في مصر - أفلام حماية عالمية الشهرة وعالية الجودة ومتينة.' },
  },
  {
    icon: Star,
    title: { en: 'Wide Range of Products', ar: 'مجموعة واسعة من المنتجات' },
    description: { en: 'Customers can choose the right film for their needs from our comprehensive product range.', ar: 'يمكن للعملاء اختيار الفيلم المناسب لاحتياجاتهم من مجموعة منتجاتنا الشاملة.' },
  },
  {
    icon: Award,
    title: { en: 'Commitment to Quality', ar: 'الالتزام بالجودة' },
    description: { en: 'We use the best materials and follow best practices to ensure superior quality.', ar: 'نستخدم أفضل المواد ونتبع أفضل الممارسات لضمان جودة فائقة.' },
  },
  {
    icon: Wrench,
    title: { en: 'Expert Installation', ar: 'تركيب خبير' },
    description: { en: 'Our installers use proper methods to ensure maximum protection for your investment.', ar: 'يستخدم المركبون لدينا الطرق الصحيحة لضمان أقصى حماية لاستثمارك.' },
  },
  {
    icon: Handshake,
    title: { en: 'Excellent Customer Service', ar: 'خدمة عملاء ممتازة' },
    description: { en: 'Our knowledgeable and helpful team is committed to providing excellent customer service.', ar: 'فريقنا المتمرس والمفيد ملتزم بتقديم خدمة عملاء ممتازة.' },
  },
  {
    icon: FileText,
    title: { en: 'Warranty Coverage', ar: 'تغطية الضمان' },
    description: { en: 'All products include warranty coverage for your peace of mind.', ar: 'جميع المنتجات تشمل تغطية الضمان لراحة بالك.' },
  },
];

const OurPhilosophy: React.FC<OurPhilosophyProps> = ({ currentLocale, isRTL }) => {
  const isArabic = currentLocale === 'ar';

  const sectionTitle = {
    en: 'Why Choose SupaKoto',
    ar: 'لماذا تختار سوباكوتو',
  };
  const sectionSubtitle = {
    en: 'Our commitment to excellence sets us apart in the protective film industry.',
    ar: 'التزامنا بالتميز يميزنا في صناعة أفلام الحماية.',
  };

  return (
    <section className={`py-16 md:py-24 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-sm text-white ${isArabic ? 'rtl font-arabic' : 'ltr'} relative overflow-hidden`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-red-500/6 to-orange-500/6 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-r from-orange-500/4 to-red-500/4 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fadeInUp">
          <div className="relative">
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight bg-gradient-to-r from-[#bf1e2e] via-orange-400 to-[#bf1e2e] bg-clip-text text-transparent ${isArabic ? 'font-arabic' : ''}`}>
              {sectionTitle[isArabic ? 'ar' : 'en']}
            </h2>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-red-500/15 to-orange-500/15 rounded-full blur-3xl animate-pulse"></div>
          </div>
          <p className={`text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 ${isArabic ? 'font-arabic' : ''}`}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {philosophies.map((item, index) => (
            <div 
              key={index} 
              className="group relative rounded-2xl border border-slate-700/60 bg-slate-900/70 shadow-2xl backdrop-blur supports-[backdrop-filter]:backdrop-blur-xl hover:shadow-3xl transition-all duration-700 hover:scale-[1.02] hover:border-red-500/60 cursor-pointer p-8 text-center flex flex-col items-center animate-fadeInUp"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Glowing border effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
              
              <div className="relative z-10">
                <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 group-hover:border-red-500/60 transition-all duration-500">
                  <item.icon className="w-6 h-6 text-[#bf1e2e] group-hover:text-red-300 transition-colors duration-500" />
                </div>
                <h3 className={`text-2xl font-bold mb-3 text-white group-hover:text-red-100 transition-colors duration-500 ${isArabic ? 'font-arabic' : ''}`}>
                  {item.title[isArabic ? 'ar' : 'en']}
                </h3>
                <p className={`text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-500 ${isArabic ? 'font-arabic' : ''}`}>
                  {item.description[isArabic ? 'ar' : 'en']}
                </p>
                
                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPhilosophy;
