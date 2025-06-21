'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Target, 
  Users, 
  TrendingUp, 
  Lightbulb, 
  Shield,
  ArrowRight 
} from 'lucide-react'

const Services = () => {
  const services = [
    {
      icon: BarChart3,
      title: 'Strategic Planning',
      description: 'Comprehensive business strategy development to align your vision with actionable plans for growth and success.',
      features: ['Market Analysis', 'Competitive Positioning', 'Growth Roadmap', 'Performance Metrics']
    },
    {
      icon: Target,
      title: 'Business Optimization',
      description: 'Streamline operations, improve efficiency, and maximize profitability through data-driven optimization strategies.',
      features: ['Process Improvement', 'Cost Reduction', 'Efficiency Analysis', 'Performance Optimization']
    },
    {
      icon: Users,
      title: 'Leadership Development',
      description: 'Build strong leadership teams and develop management skills to drive organizational success and employee engagement.',
      features: ['Team Building', 'Communication Skills', 'Decision Making', 'Conflict Resolution']
    },
    {
      icon: TrendingUp,
      title: 'Growth Strategy',
      description: 'Identify and capitalize on growth opportunities through market expansion, product development, and strategic partnerships.',
      features: ['Market Expansion', 'Product Development', 'Strategic Partnerships', 'Revenue Growth']
    },
    {
      icon: Lightbulb,
      title: 'Innovation Consulting',
      description: 'Foster a culture of innovation and develop creative solutions to stay ahead in competitive markets.',
      features: ['Innovation Strategy', 'Creative Problem Solving', 'Technology Integration', 'Change Management']
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Identify potential risks and develop comprehensive strategies to protect your business and ensure long-term stability.',
      features: ['Risk Assessment', 'Compliance Management', 'Crisis Planning', 'Business Continuity']
    }
  ]

  return (
    <section id="services" className="section-padding bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black dark:text-white">Our Services</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            We offer a range of services designed to help your business succeed in the digital age.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="card p-8 text-center flex flex-col items-center">
              <div className="bg-primary/10 dark:bg-primary-dark/20 p-4 rounded-full mb-6">
                <service.icon className="w-8 h-8 text-primary dark:text-primary-light" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-black dark:text-white">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 flex-grow">{service.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-lighter to-gray-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Business?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Let's discuss how our consulting services can help you achieve your business goals 
              and drive sustainable growth.
            </p>
            <a href="#contact" className="btn-primary">
              Schedule a Consultation
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Services 