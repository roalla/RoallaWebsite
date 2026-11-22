'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Reveal from '@/components/motion/Reveal'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const stepKeys = [
  'evalFlowStep1',
  'evalFlowStep2',
  'evalFlowStep3',
  'evalFlowStep4',
  'evalFlowStep5',
] as const

const bodyKeys = [
  'evalFlowStep1Body',
  'evalFlowStep2Body',
  'evalFlowStep3Body',
  'evalFlowStep4Body',
  'evalFlowStep5Body',
] as const

export default function PartnersEvaluationFlow() {
  const t = useTranslations('partnersPlatforms')
  const [active, setActive] = useState(0)
  const lastIndex = stepKeys.length - 1
  const { ref, inView } = useInViewOnce<HTMLDivElement>()
  const reduceMotion = usePrefersReducedMotion()
  const sceneActive = inView && !reduceMotion

  return (
    <Reveal className="mb-10 border-t border-slate-200 pt-8" aria-labelledby="eval-flow-heading">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{t('evalFlowEyebrow')}</p>
      <h2 id="eval-flow-heading" className="mt-2 font-serif text-2xl font-bold text-slate-950 sm:text-3xl">
        {t('evalFlowTitle')}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{t('evalFlowDescription')}</p>

      <div
        ref={ref}
        className="mt-8"
        data-active={sceneActive ? 'true' : 'false'}
      >
        <ol className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-0" aria-label={t('evalFlowTitle')}>
          {stepKeys.map((key, index) => {
            const isActive = index === active
            const isComplete = index < active
            return (
              <li key={key} className="relative flex flex-1 sm:flex-col sm:items-center sm:text-center">
                {index < lastIndex ? (
                  <span
                    className={`pointer-events-none absolute left-[2.75rem] right-0 top-5 hidden h-0.5 overflow-hidden sm:block ${
                      isComplete ? 'bg-primary/30' : 'bg-slate-200'
                    }`}
                    aria-hidden
                  >
                    <span
                      className={`block h-full origin-left bg-primary motion-safe:transition-transform motion-safe:duration-500 ${
                        isComplete || (sceneActive && isActive) ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`group relative z-[1] flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors duration-300 sm:flex-col sm:border-transparent sm:bg-transparent sm:px-2 sm:py-0 sm:shadow-none sm:text-center ${
                    isActive
                      ? 'border-primary/35 bg-primary/[0.05]'
                      : 'border-slate-200 bg-white hover:border-primary/25'
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors duration-300 motion-safe:group-hover:scale-105 ${
                      isActive
                        ? 'border-primary bg-primary text-white'
                        : isComplete
                          ? 'border-primary/50 bg-primary/10 text-primary-dark'
                          : 'border-slate-300 bg-white text-slate-500'
                    }`}
                    style={
                      sceneActive
                        ? {
                            transitionDelay: `${index * 70}ms`,
                            transform: 'translateY(0)',
                            opacity: 1,
                          }
                        : undefined
                    }
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`text-sm font-semibold leading-5 transition-colors ${
                      isActive ? 'text-slate-950' : 'text-slate-600 group-hover:text-slate-900'
                    }`}
                  >
                    {t(key)}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <div
          key={active}
          className={`outcome-ladder-step mt-6 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-primary/[0.04] p-5 sm:p-6 motion-safe:transition-opacity motion-safe:duration-300 ${
            sceneActive ? 'opacity-100' : 'opacity-100'
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">
            {t('evalFlowStepLabel', { step: active + 1, total: stepKeys.length })}
          </p>
          <h3 className="mt-2 font-serif text-xl font-bold text-slate-950">{t(stepKeys[active])}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-700 sm:text-base">
            {t(bodyKeys[active])}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setActive((prev) => Math.max(0, prev - 1))}
              disabled={active === 0}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-primary/40 hover:text-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              {t('evalFlowBack')}
            </button>
            <button
              type="button"
              onClick={() => setActive((prev) => Math.min(lastIndex, prev + 1))}
              disabled={active === lastIndex}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t('evalFlowNext')}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <div className="ml-auto flex items-center gap-1.5" aria-hidden>
              {stepKeys.map((key, index) => (
                <span
                  key={key}
                  className={`h-1.5 w-6 rounded-full transition-colors duration-300 ${
                    index <= active ? 'bg-primary' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}
