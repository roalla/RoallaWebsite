import React from 'react'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import TrustIndicators from '@/components/TrustIndicators'
import HowWeWork from '@/components/HowWeWork'
import About from '@/components/About'
import Resources from '@/components/Resources'
import DigitalCreations from '@/components/DigitalCreations'
import InteractiveAssessment from '@/components/InteractiveAssessment'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main className="min-h-screen bg-white transition-colors duration-300">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <div id="main-content">
        <Hero />
        <Services />
        <TrustIndicators />
        <HowWeWork />
        <About />
        <Resources />
        <DigitalCreations />
        <InteractiveAssessment />
        <FAQ />
        <Contact />
      </div>
      
    </main>
  )
} 