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
  default: () => <a href="/schedule">ctaNextSteps</a>,
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
    expect(screen.getByRole('link', { name: /ctaNextSteps/i })).toBeInTheDocument()
  })

  it('renders services dropdown with enablement, workshops, and digital service links', () => {
    render(<Header />)
    const servicesButton = screen.getByRole('button', { name: 'services' })
    expect(servicesButton).toBeInTheDocument()
    fireEvent.click(servicesButton)
    expect(screen.getByRole('menuitem', { name: /businessEnablement/i })).toHaveAttribute('href', '/services')
    expect(screen.getByRole('menuitem', { name: /websitesAndDigital/i })).toHaveAttribute('href', '/services/digital')
    expect(screen.queryByRole('menuitem', { name: /ourWork/i })).not.toBeInTheDocument()
  })

  it('highlights only the matching service in the dropdown', () => {
    mockPathname.mockReturnValue('/services/digital')
    render(<Header />)
    fireEvent.click(screen.getByRole('button', { name: 'services' }))

    expect(screen.getByRole('menuitem', { name: /businessEnablement/i })).not.toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('menuitem', { name: /websitesAndDigital/i })).toHaveAttribute('aria-current', 'page')
  })

  it('renders digital portfolio as a top-level nav link', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: 'digitalPortfolio' })).toHaveAttribute('href', '/services/portfolio')
  })

  it('does not render apps dropdown in header', () => {
    render(<Header />)
    expect(screen.queryByRole('button', { name: 'apps' })).not.toBeInTheDocument()
  })
})
