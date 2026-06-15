'use client'

import React, { useMemo, useState } from 'react'
import Reveal from './motion/Reveal'
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  CheckCircle,
  Send,
  TrendingUp,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  ASSESSMENT_QUESTION_IDS,
  LANE_VALUES,
  SCORE_OPTION_VALUES,
  SERVICE_META,
  buildScheduleQuery,
  computeAssessmentResult,
  type AssessmentAnswers,
  type AssessmentLane,
  type AssessmentQuestionId,
  type AssessmentResult,
} from '@/lib/assessment'

const REC_KEYS = ['rec1', 'rec2', 'rec3', 'rec4'] as const
const NEXT_KEYS = ['next1', 'next2', 'next3'] as const

function resultContentKey(result: AssessmentResult): string {
  if (result.lane === 'website' || result.lane === 'platform' || result.lane === 'workshop' || result.lane === 'event') {
    return `lane.${result.lane}`
  }
  if (result.primaryService) {
    return `service.${result.primaryService}`
  }
  return 'fallback'
}

const InteractiveAssessment = () => {
  const t = useTranslations('assessmentTool')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<AssessmentAnswers>({})
  const [isComplete, setIsComplete] = useState(false)
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const questions = ASSESSMENT_QUESTION_IDS
  const activeQuestionId = questions[currentQuestion]

  const options = useMemo(() => {
    if (activeQuestionId === 'lane') {
      return LANE_VALUES.map((value) => ({ value, score: null as number | null }))
    }
    return SCORE_OPTION_VALUES.map((value) => ({
      value,
      score: Number.parseInt(value, 10),
    }))
  }, [activeQuestionId])

  const handleAnswer = (questionId: AssessmentQuestionId, value: string, score: number | null) => {
    const nextAnswers = { ...answers, [questionId]: value }
    setAnswers(nextAnswers)

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 300)
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      const assessmentResult = computeAssessmentResult(nextAnswers)
      setResult(assessmentResult)
      setIsComplete(true)
      setIsLoading(false)
    }, 1500)
  }

  const resetAssessment = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setIsComplete(false)
    setResult(null)
  }

  const scheduleHref = result
    ? { pathname: '/schedule' as const, query: buildScheduleQuery(result) }
    : { pathname: '/schedule' as const }

  const contentKey = result ? resultContentKey(result) : ''
  const recommendations = REC_KEYS.map((key) => t(`results.${contentKey}.${key}`)).filter(Boolean)
  const nextSteps = NEXT_KEYS.map((key) => t(`results.${contentKey}.${key}`)).filter(Boolean)

  const primaryServiceName =
    result?.primaryService != null ? t(`services.${result.primaryService}`) : null
  const secondaryServiceName =
    result?.secondaryService != null ? t(`services.${result.secondaryService}`) : null

  return (
    <section id="assessment" className="section-padding bg-white py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
            <div className="bg-slate-100 h-2">
              <div
                className="bg-gradient-to-r from-primary to-primary-dark h-full transition-[width] duration-500 ease-out"
                style={{
                  width: `${((isComplete ? questions.length : currentQuestion + 1) / questions.length) * 100}%`,
                }}
              />
            </div>

            <div className="p-8">
              {!isComplete ? (
                <div key={currentQuestion} className="animate-fade-in text-center">
                  {isLoading ? (
                    <div className="py-12">
                      <div
                        className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4 animate-spin"
                        role="status"
                        aria-label={t('analyzing')}
                      />
                      <p className="text-slate-500">{t('analyzing')}</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-8">
                        <span className="text-sm text-slate-500">
                          {t('questionLabel', {
                            current: currentQuestion + 1,
                            total: questions.length,
                          })}
                        </span>
                        <h2 className="text-xl font-bold text-slate-900 mt-2">
                          {t(`questions.${activeQuestionId}.text`)}
                        </h2>
                        {activeQuestionId !== 'lane' && (
                          <p className="mt-2 text-sm text-slate-500">
                            {t(`questions.${activeQuestionId}.hint`)}
                          </p>
                        )}
                      </div>

                      <div className="space-y-3">
                        {options.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              handleAnswer(activeQuestionId, option.value, option.score)
                            }
                            className="w-full p-4 text-left bg-slate-50 hover:bg-primary/5 rounded-lg border border-slate-200 transition-all duration-200 hover:border-primary group hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-slate-800 font-medium">
                                {t(
                                  `questions.${activeQuestionId}.options.${option.value}`,
                                )}
                              </span>
                              <div className="w-6 h-6 border-2 border-slate-300 rounded-full group-hover:border-primary group-hover:scale-110 transition-transform" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                result && (
                  <div className="animate-fade-in text-center">
                    <div className="mb-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-full mx-auto mb-4 flex items-center justify-center">
                        <BarChart3 className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        {t('scoreTitle', { score: result.overallScore })}
                      </h2>
                      <p className="text-lg text-primary font-semibold">
                        {t(`pillarCategory.${result.pillar}`)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 mb-8 text-left space-y-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                          {t('recommendedLane')}
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {t(`lanes.${result.lane}`)}
                        </p>
                      </div>

                      {primaryServiceName && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                            {t('recommendedService')}
                          </p>
                          <p className="text-sm font-semibold text-slate-900">{primaryServiceName}</p>
                          {secondaryServiceName && (
                            <p className="text-sm text-slate-600 mt-1">
                              {t('alsoConsider')}: {secondaryServiceName}
                            </p>
                          )}
                        </div>
                      )}

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                          {t('primaryPhase')}
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {t(`pillars.${result.pillar}`)}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                          <TrendingUp className="w-5 h-5 text-primary mr-2" />
                          {t('keyRecommendations')}
                        </h3>
                        <ul className="space-y-2">
                          {recommendations.map((rec, index) => (
                            <Reveal
                              as="li"
                              key={rec}
                              when="mount"
                              delayMs={index * 100}
                              className="flex items-start"
                            >
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                              <span className="text-slate-600">{rec}</span>
                            </Reveal>
                          ))}
                        </ul>
                      </div>

                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                          <AlertCircle className="w-5 h-5 text-primary mr-2" />
                          {t('nextSteps')}
                        </h3>
                        <ul className="space-y-2">
                          {nextSteps.map((step, index) => (
                            <Reveal
                              as="li"
                              key={step}
                              when="mount"
                              delayMs={index * 100}
                              className="flex items-start"
                            >
                              <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                              <span className="text-slate-600">{step}</span>
                            </Reveal>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Link href={scheduleHref} className="btn-primary inline-flex items-center">
                        <Send className="w-5 h-5 mr-2" />
                        {t('submitInquiry')}
                      </Link>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        {result.serviceHref && (
                          <Link
                            href={result.serviceHref as '/services'}
                            className="inline-flex items-center text-sm font-semibold text-primary-dark hover:underline"
                          >
                            {t('exploreService', { service: primaryServiceName ?? '' })}
                            <ArrowRight className="ml-1.5 w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          href={result.laneHref as '/services'}
                          className="inline-flex items-center text-sm font-semibold text-primary-dark hover:underline"
                        >
                          {laneExploreLabel(result.lane, t)}
                          <ArrowRight className="ml-1.5 w-4 h-4" />
                        </Link>
                        <Link
                          href={result.exploreServicesHref as '/services'}
                          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-primary-dark hover:underline"
                        >
                          {t('explorePhase')}
                          <ArrowRight className="ml-1.5 w-4 h-4" />
                        </Link>
                      </div>

                      <button
                        type="button"
                        onClick={resetAssessment}
                        className="btn-secondary block mx-auto mt-4"
                      >
                        {t('takeAgain')}
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function laneExploreLabel(
  lane: AssessmentLane,
  t: ReturnType<typeof useTranslations<'assessmentTool'>>,
): string {
  if (lane === 'website' || lane === 'platform') return t('viewDigitalCreations')
  if (lane === 'workshop') return t('viewWorkshops')
  if (lane === 'event') return t('viewDigitalEvents')
  return t('viewServices')
}

export default InteractiveAssessment
