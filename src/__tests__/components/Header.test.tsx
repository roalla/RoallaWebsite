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
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => <a href={href} {...props}>{children}</a>,
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

  it('renders digital enablement dropdown with digital service links', () => {
    render(<Header />)
    const digitalButton = screen.getByRole('button', { name: 'digitalEnablement' })
    expect(digitalButton).toBeInTheDocument()
    fireEvent.click(digitalButton)
    expect(screen.getByRole('menuitem', { name: /digitalOverview/i })).toHaveAttribute('href', '/services/digital')
    expect(screen.getByRole('menuitem', { name: /digitalWebsites/i })).toHaveAttribute('href', '/website-design')
  })

  it('does not pre-highlight digital dropdown items on the current page', () => {
    mockPathname.mockReturnValue('/services/digital')
    render(<Header />)
    fireEvent.click(screen.getByRole('button', { name: 'digitalEnablement' }))

    screen.getAllByRole('menuitem').forEach((item) => {
      expect(item).not.toHaveAttribute('aria-current')
    })
  })

  it('renders digital portfolio as a top-level nav link', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: 'digitalPortfolio' })).toHaveAttribute('href', '/services/portfolio')
  })

  it('renders programs dropdown with program links', () => {
    render(<Header />)
    fireEvent.click(screen.getByRole('button', { name: 'programs' }))
    expect(screen.getByRole('menuitem', { name: /businessEnablement/i })).toHaveAttribute(
      'href',
      '/programs/business-enablement',
    )
    expect(screen.getByRole('menuitem', { name: /workshops/i })).toHaveAttribute('href', '/programs/workshops')
  })

  it('renders founding client promo on the homepage', () => {
    render(<Header />)
    const promoLinks = screen.getAllByRole('link', { name: 'foundingPromoLabel' })
    expect(promoLinks.length).toBeGreaterThan(0)
    promoLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/founding-client')
    })
  })

  it('renders founding client promo on non-offer pages', () => {
    mockPathname.mockReturnValue('/services/digital')
    render(<Header />)
    const promoLinks = screen.getAllByRole('link', { name: 'foundingPromoLabel' })
    expect(promoLinks.length).toBeGreaterThan(0)
    promoLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/founding-client')
    })
  })

  it('hides founding client promo on the founding client page', () => {
    mockPathname.mockReturnValue('/founding-client')
    render(<Header />)
    expect(screen.queryByRole('link', { name: 'foundingPromoLabel' })).not.toBeInTheDocument()
  })
})
