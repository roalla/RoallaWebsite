import { render, screen } from '@testing-library/react'
import ReviewCampaignPage from '@/components/campaigns/ReviewCampaignPage'

describe('ReviewCampaignPage header tone', () => {
  it('marks the dark hero so the site header can adapt to it', () => {
    render(<ReviewCampaignPage campaign="digital-product-discovery" locale="en" />)
    const hero = screen.getByRole('heading', { level: 1 }).closest('section')
    expect(hero).toHaveAttribute('data-header-tone', 'dark')
  })
})
