import React, { useState } from 'react';

interface ContactFormProps {
  t: (key: string) => string;
}

const ContactForm: React.FC<ContactFormProps> = ({ t }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('contact.form.required');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('contact.form.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('contact.form.invalid_email');
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t('contact.form.required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      setErrors({ form: t('contact.form.error') });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.form && (
          <div className="p-3 bg-red-900/30 border border-red-700 rounded-md text-red-200">
            {errors.form}
          </div>
        )}
        
        {isSuccess && (
          <div className="p-3 bg-green-900/30 border border-green-700 rounded-md text-green-200">
            {t('contact.form.success')}
          </div>
        )}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
            {t('contact.form.name')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-gray-800 border ${
              errors.name ? 'border-red-500' : 'border-gray-700'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-white`}
            disabled={isSubmitting}
          />
          {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
            {t('contact.form.email')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-gray-800 border ${
              errors.email ? 'border-red-500' : 'border-gray-700'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-white`}
            disabled={isSubmitting}
          />
          {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-1">
            {t('contact.form.phone')}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-1">
            {t('contact.form.message')}
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-gray-800 border ${
              errors.message ? 'border-red-500' : 'border-gray-700'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-white`}
            disabled={isSubmitting}
          />
          {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('contact.form.submitting')}
              </span>
            ) : (
              t('contact.form.submit')
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
