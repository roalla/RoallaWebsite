import React from 'react'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import globalCss from './globals.css?inline'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import Providers from '@/components/Providers'
import ConditionalLayout from '@/components/ConditionalLayout'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import JsonLd from '@/components/JsonLd'
import { getHeaderInsightSlugs } from '@/lib/header-insights-store'
import { organizationJsonLd, websiteJsonLd } from '@/lib/structured-data'
import { OG_IMAGE, OG_IMAGE_ALT, SITE_URL } from '@/lib/site'
import { trustedTypesBootstrap } from '@/lib/security-headers'

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION

export const metadata: Metadata = {
  title: {
    default: 'Websites, AI Agents & Digital Enablement | ROALLA',
    template: '%s',
  },
  description:
    'ROALLA in Burlington, Ontario builds websites, AI agents, automation, and SEO for Canadian organizations. Outcome-led delivery. Reply in one business day.',
  keywords: [
    'business website design Canada',
    'website design Burlington',
    'AI agents for business',
    'workflow automation',
    'SEO services Canada',
    'answer engine optimization',
    'cybersecurity compliance Canada',
    'digital enablement',
    'custom business apps',
    'client portal development',
    'bilingual websites',
    'team workshops Burlington',
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
    title: 'Websites, AI Agents & Digital Enablement | ROALLA',
    description:
      'ROALLA in Burlington, Ontario builds websites, AI agents, automation, and SEO for Canadian organizations.',
    images: [
      {
        url: OG_IMAGE,
        width: 1440,
        height: 754,
        alt: OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Websites, AI Agents & Digital Enablement | ROALLA',
    description:
      'ROALLA in Burlington, Ontario builds websites, AI agents, automation, and SEO for Canadian organizations.',
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
  const featuredInsightSlugs = await getHeaderInsightSlugs()
  const requestHeaders = await headers()
  const nonce = requestHeaders.get('x-nonce') ?? undefined

  return (
    <html lang={locale} className="font-sans">
      <head>
        <link
          rel="preload"
          as="font"
          href="/fonts/sora-latin.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {locale === 'fr' ? (
          <link
            rel="preload"
            as="font"
            href="/fonts/sora-latin-ext.woff2"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ) : null}
        <link
          rel="preload"
          as="font"
          href="/fonts/figtree-latin.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <style dangerouslySetInnerHTML={{ __html: globalCss }} />
        <script nonce={nonce} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: trustedTypesBootstrap }} />
        <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
        <link rel="icon" href="/favicon.svg?v=4" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico?v=4" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=4" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="describedby" href="/llms.txt" type="text/plain" title="LLM guidance for Roalla" />
        <link rel="alternate" type="application/rss+xml" title="Roalla Insights (English)" href="/feed.xml" />
        <link rel="alternate" type="application/rss+xml" title="Roalla Insights (Français)" href="/feed.xml?locale=fr" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="author" content="Roalla Business Enablement Group" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      </head>
      <body className="antialiased">
        <GoogleAnalytics />
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <ConditionalLayout featuredInsightSlugs={featuredInsightSlugs}>{children}</ConditionalLayout>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  )
}
