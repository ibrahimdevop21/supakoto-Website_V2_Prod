import React, { useState } from 'react';
import { ppfComparisonData, type PPFComparisonData, type Locale } from '../../data/ppfComparisonData';

interface PPFComparisonProps {
  locale?: Locale;
  data?: PPFComparisonData;
  className?: string;
}

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        tabIndex={0}
        className="cursor-help transition-all duration-200"
        role="button"
        aria-describedby={isVisible ? 'tooltip' : undefined}
      >
        {children}
      </div>
      {isVisible && (
        <div
          id="tooltip"
          role="tooltip"
          className="absolute z-50 px-4 py-3 text-sm font-medium text-white bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/50 -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full whitespace-nowrap animate-in fade-in-0 zoom-in-95 duration-200"
        >
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900/95"></div>
        </div>
      )}
    </div>
  );
};

const Badge: React.FC<{ children: React.ReactNode; variant?: 'warning' | 'success' | 'info'; tooltip?: string }> = ({ 
  children, 
  variant = 'info',
  tooltip 
}) => {
  const baseClasses = "inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 backdrop-blur-sm border shadow-lg hover:shadow-xl transform hover:scale-105";
  const variantClasses = {
    warning: "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-200 border-amber-400/30 hover:from-amber-500/30 hover:to-orange-500/30",
    success: "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-200 border-emerald-400/30 hover:from-emerald-500/30 hover:to-green-500/30",
    info: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-200 border-blue-400/30 hover:from-blue-500/30 hover:to-cyan-500/30"
  };

  const badge = (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );

  return tooltip ? <Tooltip content={tooltip}>{badge}</Tooltip> : badge;
};

