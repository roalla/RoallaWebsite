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
    '/services/portfolio/[slug]': '/services/portfolio/[slug]',
    '/programs/business-enablement': '/programs/business-enablement',
    '/programs/workshops': '/programs/workshops',
    '/website-design': '/website-design',
    '/about': '/about',
    '/assessment': '/assessment',
    '/faq': '/faq',
    '/contact': '/contact',
    '/schedule': '/schedule',
    '/insights': '/insights',
    '/insights/[slug]': '/insights/[slug]',
    '/private/digital-events-playbook': '/private/digital-events-playbook',
  },
})
