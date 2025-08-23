import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface B2CFormProps {
  locale?: string;
  defaultService?: string;
  onSuccessRedirect?: () => void;
};

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  services: string[];
  message: string;
}

const initialFormData: FormData = {
  fullName: '', 
  email: '',
  phone: '', 
  services: [],
  message: ''
};

export default function B2CForm({
  locale = "en",
  defaultService,
  onSuccessRedirect
}: B2CFormProps) {
  const isRTL = locale === "ar";
  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
    services: defaultService ? [defaultService] : []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const t = {
    // Form title
    title: isRTL ? "احجز موعد واحصل على عرض سعر" : "Book & Quote",
    
    // Form fields
    fullName: isRTL ? "الاسم الكامل" : "Full Name",
    phone: isRTL ? "رقم الهاتف" : "Phone Number",


    services: isRTL ? "الخدمات المطلوبة" : "Services of Interest",
    notes: isRTL ? "ملاحظات إضافية (اختياري)" : "Additional Notes (Optional)",
    
    // Services
    ppf: isRTL ? "فيلم حماية الطلاء (PPF)" : "Paint Protection Film (PPF)",
    windshield: isRTL ? "طلاء نانو للزجاج الأمامي" : "Windshield nano coating",
    interior: isRTL ? "فيلم حماية داخلي" : "Interior protection film",
    tint: isRTL ? "عزل حراري/تظليل" : "Heat/Tint",
    rims: isRTL ? "طلاء نانو للجنوط" : "Rims nano coating",
    
    // Buttons
    submit: isRTL ? "إرسال الطلب" : "Submit Request",
    
    // Success
    successTitle: isRTL ? "تم إرسال طلبك بنجاح!" : "Request Submitted Successfully!",
    successMessage: isRTL ? "سنتواصل معك قريباً" : "We'll contact you shortly"
  };

  const serviceOptions = [
    { id: 'ppf', label: t.ppf },
    { id: 'windshield', label: t.windshield },
    { id: 'interior', label: t.interior },
    { id: 'tint', label: t.tint }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = isRTL ? "الاسم مطلوب" : "Name is required";
    if (!formData.phone.trim()) newErrors.phone = isRTL ? "رقم الهاتف مطلوب" : "Phone is required";

    if (formData.services.length === 0) newErrors.services = isRTL ? "اختر خدمة واحدة على الأقل" : "Select at least one service";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, String(value));
        }
      });
      
      // Add metadata
      formDataToSend.append('locale', locale);
      formDataToSend.append('source', 'contact_b2c');
      formDataToSend.append('timestamp', new Date().toISOString());
      
      const response = await fetch('/api/leads/b2c', {
        method: 'POST',
        body: formDataToSend
      });
      
      if (response.ok) {
        setIsSuccess(true);
        if (onSuccessRedirect) {
          setTimeout(() => onSuccessRedirect(), 2000);
        }
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      setErrors({ submit: isRTL ? "حدث خطأ، حاول مرة أخرى" : "Error occurred, please try again" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="rounded-2xl bg-green-500/10 border border-green-500/20 p-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">{t.successTitle}</h3>
          <p className="text-gray-300 mb-8">{t.successMessage}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/971552054478" className="btn-primary">
              {isRTL ? "واتساب" : "WhatsApp"}
            </a>
            <a href={isRTL ? "/ar" : "/"} className="btn-secondary">
              {isRTL ? "العودة للرئيسية" : "Back to Home"}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
      {/* Form Container - matching map container structure */}
      <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
        {/* Form Header - matching map header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{t.title}</h3>
              <p className="text-gray-400 text-sm">
                {isRTL ? 'املأ النموذج للحصول على عرض سعر مخصص' : 'Fill the form to get a personalized quote'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Form Content - matching map content area */}
        <div className="h-[500px] lg:h-[600px] p-6">
          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t.fullName} *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder={isRTL ? "أدخل اسمك الكامل" : "Enter your full name"}
                />
                {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t.phone} *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder={isRTL ? "+971 50 123 4567" : "+971 50 123 4567"}
                />
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
              </div>



              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">{t.services} *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {serviceOptions.map(service => (
                    <label key={service.id} className={cn(
                      "flex items-center cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10",
                      isRTL ? "space-x-reverse space-x-3" : "space-x-3"
                    )}>
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service.id)}
                        onChange={() => handleServiceToggle(service.id)}
                        className="w-4 h-4 text-red-500 bg-white/10 border-white/20 rounded focus:ring-red-500 focus:ring-2 flex-shrink-0"
                      />
                      <span className="text-gray-300 text-sm leading-relaxed">{service.label}</span>
                    </label>
                  ))}
                </div>
                {errors.services && <p className="text-red-400 text-sm mt-1">{errors.services}</p>}
              </div>


            </div>

            {/* Submit Button */}
            <div className="mt-6 pt-4 border-t border-slate-700/50">
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full px-6 py-3 rounded-lg font-medium transition-all",
                  isSubmitting 
                    ? "bg-gray-500 cursor-not-allowed" 
                    : "bg-red-500 hover:bg-red-600 text-white"
                )}
                data-track="contact-b2c:submit"
              >
                {isSubmitting ? (isRTL ? "جاري الإرسال..." : "Submitting...") : t.submit}
              </button>
              
              {errors.submit && (
                <p className="text-red-400 text-sm text-center mt-2">{errors.submit}</p>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Honeypot */}
      <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
    </div>
  );
}
