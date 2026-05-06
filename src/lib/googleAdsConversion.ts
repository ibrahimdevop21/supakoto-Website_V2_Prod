// Google Ads conversion firing helper.
// Fires gtag('event','conversion',...) for whatsapp / call / form lead actions.
// Safe to call even when env vars are unset or gtag.js hasn't loaded — silently no-ops.

const ADS_ID = import.meta.env.PUBLIC_GOOGLE_ADS_ID as string | undefined;
const LABEL_WHATSAPP = import.meta.env.PUBLIC_GOOGLE_ADS_LABEL_WHATSAPP as string | undefined;
const LABEL_CALL = import.meta.env.PUBLIC_GOOGLE_ADS_LABEL_CALL as string | undefined;
const LABEL_FORM = import.meta.env.PUBLIC_GOOGLE_ADS_LABEL_FORM as string | undefined;

export type AdsConversionKind = 'whatsapp' | 'call' | 'form';

export function fireGoogleAdsConversion(kind: AdsConversionKind): void {
  if (typeof window === 'undefined') return;
  if (!ADS_ID) return;

  const label =
    kind === 'whatsapp' ? LABEL_WHATSAPP :
    kind === 'call' ? LABEL_CALL :
    kind === 'form' ? LABEL_FORM :
    undefined;
  if (!label) return;

  const gtag = (window as any).gtag;
  if (typeof gtag !== 'function') return;

  try {
    gtag('event', 'conversion', { send_to: `${ADS_ID}/${label}` });
  } catch (_) {
    // swallow — tracking errors must not break UX
  }
}
