'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs: FAQItem[] = [
    {
      question: 'What is fractional COO services?',
      answer: 'Fractional COO services provide businesses with senior-level operational expertise on a part-time or project basis. This allows companies to access strategic operational leadership without the cost of a full-time COO, making it ideal for growing businesses that need expert operational guidance.'
    },
    {
      question: 'How long does a typical consulting engagement last?',
      answer: 'Engagement duration varies based on your needs. Some projects are short-term (1-3 months) for specific initiatives, while others are ongoing partnerships. We work flexibly to match your business requirements and can adjust our involvement as your needs evolve.'
    },
    {
      question: 'What industries do you serve?',
      answer: 'We work with businesses across various industries including technology, manufacturing, professional services, retail, healthcare, and more. Our methodologies are adaptable to different business models and sectors.'
    },
    {
      question: 'How do you ensure confidentiality?',
      answer: 'We take confidentiality seriously. All team members sign non-disclosure agreements, and we follow strict data security protocols. Your business information is treated with the utmost discretion and protected at all times.'
    },
    {
      question: 'What is included in a free consultation?',
      answer: 'During your free consultation, we\'ll discuss your business goals, challenges, and opportunities. We\'ll provide initial insights and recommendations, and together we\'ll determine if our services are a good fit for your needs. There\'s no obligation to proceed.'
    },
    {
      question: 'Do you work with small businesses?',
      answer: 'Absolutely! We work with businesses of all sizes, from startups to established companies. Our services are scalable and tailored to meet the specific needs and budgets of each client, regardless of company size.'
    },
    {
      question: 'How quickly can you start working with us?',
      answer: 'We typically can begin engagements within 1-2 weeks of initial consultation, depending on project scope and our current capacity. For urgent matters, we can often accommodate faster timelines.'
    },
    {
      question: 'What makes Roalla different from other consulting firms?',
      answer: 'Our combination of deep financial expertise, strategic business acumen, and hands-on implementation support sets us apart. We don\'t just provide recommendations—we work alongside you to implement solutions and ensure they deliver real results for your business.'
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="section-padding bg-gradient-to-br from-gray-50 to-white py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="w-12 h-12 text-primary mr-3" />
            <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mt-4">
            Find answers to common questions about our services and how we can help your business.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                  aria-expanded={openIndex === index}
                >
                  <span className="text-lg font-semibold text-gray-900 pr-8">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-6 h-6 text-primary" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-0">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-lg text-gray-700 mb-4">
              Still have questions? We're here to help.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors duration-200"
            >
              Contact Us
              <ChevronDown className="ml-2 w-5 h-5 rotate-[-90deg]" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FAQ
