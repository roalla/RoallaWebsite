'use client'

import React, { useMemo, useState } from 'react'
import Reveal from './motion/Reveal'
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  CheckCircle,
  Download,
  LockKeyhole,
  Send,
  TrendingUp,
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { Link } from '@/i18n/navigation'
import {
  ASSESSMENT_QUESTION_IDS,
  LANE_VALUES,
  SCORE_OPTION_VALUES,
  buildScheduleQuery,
  computeAssessmentResult,
  type AssessmentAnswers,
  type AssessmentLane,
  type AssessmentQuestionId,
  type AssessmentResult,
} from '@/lib/assessment'

const REC_KEYS = ['rec1', 'rec2', 'rec3', 'rec4'] as const
const NEXT_KEYS = ['next1', 'next2', 'next3'] as const

type ResultMessages = Record<(typeof REC_KEYS)[number] | (typeof NEXT_KEYS)[number], string>

function isDigitalOrEventLane(lane: AssessmentLane): boolean {
  return (
    lane === 'technology' ||
    lane === 'website' ||
    lane === 'platform' ||
    lane === 'automation' ||
    lane === 'ai' ||
    lane === 'workshop' ||
    lane === 'event'
  )
}

function resultMessagesNamespace(result: AssessmentResult): string {
  if (isDigitalOrEventLane(result.lane)) {
    return `results.lane.${result.lane}`
  }
  if (result.primaryService) {
    return `results.service.${result.primaryService}`
  }
  return 'results.fallback'
}

