import React from 'react'
import HomeHero from '@/components/home/HomeHero'
import HomeWhatWeDo from '@/components/home/HomeWhatWeDo'
import HomeAssessment from '@/components/home/HomeAssessment'
import HomeHowWeWork from '@/components/home/HomeHowWeWork'
import HomeCTA from '@/components/home/HomeCTA'
import HomeTrustedBy from '@/components/home/HomeTrustedBy'
import HomeClosing from '@/components/home/HomeClosing'

export default function Home() {
  return (
    <main className="min-h-screen bg-black transition-colors duration-300">
      <div id="main-content">
        <HomeHero />
        <HomeWhatWeDo />
        <HomeAssessment />
        <HomeHowWeWork />
        <HomeCTA />
        <HomeTrustedBy />
        <HomeClosing />
      </div>
    </main>
  )
}
