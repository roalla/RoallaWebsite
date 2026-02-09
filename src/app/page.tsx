import React from 'react'
import HomeHero from '@/components/home/HomeHero'
import HomeWhatWeDo from '@/components/home/HomeWhatWeDo'
import HomeHowWeWork from '@/components/home/HomeHowWeWork'
import HomeCTA from '@/components/home/HomeCTA'
import HomeTrustedBy from '@/components/home/HomeTrustedBy'
import HomeFeaturedInsight from '@/components/home/HomeFeaturedInsight'

export default function Home() {
  return (
    <main className="min-h-screen bg-white transition-colors duration-300">
      <div id="main-content">
        <HomeHero />
        <HomeWhatWeDo />
        <HomeHowWeWork />
        <HomeCTA />
        <HomeTrustedBy />
        <HomeFeaturedInsight />
      </div>
    </main>
  )
}
