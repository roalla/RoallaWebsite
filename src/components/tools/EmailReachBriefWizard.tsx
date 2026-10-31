'use client'

import { FormEvent, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Loader2, LockKeyhole } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { trackAnalyticsEvent } from '@/lib/analytics'
import type { DomainHealthSnapshot } from '@/lib/domain-health/evaluate'
import {
  buildEmailReachBrief,
  parseEmailReachTarget,
  type EmailReachSituation,
  type EmailReachUrgency,
} from '@/lib/email-reach-brief'

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

function statusTone(status: string) {
  if (status === 'pass') return 'bg-emerald-100 text-emerald-900'
  if (status === 'review') return 'bg-amber-100 text-amber-950'
  return 'bg-rose-100 text-rose-900'
}

export default function EmailReachBriefWizard({ locale }: Props) {
  const fr = locale === 'fr'
  const [phase, setPhase] = useState<'target' | 'results' | 'questions' | 'brief'>('target')
  const [targetInput, setTargetInput] = useState('')
  const [targetError, setTargetError] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
  const [mailHealth, setMailHealth] = useState<DomainHealthSnapshot | null>(null)
  const [checkedDomain, setCheckedDomain] = useState('')
  const [situation, setSituation] = useState<EmailReachSituation>('junk-folder')
  const [urgency, setUrgency] = useState<EmailReachUrgency>('this-quarter')

  const copy = fr
    ? {
        targetLabel: 'Adresse du site ou courriel d’affaires',
        targetPlaceholder: 'votreentreprise.ca ou nom@votreentreprise.ca',
        targetHint: 'Nous vérifions les enregistrements publics du domaine—pas votre boîte de réception.',
        runCheck: 'Vérifier la configuration courriel',
        checking: 'Vérification…',
        empty: 'Entrez une adresse de site ou un courriel d’affaires.',
        invalid: 'Entrez un domaine ou un courriel d’affaires valide.',
        freeMail:
          'Les boîtes grand public (Gmail, Outlook, etc.) ne peuvent pas être vérifiées comme domaine d’entreprise. Utilisez votre domaine d’affaires.',
        checkFailed: 'Impossible de lire les enregistrements pour ce domaine. Réessayez ou continuez avec les questions.',
        resultsTitle: 'Ce que montrent les enregistrements publics',
        resultsIntro:
          'Ces contrôles indiquent si d’autres systèmes de courriel peuvent faire confiance à ce domaine. Ils ne garantissent pas que chaque message arrive en boîte de réception.',
        continueQuestions: 'Continuer avec deux questions rapides',
        back: 'Retour',
        seeBrief: 'Voir mon aperçu',
        privateNote: 'Cet aperçu reste dans votre navigateur sauf si vous choisissez de l’envoyer à ROALLA.',
        priorities: 'Priorités pratiques',
        plan: 'Prochaines 30 / 60 / 90 jours',
        contact: 'Obtenir une réponse d’adéquation',
        estimate: 'Estimer la configuration et la portée courriel',
        restart: 'Recommencer',
        learnSummary: 'Apprendre ce que signifient ces contrôles',
        learnIntro:
          'Ce sont des normes ouvertes de courriel d’affaires. ROALLA les lit sur les enregistrements publics de votre domaine pour expliquer ce qui manque—en langage simple.',
        learnMx:
          'Destination du courriel (MX) : indique où les réponses et messages entrants doivent arriver. Sans destination, les clients ne peuvent pas vous écrire de façon fiable.',
        learnSpf:
          'Qui peut envoyer (SPF) : publie la liste des services autorisés à envoyer pour votre domaine. Sans liste claire, d’autres peuvent plus facilement usurper votre nom.',
        learnDkim:
          'Courriel signé (DKIM) : ajoute une signature numérique pour que le destinataire voie que le message n’a pas été altéré en route.',
        learnDmarc:
          'Politique anti-usurpation (DMARC) : dit aux fournisseurs quoi faire si un message échoue aux contrôles—surveiller, mettre en quarantaine, ou rejeter.',
        learnBimi:
          'Logo de marque (BIMI) : norme ouverte optionnelle qui peut afficher votre logo dans certaines boîtes. Elle exige un enregistrement de logo et un DMARC fort. Sans BIMI, le courriel peut quand même s’envoyer.',
        learnNote:
          'Ces contrôles montrent si la configuration publique est solide. Ils ne prouvent pas à eux seuls qu’un envoi précis arrivera en boîte de réception.',
        status: { pass: 'En place', review: 'À revoir', gap: 'Manquant' },
        checks: {
          mx: {
            title: 'Destination du courriel',
            pass: 'Ce domaine a une destination pour recevoir du courriel.',
            review: 'La destination du courriel mérite un regard plus attentif.',
            gap: 'Ce domaine n’a pas de destination pour recevoir du courriel.',
            action: 'Ajoutez une destination de courriel pour que les réponses puissent arriver.',
          },
          spf: {
            title: 'Qui peut envoyer',
            pass: 'Une liste nomme les services autorisés à envoyer pour ce domaine.',
            review: 'Une liste d’expéditeurs existe, mais elle n’est pas assez stricte.',
            gap: 'Il n’y a pas de liste utilisable de qui peut envoyer pour ce domaine.',
            action: 'Publiez une liste d’expéditeurs claire et refusez le reste.',
          },
          dkim: {
            title: 'Courriel signé',
            pass: 'Un service d’envoi courant signe le courriel pour ce domaine.',
            review: 'La signature mérite une vérification plus précise.',
            gap: 'Aucun signe clair de signature de courriel pour ce domaine.',
            action: 'Activez la signature pour chaque service qui envoie pour ce domaine.',
          },
          dmarc: {
            title: 'Politique anti-usurpation',
            pass: 'Les fournisseurs doivent mettre en quarantaine ou rejeter le courriel qui échoue.',
            review: 'Une politique existe, mais elle est encore trop permissive.',
            gap: 'Aucune politique claire pour le courriel falsifié.',
            action: 'Ajoutez ou renforcez la politique pour que les échecs soient traités.',
          },
          bimi: {
            title: 'Logo de marque dans la boîte',
            pass: 'Un enregistrement de logo est publié et le DMARC est assez fort.',
            review: 'Un enregistrement de logo existe, mais le DMARC n’est pas encore assez fort—ou le lien est incomplet.',
            gap: 'Aucun enregistrement de logo de marque n’est publié.',
            action: 'Après un DMARC fort, publiez un enregistrement BIMI si vous voulez montrer votre marque.',
          },
        },
        situationLabel: 'Que remarquez-vous le plus?',
        urgencyLabel: 'Quelle est l’urgence?',
        situations: [
          { id: 'junk-folder', label: 'Les messages vont dans les indésirables' },
          { id: 'never-arrives', label: 'Les messages n’arrivent jamais' },
          { id: 'looks-like-spam', label: 'Les messages semblent suspects aux clients' },
          { id: 'unsure', label: 'Je ne suis pas sûr—les réponses baissent' },
        ],
        urgencies: [
          { id: 'exploring', label: 'Exploration' },
          { id: 'this-quarter', label: 'Ce trimestre' },
          { id: 'urgent', label: 'Urgent' },
        ],
      }
    : {
        targetLabel: 'Website address or business email',
        targetPlaceholder: 'yourbusiness.ca or name@yourbusiness.ca',
        targetHint: 'We check public domain records—not your inbox contents.',
        runCheck: 'Check email setup',
        checking: 'Checking…',
        empty: 'Enter a website address or business email.',
        invalid: 'Enter a valid business domain or email.',
        freeMail:
          'Free consumer mailboxes (Gmail, Outlook, and similar) cannot be checked as a business domain. Use your business domain.',
        checkFailed: 'We could not read records for that domain. Try again or continue with the questions.',
        resultsTitle: 'What public records show',
        resultsIntro:
          'These checks show whether other mail systems can trust this domain. They do not guarantee every message lands in the inbox.',
        continueQuestions: 'Continue with two quick questions',
        back: 'Back',
        seeBrief: 'See my brief',
        privateNote: 'This brief stays in your browser unless you choose to send it to ROALLA.',
        priorities: 'Practical priorities',
        plan: 'Next 30 / 60 / 90 days',
        contact: 'Get a fit reply',
        estimate: 'Estimate email setup and reach work',
        restart: 'Start over',
        learnSummary: 'Learn what these checks mean',
        learnIntro:
          'These are open email standards for business domains. ROALLA reads them from your public domain records and explains gaps in plain language.',
        learnMx:
          'Mail destination (MX): where replies and inbound mail should arrive. Without a destination, customers cannot write back reliably.',
        learnSpf:
          'Who may send (SPF): the published list of services allowed to send for your domain. Without a clear list, others can more easily impersonate you.',
        learnDkim:
          'Signed mail (DKIM): a digital signature so the receiving system can see the message was not altered in transit.',
        learnDmarc:
          'Forged-mail policy (DMARC): tells providers what to do when a message fails the checks—monitor, quarantine, or reject.',
        learnBimi:
          'Brand logo (BIMI): an optional open standard that can show your logo in some inboxes. It needs a logo record and strong DMARC. Missing BIMI does not stop mail from sending.',
        learnNote:
          'These checks show whether public setup is sound. They do not by themselves prove that one specific send will land in the inbox.',
        status: { pass: 'In place', review: 'Needs review', gap: 'Missing' },
        checks: {
          mx: {
            title: 'Mail destination',
            pass: 'This domain has a destination for receiving mail.',
            review: 'The mail destination needs a closer look.',
            gap: 'This domain has no place for mail to arrive.',
            action: 'Add a mail destination so replies can arrive.',
          },
          spf: {
            title: 'Who may send',
            pass: 'A list names the services allowed to send for this domain.',
            review: 'A sender list is present, but it is not strict enough.',
            gap: 'There is no usable list of who may send for this domain.',
            action: 'Publish a clear sender list and reject everyone else.',
          },
          dkim: {
            title: 'Signed mail',
            pass: 'A common sending service signs mail for this domain.',
            review: 'Signing needs a closer look.',
            gap: 'No clear mail signing signal for this domain.',
            action: 'Turn on signing for each service that sends for this domain.',
          },
          dmarc: {
            title: 'Forged-mail policy',
            pass: 'Providers are told to quarantine or reject mail that fails the checks.',
            review: 'A policy exists, but it is still too permissive.',
            gap: 'There is no clear policy for forged mail.',
            action: 'Add or strengthen the policy so failures are handled.',
          },
          bimi: {
            title: 'Brand logo in the inbox',
            pass: 'A brand logo record is published and DMARC is strong enough.',
            review: 'A logo record exists, but DMARC is not yet strong enough—or the logo link is incomplete.',
            gap: 'No brand logo record is published.',
            action: 'After DMARC is strong, publish a BIMI record if you want supported inboxes to show your brand mark.',
          },
        },
        situationLabel: 'What do you notice most?',
        urgencyLabel: 'How urgent is this?',
        situations: [
          { id: 'junk-folder', label: 'Messages land in junk' },
          { id: 'never-arrives', label: 'Messages never arrive' },
          { id: 'looks-like-spam', label: 'Messages look suspicious to customers' },
          { id: 'unsure', label: 'Not sure—replies are down' },
        ],
        urgencies: [
          { id: 'exploring', label: 'Exploring' },
          { id: 'this-quarter', label: 'This quarter' },
          { id: 'urgent', label: 'Urgent' },
        ],
      }

  const brief = useMemo(
    () =>
      buildEmailReachBrief({
        situation,
        usesOwnDomain: true,
        audience: 'both',
        urgency,
        mailHealth,
      }),
    [situation, urgency, mailHealth],
  )

  const contactHref = {
    pathname: '/contact' as const,
    query: {
      intent: 'visibility',
      need: 'email-reach',
      from_page: '/tools/email-reach-brief',
      goal: brief.headline,
      conversion_source: 'plain_language_brief',
      ...(checkedDomain ? { website: checkedDomain } : {}),
    },
  }

  async function runCheck(event: FormEvent) {
    event.preventDefault()
    setTargetError(null)
    const parsed = parseEmailReachTarget(targetInput)
    if (!parsed.ok) {
      setTargetError(
        parsed.error === 'empty' ? copy.empty : parsed.error === 'free-mail' ? copy.freeMail : copy.invalid,
      )
      return
    }

    setChecking(true)
    setCheckedDomain(parsed.domain)
    try {
      const response = await fetch('/api/domain-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: `https://${parsed.domain}` }),
      })
      const payload = (await response.json()) as { snapshot?: DomainHealthSnapshot; error?: string }
      if (!response.ok || !payload.snapshot) {
        setMailHealth(null)
        setTargetError(payload.error || copy.checkFailed)
        setPhase('results')
        return
      }
      setMailHealth(payload.snapshot)
      setPhase('results')
      trackAnalyticsEvent('plain_language_brief_complete', {
        brief: 'email-reach',
        step: 'domain-health',
        domain: parsed.domain,
      })
    } catch {
      setMailHealth(null)
      setTargetError(copy.checkFailed)
      setPhase('results')
    } finally {
      setChecking(false)
    }
  }

  function restart() {
    setPhase('target')
    setTargetInput('')
    setTargetError(null)
    setMailHealth(null)
    setCheckedDomain('')
    setSituation('junk-folder')
    setUrgency('this-quarter')
  }

  const mailCards = (['mx', 'spf', 'dkim', 'dmarc', 'bimi'] as const).map((id) => {
    const check = mailHealth?.checks.find((item) => item.id === id)
    const status = check?.status ?? 'gap'
    const labels = copy.checks[id]
    return {
      id,
      status,
      title: labels.title,
      body: labels[status],
      action: labels.action,
      evidence: check?.evidence ?? [],
    }
  })

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      {phase === 'target' ? (
        <form onSubmit={runCheck} className="space-y-5">
          <label className="block">
            <span className="text-sm font-semibold text-slate-950">{copy.targetLabel}</span>
            <input
              type="text"
              inputMode="url"
              autoComplete="url"
              value={targetInput}
              onChange={(event) => setTargetInput(event.target.value)}
              placeholder={copy.targetPlaceholder}
              className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none ring-brand-gold focus:ring-2"
            />
            <span className="mt-2 block text-xs leading-5 text-slate-500">{copy.targetHint}</span>
          </label>
          {targetError ? (
            <p className="text-sm font-medium text-red-700" role="alert">
              {targetError}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={checking}
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary-dark px-5 text-sm font-semibold text-white transition hover:bg-primary-darker disabled:cursor-not-allowed disabled:opacity-60"
          >
            {checking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden /> : null}
            {checking ? copy.checking : copy.runCheck}
            {!checking ? <ArrowRight className="ml-2 h-4 w-4" aria-hidden /> : null}
          </button>
        </form>
      ) : null}

      {phase === 'results' ? (
        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{checkedDomain}</p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-slate-950">{copy.resultsTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{copy.resultsIntro}</p>
            {targetError && !mailHealth ? (
              <p className="mt-3 text-sm font-medium text-amber-900" role="status">
                {targetError}
              </p>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {mailCards.map((card) => (
              <article key={card.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-lg font-bold text-slate-950">{card.title}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${statusTone(card.status)}`}>
                    {copy.status[card.status as 'pass' | 'review' | 'gap']}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-700">{card.body}</p>
                {card.status !== 'pass' ? (
                  <p className="mt-2 text-sm font-medium text-primary-dark">{card.action}</p>
                ) : null}
                {card.evidence.length ? (
                  <p className="mt-2 break-all text-xs leading-5 text-slate-500">{card.evidence[0]}</p>
                ) : null}
              </article>
            ))}
          </div>

          <details className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <summary className="cursor-pointer text-sm font-semibold text-slate-950">{copy.learnSummary}</summary>
            <p className="mt-3 text-sm leading-6 text-slate-600">{copy.learnIntro}</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              <li>{copy.learnMx}</li>
              <li>{copy.learnSpf}</li>
              <li>{copy.learnDkim}</li>
              <li>{copy.learnDmarc}</li>
              <li>{copy.learnBimi}</li>
            </ul>
            <p className="mt-4 text-xs leading-5 text-slate-500">{copy.learnNote}</p>
          </details>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setPhase('questions')}
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary-dark px-5 text-sm font-semibold text-white transition hover:bg-primary-darker"
            >
              {copy.continueQuestions}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={restart}
              className="inline-flex min-h-11 items-center justify-center px-2 text-sm font-semibold text-slate-600 underline-offset-4 hover:underline"
            >
              {copy.restart}
            </button>
          </div>
        </div>
      ) : null}

      {phase === 'questions' ? (
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            setPhase('brief')
            trackAnalyticsEvent('plain_language_brief_complete', { brief: 'email-reach' })
          }}
        >
          <OptionGroup
            label={copy.situationLabel}
            value={situation}
            onChange={(id) => setSituation(id as EmailReachSituation)}
            options={copy.situations}
          />
          <OptionGroup
            label={copy.urgencyLabel}
            value={urgency}
            onChange={(id) => setUrgency(id as EmailReachUrgency)}
            options={copy.urgencies}
          />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setPhase('results')}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
              {copy.back}
            </button>
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary-dark px-5 text-sm font-semibold text-white transition hover:bg-primary-darker"
            >
              {copy.seeBrief}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </button>
          </div>
        </form>
      ) : null}

      {phase === 'brief' ? (
        <div className="space-y-6">
          <div className="flex items-start gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
            <span>{copy.privateNote}</span>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-950">{brief.headline}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">{brief.summary}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-950">{copy.priorities}</p>
            <ul className="mt-3 space-y-2">
              {brief.priorities.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-6 text-slate-700">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-primary-dark" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-950">{copy.plan}</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
              {brief.plan.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href={contactHref}
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary-dark px-5 text-sm font-semibold text-white transition hover:bg-primary-darker"
            >
              {copy.contact}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/email-reach-estimate"
              className="inline-flex min-h-11 items-center justify-center px-2 text-sm font-semibold text-primary-dark underline-offset-4 hover:underline"
            >
              {copy.estimate}
            </Link>
            <button
              type="button"
              onClick={restart}
              className="inline-flex min-h-11 items-center justify-center px-2 text-sm font-semibold text-slate-600 underline-offset-4 hover:underline"
            >
              {copy.restart}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
