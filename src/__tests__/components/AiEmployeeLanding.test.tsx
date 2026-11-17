import React from 'react'
import { render, screen } from '@testing-library/react'
import AiEmployeeLanding from '@/components/AiEmployeeLanding'
import { aiEmployeeContent } from '@/lib/ai-employee-content'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}))

jest.mock('@/i18n/navigation', () => ({
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string | { pathname: string; query?: Record<string, string> }
  }) => {
    const resolved =
      typeof href === 'string'
        ? href
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

jest.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => true,
}))

describe('AiEmployeeLanding product CTAs', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/en/ai-employee')
  })

  it('renders product conversion CTAs without an industry listbox', () => {
    render(<AiEmployeeLanding locale="en" content={aiEmployeeContent.en} />)

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('option')).not.toBeInTheDocument()

    const fitLinks = screen.getAllByRole('link', { name: /Check AI Employee fit/i })
    expect(fitLinks.length).toBeGreaterThanOrEqual(2)
    expect(fitLinks[0]).toHaveAttribute('href', expect.stringContaining('/tools/ai-employee-fit-brief'))
    expect(fitLinks[0]).toHaveAttribute('href', expect.stringContaining('campaign=ai-employee'))
    expect(fitLinks[0].getAttribute('href')).not.toContain('industry=')

    const contactLinks = screen.getAllByRole('link', { name: /Talk with ROALLA/i })
    expect(contactLinks[0]).toHaveAttribute('href', expect.stringContaining('/contact'))
    expect(contactLinks[0]).toHaveAttribute('href', expect.stringContaining('intent=consulting'))
    expect(contactLinks[0]).toHaveAttribute('href', expect.stringContaining('from_page=%2Fai-employee'))

    expect(screen.getByRole('link', { name: /Browse industry hubs/i })).toHaveAttribute(
      'href',
      '/industries',
    )
  })

  it('ignores legacy industry query params and stays product-only', () => {
    window.history.pushState({}, '', '/en/ai-employee?industry=legal')

    render(<AiEmployeeLanding locale="en" content={aiEmployeeContent.en} />)

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.queryByText(/^Legal$/)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /An AI front line for your business/i,
    )
  })
})
