'use client'

import { FormEvent, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Check, LockKeyhole } from 'lucide-react'
import SoftCapture from '@/components/conversion/SoftCapture'
import { trackAnalyticsEvent } from '@/lib/analytics'
import {
  buildAiEmployeeFitBrief,
  type AiEmployeeChannel,
  type AiEmployeeHandoff,
  type AiEmployeeKnowledge,
  type AiEmployeeSkill,
  type AiEmployeeUrgency,
} from '@/lib/ai-employee-fit-brief'

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

export default function AiEmployeeFitBrief({ locale }: Props) {
  const fr = locale === 'fr'
  const language = fr ? 'fr' : 'en'
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [industry, setIndustry] = useState('')
  const [audience, setAudience] = useState('')
  const [channel, setChannel] = useState<AiEmployeeChannel>('mixed')
  const [skill, setSkill] = useState<AiEmployeeSkill>('answer')
  const [knowledge, setKnowledge] = useState<AiEmployeeKnowledge>('partial')
  const [handoff, setHandoff] = useState<AiEmployeeHandoff>('unclear')
  const [urgency, setUrgency] = useState<AiEmployeeUrgency>('this-quarter')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setIndustry(params.get('industry') || params.get('icp') || '')
    setAudience(params.get('audience') || '')
    trackAnalyticsEvent('ai_employee_fit_brief_started', {
      industry: params.get('industry') || params.get('icp') || '',
    })
  }, [])

  const totalSteps = 5
  const result = useMemo(
    () =>
      buildAiEmployeeFitBrief({
        channel,
        skill,
        knowledge,
        handoff,
        urgency,
        industry: industry || undefined,
        audience: audience || undefined,
      }),
    [channel, skill, knowledge, handoff, urgency, industry, audience],
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
        contact: 'Discuter d’un employé IA',
        restart: 'Recommencer',
        context:
          industry || audience
            ? `Contexte repris de la page : ${[industry, audience].filter(Boolean).join(' · ')}`
            : null,
        channel: 'Sur quels canaux les demandes arrivent-elles surtout?',
        skill: 'Quelle compétence devrait venir en premier?',
        knowledge: 'À quel point vos réponses approuvées sont-elles prêtes?',
        handoff: 'Quand une personne doit-elle reprendre?',
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
        contact: 'Discuss an AI Employee',
        restart: 'Start over',
        context:
          industry || audience
            ? `Carried from your page: ${[industry, audience].filter(Boolean).join(' · ')}`
            : null,
        channel: 'Which channels carry most requests today?',
        skill: 'Which skill should come first?',
        knowledge: 'How ready are your approved answers?',
        handoff: 'When must a person take over?',
        urgency: 'How urgent is this?',
      }

  const contactHref = useMemo(() => {
    const params = new URLSearchParams({
      intent: 'consulting',
      focus: 'technology',
      from_page: '/tools/ai-employee-fit-brief',
      goal: result.headline,
      offer: 'AI Employee Fit Brief',
      conversion_source: 'ai_employee_fit_brief',
      campaign: 'ai-employee-fit-brief',
    })
    if (industry) params.set('icp', industry)
    if (audience) params.set('reference', audience)
    return `/${language}/contact?${params.toString()}`
  }, [result.headline, language, industry, audience])

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (step < totalSteps - 1) {
      setStep((value) => value + 1)
      return
    }
    setDone(true)
    trackAnalyticsEvent('ai_employee_fit_brief_complete', {
      path: result.path,
      industry,
      channel,
      skill,
    })
  }

  const steps: ReactNode[] = [
    <OptionGroup
      key="channel"
      label={copy.channel}
      value={channel}
      onChange={(id) => setChannel(id as AiEmployeeChannel)}
      options={[
        { id: 'voice', label: fr ? 'Appels / voix' : 'Calls / voice' },
        { id: 'chat', label: fr ? 'Clavardage / messagerie' : 'Chat / messaging' },
        { id: 'email', label: fr ? 'Courriel' : 'Email' },
        { id: 'mixed', label: fr ? 'Plusieurs canaux' : 'Several channels' },
      ]}
    />,
    <OptionGroup
      key="skill"
      label={copy.skill}
      value={skill}
      onChange={(id) => setSkill(id as AiEmployeeSkill)}
      options={[
        { id: 'answer', label: fr ? 'Répondre aux questions courantes' : 'Answer routine questions' },
        { id: 'qualify', label: fr ? 'Qualifier la demande' : 'Qualify the request' },
        { id: 'book', label: fr ? 'Prendre rendez-vous' : 'Book appointments' },
        { id: 'follow-up', label: fr ? 'Relancer et suivre' : 'Follow up' },
      ]}
    />,
    <OptionGroup
      key="knowledge"
      label={copy.knowledge}
      value={knowledge}
      onChange={(id) => setKnowledge(id as AiEmployeeKnowledge)}
      options={[
        { id: 'ready', label: fr ? 'Prêtes et tenues à jour' : 'Ready and kept current' },
        { id: 'partial', label: fr ? 'Partielles—à clarifier' : 'Partial—needs clarifying' },
        { id: 'thin', label: fr ? 'Faibles ou dispersées' : 'Thin or scattered' },
      ]}
    />,
    <OptionGroup
      key="handoff"
      label={copy.handoff}
      value={handoff}
      onChange={(id) => setHandoff(id as AiEmployeeHandoff)}
      options={[
        { id: 'clear', label: fr ? 'Règles claires déjà écrites' : 'Clear rules already written' },
        { id: 'unclear', label: fr ? 'Nous le savons, mais ce n’est pas écrit' : 'We know it, but it is not written' },
        { id: 'not-defined', label: fr ? 'Pas encore défini' : 'Not defined yet' },
      ]}
    />,
    <OptionGroup
      key="urgency"
      label={copy.urgency}
      value={urgency}
      onChange={(id) => setUrgency(id as AiEmployeeUrgency)}
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
          context="ai-employee-fit-brief"
          contactHref={contactHref}
          contactLabel={copy.contact}
          onSaved={() => trackAnalyticsEvent('ai_employee_fit_brief_soft_capture', { path: result.path })}
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
      {copy.context ? <p className="mt-3 text-sm font-medium text-slate-600">{copy.context}</p> : null}
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
