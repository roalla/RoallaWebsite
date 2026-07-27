export const SITE_URL = 'https://www.roalla.com'
export const OG_IMAGE = '/og-image.jpg'
export const OG_IMAGE_ALT = 'Roalla Business Enablement Group — Digital Enablement'

/** Client Portal (engagements) — separate from employee /hub login on this site. */
export const CLIENT_PORTAL_URL =
  process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL?.trim() || 'https://portal.roalla.com'

export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/company/102042431/',
  youtube: 'https://www.youtube.com/@RoallaGroup',
} as const

export const CONTACT = {
  email: 'sales@roalla.com',
  phone: '+1-289-838-5868',
} as const
