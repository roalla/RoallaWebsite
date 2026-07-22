import React from 'react'
import type { Metadata } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import './globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import Providers from '@/components/Providers'
import ConditionalLayout from '@/components/ConditionalLayout'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import JsonLd from '@/components/JsonLd'
import { organizationJsonLd, websiteJsonLd } from '@/lib/structured-data'
import { OG_IMAGE, OG_IMAGE_ALT, SITE_URL } from '@/lib/site'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-merriweather',
})

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION

export const metadata: Metadata = {
  title: 'Roalla Business Enablement Group',
  description:
    'ROALLA helps organizations assess, build, optimize, and evolve digital assets that drive visibility, revenue, operational efficiency, and customer value.',
  keywords: [
    'website development',
    'digital product development',
    'client portal development',
    'workflow automation',
    'system integration',
    'AI workflow support',
    'digital events',
    'business workshops',
    'bilingual websites',
    'e-commerce websites',
    'digital transformation',
    'business website design',
    'custom software development',
    'digital enablement',
    'digital visibility optimization',
    'technical SEO',
    'structured data',
  ],
  authors: [{ name: 'Roalla Business Enablement Group' }],
  creator: 'Roalla Business Enablement Group',
  publisher: 'Roalla Business Enablement Group',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/en',
    languages: {
      en: '/en',
      fr: '/fr',
      'x-default': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: `${SITE_URL}/en`,
    siteName: 'Roalla Business Enablement Group',
    title: 'Roalla Business Enablement Group | Digital Assets for Business Value',
    description:
      'Websites, digital products, automation, AI, and visibility optimization designed to increase revenue, customer value, and operational capability.',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Roalla Business Enablement Group | Digital Assets for Business Value',
    description:
      'Websites, digital products, automation, AI, and visibility optimization designed to increase revenue, customer value, and operational capability.',
    images: [OG_IMAGE],
    creator: '@roalla',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: googleVerification,
    other: bingVerification ? { 'msvalidate.01': bingVerification } : undefined,
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const messages = await getMessages()
  const locale = await getLocale()

  return (
    <html lang={locale} className={`${inter.variable} ${merriweather.variable} font-sans`}>
      <head>
        <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
        <link rel="icon" href="/favicon.svg?v=3" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico?v=3" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=3" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="alternate" type="application/rss+xml" title="Roalla Insights (English)" href="/feed.xml" />
        <link rel="alternate" type="application/rss+xml" title="Roalla Insights (Français)" href="/feed.xml?locale=fr" hrefLang="fr" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="author" content="Roalla Business Enablement Group" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <GoogleAnalytics />
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <ConditionalLayout>{children}</ConditionalLayout>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  )
}
