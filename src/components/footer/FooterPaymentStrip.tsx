import * as React from "react";

type Country = "AE" | "EG";
type Lang = "en" | "ar";

type Logo = { src: string; alt: string };

const LOGOS_COMMON: Logo[] = [
  { src: "/payment/common/visa.png",        alt: "Visa" },
  { src: "/payment/common/MasterCard.png",  alt: "Mastercard" },
  { src: "/payment/common/AMEX.png",        alt: "American Express" },
  { src: "/payment/common/applepay.png",    alt: "Apple Pay" },
  { src: "/payment/common/googlepay.png",   alt: "Google Pay" },
];

const LOGOS_BY_COUNTRY: Record<Country, Logo[]> = {
  AE: [
    { src: "/payment/ae/tabby-logo-1.png", alt: "Tabby (Installments)" },
  ],
  EG: [
    { src: "/payment/eg/valu.webp",           alt: "valU" },
    { src: "/payment/eg/bmp-logo.png",       alt: "Banque Misr" },
    { src: "/payment/eg/NBE-logo.svg",       alt: "National Bank of Egypt (NBE)" },
    { src: "/payment/eg/anniversary-50-logo.png", alt: "CIB" },
  ],
};

const LABEL = {
  en: { title: "Payment Methods", local: "Local options", cards: "Cards & Wallets" },
  ar: { title: "طرق الدفع",        local: "خيارات محلية",    cards: "البطاقات والمحافظ" },
};

function getCountryCookie(): Country {
  if (typeof document !== "undefined") {
    const m = document.cookie.match(/(?:^|;\s*)sk_country=(AE|EG)/);
    if (m) return m[1] as Country;
  }
  return "AE";
}

function Row({ logos }: { logos: Logo[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {logos.map((l) => (
        <div
          key={l.src}
          className="h-10 w-28 md:h-12 md:w-32 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:border-[#bf1e2e]/40 transition-colors"
          title={l.alt}
        >
          <img
            src={l.src}
            alt={l.alt}
            loading="lazy"
            decoding="async"
            className="max-h-8 md:max-h-9 w-auto object-contain opacity-90"
          />
        </div>
      ))}
    </div>
  );
}

export default function FooterPaymentStrip({ lang = "en" as Lang }: { lang?: Lang }) {
  const t = LABEL[lang];
  
  // Combine all logos from all countries + common
  const allLogos = [
    ...LOGOS_BY_COUNTRY.AE,
    ...LOGOS_BY_COUNTRY.EG,
    ...LOGOS_COMMON
  ];

  return (
    <div className="sk-footer-payments">
      <div className="mb-4 text-center text-sm text-slate-400">{t.title}</div>
      <div className="px-4 pb-6">
        <Row logos={allLogos} />
      </div>
    </div>
  );
}
