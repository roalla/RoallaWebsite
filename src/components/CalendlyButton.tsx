'use client'

import React from 'react'
import { Calendar } from 'lucide-react'

// This lets TypeScript know that the Calendly object will be on the window
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void
    }
  }
}

interface CalendlyButtonProps {
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  icon?: boolean
}

const CalendlyButton: React.FC<CalendlyButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  icon = false,
}) => {
  const handleClick = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/steven-robin-roalla',
      });
    } else {
      console.error('Calendly script not loaded, opening in new tab.');
      window.open('https://calendly.com/steven-robin-roalla', '_blank');
    }
  };

  const getButtonClassName = () => {
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
    };
    const sizes = {
      sm: 'py-2 px-4 text-sm',
      md: 'py-3 px-6 text-base',
      lg: 'py-4 px-8 text-lg',
    }
    return `${variants[variant]} ${sizes[size]} ${className}`;
  };

  return (
    <button
      onClick={handleClick}
      className={getButtonClassName()}
      type="button"
    >
      {icon && <Calendar className="w-5 h-5 mr-2" />}
      {children}
    </button>
  )
}

export default CalendlyButton 