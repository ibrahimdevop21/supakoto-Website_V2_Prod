import React from 'react';

interface CarouselSlideProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

const CarouselSlide: React.FC<CarouselSlideProps> = ({
  children,
  className = '',
  index
}) => {
  return (
    <div className={`embla__slide flex-shrink-0 min-w-0 relative ${className}`} data-index={index}>
      {children}
    </div>
  );
};

export default CarouselSlide;
