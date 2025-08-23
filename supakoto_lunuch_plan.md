
# SupaKoto Launch & Improvement Plan

## 1) Deployment (cPanel Static Hosting)
- SupaKoto is a fully static site (Astro with no server adapter). Build it with `npm run build` (or `astro build`) to generate the `dist/` folder containing all HTML/CSS/JS assets:contentReference[oaicite:0]{index=0}. Upload the contents of `dist/` to your cPanel host (usually `public_html`). 
- If deploying into a subfolder (e.g. not at root), ensure Astro’s `base` setting (in `astro.config.mjs`) matches that path so routes resolve correctly. You can use a `.htaccess` file for URL rewriting if needed, but often the generated HTML `index.html` files suffice.
- Set `NODE_ENV=production` to enable optimized builds. After upload, verify each route works (e.g. `/`, `/about`, `/ar/`) and links are correct. Static hosting on cPanel is supported since the site is pre-rendered – no special server setup is required:contentReference[oaicite:1]{index=1}.

## 2) SEO & Performance Focus
- **SEO Best Practices:** Follow Google’s guidelines: produce high-quality, user-focused content with a clear site structure:contentReference[oaicite:2]{index=2}. Ensure each page has a unique, descriptive `<title>` and `<meta name="description">`. Use proper heading hierarchy and include `lang="en"`/`lang="ar"` on the `<html>` tag. Provide an up-to-date `robots.txt` and (if applicable) a `sitemap.xml`. Include `<link rel="alternate" hreflang>` tags so search engines recognize the English and Arabic versions. 
- **Performance Optimization:** Static sites serve pre-generated HTML and assets, so they can load very quickly:contentReference[oaicite:3]{index=3}. However, heavy assets can still slow them down. The hero videos (~9.8MB total) are large – consider compressing them or using a lower-resolution fallback image on mobile. Use modern image formats (WebP/AVIF) and add `loading="lazy"` on images/videos. Minimize client-side scripts and hydrate only necessary components. According to performance audits, a static page “full of assets” must serve them efficiently:contentReference[oaicite:4]{index=4}. Run Lighthouse audits and aim for 90+ scores by removing unused CSS/JS, enabling compression (e.g. gzip), and deferring render-blocking resources.

## 3) Internationalization (i18n) & Routing
- The project uses Astro’s i18n routing (via `astro-i18n`) for English and Arabic. Confirm `astro.config.mjs` lists both `locales: ["en","ar"]` with `defaultLocale: "en"`. With the default (`prefixDefaultLocale: false`), English pages live at the root (`/about`, `/services`) and Arabic pages are under `/ar/` (e.g. `src/pages/ar/about.astro` → `/ar/about`):contentReference[oaicite:5]{index=5}. This matches Astro’s recommended file-based structure, so locale URLs should resolve correctly.
- Verify the language switcher in the Navbar uses the correct locale URLs (Astro provides helpers like `getRelativeLocaleUrl`). All page links (navigation, footer, etc.) should respect the current locale so users can toggle between English and Arabic seamlessly. In practice, `/page` should link to English and `/ar/page` to Arabic content.

## 4) Branch Locator UI/UX Improvements
- Add location search and geolocation features. Include a text input (city/address) and a **“Use My Location”** button on the locations page. Nielsen Norman’s research recommends geolocation to streamline store locators:contentReference[oaicite:6]{index=6}. This lets users automatically find their nearest branch. 
- Display results both on the map and in a list of branch details (address, hours, phone). Ensure each branch marker on the Leaflet map can be clicked to show its info. Since ~80% of users start at a search engine for locations:contentReference[oaicite:7]{index=7}, make the on-site locator obvious and user-friendly. Maintain an up-to-date list of branch info (addresses, services, hours) in `branches.ts` – this improves user trust and makes the information crawlable by search engines:contentReference[oaicite:8]{index=8}.

