'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Reveal from './motion/Reveal'
import AssessmentPrintSheet from './AssessmentPrintSheet'
import {
  AlertCircle,
  ArrowLeft,
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
  DIRECTION_VALUES,
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
    lane === 'digital' ||
    lane === 'website' ||
    lane === 'platform' ||
    lane === 'automation' ||
    lane === 'ai' ||
    lane === 'agentic' ||
    lane === 'security' ||
    lane === 'visibility' ||
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

const SELECT_ADVANCE_MS = 450
const RESULT_DELAY_MS = 1500

const InteractiveAssessment = () => {
  const t = useTranslations('assessmentTool')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<AssessmentAnswers>({})
  const [isComplete, setIsComplete] = useState(false)
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [pendingValue, setPendingValue] = useState<string | null>(null)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const questions = ASSESSMENT_QUESTION_IDS
  const activeQuestionId = questions[currentQuestion]
  const selectedValue = pendingValue ?? answers[activeQuestionId] ?? null

  const options = useMemo(() => {
    if (activeQuestionId === 'lane') {
      return LANE_VALUES.map((value) => ({ value, score: null as number | null }))
    }
    if (activeQuestionId === 'direction') {
      return DIRECTION_VALUES.map((value) => ({ value, score: null as number | null }))
    }
    return SCORE_OPTION_VALUES.map((value) => ({
      value,
      score: Number.parseInt(value, 10),
    }))
  }, [activeQuestionId])

  useEffect(() => {
    setPendingValue(null)
  }, [currentQuestion])

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
    }
  }, [])

  const handleAnswer = (questionId: AssessmentQuestionId, value: string) => {
    if (pendingValue || isLoading) return

    const nextAnswers = { ...answers, [questionId]: value }
    setAnswers(nextAnswers)
    setPendingValue(value)

    if (advanceTimer.current) clearTimeout(advanceTimer.current)

    if (currentQuestion < questions.length - 1) {
      advanceTimer.current = setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1)
      }, SELECT_ADVANCE_MS)
      return
    }

    setIsLoading(true)
    advanceTimer.current = setTimeout(() => {
      const assessmentResult = computeAssessmentResult(nextAnswers)
      if (assessmentResult) {
        setResult(assessmentResult)
        setIsComplete(true)
      }
      setPendingValue(null)
      setIsLoading(false)
    }, RESULT_DELAY_MS)
  }

  const goBack = () => {
    if (currentQuestion === 0 || pendingValue || isLoading) return
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    setPendingValue(null)
    setCurrentQuestion((prev) => prev - 1)
  }

  const resetAssessment = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    setCurrentQuestion(0)
    setAnswers({})
    setIsComplete(false)
    setResult(null)
    setPendingValue(null)
    setIsLoading(false)
  }

  return (
    <section id="assessment" className="bg-white py-4 sm:py-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
          <div className="bg-slate-100 h-2" aria-hidden>
            <div
              className="bg-gradient-to-r from-primary to-primary-dark h-full transition-[width] duration-500 ease-out"
              style={{
                width: `${((isComplete ? questions.length : currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {!isComplete ? (
              <div key={currentQuestion} className="animate-fade-in text-left">
                {isLoading ? (
                  <div className="py-12 text-center">
                    <div
                      className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4 animate-spin"
                      role="status"
                      aria-label={t('analyzing')}
                    />
                    <p className="text-slate-500">{t('analyzing')}</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 sm:mb-8">
                      <span className="text-sm font-semibold text-primary-dark">
                        {t('questionLabel', {
                          current: currentQuestion + 1,
                          total: questions.length,
                        })}
                      </span>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-2 leading-snug">
                        {t(`questions.${activeQuestionId}.text`)}
                      </h2>
                      {activeQuestionId !== 'lane' && (
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {t(`questions.${activeQuestionId}.hint`)}
                        </p>
                      )}
                    </div>

                    <div
                      className="space-y-3"
                      role="radiogroup"
                      aria-label={t(`questions.${activeQuestionId}.text`)}
                    >
                      {options.map((option) => {
                        const isSelected = selectedValue === option.value
                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            aria-pressed={isSelected}
                            disabled={Boolean(pendingValue)}
                            onClick={() => handleAnswer(activeQuestionId, option.value)}
                            className={`w-full min-h-12 p-3.5 sm:p-4 text-left rounded-lg border transition-colors duration-150 active:bg-primary/10 disabled:cursor-wait ${
                              isSelected
                                ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary/30'
                                : 'border-slate-200 bg-slate-50 hover:border-primary/60 hover:bg-primary/5'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <span
                                className={`text-sm sm:text-base font-medium leading-6 ${
                                  isSelected ? 'text-slate-950' : 'text-slate-800'
                                }`}
                              >
                                {t(`questions.${activeQuestionId}.options.${option.value}`)}
                              </span>
                              {isSelected ? (
                                <CheckCircle
                                  className="mt-0.5 h-6 w-6 shrink-0 text-primary"
                                  aria-hidden
                                />
                              ) : (
                                <span
                                  className="mt-0.5 h-6 w-6 shrink-0 rounded-full border-2 border-slate-300"
                                  aria-hidden
                                />
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    {currentQuestion > 0 ? (
                      <div className="mt-6">
                        <button
                          type="button"
                          onClick={goBack}
                          disabled={Boolean(pendingValue)}
                          className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-primary-dark transition hover:bg-slate-100 disabled:opacity-50"
                        >
                          <ArrowLeft className="h-4 w-4" aria-hidden />
                          {t('back')}
                        </button>
                      </div>
                    ) : null}
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

  const evidenceLinkClass =
    'inline-flex items-center text-sm font-semibold text-primary-dark hover:underline'
  const evidenceLink = (() => {
    switch (result.evidenceHref) {
      case '/tools/digital-presence-snapshot':
        return (
          <Link
            href={{
              pathname: '/tools/digital-presence-snapshot',
              query: {
                campaign: 'assessment-visibility',
                offer: 'free-automated-visibility-snapshot',
                conversion_source: 'assessment_result',
                entry_page: '/assessment',
                selected_problem: 'website-and-ai-visibility',
              },
            }}
            className={evidenceLinkClass}
          >
            {t('evidence.visibility')}
            <ArrowRight className="ml-1.5 w-4 h-4" aria-hidden />
          </Link>
        )
      case '/ai-agent-readiness-review':
        return (
          <Link href="/ai-agent-readiness-review" className={evidenceLinkClass}>
            {t('evidence.agentic')}
            <ArrowRight className="ml-1.5 w-4 h-4" aria-hidden />
          </Link>
        )
      case '/security-risk-coverage-review':
        return (
          <Link href="/security-risk-coverage-review" className={evidenceLinkClass}>
            {t('evidence.security')}
            <ArrowRight className="ml-1.5 w-4 h-4" aria-hidden />
          </Link>
        )
      case '/digital-product-discovery':
        return (
          <Link href="/digital-product-discovery" className={evidenceLinkClass}>
            {t('evidence.digital')}
            <ArrowRight className="ml-1.5 w-4 h-4" aria-hidden />
          </Link>
        )
      default:
        return null
    }
  })()

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
    <>
      <AssessmentPrintSheet
        locale={locale}
        score={result.overallScore}
        lane={t(`lanes.${result.lane}`)}
        action={t(`actionStages.${result.actionStage}`)}
        readiness={primaryServiceName}
        secondary={secondaryServiceName}
        starter={starter}
        recommendations={recommendations}
        nextSteps={nextSteps}
        direction={direction}
        directionLabels={directionLabels}
      />
      <div className="animate-fade-in text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-full mx-auto mb-4 flex items-center justify-center">
          <BarChart3 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t('scoreTitle', { score: result.overallScore })}
        </h2>
        <p className="text-lg text-primary font-semibold">
          {t(`actionStageCategory.${result.actionStage}`)}
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
              {t(result.lane === 'consulting' ? 'recommendedService' : 'readinessConsideration')}
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
            {t('primaryAction')}
          </p>
          <p className="text-sm font-semibold text-slate-900">{t(`actionStages.${result.actionStage}`)}</p>
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

        <div className="flex justify-center">
          <Link
            href={{ pathname: '/solutions/need/[groupId]', params: { groupId: result.outcomeGroup } }}
            className="btn-secondary inline-flex items-center"
          >
            {t('viewOutcomePathway')}
            <ArrowRight className="ml-2 w-4 h-4" aria-hidden />
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 pt-2">
          {evidenceLink}
          {result.useCaseHref && (
            <Link
              href={result.useCaseHref}
              className="inline-flex items-center text-sm font-semibold text-primary-dark hover:underline"
            >
              {t('viewUseCase')}
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          )}
          <Link
            href={result.supportingServiceHref as '/services/business-advisory'}
            className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-primary-dark hover:underline"
          >
            {t('viewSupportingService')}
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
            <Download className="mr-2 h-4 w-4" aria-hidden />{french ? 'Imprimer ou enregistrer le PDF de marque' : 'Print or save branded PDF'}
          </button>
        </div>
        <p className="mx-auto max-w-2xl pt-2 text-xs leading-5 text-slate-500">{french ? 'Votre plan reste dans ce navigateur, sauf si vous choisissez de l’inclure dans une demande de service.' : 'Your blueprint stays in this browser unless you choose to include it in a service inquiry.'}</p>
      </div>
      </div>
    </>
  )
}

function starterOffer(result: AssessmentResult, french: boolean) {
  const byLane = {
    digital: ['digital', french ? 'Sprint de cadrage numérique' : 'Digital Experience Discovery Sprint', french ? 'Définir le résultat, les utilisateurs et la plus petite solution numérique utile avant la construction.' : 'Define the outcome, users, and smallest useful digital solution before building.'],
    technology: ['technology', french ? 'Dossier de décision technologique' : 'Technology Decision Brief', french ? 'Clarifier les exigences, les risques, les coûts et les critères de comparaison avant de choisir un fournisseur.' : 'Clarify requirements, risks, costs, and comparison criteria before choosing a provider.'],
    workshop: ['workshop', french ? 'Atelier ciblé avec suivi de 30 jours' : 'Focused Workshop with 30-Day Follow-through', french ? 'Choisir une capacité précise, pratiquer en équipe et mesurer l’engagement après la séance.' : 'Choose one practical capability, practise as a team, and measure follow-through after the session.'],
    website: ['website', french ? 'Rafraîchissement de conversion du site' : 'Website Conversion Refresh', french ? 'Corriger le parcours client prioritaire avant de décider si une reconstruction complète est nécessaire.' : 'Improve the highest-priority customer journey before deciding whether a complete rebuild is necessary.'],
    platform: ['platform', french ? 'Sprint de validation de produit numérique' : 'Digital Product Validation Sprint', french ? 'Valider les utilisateurs, le parcours et la plus petite version utile.' : 'Validate the users, journey, and smallest useful release.'],
    automation: ['automation', french ? 'Sprint d’occasion d’automatisation' : 'Automation Opportunity Sprint', french ? 'Cartographier un flux récurrent, ses exceptions et sa valeur possible.' : 'Map one recurring workflow, its exceptions, and its potential value.'],
    ai: ['ai', french ? 'Pilote pratique d’IA' : 'Practical AI Pilot', french ? 'Tester un flux mesurable avec des garde-fous et une révision humaine.' : 'Test one measurable workflow with guardrails and human review.'],
    agentic: ['agentic', french ? 'Sprint de préparation agentique' : 'Agentic Readiness Sprint', french ? 'Cadrer un agent gouverné, ses actions autorisées, ses systèmes et ses points de contrôle humain.' : 'Scope one governed agent, its approved actions, connected systems, and human checkpoints.'],
    security: ['security', french ? 'Revue de préparation sécurité et conformité' : 'Security and Compliance Readiness Review', french ? 'Clarifier les obligations, les écarts importants, les responsables, les preuves et la première remédiation utile.' : 'Clarify obligations, material gaps, owners, evidence, and the first useful remediation step.'],
    visibility: ['visibility', french ? 'Évaluation de visibilité numérique' : 'Digital Visibility Assessment', french ? 'Évaluer la découvrabilité, la lisibilité pour l’IA, l’accessibilité, la performance et la conversion.' : 'Assess discoverability, AI readability, accessibility, performance, and conversion.'],
    event: ['event', french ? 'Sprint de préparation numérique à l’événement' : 'Event Digital Readiness Sprint', french ? 'Planifier le parcours, la collecte d’intérêt et le suivi avant l’événement.' : 'Plan the journey, lead capture, and follow-up before the event.'],
    consulting: ['advisory', french ? 'Sprint de clarté et d’exécution' : 'Clarity and Execution Sprint', french ? 'Transformer la priorité la plus importante en plan de 90 jours avec propriétaires et mesures.' : 'Turn the highest-priority issue into a 90-day plan with owners and measures.'],
    unsure: ['advisory', french ? 'Revue de point de départ' : 'Starting Point Review', french ? 'Clarifier le résultat d’affaires avant de choisir un service.' : 'Clarify the business outcome before choosing a service.'],
  } as const
  const [key, name, body] = byLane[result.lane]
  return { key, name, body, timeline: french ? 'Délai habituel : 1 à 2 semaines' : 'Typical timeline: 1 to 2 weeks' }
}

export default InteractiveAssessment
