'use client'

import React from 'react'
import { Link } from '@/i18n/navigation'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbProps {
  items: { label: string; href?: string }[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-400">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden />}
            {item.href ? (
              <Link href={item.href as '/' | '/services' | '/resources' | '/about' | '/contact' | '/trust' | '/digital-creations' | '/assessment' | '/faq' | '/schedule' | '/resources/request' | '/resources/portal'} className="hover:text-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-white" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
