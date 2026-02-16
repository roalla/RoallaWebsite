'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getViewAsCookie, setViewAsCookie, type ViewAsRole } from './AdminViewAs'

type ViewAsContextValue = {
  viewAsRole: ViewAsRole
  setViewAsRole: (role: ViewAsRole) => void
}

const ViewAsContext = createContext<ViewAsContextValue | null>(null)

export function useViewAs() {
  const ctx = useContext(ViewAsContext)
  return ctx ?? { viewAsRole: '' as ViewAsRole, setViewAsRole: () => {} }
}

export function AdminViewAsProvider({ children }: { children: React.ReactNode }) {
  const [viewAsRole, setViewAsRoleState] = useState<ViewAsRole>('')
  useEffect(() => {
    setViewAsRoleState(getViewAsCookie())
  }, [])
  const setViewAsRole = (role: ViewAsRole) => {
    setViewAsCookie(role)
    setViewAsRoleState(role)
  }
  return (
    <ViewAsContext.Provider value={{ viewAsRole, setViewAsRole }}>
      {children}
    </ViewAsContext.Provider>
  )
}
