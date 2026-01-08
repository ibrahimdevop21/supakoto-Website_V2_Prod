import React from "react";
import { useTranslations } from "@/i18n/react";

interface OurStoryProps {
  currentLocale: "en" | "ar";
  isRTL: boolean;
}

const OurStory: React.FC<OurStoryProps> = ({ currentLocale, isRTL }) => {
  const isArabic = currentLocale === "ar";
  const t = useTranslations(currentLocale);

  const heroTitle = t("about.hero.title");
  const heroDescription = t("about.hero.description");
  const contentIntro = t("about.content.intro");
  const contentStory = t("about.content.story");
  const contentMission = t("about.content.mission");
  const contentCommitment = t("about.content.commitment");
  const badgeJapan = t("about.content.badges.japan");
  const badgeRegions = t("about.content.badges.regions");

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      // Pull section slightly under the navbar, keep tight top padding, minimal bottom
      className="relative overflow-hidden mt-[-8px] pt-10 md:pt-12 pb-2 md:pb-4"
      aria-labelledby="about-hero"
    >
      {/* SVG rays — masked to avoid any dark 'trace' at very top/bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.035,
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
        }}
      >
        <svg className="w-full h-full" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
          <g transform="translate(600,400)">
            {Array.from({ length: 20 }, (_, i) => {
              const angle = i * 18 - 90;
              const x2 = Math.cos((angle * Math.PI) / 180) * 620;
              const y2 = Math.sin((angle * Math.PI) / 180) * 420;
              return (
                <line
                  key={i}
                  x1="0"
                  y1="0"
                  x2={x2}
                  y2={y2}
                  stroke="url(#sunRay)"
                  strokeWidth="2"
                  opacity={0.7 - (i % 3) * 0.25}
                />
              );
            })}
          </g>
          <defs>
            <linearGradient id="sunRay" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#bf1e2e" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#bf1e2e" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Soft radial glow (kept subtle) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[360px] rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(191,30,46,0.06) 0%, rgba(249,115,22,0.04) 45%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <header className="text-center">
          <h1
            id="about-hero"
            className={[
              "font-bold tracking-tight",
              isArabic ? "font-arabic" : "",
              "text-[clamp(1.75rem,4vw+0.5rem,3.25rem)] md:text-[clamp(2.5rem,2.8vw+1rem,3.75rem)]",
              "leading-[1.15] supports-[text-wrap:balance]:text-balance",
              "bg-gradient-to-r from-[#bf1e2e] via-orange-400 to-[#bf1e2e] bg-clip-text text-transparent",
              // pull the title a touch upward to tighten visual gap
              "mt-2",
            ].join(" ")}
          >
            {heroTitle}
          </h1>

          <div className="flex items-center justify-center gap-6 my-5 md:my-6" aria-hidden="true">
            <div className="h-px w-24 sm:w-32 md:w-40 bg-gradient-to-r from-transparent via-[#bf1e2e]/50 to-transparent" />
            <div className="w-3 h-3 rounded-full bg-brand-primary" />
            <div className="h-px w-24 sm:w-32 md:w-40 bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />
          </div>

          <p
            className={[
              "mx-auto max-w-3xl text-[1.05rem] sm:text-lg md:text-xl",
              "text-gray-300/95 leading-relaxed font-light",
              isArabic ? "font-arabic" : "",
            ].join(" ")}
          >
            {heroDescription}
          </p>
        </header>

        <div className="mt-7 md:mt-8 flex flex-wrap justify-center gap-4 sm:gap-5">
          <div className="inline-flex items-center px-5 py-2.5 rounded-full border bg-[#bf1e2e]/15 border-[#bf1e2e]/30 text-[#ffb3bd] backdrop-blur-sm">
            <span className={["text-lg", isRTL ? "ml-3" : "mr-3"].join(" ")}>🇯🇵</span>
            <span className="text-[#ffdde1]">{badgeJapan}</span>
          </div>
          <div className="inline-flex items-center px-5 py-2.5 rounded-full border bg-orange-500/10 border-orange-500/25 text-orange-300 backdrop-blur-sm">
            <span className={["text-lg", isRTL ? "ml-3" : "mr-3"].join(" ")}>🇪🇬🇦🇪</span>
            <span className="text-orange-200">{badgeRegions}</span>
          </div>
        </div>

        <div className="mt-8 md:mt-10 grid gap-4 md:gap-5 text-center">
          <p className={["text-lg md:text-xl text-gray-300 leading-relaxed", isArabic ? "font-arabic" : ""].join(" ")}>
            {contentIntro}
          </p>
          <p className={["text-base md:text-lg text-gray-400 leading-relaxed mx-auto max-w-3xl", isArabic ? "font-arabic" : ""].join(" ")}>
            {contentStory}
          </p>
          <p className={["text-base md:text-lg text-gray-400 leading-relaxed mx-auto max-w-3xl", isArabic ? "font-arabic" : ""].join(" ")}>
            {contentMission}
          </p>
          <p className={["text-base md:text-lg text-gray-200 leading-relaxed font-medium mx-auto max-w-3xl", isArabic ? "font-arabic" : ""].join(" ")}>
            {contentCommitment}
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
