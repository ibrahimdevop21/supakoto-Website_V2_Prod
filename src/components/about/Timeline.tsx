import React from 'react';

interface TimelineProps {
  currentLocale: string;
  isRTL: boolean;
}

const timelineEvents = [
  {
    year: '2018',
    title: { en: 'SupaKoto Established', ar: 'تأسيس سوباكوتو' },
    description: { en: 'SupaKoto established in Egypt as a leading provider of protective films for automotive and architectural applications.', ar: 'تأسست سوباكوتو في مصر كمزود رائد لأفلام الحماية للتطبيقات السيارات والمعمارية.' },
  },
  {
    year: '2023',
    title: { en: 'Dubai Branch Opened', ar: 'افتتاح فرع دبي' },
    description: { en: 'Expanded operations with the opening of our Dubai branch, strengthening our presence in the Middle East region.', ar: 'توسعت العمليات مع افتتاح فرع دبي، مما عزز حضورنا في منطقة الشرق الأوسط.' },
  },
];

const Timeline: React.FC<TimelineProps> = ({ currentLocale, isRTL }) => {
  const isArabic = currentLocale === 'ar';

  const sectionTitle = {
    en: 'Our Journey',
    ar: 'رحلتنا',
  };

  return (
    <section className={`py-16 md:py-24 text-white ${isArabic ? 'rtl font-arabic' : 'ltr'}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight animate-fadeInUp bg-gradient-to-r from-[#bf1e2e] via-orange-400 to-[#bf1e2e] bg-clip-text text-transparent">
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
