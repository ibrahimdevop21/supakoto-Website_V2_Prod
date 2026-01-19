# Vercel Analytics Tracking Implementation

This document outlines all the custom events tracked using Vercel Analytics across the SupaKoto website.

## Overview

The website uses dual tracking:
1. **GTM (Google Tag Manager)** - Existing implementation via dataLayer
2. **Vercel Analytics** - New implementation using `@vercel/analytics`

Both tracking systems fire simultaneously for all events via the centralized tracking library at `src/lib/track.ts`.

## Installation

```bash
npm install @vercel/analytics@^1.5.0
```

Already installed in package.json.

## Tracking Library

Location: `src/lib/track.ts`

All tracking functions automatically send events to both GTM and Vercel Analytics.

## Custom Events Tracked

### 1. WhatsApp Interactions

#### `whatsapp_float_click`
- **Location**: Floating WhatsApp button (bottom-right)
- **Component**: `src/components/WhatsAppFloat.astro`
- **Data**:
  - `location`: 'floating_button'
  - `phone`: WhatsApp number
  - `lang`: 'en' | 'ar'
  - `cta_position`: 'float'

#### `whatsapp_hero_click`
- **Location**: Hero section WhatsApp CTA
- **Component**: `src/components/hero/ModernHeroCarousel.astro`
- **Data**:
  - `location`: 'hero'
  - `phone`: WhatsApp number
  - `cta_position`: 'hero'

#### `whatsapp_click`
- **Location**: Action buttons (sticky/inline)
- **Component**: `src/components/layout/ActionButtons.tsx`
- **Data**:
  - `branch`: Branch ID
  - `phone`: WhatsApp number
  - `location`: 'action_buttons'
  - `lang`: 'en' | 'ar'

#### `whatsapp_footer_click`
- **Location**: Footer WhatsApp links
- **Component**: `src/components/layout/Footer.astro`
- **Data**:
  - `location`: 'footer'
  - `phone`: WhatsApp number
  - `lang`: 'en' | 'ar'

#### `whatsapp_branch_click`
- **Location**: Branch cards
- **Component**: `src/components/contact/StaticBranchCards.tsx`
- **Data**:
  - `branch`: Branch ID
  - `phone`: WhatsApp number
  - `location`: 'branch_card'

### 2. Call/Phone Interactions

#### `call_click`
- **Location**: Action buttons
- **Component**: `src/components/layout/ActionButtons.tsx`
- **Data**:
  - `branch`: Branch ID
  - `phone`: Phone number
  - `location`: 'action_buttons'
  - `lang`: 'en' | 'ar'

#### `call_hero_click`
- **Location**: Hero section (if applicable)
- **Data**:
  - `location`: 'hero'
  - `phone`: Phone number

#### `call_footer_click`
- **Location**: Footer phone links
- **Data**:
  - `location`: 'footer'
  - `phone`: Phone number
  - `lang`: 'en' | 'ar'

#### `call_branch_click`
- **Location**: Branch cards
- **Data**:
  - `branch`: Branch ID
  - `phone`: Phone number
  - `location`: 'branch_card'

### 3. CTA Button Clicks

#### `hero_cta_click`
- **Location**: Hero primary CTA (Protect Your Car Today)
- **Component**: `src/components/hero/ModernHeroCarousel.astro`
- **Data**:
  - `cta_type`: 'primary'
  - `cta_text`: 'protect_your_car'
  - `location`: 'hero'
  - `lang`: 'en' | 'ar'

#### `secondary_cta_click`
- **Location**: Hero secondary CTA (See Our Work)
- **Component**: `src/components/hero/ModernHeroCarousel.astro`
- **Data**:
  - `cta_type`: 'gallery'
  - `cta_text`: 'see_our_work'
  - `location`: 'hero'
  - `lang`: 'en' | 'ar'

#### `service_cta_click`
- **Location**: Service cards/sections
- **Data**:
  - `service`: Service name
  - `location`: Component location
  - `lang`: 'en' | 'ar'

