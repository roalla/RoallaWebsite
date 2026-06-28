import React from 'react'
import HomeHero from '@/components/home/HomeHero'
import HomeWhatWeDo from '@/components/home/HomeWhatWeDo'
import HomeTestimonials from '@/components/home/HomeTestimonials'
import HomeCTA from '@/components/home/HomeCTA'
import HomeClosing from '@/components/home/HomeClosing'

export default function Home() {
  return (
    <div className="page-shell pb-24 lg:pb-0">
      <HomeHero />
      <HomeWhatWeDo />
      <HomeTestimonials />
      <HomeCTA />
      <HomeClosing />
    </div>
  )
}
