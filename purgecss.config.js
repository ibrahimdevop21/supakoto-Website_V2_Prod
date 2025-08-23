
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}',
    './public/**/*.html'
  ],
  css: [
    './dist/**/*.css'
  ],
  safelist: [
    // Keep dynamic classes
    /^animate-/,
    /^transition-/,
    /^duration-/,
    /^ease-/,
    /^hover:/,
    /^focus:/,
    /^active:/,
    /^group-hover:/,
    /^peer-/,
    // Keep Arabic font classes
    /^font-arabic/,
    // Keep RTL classes
    /^rtl:/,
    /^ltr:/,
    // Keep Leaflet classes
    /^leaflet-/,
    // Keep Embla classes
    /^embla/
  ],
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
};
