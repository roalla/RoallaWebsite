'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import TextMarquee from '../motion/TextMarquee'

export function HomeServicesMarquee() {
  const t = useTranslations('home.marquee')

  return (
    <TextMarquee
      label={t('servicesLabel')}
      items={t.raw('servicesItems') as string[]}
      variant="light"
    />
  )
}

export function HomeDifferentiatorsMarquee() {
  const t = useTranslations('home.marquee')

  return (
    <TextMarquee
      label={t('differentiatorsLabel')}
      items={t.raw('differentiatorsItems') as string[]}
      variant="muted"
    />
  )
}
