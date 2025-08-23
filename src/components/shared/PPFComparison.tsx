import React, { useState, useId, useEffect, useRef } from 'react';
import { ppfComparisonData, type PPFComparisonData, type Locale } from '../../data/ppfComparisonData';
import clsx from 'clsx';

interface PPFComparisonProps {
  locale?: Locale;
  data?: PPFComparisonData;
  className?: string;
}

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

// Icon components for enhanced content
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const WarningIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const Badge: React.FC<{ children: React.ReactNode; variant?: 'warning' | 'success' | 'info'; tooltip?: string }> = ({ 
  children, 
  variant = 'info',
  tooltip 
}) => {
  const baseClasses = "inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 backdrop-blur-sm border shadow-lg";
  const variantClasses = {
    warning: "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-200 border-amber-400/30",
    success: "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-200 border-emerald-400/30",
    info: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-200 border-blue-400/30"
  };

  const badge = (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );

  return tooltip ? <Tooltip content={tooltip}>{badge}</Tooltip> : badge;
};

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();

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
        aria-describedby={isVisible ? tooltipId : undefined}
      >
        {children}
      </div>
      {isVisible && (
        <div
          id={tooltipId}
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

// Card component for mobile view
const CardBox: React.FC<{ 
  title: string; 
  content: React.ReactNode; 
  variant: 'supa' | 'xpel3m' | 'china';
  isRTL: boolean;
}> = ({ title, content, variant, isRTL }) => {
  const variantClasses = {
    supa: 'bg-gradient-to-br from-red-600/20 to-red-800/20 border-red-500/30 text-red-200',
    xpel3m: 'bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30 text-blue-200',
    china: 'bg-gradient-to-br from-gray-600/20 to-gray-800/20 border-gray-500/30 text-gray-300'
  };

  return (
    <div className={`p-4 rounded-lg border backdrop-blur-sm ${variantClasses[variant]}`}>
      <h4 className={`font-semibold mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{title}</h4>
      <div className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{content}</div>
    </div>
  );
};

const PPFComparison: React.FC<PPFComparisonProps> = ({ 
  locale = 'en', 
  data = ppfComparisonData,
  className = ''
}) => {
  const { title, columns, rows } = data;
  const isRTL = locale === 'ar';
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Contact constants (localized)
  const contacts = {
    phone: locale === 'en' ? '+971501234567' : '+966123456789',
    whatsapp: locale === 'en' ? '971501234567' : '966123456789'
  };

  // Handle scroll hint fade
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const handleScroll = () => {
      if (!hasScrolled) {
        setHasScrolled(true);
      }
    };

    scroller.addEventListener('scroll', handleScroll, { once: true });
    return () => scroller.removeEventListener('scroll', handleScroll);
  }, [hasScrolled]);

  // Enhanced content function - returns ReactNode directly
  const enhanceContent = (content: string): React.ReactNode => {
    if (typeof content !== 'string') return content;
    
    if (content.includes('✓')) {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="success" tooltip="Available feature">
            <CheckIcon className="w-3 h-3" />
          </Badge>
          <span>{content.replace('✓', '').trim()}</span>
        </div>
      );
    }
    
    if (content.includes('✗') || content.includes('❌')) {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="warning" tooltip="Limited or unavailable">
            <XIcon className="w-3 h-3" />
          </Badge>
          <span>{content.replace(/[✗❌]/g, '').trim()}</span>
        </div>
      );
    }
    
    if (content.includes('⚠️')) {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="warning" tooltip="Caution advised">
            <WarningIcon className="w-3 h-3" />
          </Badge>
          <span>{content.replace('⚠️', '').trim()}</span>
        </div>
      );
    }
    
    return content;
  };

  // Premium class helpers
  const headCellClass = (index: number) => clsx(
    'px-4 md:px-6 py-4 md:py-6 font-bold border-b border-gray-700/50 transition-all duration-300',
    'sticky top-0 z-20 backdrop-blur-md bg-slate-900/85',
    index === 0 && clsx(
      'text-red-300 bg-gradient-to-br from-red-600/20 to-red-800/20',
      'sticky z-30 shadow-lg',
      isRTL ? 'right-0' : 'left-0'
    ),
    index === 1 && 'text-red-200 bg-gradient-to-br from-red-600/10 to-red-800/10',
    index > 1 && 'text-gray-200',
    isRTL ? 'text-right' : 'text-left'
  );

  const rowCellClass = (index: number, isFirstCol = false) => clsx(
    'px-4 md:px-6 py-4 md:py-6 border-b border-gray-700/30 transition-all duration-300',
    isFirstCol && clsx(
      'font-bold text-white sticky z-20 backdrop-blur-md bg-slate-900/90 shadow-lg',
      isRTL ? 'right-0' : 'left-0'
    ),
    index === 1 && 'bg-gradient-to-br from-red-600/5 to-red-800/5 text-white font-medium',
    index > 1 && 'text-gray-400 font-medium',
    isRTL ? 'text-right' : 'text-left'
  );

  const stickyFirstColClass = clsx(
    'sticky z-30 backdrop-blur-md bg-slate-900/95 shadow-lg',
    isRTL ? 'right-0' : 'left-0'
  );

  // Legend data
  const legendItems = [
    { 
      key: 'supa', 
      label: locale === 'en' ? 'Takai PPF (Premium)' : 'تاكاي PPF (مميز)',
      color: 'bg-red-600',
      textColor: 'text-red-200'
    },
    { 
      key: 'xpel3m', 
      label: locale === 'en' ? 'XPEL / 3M (Western)' : 'XPEL / 3M (غربي)',
      color: 'bg-slate-500',
      textColor: 'text-slate-200'
    },
    { 
      key: 'china', 
      label: locale === 'en' ? 'Chinese PPF (Budget)' : 'PPF صيني (اقتصادي)',
      color: 'bg-gray-600',
      textColor: 'text-gray-300'
    }
  ];

  return (
    <section 
      className={`w-full overflow-hidden py-20 md:py-28 lg:py-32 ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Header Block */}
        <div className="text-center mb-12 md:mb-16">
          {/* Super-title Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 backdrop-blur-sm mb-6">
            <span className="text-sm font-semibold text-red-200 uppercase tracking-wider">
              {locale === 'en' ? 'COMPARISON' : 'مقارنة'}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className={clsx(
            'text-3xl md:text-4xl lg:text-5xl font-bold mb-4',
            'bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent',
            isRTL ? 'text-right' : 'text-left'
          )}>
            {locale === 'en' 
              ? 'Takai PPF vs Other Options — Feature-by-Feature'
              : 'تاكاي PPF مقابل الخيارات الأخرى — ميزة بميزة'
            }
          </h1>

          {/* Helper Line */}
          <p className={clsx(
            'text-gray-400 text-sm md:text-base mb-8',
            isRTL ? 'text-right' : 'text-left'
          )}>
            {locale === 'en' 
              ? 'Swipe horizontally on mobile/tablet to compare. First column and header stay sticky.'
              : 'اسحب أفقياً على الجوال/التابلت للمقارنة. العمود الأول والرأس يبقيان ثابتين.'
            }
          </p>

          {/* Legend */}
          <div className={clsx(
            'flex flex-wrap gap-4 justify-center mb-8',
            isRTL && 'flex-row-reverse'
          )}>
            {legendItems.map((item) => (
              <div key={item.key} className="flex items-center gap-2">
                <div className={clsx('w-3 h-3 rounded-full', item.color)} />
                <span className={clsx('text-sm font-medium', item.textColor)}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Table Wrapper */}
        <div className="relative">
          {/* Outer Card with Depth */}
          <div className="rounded-2xl border border-slate-700/50 shadow-2xl bg-slate-900/80 backdrop-blur-sm overflow-hidden group">
            {/* Inner Gradient Layer */}
            <div className="bg-gradient-to-br from-white/5 to-white/0 relative">
              {/* Inset Ring on Hover */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300" />
              
              {/* Table Scroller with Edge Fades */}
              <div 
                ref={scrollerRef}
                className={clsx(
                  'overflow-x-auto scrollbar-gutter-stable touch-pan-x',
                  'relative',
                  // iOS momentum scrolling
                  '[&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-800/50 [&::-webkit-scrollbar-thumb]:bg-slate-600/50 [&::-webkit-scrollbar-thumb]:rounded-full'
                )}
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {/* Edge Fade Masks */}
                <div className={clsx(
                  'absolute top-0 bottom-0 w-8 bg-gradient-to-r from-slate-900/80 to-transparent z-10 pointer-events-none',
                  isRTL ? 'right-0' : 'left-0'
                )} />
                <div className={clsx(
                  'absolute top-0 bottom-0 w-8 bg-gradient-to-l from-slate-900/80 to-transparent z-10 pointer-events-none',
                  isRTL ? 'left-0' : 'right-0'
                )} />

                {/* Swipe Hint Overlay */}
                {!hasScrolled && (
                  <div className={clsx(
                    'absolute top-1/2 z-20 transform -translate-y-1/2 px-3 py-2',
                    'bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-600/50',
                    'text-xs text-gray-300 font-medium pointer-events-none',
                    'animate-pulse transition-opacity duration-1000',
                    isRTL ? 'left-4' : 'right-4'
                  )}>
                  <div className="flex items-center gap-2">
                    <span>
                      {locale === 'en' ? 'Swipe to compare' : 'اسحب للمقارنة'}
                    </span>
                    <span className={clsx('text-lg', isRTL && 'rotate-180')}>→</span>
                  </div>
                </div>
                )}

                {/* Premium Table */}
                <table className="w-full min-w-[800px] relative">
                  <caption className="sr-only">
                    {locale === 'en' 
                      ? 'Comparison table of Takai PPF vs other options'
                      : 'جدول مقارنة تاكاي PPF مع الخيارات الأخرى'
                    }
                  </caption>
                  
                  {/* Sticky Header */}
                  <thead>
                    <tr>
                      {columns.map((column, index) => (
                        <th
                          key={column.key}
                          scope="col"
                          className={headCellClass(index)}
                        >
                          {column[locale]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  
                  {/* Table Body */}
                  <tbody>
                    {rows.map((row, rowIndex) => (
                      <tr 
                        key={rowIndex} 
                        className={clsx(
                          'group/row transition-all duration-300',
                          '@media (prefers-reduced-motion: no-preference) { hover:bg-slate-800/20 }'
                        )}
                      >
                        {/* Sticky First Column */}
                        <th 
                          scope="row"
                          className={rowCellClass(0, true)}
                        >
                          {row.feature[locale]}
                        </th>
                        
                        {/* Data Columns */}
                        <td className={rowCellClass(1)}>
                          <div className="relative z-10">
                            {enhanceContent(row.supa[locale])}
                          </div>
                        </td>
                        <td className={rowCellClass(2)}>
                          {enhanceContent(row.xpel3m[locale])}
                        </td>
                        <td className={rowCellClass(3)}>
                          {enhanceContent(row.china[locale])}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>



        {/* Global CTA Section */}
        <div className="mt-16 md:mt-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className={`text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              {locale === 'en' ? 'Ready to Experience Premium Protection?' : 'مستعد لتجربة الحماية المتميزة؟'}
            </h3>
            <p className={`text-gray-300 mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
              {locale === 'en' 
                ? 'Contact us today for a personalized consultation and quote for your vehicle.'
                : 'اتصل بنا اليوم للحصول على استشارة شخصية وعرض سعر لمركبتك.'
              }
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <a
                href={`tel:${contacts.phone}`}
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl @media (hover: hover) { hover:scale-105 }"
              >
                {locale === 'en' ? 'Call Now' : 'اتصل الآن'}
              </a>
              <a
                href={`https://wa.me/${contacts.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl @media (hover: hover) { hover:scale-105 }"
              >
                {locale === 'en' ? 'WhatsApp' : 'واتساب'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PPFComparison;
