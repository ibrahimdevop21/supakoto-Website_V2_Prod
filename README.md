# SupaKoto - Premium Automotive Services Website

> 🚗 **Modern, luxury automotive services website with comprehensive PPF, ceramic coating, and car care solutions**

SupaKoto is a cutting-edge automotive services website built with **Astro 5.12.9**, **React 18**, and **Tailwind CSS**. The site features a modern, responsive design with full bilingual support (English/Arabic) and RTL layout capabilities.

## ✨ Key Features

### 🌐 **Internationalization & Accessibility**
- **Bilingual Support**: Full English and Arabic language support
- **RTL Layout**: Complete right-to-left layout for Arabic users
- **SEO Optimized**: Proper meta tags, structured data, and semantic HTML
- **Accessibility**: WCAG compliant with proper ARIA labels and focus management

### 🎨 **Modern UI/UX**
- **Luxury Design**: Premium glass morphism effects and gradient backgrounds
- **Responsive**: Mobile-first design optimized for all screen sizes
- **Smart Navigation**: Sticky navbar with scroll-aware behavior
- **Interactive Elements**: Smooth animations and hover effects
- **Performance Optimized**: Lighthouse 90+ score targeting

### 🛠️ **Advanced Components**
- **Video Hero Section**: Responsive video backgrounds with fallback images
- **PPF Comparison Tool**: Interactive comparison tables with tooltips
- **Branch Locator**: Interactive maps with real-time branch information
- **Service Galleries**: Optimized image carousels with lazy loading
- **Contact Forms**: Multi-step forms with validation
- **Testimonials**: Continuous scrolling testimonial carousels

### 🔧 **Technical Excellence**
- **TypeScript**: Full type safety across the codebase
- **Component Architecture**: Clean separation with 9 organized component categories
- **Performance**: Code splitting, lazy loading, and optimized assets
- **Testing**: Jest setup with comprehensive test coverage
- **Development**: Hot reload, TypeScript support, and debugging tools

## 🏗️ Project Structure

```text
SupaKoto-website/
├── public/                          # Static assets
│   ├── logo.svg                     # Brand logo
│   ├── partners/                    # Partner/brand logos
│   ├── supakoto-hero.webm          # Desktop hero video
│   └── supakoto-hero-mobile.webm   # Mobile hero video
├── src/
│   ├── components/                  # React/Astro components
│   │   ├── about/                   # About page components
│   │   │   ├── OurStory.tsx
│   │   │   ├── Timeline.tsx
│   │   │   └── OurPhilosophy.tsx
│   │   ├── carousels/               # Carousel components
│   │   │   ├── Testimonials.astro
│   │   │   ├── Testimonials.tsx
│   │   │   └── testimonials.css
│   │   ├── contact/                 # Contact & location components
│   │   │   ├── ContactForm.tsx
│   │   │   ├── BranchLocator.tsx
│   │   │   ├── ContactHero.tsx
│   │   │   └── BranchMapOnly.tsx
│   │   ├── hero/                    # Hero section components
│   │   │   └── ModernHeroCarousel.astro
│   │   ├── integrations/            # Third-party integrations
│   │   │   ├── RespondIO.tsx        # Chat widget (React)
│   │   │   └── RespondIO.astro      # Chat widget (Astro wrapper)
│   │   ├── layout/                  # Layout components
│   │   │   ├── Navbar.tsx           # Modern sticky navbar
│   │   │   ├── Footer.astro         # Site footer
│   │   │   └── LanguageSwitcher.tsx # i18n language switcher
│   │   ├── services/                # Service-related components
│   │   │   ├── ServiceList.tsx
│   │   │   ├── WhyChooseUs.tsx
│   │   │   ├── OurProcess.tsx
│   │   │   └── PPFTiers.tsx
│   │   ├── shared/                  # Reusable components
│   │   │   ├── PPFComparison.tsx    # Interactive comparison tool
│   │   │   ├── ModernTrustedBy.tsx  # Partner carousel
│   │   │   ├── CallToAction.tsx     # CTA sections
│   │   │   └── OptimizedImage.tsx   # Performance-optimized images
│   │   └── ui/                      # Base UI components
│   │       ├── button.tsx
│   │       ├── dropdown-menu.tsx
│   │       └── switch.tsx
│   ├── data/                        # Static data and configuration
│   │   ├── branches.ts              # Branch locations and info
│   │   ├── navigation.ts            # Site navigation structure
│   │   ├── ppfComparisonData.ts     # PPF comparison data
│   │   └── servicedBrands.ts        # Serviced vehicle brands
│   ├── i18n/                        # Internationalization
│   │   ├── index.ts                 # Main i18n configuration
│   │   └── react.ts                 # React i18n hooks
│   ├── layouts/                     # Page layouts
│   │   └── Layout.astro             # Main site layout
│   ├── locales/                     # Translation files
│   │   ├── en.json                  # English translations
│   │   └── ar.json                  # Arabic translations
│   ├── pages/                       # Route pages
│   │   ├── index.astro              # Homepage
│   │   ├── about.astro              # About page
│   │   ├── services.astro           # Services page
│   │   ├── contact.astro            # Contact page
│   │   └── ar/                      # Arabic routes
│   ├── styles/                      # Global styles
│   │   ├── global.css               # Base styles
│   │   ├── navbar-glass.css         # Navbar glass effects
│   │   ├── rtl-support.css          # RTL layout styles
│   │   └── gallery.css              # Gallery components
│   ├── types/                       # TypeScript definitions
│   │   ├── jest-dom.d.ts            # Jest DOM matchers
│   │   └── storybook.d.ts           # Storybook types
│   └── utils/                       # Utility functions
├── jest.config.js                   # Jest testing configuration
├── jest.setup.ts                    # Jest setup file
├── tailwind.config.mjs              # Tailwind CSS configuration
├── astro.config.mjs                 # Astro configuration
└── tsconfig.json                    # TypeScript configuration
```