## 5) Design Guidelines & Consistency
- **Tailwind Design System:** Leverage the Tailwind config as the single source of design tokens (colors, fonts, spacing). Tailwind’s utility classes enforce consistency: “every component and element follows the same design rules”:contentReference[oaicite:9]{index=9}. For example, use the custom color palette and font sizes defined in `tailwind.config.js` for all components (buttons, headers, text). This ensures a unified look across the site.
- **Reusable Components:** Refactor UI elements into shared components (e.g. buttons, cards, form controls) that use Tailwind classes and CSS variables. Remove any hardcoded styling. Document the design guidelines (brand colors, typography scale, spacing) so all developers apply them uniformly. Test RTL styling: since `tailwindcss-rtl` is enabled, verify that Arabic pages correctly mirror layouts and that spacing/padding swap appropriately.
- **Accessibility & Visual Consistency:** Use a consistent icon set and style. Ensure sufficient color contrast and visible focus states. Add `alt` text to all images and `aria-labels`/`aria-hidden` as needed. By aligning styles and accessibility practices, the UI will feel polished and cohesive.

## 6) Components & Features to Rebuild
- **Navbar (Layout/Navbar.tsx):** Smart sticky header with logo, menu links, language toggle, and persistent Call/WhatsApp buttons. Ensure the mobile menu (burger) and desktop menu follow the new design, with proper hover/focus styles.
- **Footer:** If missing or outdated, include site links, contact info, and social icons in the footer. Style it according to the design system (consistent spacing and fonts).
- **Hero Section:** Full-width video background (with poster image fallback) or carousel. Overlay the main headline and a Call-to-Action button. Provide a smaller video or image alternative on mobile for performance.
- **Services List:** Grid or list of service offering cards. Each card should have an icon or image, a title, and a short description. Ensure both EN/AR content is present.
- **Testimonials Carousel:** Create an Embla-based slider for client testimonials or reviews. Include client photos or icons, and auto-play or manual navigation.
- **Partners/Brands Section:** Carousel or grid of partner logos, possibly auto-scrolling. Add subtle animations on hover.
- **Gallery/Work Slider:** Implement a responsive image carousel (Embla) on the Gallery page, showcasing project images. Use `srcset` or `<picture>` for responsive images.
- **Offers Page:** Layout for current promotions (cards or sections with images and text).
- **FAQ Accordion:** An accessible accordion component for FAQs. Each question expands to show the answer.
- **Locations Map:** The interactive Leaflet map with branch markers, as noted above, plus a sidebar/list of branches.
- **Contact Forms:** Rebuild the B2B contact form and any general contact form. Include form validation and a success message. Integrate with an email service or CRM if required.
- **SEO/Meta:** Add missing `<head>` metadata on each page (Open Graph tags, canonical URLs, `description`). Generate or update `sitemap.xml` to include all pages.
- **Performance Features:** Apply lazy-loading to images/videos (`loading="lazy"`). Code-split any large JS. Ensure no unused CSS is shipped (Tailwind purge).
- **Analytics/Tracking:** (Post-launch) Integrate Google Analytics, Facebook Pixel, or other tracking as needed for business insights.

## 7) Launch Plan & Next Steps
- **Immediate Cleanup:** Remove any outdated or unused code (e.g. `_deprecated` folders). Run `npm run build:production` to catch errors. Fix build issues promptly. Audit content for any missing pieces.
- **Testing:** Use `npm run preview` or a staging URL to test end-to-end. Verify all pages load correctly (English and Arabic), navigation works, forms submit, and media plays. Run the Lighthouse performance script (`npm run performance:test`) to flag critical issues (like missing `alt` tags or large files) and address them if possible.
- **Deployment:** Upload the final `dist/` content to cPanel and point the domain. After deployment, manually browse the live site and check for 404s or console errors. Ensure `robots.txt` is present and (if created) `sitemap.xml` is accessible.
- **Post-Launch:** Submit the site to Google Search Console for indexing. Monitor site analytics and search ranking. Schedule further improvements based on this plan: compress remaining images, refine load performance, enhance accessibility, and ensure the design system is followed as new content is added. 

