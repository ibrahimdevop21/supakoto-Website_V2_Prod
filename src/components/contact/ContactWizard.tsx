// src/components/contact/ContactWizard.tsx
import React, { useState, useEffect } from 'react';
import PaymentStrip from './PaymentStrip';

type Country = 'AE' | 'EG';
type Lang = 'en' | 'ar';

interface ContactWizardProps {
  branchId: string;
  currentLang: Lang;
}

interface FormData {
  // Step 1: Details
  name: string;
  phone: string;
  country: Country;
  message: string;
  
  // Step 2: Services
  services: string[];
  
  // Step 3: Vehicle & Payments
  carMake: string;
  carYear: string;
  payments: string[];
  
  // Step 4: Review & Submit
  whatsappOnly: boolean;
}

const INITIAL_DATA: FormData = {
  name: '',
  phone: '',
  country: 'AE',
  message: '',
  services: [],
  carMake: '',
  carYear: '',
  payments: [],
  whatsappOnly: false,
};

const SERVICES = [
  { v: 'ppf', tEn: 'Paint Protection Film (PPF)', tAr: 'فيلم حماية الطلاء' },
  { v: 'ceramic', tEn: 'Ceramic Coating', tAr: 'نانو سيراميك' },
  { v: 'heat_uv_isolation', tEn: 'Heat/UV Isolation', tAr: 'عزل الحرارة والأشعة فوق البنفسجية' },
  { v: 'window_tinting', tEn: 'Window Tinting', tAr: 'تظليل النوافذ' },
  { v: 'building_heat_uv_isolation', tEn: 'Building Heat/UV Isolation', tAr: 'عزل الحرارة/الأشعة للمباني' },
];

const PHONE_PATTERNS = {
  EG: {
    pattern: /^(01)[0-9]{9}$/,
    code: '+20',
    format: 'Egypt: 01XXXXXXXXX (11 digits)'
  },
  AE: {
    pattern: /^(0?5)[0-9]{8}$/,
    code: '+971',
    format: 'UAE: 5XXXXXXXX or 05XXXXXXXX (9-10 digits)'
  }
};

const LABELS = {
  en: {
    steps: ['Details', 'Services', 'Vehicle & Payment', 'Review'],
    next: 'Next',
    back: 'Back',
    submit: 'Send Message',
    submitting: 'Sending...',
    // Step 1
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    yourMessage: 'Your Message',
    // Step 2
    servicesNeeded: 'Services Needed',
    selectServices: 'Select the services you need',
    // Step 3
    vehicleDetails: 'Vehicle Details (Optional)',
    carMake: 'Car Make',
    carYear: 'Car Year',
    // Step 4
    reviewDetails: 'Review Your Details',
    whatsappOnly: 'Contact via WhatsApp only',
    // Success/Error
    successTitle: 'Message sent successfully!',
    successMsg: "We'll contact you soon via phone or WhatsApp.",
    errorTitle: 'Error sending message',
    errorMsg: 'Please try again or contact us directly.',
  },
  ar: {
    steps: ['التفاصيل', 'الخدمات', 'السيارة والدفع', 'المراجعة'],
    next: 'التالي',
    back: 'السابق',
    submit: 'إرسال الرسالة',
    submitting: 'جاري الإرسال...',
    // Step 1
    fullName: 'الاسم الكامل',
    phoneNumber: 'رقم الهاتف',
    yourMessage: 'رسالتك',
    // Step 2
    servicesNeeded: 'الخدمات المطلوبة',
    selectServices: 'اختر الخدمات التي تحتاجها',
    // Step 3
    vehicleDetails: 'تفاصيل السيارة (اختياري)',
    carMake: 'ماركة السيارة',
    carYear: 'سنة الصنع',
    // Step 4
    reviewDetails: 'مراجعة التفاصيل',
    whatsappOnly: 'تواصل عبر واتساب فقط',
    // Success/Error
    successTitle: 'تم إرسال رسالتك بنجاح!',
    successMsg: 'سنتواصل معك قريباً عبر الهاتف أو الواتساب.',
    errorTitle: 'حدث خطأ في الإرسال',
    errorMsg: 'يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة.',
  },
};

