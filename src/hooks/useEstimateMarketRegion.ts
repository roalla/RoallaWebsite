'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
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

export const ESTIMATE_DEFAULT_REGION = 'CA-ON'
const REGION_STORAGE_KEY = 'roalla-estimate-region'
const MARKET_STORAGE_KEY = 'roalla-estimate-market'

function readStored(key: string): string {
  if (typeof window === 'undefined') return ''
  try {
    return window.sessionStorage.getItem(key)?.trim() || ''
  } catch {
    return ''
  }
}

function writeStored(key: string, value: string) {
  if (typeof window === 'undefined') return
  try {
    if (value) window.sessionStorage.setItem(key, value)
    else window.sessionStorage.removeItem(key)
  } catch {
    /* ignore quota */
  }
}

export function useEstimateMarketRegion(locale: string, tool: EstimateToolKind) {
  const [marketId, setMarketIdState] = useState('')
  const [regionId, setRegionIdState] = useState(ESTIMATE_DEFAULT_REGION)
  const [attribution, setAttribution] = useState<AttributionBag>({})

  useEffect(() => {
    const params = readAttributionFromSearch(window.location.search)
    const search = new URLSearchParams(window.location.search)
    setAttribution(params)

    const urlMarket = resolveEstimateMarketId(
      locale,
      params.industry || params.icp || search.get('industry') || search.get('icp'),
    )
    const storedMarket = resolveEstimateMarketId(locale, readStored(MARKET_STORAGE_KEY))
    setMarketIdState(urlMarket || storedMarket || '')

    const urlRegion = params.region || search.get('region')
    const storedRegion = readStored(REGION_STORAGE_KEY)
    if (urlRegion && isEstimateRegionId(urlRegion)) {
      setRegionIdState(urlRegion)
      writeStored(REGION_STORAGE_KEY, urlRegion)
    } else if (storedRegion && isEstimateRegionId(storedRegion)) {
      setRegionIdState(storedRegion)
    } else {
      setRegionIdState(ESTIMATE_DEFAULT_REGION)
      writeStored(REGION_STORAGE_KEY, ESTIMATE_DEFAULT_REGION)
    }
  }, [locale])

  const setMarketId = useCallback((value: string) => {
    setMarketIdState(value)
    writeStored(MARKET_STORAGE_KEY, value)
  }, [])

  const setRegionId = useCallback((value: string) => {
    setRegionIdState(value)
    if (value && isEstimateRegionId(value)) writeStored(REGION_STORAGE_KEY, value)
    else writeStored(REGION_STORAGE_KEY, '')
  }, [])

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
    crossLinkQuery: attributionQuery,
  }
}
