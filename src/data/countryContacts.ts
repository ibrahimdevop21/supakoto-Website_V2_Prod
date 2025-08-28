export type CountryCode = 'EG' | 'AE';

export const COUNTRY_DEFAULTS: Record<CountryCode, { tel: string; wa: string }> = {
  AE: {
    tel: '+971506265404',  // Dubai HQ (call)
    wa:  '971506265404',   // Dubai HQ (WhatsApp, no '+')
  },
  EG: {
    tel: '+201224464637',  // Cairo Sheikh Zayed (call)
    wa:  '201108184161',   // Cairo New Cairo (WhatsApp, no '+')
  },
};
