// src/components/contact/PaymentStrip.tsx
import * as React from 'react';

type Country = 'AE' | 'EG';
type Lang = 'en' | 'ar';

const LABELS: Record<Lang, { title: string; local: string; cards: string }> = {
  en: { title: 'Payment & Installments', local: 'Local options', cards: 'Cards & Wallets' },
  ar: { title: 'الدفع والتقسيط', local: 'خيارات محلية', cards: 'البطاقات والمحافظ' },
};

type Logo = { src: string; alt: string; selectable?: boolean };

const LOGOS_COMMON: Logo[] = [
  { src: '/payment/common/visa.png', alt: 'Visa' },
  { src: '/payment/common/MasterCard.png', alt: 'Mastercard' },
  { src: '/payment/common/AMEX.png', alt: 'American Express' },
  { src: '/payment/common/applepay.png', alt: 'Apple Pay' },
  { src: '/payment/common/googlepay.png', alt: 'Google Pay' },
];

const LOGOS_BY_COUNTRY: Record<Country, Logo[]> = {
  AE: [{ src: '/payment/ae/tabby-logo-1.png', alt: 'Tabby (4 payments)', selectable: true }],
  EG: [
    { src: '/payment/eg/valu.webp', alt: 'valU', selectable: true },
    { src: '/payment/eg/bmp-logo.png', alt: 'Banque Misr', selectable: true },
    { src: '/payment/eg/NBE-logo.svg', alt: 'NBE', selectable: true },
    { src: '/payment/eg/anniversary-50-logo.png', alt: 'CIB', selectable: true },
  ],
};

export default function PaymentStrip({
  country, lang, selected, onChange
}: {
  country: Country;
  lang: Lang;
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const t = LABELS[lang];
  const local = LOGOS_BY_COUNTRY[country];

  function toggle(v: string) {
    const s = new Set(selected);
    s.has(v) ? s.delete(v) : s.add(v);
    onChange([...s]);
  }

  return (
    <div className="mt-4">
      <h4 className="text-white font-semibold mb-2">{t.title}</h4>
      <div className="rounded-2xl bg-card border border-slate-700/60 p-4">
        <div className="text-slate-200">{t.local}</div>
        <div className="flex flex-wrap gap-3 mt-3">
          {local.map(l => (
            <label key={l.src} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(l.alt)}
                onChange={() => toggle(l.alt)}
                className="w-4 h-4"
              />
              <div className="sk-logo-tile">
                <img src={l.src} alt={l.alt} className="h-6 opacity-90" />
              </div>
            </label>
          ))}
        </div>
        <div className="mt-5 text-slate-200">{t.cards}</div>
        <div className="flex flex-wrap gap-3 mt-3">
          {LOGOS_COMMON.map(l => (
            <div key={l.src} className="sk-logo-tile">
              <img src={l.src} alt={l.alt} className="max-h-6 opacity-90" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
