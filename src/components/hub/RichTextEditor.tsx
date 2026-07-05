'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Underline,
} from 'lucide-react'
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
    <div className="rounded-lg border bg-white overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
      <div className="flex flex-wrap gap-0.5 border-b bg-slate-50 px-2 py-1.5">
        <ToolbarButton label={t('richTextBold')} onClick={() => { exec('bold'); emitChange() }}>
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton label={t('richTextItalic')} onClick={() => { exec('italic'); emitChange() }}>
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton label={t('richTextUnderline')} onClick={() => { exec('underline'); emitChange() }}>
          <Underline className="h-3.5 w-3.5" />
        </ToolbarButton>
        <span className="w-px h-6 bg-slate-200 mx-1 self-center" aria-hidden />
        <ToolbarButton label={t('richTextBulletList')} onClick={() => { exec('insertUnorderedList'); emitChange() }}>
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton label={t('richTextNumberedList')} onClick={() => { exec('insertOrderedList'); emitChange() }}>
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton label={t('richTextLink')} onClick={addLink}>
          <LinkIcon className="h-3.5 w-3.5" />
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
      className="rounded p-1.5 text-slate-700 hover:bg-white hover:shadow-sm min-h-[32px] min-w-[32px] flex items-center justify-center"
    >
      {children}
    </button>
  )
}
