export const REQUEST_REASON_OPTIONS = [
  { value: 'partner', label: 'I am a Partner', requiresCode: true },
  { value: 'completed-course', label: 'I Completed a Course', requiresCode: true },
  { value: 'business-customer', label: 'I am a Business Customer', requiresCode: true },
  { value: 'interested-services', label: 'I am Interested in your services', requiresCode: false },
  { value: 'interested-content', label: 'Just Interested in what you have', requiresCode: false },
  { value: 'browsing', label: 'Just browsing', requiresCode: false },
] as const

export type RequestReasonValue = (typeof REQUEST_REASON_OPTIONS)[number]['value']

const REQUEST_REASON_LABEL_MAP: Record<RequestReasonValue, string> = REQUEST_REASON_OPTIONS.reduce(
  (acc, option) => {
    acc[option.value] = option.label
    return acc
  },
  {} as Record<RequestReasonValue, string>
)

const REQUEST_REASON_CODE_REQUIRED = new Set<RequestReasonValue>(
  REQUEST_REASON_OPTIONS.filter((option) => option.requiresCode).map((option) => option.value)
)

export function isValidRequestReason(value: string): value is RequestReasonValue {
  return value in REQUEST_REASON_LABEL_MAP
}

export function requestReasonLabel(value: RequestReasonValue): string {
  return REQUEST_REASON_LABEL_MAP[value]
}

export function requestReasonNeedsCode(value: RequestReasonValue): boolean {
  return REQUEST_REASON_CODE_REQUIRED.has(value)
}

export function buildStoredReason(params: {
  requestTypeLabel: string | null
  requestReason: RequestReasonValue
  freeTextReason: string
  accessCode: string | null
}): string {
  const parts: string[] = []
  if (params.requestTypeLabel) parts.push(`[Request Type: ${params.requestTypeLabel}]`)
  parts.push(`[Request Reason: ${requestReasonLabel(params.requestReason)}]`)
  if (params.accessCode) parts.push(`[Access Code: ${params.accessCode}]`)
  if (params.freeTextReason) parts.push(params.freeTextReason)
  return parts.join(' ').trim()
}

export function extractAccessCodeFromStoredReason(reason: string | null | undefined): string | null {
  if (!reason) return null
  const match = reason.match(/\[Access Code:\s*([^\]]+)\]/i)
  const code = match?.[1]?.trim()
  return code ? code.toUpperCase() : null
}

export function extractRequestReasonLabelFromStoredReason(reason: string | null | undefined): string | null {
  if (!reason) return null
  const match = reason.match(/\[Request Reason:\s*([^\]]+)\]/i)
  const label = match?.[1]?.trim()
  return label || null
}
