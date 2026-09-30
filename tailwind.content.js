/**
 * Homepage CSS is the Tailwind content below (chrome + home).
 * Every other route loads src/app/site.css, built from the rest of src,
 * so PageSpeed does not count hub, workshop, and article utilities on /.
 * Brackets in [locale] must be escaped or fast-glob treats them as a character class.
 */
const homeContent = [
  './src/app/layout.tsx',
  './src/app/\\[locale\\]/layout.tsx',
  './src/app/\\[locale\\]/page.tsx',
  './src/components/ConditionalLayout.tsx',
  './src/components/Footer.tsx',
  './src/components/Header.tsx',
  './src/components/ScheduleButton.tsx',
  './src/components/StickyMobileCTA.tsx',
  './src/components/digital/BrowserFrame.tsx',
  './src/components/home/**/*.{js,ts,jsx,tsx}',
  './src/components/motion/**/*.{js,ts,jsx,tsx}',
]

const siteContent = [
  './src/**/*.{js,ts,jsx,tsx,mdx}',
  ...homeContent.map((pattern) => `!${pattern}`),
]

module.exports = { homeContent, siteContent }
