'use client'

import { Bot, Headphones, PhoneCall, ArrowRight } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Reveal from '@/components/motion/Reveal'

export default function HomeCommunicationsFeature() {
  const fr = useLocale() === 'fr'
  const content = fr
    ? {
        eyebrow: 'Nouveau parcours de solution',
        title: 'Reliez la téléphonie, le centre de contact et les employés IA.',
        body: 'Commencez par votre enjeu d’affaires, puis concevez les canaux, les relais humains, les intégrations et la transition dans un même plan.',
        cta: 'Explorer les communications unifiées, centres de contact et employés IA',
        items: ['Communications unifiées', 'Centre de contact', 'Employés IA'],
      }
    : {
        eyebrow: 'New solution pathway',
        title: 'Connect business calling, the contact centre and AI Employees.',
        body: 'Start with the business challenge, then design channels, human handoffs, integrations and the transition in one accountable plan.',
        cta: 'Explore Unified Communications, Contact Centres & AI Employees',
        items: ['Unified communications', 'Contact centre', 'AI Employees'],
      }
  const icons = [PhoneCall, Headphones, Bot]

  return (
    <section className="relative overflow-hidden bg-slate-950 py-14 text-white lg:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(0,180,197,.22),transparent_30%),radial-gradient(circle_at_12%_100%,rgba(242,193,78,.12),transparent_28%)]" aria-hidden />
      <div className="container relative mx-auto grid gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">{content.eyebrow}</p>
          <h2 className="mt-3 max-w-3xl font-serif text-3xl font-bold text-white md:text-4xl">{content.title}</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">{content.body}</p>
          <Link href="/services/unified-communications-contact-centres-ai-employees" className="mt-6 inline-flex min-h-12 items-center rounded-lg bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 hover:bg-brand-gold-light">
            {content.cta}<ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </Reveal>
        <Reveal className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {content.items.map((item, index) => {
            const Icon = icons[index]
            return <div key={item} className="flex min-w-56 items-center gap-3 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3"><Icon className="h-5 w-5 text-cyan-300" aria-hidden /><span className="text-sm font-semibold text-white">{item}</span></div>
          })}
        </Reveal>
      </div>
    </section>
  )
}

