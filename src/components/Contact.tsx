'use client'

import React from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import ScheduleButton from './CalendlyButton'

const Contact = () => {
  return (
    <section id="contact" className="bg-gray-50 py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-extrabold text-gray-900">
            Get in Touch
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Have questions or want to start a project? We'd love to hear from you. 
            Schedule a free consultation or reach out directly.
          </p>
          <div className="mt-8">
            <ScheduleButton variant="primary" size="lg" icon>
                Schedule Your Free Consultation
            </ScheduleButton>
          </div>
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                  <Mail className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-900">Email</h4>
                <p className="text-gray-600">General Inquiries</p>
                <a href="mailto:sales@roalla.com" className="text-blue-600 hover:underline text-lg">
                  sales@roalla.com
                </a>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                  <Phone className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-900">Phone</h4>
                <p className="text-gray-600">Mon-Fri, 9am-5pm EST</p>
                <a href="tel:+12898385868" className="text-blue-600 hover:underline text-lg">
                  (289) 838-5868
                </a>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                  <MapPin className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-900">Location</h4>
                <p className="text-gray-600">Burlington, ON, Canada</p>
                <p className="text-gray-600">Serving clients globally</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact 