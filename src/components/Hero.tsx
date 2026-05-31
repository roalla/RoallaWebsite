'use client'

import React, { useEffect } from 'react'
import { ArrowRight, TrendingUp, Award, Users } from 'lucide-react'
import Link from 'next/link'
import ScheduleButton from './ScheduleButton'
import Reveal from './motion/Reveal'
import { useInViewOnce } from '@/hooks/useInViewOnce'

interface AnimatedCounterProps {
  value: string
  duration?: number
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, duration = 2 }) => {
  const { ref, inView } = useInViewOnce<HTMLSpanElement>()

  useEffect(() => {
    if (!inView || !ref.current) return

    if (value.includes('/') || value === '100%') {
      ref.current.textContent = value
      return
    }

    const numValue = parseInt(value.replace(/\D/g, ''), 10) || 0
    const suffix = value.replace(/\d/g, '')
    let start = 0
    const end = numValue
    const increment = end / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        start = end
        clearInterval(timer)
      }
      if (ref.current) {
        ref.current.textContent = Math.floor(start) + suffix
      }
    }, 1000 / 60)

    return () => clearInterval(timer)
  }, [inView, value, duration, ref])

  return <span ref={ref}>{value}</span>
}

const Hero = () => {
  const stats = [
    { icon: Award, value: '30+', label: 'Years Experience' },
    { icon: Users, value: '500+', label: 'Projects Completed' },
    { icon: TrendingUp, value: '100%', label: 'Client Focused' },
  ]

  return (
    <section id="home" className="relative bg-black pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal when="mount">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-extrabold text-white leading-tight mb-6">
              Empowering Your Business with{' '}
              <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                Strategic Operational Insight
              </span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-gray-300 font-medium leading-relaxed">
              Fractional COO and business consulting services that deliver measurable operational improvements and accelerated growth.
            </p>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Transform your operations with strategic insights, proven methodologies, and hands-on implementation from experienced operational leaders.
            </p>
          </Reveal>

          <Reveal when="mount" delayMs={200} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <ScheduleButton variant="primary" size="lg" icon>
              Schedule Consultation
            </ScheduleButton>
            <Link
              href="/services"
              className="btn-secondary inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 py-4 px-8 text-lg hover:shadow-lg"
            >
              Our Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Reveal>

          <Reveal when="mount" delayMs={400} className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <Reveal
                key={stat.label}
                when="mount"
                delayMs={500 + index * 100}
                className="bg-surface-card backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10 hover:shadow-xl transition-all duration-300"
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
              </Reveal>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default Hero
