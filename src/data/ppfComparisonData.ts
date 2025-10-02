export const ppfComparisonData = {
  title: {
    en: "Premium PPF Comparison",
    ar: "مقارنة أفلام حماية الطلاء الممتازة",
  },
  columns: [
    { key: "feature", en: "Feature", ar: "الميزة" },
    { key: "supa",   en: "SupaKoto • Takai PPF (Premium)", ar: "سوبا كوتو • تاكاي (مميز)" },
    { key: "xpel3m", en: "Western-Known Brands",              ar: "العلامات الغربية المعروفة" },
    { key: "china",  en: "Generic Chinese PPF (Budget)",      ar: "PPF صيني (اقتصادي)" },
  ],
  rows: [
    {
      feature: { en: "Origin", ar: "المنشأ" },
      supa:    { en: "100% Japan • Takai Technology", ar: "اليابان ١٠٠٪ • تقنية تاكاي" },
      xpel3m:  { en: "US / Europe R&D", ar: "بحث وتطوير في أمريكا/أوروبا" },
      china:   { en: "Mass-produced in China", ar: "إنتاج كثيف في الصين" },
    },
    {
      feature: { en: "Durability", ar: "المتانة" },
      supa:    { en: "10–15 yrs real use", ar: "١٠–١٥ سنة استخدام فعلي" },
      xpel3m:  { en: "7–10 yrs",            ar: "٧–١٠ سنوات" },
      china:   { en: "2–4 yrs",              ar: "٢–٤ سنوات" },
    },
    {
      feature: { en: "Warranty", ar: "الضمان" },
      supa:    { en: "SupaKoto-backed 15 yrs", ar: "ضمان ١٥ سنة من سوبا كوتو" },
      xpel3m:  { en: "Dealer 7–10 yrs",        ar: "٧–١٠ سنوات عبر الوكيل" },
      china:   { en: "1–3 yrs (unreliable)",    ar: "١–٣ سنوات (غير موثوق)" },
    },
    {
      feature: { en: "Yellowing", ar: "الاصفرار" },
      supa:    { en: "Desert-proof, ultra-stable resin", ar: "مقاومة للصحراء، راتنج مستقر جدًا" },
      xpel3m:  { en: "Strong (premium only)",              ar: "قوي (في الإصدارات المميزة)" },
      china:   { en: "High risk in 1–2 yrs",               ar: "مخاطر عالية خلال ١–٢ سنة" },
    },
    {
      feature: { en: "Finish & Clarity", ar: "اللمعان والوضوح" },
      supa:    { en: "Crystal-clear, invisible edges", ar: "شفافية عالية وحواف غير مرئية" },
      xpel3m:  { en: "High clarity",                     ar: "وضوح عالٍ" },
      china:   { en: "Cloudy, orange peel",              ar: "عكارة وقشرة برتقال" },
    },
    {
      feature: { en: "Installation", ar: "التركيب" },
      supa:    { en: "Certified • No disassembly • Precision cut", ar: "تركيب معتمد • دون فك • قصّ دقيق" },
      xpel3m:  { en: "Authorized installers",                        ar: "مركبون معتمدون" },
      china:   { en: "Rushed • Uneven stretching",                   ar: "مستعجل • شدّ غير متساوٍ" },
    },
    {
      feature: { en: "Self-Healing", ar: "الالتئام الذاتي" },
      supa:    { en: "Advanced nano heat recovery", ar: "تعافٍ حراري نانوي متقدم" },
      xpel3m:  { en: "Present in top lines",         ar: "موجود في الإصدارات العليا" },
      china:   { en: "Weak or none",                  ar: "ضعيف أو غير موجود" },
    },
    {
      feature: { en: "Trust", ar: "الثقة" },
      supa:    { en: "Full Japanese traceability + certificate", ar: "تتبّع ياباني كامل + شهادة" },
      xpel3m:  { en: "Trusted global names",                       ar: "أسماء عالمية موثوقة" },
      china:   { en: "Often fake labeling",                        ar: "غالبًا وسم مزيف" },
    },
    {
      feature: { en: "Price", ar: "السعر" },
      supa:    { en: "Premium quality • Mid-range price", ar: "جودة مميزة • سعر متوسط" },
      xpel3m:  { en: "Very high price",                   ar: "سعر مرتفع جدًا" },
      china:   { en: "Low price • Low quality",           ar: "سعر منخفض • جودة منخفضة" },
    }
  ],
};

export type PPFComparisonData = typeof ppfComparisonData;
export type Locale = "en" | "ar";
