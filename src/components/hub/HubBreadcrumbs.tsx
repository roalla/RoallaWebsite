'use client'

import { Link } from '@/i18n/navigation'
import { ChevronRight } from 'lucide-react'
import type { ComponentProps } from 'react'

export type BreadcrumbItem = {
  label: string
  href?: ComponentProps<typeof Link>['href']
}

type Props = {
  items: BreadcrumbItem[]
}

export default function HubBreadcrumbs({ items }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-slate-500 mb-4">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />}
          {item.href ? (
            <Link href={item.href} className="hover:text-primary-dark hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-800 font-medium truncate max-w-[200px] sm:max-w-none">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
