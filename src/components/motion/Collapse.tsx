'use client'

import React from 'react'

type CollapseProps = {
  open: boolean
  children: React.ReactNode
  className?: string
}

/** Height collapse without Framer Motion — pairs with collapse-grid utilities in globals.css */
export default function Collapse({ open, children, className = '' }: CollapseProps) {
  return (
    <div className={`collapse-grid ${open ? 'collapse-grid-open' : 'collapse-grid-closed'} ${className}`}>
      <div className="overflow-hidden min-h-0">{children}</div>
    </div>
  )
}
