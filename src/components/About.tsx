'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Award, Clock, Heart, Users } from 'lucide-react'
import Image from 'next/image'

const About = () => {
  const values = [
    {
      icon: CheckCircle,
      title: 'Excellence',
      description: 'We maintain the highest standards in everything we do, delivering exceptional results that exceed expectations.'
    },
    {
      icon: Heart,
      title: 'Integrity',
      description: 'Honest, transparent relationships built on trust and mutual respect with every client we serve.'
    },
    {
      icon: Clock,
      title: 'Commitment',
      description: 'Dedicated to your success with unwavering focus and long-term partnership approach.'
    },
    {
      icon: Award,
      title: 'Innovation',
      description: 'Cutting-edge strategies and creative solutions to keep you ahead of the competition.'
    }
  ]

  const achievements = [
    { number: '30+', label: 'Years Experience' },
    { number: '500+', label: 'Projects Completed' },
  ]

  return (
    <section id="about" className="section-padding bg-gradient-to-br from-gray-50 to-white py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-gray-900 mb-6">
            About Roalla Business Enablement Group
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Your trusted partner in business transformation and operational excellence.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="lg:pr-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Roalla was founded on the principle that every business deserves a clear path to success. Our team of experienced consultants is passionate about helping you navigate the complexities of the modern business landscape.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We believe in building strong, collaborative partnerships with our clients. Your vision is our mission, and we are dedicated to providing the strategies and support you need to achieve your goals.
            </p>
          </div>
          <div>
            {/* Fallback for missing image */}
            <div className="w-full h-80 bg-gradient-to-br from-primary-lighter to-gray-100 dark:from-primary-dark/20 dark:to-gray-800 rounded-xl shadow-2xl flex items-center justify-center">
              <div className="text-center">
                <Users className="w-24 h-24 text-primary dark:text-primary-light mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Our Team</h3>
                <p className="text-gray-700 dark:text-gray-200 mt-2">Professional consultants ready to help your business succeed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <value.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">{value.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-primary via-primary-dark to-primary rounded-2xl p-10 md:p-16 text-center shadow-2xl">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Our Mission
          </h3>
          <p className="text-xl text-white/95 max-w-4xl mx-auto leading-relaxed">
            "To empower businesses and entrepreneurs with strategic insights, innovative solutions, 
            and unwavering support to achieve their full potential and create lasting impact in their industries."
          </p>
        </div>
      </div>
    </section>
  )
}

export default About 