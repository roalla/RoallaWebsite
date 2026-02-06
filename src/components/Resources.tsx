'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FileText, BookOpen, Download, ArrowRight, TrendingUp, BarChart3, Lightbulb, Lock } from 'lucide-react'
import Link from 'next/link'

const Resources = () => {
  const resources = [
    {
      icon: FileText,
      title: 'Business Growth Guide',
      description: 'A comprehensive guide to scaling your business strategically and sustainably.',
      type: 'Guide',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: BarChart3,
      title: 'Risk Management Templates',
      description: 'Download our proven risk management templates and more to get your journey started.',
      type: 'Template',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: TrendingUp,
      title: 'ROI Calculator',
      description: 'Calculate the potential return on investment for your business initiatives.',
      type: 'Tool',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Lightbulb,
      title: 'Strategic Planning Framework',
      description: 'Learn our proven framework for developing effective business strategies.',
      type: 'Framework',
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const insights = [
    {
      title: '5 Key Metrics Every Business Should Track',
      description: 'Discover the essential metrics that drive business success and growth.',
      readTime: '5 min read'
    },
    {
      title: 'Fractional COO: When and Why Your Business Needs One',
      description: 'Learn how fractional COO services can transform your operational management.',
      readTime: '7 min read'
    },
    {
      title: 'Strategic Planning for Small Businesses',
      description: 'A practical guide to creating and executing effective business strategies.',
      readTime: '6 min read'
    }
  ]

  return (
    <section id="resources" className="section-padding bg-white py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-gray-900 mb-6">
            Resources & Insights
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Access valuable tools, guides, and insights to help grow your business.
          </p>
        </motion.div>

        {/* Access Required CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary via-primary-dark to-primary rounded-2xl p-10 md:p-16 text-center shadow-2xl mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Exclusive Resources Portal
          </h3>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get access to exclusive business guides, templates, tools, and insights. 
            Request access to unlock valuable resources for your business growth.
          </p>
          <Link
            href="/resources/request"
            className="inline-flex items-center bg-white text-primary hover:bg-gray-50 font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Lock className="w-5 h-5 mr-2" />
            Request Access
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            What's Inside the Portal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 opacity-75"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${resource.color} rounded-lg flex items-center justify-center mb-4`}>
                  <resource.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
                  {resource.type}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{resource.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{resource.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Insights Preview */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 md:p-12">
          <div className="flex items-center mb-8">
            <BookOpen className="w-8 h-8 text-primary mr-3" />
            <h3 className="text-3xl font-bold text-gray-900">Featured Insights</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6 shadow-md border border-gray-100 opacity-75"
              >
                <div className="text-xs font-semibold text-gray-500 mb-3">{insight.readTime}</div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">
                  {insight.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">{insight.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/resources/request"
              className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors"
            >
              Request access to read full articles
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Resources
