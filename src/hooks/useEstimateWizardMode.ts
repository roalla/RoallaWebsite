'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  type EstimateWizardMode,
  type EstimateWizardTool,
  readStoredWizardMode,
  resolveEstimateWizardMode,
  writeStoredWizardMode,
} from '@/lib/estimate-wizard-mode'

export function useEstimateWizardMode(tool: EstimateWizardTool) {
  const [mode, setModeState] = useState<EstimateWizardMode>('form')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const resolved = resolveEstimateWizardMode(window.location.search, readStoredWizardMode(tool))
    setModeState(resolved)
    writeStoredWizardMode(tool, resolved)
    setReady(true)
  }, [tool])

  const setMode = useCallback(
    (next: EstimateWizardMode) => {
      setModeState(next)
      writeStoredWizardMode(tool, next)
    },
    [tool],
  )

  const toggleMode = useCallback(() => {
    setMode(mode === 'wizard' ? 'form' : 'wizard')
  }, [mode, setMode])

  return { mode, setMode, toggleMode, ready }
}
