import React from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Layers,
  Lightbulb,
  Nfc,
  Package,
  QrCode,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { Link } from '@/i18n/navigation'
import {
  playbookBoothFeatures,
  playbookCoreFlow,
  playbookCustomerSafeBullets,
  playbookColdDejabruReference,
  playbookDiscoveryChecklist,
  playbookDoNotLeadWith,
  playbookFloorEngagementExcluded,
  playbookFloorEngagementIntro,
  playbookFloorEntryMethods,
  playbookHowToUse,
  playbookLifecycleFeatures,
  playbookPackages,
  playbookQueueAfterScan,
  playbookQueueBeforeShow,
  playbookQueueIntro,
  playbookQueueLayout,
  playbookQueueSalesLine,
  playbookQueueSignExamples,
  playbookQueueSourceParams,
  playbookQueueWhileWaiting,
  playbookSelectiveAddons,
  effortLabels,
  type PlaybookEffort,
} from '@/lib/digital-events-playbook'

const sectionNav = [
  { id: 'how-to', label: 'How to use' },
  { id: 'floor-entry', label: 'QR + NFC' },
  { id: 'queue', label: 'Long lines' },
  { id: 'flow', label: 'Core flow' },
  { id: 'features', label: 'Features' },
  { id: 'lifecycle', label: 'Lifecycle' },
  { id: 'packages', label: 'Packages' },
  { id: 'discovery', label: 'Discovery' },
  { id: 'reference', label: 'Cold Deja Bru' },
  { id: 'guardrails', label: 'Guardrails' },
] as const

const effortPillClass: Record<PlaybookEffort, string> = {
  S: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  M: 'bg-amber-100 text-amber-950 border-amber-300',
  L: 'bg-slate-200 text-slate-900 border-slate-400',
}

const phasePillClass: Record<string, string> = {
  'Pre-event': 'bg-sky-100 text-sky-950 border-sky-300',
  During: 'bg-primary/15 text-primary-darker border-primary/40',
  'Post-event': 'bg-violet-100 text-violet-950 border-violet-300',
}

