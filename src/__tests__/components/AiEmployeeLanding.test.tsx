import React from 'react'
import { render, screen, act } from '@testing-library/react'
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

describe('AiEmployeeLanding industry query sync', () => {
  const replaceState = jest.fn()

  beforeEach(() => {
    replaceState.mockClear()
    window.history.replaceState = replaceState
    window.history.pushState({}, '', '/en/ai-employee')
  })

  it('selects a valid industry from the query string and syncs the URL', () => {
    window.history.pushState({}, '', '/en/ai-employee?industry=legal')

    render(<AiEmployeeLanding locale="en" content={aiEmployeeContent.en} />)

    expect(screen.getByRole('option', { name: /Legal/i })).toHaveAttribute('aria-selected', 'true')
    expect(replaceState).toHaveBeenCalled()
    const lastCall = replaceState.mock.calls.at(-1)
    expect(String(lastCall?.[2])).toContain('industry=legal')
  })

  it('falls back to the first industry for invalid query values', () => {
    window.history.pushState({}, '', '/en/ai-employee?industry=not-real')

    render(<AiEmployeeLanding locale="en" content={aiEmployeeContent.en} />)

    expect(screen.getByRole('option', { name: /IT & Managed Services/i })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    const lastCall = replaceState.mock.calls.at(-1)
    expect(String(lastCall?.[2])).toContain('industry=it-msp')
  })

  it('updates the query when an industry is selected in-page', () => {
    render(<AiEmployeeLanding locale="en" content={aiEmployeeContent.en} />)

    act(() => {
      screen.getByRole('option', { name: /Veterinary/i }).click()
    })

    const lastCall = replaceState.mock.calls.at(-1)
    expect(String(lastCall?.[2])).toContain('industry=veterinary')
    expect(screen.getByRole('option', { name: /Veterinary/i })).toHaveAttribute('aria-selected', 'true')
  })
})
