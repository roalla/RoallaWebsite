import {
  HERO_SLIDE_INTERVAL_MS,
  HERO_SLIDES,
  HERO_MOBILE_MAX_WIDTH_PX,
} from '@/lib/heroSlideshow'

export default function HomeHeroSlideshow() {
  const slideCount = HERO_SLIDES.length
  const cycleDurationMs = slideCount * HERO_SLIDE_INTERVAL_MS
  const mobileMedia = `(max-width: ${HERO_MOBILE_MAX_WIDTH_PX}px)`

  return (
    <div className="hero-slideshow absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {HERO_SLIDES.map((slide, index) => (
        <picture
          key={slide.desktop}
          className="hero-slide"
          style={{
            animationDuration: `${cycleDurationMs}ms`,
            animationDelay: `${-index * HERO_SLIDE_INTERVAL_MS}ms`,
          }}
        >
          <source media={mobileMedia} srcSet={slide.mobile} type="image/webp" />
          <img
            src={slide.desktop}
            alt=""
            decoding={index === 0 ? 'sync' : 'async'}
            fetchPriority={index === 0 ? 'high' : 'low'}
            className="hero-slide-img"
          />
        </picture>
      ))}
    </div>
  )
}
