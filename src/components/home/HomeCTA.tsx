'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ClipboardList } from 'lucide-react'
import ScheduleButton from '../CalendlyButton'

export default function HomeCTA() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-10 lg:p-14 shadow-xl"
        >
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Ready to transform your operations?
          </h2>
          <p className="mt-4 text-white/90">
            Start with a free consultation or take our 5-minute business health assessment.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <ScheduleButton
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-gray-50 border-0"
            >
              Schedule Consultation
            </ScheduleButton>
            <Link
              href="/assessment"
              className="inline-flex items-center bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-6 rounded-lg transition-all border border-white/30"
            >
              <ClipboardList className="w-5 h-5 mr-2" />
              Take the Assessment
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/80">
            Or explore our <Link href="/resources" className="underline hover:text-white">resources and insights</Link>.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
