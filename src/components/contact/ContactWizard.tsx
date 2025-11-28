// Enhanced ContactWizard (mobile-first, fixed toggles)
// Drop-in replacement for your current file.

import React, { useEffect, useMemo, useReducer, useState } from 'react';
import './contact-wizard-form.css';
import PaymentStrip from './PaymentStrip';
import { trackStepView, trackStepNext, trackServiceToggle, trackFormSubmit } from '@/lib/track';

type Country = 'AE' | 'EG';
type Lang = 'en' | 'ar';
type Step = 1 | 2 | 3;

interface ContactWizardProps {
  branchId: string;
  currentLang: Lang;
}

interface FormData {
  name: string;
  phone: string;
  country: Country;
  message: string;
  services: string[];
  carMake: string;
  carYear: string;
  payments: string[];
  whatsappOnly: boolean;
}

type FormAction =
  | { type: 'UPDATE_FIELD'; field: keyof FormData; value: any }
  | { type: 'TOGGLE_SERVICE'; service: string }
  | { type: 'TOGGLE_PAYMENT'; payment: string }
  | { type: 'SET_COUNTRY'; country: Country }
  | { type: 'RESET_FORM'; preserveCountry?: boolean };

const CURRENT_YEAR = new Date().getFullYear();
const MAX_YEAR = CURRENT_YEAR + 2; // Allow next year models

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
  EG: { pattern: /^(01)[0-9]{9}$/, code: '+20', format: 'Egypt: 01XXXXXXXXX (11 digits)' },
  AE: { pattern: /^(0?5)[0-9]{8}$/, code: '+971', format: 'UAE: 5XXXXXXXX or 05XXXXXXXX (9-10 digits)' },
};

const LABELS = {
  en: {
    steps3: ['Details', 'Services', 'Review'],
    next: 'Next',
    back: 'Back',
    submit: 'Send Message',
    submitting: 'Sending...',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    yourMessage: 'Your Message',
    servicesNeeded: 'Services Needed',
    selectServices: 'Select the services you need',
    vehicleBlockTitle: 'Vehicle & Payment (Optional / Auto-shown for PPF or Tint)',
    vehicleDetails: 'Vehicle Details (Optional)',
    carMake: 'Car Make',
    carYear: 'Car Year',
    paymentOptions: 'Payment Options',
    cash: 'Cash',
    card: 'Card',
    installments: 'Installments (Tabby)',
    reviewDetails: 'Review Your Details',
    whatsappOnly: 'Contact via WhatsApp only',
    successTitle: 'Message sent successfully!',
    successMsg: "We'll contact you soon via phone or WhatsApp.",
    errorTitle: 'Error sending message',
    errorMsg: 'Please try again or contact us directly.',
    errors: {
      nameRequired: 'Name is required',
      phoneRequired: 'Phone is required',
      phoneInvalid: 'Invalid phone format.',
      servicesRequired: 'Please select at least one service',
      carYearInvalid: (min: number, max: number) => `Please enter a valid year between ${min} and ${max}`,
      carMakeInvalid: 'Car make must be at least 2 characters',
    },
  },
  ar: {
    steps3: ['التفاصيل', 'الخدمات', 'المراجعة'],
    next: 'التالي',
    back: 'السابق',
    submit: 'إرسال الرسالة',
    submitting: 'جاري الإرسال...',
    fullName: 'الاسم الكامل',
    phoneNumber: 'رقم الهاتف',
    yourMessage: 'رسالتك',
    servicesNeeded: 'الخدمات المطلوبة',
    selectServices: 'اختر الخدمات التي تحتاجها',
    vehicleBlockTitle: 'السيارة والدفع (اختياري / يظهر تلقائيًا لـ PPF أو التظليل)',
    vehicleDetails: 'تفاصيل السيارة (اختياري)',
    carMake: 'ماركة السيارة',
    carYear: 'سنة الصنع',
    paymentOptions: 'خيارات الدفع',
    cash: 'نقدي',
    card: 'بطاقة',
    installments: 'أقساط (تابي)',
    reviewDetails: 'مراجعة التفاصيل',
    whatsappOnly: 'تواصل عبر واتساب فقط',
    successTitle: 'تم إرسال رسالتك بنجاح!',
    successMsg: 'سنتواصل معك قريباً عبر الهاتف أو الواتساب.',
    errorTitle: 'حدث خطأ في الإرسال',
    errorMsg: 'يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة.',
    errors: {
      nameRequired: 'الاسم مطلوب',
      phoneRequired: 'رقم الهاتف مطلوب',
      phoneInvalid: 'صيغة رقم الهاتف غير صحيحة',
      servicesRequired: 'اختر خدمة واحدة على الأقل',
      carYearInvalid: (min: number, max: number) => `أدخل سنة صحيحة بين ${min} و ${max}`,
      carMakeInvalid: 'ماركة السيارة يجب أن تكون حرفين على الأقل',
    },
  },
} as const;

