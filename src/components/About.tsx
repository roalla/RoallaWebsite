'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  Award,
  BriefcaseBusiness,
  Building2,
  CheckCircle,
  Clock,
  DollarSign,
  GraduationCap,
  Heart,
  Layers3,
  Linkedin,
  Sparkles,
  Users,
  Wrench,
} from 'lucide-react'
import ScheduleButton from './ScheduleButton'
import Reveal from './motion/Reveal'
import { BrandJourneyTeaser } from './services/BrandJourneyTeaser'

const valueIcons = [CheckCircle, Heart, Clock, Award] as const
const proofIcons = [BriefcaseBusiness, Users, Layers3, DollarSign, Building2, Award] as const
const qualificationIcons = [GraduationCap, CheckCircle, Building2, Layers3, Wrench, Users] as const

const About = () => {
  const t = useTranslations('about')
  const values = [
    { title: t('excellence'), description: t('excellenceDesc'), icon: valueIcons[0] },
    { title: t('integrity'), description: t('integrityDesc'), icon: valueIcons[1] },
    { title: t('commitment'), description: t('commitmentDesc'), icon: valueIcons[2] },
    { title: t('innovation'), description: t('innovationDesc'), icon: valueIcons[3] },
  ]
  const proofPoints = proofIcons.map((icon, index) => ({
    value: t(`proof${index + 1}Value`),
    label: t(`proof${index + 1}Label`),
    icon,
  }))
  const qualifications = qualificationIcons.map((icon, index) => ({
    title: t(`qualification${index + 1}Title`),
    description: t(`qualification${index + 1}Desc`),
    icon,
  }))

  return (
    <section id="about" className="section-padding bg-white py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-slate-900 mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </Reveal>

        <article aria-labelledby="founder-heading" className="mb-16 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-card">
          <div className="grid lg:grid-cols-[0.7fr_1.3fr]">
            <div className="flex min-h-72 items-center justify-center bg-gradient-to-br from-primary-dark to-primary-darker p-10 text-center text-white">
              <div>
                <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-white/30 bg-white/10">
                  <Users aria-hidden="true" className="h-12 w-12" />
                </div>
                <h2 id="founder-heading" className="font-serif text-3xl font-extrabold">{t('founderName')}</h2>
                <p className="mt-2 font-semibold text-white/95">{t('founderRole')}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/80">{t('founderTagline')}</p>
              </div>
            </div>
            <div className="p-8 md:p-10">
              <p className="text-lg leading-relaxed text-slate-700">{t('founderBio1')}</p>
              <p className="mt-4 leading-relaxed text-slate-600">{t('founderBio2')}</p>
              <p className="mt-4 leading-relaxed text-slate-600">{t('founderBio3')}</p>
              <p className="mt-4 leading-relaxed text-slate-600">{t('founderBio4')}</p>
              <p className="mt-4 leading-relaxed text-slate-600">{t('founderBio5')}</p>
            </div>
          </div>
        </article>

        <section aria-labelledby="experience-heading" className="mb-16">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-dark">{t('proofEyebrow')}</p>
            <h2 id="experience-heading" className="mt-2 font-serif text-3xl font-extrabold text-slate-900">{t('proofTitle')}</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {proofPoints.map((proof, index) => (
              <Reveal key={proof.label} delayMs={index * 70} className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
                <proof.icon aria-hidden="true" className="mb-4 h-7 w-7 text-primary-dark" />
                <p className="text-3xl font-extrabold text-slate-900">{proof.value}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{proof.label}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <aside className="mb-16 rounded-2xl border border-primary/20 bg-primary/5 p-8 md:p-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <Sparkles aria-hidden="true" className="h-9 w-9 shrink-0 text-primary-dark" />
            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">{t('founderCommitmentTitle')}</h2>
              <p className="mt-3 text-lg leading-relaxed text-slate-700">{t('founderCommitmentDesc')}</p>
            </div>
          </div>
        </aside>

        <section aria-labelledby="recognition-heading" className="mb-16 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <Award aria-hidden="true" className="mb-5 h-12 w-12 text-brand-gold-dark" />
            <h2 id="recognition-heading" className="font-serif text-3xl font-extrabold text-slate-900">{t('recognitionTitle')}</h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-slate-700">{t('recognitionDesc1')}</p>
            <p className="mt-4 leading-relaxed text-slate-600">{t('recognitionDesc2')}</p>
          </div>
        </section>

        <section aria-labelledby="qualifications-heading" className="mb-16">
          <div className="mb-8 text-center">
            <h2 id="qualifications-heading" className="font-serif text-3xl font-extrabold text-slate-900">{t('qualificationsTitle')}</h2>
            <p className="mx-auto mt-3 max-w-3xl text-slate-600">{t('qualificationsSubtitle')}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {qualifications.map((qualification, index) => (
              <Reveal key={qualification.title} delayMs={index * 70} className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                <qualification.icon aria-hidden="true" className="mb-4 h-7 w-7 text-primary-dark" />
                <h3 className="font-bold text-slate-900">{qualification.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{qualification.description}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a href="https://www.linkedin.com/in/stevenrobin/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-primary-dark underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              <Linkedin aria-hidden="true" className="h-5 w-5" />
              {t('linkedinCta')}
            </a>
          </div>
        </section>

        <BrandJourneyTeaser
          titleKey="aboutJourneyTitle"
          descKey="aboutJourneyDesc"
          ctaKey="aboutJourneyCta"
          className="mb-16 max-w-4xl mx-auto"
        />

        <section aria-labelledby="values-heading" className="mb-16">
          <h2 id="values-heading" className="sr-only">{t('valuesTitle')}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Reveal
                key={value.title}
                delayMs={index * 100}
                className="bg-white rounded-xl p-6 shadow-card border border-slate-200 hover:shadow-card-hover hover:border-primary/25 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-lg">{value.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{value.description}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <div className="bg-gradient-to-r from-primary-dark via-primary-dark to-primary-darker rounded-2xl p-10 md:p-16 text-center shadow-2xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('missionTitle')}
          </h2>
          <p className="text-xl text-white/95 max-w-4xl mx-auto leading-relaxed">
            &quot;{t('missionQuote')}&quot;
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-8 py-12 md:px-14 text-center">
          <h2 className="text-2xl font-serif font-bold text-white">{t('ctaTitle')}</h2>
          <p className="mt-3 text-slate-300 max-w-xl mx-auto">{t('ctaSubtitle')}</p>
          <div className="mt-8">
            <ScheduleButton variant="secondary" size="lg" className="bg-white text-primary-dark hover:bg-slate-100 border-0">
              {t('ctaButton')}
            </ScheduleButton>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-slate-400">
          {t('employeeHubLine')}{' '}
          <Link href="/hub/login" className="text-slate-500 hover:text-primary underline-offset-2 hover:underline">
            {t('employeeHubLink')}
          </Link>
        </p>
      </div>
    </section>
  )
}

export default About
