export const ppfComparisonData = {
  title: {
    en: "Premium PPF Comparison",
    ar: "مقارنة أفلام حماية الطلاء الممتازة",
  },
  columns: [
    { key: "feature", en: "Feature", ar: "الميزة" },
    { key: "supa",   en: "SupaKoto•Takai PPF", ar: "سوبا كوتو • تاكاي الياباني" },
    { key: "xpel3m", en: "XPEL / 3M (Top Western Brands)", ar: "XPEL / 3M (أشهر العلامات الغربية)" },
    { key: "china",  en: "Mainstream Chinese PPF (Low-Cost)", ar: "أفلام صينية منتشرة (منخفضة التكلفة)" },
  ],
  rows: [
    {
      feature: { en: "Origin & Manufacturing", ar: "المنشأ والتصنيع" },
      supa:    { en: "100% Japan, Takai tech, strict QC", ar: "ياباني ١٠٠٪، تقنية تاكاي وجودة صارمة" },
      xpel3m:  { en: "US (XPEL) / Global (3M); strong R&D", ar: "أمريكي (XPEL) / عالمي (3M)؛ أبحاث قوية" },
      china:   { en: "China, mass production, cost-focused", ar: "الصين؛ إنتاج كثيف وتركيز على التكلفة" },
    },
    {
      feature: { en: "Durability", ar: "المتانة" },
      supa:    { en: "10–15 years real-world durability", ar: "متانة فعلية ١٠–١٥ سنة" },
      xpel3m:  { en: "8–10 years (premium lines)", ar: "٨–١٠ سنوات (الخطوط المميزة)" },
      china:   { en: "2–4 years; peeling common", ar: "٢–٤ سنوات؛ قابلية للتقشر" },
    },
    {
      feature: { en: "Warranty", ar: "الضمان" },
      supa:    { en: "SupaKoto-backed 15 years", ar: "ضمان ١٥ سنة من سوبا كوتو" },
      xpel3m:  { en: "7–10 years; dealer dependent", ar: "٧–١٠ سنوات؛ حسب الوكيل" },
      china:   { en: "1–3 years; unreliable", ar: "١–٣ سنوات؛ غير موثوق" },
    },
    {
      feature: { en: "Yellowing Resistance", ar: "مقاومة الاصفرار" },
      supa:    { en: "Ultra-stable resin; desert-proof", ar: "راتنج فائق الثبات؛ صامد في الحر الشديد" },
      xpel3m:  { en: "Strong on premium lines", ar: "قوية في الخطوط المميزة" },
      china:   { en: "High yellowing risk (1–2 years)", ar: "مخاطر اصفرار عالية (١–٢ سنة)" },
    },
    {
      feature: { en: "Finish & Clarity", ar: "اللمعان والوضوح" },
      supa:    { en: "Crystal-clear gloss/satin, invisible edges", ar: "لمعان/ساتان فائق الوضوح وحواف غير مرئية" },
      xpel3m:  { en: "High clarity; varies by series", ar: "وضوح عالٍ؛ يختلف حسب الفئة" },
      china:   { en: "Texture/orange peel; cloudy edges", ar: "ملمس/قشرة برتقال؛ حواف معتمة" },
    },
    {
      feature: { en: "Installation Quality", ar: "جودة التركيب" },
      supa:    { en: "Certified, no disassembly, precision cut", ar: "تركيب معتمد، بدون فك، قصّ دقيق" },
      xpel3m:  { en: "Good with authorized installers", ar: "جيد مع مُركبين معتمدين" },
      china:   { en: "Often rushed; uneven stretching", ar: "غالبًا مستعجل؛ شدّ غير متساوٍ" },
    },
    {
      feature: { en: "Self-Healing", ar: "الالتئام الذاتي" },
      supa:    { en: "Advanced nano heat recovery", ar: "تعافٍ حراري نانوي متقدم" },
      xpel3m:  { en: "Effective on premium lines", ar: "فعّال في الخطوط المميزة" },
      china:   { en: "Weak or none", ar: "ضعيف أو غير موجود" },
    },
    {
      feature: { en: "Trust & Authenticity", ar: "الموثوقية والأصالة" },
      supa:    { en: "Full Japanese traceability + certificate", ar: "تتبّع ياباني كامل + شهادة أصالة" },
      xpel3m:  { 
        en: "Trusted brands, but only genuine premium lines. ⚠ Market has many cheap knock-offs.",
        ar: "علامات موثوقة لكن فقط الإصدارات الأصلية المميزة. ⚠ السوق مليء بالتقليد الرخيص."
      },
      china:   { en: "Vulnerable to fake labeling; no proof", ar: "عرضة للتقليد؛ دون إثبات أصالة" },
    },
  ],
};

export type PPFComparisonData = typeof ppfComparisonData;
export type Locale = "en" | "ar";