export default function ContactWizard({ branchId, currentLang }: ContactWizardProps) {
  const [step, setStep] = useState(1);
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

  const validatePhone = (country: Country, phone: string) => {
    const pattern = PHONE_PATTERNS[country];
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (!pattern.pattern.test(cleanPhone)) {
      return { valid: false, error: `Invalid format. Expected: ${pattern.format}` };
    }

    let formatted = cleanPhone;
    if (country === 'EG') {
      formatted = pattern.code + cleanPhone.substring(1);
    } else if (country === 'AE') {
      if (cleanPhone.startsWith('0')) {
        formatted = pattern.code + cleanPhone.substring(1);
      } else {
        formatted = pattern.code + cleanPhone;
      }
    }

    return { valid: true, formatted };
  };

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNum === 1) {
      if (!data.name.trim()) newErrors.name = 'Name is required';
      if (!data.phone.trim()) {
        newErrors.phone = 'Phone is required';
      } else {
        const validation = validatePhone(data.country, data.phone);
        if (!validation.valid) newErrors.phone = validation.error || 'Invalid phone';
      }
    }

    if (stepNum === 2) {
      if (data.services.length === 0) newErrors.services = 'Please select at least one service';
    }

    if (stepNum === 3) {
      if (data.carYear && (parseInt(data.carYear) < 1900 || parseInt(data.carYear) > 2025)) {
        newErrors.carYear = 'Please enter a valid year between 1900 and 2025';
      }
      if (data.carMake && data.carMake.trim().length < 2) {
        newErrors.carMake = 'Car make must be at least 2 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    setShowSuccess(false);
    setShowError(false);

    try {
      const phoneValidation = validatePhone(data.country, data.phone);
      if (!phoneValidation.valid) throw new Error('Invalid phone number');

      const formData = new FormData();
      formData.set('name', data.name);
      formData.set('phone', phoneValidation.formatted || '');
      formData.set('country', data.country);
      formData.set('message', data.message);
      formData.set('services', JSON.stringify(data.services));
      formData.set('car_make', data.carMake);
      formData.set('car_year', data.carYear);
      formData.set('payments', JSON.stringify(data.payments));
      formData.set('whatsapp_only', data.whatsappOnly ? 'yes' : 'no');
      formData.set('branch_id', branchId);
      formData.set('_lt', (Date.now() - loadTime).toString());
      formData.set('_hp', ''); // Honeypot

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        // Fire analytics only after backend confirms success
        if (typeof (window as any).fbq !== 'undefined') {
          (window as any).fbq('track', 'Lead', {
            content_name: 'Contact Form Wizard',
            content_category: 'Lead Generation'
          });
        }
        
        if (typeof (window as any).gtag !== 'undefined') {
          (window as any).gtag('event', 'form_submit', {
            event_category: 'engagement',
            event_label: 'contact_wizard',
            value: 1
          });
        }

        if (typeof (window as any).ttq !== 'undefined') {
          (window as any).ttq('track', 'SubmitForm', { 
            region: data.country,
            wizard: true 
          });
        }

        setShowSuccess(true);
        // Reset form
        setData(INITIAL_DATA);
        setStep(1);
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrorMessage((error as Error).message || t.errorMsg);
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

  const toggleService = (service: string) => {
    const services = new Set(data.services);
    services.has(service) ? services.delete(service) : services.add(service);
    updateData('services', Array.from(services));
  };

  return (
    <div className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {t.steps.map((stepName, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index + 1 <= step 
                  ? 'bg-[#bf1e2e] text-white' 
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {index + 1}
              </div>
              <span className={`ml-2 text-sm ${
                index + 1 <= step ? 'text-white' : 'text-slate-400'
              }`}>
                {stepName}
              </span>
              {index < t.steps.length - 1 && (
                <div className={`w-8 h-px mx-4 ${
                  index + 1 < step ? 'bg-[#bf1e2e]' : 'bg-slate-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {/* Step 1: Details */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">{t.steps[0]}</h3>
            
            {/* Name */}
            <div className="space-y-2">
              <label className="sk-label">{t.fullName} <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => updateData('name', e.target.value)}
                className={`sk-input ${errors.name ? 'border-red-500' : ''}`}
                placeholder={currentLang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
              />
              {errors.name && <div className="sk-error">{errors.name}</div>}
            </div>

            {/* Phone with Country */}
            <div className="space-y-2">
              <label className="sk-label">{t.phoneNumber} <span className="text-red-400">*</span></label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <fieldset className="flex flex-row items-center gap-2">
                  <label>
                    <input 
                      type="radio" 
                      name="country" 
                      value="AE" 
                      checked={data.country === 'AE'}
                      onChange={(e) => updateData('country', e.target.value as Country)}
                      className="peer hidden" 
                    />
                    <div className="sk-pill">
                      🇦🇪 <span>AE</span>
                    </div>
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="country" 
                      value="EG" 
                      checked={data.country === 'EG'}
                      onChange={(e) => updateData('country', e.target.value as Country)}
                      className="peer hidden" 
                    />
                    <div className="sk-pill">
                      🇪🇬 <span>EG</span>
                    </div>
                  </label>
                </fieldset>
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => updateData('phone', e.target.value)}
                  dir="ltr"
                  className={`sk-input flex-1 ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="1234567890"
                />
              </div>
              {errors.phone && <div className="sk-error">{errors.phone}</div>}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="sk-label">{t.yourMessage}</label>
              <textarea
                value={data.message}
                onChange={(e) => updateData('message', e.target.value)}
                rows={4}
                className="sk-textarea"
                placeholder={currentLang === 'ar' ? 'أخبرنا عن احتياجاتك' : 'Tell us about your needs'}
              />
            </div>
          </div>
        )}

        {/* Step 2: Services */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">{t.steps[1]}</h3>
            <p className="text-slate-300 mb-4">{t.selectServices}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SERVICES.map(service => (
                <label key={service.v} className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-[#bf1e2e]/60 transition cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.services.includes(service.v)}
                    onChange={() => toggleService(service.v)}
                    className="h-4 w-4 rounded-sm"
                  />
                  <span className="text-sm text-slate-200">
                    {currentLang === 'ar' ? service.tAr : service.tEn}
                  </span>
                </label>
              ))}
            </div>
            {errors.services && <div className="sk-error">{errors.services}</div>}
          </div>
        )}

        {/* Step 3: Vehicle & Payments */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">{t.steps[2]}</h3>
            
            {/* Vehicle Details */}
            <div>
              <h4 className="text-white font-semibold mb-4">{t.vehicleDetails}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="sk-label">{t.carMake}</label>
                  <input
                    type="text"
                    value={data.carMake}
                    onChange={(e) => updateData('carMake', e.target.value)}
                    className={`sk-input ${errors.carMake ? 'border-red-500' : ''}`}
                    placeholder={currentLang === 'ar' ? 'مثل: تويوتا، بي إم دبليو' : 'e.g. Toyota, BMW'}
                  />
                  {errors.carMake && <div className="sk-error">{errors.carMake}</div>}
                </div>
                <div className="space-y-2">
                  <label className="sk-label">{t.carYear}</label>
                  <input
                    type="number"
                    value={data.carYear}
                    onChange={(e) => updateData('carYear', e.target.value)}
                    min="1900"
                    max="2025"
                    className={`sk-input ${errors.carYear ? 'border-red-500' : ''}`}
                    placeholder={currentLang === 'ar' ? 'مثل: 2020' : 'e.g. 2020'}
                  />
                  {errors.carYear && <div className="sk-error">{errors.carYear}</div>}
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <PaymentStrip
              country={data.country}
              lang={currentLang}
              selected={data.payments}
              onChange={(payments) => updateData('payments', payments)}
            />
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">{t.steps[3]}</h3>
            
            <div className="sk-card">
              <div><strong className="text-white">{t.fullName}:</strong> <span className="text-slate-300">{data.name}</span></div>
              <div><strong className="text-white">{t.phoneNumber}:</strong> <span className="text-slate-300">{data.phone}</span></div>
              <div><strong className="text-white">Country:</strong> <span className="text-slate-300">{data.country}</span></div>
              {data.message && <div><strong className="text-white">{t.yourMessage}:</strong> <span className="text-slate-300">{data.message}</span></div>}
              <div><strong className="text-white">{t.servicesNeeded}:</strong> <span className="text-slate-300">{data.services.length} selected</span></div>
              {data.carMake && <div><strong className="text-white">{t.carMake}:</strong> <span className="text-slate-300">{data.carMake}</span></div>}
              {data.carYear && <div><strong className="text-white">{t.carYear}:</strong> <span className="text-slate-300">{data.carYear}</span></div>}
              {data.payments.length > 0 && <div><strong className="text-white">Payment Options:</strong> <span className="text-slate-300">{data.payments.join(', ')}</span></div>}
              <div><strong className="text-white">{t.whatsappOnly}:</strong> <span className="text-slate-300">{data.whatsappOnly ? 'Yes' : 'No'}</span></div>
            </div>

            {/* WhatsApp Only Checkbox */}
            <div className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-xl">
              <input
                type="checkbox"
                checked={data.whatsappOnly}
                onChange={(e) => updateData('whatsappOnly', e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-slate-200">{t.whatsappOnly}</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          disabled={step === 1}
          className="sk-btn bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.back}
        </button>
        
        {step < 4 ? (
          <button onClick={nextStep} className="sk-btn">
            {t.next}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="sk-btn disabled:opacity-60"
          >
            {isSubmitting ? t.submitting : t.submit}
          </button>
        )}
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mt-6 p-4 bg-green-900/30 border border-green-700/50 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <span className="text-green-300 font-medium">{t.successTitle}</span>
          </div>
          <p className="text-green-200 text-sm mt-2">{t.successMsg}</p>
        </div>
      )}

      {/* Error Message */}
      {showError && (
        <div className="mt-6 p-4 bg-red-900/30 border border-red-700/50 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
            </svg>
            <span className="text-red-300 font-medium">{t.errorTitle}</span>
          </div>
          <p className="text-red-200 text-sm mt-2">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
