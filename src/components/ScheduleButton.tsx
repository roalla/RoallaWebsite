'use client'

import React, { useId } from 'react'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import type { ConsultationIntent } from '@/lib/consultation-request'

interface ScheduleButtonProps {
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  icon?: boolean
  intent?: ConsultationIntent
  service?: 'websites-brand' | 'custom-platforms'
  reference?: string
  sublabel?: string
  sublabelClassName?: string
  /** Shown in a tooltip on hover/focus — does not affect layout */
  hoverHint?: string
  block?: boolean
}

const ScheduleButton: React.FC<ScheduleButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  icon = false,
  intent,
  service,
  reference,
  sublabel,
  sublabelClassName = '',
  hoverHint,
  block = false,
}) => {
  const hintId = useId()
  const variants = {
    primary:
      'bg-primary-dark hover:bg-primary-darker text-white shadow-md hover:shadow-lg border border-primary-darker/20',
    secondary:
      'bg-transparent hover:bg-primary/10 text-primary-dark border-2 border-primary-dark hover:border-primary-darker',
  }
  const sizes = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg',
  }

  const href = (() => {
    const query: Record<string, string> = {}
    if (intent) query.intent = intent
    if (service) query.service = service
    if (reference) query.reference = reference
    if (Object.keys(query).length > 0) {
      return { pathname: '/schedule', query } as const
    }
    return '/schedule'
  })()

  const link = (
    <Link
      href={href}
      title={hoverHint}
      aria-describedby={hoverHint ? hintId : undefined}
      className={`inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] ${variants[variant]} ${sizes[size]} ${block ? 'w-full' : ''} ${className}`}
    >
      {icon && <ArrowRight className="w-5 h-5 mr-2" aria-hidden />}
      {children}
    </Link>
  )

  if (hoverHint && !sublabel) {
    return (
      <span className={`relative inline-flex group ${block ? 'w-full' : ''}`}>
        {link}
        <span
          id={hintId}
          role="tooltip"
          className="pointer-events-none absolute left-1/2 top-[calc(100%+0.5rem)] z-50 w-max max-w-[15rem] -translate-x-1/2 rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-xs leading-snug text-white text-center opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
        >
          {hoverHint}
        </span>
      </span>
    )
  }

  if (!sublabel) return link

  return (
    <div className={`inline-flex flex-col items-center gap-1.5 ${block ? 'w-full' : ''}`}>
      {link}
      <p className={`text-xs leading-snug text-center ${sublabelClassName}`}>{sublabel}</p>
    </div>
  )
}

export default ScheduleButton
