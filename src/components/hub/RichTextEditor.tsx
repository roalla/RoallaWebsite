'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { sanitizeRichText } from '@/lib/hub/rich-text'

type Props = {
  id?: string
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: string
  required?: boolean
}

function exec(command: string, value?: string) {
  document.execCommand(command, false, value)
}

export default function RichTextEditor({
  id,
  value,
  onChange,
  placeholder,
  minHeight = '6rem',
  required,
}: Props) {
  const t = useTranslations('hub')
  const editorRef = useRef<HTMLDivElement>(null)
  const lastValue = useRef(value)

  useEffect(() => {
    const el = editorRef.current
    if (!el) return
    const sanitized = sanitizeRichText(value)
    if (sanitized !== lastValue.current) {
      el.innerHTML = sanitized || ''
      lastValue.current = sanitized
    }
  }, [value])

  function emitChange() {
    const el = editorRef.current
    if (!el) return
    const html = sanitizeRichText(el.innerHTML)
    lastValue.current = html
    onChange(html)
  }

  function addLink() {
    const url = window.prompt(t('richTextLinkPrompt'))
    if (!url?.trim()) return
    exec('createLink', url.trim())
    emitChange()
  }

  return (
    <div className="rounded-lg border bg-white overflow-hidden focus-within:ring-2 focus-within:ring-amber-200 focus-within:border-amber-400">
      <div className="flex flex-wrap gap-0.5 border-b bg-slate-50 px-2 py-1.5">
        <ToolbarButton label={t('richTextBold')} onClick={() => { exec('bold'); emitChange() }}>
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton label={t('richTextItalic')} onClick={() => { exec('italic'); emitChange() }}>
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton label={t('richTextUnderline')} onClick={() => { exec('underline'); emitChange() }}>
          <span className="underline">U</span>
        </ToolbarButton>
        <span className="w-px h-6 bg-slate-200 mx-1 self-center" aria-hidden />
        <ToolbarButton label={t('richTextBulletList')} onClick={() => { exec('insertUnorderedList'); emitChange() }}>
          •≡
        </ToolbarButton>
        <ToolbarButton label={t('richTextNumberedList')} onClick={() => { exec('insertOrderedList'); emitChange() }}>
          1.
        </ToolbarButton>
        <ToolbarButton label={t('richTextLink')} onClick={addLink}>
          ↗
        </ToolbarButton>
      </div>
      <div
        id={id}
        ref={editorRef}
        role="textbox"
        aria-multiline="true"
        aria-required={required}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emitChange}
        onBlur={emitChange}
        className="rich-text-editor px-3 py-2 text-sm outline-none min-h-[var(--editor-min-h)] empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400"
        style={{ '--editor-min-h': minHeight } as React.CSSProperties}
      />
    </div>
  )
}

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="rounded px-2 py-1 text-xs text-slate-700 hover:bg-white hover:shadow-sm"
    >
      {children}
    </button>
  )
}
