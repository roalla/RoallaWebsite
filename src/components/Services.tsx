'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  Target, 
  BarChart3, 
  Lightbulb, 
  Zap,
  ArrowRight,
  CheckCircle,
  Briefcase,
  BarChart2,
  ShieldCheck
} from 'lucide-react'
import CalendlyButton from './CalendlyButton'

const services = [
  {
    title: "Strategic Planning",
    description: "Develop comprehensive business strategies that align with your vision and market opportunities.",
    icon: Target,
    features: ["Market Analysis", "Competitive Positioning", "Growth Roadmap"]
  },
  {
    title: "Process Optimization",
    description: "Streamline operations and improve efficiency through data-driven process improvements.",
    icon: TrendingUp,
    features: ["Workflow Analysis", "Performance Metrics", "Implementation Support"]
  },
  {
    title: "Team Development",
    description: "Build high-performing teams through leadership development and organizational design.",
    icon: Users,
    features: ["Leadership Training", "Team Building", "Performance Management"]
  },
  {
    title: "Data Analytics",
    description: "Transform your data into actionable insights for better decision-making.",
    icon: BarChart3,
    features: ["Data Strategy", "Reporting Systems", "Predictive Analytics"]
  },
  {
    title: "Innovation Consulting",
    description: "Foster a culture of innovation and implement cutting-edge solutions.",
    icon: Lightbulb,
    features: ["Innovation Strategy", "Technology Assessment", "Change Management"]
  },
  {
    title: "Digital Transformation",
    description: "Navigate the digital landscape with comprehensive transformation strategies.",
    icon: Zap,
    features: ["Technology Roadmap", "Digital Strategy", "Implementation Support"]
  }
]

const Services = () => {
  return (
    <section id="services" className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Our Services</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            Comprehensive business enablement solutions designed to drive growth, efficiency, and innovation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card p-8 hover-lift"
            >
              <div className="flex items-center mb-6">
                <service.icon className="w-8 h-8 text-cyan-500 mr-3" />
                <h3 className="text-xl font-bold text-cyan-800">{service.title}</h3>
              </div>
              
              <p className="text-gray-700 flex-grow mb-6">{service.description}</p>
              
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <motion.a
                href="#contact"
                whileHover={{ x: 5 }}
                className="inline-flex items-center mt-6 text-primary font-semibold hover:text-primary-dark transition-colors duration-200"
              >
                Learn More
                <ArrowRight className="ml-1 w-4 h-4" />
              </motion.a>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-lighter to-gray-50 rounded-2xl p-8 md:p-12 mt-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Business?
          </h3>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Let's discuss how our services can help you achieve your business goals and drive sustainable growth.
          </p>
          <CalendlyButton variant="primary" size="lg">
            Discuss Your Project
          </CalendlyButton>
        </motion.div>
      </div>
    </section>
  )
}

export default Services 