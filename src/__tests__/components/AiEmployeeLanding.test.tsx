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

async function flushAnimationFrame() {
  await act(async () => {
    await new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => resolve())
    })
  })
}

describe('AiEmployeeLanding industry query sync', () => {
  const replaceState = jest.fn()
  const scrollIntoView = jest.fn()

  beforeEach(() => {
    replaceState.mockClear()
    scrollIntoView.mockClear()
    window.history.replaceState = replaceState
    window.history.pushState({}, '', '/en/ai-employee')
    Element.prototype.scrollIntoView = scrollIntoView
  })

  it('selects a valid industry from the query string, syncs the URL, and scrolls to detail', async () => {
    window.history.pushState({}, '', '/en/ai-employee?industry=legal')

    render(<AiEmployeeLanding locale="en" content={aiEmployeeContent.en} />)
    await flushAnimationFrame()

    expect(screen.getByRole('option', { name: /Legal/i })).toHaveAttribute('aria-selected', 'true')
    expect(replaceState).toHaveBeenCalled()
    const lastCall = replaceState.mock.calls.at(-1)
    expect(String(lastCall?.[2])).toContain('industry=legal')
    expect(scrollIntoView).toHaveBeenCalled()
  })

  it('scrolls to detail for the default industry when it is in the query', async () => {
    window.history.pushState({}, '', '/en/ai-employee?industry=it-msp')

    render(<AiEmployeeLanding locale="en" content={aiEmployeeContent.en} />)
    await flushAnimationFrame()

    expect(screen.getByRole('option', { name: /IT & Managed Services/i })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(scrollIntoView).toHaveBeenCalled()
    expect(String(replaceState.mock.calls.at(-1)?.[2])).toContain('industry=it-msp')
  })

  it('falls back to the first industry for invalid query values and still scrolls', async () => {
    window.history.pushState({}, '', '/en/ai-employee?industry=not-real')

    render(<AiEmployeeLanding locale="en" content={aiEmployeeContent.en} />)
    await flushAnimationFrame()

    expect(screen.getByRole('option', { name: /IT & Managed Services/i })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(scrollIntoView).toHaveBeenCalled()
    const lastCall = replaceState.mock.calls.at(-1)
    expect(String(lastCall?.[2])).toContain('industry=it-msp')
  })

  it('does not rewrite the URL on bare /ai-employee and does not auto-scroll', async () => {
    window.history.pushState({}, '', '/en/ai-employee')

    render(<AiEmployeeLanding locale="en" content={aiEmployeeContent.en} />)
    await flushAnimationFrame()

    expect(replaceState).not.toHaveBeenCalled()
    expect(scrollIntoView).not.toHaveBeenCalled()
    expect(screen.getByRole('option', { name: /IT & Managed Services/i })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('updates the query when an industry is selected in-page', async () => {
    render(<AiEmployeeLanding locale="en" content={aiEmployeeContent.en} />)
    await flushAnimationFrame()

    await act(async () => {
      screen.getByRole('option', { name: /Veterinary/i }).click()
    })
    await flushAnimationFrame()

    const lastCall = replaceState.mock.calls.at(-1)
    expect(String(lastCall?.[2])).toContain('industry=veterinary')
    expect(screen.getByRole('option', { name: /Veterinary/i })).toHaveAttribute('aria-selected', 'true')
    expect(scrollIntoView).toHaveBeenCalled()
  })
})
