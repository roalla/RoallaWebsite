'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, TrendingUp, BarChart3, Send } from 'lucide-react'

interface Question {
  id: number
  text: string
  options: {
    value: string
    label: string
    score: number
  }[]
}

interface AssessmentResult {
  score: number
  category: string
  recommendations: string[]
  nextSteps: string[]
}

const InteractiveAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isComplete, setIsComplete] = useState(false)
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const questions: Question[] = [
    {
      id: 1,
      text: "How would you rate your current business growth rate?",
      options: [
        { value: "declining", label: "Declining or stagnant", score: 1 },
        { value: "slow", label: "Slow but steady", score: 2 },
        { value: "moderate", label: "Moderate growth", score: 3 },
        { value: "strong", label: "Strong growth", score: 4 },
        { value: "exceptional", label: "Exceptional growth", score: 5 }
      ]
    },
    {
      id: 2,
      text: "How well-defined is your business strategy?",
      options: [
        { value: "none", label: "No formal strategy", score: 1 },
        { value: "basic", label: "Basic plan in place", score: 2 },
        { value: "developed", label: "Well-developed strategy", score: 3 },
        { value: "comprehensive", label: "Comprehensive strategy", score: 4 },
        { value: "excellent", label: "Excellent, regularly updated", score: 5 }
      ]
    },
    {
      id: 3,
      text: "How would you describe your team's performance?",
      options: [
        { value: "poor", label: "Poor performance", score: 1 },
        { value: "adequate", label: "Adequate performance", score: 2 },
        { value: "good", label: "Good performance", score: 3 },
        { value: "very-good", label: "Very good performance", score: 4 },
        { value: "excellent", label: "Excellent performance", score: 5 }
      ]
    },
    {
      id: 4,
      text: "How effective are your current marketing efforts?",
      options: [
        { value: "none", label: "No marketing strategy", score: 1 },
        { value: "basic", label: "Basic marketing", score: 2 },
        { value: "moderate", label: "Moderate effectiveness", score: 3 },
        { value: "effective", label: "Effective marketing", score: 4 },
        { value: "highly-effective", label: "Highly effective", score: 5 }
      ]
    },
    {
      id: 5,
      text: "How would you rate your operational efficiency?",
      options: [
        { value: "inefficient", label: "Very inefficient", score: 1 },
        { value: "somewhat", label: "Somewhat inefficient", score: 2 },
        { value: "moderate", label: "Moderately efficient", score: 3 },
        { value: "efficient", label: "Efficient operations", score: 4 },
        { value: "highly-efficient", label: "Highly efficient", score: 5 }
      ]
    }
  ]

  const calculateResult = (answers: Record<number, number>): AssessmentResult => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0)
    const maxScore = questions.length * 5
    const percentage = (totalScore / maxScore) * 100

    if (percentage >= 80) {
      return {
        score: percentage,
        category: "High Performer",
        recommendations: [
          "Focus on scaling and expansion opportunities",
          "Optimize existing processes for maximum efficiency",
          "Develop advanced leadership capabilities",
          "Explore new market opportunities"
        ],
        nextSteps: [
          "Schedule a strategic planning session",
          "Review growth opportunities",
          "Consider executive coaching for leadership team"
        ]
      }
    } else if (percentage >= 60) {
      return {
        score: percentage,
        category: "Growing Business",
        recommendations: [
          "Strengthen strategic planning processes",
          "Improve team performance and engagement",
          "Enhance marketing and sales strategies",
          "Optimize operational efficiency"
        ],
        nextSteps: [
          "Book a comprehensive business review",
          "Develop improvement action plan",
          "Schedule follow-up consultation"
        ]
      }
    } else {
      return {
        score: percentage,
        category: "Needs Support",
        recommendations: [
          "Develop comprehensive business strategy",
          "Improve team leadership and management",
          "Create effective marketing and sales systems",
          "Streamline operations and processes"
        ],
        nextSteps: [
          "Schedule urgent business consultation",
          "Create turnaround strategy",
          "Implement immediate improvement plan"
        ]
      }
    }
  }

  const handleAnswer = (questionId: number, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }))
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300)
    } else {
      setIsLoading(true)
      setTimeout(() => {
        const assessmentResult = calculateResult({ ...answers, [questionId]: score })
        setResult(assessmentResult)
        setIsComplete(true)
        setIsLoading(false)
      }, 1500)
    }
  }

  const resetAssessment = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setIsComplete(false)
    setResult(null)
  }

  return (
    <section id="assessment" className="section-padding bg-white py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            Business Health Assessment
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700 dark:text-gray-200">
            Take our 5-minute assessment to discover your business strengths and opportunities for growth.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Progress Bar */}
            <div className="bg-gray-100 dark:bg-gray-700 h-2">
              <motion.div
                className="bg-gradient-to-r from-primary to-primary-dark h-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait">
                {!isComplete ? (
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    {isLoading ? (
                      <div className="py-12">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
                        />
                        <p className="text-gray-600 dark:text-gray-300">Analyzing your results...</p>
                      </div>
                    ) : (
                      <>
                        <div className="mb-8">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Question {currentQuestion + 1} of {questions.length}
                          </span>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2">
                            {questions[currentQuestion].text}
                          </h3>
                        </div>

                        <div className="space-y-3">
                          {questions[currentQuestion].options.map((option, index) => (
                            <motion.button
                              key={option.value}
                              onClick={() => handleAnswer(questions[currentQuestion].id, option.score)}
                              className="w-full p-4 text-left bg-gray-50 hover:bg-primary-lighter dark:bg-gray-700 dark:hover:bg-primary-dark/20 rounded-lg border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:border-primary dark:hover:border-primary-light group"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-gray-900 dark:text-white font-medium">
                                  {option.label}
                                </span>
                                <motion.div
                                  className="w-6 h-6 border-2 border-gray-300 dark:border-gray-500 rounded-full group-hover:border-primary dark:group-hover:border-primary-light"
                                  whileHover={{ scale: 1.1 }}
                                />
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <div className="mb-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-full mx-auto mb-4 flex items-center justify-center">
                        <BarChart3 className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Your Business Health Score: {Math.round(result!.score)}%
                      </h3>
                      <p className="text-lg text-primary dark:text-primary-light font-semibold">
                        {result!.category}
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                      <div className="text-left">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <TrendingUp className="w-5 h-5 text-primary dark:text-primary-light mr-2" />
                          Key Recommendations
                        </h4>
                        <ul className="space-y-2">
                          {result!.recommendations.map((rec, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start"
                            >
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-200">{rec}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      <div className="text-left">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <AlertCircle className="w-5 h-5 text-primary dark:text-primary-light mr-2" />
                          Next Steps
                        </h4>
                        <ul className="space-y-2">
                          {result!.nextSteps.map((step, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start"
                            >
                              <div className="w-2 h-2 bg-primary dark:bg-primary-light rounded-full mt-2 mr-3 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-200">{step}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <a
                        href="#contact"
                        className="btn-primary inline-flex items-center"
                      >
                        <Send className="w-5 h-5 mr-2" />
                        Get Your Free Consultation
                      </a>
                      <button
                        onClick={resetAssessment}
                        className="btn-secondary block mx-auto"
                      >
                        Take Assessment Again
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InteractiveAssessment 