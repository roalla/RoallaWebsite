export const ecosystemKeys = [
  'telarus',
  'fieldEffect',
  'zoom',
  'lunavi',
  'equinix',
  'terago',
  'thrive',
  'speechLogix',
] as const

export type EcosystemKey = (typeof ecosystemKeys)[number]

export type EcosystemLogo = {
  src: string
  width: number
  height: number
  className: string
}

export const ecosystemLogos: Partial<Record<EcosystemKey, EcosystemLogo>> = {
  telarus: {
    src: '/images/partners/telarus-logo.png',
    width: 160,
    height: 80,
    className: 'h-10 w-auto object-contain md:h-11',
  },
  zoom: {
    src: '/images/partners/zoom-logo.png',
    width: 160,
    height: 80,
    className: 'h-8 w-auto object-contain md:h-9',
  },
  lunavi: {
    src: '/images/partners/lunavi-logo.png',
    width: 200,
    height: 80,
    className: 'h-8 w-auto object-contain md:h-9',
  },
  equinix: {
    src: '/images/partners/equinix-logo.png',
    width: 160,
    height: 80,
    className: 'h-8 w-auto object-contain md:h-9',
  },
  terago: {
    src: '/images/partners/terago-logo.png',
    width: 200,
    height: 80,
    className: 'h-8 w-auto object-contain md:h-9',
  },
  thrive: {
    src: '/images/partners/thrive-logo.png',
    width: 160,
    height: 120,
    className: 'h-10 w-auto object-contain md:h-11',
  },
  speechLogix: {
    src: '/images/partners/speechlogix-logo.png',
    width: 220,
    height: 80,
    className: 'h-8 w-auto object-contain md:h-9',
  },
}

export type EcosystemCta =
  | { type: 'internal'; href: '/partners' }
  | { type: 'external'; href: string }

export const ecosystemCtas: Partial<Record<EcosystemKey, EcosystemCta>> = {
  telarus: { type: 'internal', href: '/partners' },
  fieldEffect: { type: 'external', href: 'https://fieldeffect.com/' },
  zoom: { type: 'external', href: 'https://www.zoom.com/' },
  lunavi: { type: 'external', href: 'https://www.lunavi.com/' },
  equinix: { type: 'external', href: 'https://www.equinix.com/' },
  terago: { type: 'external', href: 'https://terago.ca/' },
  thrive: { type: 'external', href: 'https://thrivenextgen.com/' },
  speechLogix: { type: 'external', href: 'https://speechlogix.com/' },
}