const PPFComparison: React.FC<PPFComparisonProps> = ({ 
  locale = 'en', 
  data = ppfComparisonData,
  className = ''
}) => {
  const { title, columns, rows } = data;
  const isRTL = locale === 'ar';

  const enhanceContent = (content: string, type: string) => {
    if (typeof content !== 'string') return content;
    
    if (content.includes('✓')) {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="success" tooltip="Available feature">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </Badge>
          <span>{content.replace('✓', '').trim()}</span>
        </div>
      );
    }
    
    if (content.includes('✗') || content.includes('❌')) {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="warning" tooltip="Limited or unavailable">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Badge>
          <span>{content.replace(/[✗❌]/g, '').trim()}</span>
        </div>
      );
    }
    
    if (content.includes('⚠️')) {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="warning" tooltip="Caution advised">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </Badge>
          <span>{content.replace('⚠️', '').trim()}</span>
        </div>
      );
    }
    
    return content;
  };

  return (
    <section 
      className={`w-full overflow-hidden py-20 md:py-28 lg:py-32 ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="w-full">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          <div className="relative">
            <h2 
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight ${isRTL ? 'font-arabic' : ''}`}
            >
              {title[locale]}
            </h2>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4 leading-relaxed">
            {locale === 'en' 
              ? 'Compare our premium Japanese Takai PPF technology with other market options to make an informed decision for your vehicle protection.'
              : 'قارن تقنية حماية الطلاء اليابانية المتطورة من تاكاي مع الخيارات الأخرى في السوق لاتخاذ قرار مدروس لحماية مركبتك.'
            }
          </p>
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
            <div className="relative">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 bg-red-500/30 rounded-full animate-ping"></div>
            </div>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block group relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-sm border border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-[1.02] hover:border-red-500/60">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
          
          {/* Table wrapper */}
          <div className="relative bg-gradient-to-br from-white/5 to-white/2 rounded-2xl overflow-hidden">
            <table className="w-full bg-transparent">
              <thead className="bg-transparent">
                <tr className="bg-transparent border-b border-gray-700/50">
                  {columns.map((column, index) => (
                    <th
                      key={column.key}
                      className={`
                        bg-transparent px-6 py-6 font-bold text-white border-b border-gray-700/50
                        ${index === 0 ? 'bg-gradient-to-br from-red-600/20 to-red-800/20 text-red-300' : 'text-gray-200'}
                        ${isRTL ? 'text-right' : 'text-left'}
                      `}
                    >
                      {column[locale]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-transparent">
                {rows.map((row, index) => (
                  <tr key={index} className="bg-transparent border-b border-gray-700/30 hover:bg-slate-800/20 transition-all duration-300 group">
                    <th className={`
                      bg-transparent px-6 py-6 font-bold text-white border-b border-gray-700/50 group-hover:text-gray-100 transition-colors duration-300
                      ${isRTL ? 'text-right' : 'text-left'}
                    `}>
                      {row.feature[locale]}
                    </th>
                    <td className={`
                      bg-transparent px-6 py-6 border-b border-gray-700/50 relative
                      bg-gradient-to-br from-red-600/10 to-red-800/10
                      hover:from-red-600/20 hover:to-red-800/20 group-hover:shadow-lg
                      transition-all duration-300
                      ${isRTL ? 'text-right' : 'text-left'}
                    `}>
                      <div className="relative z-10 text-white font-medium">
                        {typeof enhanceContent(row.supa[locale], 'supa') === 'string' 
                          ? enhanceContent(row.supa[locale], 'supa')
                          : enhanceContent(row.supa[locale], 'supa')
                        }
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    </td>
                    <td className={`bg-transparent px-6 py-6 text-gray-400 font-medium transition-colors duration-300 group-hover:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {row.xpel3m[locale]}
                    </td>
                    <td className={`bg-transparent px-6 py-6 text-gray-400 font-medium transition-colors duration-300 group-hover:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {typeof enhanceContent(row.xpel3m[locale], 'xpel3m') === 'string' 
                        ? enhanceContent(row.xpel3m[locale], 'xpel3m')
                        : enhanceContent(row.xpel3m[locale], 'xpel3m')
                      }
                    </td>
                    <td className={`bg-transparent px-6 py-6 text-gray-400 font-medium transition-colors duration-300 group-hover:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {row.china[locale]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-6">
          {rows.map((row, index) => (
            <div key={index} className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-sm border border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-[1.02] hover:border-red-500/60">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Glowing border effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
              
              {/* Card content */}
              <div className="relative bg-gradient-to-br from-white/5 to-white/2 rounded-2xl p-6">
                <h3 className={`text-lg font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {row.feature[locale]}
                </h3>
                
                {/* SupaKoto PPF */}
                <div className="mb-4 p-4 bg-gradient-to-br from-red-600/10 to-red-800/10 rounded-lg border border-red-500/20">
                  <div className={`font-semibold text-red-300 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {columns[0][locale]}
                  </div>
                  <div className={`text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {typeof enhanceContent(row.supa[locale], 'supa') === 'string' 
                      ? enhanceContent(row.supa[locale], 'supa')
                      : enhanceContent(row.supa[locale], 'supa')
                    }
                  </div>
                </div>
                
                {/* XPEL Ultimate */}
                <div className="mb-4 p-4 bg-slate-800/30 rounded-lg border border-slate-600/30">
                  <div className={`font-semibold text-blue-300 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {columns[1][locale]}
                  </div>
                  <div className={`text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {row.xpel3m[locale]}
                  </div>
                </div>
                
                {/* 3M Scotchgard */}
                <div className="mb-4 p-4 bg-slate-800/30 rounded-lg border border-slate-600/30">
                  <div className={`font-semibold text-green-300 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {columns[2][locale]}
                  </div>
                  <div className={`text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {typeof enhanceContent(row.xpel3m[locale], 'xpel3m') === 'string' 
                      ? enhanceContent(row.xpel3m[locale], 'xpel3m')
                      : enhanceContent(row.xpel3m[locale], 'xpel3m')
                    }
                  </div>
                </div>
                
                {/* Chinese PPF */}
                <div className="p-4 bg-slate-900/30 rounded-lg border border-slate-700/30">
                  <div className={`font-semibold text-gray-300 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {columns[3][locale]}
                  </div>
                  <div className={`text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {row.china[locale]}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 text-center">
          <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-sm border border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-[1.02] hover:border-red-500/60 p-8">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
            
            {/* Inner content container */}
            <div className="relative bg-gradient-to-br from-white/5 to-white/2 rounded-2xl p-8">
              <h3 className={`text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                {locale === 'en' 
                  ? 'Ready to Protect Your Vehicle with Premium Japanese PPF?'
                  : 'هل أنت مستعد لحماية مركبتك بأفلام الحماية اليابانية المتطورة؟'
                }
              </h3>
              <p className={`text-gray-300 mb-6 max-w-2xl mx-auto ${isRTL ? 'text-right' : 'text-left'}`}>
                {locale === 'en'
                  ? 'Experience the ultimate protection with our certified Takai PPF technology. Contact us for a free consultation and quote.'
                  : 'اختبر الحماية المثلى مع تقنية تاكاي المعتمدة لأفلام حماية الطلاء. اتصل بنا للحصول على استشارة وعرض سعر مجاني.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:+971501234567" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {locale === 'en' ? 'Call Now' : 'اتصل الآن'}
                </a>
                <a 
                  href="https://wa.me/971501234567" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.097"/>
                  </svg>
                  {locale === 'en' ? 'WhatsApp' : 'واتساب'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PPFComparison;