function Pill({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${className}`}
    >
      {children}
    </span>
  )
}

function EffortPill({ effort }: { effort: PlaybookEffort }) {
  return <Pill className={effortPillClass[effort]}>{effortLabels[effort]}</Pill>
}

function PhasePill({ phase }: { phase: string }) {
  return <Pill className={phasePillClass[phase] ?? 'bg-slate-100 text-slate-800 border-slate-300'}>{phase}</Pill>
}

function HoverTile({
  id,
  className = '',
  children,
}: {
  id?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      id={id}
      className={`rounded-xl border border-slate-300 bg-white shadow-card transition-all duration-300 hover:border-primary/45 hover:shadow-card-hover hover:-translate-y-0.5 ${className}`}
    >
      {children}
    </div>
  )
}

function SectionShell({
  id,
  icon: Icon,
  title,
  description,
  children,
  tone = 'default',
}: {
  id?: string
  icon: typeof BookOpen
  title: string
  description?: string
  children: React.ReactNode
  tone?: 'default' | 'warn' | 'success'
}) {
  const headerTone =
    tone === 'warn'
      ? 'border-amber-300 bg-gradient-to-r from-amber-50 to-white'
      : tone === 'success'
        ? 'border-emerald-300 bg-gradient-to-r from-emerald-50 to-white'
        : 'border-slate-300 bg-gradient-to-r from-slate-100 to-white'

  return (
    <section id={id} className="scroll-mt-28">
      <HoverTile className="overflow-hidden">
        <div className={`border-b px-5 py-4 lg:px-6 ${headerTone}`}>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white shadow-sm">
              <Icon className="h-5 w-5 text-primary-dark" aria-hidden />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-slate-900">{title}</h2>
              {description && <p className="mt-1 text-sm text-slate-700 leading-relaxed">{description}</p>}
            </div>
          </div>
        </div>
        <div className="p-5 lg:p-6">{children}</div>
      </HoverTile>
    </section>
  )
}

function DetailBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2.5">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600">{label}</p>
      <p className="mt-1 text-sm text-slate-900 leading-relaxed">{children}</p>
    </div>
  )
}

function LinkPill({
  href,
  external,
  children,
}: {
  href: string
  external?: boolean
  children: React.ReactNode
}) {
  const className =
    'inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary-darker transition-all duration-200 hover:border-primary hover:bg-primary hover:text-white hover:shadow-md'

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
      </a>
    )
  }

  return (
    <Link href={href as '/digital-creations' | '/services/digital-events'} className={className}>
      {children}
      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
    </Link>
  )
}

export default function DigitalEventsPlaybook() {
  return (
    <article className="max-w-5xl mx-auto pb-20">
      <div className="mb-8 rounded-xl border-2 border-amber-400 bg-gradient-to-r from-amber-100 via-amber-50 to-white px-5 py-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-200 border border-amber-400">
            <ShieldCheck className="h-5 w-5 text-amber-950" aria-hidden />
          </div>
          <div>
            <Pill className="bg-amber-200 text-amber-950 border-amber-400 mb-2">Internal · Roalla team only</Pill>
            <p className="text-sm font-medium text-amber-950 leading-relaxed">
              Not linked from public navigation. Use for discovery, scoping, and delivery—not as customer-facing copy.
            </p>
          </div>
        </div>
      </div>

      <header className="mb-8 rounded-2xl border border-slate-300 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 lg:p-8 text-white shadow-card">
        <Pill className="bg-white/15 text-white border-white/25 mb-3">Digital Events</Pill>
        <h1 className="text-3xl lg:text-4xl font-serif font-bold tracking-tight">Product promotion playbook</h1>
        <p className="mt-4 text-slate-200 leading-relaxed max-w-3xl">
          Feature catalog and scoping guide for trade shows, booths, launches, and business events. Anchor proof:{' '}
          <a
            href={playbookColdDejabruReference.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary-light underline underline-offset-2 hover:text-white"
          >
            coldbru.dejabru.ca
          </a>
          .
        </p>
      </header>

      <nav aria-label="Playbook sections" className="mb-8 sticky top-[calc(4rem+env(safe-area-inset-top,0px))] z-20 lg:top-[calc(5rem+env(safe-area-inset-top,0px))]">
        <div className="rounded-xl border border-slate-300 bg-white/95 backdrop-blur-md px-3 py-3 shadow-card">
          <p className="px-1 pb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600">Jump to</p>
          <div className="flex flex-wrap gap-2">
            {sectionNav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 transition-all duration-200 hover:border-primary hover:bg-primary/10 hover:text-primary-darker"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="space-y-8">
        <SectionShell id="how-to" icon={BookOpen} title="How to use this">
          <ul className="grid gap-3 sm:grid-cols-2">
            {playbookHowToUse.map((item, i) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-primary/35 hover:shadow-card-hover"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-900 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </SectionShell>

        <SectionShell
          id="floor-entry"
          icon={QrCode}
          title="Floor engagement standard: QR + NFC"
          description={playbookFloorEngagementIntro}
          tone="success"
        >
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            {playbookFloorEntryMethods.map((entry) => {
              const Icon = entry.method === 'QR' ? QrCode : Nfc
              return (
                <HoverTile key={entry.method} className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 border border-primary/25">
                      <Icon className="h-4 w-4 text-primary-darker" aria-hidden />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{entry.title}</h3>
                    <Pill className="bg-slate-100 text-slate-700 border-slate-300 ml-auto">{entry.range}</Pill>
                  </div>
                  <DetailBlock label="Best for">{entry.bestFor}</DetailBlock>
                  <div className="mt-2">
                    <DetailBlock label="Visitor action">{entry.visitorAction}</DetailBlock>
                  </div>
                  <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600 mb-2">
                    Roalla delivers
                  </p>
                  <ul className="space-y-1.5">
                    {entry.roallaDeliverables.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-slate-900">
                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-primary" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </HoverTile>
              )
            })}
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600 mb-2">Not in scope</p>
          <div className="flex flex-wrap gap-2">
            {playbookFloorEngagementExcluded.map((item) => (
              <Pill key={item} className="bg-slate-100 text-slate-800 border-slate-300 max-w-full whitespace-normal text-left leading-snug py-2">
                {item}
              </Pill>
            ))}
          </div>
        </SectionShell>

        <SectionShell
          id="queue"
          icon={Users}
          title="High traffic & long lines"
          description={playbookQueueIntro}
        >
          <DetailBlock label="Sales one-liner">{playbookQueueSalesLine}</DetailBlock>

          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600 mb-3">
            Booth layout (scan paths)
          </p>
          <div className="grid gap-3 sm:grid-cols-3 mb-8">
            {playbookQueueLayout.map((row) => (
              <HoverTile key={row.label} className="p-4">
                <Pill className="bg-primary/15 text-primary-darker border-primary/35 mb-2">Step {row.step}</Pill>
                <h3 className="text-sm font-bold text-slate-900">{row.label}</h3>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">{row.purpose}</p>
                <code className="mt-3 inline-block rounded-md bg-slate-900 px-2 py-1 text-xs text-primary-light font-mono">
                  ?{row.sourceParam}
                </code>
              </HoverTile>
            ))}
          </div>

          {[
            { title: 'While they wait (on the floor)', items: playbookQueueWhileWaiting },
            { title: 'Before the show (reduce line pressure)', items: playbookQueueBeforeShow },
            { title: 'After they scan (without the rep)', items: playbookQueueAfterScan },
          ].map((group) => (
            <div key={group.title} className="mb-6 last:mb-0">
              <h3 className="text-sm font-bold text-slate-900 mb-3">{group.title}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {group.items.map((tactic) => (
                  <HoverTile key={tactic.id} className="p-4">
                    <h4 className="text-sm font-bold text-slate-900">{tactic.title}</h4>
                    <p className="mt-1 text-xs font-medium text-slate-600">{tactic.when}</p>
                    <p className="mt-2 text-sm text-slate-800 leading-relaxed">{tactic.action}</p>
                    {tactic.sourceParam && (
                      <code className="mt-2 inline-block rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs text-slate-800 font-mono">
                        ?{tactic.sourceParam}
                      </code>
                    )}
                  </HoverTile>
                ))}
              </div>
            </div>
          ))}

          <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600 mb-3">
            Example sign copy
          </p>
          <div className="grid gap-3 md:grid-cols-3 mb-6">
            {playbookQueueSignExamples.map((sign) => (
              <HoverTile key={sign.placement} className="p-4 bg-gradient-to-b from-white to-slate-50">
                <Pill className="bg-slate-200 text-slate-800 border-slate-400 mb-3">{sign.placement}</Pill>
                <p className="text-base font-bold text-slate-900 leading-snug">{sign.headline}</p>
                <p className="mt-1 text-sm text-slate-700">{sign.subline}</p>
                <code className="mt-3 inline-block rounded-md bg-slate-900 px-2 py-1 text-xs text-primary-light font-mono">
                  ?{sign.sourceParam}
                </code>
              </HoverTile>
            ))}
          </div>

          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600 mb-2">
            Recommended source params
          </p>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100">
                  <th className="py-2.5 px-3 font-semibold text-slate-800">Param</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-800">Use</th>
                </tr>
              </thead>
              <tbody>
                {playbookQueueSourceParams.map((row) => (
                  <tr key={row.param} className="border-b border-slate-100 last:border-0">
                    <td className="py-2.5 px-3 font-mono text-xs text-primary-darker whitespace-nowrap">
                      ?{row.param}
                    </td>
                    <td className="py-2.5 px-3 text-slate-800">{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionShell>

        <SectionShell id="flow" icon={Layers} title="Core flow" description="Every booth or launch experience should move through these five steps.">
          <ol className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {playbookCoreFlow.map((step, i) => (
              <li
                key={step}
                className="group flex flex-1 min-w-[9rem] items-center gap-3 rounded-xl border border-slate-300 bg-gradient-to-b from-white to-slate-50 px-4 py-3 shadow-sm transition-all duration-200 hover:border-primary hover:shadow-card-hover"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary-darker ring-2 ring-primary/25 transition-colors group-hover:bg-primary group-hover:text-white">
                  {i + 1}
                </span>
                <span className="text-sm font-semibold text-slate-900">{step}</span>
              </li>
            ))}
          </ol>
        </SectionShell>

        <SectionShell
          id="features"
          icon={Sparkles}
          title="Booth feature catalog"
          description="Hover each tile for scoping details. Match effort pills to timeline conversations."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {playbookBoothFeatures.map((feature) => (
              <HoverTile key={feature.id} className="p-4 lg:p-5">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                  <h3 className="text-base font-bold text-slate-900 leading-snug pr-2">{feature.title}</h3>
                  <EffortPill effort={feature.effort} />
                </div>
                <div className="grid gap-2">
                  <DetailBlock label="What">{feature.what}</DetailBlock>
                  <DetailBlock label="Why it helps">{feature.why}</DetailBlock>
                  <DetailBlock label="Roalla fit">{feature.roallaFit}</DetailBlock>
                  {feature.dependencies && feature.dependencies.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600 mb-2">
                        Dependencies
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {feature.dependencies.map((dep) => (
                          <Pill key={dep} className="bg-white text-slate-800 border-slate-300">
                            {dep}
                          </Pill>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </HoverTile>
            ))}
          </div>
        </SectionShell>

        <SectionShell
          id="lifecycle"
          icon={Lightbulb}
          title="Pre / during / post event"
          description="Lifecycle features that extend product promotion beyond the booth."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {playbookLifecycleFeatures.map((row) => (
              <HoverTile key={`${row.phase}-${row.feature}`} className="p-4">
                <div className="mb-3">
                  <PhasePill phase={row.phase} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">{row.feature}</h3>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">{row.value}</p>
              </HoverTile>
            ))}
          </div>
        </SectionShell>

        <SectionShell
          icon={AlertTriangle}
          title="Selective add-ons"
          description="Scope carefully—these can balloon timeline and cost."
          tone="warn"
        >
          <div className="flex flex-wrap gap-2">
            {playbookSelectiveAddons.map((item) => (
              <Pill key={item} className="bg-white text-slate-900 border-amber-300 px-3 py-1.5 text-sm font-medium normal-case tracking-normal">
                {item}
              </Pill>
            ))}
          </div>
        </SectionShell>

        <SectionShell
          id="packages"
          icon={Package}
          title="Productized packages"
          description="Starting proposals—adjust after content-readiness review."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {playbookPackages.map((pkg) => (
              <HoverTile key={pkg.id} className="p-5 flex flex-col h-full">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-slate-900">{pkg.name}</h3>
                  <Pill className="bg-primary/15 text-primary-darker border-primary/35">{pkg.timeline}</Pill>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mb-4">{pkg.bestFor}</p>
                <ul className="mt-auto space-y-2">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-900">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-primary" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </HoverTile>
            ))}
          </div>
        </SectionShell>

        <SectionShell
          id="discovery"
          icon={ClipboardList}
          title="Discovery checklist"
          description="Run through before quoting or committing to a ship date."
        >
          <ul className="grid gap-2 sm:grid-cols-2">
            {playbookDiscoveryChecklist.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </SectionShell>

        <SectionShell id="reference" icon={ExternalLink} title="Cold Deja Bru reference">
          <DetailBlock label="Shipped">{playbookColdDejabruReference.shipped}</DetailBlock>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600 mb-2">
            Upsell on the next similar deal
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {playbookColdDejabruReference.upsellNextTime.map((item) => (
              <Pill key={item} className="bg-primary/10 text-primary-darker border-primary/30 max-w-full whitespace-normal text-left leading-snug py-2">
                {item}
              </Pill>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <LinkPill href={playbookColdDejabruReference.url} external>
              Live site
            </LinkPill>
            <LinkPill href={playbookColdDejabruReference.portfolioPath}>Digital Portfolio</LinkPill>
            <LinkPill href="/services/digital-events">Public Digital Events</LinkPill>
          </div>
        </SectionShell>

        <SectionShell id="guardrails" icon={AlertTriangle} title="Do not lead with" tone="warn">
          <ul className="grid gap-2 sm:grid-cols-2">
            {playbookDoNotLeadWith.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2.5 text-sm font-medium text-amber-950"
              >
                {item}
              </li>
            ))}
          </ul>
        </SectionShell>

        <SectionShell
          icon={ShieldCheck}
          title="Safe for the public Digital Events page"
          description="Outcome language only—no package names, CRM lists, or staff dashboard details."
          tone="success"
        >
          <div className="flex flex-wrap gap-2">
            {playbookCustomerSafeBullets.map((item) => (
              <Pill
                key={item}
                className="bg-emerald-50 text-emerald-950 border-emerald-300 max-w-full whitespace-normal text-left leading-snug py-2 px-3 text-sm font-medium normal-case tracking-normal"
              >
                {item}
              </Pill>
            ))}
          </div>
        </SectionShell>
      </div>
    </article>
  )
}
