'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Loader2 } from 'lucide-react'

// Type declaration for Calendly
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
  icon = false
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [calendlyReady, setCalendlyReady] = useState(false)

  // Check if Calendly is ready
  useEffect(() => {
    const checkCalendly = () => {
      if (typeof window !== 'undefined' && window.Calendly) {
        setCalendlyReady(true)
      } else {
        // Retry after a short delay
        setTimeout(checkCalendly, 100)
      }
    }
    
    checkCalendly()
  }, [])

  const handleClick = async () => {
    setIsLoading(true)
    console.log('CalendlyButton clicked')
    
    try {
      // Wait a bit for Calendly to be ready if it's not already
      if (!calendlyReady) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      if (typeof window !== 'undefined' && window.Calendly) {
        console.log('Using Calendly popup')
        window.Calendly.initPopupWidget({
          url: 'https://calendly.com/steven-robin-roalla'
        })
      } else {
        console.log('Using fallback - opening in new tab')
        // Fallback to direct link if Calendly script hasn't loaded
        const calendlyUrl = 'https://calendly.com/steven-robin-roalla'
        window.open(calendlyUrl, '_blank', 'noopener,noreferrer')
      }
    } catch (error) {
      console.error('Error opening Calendly:', error)
      // Final fallback
      window.open('https://calendly.com/steven-robin-roalla', '_blank', 'noopener,noreferrer')
    } finally {
      setIsLoading(false)
    }
  }

  // Inline styles as fallback
  const getButtonStyles = () => {
    const baseStyles = {
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
        boxShadow: '0 4px 6px rgba(0, 180, 197, 0.25)',
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
      whileHover={{ scale: isLoading ? 1 : 1.05 }}
      whileTap={{ scale: isLoading ? 1 : 0.95 }}
      style={getButtonStyles()}
      className={className}
      type="button"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 style={{ width: '16px', height: '16px', marginRight: '8px' }} className="animate-spin" />
      ) : icon ? (
        <Calendar style={{ width: '16px', height: '16px', marginRight: '8px' }} />
      ) : null}
      {isLoading ? 'Opening...' : children}
    </motion.button>
  )
}

export default CalendlyButton 