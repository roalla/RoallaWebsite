'use client'

import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/lib/use-theme'

export const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme()

  const handleToggle = () => {
    console.log('🔄 Theme toggle clicked!')
    console.log('Current theme:', theme)
    
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    console.log('Switching to:', newTheme)
    
    setTheme(newTheme)
    
    // Check if the theme was applied
    setTimeout(() => {
      const htmlClasses = document.documentElement.classList.toString()
      console.log('HTML classes after toggle:', htmlClasses)
      console.log('localStorage value:', localStorage.getItem('vite-ui-theme'))
    }, 100)
  }

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-all duration-200 ${
        theme === 'dark' 
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  )
} 