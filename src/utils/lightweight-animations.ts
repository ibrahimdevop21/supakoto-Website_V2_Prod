/**
 * Lightweight Animation Utilities
 * Replaces Framer Motion to reduce bundle size by ~200KB
 */

// CSS-based animations using Web Animations API
export const createFadeInAnimation = (element: HTMLElement, duration = 300) => {
  return element.animate([
    { opacity: 0, transform: 'translateY(20px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], {
    duration,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    fill: 'forwards'
  });
};

export const createSlideAnimation = (element: HTMLElement, direction: 'left' | 'right', duration = 500) => {
  const translateX = direction === 'left' ? '-100%' : '100%';
  return element.animate([
    { transform: `translateX(${translateX})`, opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 }
  ], {
    duration,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fill: 'forwards'
  });
};

export const createScaleAnimation = (element: HTMLElement, scale = 1.05, duration = 200) => {
  return element.animate([
    { transform: 'scale(1)' },
    { transform: `scale(${scale})` }
  ], {
    duration,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    fill: 'forwards'
  });
};

// CSS classes for common animations (even lighter weight)
export const animationClasses = {
  fadeIn: 'animate-fade-in',
  slideInLeft: 'animate-slide-in-left',
  slideInRight: 'animate-slide-in-right',
  scaleHover: 'hover:scale-105 transition-transform duration-200 ease-out',
  fadeInUp: 'animate-fade-in-up',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce'
};

// Intersection Observer for scroll-triggered animations
export const createScrollAnimation = (
  elements: NodeListOf<Element> | Element[],
  animationClass: string,
  threshold = 0.1
) => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add(animationClass);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold, rootMargin: '50px' });

  elements.forEach((element) => observer.observe(element));
  return observer;
};

// [Function removed - now handled directly in OptimizedHeroCarousel component]

// Performance-optimized hover effects
export const addHoverEffect = (element: HTMLElement, scale = 1.05) => {
  let isHovering = false;
  
  const handleMouseEnter = () => {
    if (!isHovering) {
      isHovering = true;
      createScaleAnimation(element, scale, 200);
    }
  };
  
  const handleMouseLeave = () => {
    if (isHovering) {
      isHovering = false;
      createScaleAnimation(element, 1, 200);
    }
  };
  
  element.addEventListener('mouseenter', handleMouseEnter, { passive: true });
  element.addEventListener('mouseleave', handleMouseLeave, { passive: true });
  
  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};
