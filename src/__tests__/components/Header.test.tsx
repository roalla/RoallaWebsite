import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Header from '@/components/Header'

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}))

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => <a href={href} {...props}>{children}</a>,
  usePathname: () => '/',
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, src, width, height }: { alt: string; src: string; width: number; height: number }) => (
    <img alt={alt} src={src} width={width} height={height} />
  ),
}))

jest.mock('@/components/ScheduleButton', () => ({
  __esModule: true,
  default: () => <a href="/schedule">scheduleConsultation</a>,
}))

describe('Header', () => {
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
    expect(screen.getByRole('link', { name: /scheduleConsultation/i })).toBeInTheDocument()
  })

  it('renders services dropdown with enablement, digital service, and portfolio links', () => {
    render(<Header />)
    const servicesButton = screen.getByRole('button', { name: 'services' })
    expect(servicesButton).toBeInTheDocument()
    fireEvent.click(servicesButton)
    expect(screen.getByRole('menuitem', { name: /businessEnablement/i })).toHaveAttribute('href', '/services')
    expect(screen.getByRole('menuitem', { name: /websitesAndDigital/i })).toHaveAttribute('href', '/services/digital')
    expect(screen.getByRole('menuitem', { name: /ourWork/i })).toHaveAttribute('href', '/digital-creations')
  })
})
