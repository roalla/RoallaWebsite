'use client'

import {
  Bot,
  CheckCircle2,
  Database,
  FileCheck2,
  Gauge,
  GitBranch,
  Globe2,
  MessageSquareText,
  Network,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react'
import { useLocale } from 'next-intl'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import styles from './OperationalMotion.module.css'

type MotionShellProps = {
  children: React.ReactNode
  className?: string
  label: string
  tone?: 'dark' | 'light'
}

function MotionShell({ children, className = '', label, tone = 'dark' }: MotionShellProps) {
  const { ref, inView } = useInViewOnce<HTMLElement>()
  const reduceMotion = usePrefersReducedMotion()

  return (
    <figure
      ref={ref}
      className={[styles.shell, tone === 'light' ? styles.light : styles.dark, className].filter(Boolean).join(' ')}
      data-active={inView && !reduceMotion ? 'true' : 'false'}
      data-reduce-motion={reduceMotion ? 'true' : 'false'}
      aria-label={label}
    >
      {children}
    </figure>
  )
}

function StatusBar({ eyebrow, status }: { eyebrow: string; status: string }) {
  return (
    <div className={styles.statusBar}>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <span className={styles.liveStatus}><span className={styles.liveDot} aria-hidden />{status}</span>
    </div>
  )
}

export function AgentWorkflowMotion({ locale }: { locale: string }) {
  const fr = locale === 'fr'
  const steps = fr
    ? [
        { title: 'Demande reçue', detail: 'Intention et contexte', icon: MessageSquareText },
        { title: 'Agent IA en action', detail: 'Recherche et préparation', icon: Bot },
        { title: 'Contrôle humain', detail: 'Approbation au besoin', icon: UserCheck },
        { title: 'Résultat livré', detail: 'Action et piste d’audit', icon: CheckCircle2 },
      ]
    : [
        { title: 'Request received', detail: 'Intent and context', icon: MessageSquareText },
        { title: 'AI agent works', detail: 'Research and preparation', icon: Bot },
        { title: 'Human checkpoint', detail: 'Approval when needed', icon: UserCheck },
        { title: 'Outcome delivered', detail: 'Action and audit trail', icon: CheckCircle2 },
      ]

  return (
    <MotionShell label={fr ? 'Exemple animé du flux de travail d’un agent IA' : 'Animated example of an AI agent workflow'}>
      <StatusBar eyebrow={fr ? 'Flux agentique' : 'Agentic workflow'} status={fr ? 'Contrôlé' : 'Governed'} />
      <div className={styles.agentCanvas}>
        <div className={styles.agentRail} aria-hidden><span /></div>
        <ol className={styles.agentSteps}>
          {steps.map(({ title, detail, icon: Icon }, index) => (
            <li className={styles.agentStep} style={{ '--step': index } as React.CSSProperties} key={title}>
              <span className={styles.agentIcon}><Icon aria-hidden /></span>
              <span className={styles.agentCopy}>
                <strong>{title}</strong>
                <small>{detail}</small>
              </span>
              {index === 1 ? <span className={styles.thinking}><i /><i /><i /></span> : null}
            </li>
          ))}
        </ol>
      </div>
      <figcaption className={styles.caption}>
        <ShieldCheck aria-hidden />
        {fr ? 'Exemple illustratif avec limites, approbations et traçabilité.' : 'Illustrative workflow with boundaries, approvals, and traceability.'}
      </figcaption>
    </MotionShell>
  )
}

export function BusinessJourneyMotion() {
  const locale = useLocale()
  const fr = locale === 'fr'
  const stages = fr
    ? [
        ['01', 'Diagnostiquer', 'Voir le vrai blocage'],
        ['02', 'Décider', 'Choisir la bonne priorité'],
        ['03', 'Mettre en œuvre', 'Livrer avec contrôle'],
        ['04', 'Mesurer', 'Prouver le résultat'],
      ]
    : [
        ['01', 'Diagnose', 'Find the real constraint'],
        ['02', 'Decide', 'Choose the right priority'],
        ['03', 'Implement', 'Deliver with control'],
        ['04', 'Measure', 'Prove the outcome'],
      ]

  return (
    <MotionShell
      tone="light"
      label={fr ? 'Parcours animé de la décision au résultat' : 'Animated journey from decision to outcome'}
      className={styles.journeyShell}
    >
      <StatusBar eyebrow={fr ? 'De la décision au résultat' : 'From decision to outcome'} status={fr ? 'Progression claire' : 'Clear progression'} />
      <div className={styles.journeyTrack} aria-hidden><span /></div>
      <ol className={styles.journeySteps}>
        {stages.map(([number, title, detail], index) => (
          <li key={title} className={styles.journeyStep} style={{ '--step': index } as React.CSSProperties}>
            <span className={styles.journeyNumber}>{number}</span>
            <strong>{title}</strong>
            <small>{detail}</small>
          </li>
        ))}
      </ol>
    </MotionShell>
  )
}

export function TechnologyDecisionMotion() {
  const locale = useLocale()
  const fr = locale === 'fr'
  const inputs = fr
    ? [
        { label: 'Applications', icon: Database },
        { label: 'Fournisseurs', icon: Globe2 },
        { label: 'Risques', icon: ShieldCheck },
      ]
    : [
        { label: 'Applications', icon: Database },
        { label: 'Vendors', icon: Globe2 },
        { label: 'Risks', icon: ShieldCheck },
      ]

  return (
    <MotionShell label={fr ? 'Carte animée de décision technologique' : 'Animated technology decision map'} className={styles.techShell}>
      <StatusBar eyebrow={fr ? 'Vue de décision' : 'Decision view'} status={fr ? 'Priorisé' : 'Prioritized'} />
      <div className={styles.techMap}>
        <div className={styles.techInputs}>
          {inputs.map(({ label, icon: Icon }, index) => (
            <div className={styles.techInput} style={{ '--step': index } as React.CSSProperties} key={label}>
              <Icon aria-hidden /><span>{label}</span>
            </div>
          ))}
        </div>
        <div className={styles.techLines} aria-hidden><i /><i /><i /></div>
        <div className={styles.techCore}>
          <span className={styles.orbit} aria-hidden />
          <Network aria-hidden />
          <strong>{fr ? 'Plan de décision' : 'Decision plan'}</strong>
          <small>{fr ? 'Valeur • risque • séquence' : 'Value • risk • sequence'}</small>
        </div>
        <div className={styles.techArrow} aria-hidden />
        <div className={styles.techOutcome}>
          <FileCheck2 aria-hidden />
          <strong>{fr ? 'Feuille de route' : 'Prioritized roadmap'}</strong>
          <span><CheckCircle2 aria-hidden />{fr ? 'Prochaines étapes claires' : 'Clear next steps'}</span>
        </div>
      </div>
    </MotionShell>
  )
}

export function PortfolioProjectMotion({ name, category }: { name: string; category: 'website' | 'platform' }) {
  const locale = useLocale()
  const fr = locale === 'fr'
  const stages = category === 'website'
    ? (fr ? ['Structure', 'Identité', 'Expérience', 'Lancement'] : ['Structure', 'Brand', 'Experience', 'Launch'])
    : (fr ? ['Flux', 'Interface', 'Contrôles', 'Lancement'] : ['Workflow', 'Interface', 'Controls', 'Launch'])

  return (
    <MotionShell tone="light" label={fr ? `Parcours illustratif du projet ${name}` : `Illustrative project walkthrough for ${name}`} className={styles.portfolioShell}>
      <StatusBar eyebrow={fr ? 'Parcours du projet' : 'Project walkthrough'} status={fr ? 'Illustratif' : 'Illustrative'} />
      <div className={styles.portfolioCanvas}>
        <div className={styles.browserChrome} aria-hidden><i /><i /><i /><span>{name}</span></div>
        <div className={styles.wireframe} aria-hidden>
          <span className={styles.wireNav} />
          <span className={styles.wireTitle} />
          <span className={styles.wireText} />
          <span className={styles.wireButton} />
          <span className={styles.wireCard} />
          <span className={styles.wireCard} />
          <span className={styles.wireCard} />
        </div>
        <div className={styles.polished} aria-hidden>
          <span className={styles.polishedGlow} />
          <span className={styles.polishedNav} />
          <span className={styles.polishedTitle} />
          <span className={styles.polishedText} />
          <span className={styles.polishedButton} />
          <span className={styles.polishedCard} />
          <span className={styles.polishedCard} />
          <span className={styles.polishedCard} />
        </div>
        <div className={styles.polishHandle} aria-hidden><Sparkles /></div>
      </div>
      <ol className={styles.portfolioStages}>
        {stages.map((stage, index) => <li key={stage} className={styles.portfolioStage} style={{ '--step': index } as React.CSSProperties}><span>{index + 1}</span>{stage}</li>)}
      </ol>
      <figcaption className={styles.caption}><Gauge aria-hidden />{fr ? 'Une démonstration du processus, pas une mesure de performance.' : 'A process demonstration, not a performance claim.'}</figcaption>
    </MotionShell>
  )
}
