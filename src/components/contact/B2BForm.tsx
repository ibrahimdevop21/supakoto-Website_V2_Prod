import React, { useState } from 'react';

interface B2BFormProps {
  currentLocale: string;
  isRTL: boolean;
}

const B2BForm: React.FC<B2BFormProps> = ({ currentLocale, isRTL }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    inquiryType: 'fleet-services',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isArabic = currentLocale === 'ar';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to a server
    console.log('B2B Form Submitted:', formData);
    setIsSubmitted(true);
  };

  const t = (key: string) => {
    const translations = {
      title: { en: 'For Business & Partnerships', ar: 'للشركات والشراكات' },
      subtitle: { en: 'We offer tailored solutions for fleets, showrooms, and car clubs. Fill out the form below to connect with our B2B team.', ar: 'نحن نقدم حلولاً مخصصة للأساطيل وصالات العرض ونوادي السيارات. املأ النموذج أدناه للتواصل مع فريق B2B لدينا.' },
      companyName: { en: 'Company/Organization Name', ar: 'اسم الشركة / المنظمة' },
      contactPerson: { en: 'Your Name', ar: 'اسمك' },
      email: { en: 'Email Address', ar: 'البريد الإلكتروني' },
      phone: { en: 'Phone Number', ar: 'رقم الهاتف' },
      inquiryType: { en: 'Type of Inquiry', ar: 'نوع الاستفسار' },
      fleetServices: { en: 'Fleet Services', ar: 'خدمات الأساطيل' },
      showroomPartnership: { en: 'Showroom Partnership', ar: 'شراكة صالة العرض' },
      carClubEvent: { en: 'Car Club Event', ar: 'فعالية نادي السيارات' },
      other: { en: 'Other', ar: 'أخرى' },
      message: { en: 'Your Message', ar: 'رسالتك' },
      submit: { en: 'Submit Inquiry', ar: 'إرسال الاستفسار' },
      successMessage: { en: 'Thank you! Your inquiry has been sent. Our team will contact you shortly.', ar: 'شكرًا لك! تم إرسال استفسارك. سيتصل بك فريقنا قريبًا.' },
    };
    return translations[key][isArabic ? 'ar' : 'en'];
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-12 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30 backdrop-blur-sm">
        <p className="text-xl text-white">{t('successMessage')}</p>
      </div>
    );
  }

  return (
    <section className={`py-16 md:py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden ${isArabic ? 'rtl font-arabic' : 'ltr'}`}>
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-orange-500/5 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">{t('title')}</h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">{t('subtitle')}</p>
        </div>
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 rounded-2xl border border-red-500/20 shadow-2xl backdrop-blur-sm relative">
          {/* Form gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 relative z-10">
            <input type="text" name="companyName" placeholder={t('companyName')} onChange={handleChange} required className="bg-slate-800/50 text-white p-4 rounded-lg border border-slate-600 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300 backdrop-blur-sm" />
            <input type="text" name="contactPerson" placeholder={t('contactPerson')} onChange={handleChange} required className="bg-slate-800/50 text-white p-4 rounded-lg border border-slate-600 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300 backdrop-blur-sm" />
            <input type="email" name="email" placeholder={t('email')} onChange={handleChange} required className="bg-slate-800/50 text-white p-4 rounded-lg border border-slate-600 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300 backdrop-blur-sm" />
            <input type="tel" name="phone" placeholder={t('phone')} onChange={handleChange} className="bg-slate-800/50 text-white p-4 rounded-lg border border-slate-600 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300 backdrop-blur-sm" />
          </div>
          <div className="mb-6 relative z-10">
            <label className="block text-gray-400 mb-2">{t('inquiryType')}</label>
            <select name="inquiryType" onChange={handleChange} value={formData.inquiryType} className="w-full bg-slate-800/50 text-white p-4 rounded-lg border border-slate-600 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300 backdrop-blur-sm">
              <option value="fleet-services">{t('fleetServices')}</option>
              <option value="showroom-partnership">{t('showroomPartnership')}</option>
              <option value="car-club-event">{t('carClubEvent')}</option>
              <option value="other">{t('other')}</option>
            </select>
          </div>
          <div className="mb-6 relative z-10">
            <textarea name="message" placeholder={t('message')} rows={6} onChange={handleChange} required className="w-full bg-slate-800/50 text-white p-4 rounded-lg border border-slate-600 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300 backdrop-blur-sm"></textarea>
          </div>
          <div className="text-center relative z-10">
            <button type="submit" className="bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-lg px-10 py-4 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:from-red-700 hover:to-orange-600 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30">
              {t('submit')}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default B2BForm;
