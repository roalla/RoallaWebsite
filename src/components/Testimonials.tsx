'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: 'Sarah Johnson',
      position: 'CEO, TechStart Inc.',
      company: 'Technology',
      content: 'Roalla Consulting transformed our business strategy completely. Their insights helped us scale from a startup to a market leader in just 18 months. The ROI was incredible.',
      rating: 5,
      image: '/api/placeholder/60/60'
    },
    {
      name: 'Michael Chen',
      position: 'Founder, GreenSolutions',
      company: 'Sustainability',
      content: 'Working with Roalla was a game-changer. They didn\'t just provide advice—they became true partners in our growth journey. Our revenue increased by 300% in the first year.',
      rating: 5,
      image: '/api/placeholder/60/60'
    },
    {
      name: 'Emily Rodriguez',
      position: 'COO, RetailPlus',
      company: 'Retail',
      content: 'The strategic planning and optimization strategies from Roalla Consulting helped us streamline operations and improve efficiency by 40%. Their expertise is unmatched.',
      rating: 5,
      image: '/api/placeholder/60/60'
    },
    {
      name: 'David Thompson',
      position: 'Managing Director, FinanceCorp',
      company: 'Financial Services',
      content: 'Roalla\'s risk management and growth strategies were exactly what we needed. They helped us navigate market challenges and achieve sustainable growth.',
      rating: 5,
      image: '/api/placeholder/60/60'
    },
    {
      name: 'Lisa Wang',
      position: 'VP Operations, HealthTech',
      company: 'Healthcare',
      content: 'The leadership development program and innovation consulting services from Roalla have been transformative for our organization. Highly recommended!',
      rating: 5,
      image: '/api/placeholder/60/60'
    }
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="section-padding bg-white">
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
            What Our <span className="gradient-text">Clients Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what business leaders have to say about 
            their experience working with Roalla Business Enablement Group.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-primary-lighter to-gray-50 rounded-2xl p-8 md:p-12 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-primary-light opacity-50">
                <Quote className="w-12 h-12" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-xl md:text-2xl text-gray-800 mb-8 leading-relaxed">
                "{testimonials[currentIndex].content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-16 h-16 bg-primary-lighter rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-dark font-bold text-lg">
                    {testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonials[currentIndex].name}</div>
                  <div className="text-gray-600">{testimonials[currentIndex].position}</div>
                  <div className="text-sm text-primary">{testimonials[currentIndex].company}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className="p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Dots */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">98%</div>
            <div className="text-gray-600">Client Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">85%</div>
            <div className="text-gray-600">Revenue Growth</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">12+</div>
            <div className="text-gray-600">Industries Served</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials 