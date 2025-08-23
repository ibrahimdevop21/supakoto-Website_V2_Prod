
import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '100vw'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Generate responsive srcSet
  const generateSrcSet = (baseSrc: string) => {
    const ext = baseSrc.split('.').pop();
    const baseName = baseSrc.replace(`.${ext}`, '');
    
    return [
      `${baseName}-400w.${ext} 400w`,
      `${baseName}-800w.${ext} 800w`,
      `${baseName}-1200w.${ext} 1200w`,
      `${baseName}-1600w.${ext} 1600w`
    ].join(', ');
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      {!isLoaded && !error && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{ aspectRatio: `${width}/${height}` }}
        >
          <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        src={src}
        srcSet={generateSrcSet(src)}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        style={{ aspectRatio: `${width}/${height}` }}
      />
      
      {error && (
        <div 
          className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500"
          style={{ aspectRatio: `${width}/${height}` }}
        >
          <span className="text-sm">Image failed to load</span>
        </div>
      )}
    </div>
  );
};
