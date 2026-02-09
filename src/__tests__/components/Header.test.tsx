import React from 'react'
import { render, screen } from '@testing-library/react'
import Header from '@/components/Header'

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, src, width, height }: { alt: string; src: string; width: number; height: number }) => (
    <img alt={alt} src={src} width={width} height={height} />
  ),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))

jest.mock('@/components/CalendlyButton', () => ({
  __esModule: true,
  default: () => <a href="/schedule">Schedule Consultation</a>,
}))

jest.mock('@/components/HeaderAuthSlot', () => ({
  __esModule: true,
  default: () => <a href="/login">Login</a>,
  authSlotPlaceholder: <span aria-hidden />,
}))

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => <div {...props}>{children}</div>,
    a: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => <a href={href} {...props}>{children}</a>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('Header', () => {
  it('renders skip link to main content', () => {
    render(<Header />)
    const skip = screen.getByText(/skip to main content/i)
    expect(skip).toBeInTheDocument()
    expect(skip).toHaveAttribute('href', '#main-content')
  })

  it('renders mobile menu button with accessible label', () => {
    render(<Header />)
    const menuButton = screen.getByRole('button', { name: /open menu/i })
    expect(menuButton).toBeInTheDocument()
  })

  it('renders schedule CTA link', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: /schedule consultation/i })).toBeInTheDocument()
  })
})
