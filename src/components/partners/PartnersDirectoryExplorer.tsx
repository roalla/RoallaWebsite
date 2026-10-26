'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import Reveal from '@/components/motion/Reveal'
import type { PartnersDirectoryItem } from '@/lib/partners-directory'

type Props = {
  headingId: string
  heading: string
  showHeading: boolean
  businessNeedLabel: string
  organizationsNote: string
  filterAllLabel: string
  emptyLabel: string
  items: PartnersDirectoryItem[]
}

export default function PartnersDirectoryExplorer({
  headingId,
  heading,
  showHeading,
  businessNeedLabel,
  organizationsNote,
  filterAllLabel,
  emptyLabel,
  items,
}: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const tags = useMemo(() => {
    const seen = new Set<string>()
    const ordered: string[] = []
    for (const item of items) {
      for (const tag of item.filterTags) {
        const normalized = tag.toLowerCase()
        if (seen.has(normalized)) continue
        seen.add(normalized)
        ordered.push(tag)
      }
    }
    return ordered.slice(0, 8)
  }, [items])

  const visible = activeTag
    ? items.filter((item) =>
        item.filterTags.some((tag) => tag.toLowerCase() === activeTag.toLowerCase()) ||
        item.need.toLowerCase().includes(activeTag.toLowerCase()),
      )
    : items

  return (
    <section aria-labelledby={headingId}>
      {showHeading ? (
        <h2 id={headingId} className="font-serif text-2xl font-bold text-slate-950 sm:text-3xl">
          {heading}
        </h2>
      ) : (
        <h2 id={headingId} className="sr-only">
          {heading}
        </h2>
      )}

      {tags.length > 1 ? (
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label={filterAllLabel}>
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={
              activeTag === null
                ? 'rounded-full bg-slate-900 px-3.5 py-1.5 text-sm font-semibold text-white'
                : 'rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300'
            }
            aria-pressed={activeTag === null}
          >
            {filterAllLabel}
          </button>
          {tags.map((tag) => {
            const selected = activeTag?.toLowerCase() === tag.toLowerCase()
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(selected ? null : tag)}
                className={
                  selected
                    ? 'rounded-full bg-slate-900 px-3.5 py-1.5 text-sm font-semibold text-white'
                    : 'rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300'
                }
                aria-pressed={selected}
              >
                {tag}
              </button>
            )
          })}
        </div>
      ) : null}

      <ul className={`${showHeading || tags.length > 1 ? 'mt-8' : ''} divide-y divide-slate-200 border-y border-slate-200`}>
        {visible.length === 0 ? (
          <li className="py-10 text-sm text-slate-600">{emptyLabel}</li>
        ) : (
          visible.map((item, index) => (
            <Reveal as="li" key={item.key} delayMs={Math.min(index * 60, 240)} className="scroll-mt-28">
              <div
                id={item.key}
                className="group grid gap-5 py-7 transition hover:-translate-y-0.5 hover:bg-slate-50/80 sm:grid-cols-[11rem_1fr] sm:items-start sm:gap-8 lg:py-8"
              >
                <div className="flex h-16 w-full max-w-[11rem] items-center justify-center rounded-xl bg-white px-3 ring-1 ring-slate-200 transition group-hover:ring-primary/35">
                  {item.logo ? (
                    <Image
                      src={item.logo.src}
                      alt=""
                      width={item.logo.width}
                      height={item.logo.height}
                      className={item.logo.className}
                      unoptimized
                    />
                  ) : (
                    <span className="text-base font-extrabold tracking-tight text-slate-900">{item.wordmark}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">{item.relationship}</p>
                  <h3 className="mt-1 font-serif text-xl font-bold text-slate-950">{item.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    <span className="font-semibold text-slate-700">{businessNeedLabel}:</span> {item.need}
                  </p>
                  {item.externalCta ? (
                    <a
                      href={item.externalCta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-primary-dark hover:underline"
                    >
                      {item.externalCta.label}
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                    </a>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ))
        )}
      </ul>
      <p className="mt-8 text-sm leading-6 text-slate-500">{organizationsNote}</p>
    </section>
  )
}
