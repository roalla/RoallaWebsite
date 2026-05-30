const withNextIntl = require('next-intl/plugin')('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    const legacyAppRedirects = [
      // Auth & admin (removed features)
      { source: '/login', destination: '/en/contact', permanent: true },
      { source: '/login/:path*', destination: '/en/contact', permanent: true },
      { source: '/dashboard', destination: '/en/services', permanent: true },
      { source: '/profile', destination: '/en/contact', permanent: true },
      { source: '/auth/:path*', destination: '/en', permanent: true },
      { source: '/admin', destination: '/en', permanent: true },
      { source: '/admin/:path*', destination: '/en', permanent: true },
      // Resource hub
      { source: '/resources/request/:path*', destination: '/en/contact', permanent: true },
      { source: '/resources/request', destination: '/en/contact', permanent: true },
      { source: '/resources/portal', destination: '/en/services', permanent: true },
      { source: '/resources', destination: '/en/services', permanent: true },
      { source: '/resources/:path*', destination: '/en/services', permanent: true },
      // Trust centre
      { source: '/trust/:path*', destination: '/en/contact', permanent: true },
      { source: '/trust', destination: '/en/contact', permanent: true },
      // Org share links
      { source: '/p/:slug', destination: '/en', permanent: true },
      // Localized legacy routes
      { source: '/:locale(en|fr)/login/:path*', destination: '/:locale/contact', permanent: true },
      { source: '/:locale(en|fr)/login', destination: '/:locale/contact', permanent: true },
      { source: '/:locale(en|fr)/dashboard', destination: '/:locale/services', permanent: true },
      { source: '/:locale(en|fr)/profile', destination: '/:locale/contact', permanent: true },
      { source: '/:locale(en|fr)/auth/:path*', destination: '/:locale', permanent: true },
      { source: '/:locale(en|fr)/admin/:path*', destination: '/:locale', permanent: true },
      { source: '/:locale(en|fr)/admin', destination: '/:locale', permanent: true },
      { source: '/:locale(en|fr)/resources/request/:path*', destination: '/:locale/contact', permanent: true },
      { source: '/:locale(en|fr)/resources/request', destination: '/:locale/contact', permanent: true },
      { source: '/:locale(en|fr)/resources/portal', destination: '/:locale/services', permanent: true },
      { source: '/:locale(en|fr)/resources/:path*', destination: '/:locale/services', permanent: true },
      { source: '/:locale(en|fr)/resources', destination: '/:locale/services', permanent: true },
      { source: '/:locale(en|fr)/trust/:path*', destination: '/:locale/contact', permanent: true },
      { source: '/:locale(en|fr)/trust', destination: '/:locale/contact', permanent: true },
    ]

    return [
      ...legacyAppRedirects,
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'roalla.com' }],
        destination: 'https://www.roalla.com/:path*',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/favicon.svg',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }],
      },
      {
        source: '/favicon.ico',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }],
      },
      {
        source: '/apple-touch-icon.png',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://assets.calendly.com",
              "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
              "frame-src https://calendly.com https://www.youtube.com https://www.youtube-nocookie.com",
              "connect-src 'self' https://calendly.com https://assets.calendly.com",
              "img-src 'self' data: https: https://*.calendly.com",
              "font-src 'self'",
              "object-src 'none'",
            ].join("; ")
          }
        ],
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

module.exports = withNextIntl(nextConfig) 