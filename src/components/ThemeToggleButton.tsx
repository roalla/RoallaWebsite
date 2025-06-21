'use client'

import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/lib/use-theme'

export const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme()

  const handleToggle = () => {
    console.log('=== THEME TOGGLE DEBUG ===')
    console.log('Current theme state:', theme)
    console.log('Current HTML classes:', document.documentElement.classList.toString())
    console.log('Current body classes:', document.body.classList.toString())
    
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    console.log('Switching to theme:', newTheme)
    
    setTheme(newTheme)
    
    // Check after a short delay to see if the theme was applied
    setTimeout(() => {
      console.log('After setTheme - HTML classes:', document.documentElement.classList.toString())
      console.log('After setTheme - body classes:', document.body.classList.toString())
      console.log('After setTheme - localStorage:', localStorage.getItem('vite-ui-theme'))
    }, 100)
  }

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-full text-gray-500 hover:text-primary hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors duration-200"
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