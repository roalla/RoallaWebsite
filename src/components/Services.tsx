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
    <section id="services" className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive consulting solutions tailored to your business needs. 
            We partner with you to achieve sustainable growth and lasting success.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card p-8 hover:transform hover:-translate-y-2 group"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-primary-lighter rounded-xl mb-6 group-hover:bg-accent-light transition-colors duration-300">
                <service.icon className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
              
              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <a
                href="#contact"
                className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors duration-200 group/link"
              >
                Learn More
                <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200" />
              </a>
            </motion.div>
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