import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/services': '/services',
    '/services/digital': '/services/digital',
    '/services/digital-events': '/services/digital-events',
    '/services/workshops': '/services/workshops',
    '/services/portfolio': '/services/portfolio',
    '/about': '/about',
    '/assessment': '/assessment',
    '/faq': '/faq',
    '/contact': '/contact',
    '/schedule': '/schedule',
    '/private/digital-events-playbook': '/private/digital-events-playbook',
  },
})
