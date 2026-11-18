import React from 'react'
import { render, screen, act } from '@testing-library/react'
import IndustryHubPage from '@/components/industries/IndustryHubPage'
import IndustryIndexPage from '@/components/industries/IndustryIndexPage'
import { aiEmployeeContent } from '@/lib/ai-employee-content'
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

jest.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => true,
}))

async function flushAnimationFrame() {
  await act(async () => {
    await new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => resolve())
    })
  })
}

describe('Industry hub contrast and imagery', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/en/industries/legal')
    Element.prototype.scrollIntoView = jest.fn()
  })

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

  it('folds start-here into the popular priority tile and removes the Start here section', () => {
    const hub = getIndustryHub('en', 'it-msp')!
    render(<IndustryHubPage locale="en" hub={hub} />)

    expect(screen.queryByRole('heading', { name: hub.startHere.title })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: hub.startHere.ctaLabel })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: hub.startHere.ctaLabel })).not.toBeInTheDocument()

    expect(screen.getByText(hub.ui.popularLabel)).toBeInTheDocument()
    expect(screen.getByText(hub.startHere.lead)).toBeInTheDocument()
    expect(screen.getByText(hub.ui.proofEyebrow)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: hub.proof.label })).toBeInTheDocument()
  })

  it('puts Popular and start-here lead on the AI tile for fit-brief industries', () => {
    const hub = getIndustryHub('en', 'legal')!
    render(<IndustryHubPage locale="en" hub={hub} />)

    expect(hub.startHere.target).toBe('fit-brief')
    const aiOption = screen.getByRole('option', { name: new RegExp(hub.services.aiEmployee.title, 'i') })
    expect(aiOption).toHaveTextContent(hub.ui.popularLabel)
    expect(aiOption).toHaveTextContent(hub.startHere.lead)
  })

  it('hides path detail until a priority tile is selected', () => {
    const hub = getIndustryHub('en', 'legal')!
    const aiIndustry = aiEmployeeContent.en.industries.find((item) => item.id === 'legal')!
    render(<IndustryHubPage locale="en" hub={hub} />)

    expect(screen.queryByText(aiIndustry.positioning)).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /Strongest place to begin/i })).not.toBeInTheDocument()
    expect(screen.getByRole('listbox', { name: hub.ui.leadTilesTitle })).toBeInTheDocument()
  })

  it('shows landing-style AI detail and Fit Brief conversion after selecting AI Employee', async () => {
    const hub = getIndustryHub('en', 'legal')!
    const aiIndustry = aiEmployeeContent.en.industries.find((item) => item.id === 'legal')!
    const defaultAudience = aiIndustry.audiences[0]
    const otherAudience = aiIndustry.audiences[1]
    render(<IndustryHubPage locale="en" hub={hub} />)

    await act(async () => {
      screen.getByRole('option', { name: new RegExp(hub.services.aiEmployee.title, 'i') }).click()
    })
    await flushAnimationFrame()

    expect(screen.getByText(aiIndustry.positioning)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: aiIndustry.promise })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: aiIndustry.image.alt })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: new RegExp(defaultAudience.label, 'i') })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('heading', { name: defaultAudience.uses[0].title })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: otherAudience.uses[0].title })).not.toBeInTheDocument()

    await act(async () => {
      screen.getByRole('option', { name: new RegExp(otherAudience.label, 'i') }).click()
    })
    expect(screen.getByRole('heading', { name: otherAudience.uses[0].title })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: defaultAudience.uses[0].title })).not.toBeInTheDocument()

    expect(screen.getByRole('heading', { name: /Strongest place to begin/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Clear limits build trust/i })).toBeInTheDocument()

    const fit = screen
      .getAllByRole('link', { name: aiEmployeeContent.en.primaryCta })
      .find((link) => (link.getAttribute('href') || '').includes('conversion_source=industry_hub_path_detail'))
    expect(fit).toBeTruthy()
    expect(fit!.getAttribute('href')).toContain('/tools/ai-employee-fit-brief')
    expect(fit!.getAttribute('href')).toContain('campaign=industry-hub')
    expect(fit!.getAttribute('href')).not.toContain('/ai-employee?')

    const ucBridge = screen.getByRole('link', {
      name: /See how this fits with calling and the contact centre/i,
    })
    expect(ucBridge.getAttribute('href')).toContain(
      '/services/unified-communications-contact-centres-ai-employees',
    )
    expect(ucBridge.getAttribute('href')).toContain('industry=legal')
    expect(ucBridge.getAttribute('href')).toContain('signal=ai-employee')
  })

  it('routes UCaaS and CCaaS CTAs to the unified communications pathway', async () => {
    const hub = getIndustryHub('en', 'veterinary')!
    render(<IndustryHubPage locale="en" hub={hub} />)

    await act(async () => {
      screen.getByRole('option', { name: new RegExp(hub.services.ucaas.title, 'i') }).click()
    })
    await flushAnimationFrame()

    const ucaasCta = screen.getByRole('link', { name: hub.services.ucaas.ctaLabel })
    expect(ucaasCta.getAttribute('href')).toContain(
      '/services/unified-communications-contact-centres-ai-employees',
    )
    expect(ucaasCta.getAttribute('href')).toContain('industry=veterinary')
    expect(ucaasCta.getAttribute('href')).toContain('focus=ucaas')
    expect(ucaasCta.getAttribute('href')).toContain('signal=unified-communications')

    const ccaasRelated = screen.getByRole('link', { name: hub.services.ccaas.ctaLabel })
    expect(ccaasRelated.getAttribute('href')).toContain(
      '/services/unified-communications-contact-centres-ai-employees',
    )
    expect(ccaasRelated.getAttribute('href')).toContain('focus=ccaas')
    expect(ccaasRelated.getAttribute('href')).toContain('industry=veterinary')
  })

  it('uses communications-popular UCaaS path for transportation hubs', async () => {
    const hub = getIndustryHub('en', 'transportation-logistics')!
    render(<IndustryHubPage locale="en" hub={hub} />)

    expect(hub.startHere.target).toBe('communications')
    expect(hub.services.ucaas.eyebrow).toMatch(/Unified communications/i)

    await act(async () => {
      screen.getByRole('option', { name: new RegExp(hub.services.ucaas.title, 'i') }).click()
    })
    await flushAnimationFrame()

    const cta = screen.getByRole('link', { name: hub.services.ucaas.ctaLabel })
    expect(cta.getAttribute('href')).toContain(
      '/services/unified-communications-contact-centres-ai-employees',
    )
    expect(cta.getAttribute('href')).toContain('industry=transportation-logistics')
  })

  it('shows only the selected non-AI path detail', async () => {
    const hub = getIndustryHub('en', 'legal')!
    const aiIndustry = aiEmployeeContent.en.industries.find((item) => item.id === 'legal')!
    const otherKey = hub.leadServices.find((key) => key !== 'aiEmployee')!
    render(<IndustryHubPage locale="en" hub={hub} />)

    await act(async () => {
      screen.getByRole('option', { name: new RegExp(hub.services[otherKey].title, 'i') }).click()
    })
    await flushAnimationFrame()

    expect(screen.getByRole('heading', { level: 2, name: hub.services[otherKey].title })).toBeInTheDocument()
    expect(screen.queryByText(aiIndustry.positioning)).not.toBeInTheDocument()
  })

  it('lets hero secondary select the AI path on-page', async () => {
    const hub = getIndustryHub('en', 'legal')!
    const aiIndustry = aiEmployeeContent.en.industries.find((item) => item.id === 'legal')!
    render(<IndustryHubPage locale="en" hub={hub} />)

    await act(async () => {
      screen.getByRole('button', { name: hub.hero.secondaryCta }).click()
    })
    await flushAnimationFrame()

    expect(screen.getByText(aiIndustry.positioning)).toBeInTheDocument()
    expect(window.location.hash).toBe('#path=aiEmployee')
  })

  it('lets trades-field select AI from the popular priority tile', async () => {
    const hub = getIndustryHub('en', 'trades-field')!
    render(<IndustryHubPage locale="en" hub={hub} />)

    expect(hub.startHere.target).toBe('ai-employee')
    await act(async () => {
      screen.getByRole('option', { name: new RegExp(hub.services.aiEmployee.title, 'i') }).click()
    })
    await flushAnimationFrame()

    expect(window.location.hash).toBe('#path=aiEmployee')
    expect(screen.getByRole('option', { name: new RegExp(hub.services.aiEmployee.title, 'i') })).toHaveAttribute(
      'aria-selected',
      'true',
    )
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
