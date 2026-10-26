import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
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
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string | { pathname: string; hash?: string; params?: Record<string, string> } }) => {
    const resolvedHref = typeof href === 'string'
      ? href
      : `${Object.entries(href.params ?? {}).reduce((path, [key, value]) => path.replace(`[${key}]`, value), href.pathname)}${href.hash ? `#${href.hash}` : ''}`
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
  default: () => <a href="/contact">scheduleConsultationDigital</a>,
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

  it('renders the five featured insights under digital enablement, advisory, and other', () => {
    render(<Header />)
    fireEvent.click(screen.getByRole('button', { name: 'resources' }))
    expect(screen.getByRole('menuitem', { name: /networking-roi-solopreneurs-small-business\.title/ })).toHaveAttribute(
      'href',
      '/insights/networking-roi-solopreneurs-small-business',
    )
    expect(screen.getByRole('menuitem', { name: /professional-email-avoid-spam-phishing\.title/ })).toHaveAttribute(
      'href',
      '/insights/professional-email-avoid-spam-phishing',
    )
    expect(screen.getByRole('menuitem', { name: /search-and-ai-visibility\.title/ })).toHaveAttribute(
      'href',
      '/insights/search-and-ai-visibility',
    )
    expect(screen.getByRole('menuitem', { name: /fractional-coo\.title/ })).toHaveAttribute(
      'href',
      '/insights/fractional-coo',
    )
    expect(screen.getByRole('menuitem', { name: /strategic-planning\.title/ })).toHaveAttribute(
      'href',
      '/insights/strategic-planning',
    )
    expect(screen.queryByRole('menuitem', { name: /smb-digitization-benefits\.title/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('menuitem', { name: /process-optimization\.title/ })).not.toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /resourcesUseCases/ })).toHaveAttribute('href', '/use-cases')
    expect(screen.getByRole('menuitem', { name: /resourcesAll/ })).toHaveAttribute('href', '/insights')
  })

  it('uses the insight slugs chosen in the hub', () => {
    render(
      <Header
        featuredInsightSlugs={[
          'process-optimization',
          'smb-digital-growth',
          'how-ai-systems-understand-websites',
          'structured-data-for-small-business',
          'professional-email-avoid-spam-phishing',
        ]}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'resources' }))
    expect(screen.getByRole('menuitem', { name: /process-optimization\.title/ })).toHaveAttribute(
      'href',
      '/insights/process-optimization',
    )
    expect(screen.queryByRole('menuitem', { name: /fractional-coo\.title/ })).not.toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /resourcesUseCases/ })).toBeInTheDocument()
  })

  it('renders How We Help with direct routes for the seven customer needs', () => {
    render(<Header />)
    const digitalButton = screen.getByRole('button', { name: 'digitalEnablement' })
    expect(digitalButton).toBeInTheDocument()
    fireEvent.click(digitalButton)
    expect(screen.getByRole('menuitem', { name: /helpChooseTechnology/i })).toHaveAttribute('href', '/services/technology-advisory')
    expect(screen.getByRole('menuitem', { name: /helpBuildDigital/i })).toHaveAttribute('href', '/website-design')
    expect(screen.getByRole('menuitem', { name: /helpConnectAutomate/i })).toHaveAttribute('href', '/services/automation')
    expect(screen.getByRole('menuitem', { name: /helpUseAi/i })).toHaveAttribute('href', '/services/ai-agents')
    expect(screen.getByRole('menuitem', { name: /helpGetFound/i })).toHaveAttribute('href', '/services/search-ai-visibility')
    expect(screen.getByRole('menuitem', { name: /helpPlanExecution/i })).toHaveAttribute('href', '/services/business-advisory')
    expect(screen.getByRole('menuitem', { name: /helpDevelopTeam/i })).toHaveAttribute('href', '/programs/workshops')
  })

  it('renders one accessible Ecosystem dropdown with the approved destinations', () => {
    render(<Header />)
    const ecosystemButton = screen.getByRole('button', { name: 'ecosystem' })
    expect(ecosystemButton).toHaveAttribute('aria-haspopup', 'menu')
    fireEvent.click(ecosystemButton)

    const menu = screen.getByRole('menu', { name: 'ecosystem' })
    expect(within(menu).getAllByRole('menuitem')).toHaveLength(6)
    expect(within(menu).getByRole('menuitem', { name: /ecosystemOverview/i })).toHaveAttribute('href', '/partners')
    expect(within(menu).getByRole('menuitem', { name: /ecosystemTechnologyProviders/i })).toHaveAttribute('href', '/partners/technology-providers')
    expect(within(menu).getByRole('menuitem', { name: /ecosystemDeliveryPlatforms/i })).toHaveAttribute('href', '/partners/delivery-platforms')
    expect(within(menu).getByRole('menuitem', { name: /ecosystemStrategicRelationships/i })).toHaveAttribute('href', '/partners/strategic-relationships')
    expect(within(menu).getByRole('menuitem', { name: /ecosystemEvaluation/i })).toHaveAttribute('href', '/partners/evaluation-standard')
    expect(within(menu).getByRole('menuitem', { name: /ecosystemTransparency/i })).toHaveAttribute('href', '/partners/compensation')
  })

  it('keeps business outcomes and supporting service paths clearly exposed', () => {
    render(<Header />)
    expect(screen.queryByRole('button', { name: 'Solutions by Need' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'digitalEnablement' }))

    const menu = screen.getByRole('menu', { name: 'digitalEnablement' })
    expect(within(menu).getByText('helpNeedsHeading')).toBeInTheDocument()
    expect(within(menu).getByText('browseOutcomes')).toBeInTheDocument()
    expect(within(menu).getByRole('menuitem', { name: /browseOutcomesCta/i })).toHaveAttribute(
      'href',
      '/solutions',
    )
    expect(within(menu).getByRole('menuitem', { name: /helpDigitalProducts/i })).toHaveAttribute(
      'href',
      '/services/digital-products',
    )
    expect(within(menu).getByRole('menuitem', { name: /Explore Your Options/i })).toHaveAttribute(
      'href',
      '/assessment',
    )
    expect(within(menu).getAllByRole('menuitem')).toHaveLength(11)
  })

  it('exposes the same customer needs and outcomes in the mobile navigation', () => {
    render(<Header />)
    fireEvent.click(screen.getByRole('button', { name: 'openMenu' }))
    const mobileToggle = screen
      .getAllByRole('button', { name: 'digitalEnablement' })
      .find((button) => button.getAttribute('aria-controls') === 'how-we-help-mobile-panel')
    expect(mobileToggle).toBeDefined()
    fireEvent.click(mobileToggle!)

    const panel = document.getElementById('how-we-help-mobile-panel')
    expect(panel).toBeInTheDocument()
    expect(within(panel!).getByRole('link', { name: /helpBuildDigital/i })).toHaveAttribute('href', '/website-design')
    expect(within(panel!).getByRole('link', { name: /helpConnectAutomate/i })).toHaveAttribute('href', '/services/automation')
    expect(within(panel!).getByRole('link', { name: /browseOutcomes/i })).toHaveAttribute('href', '/solutions')
  })

  it('exposes the Ecosystem destinations in mobile navigation', () => {
    render(<Header />)
    fireEvent.click(screen.getByRole('button', { name: 'openMenu' }))
    const ecosystemToggle = screen
      .getAllByRole('button', { name: 'ecosystem' })
      .find((button) => button.getAttribute('aria-controls') === 'ecosystem-mobile-panel')
    expect(ecosystemToggle).toBeDefined()
    fireEvent.click(ecosystemToggle!)

    const panel = document.getElementById('ecosystem-mobile-panel')
    expect(within(panel!).getAllByRole('link')).toHaveLength(6)
    expect(within(panel!).getByRole('link', { name: /ecosystemTransparency/i })).toHaveAttribute('href', '/partners/compensation')
  })

  it('marks only the matching dropdown item for the current page', () => {
    mockPathname.mockReturnValue('/website-design')
    render(<Header />)
    fireEvent.click(screen.getByRole('button', { name: 'digitalEnablement' }))

    const current = screen.getAllByRole('menuitem').filter(
      (item) => item.getAttribute('aria-current') === 'page',
    )
    expect(current).toHaveLength(1)
    expect(current[0]).toHaveAttribute('href', '/website-design')
  })

  it('renders digital portfolio only on website-design', () => {
    mockPathname.mockReturnValue('/website-design')
    render(<Header />)
    const portfolioLinks = screen.getAllByRole('link', { name: 'digitalPortfolio' })
    expect(portfolioLinks.length).toBeGreaterThan(0)
    portfolioLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/services/portfolio')
    })
  })

  it.each([
    '/',
    '/services/digital',
    '/services/digital-products',
    '/services/portfolio',
    '/services/automation',
    '/programs/workshops',
  ])('hides digital portfolio on %s', (path) => {
    mockPathname.mockReturnValue(path)
    render(<Header />)
    expect(screen.queryByRole('link', { name: 'digitalPortfolio' })).not.toBeInTheDocument()
  })

  it('offers advisory outcomes and engagement options in one category', () => {
    render(<Header />)
    fireEvent.click(screen.getByRole('button', { name: 'businessAdvisoryWorkshops' }))
    const menu = screen.getByRole('menu', { name: 'businessAdvisoryWorkshops' })
    expect(within(menu).getByText('businessOutcomesHeading')).toBeInTheDocument()
    expect(within(menu).getByText('businessOptionsHeading')).toBeInTheDocument()
    expect(within(menu).getByRole('menuitem', { name: /businessOutcomeDirection/i })).toHaveAttribute(
      'href',
      '/services/business-advisory',
    )
    expect(within(menu).getByRole('menuitem', { name: /businessOutcomeIdeas/i })).toHaveAttribute(
      'href',
      '/programs/workshops/ideation',
    )
    expect(screen.getByRole('menuitem', { name: /businessEnablement/i })).toHaveAttribute(
      'href',
      '/services/business-advisory',
    )
    expect(screen.getByRole('menuitem', { name: /teamWorkshops/i })).toHaveAttribute(
      'href',
      '/programs/workshops',
    )
    expect(screen.getByRole('menuitem', { name: /focusCircle/i })).toHaveAttribute(
      'href',
      '/programs/workshops/focus-circle',
    )
    expect(screen.queryByRole('menuitem', { name: /workloadConversation/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('menuitem', { name: /digitalCalm/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('menuitem', { name: /decisionHour/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('menuitem', { name: /offerPage/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('menuitem', { name: /theShortlist/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('menuitem', { name: /firstOffer/i })).not.toBeInTheDocument()
    const items = within(menu).getAllByRole('menuitem')
    expect(items).toHaveLength(7)
    expect(items[5]).toHaveAttribute('href', '/programs/workshops')
    expect(items[6]).toHaveAttribute('href', '/programs/workshops/focus-circle')
    expect(within(menu).getAllByRole('separator')).toHaveLength(1)
  })

  it('marks team workshops when that page is selected', () => {
    mockPathname.mockReturnValue('/programs/workshops')
    render(<Header />)
    fireEvent.click(screen.getByRole('button', { name: 'businessAdvisoryWorkshops' }))
    expect(screen.getByRole('menuitem', { name: /teamWorkshops/i })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it.each(['/services/business-advisory', '/programs/workshops'])(
    'opens only Advisory & Workshops on mobile for %s',
    (path) => {
      mockPathname.mockReturnValue(path)
      render(<Header />)
      fireEvent.click(screen.getByRole('button', { name: 'openMenu' }))

      const howWeHelpToggle = screen
        .getAllByRole('button', { name: 'digitalEnablement' })
        .find((button) => button.getAttribute('aria-controls') === 'how-we-help-mobile-panel')
      const advisoryToggle = screen
        .getAllByRole('button', { name: 'businessAdvisoryWorkshops' })
        .find((button) => button.getAttribute('aria-controls') === 'business-outcomes-mobile-panel')

      expect(howWeHelpToggle).toHaveAttribute('aria-expanded', 'false')
      expect(advisoryToggle).toHaveAttribute('aria-expanded', 'true')
    },
  )

  it('opens only How We Help on mobile for a general service need', () => {
    mockPathname.mockReturnValue('/services/ai-agents')
    render(<Header />)
    fireEvent.click(screen.getByRole('button', { name: 'openMenu' }))

    const howWeHelpToggle = screen
      .getAllByRole('button', { name: 'digitalEnablement' })
      .find((button) => button.getAttribute('aria-controls') === 'how-we-help-mobile-panel')
    const advisoryToggle = screen
      .getAllByRole('button', { name: 'businessAdvisoryWorkshops' })
      .find((button) => button.getAttribute('aria-controls') === 'business-outcomes-mobile-panel')

    expect(howWeHelpToggle).toHaveAttribute('aria-expanded', 'true')
    expect(advisoryToggle).toHaveAttribute('aria-expanded', 'false')
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
