// src/components/business/BusinessForm.tsx
import React, { useState, useEffect } from 'react';

type Country = 'AE' | 'EG' | 'SA' | 'QA' | 'KW' | 'BH' | 'OM' | 'JO' | 'LB' | 'Other';
type Lang = 'en' | 'ar';
type InquiryType = 'franchise' | 'partnership' | 'other';

interface BusinessFormProps {
  currentLang: Lang;
}

interface FormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: Country;
  inquiryType: InquiryType;
  message: string;
}

const INITIAL_DATA: FormData = {
  name: '',
  company: '',
  email: '',
  phone: '',
  country: 'AE',
  inquiryType: 'franchise',
  message: '',
};

const COUNTRIES = [
  { code: 'AE', nameEn: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة', flag: '🇦🇪' },
  { code: 'EG', nameEn: 'Egypt', nameAr: 'مصر', flag: '🇪🇬' },
  { code: 'SA', nameEn: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', flag: '🇸🇦' },
  { code: 'QA', nameEn: 'Qatar', nameAr: 'قطر', flag: '🇶🇦' },
  { code: 'KW', nameEn: 'Kuwait', nameAr: 'الكويت', flag: '🇰🇼' },
  { code: 'BH', nameEn: 'Bahrain', nameAr: 'البحرين', flag: '🇧🇭' },
  { code: 'OM', nameEn: 'Oman', nameAr: 'عُمان', flag: '🇴🇲' },
  { code: 'JO', nameEn: 'Jordan', nameAr: 'الأردن', flag: '🇯🇴' },
  { code: 'LB', nameEn: 'Lebanon', nameAr: 'لبنان', flag: '🇱🇧' },
  { code: 'Other', nameEn: 'Other', nameAr: 'أخرى', flag: '🌍' },
] as const;

const LABELS = {
  en: {
    name: 'Full Name',
    company: 'Company Name',
    email: 'Email Address',
    phone: 'Phone Number',
    country: 'Country',
    inquiryType: 'Inquiry Type',
    message: 'Message',
    submit: 'Send Inquiry',
    submitting: 'Sending...',
    inquiryTypes: {
      franchise: 'Franchise Opportunity',
      partnership: 'Partnership',
      other: 'Other'
    },
    placeholders: {
      name: 'Enter your full name',
      company: 'Enter your company name',
      email: 'Enter your email address',
      phone: 'Enter your phone number',
      message: 'Tell us about your business goals and how you\'d like to partner with SupaKoto'
    },
    validation: {
      nameRequired: 'Name is required',
      companyRequired: 'Company name is required',
      emailRequired: 'Email is required',
      emailInvalid: 'Please enter a valid email address',
      phoneRequired: 'Phone number is required',
      messageRequired: 'Message is required'
    },
    success: {
      title: 'Inquiry sent successfully!',
      message: 'Thank you for your interest in partnering with SupaKoto. Our business development team will contact you within 24 hours.'
    },
    error: {
      title: 'Error sending inquiry',
      message: 'Please try again or contact us directly at leads@supakoto.org'
    }
  },
  ar: {
    name: 'الاسم الكامل',
    company: 'اسم الشركة',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    country: 'الدولة',
    inquiryType: 'نوع الاستفسار',
    message: 'الرسالة',
    submit: 'إرسال الاستفسار',
    submitting: 'جاري الإرسال...',
    inquiryTypes: {
      franchise: 'فرصة امتياز تجاري',
      partnership: 'شراكة',
      other: 'أخرى'
    },
    placeholders: {
      name: 'أدخل اسمك الكامل',
      company: 'أدخل اسم شركتك',
      email: 'أدخل بريدك الإلكتروني',
      phone: 'أدخل رقم هاتفك',
      message: 'أخبرنا عن أهدافك التجارية وكيف تود الشراكة مع سوپاكوتو'
    },
    validation: {
      nameRequired: 'الاسم مطلوب',
      companyRequired: 'اسم الشركة مطلوب',
      emailRequired: 'البريد الإلكتروني مطلوب',
      emailInvalid: 'يرجى إدخال بريد إلكتروني صحيح',
      phoneRequired: 'رقم الهاتف مطلوب',
      messageRequired: 'الرسالة مطلوبة'
    },
    success: {
      title: 'تم إرسال الاستفسار بنجاح!',
      message: 'شكراً لاهتمامك بالشراكة مع سوپاكوتو. سيتواصل معك فريق تطوير الأعمال خلال 24 ساعة.'
    },
    error: {
      title: 'خطأ في إرسال الاستفسار',
      message: 'يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة على leads@supakoto.org'
    }
  }
};

export default function BusinessForm({ currentLang }: BusinessFormProps) {
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadTime] = useState(Date.now());

  const t = LABELS[currentLang];
  const isRTL = currentLang === 'ar';

  // Get country from cookie or default to AE
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';');
      const skCountry = cookies.find(c => c.trim().startsWith('sk_country='));
      const country = skCountry?.split('=')[1] as Country || 'AE';
      setData(prev => ({ ...prev, country }));
    }
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.name.trim()) newErrors.name = t.validation.nameRequired;
    if (!data.company.trim()) newErrors.company = t.validation.companyRequired;
    if (!data.email.trim()) {
      newErrors.email = t.validation.emailRequired;
    } else if (!validateEmail(data.email)) {
      newErrors.email = t.validation.emailInvalid;
    }
    if (!data.phone.trim()) newErrors.phone = t.validation.phoneRequired;
    if (!data.message.trim()) newErrors.message = t.validation.messageRequired;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setShowSuccess(false);
    setShowError(false);

    try {
      const formData = new FormData();
      formData.set('name', data.name);
      formData.set('company', data.company);
      formData.set('email', data.email);
      formData.set('phone', data.phone);
      formData.set('country', data.country);
      formData.set('inquiry_type', data.inquiryType);
      formData.set('message', data.message);
      formData.set('_lt', (Date.now() - loadTime).toString());
      formData.set('_hp', ''); // Honeypot

      const response = await fetch('/api/business-contact', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        // Legacy tracking code removed - will be handled by GTM
        setShowSuccess(true);
        // Reset form
        setData(INITIAL_DATA);
      } else {
        throw new Error(result.error || 'Failed to send inquiry');
      }
    } catch (error) {
      console.error('Business form submission error:', error);
      setErrorMessage((error as Error).message || t.error.message);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateData = (field: keyof FormData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Company Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="sk-label">{t.name} <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => updateData('name', e.target.value)}
              className={`sk-input ${errors.name ? 'border-red-500' : ''}`}
              placeholder={t.placeholders.name}
            />
            {errors.name && <div className="sk-error">{errors.name}</div>}
          </div>

          <div className="space-y-2">
            <label className="sk-label">{t.company} <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={data.company}
              onChange={(e) => updateData('company', e.target.value)}
              className={`sk-input ${errors.company ? 'border-red-500' : ''}`}
              placeholder={t.placeholders.company}
            />
            {errors.company && <div className="sk-error">{errors.company}</div>}
          </div>
        </div>

        {/* Email and Phone Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="sk-label">{t.email} <span className="text-red-400">*</span></label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => updateData('email', e.target.value)}
              className={`sk-input ${errors.email ? 'border-red-500' : ''}`}
              placeholder={t.placeholders.email}
              dir="ltr"
            />
            {errors.email && <div className="sk-error">{errors.email}</div>}
          </div>

          <div className="space-y-2">
            <label className="sk-label">{t.phone} <span className="text-red-400">*</span></label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => updateData('phone', e.target.value)}
              className={`sk-input ${errors.phone ? 'border-red-500' : ''}`}
              placeholder={t.placeholders.phone}
              dir="ltr"
            />
            {errors.phone && <div className="sk-error">{errors.phone}</div>}
          </div>
        </div>

        {/* Country and Inquiry Type Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="sk-label">{t.country}</label>
            <select
              value={data.country}
              onChange={(e) => updateData('country', e.target.value as Country)}
              className="sk-input"
            >
              {COUNTRIES.map(country => (
                <option key={country.code} value={country.code}>
                  {country.flag} {currentLang === 'ar' ? country.nameAr : country.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="sk-label">{t.inquiryType}</label>
            <select
              value={data.inquiryType}
              onChange={(e) => updateData('inquiryType', e.target.value as InquiryType)}
              className="sk-input"
            >
              <option value="franchise">{t.inquiryTypes.franchise}</option>
              <option value="partnership">{t.inquiryTypes.partnership}</option>
              <option value="other">{t.inquiryTypes.other}</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label className="sk-label">{t.message} <span className="text-red-400">*</span></label>
          <textarea
            value={data.message}
            onChange={(e) => updateData('message', e.target.value)}
            rows={5}
            className={`sk-textarea ${errors.message ? 'border-red-500' : ''}`}
            placeholder={t.placeholders.message}
          />
          {errors.message && <div className="sk-error">{errors.message}</div>}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="sk-btn bg-[#bf1e2e] hover:bg-[#6a343a] disabled:opacity-60 px-8 py-3 text-lg font-semibold"
          >
            {isSubmitting ? t.submitting : t.submit}
          </button>
        </div>
      </form>

      {/* Success Message */}
      {showSuccess && (
        <div className="mt-6 p-4 bg-green-900/30 border border-green-700/50 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <span className="text-green-300 font-medium">{t.success.title}</span>
          </div>
          <p className="text-green-200 text-sm mt-2">{t.success.message}</p>
        </div>
      )}

      {/* Error Message */}
      {showError && (
        <div className="mt-6 p-4 bg-red-900/30 border border-red-700/50 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
            </svg>
            <span className="text-red-300 font-medium">{t.error.title}</span>
          </div>
          <p className="text-red-200 text-sm mt-2">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
