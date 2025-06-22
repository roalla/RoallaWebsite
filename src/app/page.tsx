import React from 'react'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import About from '@/components/About'
import InteractiveAssessment from '@/components/InteractiveAssessment'
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
        <About />
        <InteractiveAssessment />
        <Contact />
      </div>
      
    </main>
  )
} 