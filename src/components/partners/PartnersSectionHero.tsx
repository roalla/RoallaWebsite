type Props = {
  eyebrow: string
  title: string
  description: string
}

export default function PartnersSectionHero({ eyebrow, title, description }: Props) {
  return (
    <header className="border-b border-slate-200 bg-slate-50 px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="container mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">{eyebrow}</p>
        <h1 className="mt-3 font-serif text-4xl font-extrabold tracking-[-0.03em] text-slate-950 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">{description}</p>
      </div>
    </header>
  )
}
