'use client'

import React from 'react'
import { motion } from 'framer-motion'
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
      // Fallback or error handling
      console.error('Calendly script not loaded');
      // You could open the link in a new tab as a fallback:
      window.open('https://calendly.com/steven-robin-roalla', '_blank');
    }
  };

  // Inline styles as fallback
  const getButtonStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: 'none',
      borderRadius: '8px',
      textDecoration: 'none',
      outline: 'none',
      minWidth: 'fit-content',
    }

    const variantStyles = {
      primary: {
        backgroundColor: '#00b4c5',
        color: 'white',
      },
      secondary: {
        backgroundColor: '#f9fafb',
        color: '#374151',
        border: '1px solid #e5e7eb',
      }
    }

    const sizeStyles = {
      sm: { padding: '8px 16px', fontSize: '14px' },
      md: { padding: '12px 24px', fontSize: '16px' },
      lg: { padding: '16px 32px', fontSize: '18px' }
    }

    return {
      ...baseStyles,
      ...variantStyles[variant],
      ...sizeStyles[size],
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={getButtonStyles()}
      className={className}
      type="button"
    >
      {icon && <Calendar style={{ width: '16px', height: '16px', marginRight: '8px' }} />}
      {children}
    </motion.button>
  )
}

export default CalendlyButton 