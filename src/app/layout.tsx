import React from 'react'
import type { Metadata } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const merriweather = Merriweather({ 
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-merriweather',
  display: 'swap'
})

export const metadata: Metadata = {
  title: {
    default: 'Roalla Business Enablement Group | Strategic Business Consulting',
    template: '%s | Roalla Business Enablement Group'
  },
  description: 'Professional business consulting services helping companies grow, optimize operations, and achieve strategic goals. Expert guidance for business transformation and digital enablement.',
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
  metadataBase: new URL('https://roalla.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://roalla.com',
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
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Roalla Business Enablement Group",
  "url": "https://roalla.com",
  "logo": "https://roalla.com/logo.svg",
  "description": "Professional business consulting services helping companies grow, optimize operations, and achieve strategic goals.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "CA"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-289-838-5868",
    "contactType": "customer service",
    "email": "sales@roalla.com"
  },
  "sameAs": [
    "https://linkedin.com/company/roalla",
    "https://twitter.com/roalla"
  ],
  "serviceArea": {
    "@type": "Country",
    "name": "Canada"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Business Consulting Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Strategic Planning",
          "description": "Comprehensive business strategy development to align your vision with actionable plans for growth and success."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Business Optimization",
          "description": "Streamline operations, improve efficiency, and maximize profitability through data-driven optimization strategies."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Leadership Development",
          "description": "Build strong leadership teams and develop management skills to drive organizational success and employee engagement."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Growth Strategy",
          "description": "Identify and capitalize on growth opportunities through market expansion, product development, and strategic partnerships."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Innovation Consulting",
          "description": "Foster a culture of innovation and develop creative solutions to stay ahead in competitive markets."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Risk Management",
          "description": "Identify potential risks and develop comprehensive strategies to protect your business and ensure long-term stability."
        }
      }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Calendly embed script */}
        <script src="https://assets.calendly.com/assets/external/widget.js" async></script>
        
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#00b4c5" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        
        {/* Additional meta tags for better SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="author" content="Roalla Business Enablement Group" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Security headers - only those that can be set as meta tags */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* Performance optimizations */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
} 