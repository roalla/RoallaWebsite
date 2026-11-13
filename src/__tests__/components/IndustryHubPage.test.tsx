import React from 'react'
import { render, screen } from '@testing-library/react'
import IndustryHubPage from '@/components/industries/IndustryHubPage'
import IndustryIndexPage from '@/components/industries/IndustryIndexPage'
import { getIndustryHub, getIndustryHubIndex } from '@/lib/industry-hub-content'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}))

jest.mock('@/i18n/navigation', () => ({
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string | { pathname: string; query?: Record<string, string>; params?: Record<string, string> }
  }) => {
    const resolved =
      typeof href === 'string'
        ? href
        : href.params
          ? `${href.pathname.replace('[slug]', href.params.slug ?? '')}`
          : `${href.pathname}${href.query ? `?${new URLSearchParams(href.query).toString()}` : ''}`
    return (
      <a href={resolved} {...props}>
        {children}
      </a>
    )
  },
}))

jest.mock('@/components/motion/Reveal', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock('@/lib/analytics', () => ({
  trackAnalyticsEvent: jest.fn(),
}))

describe('Industry hub contrast and imagery', () => {
  it('scrolls to the top when an industry hub loads', () => {
    const scrollTo = jest.fn()
    window.scrollTo = scrollTo
    const hub = getIndustryHub('en', 'it-msp')!
    const { rerender } = render(<IndustryHubPage locale="en" hub={hub} />)
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' })

    scrollTo.mockClear()
    const next = getIndustryHub('en', 'legal')!
    rerender(<IndustryHubPage locale="en" hub={next} />)
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' })
  })

  it('uses full-bleed industry hero photo with readable scrim and white closer heading', () => {
    const hub = getIndustryHub('en', 'it-msp')!
    const { container } = render(<IndustryHubPage locale="en" hub={hub} />)

    const hero = container.querySelector('section[data-header-tone="dark"]')
    expect(hero).toBeTruthy()
    const heroImg = hero?.querySelector('img')
    expect(heroImg?.getAttribute('src') || '').toContain('/images/industries/it-msp')
    expect(hero?.innerHTML).toContain('from-slate-950')

    const closerTitle = screen.getByRole('heading', { level: 2, name: hub.closer.title })
    expect(closerTitle.className).toContain('text-white')
  })

  it('renders lead service tiles with opt.webp assets', () => {
    const hub = getIndustryHub('en', 'it-msp')!
    const { container } = render(<IndustryHubPage locale="en" hub={hub} />)

    expect(screen.getByRole('heading', { name: hub.ui.leadTilesTitle })).toBeInTheDocument()
    const tiles = Array.from(container.querySelectorAll('img')).filter((img) => {
      const src = img.getAttribute('src') || ''
      return src.includes('/images/insights/library/') && src.endsWith('.opt.webp')
    })
    expect(tiles.length).toBe(hub.leadServices.length)
  })

  it('keeps industries index hero heading white and uses opt tiles', () => {
    const copy = getIndustryHubIndex('en')
    const { container } = render(<IndustryIndexPage locale="en" copy={copy} />)

    const title = screen.getByRole('heading', { level: 1, name: copy.title })
    expect(title.className).toContain('text-white')

    const imgs = Array.from(container.querySelectorAll('img'))
    expect(imgs.length).toBe(15)
    expect(imgs.every((img) => (img.getAttribute('src') || '').endsWith('.opt.webp'))).toBe(true)
  })
})
