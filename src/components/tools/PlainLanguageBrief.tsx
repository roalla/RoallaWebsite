'use client'

import { FormEvent, useMemo, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Check, LockKeyhole } from 'lucide-react'
import { trackAnalyticsEvent } from '@/lib/analytics'
import {
  buildEmailReachBrief,
  type EmailReachAudience,
  type EmailReachSituation,
  type EmailReachUrgency,
} from '@/lib/email-reach-brief'
import {
  buildNinetyDayPlanBrief,
  type NinetyDayHorizon,
  type NinetyDayPressure,
  type NinetyDayTeamPressure,
} from '@/lib/ninety-day-plan-brief'
import {
  buildCapacityPressureBrief,
  type CapacityHumanKeep,
  type CapacityPressure,
  type CapacityWorkArea,
} from '@/lib/capacity-pressure-brief'

export type PlainLanguageBriefId = 'email-reach' | 'ninety-day-plan' | 'capacity-pressure'

type Props = {
  briefId: PlainLanguageBriefId
  locale: string
}

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
                  ? 'rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-left text-sm font-semibold text-white'
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

export default function PlainLanguageBrief({ briefId, locale }: Props) {
  const fr = locale === 'fr'
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  // Email
  const [emailSituation, setEmailSituation] = useState<EmailReachSituation>('junk-folder')
  const [usesOwnDomain, setUsesOwnDomain] = useState(true)
  const [emailAudience, setEmailAudience] = useState<EmailReachAudience>('customers')
  const [emailUrgency, setEmailUrgency] = useState<EmailReachUrgency>('this-quarter')

  // 90-day
  const [pressure, setPressure] = useState<NinetyDayPressure>('too-many-priorities')
  const [horizon, setHorizon] = useState<NinetyDayHorizon>('90-days')
  const [teamPressure, setTeamPressure] = useState<NinetyDayTeamPressure>('small-team')
  const [outcome, setOutcome] = useState('')

  // Capacity
  const [capPressure, setCapPressure] = useState<CapacityPressure>('cant-hire')
  const [workArea, setWorkArea] = useState<CapacityWorkArea>('customer-requests')
  const [mustStayHuman, setMustStayHuman] = useState<CapacityHumanKeep>('exceptions')
  const [capUrgency, setCapUrgency] = useState<'exploring' | 'this-quarter' | 'urgent'>('this-quarter')

  const totalSteps = briefId === 'ninety-day-plan' ? 4 : 4

  const result = useMemo(() => {
    if (briefId === 'email-reach') {
      return buildEmailReachBrief({
        situation: emailSituation,
        usesOwnDomain,
        audience: emailAudience,
        urgency: emailUrgency,
      })
    }
    if (briefId === 'ninety-day-plan') {
      return buildNinetyDayPlanBrief({
        pressure,
        horizon,
        teamPressure,
        outcome,
      })
    }
    return buildCapacityPressureBrief({
      pressure: capPressure,
      workArea,
      mustStayHuman,
      urgency: capUrgency,
    })
  }, [
    briefId,
    emailSituation,
    usesOwnDomain,
    emailAudience,
    emailUrgency,
    pressure,
    horizon,
    teamPressure,
    outcome,
    capPressure,
    workArea,
    mustStayHuman,
    capUrgency,
  ])

  const copy = fr
    ? {
        back: 'Retour',
        next: 'Continuer',
        seeBrief: 'Voir mon aperçu',
        stepOf: 'Étape',
        of: 'sur',
        privateNote: 'Cet aperçu reste dans votre navigateur sauf si vous choisissez de l’envoyer à ROALLA.',
        priorities: 'Priorités pratiques',
        plan: 'Prochaines 30 / 60 / 90 jours',
        contact: 'Obtenir une réponse d’adéquation',
        restart: 'Recommencer',
        optional: 'Optionnel—parlez à une personne si vous voulez une réponse adaptée.',
      }
    : {
        back: 'Back',
        next: 'Continue',
        seeBrief: 'See my brief',
        stepOf: 'Step',
        of: 'of',
        privateNote: 'This brief stays in your browser unless you choose to send it to ROALLA.',
        priorities: 'Practical priorities',
        plan: 'Next 30 / 60 / 90 days',
        contact: 'Get a fit reply',
        restart: 'Start over',
        optional: 'Optional—talk to a person if you want a tailored reply.',
      }

  const contactHref = useMemo(() => {
    const params = new URLSearchParams({
      from_page:
        briefId === 'email-reach'
          ? '/tools/email-reach-brief'
          : briefId === 'ninety-day-plan'
            ? '/tools/ninety-day-plan-brief'
            : '/tools/capacity-pressure-brief',
      goal: result.headline,
      conversion_source: 'plain_language_brief',
    })
    if (briefId === 'email-reach') {
      params.set('intent', 'visibility')
      params.set('need', 'email-reach')
    } else if (briefId === 'ninety-day-plan') {
      params.set('intent', 'consulting')
      params.set('need', 'execution-plan')
    } else {
      params.set('intent', 'ai-support')
      params.set('need', 'capacity-pressure')
    }
    return `/${fr ? 'fr' : 'en'}/contact?${params.toString()}`
  }, [briefId, result.headline, fr])

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (step < totalSteps - 1) {
      setStep((value) => value + 1)
      return
    }
    setDone(true)
    trackAnalyticsEvent('plain_language_brief_complete', { brief: briefId })
  }

  const steps: ReactNode[] =
    briefId === 'email-reach'
      ? [
          <OptionGroup
            key="s"
            label={fr ? 'Que remarquez-vous le plus?' : 'What do you notice most?'}
            value={emailSituation}
            onChange={(id) => setEmailSituation(id as EmailReachSituation)}
            options={[
              { id: 'junk-folder', label: fr ? 'Les messages vont dans les indésirables' : 'Messages land in junk' },
              { id: 'never-arrives', label: fr ? 'Les messages n’arrivent jamais' : 'Messages never arrive' },
              {
                id: 'looks-like-spam',
                label: fr ? 'Les messages semblent suspects aux clients' : 'Messages look suspicious to customers',
              },
              { id: 'unsure', label: fr ? 'Je ne suis pas sûr—les réponses baissent' : 'Not sure—replies are down' },
            ]}
          />,
          <OptionGroup
            key="d"
            label={fr ? 'Envoyez-vous depuis le domaine de votre entreprise?' : 'Do you send from your business domain?'}
            value={usesOwnDomain ? 'yes' : 'no'}
            onChange={(id) => setUsesOwnDomain(id === 'yes')}
            options={[
              { id: 'yes', label: fr ? 'Oui—notre domaine' : 'Yes—our domain' },
              { id: 'no', label: fr ? 'Non—ou je ne suis pas sûr' : 'No—or I’m not sure' },
            ]}
          />,
          <OptionGroup
            key="a"
            label={fr ? 'À qui écrivez-vous surtout?' : 'Who do you mostly email?'}
            value={emailAudience}
            onChange={(id) => setEmailAudience(id as EmailReachAudience)}
            options={[
              { id: 'customers', label: fr ? 'Clients actuels' : 'Current customers' },
              { id: 'prospects', label: fr ? 'Prospects' : 'Prospects' },
              { id: 'both', label: fr ? 'Les deux' : 'Both' },
            ]}
          />,
          <OptionGroup
            key="u"
            label={fr ? 'Quelle est l’urgence?' : 'How urgent is this?'}
            value={emailUrgency}
            onChange={(id) => setEmailUrgency(id as EmailReachUrgency)}
            options={[
              { id: 'exploring', label: fr ? 'Exploration' : 'Exploring' },
              { id: 'this-quarter', label: fr ? 'Ce trimestre' : 'This quarter' },
              { id: 'urgent', label: fr ? 'Urgent' : 'Urgent' },
            ]}
          />,
        ]
      : briefId === 'ninety-day-plan'
        ? [
            <OptionGroup
              key="p"
              label={fr ? 'Quelle pression est la plus proche?' : 'Which pressure is closest?'}
              value={pressure}
              onChange={(id) => setPressure(id as NinetyDayPressure)}
              options={[
                {
                  id: 'too-many-priorities',
                  label: fr ? 'Trop de priorités se concurrencent' : 'Too many priorities compete',
                },
                { id: 'plans-stall', label: fr ? 'Les plans bloquent entre les réunions' : 'Plans stall between meetings' },
                {
                  id: 'unclear-ownership',
                  label: fr ? 'Qui décide ou mesure n’est pas clair' : 'Ownership or measures are unclear',
                },
              ]}
            />,
            <OptionGroup
              key="h"
              label={fr ? 'Sur quel horizon voulez-vous agir?' : 'What horizon do you want to act on?'}
              value={horizon}
              onChange={(id) => setHorizon(id as NinetyDayHorizon)}
              options={[
                { id: '30-days', label: fr ? '30 jours' : '30 days' },
                { id: '90-days', label: fr ? '90 jours' : '90 days' },
                { id: 'this-year', label: fr ? 'Cette année' : 'This year' },
              ]}
            />,
            <OptionGroup
              key="t"
              label={fr ? 'Comment se sent l’équipe?' : 'How does the team feel?'}
              value={teamPressure}
              onChange={(id) => setTeamPressure(id as NinetyDayTeamPressure)}
              options={[
                { id: 'founder-led', label: fr ? 'Surtout dirigé par le fondateur' : 'Mostly founder-led' },
                { id: 'small-team', label: fr ? 'Petite équipe mince' : 'Small thin team' },
                { id: 'growing-team', label: fr ? 'Équipe en croissance' : 'Growing team' },
              ]}
            />,
            <label key="o" className="block">
              <span className="text-sm font-semibold text-slate-950">
                {fr
                  ? 'En une phrase, quel résultat d’affaires compte le plus maintenant?'
                  : 'In one sentence, what business result matters most right now?'}
              </span>
              <input
                type="text"
                value={outcome}
                onChange={(event) => setOutcome(event.target.value)}
                placeholder={fr ? 'Ex. : plus de conversations clients qualifiées' : 'e.g. more qualified customer conversations'}
                className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none ring-brand-gold focus:ring-2"
              />
            </label>,
          ]
        : [
            <OptionGroup
              key="cp"
              label={fr ? 'Quelle pression est la plus proche?' : 'Which pressure is closest?'}
              value={capPressure}
              onChange={(id) => setCapPressure(id as CapacityPressure)}
              options={[
                { id: 'cant-hire', label: fr ? 'Nous n’arrivons pas à embaucher assez' : 'We can’t hire enough people' },
                { id: 'peak-volume', label: fr ? 'Les pics cassent notre couverture' : 'Peaks break our coverage' },
                { id: 'thin-team', label: fr ? 'L’équipe est trop mince pour la charge' : 'The team is too thin for the load' },
                {
                  id: 'quality-slipping',
                  label: fr ? 'La qualité glisse sous la pression' : 'Quality slips under pressure',
                },
              ]}
            />,
            <OptionGroup
              key="w"
              label={fr ? 'Où le travail s’accumule le plus?' : 'Where does work pile up most?'}
              value={workArea}
              onChange={(id) => setWorkArea(id as CapacityWorkArea)}
              options={[
                { id: 'customer-requests', label: fr ? 'Demandes clients' : 'Customer requests' },
                { id: 'internal-admin', label: fr ? 'Admin interne' : 'Internal admin' },
                { id: 'reporting', label: fr ? 'Rapports et préparation' : 'Reporting and prep' },
                { id: 'operations', label: fr ? 'Opérations quotidiennes' : 'Day-to-day operations' },
              ]}
            />,
            <OptionGroup
              key="h"
              label={fr ? 'Qu’est-ce qui doit rester vérifié par une personne?' : 'What must stay checked by a person?'}
              value={mustStayHuman}
              onChange={(id) => setMustStayHuman(id as CapacityHumanKeep)}
              options={[
                { id: 'customer-judgment', label: fr ? 'Jugement client' : 'Customer judgment' },
                { id: 'approvals', label: fr ? 'Approbations' : 'Approvals' },
                { id: 'exceptions', label: fr ? 'Cas inhabituels' : 'Unusual exceptions' },
                { id: 'relationships', label: fr ? 'Relations importantes' : 'Important relationships' },
              ]}
            />,
            <OptionGroup
              key="u"
              label={fr ? 'Quelle est l’urgence?' : 'How urgent is this?'}
              value={capUrgency}
              onChange={(id) => setCapUrgency(id as 'exploring' | 'this-quarter' | 'urgent')}
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
        <p className="mt-8 text-sm text-slate-600">{copy.optional}</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <a
            href={contactHref}
            onClick={() => trackAnalyticsEvent('plain_language_brief_contact', { brief: briefId })}
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary-dark px-5 text-sm font-semibold text-white hover:bg-primary-darker"
          >
            {copy.contact}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </a>
          <button
            type="button"
            onClick={() => {
              setDone(false)
              setStep(0)
            }}
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800"
          >
            {copy.restart}
          </button>
        </div>
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
