import {
  ecosystemCtas,
  ecosystemDirectoryGroups,
  ecosystemLogos,
  type EcosystemKey,
  type EcosystemLogo,
} from '@/lib/technologyEcosystem'

export type PartnersDirectoryItem = {
  key: EcosystemKey
  name: string
  relationship: string
  description: string
  need: string
  wordmark: string
  logo: EcosystemLogo | null
  externalCta: { label: string; href: string } | null
  filterTags: string[]
}

function tagsFromNeed(need: string): string[] {
  return need
    .split(/,| and | et |·|&/i)
    .map((part) => part.replace(/\.$/, '').trim())
    .filter((part) => part.length > 2 && part.length < 42)
}

export function buildPartnersDirectoryItems(
  groupId: (typeof ecosystemDirectoryGroups)[number]['id'],
  tEco: (key: string) => string,
): PartnersDirectoryItem[] {
  const group = ecosystemDirectoryGroups.find((entry) => entry.id === groupId)
  if (!group) return []

  return (group.keys as readonly EcosystemKey[]).map((key) => {
    const cta = ecosystemCtas[key]
    const need = tEco(`${key}.need`)
    return {
      key,
      name: tEco(`${key}.name`),
      relationship: tEco(`${key}.relationship`),
      description: tEco(`${key}.description`),
      need,
      wordmark: tEco(`${key}.wordmark`),
      logo: ecosystemLogos[key] ?? null,
      externalCta:
        cta?.type === 'external' ? { label: tEco(`${key}.cta`), href: cta.href } : null,
      filterTags: tagsFromNeed(need),
    }
  })
}
