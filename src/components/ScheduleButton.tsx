'use client'

import React from 'react'
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
  sublabel?: string
  sublabelClassName?: string
  block?: boolean
}

const ScheduleButton: React.FC<ScheduleButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  icon = false,
  intent,
  sublabel,
  sublabelClassName = '',
  block = false,
}) => {
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

  const href = intent
    ? ({ pathname: '/schedule', query: { intent } } as const)
    : '/schedule'

  const link = (
    <Link
      href={href}
      className={`inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] ${variants[variant]} ${sizes[size]} ${block ? 'w-full' : ''} ${className}`}
    >
      {icon && <ArrowRight className="w-5 h-5 mr-2" aria-hidden />}
      {children}
    </Link>
  )

  if (!sublabel) return link

  return (
    <div className={`inline-flex flex-col items-center gap-1.5 ${block ? 'w-full' : ''}`}>
      {link}
      <p className={`text-xs leading-snug text-center ${sublabelClassName}`}>{sublabel}</p>
    </div>
  )
}

export default ScheduleButton
