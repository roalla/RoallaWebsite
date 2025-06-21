'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Award, Clock, Heart } from 'lucide-react'

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
    <section id="about" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About <span className="gradient-text">Roalla Business Enablement Group</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              With over 15 years of experience in business consulting, we've helped hundreds of companies 
              transform their operations, scale their growth, and achieve sustainable success in competitive markets.
            </p>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our approach combines deep industry expertise with innovative thinking to deliver 
              customized solutions that drive real results. We don't just provide advice—we partner 
              with you to implement lasting change.
            </p>

            {/* Values */}
            <div className="grid sm:grid-cols-2 gap-6">
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
                    <h4 className="font-semibold text-gray-900 mb-1">{value.title}</h4>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats & Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Achievement Stats */}
            <div className="grid grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="text-3xl font-bold text-primary mb-2">{achievement.number}</div>
                  <div className="text-sm text-gray-600">{achievement.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Professional Image Placeholder */}
            <div className="bg-gradient-to-br from-primary-lighter to-gray-100 rounded-2xl p-8 text-center">
              <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                <Award className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Professional Excellence</h3>
              <p className="text-gray-600">
                Certified consultants with proven track records in business transformation and growth strategies.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Our Mission
            </h3>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              "To empower businesses and entrepreneurs with strategic insights, innovative solutions, 
              and unwavering support to achieve their full potential and create lasting impact in their industries."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About 