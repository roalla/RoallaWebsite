'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'
import ScheduleButton from './CalendlyButton'

const Contact = () => {
  return (
    <section id="contact" className="section-padding bg-white py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-gray-900 mb-6">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Have questions or want to start a project? We'd love to hear from you. 
            Schedule a free consultation or reach out directly.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
                <Mail className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Email</h4>
              <p className="text-gray-600 mb-3 text-sm">General Inquiries</p>
              <a href="mailto:sales@roalla.com" className="text-primary hover:text-primary-dark font-semibold text-lg transition-colors">
                sales@roalla.com
              </a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-50 to-white rounded-xl p-8 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mx-auto mb-4">
                <Phone className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Phone</h4>
              <p className="text-gray-600 mb-3 text-sm">Mon-Fri, 9am-5pm EST</p>
              <a href="tel:+12898385868" className="text-primary hover:text-primary-dark font-semibold text-lg transition-colors">
                (289) 838-5868
              </a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-8 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600 mx-auto mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Location</h4>
              <p className="text-gray-600 mb-1">Burlington, ON, Canada</p>
              <p className="text-gray-600 text-sm">Serving clients globally</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <ScheduleButton variant="primary" size="lg" icon>
              Schedule Your Free Consultation
            </ScheduleButton>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact 