/** Optimized WebP hero slides — regenerate with npm run optimize:hero */
export const HERO_SLIDES = [
  {
    desktop: '/images/Hero/roalla-hero-homepage-desktop-1.webp',
    mobile: '/images/Hero/roalla-hero-homepage-mobile-1.webp',
  },
  {
    desktop: '/images/Hero/roalla-hero-homepage-desktop-2.webp',
    mobile: '/images/Hero/roalla-hero-homepage-mobile-2.webp',
  },
  {
    desktop: '/images/Hero/roalla-hero-homepage-desktop-3.webp',
    mobile: '/images/Hero/roalla-hero-homepage-mobile-3.webp',
  },
] as const

/** @deprecated Prefer HERO_SLIDES; desktop URLs for preload/fallback */
export const HERO_SLIDESHOW_IMAGES = HERO_SLIDES.map((s) => s.desktop)

export const HERO_SLIDE_INTERVAL_MS = 6000
export const HERO_SLIDE_FADE_MS = 1200

/** Tailwind md — phones use mobile art; tablets & up use desktop */
export const HERO_MOBILE_MAX_WIDTH_PX = 767
