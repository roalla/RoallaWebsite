import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Header from '@/components/Header'

const mockPathname = jest.fn(() => '/')

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}))

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string | { pathname: string; hash?: string } }) => {
    const resolvedHref = typeof href === 'string' ? href : `${href.pathname}${href.hash ? `#${href.hash}` : ''}`
    return <a href={resolvedHref} {...props}>{children}</a>
  },
  usePathname: () => mockPathname(),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, src, width, height }: { alt: string; src: string; width: number; height: number }) => (
    <img alt={alt} src={src} width={width} height={height} />
  ),
}))

jest.mock('@/components/ScheduleButton', () => ({
  __esModule: true,
  default: () => <a href="/schedule">scheduleConsultationDigital</a>,
}))

describe('Header', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/')
  })

  it('renders skip link to main content', () => {
    render(<Header />)
    const skip = screen.getByText('skipToContent')
    expect(skip).toBeInTheDocument()
    expect(skip).toHaveAttribute('href', '#main-content')
  })

  it('renders mobile menu button with accessible label', () => {
    render(<Header />)
    const menuButton = screen.getByRole('button', { name: 'openMenu' })
    expect(menuButton).toBeInTheDocument()
  })

  it('renders schedule CTA link', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: /scheduleConsultationDigital/i })).toBeInTheDocument()
  })

  it('renders Client Portal link to portal.roalla.com', () => {
    render(<Header />)
    const portalLinks = screen.getAllByRole('link', { name: 'clientPortalAria' })
    expect(portalLinks.length).toBeGreaterThan(0)
    portalLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', 'https://portal.roalla.com')
    })
  })

  it('renders digital enablement dropdown with digital service links', () => {
    render(<Header />)
    const digitalButton = screen.getByRole('button', { name: 'digitalEnablement' })
    expect(digitalButton).toBeInTheDocument()
    fireEvent.click(digitalButton)
    expect(screen.getByRole('menuitem', { name: /digitalOverview/i })).toHaveAttribute('href', '/services/digital')
    expect(screen.getByRole('menuitem', { name: /digitalWebsites/i })).toHaveAttribute('href', '/website-design')
  })

  it('marks only the matching dropdown item for the current page', () => {
    mockPathname.mockReturnValue('/services/digital')
    render(<Header />)
    fireEvent.click(screen.getByRole('button', { name: 'digitalEnablement' }))

    const current = screen.getAllByRole('menuitem').filter(
      (item) => item.getAttribute('aria-current') === 'page',
    )
    expect(current).toHaveLength(1)
    expect(current[0]).toHaveAttribute('href', '/services/digital')
  })

  it.each([
    '/services/digital',
    '/website-design',
    '/services/digital-products',
    '/services/portfolio',
    '/services/portfolio/websites',
  ])('renders digital portfolio on %s', (path) => {
    mockPathname.mockReturnValue(path)
    render(<Header />)
    const portfolioLinks = screen.getAllByRole('link', { name: 'digitalPortfolio' })
    expect(portfolioLinks.length).toBeGreaterThan(0)
    portfolioLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/services/portfolio')
    })
  })

  it.each(['/', '/services/automation', '/programs/workshops'])(
    'hides digital portfolio on %s',
    (path) => {
      mockPathname.mockReturnValue(path)
      render(<Header />)
      expect(screen.queryByRole('link', { name: 'digitalPortfolio' })).not.toBeInTheDocument()
    },
  )

  it('renders advisory dropdown with business advisory link', () => {
    render(<Header />)
    fireEvent.click(screen.getByRole('button', { name: 'advisory' }))
    expect(screen.getByRole('menuitem', { name: /businessEnablement/i })).toHaveAttribute(
      'href',
      '/programs/business-enablement',
    )
    expect(screen.getByRole('menuitem', { name: /technologyAdvisory/i })).toHaveAttribute(
      'href',
      '/programs/technology-advisory',
    )
  })

  it('renders team workshops as a submenu of workshops', () => {
    render(<Header />)
    fireEvent.click(screen.getByRole('button', { name: 'workshops' }))
    expect(screen.getByRole('menuitem', { name: /teamWorkshops/i })).toHaveAttribute(
      'href',
      '/programs/workshops',
    )
    expect(screen.getByRole('menuitem', { name: /workloadConversation/i })).toHaveAttribute(
      'href',
      '/programs/workshops/workload-conversation',
    )
    expect(screen.getByRole('menuitem', { name: /digitalCalm/i })).toHaveAttribute(
      'href',
      '/programs/workshops/digital-calm',
    )
    expect(screen.getByRole('menuitem', { name: /decisionHour/i })).toHaveAttribute(
      'href',
      '/programs/workshops/decision-hour',
    )
    expect(screen.getByRole('menuitem', { name: /offerPage/i })).toHaveAttribute(
      'href',
      '/programs/workshops/offer-page',
    )
  })

  it('marks team workshops when that page is selected', () => {
    mockPathname.mockReturnValue('/programs/workshops')
    render(<Header />)
    fireEvent.click(screen.getByRole('button', { name: 'workshops' }))
    expect(screen.getByRole('menuitem', { name: /teamWorkshops/i })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('hides founding client promo on the homepage', () => {
    render(<Header />)
    expect(screen.queryByRole('link', { name: 'foundingPromoLabel' })).not.toBeInTheDocument()
  })

  it('renders founding client promo on digital routes', () => {
    mockPathname.mockReturnValue('/services/digital')
    render(<Header />)
    const promoLinks = screen.getAllByRole('link', { name: 'foundingPromoLabel' })
    expect(promoLinks.length).toBeGreaterThan(0)
    promoLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/website-package')
    })
  })

  it('hides founding client promo on the founding client page', () => {
    mockPathname.mockReturnValue('/website-package')
    render(<Header />)
    expect(screen.queryByRole('link', { name: 'foundingPromoLabel' })).not.toBeInTheDocument()
  })
})
