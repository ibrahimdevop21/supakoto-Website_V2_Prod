# SupaKoto Design System

**Version:** 1.0.0  
**Status:** In Migration (B+ → A++)

---

## Overview

This design system provides a unified, token-based architecture for the SupaKoto website theme. All visual styling is centralized through CSS variables (design tokens) and semantic utility classes.

**Goal:** Zero visual changes, 100% maintainability improvement.

---

## Design Tokens

All tokens are defined in `src/styles/theme-tokens.css`.

### Brand Colors
- `--brand-primary`: #bf1e2e (SupaKoto Red)
- `--brand-accent`: #6a343a (Deep Burgundy)

### Functional Colors
- `--color-whatsapp`: #25D366
- `--color-call`: #f59e0b

### Background Layers
- `--bg-card`: rgba(15, 23, 42, 0.4) - Card backgrounds
- `--bg-input`: rgba(15, 23, 42, 0.6) - Form inputs
- `--bg-overlay-medium`: rgba(0, 0, 0, 0.7) - Overlays

### Borders
- `--border-default`: #334155 (slate-700)
- `--border-focus`: rgba(191, 30, 46, 0.6)

### Text
- `--text-primary`: #ffffff
- `--text-secondary`: #e5e7eb
- `--text-muted`: #94a3b8

---

## Background Layer System

**Hierarchy:** BASE → SURFACE → CARD → INPUT → OVERLAY

### Classes
- `.bg-base` - Body gradient (applied to `<body>`)
- `.bg-surface` - Transparent section background
- `.bg-surface-muted` - Subtle section overlay
- `.bg-card` - Standard card (includes blur + border)
- `.bg-card-elevated` - Elevated card (more prominent)
- `.bg-input` - Form input background
- `.bg-overlay-light/medium/heavy` - Modal overlays

---

## Button System

Three standardized variants in `src/styles/theme-buttons.css`:

### Classes
- `.btn-primary` - Main CTAs (red)
- `.btn-secondary` - Alternative CTAs (transparent + border)
- `.btn-whatsapp` - WhatsApp CTAs (green)

### Size Variants
- `.btn-sm` - Small (40px height)
- Default - Standard (56px height)
- `.btn-lg` - Large (64px height)

### Example
```html
<button class="btn-primary">Get Started</button>
<button class="btn-secondary">Learn More</button>
<a href="https://wa.me/..." class="btn-whatsapp">Chat on WhatsApp</a>
```

---

## Container System

Defined in `src/styles/theme-layout.css`:

### Classes
- `.container-custom` - Standard container (max-width: 1280px)
- `.container-narrow` - Narrow container (max-width: 768px)
- `.container-full` - Full-width container

### Section Spacing
- `.section-spacing` - Standard (48px → 64px)
- `.section-spacing-lg` - Featured (48px → 64px → 80px → 96px)

### Standard Pattern
```html
<section class="section-spacing">
  <div class="container-custom">
    <!-- Content -->
  </div>
</section>
```

---

## Migration Status

### ✅ Completed
- Token foundation created
- Utility classes implemented
- Documentation created

### 🚧 In Progress
- Pilot component migration
- Hardcoded value elimination

### ⏳ Pending
- Full site migration
- Old system cleanup

---

## Usage Rules

### ✅ DO
- Use semantic tokens: `var(--brand-primary)`
- Use layer classes: `.bg-card`, `.bg-input`
- Use button classes: `.btn-primary`
- Use container classes: `.container-custom`

### ❌ DON'T
- Hardcode colors: `#bf1e2e`, `#25D366`
- Use inline opacity: `bg-slate-900/40`
- Create custom button styles
- Mix container patterns

---

## Quick Reference

**Need a card?**
```html
<div class="bg-card p-6">Content</div>
```

**Need a button?**
```html
<button class="btn-primary">Action</button>
```

**Need a section?**
```html
<section class="section-spacing">
  <div class="container-custom">Content</div>
</section>
```

**Need a color?**
```css
color: var(--brand-primary);
background-color: var(--bg-card);
border-color: var(--border-default);
```

---

## Files

- `src/styles/theme-tokens.css` - All design tokens
- `src/styles/theme-layers.css` - Background layer utilities
- `src/styles/theme-buttons.css` - Button system
- `src/styles/theme-layout.css` - Container & spacing utilities

---

**For detailed migration guide, see internal documentation.**