// Reducer
function formReducer(state: FormData, action: FormAction): FormData {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'TOGGLE_SERVICE': {
      const services = new Set(state.services);
      services.has(action.service) ? services.delete(action.service) : services.add(action.service);
      return { ...state, services: Array.from(services) };
    }
    case 'TOGGLE_PAYMENT': {
      const payments = new Set(state.payments);
      payments.has(action.payment) ? payments.delete(action.payment) : payments.add(action.payment);
      return { ...state, payments: Array.from(payments) };
    }
    case 'SET_COUNTRY':
      return { ...state, country: action.country };
    case 'RESET_FORM':
      return action.preserveCountry ? { ...INITIAL_DATA, country: state.country } : INITIAL_DATA;
    default:
      return state;
  }
}

// Validation
function useFormValidation(data: FormData, currentLang: Lang) {
  const t = LABELS[currentLang];

  const validatePhone = (country: Country, phone: string) => {
    const meta = PHONE_PATTERNS[country];
    const clean = phone.replace(/\D/g, '');
    if (!meta.pattern.test(clean)) return { valid: false, error: `${t.errors.phoneInvalid} ${meta.format}` };
    let formatted = clean;
    if (country === 'EG') formatted = meta.code + clean.substring(1);
    else if (country === 'AE') formatted = clean.startsWith('0') ? meta.code + clean.substring(1) : meta.code + clean;
    return { valid: true, formatted };
  };

  const validateStep = (stepNum: Step, showVehicleBlock: boolean) => {
    const errors: Record<string, string> = {};
    if (stepNum === 1) {
      if (!data.name.trim()) errors.name = t.errors.nameRequired;
      if (!data.phone.trim()) errors.phone = t.errors.phoneRequired;
      else {
        const v = validatePhone(data.country, data.phone);
        if (!v.valid) errors.phone = v.error!;
      }
    }
    if (stepNum === 2) {
      if (data.services.length === 0) errors.services = t.errors.servicesRequired;
      if (showVehicleBlock || data.carMake || data.carYear) {
        const minYear = 1900, maxYear = MAX_YEAR;
        if (data.carYear) {
          const y = parseInt(data.carYear, 10);
          if (isNaN(y) || y < minYear || y > maxYear) errors.carYear = t.errors.carYearInvalid(minYear, maxYear);
        }
        if (data.carMake && data.carMake.trim().length < 2) errors.carMake = t.errors.carMakeInvalid;
      }
    }
    return { errors, isValid: Object.keys(errors).length === 0 };
  };

  return { validatePhone, validateStep };
}

const branchSlugFromId = (id: string) =>
  !id ? 'unknown' : id.toLowerCase().replace(/\s+/g, '_').replace(/[^\w_]/g, '');

