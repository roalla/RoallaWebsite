import React from 'react'
import { Link } from '@/i18n/navigation'
import {
  playbookBoothFeatures,
  playbookCoreFlow,
  playbookCustomerSafeBullets,
  playbookColdDejabruReference,
  playbookDiscoveryChecklist,
  playbookDoNotLeadWith,
  playbookHowToUse,
  playbookLifecycleFeatures,
  playbookPackages,
  playbookSelectiveAddons,
  effortLabels,
} from '@/lib/digital-events-playbook'

function EffortBadge({ effort }: { effort: 'S' | 'M' | 'L' }) {
  return (
    <span className="inline-flex shrink-0 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
      {effortLabels[effort]}
    </span>
  )
}

function SectionCard({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="rounded-xl border border-slate-200 bg-white p-6 lg:p-8 shadow-sm">
      <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">{title}</h2>
      {children}
    </section>
  )
}

export default function DigitalEventsPlaybook() {
  return (
    <article className="max-w-4xl mx-auto pb-16">
      <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        <p className="font-semibold">Internal · Roalla team only</p>
        <p className="mt-1 text-amber-900/90">
          Not linked from public navigation. Use for discovery, scoping, and delivery—not as customer-facing copy.
        </p>
      </div>

      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Digital Events</p>
        <h1 className="mt-2 text-3xl lg:text-4xl font-serif font-bold text-slate-900">
          Product promotion playbook
        </h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          Feature catalog and scoping guide for trade shows, booths, launches, and business events. Anchor proof:{' '}
          <a
            href={playbookColdDejabruReference.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            coldbru.dejabru.ca
          </a>
          .
        </p>
      </header>

      <div className="space-y-8">
        <SectionCard title="How to use this">
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
            {playbookHowToUse.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Core flow">
          <ol className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3">
            {playbookCoreFlow.map((step, i) => (
              <li
                key={step}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </SectionCard>

        <SectionCard id="features" title="Booth feature catalog">
          <div className="space-y-6">
            {playbookBoothFeatures.map((feature) => (
              <div key={feature.id} className="border-t border-slate-100 pt-6 first:border-0 first:pt-0">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                  <EffortBadge effort={feature.effort} />
                </div>
                <dl className="grid gap-3 text-sm">
                  <div>
                    <dt className="font-medium text-slate-500">What</dt>
                    <dd className="text-slate-700 mt-0.5">{feature.what}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-500">Why it helps</dt>
                    <dd className="text-slate-700 mt-0.5">{feature.why}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-500">Roalla fit</dt>
                    <dd className="text-slate-700 mt-0.5">{feature.roallaFit}</dd>
                  </div>
                  {feature.dependencies && feature.dependencies.length > 0 && (
                    <div>
                      <dt className="font-medium text-slate-500">Dependencies</dt>
                      <dd className="text-slate-700 mt-0.5">{feature.dependencies.join(' · ')}</dd>
                    </div>
                  )}
                </dl>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Pre / during / post event">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-2 pr-4 font-semibold text-slate-700">Phase</th>
                  <th className="py-2 pr-4 font-semibold text-slate-700">Feature</th>
                  <th className="py-2 font-semibold text-slate-700">Product value</th>
                </tr>
              </thead>
              <tbody>
                {playbookLifecycleFeatures.map((row) => (
                  <tr key={`${row.phase}-${row.feature}`} className="border-b border-slate-100">
                    <td className="py-3 pr-4 text-slate-600 whitespace-nowrap">{row.phase}</td>
                    <td className="py-3 pr-4 text-slate-800">{row.feature}</td>
                    <td className="py-3 text-slate-700">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Selective add-ons (scope carefully)">
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
            {playbookSelectiveAddons.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard id="packages" title="Productized packages">
          <div className="grid gap-4 md:grid-cols-2">
            {playbookPackages.map((pkg) => (
              <div key={pkg.id} className="rounded-lg border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-900">{pkg.name}</h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-primary">{pkg.timeline}</p>
                <p className="mt-2 text-sm text-slate-600">{pkg.bestFor}</p>
                <ul className="mt-3 space-y-1.5">
                  {pkg.includes.map((item) => (
                    <li key={item} className="text-sm text-slate-700 flex gap-2">
                      <span className="text-primary" aria-hidden>
                        ·
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Discovery checklist">
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
            {playbookDiscoveryChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Cold Deja Bru reference">
          <p className="text-sm text-slate-700 mb-3">
            <strong>Shipped:</strong> {playbookColdDejabruReference.shipped}
          </p>
          <p className="text-sm font-medium text-slate-600 mb-2">Upsell on the next similar deal:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700 mb-4">
            {playbookColdDejabruReference.upsellNextTime.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 text-sm">
            <a
              href={playbookColdDejabruReference.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Live site
            </a>
            <Link href={playbookColdDejabruReference.portfolioPath} className="text-primary hover:underline">
              Digital Portfolio entry
            </Link>
            <Link href="/services/digital-events" className="text-primary hover:underline">
              Public Digital Events page
            </Link>
          </div>
        </SectionCard>

        <SectionCard title="Do not lead with">
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
            {playbookDoNotLeadWith.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Safe for the public Digital Events page">
          <p className="text-sm text-slate-600 mb-3">
            These outcome phrases are on the customer-facing page. Do not expose package names, CRM lists, or staff
            dashboard details publicly.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-800">
            {playbookCustomerSafeBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </article>
  )
}
