import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/lib/use-theme'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Roalla Business Enablement Group - Business & Entrepreneur Solutions',
    template: '%s | Roalla Business Enablement Group'
  },
  description: 'Professional consulting services for businesses and entrepreneurs from Roalla Business Enablement Group. Strategic solutions, growth strategies, and expert guidance to help your business thrive.',
  keywords: ['consulting', 'business strategy', 'entrepreneur', 'growth', 'professional services', 'business solutions', 'business enablement'],
  authors: [{ name: 'Roalla Business Enablement Group' }],
  creator: 'Roalla Business Enablement Group',
  publisher: 'Roalla Business Enablement Group',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://roalla-business-enablement.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Roalla Business Enablement Group - Business & Entrepreneur Solutions',
    description: 'Professional consulting services for businesses and entrepreneurs from Roalla Business Enablement Group. Strategic solutions, growth strategies, and expert guidance.',
    url: 'https://roalla-business-enablement.com',
    siteName: 'Roalla Business Enablement Group',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Roalla Business Enablement Group',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Roalla Business Enablement Group - Business & Entrepreneur Solutions',
    description: 'Professional consulting services for businesses and entrepreneurs from Roalla Business Enablement Group.',
    images: ['/og-image.jpg'],
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
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth light">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log('🔧 Layout script running...');
              try {
                const theme = localStorage.getItem('vite-ui-theme') || 'light';
                console.log('📖 Found theme in localStorage:', theme);
                
                // Remove any existing theme classes
                document.documentElement.classList.remove('light', 'dark');
                
                // Add the current theme class
                document.documentElement.classList.add(theme);
                console.log('✅ Applied theme class:', theme);
                console.log('📋 HTML classes:', document.documentElement.classList.toString());
              } catch (e) {
                console.log('⚠️ Error reading localStorage:', e);
                // Ensure we have a theme class even if localStorage fails
                if (!document.documentElement.classList.contains('light') && 
                    !document.documentElement.classList.contains('dark')) {
                  document.documentElement.classList.add('light');
                }
                console.log('✅ Applied default theme: light');
              }
            `,
          }}
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#00b4c5" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
} 