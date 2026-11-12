'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  type AttributionBag,
  readAttributionFromSearch,
} from '@/lib/conversion-attribution'
import {
  buildEstimateContextSummary,
  getEstimateConsiderations,
  getEstimateMarketLabel,
  resolveEstimateMarketId,
  type EstimateToolKind,
} from '@/lib/estimate-market-context'
import { isEstimateRegionId } from '@/lib/estimate-regions'

export function useEstimateMarketRegion(locale: string, tool: EstimateToolKind) {
  const [marketId, setMarketId] = useState('')
  const [regionId, setRegionId] = useState('')
  const [attribution, setAttribution] = useState<AttributionBag>({})

  useEffect(() => {
    const params = readAttributionFromSearch(window.location.search)
    const search = new URLSearchParams(window.location.search)
    setAttribution(params)
    const resolved = resolveEstimateMarketId(
      locale,
      params.industry || params.icp || search.get('industry') || search.get('icp'),
    )
    if (resolved) setMarketId(resolved)
    const region = params.region || search.get('region')
    if (region && isEstimateRegionId(region)) setRegionId(region)
  }, [locale])

  const regionReady = Boolean(regionId && isEstimateRegionId(regionId))

  const considerations = useMemo(
    () =>
      getEstimateConsiderations({
        locale,
        marketId: marketId || null,
        regionId: regionId || null,
        tool,
      }),
    [locale, marketId, regionId, tool],
  )

  const contextSummary = useMemo(
    () =>
      buildEstimateContextSummary({
        locale,
        marketId: marketId || null,
        regionId: regionId || null,
      }),
    [locale, marketId, regionId],
  )

  const attributionQuery = useMemo(() => {
    const bag: Record<string, string> = { ...attribution }
    if (marketId) {
      bag.industry = marketId
      const label = getEstimateMarketLabel(locale, marketId)
      if (label) bag.icp = label
    }
    if (regionId) bag.region = regionId
    return bag
  }, [attribution, locale, marketId, regionId])

  return {
    marketId,
    setMarketId,
    regionId,
    setRegionId,
    regionReady,
    considerations,
    contextSummary,
    attributionQuery,
  }
}
