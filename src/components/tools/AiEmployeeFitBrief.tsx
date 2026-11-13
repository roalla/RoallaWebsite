'use client'

import { FormEvent, useEffect, useId, useMemo, useState, type ReactNode } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  Clock3,
  Layers,
  LockKeyhole,
  Mail,
  MessageSquare,
  Phone,
  BookOpen,
  UserRound,
  CalendarCheck,
  ListChecks,
  Send,
} from 'lucide-react'
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

type Choice = {
  id: string
  label: string
  icon: ReactNode
}

function WhyAsk({
  label,
  body,
}: {
  label: string
  body: string
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  return (
    <div className="mt-2">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs font-semibold text-primary-dark hover:bg-primary/10"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <CircleHelp className="h-4 w-4" aria-hidden />
        {label}
      </button>
      {open ? (
        <p
          id={panelId}
          className="mt-2 rounded-xl border border-primary/20 bg-primary/[0.06] px-3 py-2.5 text-sm leading-6 text-slate-700"
        >
          {body}
        </p>
      ) : null}
    </div>
  )
}

function OptionGroup({
  label,
  whyLabel,
  whyBody,
  value,
  options,
  onChange,
  selectedLabel,
}: {
  label: string
  whyLabel: string
  whyBody: string
  value: string
  options: Choice[]
  onChange: (id: string) => void
  selectedLabel: string
}) {
  const selected = options.find((option) => option.id === value)
  return (
    <fieldset>
      <legend className="text-lg font-serif font-bold text-slate-950 sm:text-xl">{label}</legend>
      <WhyAsk label={whyLabel} body={whyBody} />
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const isSelected = value === option.id
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(option.id)}
              className={
                isSelected
                  ? 'flex min-h-[72px] items-start gap-3 rounded-2xl border-2 border-primary bg-primary/[0.08] px-4 py-3.5 text-left shadow-sm shadow-primary/10'
                  : 'flex min-h-[72px] items-start gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-left hover:border-primary/50 hover:bg-slate-50'
              }
            >
              <span
                className={
                  isSelected
                    ? 'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white'
                    : 'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700'
                }
              >
                {option.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-950">{option.label}</span>
                {isSelected ? (
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary-dark">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                    {selectedLabel}
                  </span>
                ) : null}
              </span>
            </button>
          )
        })}
      </div>
      {selected ? (
        <p className="mt-3 text-sm font-medium text-slate-600">
          {selected.label} — {selectedLabel.toLowerCase()}
        </p>
      ) : null}
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
        whyAsk: 'Pourquoi cette question?',
        selected: 'Sélectionné',
        context:
          industry || audience
            ? `Contexte repris de la page : ${[industry, audience].filter(Boolean).join(' · ')}`
            : null,
        channel: 'Comment les clients vous joignent-ils le plus souvent?',
        channelWhy:
          'Nous démarrons sur le téléphone, le clavardage ou le courriel que vos clients utilisent déjà—pas une nouvelle appli qu’ils ignorent.',
        skill: 'Que devrait faire un employé IA en premier?',
        skillWhy: 'Pour que la première mise en service fasse bien un travail utile avant d’en ajouter d’autres.',
        knowledge: 'Avez-vous déjà des réponses approuvées que le personnel devrait utiliser?',
        knowledgeWhy:
          'Un employé IA ne devrait répondre qu’à partir de contenu que vous approuvez; si les réponses sont minces, on corrige cela d’abord.',
        handoff: 'Quand une personne doit-elle reprendre?',
        handoffWhy:
          'Les clients font confiance à l’IA quand les exceptions vont à une personne nommée, avec le contexte complet.',
        urgency: 'Dans quel délai voulez-vous que cela fonctionne?',
        urgencyWhy: 'Pour que ROALLA propose une taille de pilote adaptée à votre urgence.',
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
        whyAsk: 'Why we ask',
        selected: 'Selected',
        context:
          industry || audience
            ? `Carried from your page: ${[industry, audience].filter(Boolean).join(' · ')}`
            : null,
        channel: 'How do customers mostly reach you today?',
        channelWhy:
          'So we start on the phone, chat, or email path customers already use—not a new app they ignore.',
        skill: 'What should an AI Employee do first?',
        skillWhy: 'So the first release does one valuable job well before adding more.',
        knowledge: 'Do you already have approved answers staff should use?',
        knowledgeWhy:
          'An AI Employee should only reply from material you approve; thin knowledge means we fix that first.',
        handoff: 'When must a person take over?',
        handoffWhy:
          'Customers trust AI when exceptions go to a named person with full context.',
        urgency: 'How soon do you want this working?',
        urgencyWhy: 'So ROALLA recommends a pilot size that matches your urgency.',
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
      whyLabel={copy.whyAsk}
      whyBody={copy.channelWhy}
      value={channel}
      selectedLabel={copy.selected}
      onChange={(id) => setChannel(id as AiEmployeeChannel)}
      options={[
        { id: 'voice', label: fr ? 'Appels téléphoniques' : 'Phone calls', icon: <Phone className="h-4 w-4" aria-hidden /> },
        {
          id: 'chat',
          label: fr ? 'Clavardage ou texto' : 'Live chat or text',
          icon: <MessageSquare className="h-4 w-4" aria-hidden />,
        },
        { id: 'email', label: fr ? 'Courriel' : 'Email', icon: <Mail className="h-4 w-4" aria-hidden /> },
        {
          id: 'mixed',
          label: fr ? 'Plus d’une façon' : 'More than one way',
          icon: <Layers className="h-4 w-4" aria-hidden />,
        },
      ]}
    />,
    <OptionGroup
      key="skill"
      label={copy.skill}
      whyLabel={copy.whyAsk}
      whyBody={copy.skillWhy}
      value={skill}
      selectedLabel={copy.selected}
      onChange={(id) => setSkill(id as AiEmployeeSkill)}
      options={[
        {
          id: 'answer',
          label: fr ? 'Répondre aux questions courantes' : 'Answer common questions',
          icon: <BookOpen className="h-4 w-4" aria-hidden />,
        },
        {
          id: 'qualify',
          label: fr ? 'Trier / qualifier la demande' : 'Sort / qualify the request',
          icon: <ListChecks className="h-4 w-4" aria-hidden />,
        },
        {
          id: 'book',
          label: fr ? 'Prendre rendez-vous' : 'Book appointments',
          icon: <CalendarCheck className="h-4 w-4" aria-hidden />,
        },
        {
          id: 'follow-up',
          label: fr ? 'Relancer' : 'Follow up',
          icon: <Send className="h-4 w-4" aria-hidden />,
        },
      ]}
    />,
    <OptionGroup
      key="knowledge"
      label={copy.knowledge}
      whyLabel={copy.whyAsk}
      whyBody={copy.knowledgeWhy}
      value={knowledge}
      selectedLabel={copy.selected}
      onChange={(id) => setKnowledge(id as AiEmployeeKnowledge)}
      options={[
        {
          id: 'ready',
          label: fr ? 'Oui, prêtes et à jour' : 'Yes, ready and current',
          icon: <Check className="h-4 w-4" aria-hidden />,
        },
        {
          id: 'partial',
          label: fr ? 'En partie—à clarifier' : 'Partly—needs clarifying',
          icon: <ListChecks className="h-4 w-4" aria-hidden />,
        },
        {
          id: 'thin',
          label: fr ? 'Éparses ou insuffisantes' : 'Sparse or scattered',
          icon: <Layers className="h-4 w-4" aria-hidden />,
        },
      ]}
    />,
    <OptionGroup
      key="handoff"
      label={copy.handoff}
      whyLabel={copy.whyAsk}
      whyBody={copy.handoffWhy}
      value={handoff}
      selectedLabel={copy.selected}
      onChange={(id) => setHandoff(id as AiEmployeeHandoff)}
      options={[
        {
          id: 'clear',
          label: fr ? 'Règles écrites claires' : 'Clear written rules',
          icon: <Check className="h-4 w-4" aria-hidden />,
        },
        {
          id: 'unclear',
          label: fr ? 'On le sait, ce n’est pas écrit' : 'We know it, not written',
          icon: <UserRound className="h-4 w-4" aria-hidden />,
        },
        {
          id: 'not-defined',
          label: fr ? 'Pas encore décidé' : 'Not decided yet',
          icon: <CircleHelp className="h-4 w-4" aria-hidden />,
        },
      ]}
    />,
    <OptionGroup
      key="urgency"
      label={copy.urgency}
      whyLabel={copy.whyAsk}
      whyBody={copy.urgencyWhy}
      value={urgency}
      selectedLabel={copy.selected}
      onChange={(id) => setUrgency(id as AiEmployeeUrgency)}
      options={[
        {
          id: 'exploring',
          label: fr ? 'Simple exploration' : 'Just exploring',
          icon: <BookOpen className="h-4 w-4" aria-hidden />,
        },
        {
          id: 'this-quarter',
          label: fr ? 'Ce trimestre' : 'This quarter',
          icon: <CalendarCheck className="h-4 w-4" aria-hidden />,
        },
        {
          id: 'urgent',
          label: fr ? 'Urgent' : 'Urgent',
          icon: <Clock3 className="h-4 w-4" aria-hidden />,
        },
      ]}
    />,
  ]

  if (done) {
    return (
      <div className="overflow-hidden rounded-3xl border border-primary/20 bg-white shadow-lg shadow-primary/5">
        <div className="border-b border-primary/15 bg-gradient-to-r from-primary/[0.08] via-cyan-50/80 to-white px-6 py-5 sm:px-8">
          <p className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
            <LockKeyhole className="h-3.5 w-3.5" aria-hidden />
            {copy.privateNote}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950">{result.headline}</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">{result.summary}</p>
        </div>
        <div className="p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-2">
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
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="overflow-hidden rounded-3xl border border-primary/20 bg-white shadow-lg shadow-primary/5"
    >
      <div className="border-b border-primary/15 bg-gradient-to-r from-primary/[0.1] via-cyan-50/70 to-white px-6 py-5 sm:px-8">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">
            {copy.stepOf} {step + 1} {copy.of} {totalSteps}
          </p>
          <div className="flex gap-1.5" aria-hidden>
            {Array.from({ length: totalSteps }).map((_, index) => (
              <span
                key={index}
                className={
                  index <= step
                    ? 'h-2 w-6 rounded-full bg-primary'
                    : 'h-2 w-6 rounded-full bg-slate-200'
                }
              />
            ))}
          </div>
        </div>
        {copy.context ? (
          <p className="mt-3 inline-flex rounded-full border border-primary/20 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700">
            {copy.context}
          </p>
        ) : null}
      </div>
      <div className="p-6 sm:p-8">
        <div>{steps[step]}</div>
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
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            {step === totalSteps - 1 ? copy.seeBrief : copy.next}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </form>
  )
}
