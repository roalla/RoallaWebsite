import React from 'react'
import HomeHero from '@/components/home/HomeHero'
import HomeWhatWeDo from '@/components/home/HomeWhatWeDo'
import HomeOurWork from '@/components/home/HomeOurWork'
import HomeTestimonials from '@/components/home/HomeTestimonials'
import HomeHowWeBuild from '@/components/home/HomeHowWeBuild'
import HomeAssessment from '@/components/home/HomeAssessment'
import HomeCTA from '@/components/home/HomeCTA'
import HomeClosing from '@/components/home/HomeClosing'

export default function Home() {
  return (
    <div className="page-shell pb-24 lg:pb-0">
      <HomeHero />
      <HomeWhatWeDo />
      <HomeOurWork />
      <HomeTestimonials />
      <HomeHowWeBuild />
      <HomeCTA />
      <HomeAssessment />
      <HomeClosing />
    </div>
  )
}
