'use client'

import React from 'react'
import Link from 'next/link'
import { Calendar } from 'lucide-react'

// This lets TypeScript know that the Calendly object will be on the window
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void
    }
  }
}

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
  const getButtonClassName = () => {
    const variants = {
      primary: 'bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl',
      secondary: 'bg-white hover:bg-gray-50 text-primary border-2 border-primary hover:border-primary-dark',
    };
    const sizes = {
      sm: 'py-2 px-4 text-sm',
      md: 'py-3 px-6 text-base',
      lg: 'py-4 px-8 text-lg',
    };
    return `inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 ${variants[variant]} ${sizes[size]} ${className}`;
  };

  return (
    <Link href="/schedule" className={getButtonClassName()}>
      {icon && <Calendar className="w-5 h-5 mr-2" />}
      {children}
    </Link>
  );
};

export default ScheduleButton 