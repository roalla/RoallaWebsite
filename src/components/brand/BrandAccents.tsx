import React from 'react'

export function PyramidAccent({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-0.5 shrink-0 ${className}`} aria-hidden>
      <div className="h-2 w-6 rounded-sm bg-primary/70" />
      <div className="h-2.5 w-10 rounded-sm bg-primary/55" />
      <div className="h-3 w-14 rounded-sm bg-primary/40" />
      <div className="h-3.5 w-[4.5rem] rounded-sm bg-primary/30" />
    </div>
  )
}

export function ButterflyAccent({ className = 'w-10 h-10 text-primary/50 shrink-0' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="currentColor" aria-hidden>
      <ellipse cx="12" cy="18" rx="10" ry="12" opacity="0.55" />
      <ellipse cx="28" cy="18" rx="10" ry="12" opacity="0.55" />
      <ellipse cx="20" cy="26" rx="2.5" ry="10" opacity="0.75" />
    </svg>
  )
}
