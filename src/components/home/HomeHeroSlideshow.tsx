import {
  HERO_SLIDE_INTERVAL_MS,
  HERO_SLIDESHOW_IMAGES,
} from '@/lib/heroSlideshow'

export default function HomeHeroSlideshow() {
  const slideCount = HERO_SLIDESHOW_IMAGES.length
  const cycleDurationMs = slideCount * HERO_SLIDE_INTERVAL_MS

  return (
    <div className="hero-slideshow absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {HERO_SLIDESHOW_IMAGES.map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          decoding={index === 0 ? 'sync' : 'async'}
          fetchPriority={index === 0 ? 'high' : 'low'}
          className="hero-slide"
          style={{
            animationDuration: `${cycleDurationMs}ms`,
            animationDelay: `${-index * HERO_SLIDE_INTERVAL_MS}ms`,
          }}
        />
      ))}
    </div>
  )
}