## 🛠️ Technology Stack

### **Core Framework**
- **[Astro 5.12.9](https://astro.build/)** - Modern static site generator with islands architecture
- **[React 18](https://react.dev/)** - Interactive UI components with client-side hydration
- **[TypeScript](https://www.typescriptlang.org/)** - Full type safety and enhanced developer experience

### **Styling & UI**
- **[Tailwind CSS 3.3.3](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Tailwind Animate](https://github.com/jamiebuilds/tailwindcss-animate)** - Animation utilities
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Class Variance Authority](https://cva.style/)** - Component variant management

### **Internationalization**
- **[astro-i18n](https://github.com/alexandre-fernandez/astro-i18n)** - Full i18n support with routing
- **RTL Support** - Complete right-to-left layout system for Arabic

### **Maps & Location**
- **[Leaflet](https://leafletjs.com/)** - Interactive maps for branch locations
- **[React Leaflet](https://react-leaflet.js.org/)** - React bindings for Leaflet

### **Carousels & Interactions**
- **[Embla Carousel](https://www.embla-carousel.com/)** - Lightweight carousel library
- **[Motion](https://motion.dev/)** - Performant animations and gestures

### **Development & Testing**
- **[Jest](https://jestjs.io/)** - JavaScript testing framework
- **[Testing Library](https://testing-library.com/)** - Simple and complete testing utilities
- **[Storybook](https://storybook.js.org/)** - Component development environment

### **Performance & Optimization**
- **[Sharp](https://sharp.pixelplumbing.com/)** - High-performance image processing
- **[Astro Compress](https://github.com/astro-community/astro-compress)** - Asset compression
- **Code Splitting** - Automatic bundle optimization
- **Lazy Loading** - Performance-optimized component loading

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x (specified in engines)
- npm (single lockfile - no yarn/pnpm)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd supakoto-website

# Install dependencies
npm ci --no-audit --no-fund

# Start development server
npm run dev
```

## 🏗️ Build & Deployment

### Fast CI/Local Builds (Recommended)
```bash
# Fast local/CI build (used by Vercel) - skips heavy compression
ASTRO_COMPRESS=false npm run build
# OR use the dedicated script:
npm run build:ci
```

### Production Builds
```bash
# Full production build with compression (manual releases only)
ASTRO_COMPRESS=true npm run build
# OR use the standard script:
npm run build:production
```

### Development Commands
```bash
npm run dev          # Start development server
npm run preview      # Preview production build
npm run clean        # Clean node_modules, .astro, and dist
```

### Analysis & Performance
```bash
# Analyze bundles with visualizer
ANALYZE=true npm run build && open dist/bundle-analysis.html

# Performance testing
npm run test:performance    # Lighthouse mobile + desktop
npm run lighthouse:mobile   # Mobile-only Lighthouse audit
npm run lighthouse:desktop  # Desktop-only Lighthouse audit
```

## 🚀 Vercel Deployment Settings

**Install Command:** `npm ci --no-audit --no-fund`  
**Build Command:** `npm run build:ci`  
**Output Directory:** `dist`  
**Node Version:** `20.x`

### Environment Variables (Optional)
- `ASTRO_COMPRESS=false` (automatically set by build:ci script)
- `ASTRO_LOG_LEVEL=info` (for better CI logging)

## ⚡ Performance Optimizations

### Build Speed Optimizations
- **Compression Guarded**: `astro-compress` disabled in CI via `ASTRO_COMPRESS=false`
- **Sourcemaps Disabled**: No sourcemaps in production builds
- **Static Output**: Pure static site generation (no SSR)
- **Bundle Splitting**: Optimized Vite chunks for faster builds

### Runtime Performance Features
- **Lazy Loading**: Respond.io widget loads on `client:idle`
- **Interactive Maps**: Leaflet maps load on user interaction
- **React Islands**: Optimized hydration with `client:visible` and `client:idle`
- **Image Optimization**: WebP/AVIF with proper dimensions
- **Critical CSS**: Inlined above-the-fold styles

### Performance Targets
- **Lighthouse Mobile**: ≥ 90
- **Lighthouse Desktop**: ≥ 95
- **CLS**: < 0.1
- **TBT**: < 300ms
- **Initial JS per route**: ≤ 120KB (gzipped, excluding framework)

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                     | Action                                           |
| :-------------------------- | :----------------------------------------------- |
| `npm install`               | Installs dependencies                            |
| `npm run dev`               | Starts local dev server at `localhost:4321`     |
| `npm run build`             | Build your production site to `./dist/`         |
| `npm run build:production`  | Production build with optimizations             |
| `npm run preview`           | Preview your build locally, before deploying    |
| `npm run lighthouse`        | Run Lighthouse performance audit                 |
| `npm run test`              | Run Jest tests                                   |
| `npm run astro ...`         | Run CLI commands like `astro add`, `astro check`|
| `npm run astro -- --help`   | Get help using the Astro CLI                    |

## 📊 Performance Optimizations

The website is optimized for maximum performance with:

- **Lighthouse Score**: Targeting 90+ across all metrics
- **Image Optimization**: WebP format with responsive sizing
- **Code Splitting**: Automatic bundle optimization
- **Lazy Loading**: Components load only when needed
- **Critical CSS**: Inline critical styles for faster rendering
- **Asset Compression**: Gzip/Brotli compression enabled
- **CDN Ready**: Optimized for static hosting and CDN deployment

## 🔌 Integrations

### ✅ **Currently Implemented**
- **respond.io Chat Widget**: Production-ready chat integration with lazy loading
- **Leaflet Maps**: Interactive branch location maps
- **Performance Monitoring**: Lighthouse auditing and optimization
- **TypeScript**: Full type safety across the codebase
- **Testing Suite**: Jest with DOM testing utilities

### 🚧 **Pending Integrations**
- **Meta Tags & SEO**: Enhanced meta tag management and structured data
- **Google Analytics**: GA4 integration with privacy compliance
- **Google Tag Manager**: Comprehensive tag management system
- **Sidecar for SSG**: Static site generation enhancements
- **Asset Pipeline**: Advanced image optimization and CDN integration
- **Chat Widget Finalization**: Complete respond.io setup with proper cId

## 🚀 Deployment Options

### **Recommended: Static Hosting (cPanel/Shared Hosting)**
```bash
npm run build:production
# Upload ./dist/ contents to your hosting provider
```

### **Vercel Deployment**
1. Push your code to a Git repository
2. Import the project in the Vercel dashboard
3. Vercel will automatically detect Astro and use correct build settings
4. Your site will be deployed at a Vercel URL

### **Manual CLI Deployment**
```bash
npm run build
vercel --prod
```

### **Other Hosting Providers**
- **Netlify**: Automatic Astro detection
- **GitHub Pages**: Static deployment via GitHub Actions
- **AWS S3**: Static website hosting
- **Cloudflare Pages**: Edge deployment with global CDN
