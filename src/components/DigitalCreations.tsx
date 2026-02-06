'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ExternalLink, ArrowRight, CheckCircle, Zap, Lightbulb } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import ScheduleButton from './CalendlyButton'

interface DigitalTool {
  name: string
  description: string
  bullets: string[]
  imageUrl?: string
  imageAlt?: string
  badge?: string
  badgeColor?: string
  tryUrl: string
  learnMoreUrl?: string
  icon?: any
}

const DigitalCreations = () => {
  const tools: DigitalTool[] = [
    {
      name: 'Advisory Board Match',
      description: 'Connect businesses with experienced advisory board members who bring strategic expertise and industry insights.',
      bullets: [
        'Built from patterns in client advisory board formation',
        'Matches companies with qualified advisors based on industry, expertise, and needs',
        'Streamlines the advisory board recruitment and onboarding process'
      ],
      imageUrl: '/advisory-board-match.jpg',
      imageAlt: 'Advisory Board Match platform showing Coffee Break feature and dashboard interface',
      badge: 'Live Tool',
      badgeColor: 'bg-green-100 text-green-800',
      tryUrl: 'https://www.advisoryboardmatch.com',
      learnMoreUrl: 'https://www.advisoryboardmatch.com',
      icon: Sparkles
    },
    {
      name: 'Soaring Puck',
      description: 'Strategic business growth platform designed to help companies accelerate their trajectory and achieve breakthrough results.',
      bullets: [
        'Developed from operational excellence frameworks used in 500+ engagements',
        'Provides actionable insights and growth strategies tailored to your business',
        'Combines data-driven analysis with proven methodologies'
      ],
      imageUrl: '/soaring-puck.jpg',
      imageAlt: 'Soaring Puck dashboard showing team management, player tracking, and operational tools interface',
      badge: 'Live Tool',
      badgeColor: 'bg-green-100 text-green-800',
      tryUrl: 'https://www.soaringpuck.com',
      learnMoreUrl: 'https://www.soaringpuck.com',
      icon: Zap
    },
    {
      name: 'True North Audit',
      description: 'Comprehensive business assessment tool that helps organizations identify their strategic direction and operational alignment.',
      bullets: [
        'Based on 30+ years of business assessment experience',
        'Evaluates strategic positioning, operational efficiency, and growth readiness',
        'Delivers actionable recommendations for immediate improvement'
      ],
      imageUrl: '/true-north-audit.jpg',
      imageAlt: 'True North Audit AI-powered platform landing page showing enterprise-grade infrastructure security and compliance features',
      badge: 'Live Tool',
      badgeColor: 'bg-green-100 text-green-800',
      tryUrl: 'https://www.truenorthaudit.com',
      learnMoreUrl: 'https://www.truenorthaudit.com',
      icon: Lightbulb
    }
  ]

  return (
    <section id="digital-creations" className="section-padding bg-white py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-gray-900 mb-4">
            Digital Creations Portfolio
          </h2>
          <p className="text-lg md:text-xl text-gray-600 font-medium mb-8">
            Built by Roalla – Practical Tools Demonstrating Real-World Enablement Expertise
          </p>
        </motion.div>

        {/* Intro Paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-16"
        >
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            At Roalla Business Enablement Group, we bridge strategy and execution. While our core work is strategic consulting, fractional COO services, process optimization, and innovation advisory, we frequently create custom digital tools to solve client challenges faster and more effectively.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            This Digital Creations Portfolio features a family of supportive apps and tools born from real patterns observed across 500+ projects and 30+ years of experience. Each one reflects the same rigor, practicality, and business-first mindset we bring to every engagement.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            These are not side projects—they are living proofs of concept that showcase our ability to turn insights into actionable software. Explore them to see our approach in action, and contact us if you'd like to discuss customizing or applying similar solutions for your organization.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-16">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/20 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {tool.imageUrl ? (
                      <Image
                        src={tool.imageUrl}
                        alt={tool.imageAlt || tool.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {tool.icon && (
                          <tool.icon className="w-16 h-16 text-gray-400" />
                        )}
                      </div>
                    )}
                {tool.badge && (
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold z-10 ${tool.badgeColor || 'bg-primary text-white'}`}>
                    {tool.badge}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{tool.name}</h3>
                <p className="text-gray-700 text-base leading-relaxed mb-4">{tool.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {tool.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex items-start text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={tool.tryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm flex-1 sm:flex-none"
                  >
                    Try the Tool
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                  {tool.learnMoreUrl && (
                    <a
                      href={tool.learnMoreUrl}
                      className="inline-flex items-center justify-center text-primary hover:text-primary-dark font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm border border-primary hover:bg-primary/5"
                    >
                      Learn More
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing CTA Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary via-primary-dark to-primary rounded-2xl p-10 md:p-16 text-center shadow-2xl"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Explore How Our Hands-On Approach Can Accelerate Your Results?
          </h3>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            These creations are extensions of how we empower businesses every day. Interested in a tool tailored to your operations, or want to see one integrated into a consulting engagement?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ScheduleButton variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-50">
              Schedule a Discovery Call
            </ScheduleButton>
            <a
              href="mailto:sales@roalla.com"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 border-2 border-white/30 hover:border-white/50"
            >
              Contact Us
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default DigitalCreations
