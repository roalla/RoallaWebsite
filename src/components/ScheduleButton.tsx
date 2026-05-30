'use client'

import React from 'react'
import { Link } from '@/i18n/navigation'
import { Send } from 'lucide-react'

interface ScheduleButtonProps {
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  icon?: boolean
}

const ScheduleButton: React.FC<ScheduleButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  icon = false,
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

  return (
    <Link
      href="/schedule"
      className={`inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <Send className="w-5 h-5 mr-2" aria-hidden />}
      {children}
    </Link>
  )
}

export default ScheduleButton
