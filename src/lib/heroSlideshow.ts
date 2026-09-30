/** Optimized hero slides — regenerate with npm run optimize:hero */
export const HERO_SLIDES = [
  {
    desktop: '/images/Hero/roalla-hero-homepage-desktop-1.webp',
    mobile: '/images/Hero/roalla-hero-homepage-mobile-1-736.webp',
    mobileSrcSet:
      '/images/Hero/roalla-hero-homepage-mobile-1-480.webp 480w, /images/Hero/roalla-hero-homepage-mobile-1-736.webp 736w',
    mobileAvifSrcSet:
      '/images/Hero/roalla-hero-homepage-mobile-1-480.avif 480w, /images/Hero/roalla-hero-homepage-mobile-1-736.avif 736w',
  },
  {
    desktop: '/images/Hero/roalla-hero-homepage-desktop-2.webp',
    mobile: '/images/Hero/roalla-hero-homepage-mobile-2-736.webp',
    mobileSrcSet:
      '/images/Hero/roalla-hero-homepage-mobile-2-480.webp 480w, /images/Hero/roalla-hero-homepage-mobile-2-736.webp 736w',
    mobileAvifSrcSet:
      '/images/Hero/roalla-hero-homepage-mobile-2-480.avif 480w, /images/Hero/roalla-hero-homepage-mobile-2-736.avif 736w',
  },
  {
    desktop: '/images/Hero/roalla-hero-homepage-desktop-3.webp',
    mobile: '/images/Hero/roalla-hero-homepage-mobile-3-736.webp',
    mobileSrcSet:
      '/images/Hero/roalla-hero-homepage-mobile-3-480.webp 480w, /images/Hero/roalla-hero-homepage-mobile-3-736.webp 736w',
    mobileAvifSrcSet:
      '/images/Hero/roalla-hero-homepage-mobile-3-480.avif 480w, /images/Hero/roalla-hero-homepage-mobile-3-736.avif 736w',
  },
] as const

/** @deprecated Prefer HERO_SLIDES; desktop URLs for preload/fallback */
export const HERO_SLIDESHOW_IMAGES = HERO_SLIDES.map((s) => s.desktop)

export const HERO_SLIDE_INTERVAL_MS = 6000
export const HERO_SLIDE_FADE_MS = 1200

/** Second slide starts fading in just before 5s; fetch it early enough to arrive. */
export const HERO_NEXT_SLIDE_AT_MS = 3500
/** Third slide is not visible until about 11s. */
export const HERO_LAST_SLIDE_AT_MS = 8000

/** Tailwind md — phones use mobile art; tablets & up use desktop */
export const HERO_MOBILE_MAX_WIDTH_PX = 767
