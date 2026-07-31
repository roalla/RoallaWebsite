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
  Quote,
  Sparkles,
  Users,
  Wrench,
} from 'lucide-react'
import ScheduleButton from './ScheduleButton'
import Reveal from './motion/Reveal'
import CountUpNumber from './about/CountUpNumber'
import FounderPortrait from './about/FounderPortrait'
import { BrandJourneyTeaser } from './services/BrandJourneyTeaser'

const valueIcons = [CheckCircle, Heart, Clock, Award] as const
const proofIcons = [BriefcaseBusiness, Users, Layers3, DollarSign, Building2, Award] as const
const qualificationIcons = [GraduationCap, CheckCircle, Building2, Layers3, Wrench, Users] as const

const LINKEDIN_URL = 'https://www.linkedin.com/in/stevenrobin/'

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
  const storyParagraphs = [t('founderBio2'), t('founderBio3'), t('founderBio4'), t('founderBio5')]

  return (
    <div id="about">
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="about-aurora absolute -left-32 -top-40 h-[34rem] w-[34rem] rounded-full bg-primary/25 blur-3xl" />
          <div className="about-aurora about-aurora-slow absolute -bottom-48 -right-24 h-[36rem] w-[36rem] rounded-full bg-brand-gold/10 blur-3xl" />
          <div className="about-aurora about-aurora-offset absolute left-1/2 top-1/4 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary-dark/25 blur-3xl" />
          <div className="about-grid absolute inset-0" />
        </div>

        <div className="container mx-auto px-4 pb-28 pt-14 sm:px-6 lg:px-8 lg:pb-32 lg:pt-20">
          <Reveal when="mount" className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary-light backdrop-blur">
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
              {t('heroBadge')}
            </span>
            <h1 className="about-shimmer-text mt-6 font-serif text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
              {t('title')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
              {t('subtitle')}
            </p>
          </Reveal>

          <div className="mt-16 grid items-center gap-12 lg:mt-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal when="mount" delayMs={120}>
              <FounderPortrait name={t('founderName')} alt={t('founderPhotoAlt')} />
            </Reveal>

            <Reveal when="mount" delayMs={220} as="article" aria-labelledby="founder-heading">
              <h2 id="founder-heading" className="font-serif text-3xl font-extrabold text-white md:text-4xl">
                {t('founderName')}
              </h2>
              <p className="mt-2 text-lg font-semibold text-primary-light">{t('founderRole')}</p>
              <div
                aria-hidden="true"
                className="about-rule mt-5 h-px w-28 bg-gradient-to-r from-primary via-brand-gold to-transparent"
              />
              <p className="mt-5 text-base leading-relaxed text-slate-300 md:text-lg">{t('founderTagline')}</p>
              <p className="mt-5 leading-relaxed text-slate-400">{t('founderBio1')}</p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <ScheduleButton
                  variant="secondary"
                  className="border-0 bg-white text-primary-dark hover:bg-slate-100"
                >
                  {t('ctaButton')}
                </ScheduleButton>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('linkedinCta')}
                  className="group inline-flex items-center gap-2 rounded-lg border border-white/25 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-primary hover:bg-white/5"
                >
                  <Linkedin
                    aria-hidden="true"
                    className="h-5 w-5 transition-transform duration-300 motion-safe:group-hover:scale-110"
                  />
                  LinkedIn
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="experience-heading" className="bg-white py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-dark">{t('proofEyebrow')}</p>
            <h2
              id="experience-heading"
              className="mt-3 font-serif text-3xl font-extrabold text-slate-900 md:text-4xl"
            >
              {t('proofTitle')}
            </h2>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {proofPoints.map((proof, index) => (
              <Reveal
                key={proof.label}
                delayMs={index * 80}
                className="about-card about-glow-border group relative rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-7 shadow-card hover:shadow-card-hover"
              >
                <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary-dark transition-transform duration-300 motion-safe:group-hover:scale-110">
                  <proof.icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <CountUpNumber
                  value={proof.value}
                  className="block font-serif text-4xl font-extrabold text-slate-900"
                />
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{proof.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="story-heading" className="relative bg-slate-50 py-20 lg:py-24">
        <div className="section-divider" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <Reveal className="text-center">
              <h2 id="story-heading" className="font-serif text-3xl font-extrabold text-slate-900 md:text-4xl">
                {t('storyTitle')}
              </h2>
            </Reveal>

            <div className="relative mt-12 space-y-8 border-l-2 border-slate-200 pl-8">
              {storyParagraphs.map((paragraph, index) => (
                <Reveal key={paragraph.slice(0, 40)} delayMs={index * 90} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[2.3rem] top-2 h-3.5 w-3.5 rounded-full border-2 border-white bg-primary shadow-sm"
                  />
                  <p className="leading-relaxed text-slate-700">{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="about-glow-border relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] via-white to-brand-gold/[0.07] p-8 shadow-card md:p-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary-dark">
                <Sparkles aria-hidden="true" className="h-7 w-7" />
              </span>
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900 md:text-3xl">
                  {t('founderCommitmentTitle')}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-slate-700">{t('founderCommitmentDesc')}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="recognition-heading" className="bg-white pb-20 lg:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-10 rounded-3xl border border-amber-200/70 bg-gradient-to-br from-amber-50 via-white to-white p-8 shadow-card md:p-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
            <Reveal>
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gold/20 text-brand-gold-dark">
                <Award aria-hidden="true" className="h-9 w-9" />
              </span>
              <h2
                id="recognition-heading"
                className="mt-5 font-serif text-3xl font-extrabold text-slate-900"
              >
                {t('recognitionTitle')}
              </h2>
            </Reveal>
            <Reveal delayMs={120}>
              <p className="text-lg leading-relaxed text-slate-700">{t('recognitionDesc1')}</p>
              <p className="mt-4 leading-relaxed text-slate-600">{t('recognitionDesc2')}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="qualifications-heading" className="relative bg-slate-50 py-20 lg:py-24">
        <div className="section-divider" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12 text-center">
            <h2
              id="qualifications-heading"
              className="font-serif text-3xl font-extrabold text-slate-900 md:text-4xl"
            >
              {t('qualificationsTitle')}
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-slate-600">{t('qualificationsSubtitle')}</p>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {qualifications.map((qualification, index) => (
              <Reveal
                key={qualification.title}
                delayMs={index * 70}
                className="about-card about-glow-border group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-card hover:shadow-card-hover"
              >
                <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary-dark transition-transform duration-300 motion-safe:group-hover:scale-110">
                  <qualification.icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <h3 className="font-bold text-slate-900">{qualification.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{qualification.description}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delayMs={220} className="mt-10 text-center">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-primary-dark underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <Linkedin aria-hidden="true" className="h-5 w-5" />
              {t('linkedinCta')}
            </a>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <BrandJourneyTeaser
            titleKey="aboutJourneyTitle"
            descKey="aboutJourneyDesc"
            ctaKey="aboutJourneyCta"
            className="mx-auto mb-16 max-w-4xl"
          />

          <section aria-labelledby="values-heading">
            <Reveal className="mb-12 text-center">
              <h2 id="values-heading" className="font-serif text-3xl font-extrabold text-slate-900 md:text-4xl">
                {t('valuesTitle')}
              </h2>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <Reveal
                  key={value.title}
                  delayMs={index * 90}
                  className="about-card about-glow-border group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-card hover:shadow-card-hover"
                >
                  <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 motion-safe:group-hover:scale-110">
                    <value.icon aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <h3 className="mb-2 text-lg font-bold text-slate-900">{value.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{value.description}</p>
                </Reveal>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-slate-950 py-20 lg:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="about-aurora absolute -left-24 top-0 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
          <div className="about-aurora about-aurora-slow absolute -right-16 bottom-0 h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl" />
          <div className="about-grid absolute inset-0" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-4xl text-center">
            <Quote aria-hidden="true" className="mx-auto h-12 w-12 text-primary/60" />
            <h2 className="mt-6 font-serif text-3xl font-extrabold text-white md:text-4xl">{t('missionTitle')}</h2>
            <p className="mt-8 font-serif text-xl leading-relaxed text-slate-200 md:text-2xl">
              &ldquo;{t('missionQuote')}&rdquo;
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="relative isolate mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary-dark via-primary-dark to-primary-darker px-8 py-14 text-center shadow-2xl md:px-14">
            <div
              aria-hidden="true"
              className="about-aurora pointer-events-none absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-brand-gold/20 blur-3xl"
            />
            <h2 className="font-serif text-2xl font-bold text-white md:text-3xl">{t('ctaTitle')}</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/90">{t('ctaSubtitle')}</p>
            <div className="mt-8">
              <ScheduleButton
                variant="secondary"
                size="lg"
                className="border-0 bg-white text-primary-dark hover:bg-slate-100"
              >
                {t('ctaButton')}
              </ScheduleButton>
            </div>
          </Reveal>

          <p className="mt-10 text-center text-xs text-slate-400">
            {t('employeeHubLine')}{' '}
            <Link
              href="/hub/login"
              className="text-slate-500 underline-offset-2 hover:text-primary hover:underline"
            >
              {t('employeeHubLink')}
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}

export default About
