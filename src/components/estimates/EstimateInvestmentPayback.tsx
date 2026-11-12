'use client'

import React, { useEffect, useId, useMemo, useRef, useState } from 'react'

export type EstimatePaybackPlanning = {
  value: number
  paybackCount: number | null
}

type EstimateInvestmentPaybackProps = {
  locale: string
  total: number
  title: string
  lead: string
  inputLabel: string
  softClose: string
  formatResult: (args: {
    totalLabel: string
    valueLabel: string
    paybackCount: number
  }) => string
  defaultValue?: number
  onPlanningChange?: (planning: EstimatePaybackPlanning) => void
}

function formatCad(amount: number, locale: string) {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-CA' : 'en-CA', {
    style: 'currency',
    currency: 'CAD',
  })
    .format(amount)
    .replace(/[\u00a0\u202f\u2009]/g, ' ')
}

export default function EstimateInvestmentPayback({
  locale,
  total,
  title,
  lead,
  inputLabel,
  softClose,
  formatResult,
  defaultValue = 2500,
  onPlanningChange,
}: EstimateInvestmentPaybackProps) {
  const inputId = useId()
  const [rawValue, setRawValue] = useState(String(defaultValue))
  const onPlanningChangeRef = useRef(onPlanningChange)
  onPlanningChangeRef.current = onPlanningChange
  const money = useMemo(() => (amount: number) => formatCad(amount, locale), [locale])

  const value = useMemo(() => {
    const parsed = Number.parseFloat(rawValue.replace(/,/g, ''))
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
  }, [rawValue])

  const paybackCount = value > 0 && total > 0 ? Math.ceil(total / value) : null

  useEffect(() => {
    onPlanningChangeRef.current?.({ value, paybackCount })
  }, [value, paybackCount])

  const totalLabel = money(total)
  const valueLabel = value > 0 ? money(value) : money(0)

  return (
    <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-bold text-slate-950">{title}</p>
      <p className="mt-2 text-xs leading-5 text-slate-600">{lead}</p>
      <label htmlFor={inputId} className="mt-4 block text-xs font-semibold text-slate-800">
        {inputLabel}
      </label>
      <input
        id={inputId}
        type="number"
        inputMode="decimal"
        min={1}
        step={100}
        value={rawValue}
        onChange={(event) => setRawValue(event.target.value)}
        className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm tabular-nums text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      {paybackCount !== null ? (
        <p className="mt-3 text-sm font-medium leading-6 text-slate-900">
          {formatResult({ totalLabel, valueLabel, paybackCount })}
        </p>
      ) : null}
      <p className="mt-3 text-xs leading-5 text-slate-600">{softClose}</p>
    </div>
  )
}
