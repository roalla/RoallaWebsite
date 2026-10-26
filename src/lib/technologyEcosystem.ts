export const ecosystemKeys = [
  'telarus',
  'fieldEffect',
  'zoom',
  'dialpad',
  'polyai',
  'speechLogix',
  'lunavi',
  'equinix',
  'terago',
  'thrive',
] as const

export type EcosystemKey = (typeof ecosystemKeys)[number]

export const ecosystemDirectoryGroups = [
  {
    id: 'technology-providers',
    titleKey: 'technologyProvidersTitle',
    descriptionKey: 'technologyProvidersDescription',
    keys: [
      'fieldEffect',
      'zoom',
      'dialpad',
      'polyai',
      'speechLogix',
      'equinix',
      'terago',
      'lunavi',
      'thrive',
    ],
  },
  {
    id: 'delivery-platforms',
    titleKey: 'deliveryPlatformsTitle',
    descriptionKey: 'deliveryPlatformsDescription',
    keys: ['lunavi', 'thrive', 'speechLogix'],
  },
] as const satisfies readonly {
  id: 'technology-providers' | 'delivery-platforms'
  titleKey: 'technologyProvidersTitle' | 'deliveryPlatformsTitle'
  descriptionKey: 'technologyProvidersDescription' | 'deliveryPlatformsDescription'
  keys: readonly EcosystemKey[]
}[]

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
  fieldEffect: {
    src: '/images/partners/fieldeffect-logo.png',
    width: 250,
    height: 56,
    className: 'h-8 w-auto max-w-full object-contain md:h-9',
  },
  zoom: {
    src: '/images/partners/zoom-logo.png',
    width: 160,
    height: 80,
    className: 'h-8 w-auto object-contain md:h-9',
  },
  dialpad: {
    src: '/images/partners/dialpad-logo.png',
    width: 480,
    height: 120,
    className: 'h-8 w-auto max-w-full object-contain md:h-9',
  },
  polyai: {
    src: '/images/partners/polyai-logo.png',
    width: 480,
    height: 120,
    className: 'h-8 w-auto max-w-full object-contain md:h-9',
  },
  lunavi: {
    src: '/images/partners/lunavi-logo.png',
    width: 640,
    height: 187,
    className: 'h-8 w-auto max-w-full object-contain md:h-9',
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
    width: 640,
    height: 116,
    className: 'h-8 w-auto max-w-full object-contain md:h-9',
  },
}

export type EcosystemCta =
  | { type: 'internal'; href: '/partners/strategic-relationships' }
  | { type: 'external'; href: string }

export const ecosystemCtas: Partial<Record<EcosystemKey, EcosystemCta>> = {
  telarus: { type: 'internal', href: '/partners/strategic-relationships' },
  fieldEffect: { type: 'external', href: 'https://fieldeffect.com/' },
  zoom: { type: 'external', href: 'https://www.zoom.com/' },
  dialpad: { type: 'external', href: 'https://www.dialpad.com/' },
  polyai: { type: 'external', href: 'https://poly.ai/' },
  lunavi: { type: 'external', href: 'https://www.lunavi.com/' },
  equinix: { type: 'external', href: 'https://www.equinix.com/' },
  terago: { type: 'external', href: 'https://terago.ca/' },
  thrive: { type: 'external', href: 'https://thrivenextgen.com/' },
  speechLogix: { type: 'external', href: 'https://speechlogix.com/' },
}
