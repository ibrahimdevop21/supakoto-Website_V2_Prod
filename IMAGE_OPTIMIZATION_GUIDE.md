
# Image Optimization Implementation Guide

## Replace existing img tags with OptimizedImage component:

### Before:
```jsx
<img 
  src="/hero-image.jpg" 
  alt="Hero image" 
  className="w-full h-full object-cover"
/>
```

### After:
```jsx
<OptimizedImage
  src="/hero-image.jpg"
  alt="Hero image"
  width={1920}
  height={1080}
  className="w-full h-full object-cover"
  priority={true}
  sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
/>
```

## Key Benefits:
- Automatic responsive images with srcset
- Lazy loading for non-critical images
- Proper aspect ratio to prevent layout shifts
- Loading states and error handling
- Optimized for Core Web Vitals

## Usage in Components:
1. Import: `import { OptimizedImage } from './OptimizedImage';`
2. Replace all `<img>` tags with `<OptimizedImage>`
3. Add explicit width/height for layout stability
4. Use priority={true} for above-the-fold images
