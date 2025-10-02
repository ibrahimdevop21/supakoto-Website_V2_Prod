// src/lib/track.ts
// Drop-in tracking helper for SupaKoto analytics
// Pushes events to dataLayer for GTM to consume later

type Ctx = {
  branch?: string;           // e.g. 'dubai' | 'cairo_maadi' | ...
  lang?: 'en' | 'ar';
  cta_position?: 'hero' | 'sticky' | 'footer' | 'inline';
  step?: number;
  service?: string;
  [k: string]: any;
};

const pushDL = (event: string, ctx: Ctx = {}) => {
  if (typeof window === 'undefined') return;
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ event, ...ctx, page_location: location.href });
};

export const trackStepView = (ctx: Ctx) => pushDL('contact_wizard_step_view', ctx);
export const trackStepNext = (ctx: Ctx) => pushDL('contact_wizard_step_next', ctx);
export const trackServiceToggle = (ctx: Ctx) => pushDL('contact_wizard_service_toggle', ctx);
export const trackFormSubmit = (ctx: Ctx) => pushDL('form_submit', ctx);          // maps to GA4= form_submit, Meta= Lead, TT= SubmitForm
export const trackWhatsApp = (ctx: Ctx) => pushDL('whatsapp_click', ctx);       // optional CTA under the form
