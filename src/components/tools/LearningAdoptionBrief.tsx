'use client'

import { FormEvent, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Check, LockKeyhole } from 'lucide-react'
import SoftCapture from '@/components/conversion/SoftCapture'
import { trackAnalyticsEvent } from '@/lib/analytics'
import {
  buildLearningAdoptionBrief,
  type LearningAudience,
  type LearningFormat,
  type LearningOutcome,
  type LearningOwnership,
  type LearningUrgency,
} from '@/lib/learning-adoption-brief'

type Props = { locale: string }

type Choice = { id: string; label: string }

function OptionGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: Choice[]
  onChange: (id: string) => void
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-slate-950">{label}</legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value === option.id
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.id)}
              className={
                selected
                  ? 'rounded-xl border border-slate-900 bg-slate-950 px-4 py-3 text-left text-sm font-semibold text-white'
                  : 'rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-sm font-medium text-slate-800 hover:border-primary/50'
              }
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export default function LearningAdoptionBrief({ locale }: Props) {
  const fr = locale === 'fr'
  const language = fr ? 'fr' : 'en'
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [audience, setAudience] = useState<LearningAudience>('customers')
  const [format, setFormat] = useState<LearningFormat>('short-video')
  const [outcome, setOutcome] = useState<LearningOutcome>('adoption')
  const [ownership, setOwnership] = useState<LearningOwnership>('shared')
  const [urgency, setUrgency] = useState<LearningUrgency>('this-quarter')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const signal = params.get('signal') || params.get('selected_problem') || ''
    if (signal === 'internal-education') setAudience('internal')
    if (signal === 'customer-adoption') setAudience('customers')
    trackAnalyticsEvent('learning_adoption_brief_started', { signal })
  }, [])

  const totalSteps = 5
  const result = useMemo(
    () => buildLearningAdoptionBrief({ audience, format, outcome, ownership, urgency }),
    [audience, format, outcome, ownership, urgency],
  )

  const copy = fr
    ? {
        back: 'Retour',
        next: 'Continuer',
        seeBrief: 'Voir mon aperçu',
        stepOf: 'Étape',
        of: 'sur',
        privateNote: 'Cet aperçu reste dans votre navigateur sauf si vous choisissez de l’envoyer à ROALLA.',
        priorities: 'Priorités pratiques',
        plan: 'Prochaines étapes',
        contact: 'Discuter de l’adoption et de la formation',
        restart: 'Recommencer',
        audience: 'Pour qui est ce contenu d’abord?',
        format: 'Quel format semble le plus utile?',
        outcome: 'Quel résultat doit-il produire?',
        ownership: 'Qui tient le contenu à jour?',
        urgency: 'Quelle est l’urgence?',
      }
    : {
        back: 'Back',
        next: 'Continue',
        seeBrief: 'See my brief',
        stepOf: 'Step',
        of: 'of',
        privateNote: 'This brief stays in your browser unless you choose to send it to ROALLA.',
        priorities: 'Practical priorities',
        plan: 'Next steps',
        contact: 'Discuss learning and adoption',
        restart: 'Start over',
        audience: 'Who is this content for first?',
        format: 'Which format seems most useful?',
        outcome: 'What outcome must it produce?',
        ownership: 'Who keeps the content current?',
        urgency: 'How urgent is this?',
      }

  const contactHref = useMemo(() => {
    const params = new URLSearchParams({
      intent: 'platform',
      from_page: '/tools/learning-adoption-brief',
      goal: result.headline,
      offer: 'Learning & Adoption Brief',
      conversion_source: 'learning_adoption_brief',
      campaign: 'learning-adoption-brief',
      need: audience === 'internal' ? 'internal-education' : 'customer-adoption',
    })
    return `/${language}/contact?${params.toString()}`
  }, [result.headline, language, audience])

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (step < totalSteps - 1) {
      setStep((value) => value + 1)
      return
    }
    setDone(true)
    trackAnalyticsEvent('learning_adoption_brief_complete', {
      path: result.path,
      audience,
      format,
    })
  }

  const steps: ReactNode[] = [
    <OptionGroup
      key="audience"
      label={copy.audience}
      value={audience}
      onChange={(id) => setAudience(id as LearningAudience)}
      options={[
        { id: 'customers', label: fr ? 'Clients / utilisateurs' : 'Customers / end users' },
        { id: 'internal', label: fr ? 'Personnel interne' : 'Internal staff' },
        { id: 'partners', label: fr ? 'Partenaires / franchise' : 'Partners / franchise' },
        { id: 'both', label: fr ? 'Clients et personnel' : 'Customers and staff' },
      ]}
    />,
    <OptionGroup
      key="format"
      label={copy.format}
      value={format}
      onChange={(id) => setFormat(id as LearningFormat)}
      options={[
        { id: 'docs', label: fr ? 'Guides et documentation' : 'Guides and documentation' },
        { id: 'short-video', label: fr ? 'Courtes vidéos pratiques' : 'Short how-to videos' },
        { id: 'youtube-style', label: fr ? 'Liste YouTube / hébergement simple' : 'YouTube-style / simple hosting' },
        { id: 'scorm', label: fr ? 'Modules suivis (SCORM / LMS)' : 'Tracked modules (SCORM / LMS)' },
      ]}
    />,
    <OptionGroup
      key="outcome"
      label={copy.outcome}
      value={outcome}
      onChange={(id) => setOutcome(id as LearningOutcome)}
      options={[
        { id: 'adoption', label: fr ? 'Adoption du produit ou service' : 'Product or service adoption' },
        { id: 'onboarding', label: fr ? 'Intégration / onboarding' : 'Onboarding' },
        { id: 'service-quality', label: fr ? 'Qualité de service cohérente' : 'Consistent service quality' },
        { id: 'compliance', label: fr ? 'Preuve / conformité' : 'Proof / compliance' },
      ]}
    />,
    <OptionGroup
      key="ownership"
      label={copy.ownership}
      value={ownership}
      onChange={(id) => setOwnership(id as LearningOwnership)}
      options={[
        { id: 'named-owner', label: fr ? 'Un responsable nommé' : 'A named owner' },
        { id: 'shared', label: fr ? 'Partagé entre équipes' : 'Shared across teams' },
        { id: 'unclear', label: fr ? 'Personne n’est clairement responsable' : 'No clear owner' },
      ]}
    />,
    <OptionGroup
      key="urgency"
      label={copy.urgency}
      value={urgency}
      onChange={(id) => setUrgency(id as LearningUrgency)}
      options={[
        { id: 'exploring', label: fr ? 'Exploration' : 'Exploring' },
        { id: 'this-quarter', label: fr ? 'Ce trimestre' : 'This quarter' },
        { id: 'urgent', label: fr ? 'Urgent' : 'Urgent' },
      ]}
    />,
  ]

  if (done) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
          <LockKeyhole className="h-3.5 w-3.5" aria-hidden />
          {copy.privateNote}
        </p>
        <h2 className="mt-4 font-serif text-3xl font-bold text-slate-950">{result.headline}</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">{result.summary}</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">{copy.priorities}</p>
            <ul className="mt-3 space-y-2">
              {result.priorities.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-6 text-slate-700">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">{copy.plan}</p>
            <ol className="mt-3 space-y-2">
              {result.plan.map((item, index) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <SoftCapture
          locale={language}
          context="learning-adoption-brief"
          contactHref={contactHref}
          contactLabel={copy.contact}
          onSaved={() => trackAnalyticsEvent('learning_adoption_brief_soft_capture', { path: result.path })}
        />
        <button
          type="button"
          onClick={() => {
            setDone(false)
            setStep(0)
          }}
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800"
        >
          {copy.restart}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">
        {copy.stepOf} {step + 1} {copy.of} {totalSteps}
      </p>
      <div className="mt-6">{steps[step]}</div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((value) => Math.max(0, value - 1))}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 disabled:opacity-40"
        >
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
          {copy.back}
        </button>
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          {step === totalSteps - 1 ? copy.seeBrief : copy.next}
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
        </button>
      </div>
    </form>
  )
}
