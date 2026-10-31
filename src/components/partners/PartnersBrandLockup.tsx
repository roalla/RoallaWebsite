import Image from 'next/image'

type Props = {
  companyName: string
  size?: 'sm' | 'md' | 'lg'
  tone?: 'light' | 'dark'
  label?: string
  className?: string
}

const sizes = {
  sm: { box: 'h-9 w-9', img: 22, text: 'text-sm' },
  md: { box: 'h-11 w-11', img: 28, text: 'text-base' },
  lg: { box: 'h-12 w-12 sm:h-14 sm:w-14', img: 36, text: 'text-lg sm:text-xl' },
} as const

export default function PartnersBrandLockup({
  companyName,
  size = 'md',
  tone = 'dark',
  label,
  className = '',
}: Props) {
  const dim = sizes[size]
  const onDark = tone === 'dark'

  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <span
        className={`grid ${dim.box} shrink-0 place-items-center rounded-xl ${
          onDark ? 'bg-white/10 ring-1 ring-white/15' : 'bg-slate-950'
        }`}
      >
        <Image
          src="/roalla-logo-2027.svg"
          alt=""
          width={dim.img}
          height={dim.img}
          className={size === 'lg' ? 'h-8 w-8 sm:h-9 sm:w-9' : size === 'md' ? 'h-7 w-7' : 'h-5 w-5'}
        />
      </span>
      <span className="min-w-0">
        <span
          className={`block font-extrabold tracking-[0.14em] ${dim.text} ${
            onDark ? 'text-white' : 'text-slate-950'
          }`}
        >
          {companyName}
        </span>
        {label ? (
          <span
            className={`mt-0.5 block text-[0.65rem] font-bold uppercase tracking-[0.16em] ${
              onDark ? 'text-primary-light' : 'text-primary-dark'
            }`}
          >
            {label}
          </span>
        ) : null}
      </span>
    </div>
  )
}
