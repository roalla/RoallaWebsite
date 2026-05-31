import React from 'react'
import HomeHero from '@/components/home/HomeHero'
import HomeOurWork from '@/components/home/HomeOurWork'
import HomeHowWeBuild from '@/components/home/HomeHowWeBuild'
import HomeTestimonials from '@/components/home/HomeTestimonials'
import HomeWhatWeDo from '@/components/home/HomeWhatWeDo'
import HomeAssessment from '@/components/home/HomeAssessment'
import HomeCTA from '@/components/home/HomeCTA'
import HomeClosing from '@/components/home/HomeClosing'

export default function Home() {
  return (
    <div className="page-shell pb-24 lg:pb-0">
        <HomeHero />
        <HomeOurWork />
        <HomeHowWeBuild />
        <HomeTestimonials />
        <HomeWhatWeDo />
        <HomeCTA />
        <HomeAssessment />
        <HomeClosing />
    </div>
  )
}
