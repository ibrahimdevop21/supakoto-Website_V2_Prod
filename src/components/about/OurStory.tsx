import React from 'react';

interface OurStoryProps {
  currentLocale: string;
  isRTL: boolean;
}

const OurStory: React.FC<OurStoryProps> = ({ currentLocale, isRTL }) => {
  const isArabic = currentLocale === 'ar';

  const sectionTitle = {
    en: 'The Supakoto Legacy: A Fusion of Tradition and Technology',
    ar: 'إرث سوباكوتو: اندماج بين التقاليد والتكنولوجيا',
  };

  const storyContent = {
    en: [
      'Founded in 2018, Supakoto was born from a singular vision: to bring the legendary precision and artistry of Japanese manufacturing to the world of automotive protection. We saw a market saturated with generic solutions and knew we could offer something more—a product built on a philosophy of excellence.',
      'Our journey began with an intensive research and development phase in Japan, collaborating with master craftsmen and polymer scientists. The result was our flagship paint protection film, a revolutionary material that offers unparalleled clarity, durability, and a self-healing surface. It is more than just a film; it is a shield forged from a commitment to perfection.',
      'Today, Supakoto is recognized as the undisputed leader in the market, trusted by discerning car enthusiasts and professional detailers worldwide. Our story is one of relentless innovation, unwavering quality, and a deep respect for the art of the automobile.',
    ],
    ar: [
      'تأسست سوباكوتو في عام 2018، وقد ولدت من رؤية فريدة: جلب الدقة والبراعة الفنية الأسطورية للصناعة اليابانية إلى عالم حماية السيارات. رأينا سوقًا مشبعًا بالحلول العامة وعرفنا أنه يمكننا تقديم شيء أكثر - منتج مبني على فلسفة التميز.',
      'بدأت رحلتنا بمرحلة بحث وتطوير مكثفة في اليابان، بالتعاون مع الحرفيين المهرة وعلماء البوليمرات. وكانت النتيجة فيلم حماية الطلاء الرائد لدينا، وهو مادة ثورية توفر وضوحًا ومتانة لا مثيل لهما وسطحًا ذاتي الشفاء. إنه أكثر من مجرد فيلم؛ إنه درع مصقول من الالتزام بالكمال.',
      'اليوم، تُعرف سوباكوتو بأنها الشركة الرائدة بلا منازع في السوق، ويثق بها عشاق السيارات المميزون والمحترفون في جميع أنحاء العالم. قصتنا هي قصة ابتكار لا هوادة فيه، وجودة لا تتزعزع، واحترام عميق لفن السيارات.',
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
            <div className="relative overflow-hidden rounded-2xl">
              <img 
                src="/images/about-story.webp" 
                alt="Supakoto workshop crafting process" 
                className="rounded-2xl shadow-2xl object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              />
              {/* Image overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl"></div>
              {/* Glowing border */}
              <div className="absolute inset-0 rounded-2xl border border-red-500/20 group-hover:border-red-500/40 transition-all duration-700"></div>
            </div>
          </div>
          <div className="animate-slideInRight">
            <div className="relative">
              <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-8 tracking-tight bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent ${isArabic ? 'font-arabic' : ''}`}>
                {sectionTitle[isArabic ? 'ar' : 'en']}
              </h2>
              <div className="absolute -top-2 left-0 w-24 h-24 bg-gradient-to-r from-red-500/15 to-orange-500/15 rounded-full blur-3xl animate-pulse"></div>
            </div>
            
            {/* Decorative accent */}
            <div className="flex items-center mb-6">
              <div className="h-1 w-16 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-full"></div>
              <div className="h-px w-8 bg-gradient-to-r from-orange-500/50 to-transparent ml-2"></div>
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
