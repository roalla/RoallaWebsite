import React from 'react'
import HomeHero from '@/components/home/HomeHero'
import HomeWhatWeDo from '@/components/home/HomeWhatWeDo'
import HomeOurWork from '@/components/home/HomeOurWork'
import HomeAssessment from '@/components/home/HomeAssessment'
import HomeHowWeWork from '@/components/home/HomeHowWeWork'
import HomeCTA from '@/components/home/HomeCTA'
import HomeTrustedBy from '@/components/home/HomeTrustedBy'
import HomeClosing from '@/components/home/HomeClosing'

export default function Home() {
  return (
    <div className="page-shell">
        <HomeHero />
        <HomeWhatWeDo />
        <HomeOurWork />
        <HomeAssessment />
        <HomeHowWeWork />
        <HomeCTA />
        <HomeTrustedBy />
        <HomeClosing />
    </div>
  )
}