function loadResultMessages(
  t: ReturnType<typeof useTranslations<'assessmentTool'>>,
  result: AssessmentResult,
): { recommendations: string[]; nextSteps: string[] } {
  const namespace = resultMessagesNamespace(result)
  const block = t.raw(namespace) as ResultMessages | undefined
  if (!block || typeof block !== 'object') {
    return { recommendations: [], nextSteps: [] }
  }
  return {
    recommendations: REC_KEYS.map((key) => block[key]).filter(Boolean),
    nextSteps: NEXT_KEYS.map((key) => block[key]).filter(Boolean),
  }
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
      if (assessmentResult) {
        setResult(assessmentResult)
        setIsComplete(true)
      }
      setIsLoading(false)
    }, 1500)
  }

  const resetAssessment = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setIsComplete(false)
    setResult(null)
  }

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
              ) : result ? (
                <AssessmentResultsView result={result} onReset={resetAssessment} t={t} />
              ) : (
                <div className="py-12 text-center">
                  <p className="text-slate-600">{t('analyzing')}</p>
                  <button type="button" onClick={resetAssessment} className="btn-secondary mt-4">
                    {t('takeAgain')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AssessmentResultsView({
  result,
  onReset,
  t,
}: {
  result: AssessmentResult
  onReset: () => void
  t: ReturnType<typeof useTranslations<'assessmentTool'>>
}) {
  const locale = useLocale()
  const french = locale === 'fr'
  const [saved, setSaved] = useState(false)
  const scheduleHref = useMemo(
    () => ({ pathname: '/contact' as const, query: buildScheduleQuery(result) }),
    [result],
  )
  const { recommendations, nextSteps } = useMemo(
    () => loadResultMessages(t, result),
    [t, result],
  )

  const primaryServiceName =
    result.primaryService != null ? t(`services.${result.primaryService}`) : null
  const secondaryServiceName =
    result.secondaryService != null ? t(`services.${result.secondaryService}`) : null
  const starter = starterOffer(result, french)
  const direction = french
    ? [
        'Confirmer la situation actuelle, le résultat visé, la personne responsable et le principal risque.',
        'Réaliser le plus petit sprint ou pilote utile avec des propriétaires et des mesures clairs.',
        'Examiner les preuves, documenter les apprentissages et décider de poursuivre, ajuster ou arrêter.',
      ]
    : [
        'Confirm the current state, intended outcome, decision owner, and most important risk.',
        'Complete the smallest useful sprint or pilot with clear owners and measures.',
        'Review the evidence, document the learning, and decide whether to continue, adjust, or stop.',
      ]
  const directionLabels = french ? ['Premiers 30 jours', 'D’ici 60 jours', 'D’ici 90 jours'] : ['First 30 days', 'By 60 days', 'By 90 days']

  function saveBlueprint() {
    window.localStorage.setItem('roalla-business-value-blueprint', JSON.stringify({ result, starter, savedAt: new Date().toISOString() }))
    setSaved(true)
    trackAnalyticsEvent('business_blueprint_saved', { lane: result.lane, starter: starter.key })
  }

  return (
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
          <p className="text-sm font-semibold text-slate-900">{t(`lanes.${result.lane}`)}</p>
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
          <p className="text-sm font-semibold text-slate-900">{t(`pillars.${result.pillar}`)}</p>
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

      <section className="mb-8 rounded-2xl border border-brand-gold/50 bg-brand-gold/10 p-6 text-left">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-700">
          {french ? 'Point de départ à faible risque' : 'Low-risk starting point'}
        </p>
        <h3 className="mt-2 text-2xl font-serif font-bold text-slate-950">{starter.name}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">{starter.body}</p>
        <p className="mt-3 text-sm font-semibold text-slate-800">{starter.timeline}</p>
        <p className="mt-1 text-xs text-slate-600">{french ? 'La portée et le prix sont confirmés après une revue gratuite. Aucun résultat n’est garanti.' : 'Scope and pricing are confirmed after a free fit review. Results are not guaranteed.'}</p>
        {result.lane === 'technology' ? (
          <Link
            href="/tools/technology-decision-brief"
            className="mt-4 inline-flex items-center text-sm font-semibold text-primary-dark hover:underline"
          >
            {french ? 'Créer ma fiche de décision technologique' : 'Build my Technology Decision Brief'}
            <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
          </Link>
        ) : null}
      </section>

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 text-left">
        <h3 className="text-2xl font-serif font-bold text-slate-950">{french ? 'Votre direction sur 30, 60 et 90 jours' : 'Your 30, 60, and 90-day direction'}</h3>
        <ol className="mt-5 grid gap-3 lg:grid-cols-3">
          {direction.map((item, index) => (
            <li key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-primary-dark">{directionLabels[index]}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{item}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="space-y-3">
        <Link href={scheduleHref} className="btn-primary inline-flex items-center">
          <Send className="w-5 h-5 mr-2" />
          {t('submitInquiry')}
        </Link>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {result.useCaseHref && (
            <Link
              href={result.useCaseHref}
              className="inline-flex items-center text-sm font-semibold text-primary-dark hover:underline"
            >
              {t('viewUseCase')}
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          )}
          {result.serviceHref && (
            <Link
              href={result.serviceHref as '/programs/business-enablement'}
              className="inline-flex items-center text-sm font-semibold text-primary-dark hover:underline"
            >
              {t('exploreService', { service: primaryServiceName ?? '' })}
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          )}
          <Link
            href={result.laneHref as '/programs/business-enablement' | '/programs/technology-advisory' | '/programs/workshops' | '/services/digital' | '/services/digital-events'}
            className="inline-flex items-center text-sm font-semibold text-primary-dark hover:underline"
          >
            {laneExploreLabel(result.lane, t)}
            <ArrowRight className="ml-1.5 w-4 h-4" />
          </Link>
        </div>

        <button type="button" onClick={onReset} className="btn-secondary block mx-auto mt-4">
          {t('takeAgain')}
        </button>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3 print:hidden">
          <button type="button" onClick={saveBlueprint} className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-primary">
            <LockKeyhole className="mr-2 h-4 w-4" aria-hidden />{saved ? (french ? 'Plan enregistré' : 'Blueprint saved') : (french ? 'Enregistrer dans ce navigateur' : 'Save in this browser')}
          </button>
          <button type="button" onClick={() => window.print()} className="inline-flex min-h-11 items-center px-4 py-2 text-sm font-semibold text-slate-700 underline underline-offset-4">
            <Download className="mr-2 h-4 w-4" aria-hidden />{french ? 'Imprimer ou enregistrer en PDF' : 'Print or save as PDF'}
          </button>
        </div>
        <p className="mx-auto max-w-2xl pt-2 text-xs leading-5 text-slate-500">{french ? 'Votre plan reste dans ce navigateur, sauf si vous choisissez de l’inclure dans une demande de service.' : 'Your blueprint stays in this browser unless you choose to include it in a service inquiry.'}</p>
      </div>
    </div>
  )
}

function starterOffer(result: AssessmentResult, french: boolean) {
  const byLane = {
    technology: ['technology', french ? 'Dossier de décision technologique' : 'Technology Decision Brief', french ? 'Clarifier les exigences, les risques, les coûts et les critères de comparaison avant de choisir un fournisseur.' : 'Clarify requirements, risks, costs, and comparison criteria before choosing a provider.'],
    workshop: ['workshop', french ? 'Atelier ciblé avec suivi de 30 jours' : 'Focused Workshop with 30-Day Follow-through', french ? 'Choisir une capacité précise, pratiquer en équipe et mesurer l’engagement après la séance.' : 'Choose one practical capability, practise as a team, and measure follow-through after the session.'],
    website: ['website', french ? 'Rafraîchissement de conversion du site' : 'Website Conversion Refresh', french ? 'Corriger le parcours client prioritaire avant de décider si une reconstruction complète est nécessaire.' : 'Improve the highest-priority customer journey before deciding whether a complete rebuild is necessary.'],
    platform: ['platform', french ? 'Sprint de validation de produit numérique' : 'Digital Product Validation Sprint', french ? 'Valider les utilisateurs, le parcours et la plus petite version utile.' : 'Validate the users, journey, and smallest useful release.'],
    automation: ['automation', french ? 'Sprint d’occasion d’automatisation' : 'Automation Opportunity Sprint', french ? 'Cartographier un flux récurrent, ses exceptions et sa valeur possible.' : 'Map one recurring workflow, its exceptions, and its potential value.'],
    ai: ['ai', french ? 'Pilote pratique d’IA' : 'Practical AI Pilot', french ? 'Tester un flux mesurable avec des garde-fous et une révision humaine.' : 'Test one measurable workflow with guardrails and human review.'],
    event: ['event', french ? 'Sprint de préparation numérique à l’événement' : 'Event Digital Readiness Sprint', french ? 'Planifier le parcours, la collecte d’intérêt et le suivi avant l’événement.' : 'Plan the journey, lead capture, and follow-up before the event.'],
    consulting: ['advisory', french ? 'Sprint de clarté et d’exécution' : 'Clarity and Execution Sprint', french ? 'Transformer la priorité la plus importante en plan de 90 jours avec propriétaires et mesures.' : 'Turn the highest-priority issue into a 90-day plan with owners and measures.'],
    unsure: ['advisory', french ? 'Revue de point de départ' : 'Starting Point Review', french ? 'Clarifier le résultat d’affaires avant de choisir un service.' : 'Clarify the business outcome before choosing a service.'],
  } as const
  const [key, name, body] = byLane[result.lane]
  return { key, name, body, timeline: french ? 'Délai habituel : 1 à 2 semaines' : 'Typical timeline: 1 to 2 weeks' }
}

function laneExploreLabel(
  lane: AssessmentLane,
  t: ReturnType<typeof useTranslations<'assessmentTool'>>,
): string {
  if (lane === 'technology') return t('viewTechnologyAdvisory')
  if (lane === 'website' || lane === 'platform' || lane === 'automation' || lane === 'ai') {
    return t('viewDigitalCreations')
  }
  if (lane === 'workshop') return t('viewWorkshops')
  if (lane === 'event') return t('viewDigitalEvents')
  return t('viewServices')
}

export default InteractiveAssessment
