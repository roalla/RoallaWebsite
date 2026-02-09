'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, Target, Rocket, CheckCircle, ArrowRight } from 'lucide-react'

const steps = [
  { icon: Search, label: 'Discovery & Assessment' },
  { icon: Target, label: 'Strategic Planning' },
  { icon: Rocket, label: 'Implementation & Support' },
  { icon: CheckCircle, label: 'Continuous Improvement' },
]

export default function HomeHowWeWork() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-serif font-bold text-gray-900">How we work</h2>
          <p className="mt-3 text-gray-700 max-w-xl mx-auto">
            A proven methodology: assess, plan, implement, improve.
          </p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-white shadow-md border border-gray-100 flex items-center justify-center mb-3">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              <span className="text-sm font-medium text-gray-800">{step.label}</span>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link href="/about" className="inline-flex items-center text-primary font-semibold hover:underline">
            Learn more about us
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
