/** Optimized hero slides — regenerate with npm run optimize:hero */
export const HERO_SLIDES = [
  {
    desktop: '/images/Hero/roalla-hero-homepage-desktop-1.webp',
    desktopAvif: '/images/Hero/roalla-hero-homepage-desktop-1.avif',
    mobile: '/images/Hero/roalla-hero-homepage-mobile-1-736.webp',
    mobileSrcSet: '/images/Hero/roalla-hero-homepage-mobile-1-480.webp',
    mobileAvifSrcSet: '/images/Hero/roalla-hero-homepage-mobile-1-480.avif',
  },
  {
    desktop: '/images/Hero/roalla-hero-homepage-desktop-2.webp',
    desktopAvif: '/images/Hero/roalla-hero-homepage-desktop-2.avif',
    mobile: '/images/Hero/roalla-hero-homepage-mobile-2-736.webp',
    mobileSrcSet: '/images/Hero/roalla-hero-homepage-mobile-2-480.webp',
    mobileAvifSrcSet: '/images/Hero/roalla-hero-homepage-mobile-2-480.avif',
  },
  {
    desktop: '/images/Hero/roalla-hero-homepage-desktop-3.webp',
    desktopAvif: '/images/Hero/roalla-hero-homepage-desktop-3.avif',
    mobile: '/images/Hero/roalla-hero-homepage-mobile-3-736.webp',
    mobileSrcSet: '/images/Hero/roalla-hero-homepage-mobile-3-480.webp',
    mobileAvifSrcSet: '/images/Hero/roalla-hero-homepage-mobile-3-480.avif',
  },
] as const

/** @deprecated Prefer HERO_SLIDES; desktop URLs for preload/fallback */
export const HERO_SLIDESHOW_IMAGES = HERO_SLIDES.map((s) => s.desktop)

export const HERO_SLIDE_INTERVAL_MS = 6000
export const HERO_SLIDE_FADE_MS = 1200

/** Keep the initial LCP candidate stable; begin ambient rotation only after the page is settled. */
export const HERO_NEXT_SLIDE_AT_MS = 7000
/** Load the final slide well after the critical rendering window. */
export const HERO_LAST_SLIDE_AT_MS = 12000

/** Tailwind md — phones use mobile art; tablets & up use desktop */
export const HERO_MOBILE_MAX_WIDTH_PX = 767
