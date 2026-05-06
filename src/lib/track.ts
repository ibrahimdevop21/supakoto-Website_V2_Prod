// src/lib/track.ts
// Drop-in tracking helper for SupaKoto analytics
// Pushes events to GTM dataLayer + Vercel Analytics + (for lead-intent events) Google Ads conversion.

import { track as vercelTrack } from '@vercel/analytics';
import { fireGoogleAdsConversion, type AdsConversionKind } from './googleAdsConversion';

type Ctx = {
  branch?: string;           // e.g. 'dubai' | 'cairo_maadi' | ...
  lang?: 'en' | 'ar';
  cta_position?: 'hero' | 'sticky' | 'footer' | 'inline';
  step?: number;
  service?: string;
  location?: string;
  phone?: string;
  [k: string]: any;
};

const pushDL = (event: string, ctx: Ctx = {}) => {
  if (typeof window === 'undefined') return;
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ event, ...ctx, page_location: location.href });
};

// Dual tracking: GTM + Vercel Analytics, with optional Google Ads conversion fan-out.
const track = (event: string, ctx: Ctx = {}, adsConversion?: AdsConversionKind) => {
  // GTM tracking
  pushDL(event, ctx);

  // Vercel Analytics tracking
  try {
    vercelTrack(event, ctx);
  } catch (error) {
    console.error('Vercel Analytics tracking error:', error);
  }

  // Google Ads conversion (no-op when PUBLIC_GOOGLE_ADS_ID / label is missing)
  if (adsConversion) fireGoogleAdsConversion(adsConversion);
};

// Contact Wizard Events
export const trackStepView = (ctx: Ctx) => track('contact_wizard_step_view', ctx);
export const trackStepNext = (ctx: Ctx) => track('contact_wizard_step_next', ctx);
export const trackServiceToggle = (ctx: Ctx) => track('contact_wizard_service_toggle', ctx);

// Form Submission Events (each fires Google Ads "form" conversion)
export const trackFormSubmit = (ctx: Ctx) => track('form_submit', ctx, 'form');
export const trackLeadSubmit = (ctx: Ctx) => track('lead_submit', ctx, 'form');
export const trackBusinessContactSubmit = (ctx: Ctx) => track('business_contact_submit', ctx, 'form');

// WhatsApp Events (each fires Google Ads "whatsapp" conversion)
export const trackWhatsApp = (ctx: Ctx) => track('whatsapp_click', ctx, 'whatsapp');
export const trackWhatsAppFloat = (ctx: Ctx) => track('whatsapp_float_click', ctx, 'whatsapp');
export const trackWhatsAppHero = (ctx: Ctx) => track('whatsapp_hero_click', ctx, 'whatsapp');
export const trackWhatsAppFooter = (ctx: Ctx) => track('whatsapp_footer_click', ctx, 'whatsapp');
export const trackWhatsAppBranch = (ctx: Ctx) => track('whatsapp_branch_click', ctx, 'whatsapp');

// Call/Phone Events (each fires Google Ads "call" conversion)
export const trackCallClick = (ctx: Ctx) => track('call_click', ctx, 'call');
export const trackCallHero = (ctx: Ctx) => track('call_hero_click', ctx, 'call');
export const trackCallFooter = (ctx: Ctx) => track('call_footer_click', ctx, 'call');
export const trackCallBranch = (ctx: Ctx) => track('call_branch_click', ctx, 'call');

// CTA Events
export const trackCTAClick = (ctx: Ctx) => track('cta_click', ctx);
export const trackHeroCTA = (ctx: Ctx) => track('hero_cta_click', ctx);
export const trackSecondaryCTA = (ctx: Ctx) => track('secondary_cta_click', ctx);
export const trackServiceCTA = (ctx: Ctx) => track('service_cta_click', ctx);

// Navigation Events
export const trackNavClick = (ctx: Ctx) => track('nav_click', ctx);
export const trackFooterLinkClick = (ctx: Ctx) => track('footer_link_click', ctx);
