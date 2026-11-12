'use client'

export default function EstimateConsiderations({
  locale,
  items,
}: {
  locale: string
  items: string[]
}) {
  if (items.length === 0) return null
  const title =
    locale === 'fr' ? 'À considérer pour votre marché' : 'What to consider for your market'

  return (
    <div className="mt-5 rounded-xl border border-primary/20 bg-primary/[0.05] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-slate-700">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
