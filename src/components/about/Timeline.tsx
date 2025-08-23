import React from 'react';

interface TimelineProps {
  currentLocale: string;
  isRTL: boolean;
}

const timelineEvents = [
  {
    year: '2018',
    title: { en: 'The Genesis of Supakoto', ar: 'ولادة سوباكوتو' },
    description: { en: 'Founded with a mission to redefine automotive protection through Japanese principles of quality and precision.', ar: 'تأسست بهدف إعادة تعريف حماية السيارات من خلال مبادئ الجودة والدقة اليابانية.' },
  },
  {
    year: '2020',
    title: { en: 'Launch of Self-Healing Film', ar: 'إطلاق فيلم الشفاء الذاتي' },
    description: { en: 'Introduced our revolutionary second-generation paint protection film with advanced self-healing capabilities.', ar: 'قدمنا الجيل الثاني الثوري من أفلام حماية الطلاء بقدرات شفاء ذاتي متقدمة.' },
  },
  {
    year: '2022',
    title: { en: 'Global Expansion', ar: 'التوسع العالمي' },
    description: { en: 'Expanded our distribution network to over 20 countries, becoming a globally recognized brand.', ar: 'وسعنا شبكة التوزيع لدينا لتشمل أكثر من 20 دولة، لنصبح علامة تجارية معترف بها عالميًا.' },
  },
  {
    year: '2024',
    title: { en: 'Automotive Excellence Award', ar: 'جائزة التميز في السيارات' },
    description: { en: 'Awarded "Best Paint Protection Film" for innovation, durability, and clarity by industry experts.', ar: 'حصلنا على جائزة "أفضل فيلم لحماية الطلاء" للابتكار والمتانة والوضوح من قبل خبراء الصناعة.' },
  },
];

const Timeline: React.FC<TimelineProps> = ({ currentLocale, isRTL }) => {
  const isArabic = currentLocale === 'ar';

  const sectionTitle = {
    en: 'A Journey of Innovation',
    ar: 'رحلة من الابتكار',
  };

  return (
    <section className={`py-16 md:py-24 text-white ${isArabic ? 'rtl font-arabic' : 'ltr'}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight animate-fadeInUp">
          {sectionTitle[isArabic ? 'ar' : 'en']}
        </h2>
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-neutral-700" aria-hidden="true"></div>
          <div className="space-y-16">
            {timelineEvents.map((event, index) => (
              <div key={index} className="relative flex items-center animate-fadeInUp" style={{ animationDelay: `${index * 200}ms` }}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <div className={`p-6 bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <h3 className="text-2xl font-bold text-rose-400 mb-2">{event.title[isArabic ? 'ar' : 'en']}</h3>
                    <p className="text-neutral-300">{event.description[isArabic ? 'ar' : 'en']}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-rose-500 border-4 border-neutral-900 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{event.year}</span>
                </div>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pl-8' : 'pr-8'}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
