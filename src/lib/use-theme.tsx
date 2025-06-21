'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'light',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  // Start with default theme to match server-side rendering
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null
      if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
        console.log('🎨 ThemeProvider: Found stored theme:', storedTheme)
        setTheme(storedTheme)
        // Apply the theme to the document
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(storedTheme)
      }
    } catch (error) {
      console.log('⚠️ Error reading theme from localStorage:', error)
    }
  }, [storageKey])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      console.log('🎨 ThemeProvider: Setting theme to', newTheme)
      try {
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(newTheme)
        localStorage.setItem(storageKey, newTheme)
        setTheme(newTheme)
        console.log('✅ Theme applied successfully')
      } catch (error) {
        console.log('⚠️ Error setting theme:', error)
      }
    },
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <ThemeProviderContext.Provider {...props} value={initialState}>{children}</ThemeProviderContext.Provider>
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
} 