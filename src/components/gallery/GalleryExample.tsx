import React from 'react';
import Gallery, { type GalleryItem } from './Gallery';

// Generate filenames for 238 images
const FILENAMES = Array.from({ length: 238 }, (_, i) => 
  `supa-${String(i + 1).padStart(3, '0')}.webp`
);

// Map filenames to gallery items
const generateGalleryItems = (): GalleryItem[] => {
  return FILENAMES.map(filename => ({
    id: filename,
    src: `/gallery/full/${filename}`,
    thumbSrc: `/gallery/thumbs/${filename}`,
    alt: filename.replace(/\.webp$/, '').toUpperCase(),
    // Optional: Add blur data URLs if you have them
    // blurDataURL: `/gallery/blur/${filename.replace('.webp', '.jpg')}`
  }));
};

// Usage example component
export default function GalleryExample() {
  const items = generateGalleryItems();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          SupaKoto Gallery
        </h1>
        
        <Gallery 
          items={items}
          initialIndex={0}
          className="bg-neutral-950 p-6 rounded-3xl"
        />
        
        <div className="mt-6 text-center text-neutral-400 text-sm">
          {items.length} high-quality images • Swipe or use arrow keys to navigate
        </div>
      </div>
    </div>
  );
}

// Alternative: Direct data generation for use in Astro pages
export const galleryData = {
  filenames: FILENAMES,
  items: generateGalleryItems(),
  
  // Helper to get a specific range of items
  getItemsRange: (start: number, count: number): GalleryItem[] => {
    const items = generateGalleryItems();
    return items.slice(start, start + count);
  },
  
  // Helper to get item by filename
  getItemByFilename: (filename: string): GalleryItem | undefined => {
    const items = generateGalleryItems();
    return items.find(item => item.id === filename);
  }
};

// Example usage in an Astro page:
/*
---
// src/pages/gallery.astro
import GalleryExample from '../components/gallery/GalleryExample';
import { galleryData } from '../components/gallery/GalleryExample';

// You can also use the data directly:
const firstTenImages = galleryData.getItemsRange(0, 10);
---

<html>
  <head>
    <title>Gallery</title>
  </head>
  <body>
    <GalleryExample client:load />
  </body>
</html>
*/
