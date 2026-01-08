export type CountryCode = 'EG' | 'AE';

export const COUNTRY_DEFAULTS: Record<CountryCode, { tel: string; wa: string }> = {
  AE: {
    tel: '+971506265404',  // Dubai HQ (call)
    wa:  '971506265404',   // Dubai HQ (WhatsApp, no '+')
  },
  EG: {
    tel: '+201103402446',  // Egypt (call)
    wa:  '201103402446',   // Egypt (WhatsApp, no '+')
  },
};
