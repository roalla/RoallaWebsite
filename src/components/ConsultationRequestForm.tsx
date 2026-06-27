'use client'

import React, { useMemo, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import toast from 'react-hot-toast'
import {
  Briefcase,
  Globe,
  Layers,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import {
  intentFromServiceParam,
  parseConsultationIntent,
  parseConsultingFocus,
  type ConsultationIntent,
  type ConsultingFocus,
} from '@/lib/consultation-request'

type FormState = {
  intent: ConsultationIntent | ''
  goal: string
  timeline: string
  consultingFocus: string
  websiteGoal: string
  hasExistingSite: string
  platformType: string
  name: string
  email: string
  company: string
  phone: string
  website: string
}

const initialState: FormState = {
  intent: '',
  goal: '',
  timeline: '',
  consultingFocus: '',
  websiteGoal: '',
  hasExistingSite: '',
  platformType: '',
  name: '',
  email: '',
  company: '',
  phone: '',
  website: '',
}

type ConsultationRequestFormProps = {
  initialIntent?: ConsultationIntent | null
  initialFocus?: ConsultingFocus | null
  initialGoal?: string | null
  initialReference?: string | null
  fromAssessment?: boolean
}

const intentOptions: {
  value: ConsultationIntent
  icon: typeof Briefcase
  titleKey: 'intentConsulting' | 'intentWebsite' | 'intentPlatform' | 'intentUnsure'
  descKey: 'intentConsultingDesc' | 'intentWebsiteDesc' | 'intentPlatformDesc' | 'intentUnsureDesc'
}[] = [
  { value: 'consulting', icon: Briefcase, titleKey: 'intentConsulting', descKey: 'intentConsultingDesc' },
  { value: 'website', icon: Globe, titleKey: 'intentWebsite', descKey: 'intentWebsiteDesc' },
  { value: 'platform', icon: Layers, titleKey: 'intentPlatform', descKey: 'intentPlatformDesc' },
  { value: 'unsure', icon: HelpCircle, titleKey: 'intentUnsure', descKey: 'intentUnsureDesc' },
]

export default function ConsultationRequestForm({
  initialIntent = null,
  initialFocus = null,
  initialGoal = null,
  initialReference = null,
  fromAssessment = false,
}: ConsultationRequestFormProps) {
  const t = useTranslations('consultationRequest')
  const locale = useLocale()
  const startAtStep2 = initialIntent && (initialIntent !== 'consulting' || !!initialFocus)
  const [step, setStep] = useState(startAtStep2 ? 2 : initialIntent ? 2 : 1)
  const [quickMode, setQuickMode] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<FormState>({
    ...initialState,
    intent: initialIntent ?? '',
    consultingFocus: initialFocus ?? '',
    goal: initialGoal ?? '',
  })

  const update = (patch: Partial<FormState>) => setForm((prev) => ({ ...prev, ...patch }))

  const canContinueStep1 = !!form.intent
  const canContinueStep2 = useMemo(() => {
    if (!form.goal.trim() || form.goal.trim().length < 5 || !form.timeline) return false
    if (form.intent === 'consulting') return !!form.consultingFocus
    if (form.intent === 'website') return !!form.websiteGoal && !!form.hasExistingSite
    if (form.intent === 'platform') return !!form.platformType
    return true
  }, [form])

  const canSubmitQuick =
    !!form.name.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
    form.goal.trim().length >= 5

  const canSubmit =
    !!form.name.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
    (quickMode ? canSubmitQuick : canContinueStep2)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    const submitIntent: ConsultationIntent = quickMode ? 'unsure' : (form.intent as ConsultationIntent)
    if (!quickMode && !form.intent) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/consultation-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent: submitIntent,
          goal: form.goal,
          timeline: quickMode ? 'exploring' : form.timeline,
          consultingFocus: form.consultingFocus || undefined,
          websiteGoal: form.websiteGoal || undefined,
          hasExistingSite: form.hasExistingSite || undefined,
          platformType: form.platformType || undefined,
          portfolioReference: initialReference || undefined,
          name: form.name,
          email: form.email,
          company: form.company || undefined,
          phone: form.phone || undefined,
          locale,
          website: form.website,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || t('errorMessage'))
        return
      }

      setSubmitted(true)
      toast.success(t('successMessage'))
    } catch {
      toast.error(t('errorMessage'))
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="animate-fade-in rounded-2xl border border-slate-200 bg-white p-8 lg:p-12 text-center shadow-card">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary-dark/10">
          <CheckCircle className="h-7 w-7 text-primary-dark" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-900">{t('successTitle')}</h2>
        <p className="mt-3 text-slate-600 max-w-md mx-auto">{t('successMessage')}</p>
        <p className="mt-4 text-sm text-slate-500 max-w-md mx-auto">{t('successPhone')}</p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="tel:+12898385868"
            className="inline-flex items-center justify-center rounded-lg bg-primary-dark hover:bg-primary-darker text-white font-semibold px-6 py-3 text-sm shadow-md transition-colors"
          >
            {t('successCallCta')}
          </a>
          <Link href="/services" className="link-action font-semibold">
            {t('successExplore')}
            <ArrowRight className="ml-2 h-4 w-4 inline" />
          </Link>
          <Link href="/" className="text-slate-600 font-medium hover:text-primary-dark transition-colors">
            {t('backHome')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        {!quickMode && (
          <>
            <p className="text-sm font-medium text-slate-500">
              {t('stepLabel', { current: step, total: 3 })}
            </p>
            <div className="mt-3 flex gap-2">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${n <= step ? 'bg-primary-dark' : 'bg-slate-200'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 lg:p-8">
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={(e) => update({ website: e.target.value })}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden
        />

        {quickMode ? (
          <div key="quick" className="animate-fade-in space-y-5">
            <h2 className="text-xl font-serif font-bold text-slate-900">{t('step3Title')}</h2>
            <p className="text-sm text-slate-600">{t('quickInquiryHint')}</p>
            <Field label={t('quickInquiryMessageLabel')} required>
              <textarea
                value={form.goal}
                onChange={(e) => update({ goal: e.target.value })}
                rows={4}
                placeholder={t('quickInquiryMessagePlaceholder')}
                className={`${inputClass} resize-y min-h-[112px]`}
                required
                minLength={5}
              />
            </Field>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label={t('nameLabel')} required>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update({ name: e.target.value })}
                  className={inputClass}
                  autoComplete="name"
                  required
                />
              </Field>
              <Field label={t('emailLabel')} required>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update({ email: e.target.value })}
                  className={inputClass}
                  autoComplete="email"
                  required
                />
              </Field>
            </div>
            <p className="text-xs text-slate-500">{t('privacyNote')}</p>
            <button
              type="button"
              onClick={() => setQuickMode(false)}
              className="text-sm text-primary font-medium hover:underline"
            >
              {t('back')}
            </button>
          </div>
        ) : (
          <>
        {step === 1 && (
            <div key="step1" className="animate-fade-in">
              <h2 className="text-xl font-serif font-bold text-slate-900">{t('step1Title')}</h2>
              <p className="mt-2 text-sm text-slate-600">{t('step1Hint')}</p>
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                {intentOptions.map((option) => {
                  const Icon = option.icon
                  const selected = form.intent === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => update({ intent: option.value })}
                      className={`text-left rounded-xl border p-4 transition-all duration-200 ${
                        selected
                          ? 'border-primary-dark bg-primary-dark/5 shadow-sm ring-1 ring-primary-dark/20'
                          : 'border-slate-200 hover:border-primary-dark/30 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                            selected ? 'bg-primary-dark/15 text-primary-dark' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{t(option.titleKey)}</p>
                          <p className="mt-0.5 text-sm text-slate-600">{t(option.descKey)}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div key="step2" className="animate-fade-in space-y-5">
              <h2 className="text-xl font-serif font-bold text-slate-900">{t('step2Title')}</h2>
              {fromAssessment && (
                <p className="rounded-lg border border-primary/20 bg-primary/[0.04] px-4 py-3 text-sm text-slate-700">
                  {t('assessmentPrefillNote')}
                </p>
              )}
              {initialReference && !fromAssessment && (
                <p className="rounded-lg border border-primary/20 bg-primary/[0.04] px-4 py-3 text-sm text-slate-700">
                  {t('portfolioReferenceNote')}
                </p>
              )}

              {form.intent === 'consulting' && (
                <Field label={t('consultingFocusLabel')} required>
                  <select
                    value={form.consultingFocus}
                    onChange={(e) => update({ consultingFocus: e.target.value })}
                    className={inputClass}
                    required
                  >
                    <option value="">{t('selectPlaceholder')}</option>
                    <option value="strategy">{t('focusStrategy')}</option>
                    <option value="operations">{t('focusOperations')}</option>
                    <option value="team">{t('focusTeam')}</option>
                    <option value="data">{t('focusData')}</option>
                    <option value="innovation">{t('focusInnovation')}</option>
                    <option value="other">{t('focusOther')}</option>
                  </select>
                </Field>
              )}

              {form.intent === 'website' && (
                <>
                  <Field label={t('websiteGoalLabel')} required>
                    <select
                      value={form.websiteGoal}
                      onChange={(e) => update({ websiteGoal: e.target.value })}
                      className={inputClass}
                      required
                    >
                      <option value="">{t('selectPlaceholder')}</option>
                      <option value="new">{t('websiteGoalNew')}</option>
                      <option value="redesign">{t('websiteGoalRedesign')}</option>
                      <option value="conversion">{t('websiteGoalConversion')}</option>
                    </select>
                  </Field>
                  <Field label={t('hasExistingSiteLabel')} required>
                    <div className="flex gap-3">
                      {(['yes', 'no'] as const).map((value) => (
                        <label
                          key={value}
                          className={`flex-1 cursor-pointer rounded-lg border px-4 py-3 text-center text-sm font-medium transition-colors ${
                            form.hasExistingSite === value
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-slate-200 text-slate-700 hover:border-primary/30'
                          }`}
                        >
                          <input
                            type="radio"
                            name="hasExistingSite"
                            value={value}
                            checked={form.hasExistingSite === value}
                            onChange={(e) => update({ hasExistingSite: e.target.value })}
                            className="sr-only"
                          />
                          {t(value === 'yes' ? 'yes' : 'no')}
                        </label>
                      ))}
                    </div>
                  </Field>
                </>
              )}

              {form.intent === 'platform' && (
                <Field label={t('platformTypeLabel')} required>
                  <select
                    value={form.platformType}
                    onChange={(e) => update({ platformType: e.target.value })}
                    className={inputClass}
                    required
                  >
                    <option value="">{t('selectPlaceholder')}</option>
                    <option value="internal">{t('platformInternal')}</option>
                    <option value="customer">{t('platformCustomer')}</option>
                    <option value="marketplace">{t('platformMarketplace')}</option>
                    <option value="other">{t('platformOther')}</option>
                  </select>
                </Field>
              )}

              <Field label={t('goalLabel')} required>
                <textarea
                  value={form.goal}
                  onChange={(e) => update({ goal: e.target.value })}
                  rows={4}
                  placeholder={t('goalPlaceholder')}
                  className={`${inputClass} resize-y min-h-[112px]`}
                  required
                  minLength={5}
                />
                <p className="mt-1.5 text-xs text-slate-500">{t('goalExample')}</p>
                <p className="mt-0.5 text-xs text-slate-400">{t('goalMinHint')}</p>
              </Field>

              <Field label={t('timelineLabel')} required>
                <select
                  value={form.timeline}
                  onChange={(e) => update({ timeline: e.target.value })}
                  className={inputClass}
                  required
                >
                  <option value="">{t('selectPlaceholder')}</option>
                  <option value="asap">{t('timelineAsap')}</option>
                  <option value="1to3">{t('timeline1to3')}</option>
                  <option value="3to6">{t('timeline3to6')}</option>
                  <option value="exploring">{t('timelineExploring')}</option>
                </select>
              </Field>
            </div>
          )}

          {step === 3 && (
            <div key="step3" className="animate-fade-in space-y-5">
              <h2 className="text-xl font-serif font-bold text-slate-900">{t('step3Title')}</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label={t('nameLabel')} required>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update({ name: e.target.value })}
                    className={inputClass}
                    autoComplete="name"
                    required
                  />
                </Field>
                <Field label={t('emailLabel')} required>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update({ email: e.target.value })}
                    className={inputClass}
                    autoComplete="email"
                    required
                  />
                </Field>
                <Field label={t('companyLabel')}>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => update({ company: e.target.value })}
                    className={inputClass}
                    autoComplete="organization"
                  />
                </Field>
                <Field label={t('phoneLabel')}>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update({ phone: e.target.value })}
                    className={inputClass}
                    autoComplete="tel"
                  />
                </Field>
              </div>
              <p className="text-xs text-slate-500">{t('privacyNote')}</p>
            </div>
          )}

          </>
        )}

        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          {!quickMode && step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex items-center justify-center text-slate-600 font-medium hover:text-primary transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('back')}
            </button>
          ) : (
            <span />
          )}

          {quickMode ? (
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors sm:ml-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('submitting')}
                </>
              ) : (
                t('submit')
              )}
            </button>
          ) : step < 3 ? (
            <button
              type="button"
              disabled={step === 1 ? !canContinueStep1 : !canContinueStep2}
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('continue')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('submitting')}
                </>
              ) : (
                t('submit')
              )}
            </button>
          )}
        </div>

        {!quickMode && step === 1 && (
          <p className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setQuickMode(true)}
              className="text-sm text-primary font-medium hover:underline"
            >
              {t('quickInquiryToggle')}
            </button>
          </p>
        )}
      </form>
    </div>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-primary ml-0.5">*</span>}
      </span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors'

export function resolveInitialIntent(
  intentParam: string | null,
  serviceParam: string | null,
): ConsultationIntent | null {
  return parseConsultationIntent(intentParam) ?? intentFromServiceParam(serviceParam)
}

export function resolveInitialFocus(focusParam: string | null): ConsultingFocus | null {
  return parseConsultingFocus(focusParam)
}
