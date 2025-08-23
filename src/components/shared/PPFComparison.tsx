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
  const stickySide = isRTL ? 'right-0' : 'left-0';

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
      className={`relative isolate overflow-hidden py-20 md:py-28 lg:py-32 ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="relative w-full">
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

        {/* Horizontally Scrollable Table */}
        <div
          className="
            overflow-x-auto touch-pan-x overscroll-x-contain scroll-smooth
            rounded-3xl shadow-2xl
            bg-transparent
            border border-gray-700/30 relative
          "
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Edge fade indicators */}
          <div className="pointer-events-none absolute top-0 left-0 h-full w-6 bg-gradient-to-r from-black/40 to-transparent z-10" />
          <div className="pointer-events-none absolute top-0 right-0 h-full w-6 bg-gradient-to-l from-black/40 to-transparent z-10" />

          <table className="w-full border-collapse bg-transparent min-w-[48rem]">
            <caption className="sr-only">{title[locale]}</caption>

            <thead className="sticky top-0 z-30 bg-transparent">
              <tr className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 supports-[backdrop-filter]:backdrop-blur-sm">
                {columns.map((column, index) => {
                  const isFeature = index === 0;
                  const thBase =
                    "px-4 py-4 text-left font-semibold text-white border-b-2 border-gray-700 align-bottom";
                  const stickyClasses = isFeature
                    ? `sticky ${stickySide} z-40 bg-slate-900/80 supports-[backdrop-filter]:backdrop-blur-xl backdrop-saturate-150 ring-1 ring-white/10`
                    : "";
                  const width =
                    isFeature
                      ? "min-w-[12rem] sm:min-w-[14rem]"
                      : "min-w-[14rem] sm:min-w-[16rem]";
                  return (
                    <th
                      key={column.key}
                      scope="col"
                      className={`${thBase} ${stickyClasses} ${width} ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                      {column[locale]}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="bg-transparent">
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`
                    transition-colors duration-200
                    ${rowIndex % 2 === 0 ? 'bg-slate-900/20' : 'bg-slate-800/20'}
                    hover:bg-slate-800/30
                  `}
                >
                  {/* Sticky Feature cell */}
                  <th
                    scope="row"
                    className={`
                      px-4 py-4 font-semibold text-white border-b border-gray-700
                      sticky ${stickySide} z-20
                      bg-slate-900/80 supports-[backdrop-filter]:backdrop-blur-xl backdrop-saturate-150
                      ring-1 ring-white/10
                      min-w-[12rem] sm:min-w-[14rem]
                      ${isRTL ? 'text-right' : 'text-left'}
                    `}
                  >
                    {row.feature[locale]}
                  </th>

                  {/* SupaKoto column */}
                  <td
                    className={`
                      px-4 py-4 border-b border-gray-700 relative
                      bg-gradient-to-br from-supakoto-red/10 to-supakoto-deep-burgundy/10
                      hover:from-supakoto-red/20 hover:to-supakoto-deep-burgundy/20
                      min-w-[14rem] sm:min-w-[16rem]
                      ${isRTL ? 'text-right' : 'text-left'}
                    `}
                  >
                    <div className="relative z-10 text-white font-medium">
                      {enhanceContent(row.supa[locale], 'supa')}
                    </div>
                    <div className="absolute inset-0 rounded opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-supakoto-red/10 to-transparent" />
                  </td>

                  {/* XPEL/3M */}
                  <td
                    className={`
                      px-4 py-4 border-b border-gray-700 text-white font-medium
                      min-w-[14rem] sm:min-w-[16rem]
                      ${isRTL ? 'text-right' : 'text-left'}
                    `}
                  >
                    {enhanceContent(row.xpel3m[locale], 'xpel3m')}
                  </td>

                  {/* Chinese */}
                  <td
                    className={`
                      px-4 py-4 border-b border-gray-700 text-gray-300 font-medium
                      min-w-[14rem] sm:min-w-[16rem]
                      ${isRTL ? 'text-right' : 'text-left'}
                    `}
                  >
                    {row.china[locale]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


      </div>
    </section>
  );
};

export default PPFComparison;
