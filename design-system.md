# SupaKoto Design & Animation System

This document outlines the complete design system for the SupaKoto website, ensuring a unified, premium, and modern user experience. It is inspired by Japanese precision, luxury automotive culture, and a sleek, dark aesthetic.

---

## 🎨 Color Palette & Theme Guidelines

The color palette is designed to be minimal, luxurious, and high-contrast, with a signature red accent that embodies the SupaKoto brand.

- **Background**: `#0e0e0f` (Primary dark background)
  - *Tailwind*: `bg-[#0e0e0f]` or `bg-gray-950` (if configured)
- **Surface**: `#1a1a1c` (For cards, modals, and elevated surfaces)
  - *Tailwind*: `bg-[#1a1a1c]` or `bg-gray-900`
- **Accent Red**: `#e32636` (For CTAs, icons, active states, and hover effects)
  - *Tailwind*: `bg-[#e32636]` or `text-[#e32636]`
- **Text Heading**: `#ffffff` (For primary headings and titles)
  - *Tailwind*: `text-white`
- **Text Body**: `#b0b0b0` (For paragraphs and secondary text)
  - *Tailwind*: `text-gray-400`
- **Border/Outline**: `#2e2e30` (For subtle borders and dividers)
  - *Tailwind*: `border-[#2e2e30]` or `border-gray-700`

---

## 💎 Component Styling Presets (Tailwind CSS)

These presets provide consistent styling for all major UI components.

### Buttons

- **Primary CTA**:
  ```html
  <button class="px-6 py-3 bg-[#e32636] text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-transform transform hover:scale-105">
    Book Now
  </button>
  ```
- **Secondary Button**:
  ```html
  <button class="px-6 py-3 bg-transparent border border-[#2e2e30] text-white font-semibold rounded-lg hover:bg-[#1a1a1c] hover:border-red-600 transition-all">
    Learn More
  </button>
  ```

### Service Cards

Minimal dark cards with a soft shadow and a red accent on hover.

```html
<div class="bg-[#1a1a1c] p-8 rounded-xl shadow-lg border border-transparent hover:border-[#e32636] transition-all duration-300 transform hover:-translate-y-2">
  <h3 class="text-2xl font-bold text-white mb-4">Paint Protection Film</h3>
  <p class="text-gray-400">Our premium PPF service ensures your vehicle's paint is shielded from scratches, chips, and environmental damage.</p>
</div>
```

### Hero Section

Split layout with a Japanese-inspired heading and a high-quality image.

```html
<section class="grid md:grid-cols-2 items-center gap-12 py-24">
  <div>
    <h1 class="text-5xl md:text-7xl font-bold tracking-tight text-white">
      <span class="block">卓越の保護</span>
      <span class="block text-[#e32636]">Unmatched Precision.</span>
    </h1>
    <p class="mt-6 text-lg text-gray-400">Experience the pinnacle of automotive care with SupaKoto's master detailing and protection services.</p>
  </div>
  <div>
    <img src="/path/to/hero-image.jpg" alt="Luxury Car" class="rounded-lg shadow-2xl" />
  </div>
</section>
```

### Section Headings

Large, bold text with an optional gradient accent.

```html
<h2 class="text-4xl md:text-5xl font-bold text-center text-white tracking-tight">
  Our <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Services</span>
</h2>
```

### Image Gallery

Dark background with a glowing active border and a zoom effect on hover.

```html
<div class="relative group overflow-hidden rounded-lg">
  <img src="/path/to/gallery-image.jpg" alt="Gallery Image" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
  <div class="absolute inset-0 border-2 border-transparent group-hover:border-[#e32636] group-hover:shadow-[0_0_15px_#e32636] transition-all duration-300 rounded-lg"></div>
</div>
```

### Testimonials

Carousel with a clean layout for the quote, rating, and client details.

```html
<div class="bg-[#1a1a1c] p-8 rounded-xl text-center">
  <div class="flex justify-center mb-4">
    <!-- 5-star rating component -->
  </div>
  <p class="text-gray-400 italic">"The best service I have ever received. My car looks brand new!"</p>
  <div class="mt-6 flex items-center justify-center">
    <img src="/path/to/avatar.jpg" alt="Client" class="w-12 h-12 rounded-full mr-4" />
    <div>
      <p class="font-bold text-white">Ahmed Hassan</p>
      <p class="text-sm text-gray-500">Dubai, UAE</p>
    </div>
  </div>
</div>
```

### Call to Action (CTA) Blocks

High-contrast gradient background with a bold call to action.

```html
<div class="bg-gradient-to-r from-[#e32636] to-black p-12 rounded-lg text-center">
  <h2 class="text-3xl font-bold text-white">Ready for the SupaKoto Experience?</h2>
  <p class="text-gray-300 mt-4 mb-8">Contact us today to schedule your appointment.</p>
  <button class="px-8 py-3 bg-white text-black font-bold rounded-lg shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-105">
    Get a Quote
  </button>
</div>
```

---

## 🎞️ Animation Guidelines (Framer Motion)

Animations should be smooth, subtle, and purposeful, enhancing the user experience without being distracting.

### Section Entry Animation

Fade and slide-up effect for sections as they enter the viewport.

```jsx
import { motion } from 'framer-motion';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: 'easeOut' }
  },
};

<motion.section
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
  variants={sectionVariants}
>
  {/* Section content */}
</motion.section>
```

### Button Hover Animation

Subtle scale effect on hover for interactive elements.

```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="..."
>
  Click Me
</motion.button>
```

### Staggered List Animation

Staggered entrance for lists of cards or testimonials.

```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {/* Card content */}
    </motion.div>
  ))}
</motion.div>
```

### CTA Button Pulse Animation

A subtle pulse or glowing border to draw attention to the primary CTA.

```jsx
<motion.button
  animate={{
    boxShadow: [
      '0 0 0 0 rgba(227, 38, 54, 0.7)',
      '0 0 0 10px rgba(227, 38, 54, 0)',
    ],
  }}
  transition={{
    duration: 1.5,
    repeat: Infinity,
    repeatType: 'loop',
  }}
  className="..."
>
  Important Action
</motion.button>
```

---

## 🧠 Typography & Layout

### Fonts
- **Primary**: `Inter` (for UI elements and body text)
- **Headings**: `Poppins` or `Noto Sans JP` (for a modern, sleek look)

### Styles
- **Headings**: `text-3xl md:text-5xl font-bold tracking-tight text-white`
- **Body**: `text-base text-gray-400`

### Layout
- **Section Padding**: `py-16 md:py-24 px-4 md:px-12`
- **Container**: `max-w-7xl mx-auto`

---

## ⚙️ Utility & UX Touches

- **Responsive Design**: Use Tailwind's `sm`, `md`, `lg`, `xl` breakpoints for all layouts.
- **Anchor Links**: Add `scroll-mt-24` to anchor-linked sections to account for a fixed header.
- **Image Loading**: Use lazy loading (`loading="lazy"`) and a blur-up effect for all images to improve performance.
- **Floating WhatsApp CTA**: Implement a fixed CTA button for easy access on mobile devices.

  ```html
  <a href="..." class="fixed bottom-5 right-5 z-50 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg md:hidden">
    <!-- WhatsApp Icon -->
  </a>
  ```

---

## ✨ Bonus: Add-on Suggestions

- **Radial Gradients**: Use subtle radial gradients to add depth to backgrounds.
  - `bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 to-gray-950`
- **SVG Noise**: Add a subtle SVG noise pattern as a background overlay for a textured feel.
- **Glassmorphism**: Use `backdrop-blur` selectively for modal overlays or fixed headers to create a modern, layered look.
