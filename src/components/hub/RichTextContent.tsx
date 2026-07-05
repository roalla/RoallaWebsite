'use client'

import { sanitizeRichText, richTextIsEmpty } from '@/lib/hub/rich-text'

type Props = {
  html?: string | null
  className?: string
}

export default function RichTextContent({ html, className = '' }: Props) {
  if (!html || richTextIsEmpty(html)) return null

  const safe = sanitizeRichText(html)

  return (
    <div
      className={`rich-text-content text-sm text-slate-800 ${className}`}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  )
}
