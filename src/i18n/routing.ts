import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/services': '/services',
    '/digital-creations': '/digital-creations',
    '/about': '/about',
    '/assessment': '/assessment',
    '/faq': '/faq',
    '/contact': '/contact',
    '/schedule': '/schedule',
  },
})
