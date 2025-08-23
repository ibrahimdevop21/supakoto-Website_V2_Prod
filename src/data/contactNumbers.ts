export const CONTACT_NUMBERS = {
  EG: { call: "+20 12 24464637", whatsapp: "+20 11 08184162" },
  UAE: { call: "+971 50 626 5404", whatsapp: "+971 52 193 1358" },
} as const;

export type RegionKey = keyof typeof CONTACT_NUMBERS;
