'use client'

import React from 'react'
import Image from 'next/image'

type BrowserFrameProps = {
  imageUrl?: string | null
  imageAlt?: string
  brandPreview?: boolean
  priority?: boolean
  domain?: string
  className?: string
  aspect?: 'video' | 'portrait'
}

export default function BrowserFrame({
  imageUrl,
  imageAlt = '',
  brandPreview = false,
  domain,
  priority = false,
  className = '',
  aspect = 'video',
}: BrowserFrameProps) {
  const aspectClass = aspect === 'portrait' ? 'aspect-[4/3]' : 'aspect-video'

  return (
    <div className={`rounded-xl overflow-hidden border border-slate-200 shadow-card bg-white ${className}`}>
      <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 border-b border-slate-200">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" aria-hidden />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" aria-hidden />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" aria-hidden />
        <span className="ml-2 flex-1 h-5 rounded-md bg-white border border-slate-200 text-[10px] text-slate-400 flex items-center px-2 truncate">
          {domain ?? (brandPreview ? 'roalla.com' : 'live preview')}
        </span>
      </div>
      <div className={`relative ${aspectClass} bg-slate-50 overflow-hidden`}>
        {brandPreview ? (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-primary/10 flex flex-col items-center justify-center p-6">
            <div className="w-14 h-14 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center mb-3">
              <span className="text-lg font-bold text-primary tracking-tight">R</span>
            </div>
            <p className="text-xl font-serif font-bold text-slate-900">ROALLA</p>
            <p className="text-xs text-slate-500 mt-1 text-center max-w-[200px]">Business enablement · consulting · digital builds</p>
          </div>
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
            priority={priority}
          />
        ) : null}
      </div>
    </div>
  )
}
