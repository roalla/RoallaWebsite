import React from 'react'
import type { Metadata } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import './globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Providers from '@/components/Providers'
import ConditionalLayout from '@/components/ConditionalLayout'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const merriweather = Merriweather({ 
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-merriweather',
})

const siteUrl = 'https://www.roalla.com'
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

export const metadata: Metadata = {
  title: 'Roalla Business Enablement Group',
  description: 'Empowering your business for a digital-first world with expert consulting in strategy, technology, and operations.',
  keywords: [
    'business consulting',
    'strategic planning',
    'business optimization',
    'leadership development',
    'growth strategy',
    'innovation consulting',
    'risk management',
    'business enablement',
    'digital transformation',
    'operational efficiency'
  ],
  authors: [{ name: 'Roalla Business Enablement Group' }],
  creator: 'Roalla Business Enablement Group',
  publisher: 'Roalla Business Enablement Group',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Roalla Business Enablement Group',
    title: 'Roalla Business Enablement Group | Strategic Business Consulting',
    description: 'Professional business consulting services helping companies grow, optimize operations, and achieve strategic goals.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Roalla Business Enablement Group - Professional Business Consulting',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Roalla Business Enablement Group | Strategic Business Consulting',
    description: 'Professional business consulting services helping companies grow, optimize operations, and achieve strategic goals.',
    images: ['/og-image.jpg'],
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
  },
}

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${siteUrl}/#organization`,
    name: 'Roalla Business Enablement Group',
    url: siteUrl,
    logo: `${siteUrl}/logo.svg`,
    image: `${siteUrl}/og-image.jpg`,
    description:
      'Fractional COO and business consulting focused on strategic planning, process optimization, and measurable operational growth.',
    areaServed: 'Global',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-289-838-5868',
      contactType: 'sales',
      email: 'sales@roalla.com',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Toronto',
      addressRegion: 'ON',
      addressCountry: 'CA',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: 'Roalla Business Enablement Group',
    publisher: { '@id': `${siteUrl}/#organization` },
    inLanguage: ['en-CA', 'fr-CA'],
  },
]

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const messages = await getMessages()
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable} font-sans`}>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://assets.calendly.com" />
        
        {/* Calendly script */}
        <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
        
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Favicon and app icons - ?v=3 busts cache when you update the icon */}
        <link rel="icon" href="/favicon.svg?v=3" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico?v=3" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=3" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Theme color for mobile browsers - black background branding */}
        <meta name="theme-color" content="#000000" />
        
        {/* Additional meta tags for better SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="author" content="Roalla Business Enablement Group" />
        <meta name="robots" content="index, follow" />
        
        {/* Security headers - only those that can be set as meta tags */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* Performance optimizations */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <ConditionalLayout>{children}</ConditionalLayout>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  )
} 