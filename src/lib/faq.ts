/** All FAQ item indices rendered on /faq and in FAQPage JSON-LD. */
export const FAQ_INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19] as const

export type FaqIndex = (typeof FAQ_INDICES)[number]