### 4. Form Submissions (Server-Side)

#### `form_submit`
- **Location**: Contact form API
- **Component**: `src/pages/api/contact.ts`
- **Type**: Server-side tracking
- **Data**:
  - `form_type`: 'contact'
  - `services`: Comma-separated service list
  - `country`: Country code
  - `branch`: Branch ID
  - `has_car_info`: 'yes' | 'no'
  - `whatsapp_only`: 'yes' | 'no'
  - `payment_options`: 'yes' | 'no'

#### `business_contact_submit`
- **Location**: Business inquiry form API
- **Component**: `src/pages/api/business-contact.ts`
- **Type**: Server-side tracking
- **Data**:
  - `inquiry_type`: 'franchise' | 'partnership' | 'other'
  - `country`: Country code
  - `has_company`: 'yes' | 'no'

#### `lead_submit`
- **Location**: Lead generation forms
- **Data**:
  - Similar to `form_submit`

### 5. Contact Wizard Events

#### `contact_wizard_step_view`
- **Location**: Contact wizard
- **Component**: `src/components/contact/ContactWizard.tsx`
- **Data**:
  - `step`: Step number
  - `lang`: 'en' | 'ar'

#### `contact_wizard_step_next`
- **Location**: Contact wizard
- **Data**:
  - `step`: Step number
  - `lang`: 'en' | 'ar'

#### `contact_wizard_service_toggle`
- **Location**: Contact wizard
- **Data**:
  - `service`: Service name
  - `step`: Step number

### 6. Navigation Events

#### `nav_click`
- **Location**: Main navigation
- **Data**:
  - `link`: Link text/destination
  - `lang`: 'en' | 'ar'

#### `footer_link_click`
- **Location**: Footer navigation
- **Data**:
  - `link`: Link text/destination
  - `section`: Footer section
  - `lang`: 'en' | 'ar'

## Usage Examples

### Client-Side Tracking

```typescript
import { trackWhatsAppFloat, trackHeroCTA } from '@/lib/track';

// Track WhatsApp click
trackWhatsAppFloat({
  location: 'floating_button',
  phone: '971506265404',
  lang: 'en',
  cta_position: 'float'
});

// Track CTA click
trackHeroCTA({
  cta_type: 'primary',
  cta_text: 'protect_your_car',
  location: 'hero',
  lang: 'en'
});
```

### Server-Side Tracking

```typescript
import { track } from '@vercel/analytics/server';

// In API route
await track('form_submit', {
  form_type: 'contact',
  services: 'ppf,ceramic',
  country: 'AE',
  branch: 'dubai'
});
```

## Viewing Events in Vercel Dashboard

1. Go to your Vercel dashboard
2. Select the SupaKoto project
3. Click the **Analytics** tab
4. Scroll to the **Events** panel
5. Click on any event name to see detailed breakdown

## Event Naming Conventions

- Use snake_case for event names
- Be descriptive but concise
- Include location/context in event name when relevant
- Group related events with common prefixes (e.g., `whatsapp_*`, `call_*`, `form_*`)

## Custom Data Limitations

- Maximum 255 characters per event name, key, or value
- No nested objects allowed
- Allowed value types: string, number, boolean, null
- Number of custom properties varies by plan

## Testing

To test tracking in development:

1. Open browser DevTools Console
2. Look for Vercel Analytics tracking calls
3. Check GTM dataLayer: `console.log(window.dataLayer)`
4. Events will appear in Vercel dashboard within a few minutes

## Troubleshooting

If events aren't appearing:

1. Verify `@vercel/analytics` version is 1.1.0+
2. Check browser console for errors
3. Ensure Vercel Analytics is enabled for the project
4. Wait a few minutes for events to appear in dashboard
5. Check that tracking functions are being called (add console.log)

## Future Enhancements

- Add conversion tracking for specific goals
- Track scroll depth on key pages
- Add video play/pause tracking
- Track gallery image views
- Add search tracking (if search is implemented)
