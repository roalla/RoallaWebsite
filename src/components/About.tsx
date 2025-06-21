'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Award, Clock, Heart } from 'lucide-react'
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
    { number: '15+', label: 'Years Experience' },
    { number: '500+', label: 'Projects Completed' },
    { number: '200+', label: 'Happy Clients' },
    { number: '95%', label: 'Success Rate' }
  ]

  return (
    <section id="about" className="section-padding bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="lg:pr-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-black dark:text-white">About Roalla Business Enablement Group</h2>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
              Roalla was founded on the principle that every business deserves a clear path to success. Our team of experienced consultants is passionate about helping you navigate the complexities of the modern business landscape.
            </p>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              We believe in building strong, collaborative partnerships with our clients. Your vision is our mission, and we are dedicated to providing the strategies and support you need to achieve your goals.
            </p>
          </div>
          <div>
            <Image
              src="/placeholder-about.jpg"
              alt="Our Team"
              width={600}
              height={400}
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>

        {/* Values */}
        <div className="grid sm:grid-cols-2 gap-6 mt-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-start space-x-3"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-primary-lighter rounded-lg flex items-center justify-center">
                <value.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{value.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{value.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-2 gap-6 mt-8">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="text-3xl font-bold text-primary mb-2">{achievement.number}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{achievement.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Professional Image Placeholder */}
        <div className="bg-gradient-to-br from-primary-lighter to-gray-100 dark:from-primary-dark/20 dark:to-gray-800 rounded-2xl p-8 text-center mt-8">
          <div className="w-24 h-24 bg-white dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Award className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Professional Excellence</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Certified consultants with proven track records in business transformation and growth strategies.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="mt-16 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              "To empower businesses and entrepreneurs with strategic insights, innovative solutions, 
              and unwavering support to achieve their full potential and create lasting impact in their industries."
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About 