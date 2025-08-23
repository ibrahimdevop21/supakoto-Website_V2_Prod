import React from 'react';

interface StandardizedHeadingProps {
  title: string;
  subtitle?: string;
  locale?: 'en' | 'ar';
  className?: string;
  size?: 'large' | 'medium' | 'small';
}

const StandardizedHeading: React.FC<StandardizedHeadingProps> = ({ 
  title, 
  subtitle, 
  locale = 'en', 
  className = '',
  size = 'large'
}) => {
  const isRTL = locale === 'ar';
  
  const sizeClasses = {
    large: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
    medium: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
    small: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl'
  };

  const subtitleSizeClasses = {
    large: 'text-lg sm:text-xl md:text-2xl',
    medium: 'text-base sm:text-lg md:text-xl',
    small: 'text-sm sm:text-base md:text-lg'
  };

  return (
    <div className={`text-center mb-12 ${className}`}>
      <div className="relative mb-6">
        <h2 
          className={`${sizeClasses[size]} font-bold text-white mb-6 sm:mb-8 leading-tight ${isRTL ? 'font-arabic' : ''}`}
        >
          {title}
        </h2>
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      {subtitle && (
        <p className={`${subtitleSizeClasses[size]} text-gray-200 mb-8 max-w-4xl mx-auto px-4 leading-relaxed font-medium ${isRTL ? 'font-arabic' : ''}`}>
          {subtitle}
        </p>
      )}
      
      {/* Enhanced decorative elements */}
      <div className="flex justify-center items-center space-x-6 mb-6">
        <div className="h-px w-20 bg-gradient-to-r from-transparent via-red-500/60 to-transparent"></div>
        <div className="relative">
          <div className="h-3 w-24 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-full shadow-lg"></div>
          <div className="absolute inset-0 h-3 w-24 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-full animate-pulse opacity-75"></div>
          <div className="absolute -inset-1 h-5 w-26 bg-gradient-to-r from-red-600/20 via-red-500/20 to-orange-500/20 rounded-full blur-sm"></div>
        </div>
        <div className="h-px w-20 bg-gradient-to-l from-transparent via-red-500/60 to-transparent"></div>
      </div>
    </div>
  );
};

export default StandardizedHeading;
