import React from 'react'
import { render, screen } from '@testing-library/react'
import PartnersTelarusSection from '@/components/partners/PartnersTelarusSection'

jest.mock('next-intl/server', () => ({
  getTranslations: async (namespace: string) => {
    if (namespace === 'partnersPlatforms') {
      return (key: string) => key
    }
    if (namespace === 'home.technologyEcosystem') {
      return (key: string) => key
    }
    if (namespace === 'common') {
      return (key: string) => key
    }
    return (key: string) => key
  },
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}))

jest.mock('@/i18n/navigation', () => ({
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

jest.mock('@/components/motion/Reveal', () => ({
  __esModule: true,
  default: ({
    children,
    as: As = 'div',
    className,
  }: {
    children: React.ReactNode
    as?: keyof JSX.IntrinsicElements
    className?: string
    delayMs?: number
  }) => <As className={className}>{children}</As>,
}))

jest.mock('@/components/partners/PartnersBrandLockup', () => ({
  __esModule: true,
  default: () => <div>PartnersBrandLockup</div>,
}))

jest.mock('@/lib/technologyEcosystem', () => ({
  ecosystemLogos: {
    telarus: {
      src: '/images/partners/telarus-logo.png',
      width: 120,
      height: 40,
      className: '',
    },
  },
}))

describe('PartnersTelarusSection', () => {
  it('renders the customer-facing Alliance Network callout', async () => {
    const ui = await PartnersTelarusSection()
    render(ui)

    expect(screen.getByRole('heading', { name: 'allianceTitle' })).toBeInTheDocument()
    expect(screen.getByText('allianceEyebrow')).toBeInTheDocument()
    expect(screen.getByText('allianceBody')).toBeInTheDocument()
    expect(screen.getByText('allianceProof1')).toBeInTheDocument()
    expect(screen.getByText('allianceProof2')).toBeInTheDocument()
    expect(screen.getByText('allianceServicesLabel')).toBeInTheDocument()
    expect(screen.getByText('allianceCategory5')).toBeInTheDocument()
    expect(screen.getByText('allianceCategory8')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'allianceCategory5' })).toHaveAttribute(
      'href',
      '/ai-employee',
    )
    expect(screen.getByRole('link', { name: 'allianceCta' })).toBeInTheDocument()
    expect(document.getElementById('alliance-network')).toBeTruthy()
  })
})
