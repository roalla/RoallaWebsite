'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FileText, BookOpen, Download, ArrowRight, TrendingUp, BarChart3, Lightbulb } from 'lucide-react'

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
      title: 'Financial Planning Template',
      description: 'Download our proven financial planning template to get started on your journey.',
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
      title: 'Fractional CFO: When and Why Your Business Needs One',
      description: 'Learn how fractional CFO services can transform your financial management.',
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

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${resource.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <resource.icon className="w-7 h-7 text-white" />
              </div>
              <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
                {resource.type}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.title}</h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{resource.description}</p>
              <div className="flex items-center text-primary font-semibold text-sm group-hover:underline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </div>
            </motion.div>
          ))}
        </div>

        {/* Insights Section */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 md:p-12">
          <div className="flex items-center mb-8">
            <BookOpen className="w-8 h-8 text-primary mr-3" />
            <h3 className="text-3xl font-bold text-gray-900">Latest Insights</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group cursor-pointer"
              >
                <div className="text-xs font-semibold text-gray-500 mb-3">{insight.readTime}</div>
                <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {insight.title}
                </h4>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{insight.description}</p>
                <div className="flex items-center text-primary font-semibold text-sm group-hover:underline">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Resources