export default function ContactWizard({ branchId, currentLang }: ContactWizardProps) {
  const [step, setStep] = useState<Step>(1);
  const [data, dispatch] = useReducer(formReducer, INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadTime] = useState(Date.now());

  const t = useMemo(() => LABELS[currentLang], [currentLang]);
  const isRTL = currentLang === 'ar';
  const branch = useMemo(() => branchSlugFromId(branchId), [branchId]);
  const { validatePhone, validateStep } = useFormValidation(data, currentLang);

  const showVehicleBlock = data.services.includes('ppf') || data.services.includes('window_tinting');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';');
      const skCountry = cookies.find((c) => c.trim().startsWith('sk_country='));
      const country = (skCountry?.split('=')[1] as Country) || 'AE';
      dispatch({ type: 'SET_COUNTRY', country });
    }
  }, []);

  useEffect(() => {
    trackStepView({ step, branch, lang: currentLang });
  }, [step, branch, currentLang]);

  const nextStep = () => {
    const v = validateStep(step, showVehicleBlock);
    if (!v.isValid) { setErrors(v.errors); return; }
    trackStepNext({ step, branch, lang: currentLang });
    setStep((s) => Math.min(s + 1, 3) as Step);
    setErrors({});
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1) as Step);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
    if (errors[field as string]) setErrors((prev) => ({ ...prev, [field as string]: '' }));
  };

  const toggleService = (service: string) => {
    const was = data.services.includes(service);
    dispatch({ type: 'TOGGLE_SERVICE', service });
    trackServiceToggle({ step, service, selected: !was, branch, lang: currentLang });
  };

  const togglePayment = (payment: string) => dispatch({ type: 'TOGGLE_PAYMENT', payment });

  const handleSubmit = async () => {
    const s1 = validateStep(1, showVehicleBlock);
    const s2 = validateStep(2, showVehicleBlock);
    if (!s1.isValid || !s2.isValid) { setErrors({ ...s1.errors, ...s2.errors }); setStep(1); return; }

    setIsSubmitting(true); setShowSuccess(false); setShowError(false);
    try {
      const phoneValidation = validatePhone(data.country, data.phone);
      if (!phoneValidation.valid) throw new Error(t.errors.phoneInvalid);

      const sanitizedPayments = data.payments.filter((p) => (data.country === 'AE' ? true : p !== 'tabby'));

      const formData = new FormData();
      formData.set('name', data.name.trim());
      formData.set('phone', phoneValidation.formatted || '');
      formData.set('country', data.country);
      formData.set('message', data.message.trim());
      formData.set('services', JSON.stringify(data.services));
      formData.set('car_make', data.carMake.trim());
      formData.set('car_year', data.carYear.trim());
      formData.set('payments', JSON.stringify(sanitizedPayments));
      formData.set('whatsapp_only', data.whatsappOnly ? 'yes' : 'no');
      formData.set('branch_id', branchId);
      formData.set('_lt', (Date.now() - loadTime).toString());
      formData.set('_hp', '');

      const response = await fetch('/api/contact', { method: 'POST', body: formData });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || t.errorMsg);

      trackFormSubmit({ branch, lang: currentLang, services: data.services, whatsapp_only: data.whatsappOnly ? 'yes' : 'no' });
      setShowSuccess(true);
      dispatch({ type: 'RESET_FORM', preserveCountry: true });
      setStep(1); setErrors({});
    } catch (err) {
      console.error('Form submission error:', err);
      setErrorMessage((err as Error).message || t.errorMsg);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = t.steps3;

  return (
    <div className="w-full max-w-md sm:max-w-screen-sm mx-auto px-4 sm:px-6 overflow-x-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Progress */}
      <div className="mb-6 sm:mb-8">
        <div className={`flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          {steps.map((stepName, index) => {
            const idx = index + 1; const active = idx === step;
            return (
              <div key={index} className="flex items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium ${active ? 'bg-[#bf1e2e] text-white' : 'bg-slate-700 text-slate-400'}`}>{idx}</div>
                <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-xs ${active ? 'text-white' : 'text-slate-400'} hidden sm:inline`}>{stepName}</span>
                {index < steps.length - 1 && (
                  <div className={`w-6 sm:w-8 h-px ${isRTL ? 'mr-3 sm:mr-4' : 'mx-3 sm:mx-4'} ${idx < step ? 'bg-[#bf1e2e]' : 'bg-slate-700'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Steps */}
      <div className="min-h-[400px] space-y-8 pb-20 sm:pb-6">
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-8">
            <h3 className="text-lg sm:text-xl font-semibold text-white">{steps[0]}</h3>

            <div className="space-y-4">
              <label className="sk-label text-sm font-medium">
                {t.fullName} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => updateField('name', e.target.value)}
                className={`sk-input h-12 rounded-xl px-4 text-base sm:text-sm ${errors.name ? 'border-red-500' : ''}`}
                placeholder={currentLang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                autoComplete="name"
              />
              {errors.name && <div className="text-xs text-red-300 mt-2">{errors.name}</div>}
            </div>

            <div className="space-y-4">
              <label className="sk-label text-sm font-medium">
                {t.phoneNumber} <span className="text-red-400">*</span>
              </label>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Country radios */}
                <fieldset className="space-y-2" role="radiogroup" aria-label={currentLang === 'ar' ? 'اختر دولتك' : 'Select your country'}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-h-[36px]">
                      <input
                        id="country-ae"
                        type="radio"
                        name="country"
                        value="AE"
                        checked={data.country === 'AE'}
                        onChange={(e) => dispatch({ type: 'SET_COUNTRY', country: e.target.value as Country })}
                        className="sk-radio"
                      />
                      <label htmlFor="country-ae" className="sk-choice-label text-sm text-slate-200">{currentLang === 'ar' ? 'الإمارات' : 'UAE'}</label>
                    </div>
                    <div className="flex items-center gap-2 min-h-[36px]">
                      <input
                        id="country-eg"
                        type="radio"
                        name="country"
                        value="EG"
                        checked={data.country === 'EG'}
                        onChange={(e) => dispatch({ type: 'SET_COUNTRY', country: e.target.value as Country })}
                        className="sk-radio"
                      />
                      <label htmlFor="country-eg" className="sk-choice-label text-sm text-slate-200">{currentLang === 'ar' ? 'مصر' : 'Egypt'}</label>
                    </div>
                  </div>
                </fieldset>

                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className={`sk-input h-12 rounded-xl px-4 text-base sm:text-sm flex-1 ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder={data.country === 'AE' ? '+971 50 123 4567' : '+20 10 1234 5678'}
                  dir="ltr"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </div>
              {errors.phone && <div className="text-xs text-red-300 mt-2">{errors.phone}</div>}
            </div>

            <div className="space-y-4">
              <label className="sk-label text-sm font-medium">{t.yourMessage}</label>
              <textarea
                value={data.message}
                onChange={(e) => updateField('message', e.target.value)}
                rows={4}
                className="sk-textarea h-24 rounded-xl px-4 py-3 text-base sm:text-sm"
                placeholder={currentLang === 'ar' ? 'أخبرنا عن احتياجاتك' : 'Tell us about your needs'}
              />
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold text-white">{steps[1]}</h3>
              <p className="text-sm text-slate-300">{t.selectServices}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SERVICES.map((service) => {
                const id = `svc-${service.v}`;
                const checked = data.services.includes(service.v);
                return (
                  <div
                    key={service.v}
                    className={`flex items-center gap-4 min-h-[48px] p-4 rounded-xl border bg-slate-800/40 hover:border-[#bf1e2e]/50 transition
                    ${checked ? 'border-[#bf1e2e]/70 bg-slate-800/60' : 'border-slate-700/50'}`}
                  >
                    <input
                      id={id}
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleService(service.v)}
                      className="sk-checkbox"
                      data-testid={`svc-${service.v}`}
                    />
                    <label htmlFor={id} className="sk-choice-label text-sm text-slate-200 flex-1 break-words">
                      {currentLang === 'ar' ? service.tAr : service.tEn}
                    </label>
                  </div>
                );
              })}
            </div>

            {errors.services && <div className="sk-error mt-3">{errors.services}</div>}

            <div className="text-xs text-slate-400 bg-slate-800/20 p-3 rounded-lg">
              {data.services.length
                ? (currentLang === 'ar' ? 'الخدمات المختارة: ' : 'Selected: ') + data.services.join(', ')
                : currentLang === 'ar' ? 'لم يتم اختيار خدمات بعد.' : 'No services selected yet.'}
            </div>

            {(showVehicleBlock || data.carMake || data.carYear || data.payments.length > 0) && (
              <div className="space-y-8">
                <h4 className="text-lg sm:text-xl font-semibold text-white">{t.vehicleBlockTitle}</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="sk-label text-sm font-medium">{t.carMake}</label>
                    <input
                      type="text"
                      value={data.carMake}
                      onChange={(e) => updateField('carMake', e.target.value)}
                      className={`sk-input h-12 rounded-xl px-4 text-base sm:text-sm ${errors.carMake ? 'border-red-500' : ''}`}
                      placeholder={currentLang === 'ar' ? 'مثل: تويوتا، بي إم دبليو' : 'e.g. Toyota, BMW'}
                    />
                    {errors.carMake && <div className="text-xs text-red-300 mt-2">{errors.carMake}</div>}
                  </div>
                  <div className="space-y-4">
                    <label className="sk-label text-sm font-medium">{t.carYear}</label>
                    <input
                      type="number"
                      value={data.carYear}
                      onChange={(e) => updateField('carYear', e.target.value)}
                      min={1900}
                      max={MAX_YEAR}
                      className={`sk-input h-12 rounded-xl px-4 text-base sm:text-sm ${errors.carYear ? 'border-red-500' : ''}`}
                      placeholder={currentLang === 'ar' ? 'مثل: 2020' : 'e.g. 2020'}
                    />
                    {errors.carYear && <div className="text-xs text-red-300 mt-2">{errors.carYear}</div>}
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="sk-label text-sm font-medium">{t.paymentOptions}</label>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {(
                      data.country === 'AE'
                        ? [{ key: 'tabby', logo: '/payment/ae/tabby-logo-1.png', alt: 'Tabby', a11y: t.installments as string }]
                        : [
                            { key: 'valu', logo: '/payment/eg/valu.webp', alt: 'valU', a11y: currentLang === 'ar' ? 'أقساط (فالو)' : 'Installments (valU)' },
                            { key: 'banque_misr', logo: '/payment/eg/bmp-logo.png', alt: 'Banque Misr', a11y: currentLang === 'ar' ? 'أقساط (بنك مصر)' : 'Installments (Banque Misr)' },
                            { key: 'nbe', logo: '/payment/eg/NBE-logo.svg', alt: 'NBE', a11y: currentLang === 'ar' ? 'أقساط (الأهلي)' : 'Installments (NBE)' },
                            { key: 'cib', logo: '/payment/eg/anniversary-50-logo.png', alt: 'CIB', a11y: currentLang === 'ar' ? 'أقساط (CIB)' : 'Installments (CIB)' },
                          ]
                    ).map(({ key, logo, alt, a11y }) => {
                      const id = `pay-${key}`;
                      const checked = data.payments.includes(key);
                      return (
                        <div
                          key={key}
                          role="checkbox"
                          aria-checked={checked}
                          onClick={() => togglePayment(key)}
                          className={`relative cursor-pointer select-none p-3 rounded-xl border bg-slate-800/40 hover:border-[#bf1e2e]/50 transition flex items-center justify-center
                            ${checked ? 'border-[#bf1e2e]/70 bg-slate-800/60 ring-1 ring-[#bf1e2e]/30' : 'border-slate-700/50'}`}
                          title={a11y}
                        >
                          <input
                            id={id}
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePayment(key)}
                            aria-label={a11y}
                            className="sk-checkbox absolute top-2 left-2 h-5 w-5 accent-[#bf1e2e]"
                            data-testid={`pay-${key}`}
                          />
                          <img src={logo} alt={alt} className="h-6 sm:h-7 md:h-8 opacity-90 pointer-events-none" />
                        </div>
                      );
                    })}
                  </div>

                  {/* Logo reassurance */}
                  <div className="mt-4 p-3 sm:p-4 rounded-xl bg-slate-800/20 border border-slate-700/30">
                    <div className="text-xs text-slate-400 mb-3">
                      {currentLang === 'ar' ? 'نقبل جميع البطاقات والمحافظ الرقمية' : 'We accept all major cards & digital wallets'}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <img src="/payment/common/visa.png" alt="Visa" className="h-6 opacity-80" />
                      <img src="/payment/common/MasterCard.png" alt="Mastercard" className="h-6 opacity-80" />
                      <img src="/payment/common/AMEX.png" alt="American Express" className="h-6 opacity-80" />
                      <img src="/payment/common/applepay.png" alt="Apple Pay" className="h-6 opacity-80" />
                      <img src="/payment/common/googlepay.png" alt="Google Pay" className="h-6 opacity-80" />
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-8">
            <h3 className="text-lg sm:text-xl font-semibold text-white">{steps[2]}</h3>

            <div className="sk-card space-y-4">
              <div className="break-words"><strong className="text-white text-sm font-medium">{t.fullName}:</strong> <span className="text-slate-300 text-sm">{data.name || '—'}</span></div>
              <div className="break-words"><strong className="text-white text-sm font-medium">{t.phoneNumber}:</strong> <span className="text-slate-300 text-sm">{data.phone || '—'}</span></div>
              <div className="break-words"><strong className="text-white text-sm font-medium">Country:</strong> <span className="text-slate-300 text-sm">{data.country}</span></div>
              {data.message && <div className="break-words"><strong className="text-white text-sm font-medium">{t.yourMessage}:</strong> <span className="text-slate-300 text-sm">{data.message}</span></div>}
              <div className="break-words"><strong className="text-white text-sm font-medium">{t.servicesNeeded}:</strong> <span className="text-slate-300 text-sm">{data.services.length ? `${data.services.length} selected` : '—'}</span></div>
              {data.carMake && <div className="break-words"><strong className="text-white text-sm font-medium">{t.carMake}:</strong> <span className="text-slate-300 text-sm">{data.carMake}</span></div>}
              {data.carYear && <div className="break-words"><strong className="text-white text-sm font-medium">{t.carYear}:</strong> <span className="text-slate-300 text-sm">{data.carYear}</span></div>}
              {data.payments.length > 0 && <div className="break-words"><strong className="text-white text-sm font-medium">{t.paymentOptions}:</strong> <span className="text-slate-300 text-sm">{data.payments.join(', ')}</span></div>}
              <div className="break-words"><strong className="text-white text-sm font-medium">{t.whatsappOnly}:</strong> <span className="text-slate-300 text-sm">{data.whatsappOnly ? 'Yes' : 'No'}</span></div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40">
              <input
                id="whatsappOnly"
                type="checkbox"
                checked={data.whatsappOnly}
                onChange={(e) => updateField('whatsappOnly', e.target.checked)}
                className="sk-checkbox"
                data-testid="whatsapp-only"
              />
              <label htmlFor="whatsappOnly" className="sk-choice-label text-slate-200 text-sm">{t.whatsappOnly}</label>
            </div>
          </div>
        )}
      </div>

      {/* Sticky nav */}
      <div className="sticky bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur border-t border-slate-800 px-4 py-3 pb-[env(safe-area-inset-bottom)]">
        <div className="flex gap-3 justify-between max-w-screen-sm mx-auto">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`sk-btn bg-slate-700/60 hover:bg-slate-700 flex-1 h-12 ${step === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {t.back}
          </button>
          {step < 3 ? (
            <button onClick={nextStep} className="sk-btn flex-1 h-12">{t.next}</button>
          ) : (
            <button onClick={handleSubmit} disabled={isSubmitting} className="sk-btn flex-1 h-12 disabled:opacity-60">
              {isSubmitting ? t.submitting : t.submit}
            </button>
          )}
        </div>
      </div>

      {/* Success / Error */}
      {showSuccess && (
        <div className="mt-6 p-4 bg-green-900/30 border border-green-700/50 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-300 font-medium">{t.successTitle}</span>
          </div>
          <p className="text-green-200 text-sm mt-2">{t.successMsg}</p>
        </div>
      )}

      {showError && (
        <div className="mt-6 p-4 bg-red-900/30 border border-red-700/50 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-300 font-medium">{t.errorTitle}</span>
          </div>
          <p className="text-red-200 text-sm mt-2">{errorMessage || t.errorMsg}</p>
        </div>
      )}
    </div>
  );
}
