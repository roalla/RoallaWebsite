import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/services': '/services',
    '/resources': '/resources',
    '/resources/request': '/resources/request',
    '/resources/request/complete': '/resources/request/complete',
    '/resources/portal': '/resources/portal',
    '/digital-creations': '/digital-creations',
    '/about': '/about',
    '/assessment': '/assessment',
    '/faq': '/faq',
    '/contact': '/contact',
    '/trust': '/trust',
    '/schedule': '/schedule',
    '/login': '/login',
  },
})
