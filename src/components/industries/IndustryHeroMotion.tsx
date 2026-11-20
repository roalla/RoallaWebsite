type AnimatedIndustry = 'legal' | 'manufacturing'

function isAnimatedIndustry(industry: string): industry is AnimatedIndustry {
  return industry === 'legal' || industry === 'manufacturing'
}

export default function IndustryHeroMotion({ industry }: { industry: string }) {
  if (!isAnimatedIndustry(industry)) return null

  return (
    <div
      className={`industry-hero-motion industry-hero-motion--${industry}`}
      data-industry-hero-motion={industry}
      aria-hidden="true"
    >
      {industry === 'legal' ? <LegalMotion /> : <ManufacturingMotion />}
    </div>
  )
}

function LegalMotion() {
  return (
    <svg viewBox="0 0 960 620" role="presentation" focusable="false">
      <defs>
        <linearGradient id="legal-panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#061827" stopOpacity="0.82" />
          <stop offset="1" stopColor="#0b3440" stopOpacity="0.4" />
        </linearGradient>
        <filter id="legal-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g className="industry-legal-document">
        <rect x="565" y="114" width="250" height="330" rx="24" fill="url(#legal-panel)" />
        <path d="M609 181h162M609 226h132M609 271h150M609 316h112" pathLength="1" />
        <rect x="608" y="353" width="118" height="42" rx="12" />
      </g>

      <g className="industry-legal-shield" filter="url(#legal-glow)">
        <path d="M503 228l88 32v78c0 65-36 111-88 137-52-26-88-72-88-137v-78z" />
        <path d="M467 343l24 24 50-61" pathLength="1" />
      </g>

      <g className="industry-legal-balance">
        <path d="M286 214h190M381 178v225M324 403h114M330 214l-54 116h108zM432 214l-54 116h108z" />
        <circle cx="381" cy="178" r="13" />
      </g>

      <g className="industry-legal-signals">
        <path d="M310 144C421 74 598 75 730 161" pathLength="1" />
        <path d="M288 466c126 86 341 79 488-20" pathLength="1" />
        <circle cx="310" cy="144" r="7" />
        <circle cx="730" cy="161" r="7" />
        <circle cx="288" cy="466" r="7" />
        <circle cx="776" cy="446" r="7" />
      </g>
    </svg>
  )
}

function ManufacturingMotion() {
  return (
    <svg viewBox="0 0 960 620" role="presentation" focusable="false">
      <defs>
        <linearGradient id="manufacturing-panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#041620" stopOpacity="0.86" />
          <stop offset="1" stopColor="#0a3a42" stopOpacity="0.42" />
        </linearGradient>
        <filter id="manufacturing-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g className="industry-manufacturing-dashboard">
        <rect x="570" y="102" width="280" height="190" rx="24" fill="url(#manufacturing-panel)" />
        <path d="M604 246l42-49 40 19 49-67 74 49" pathLength="1" />
        <path d="M604 142h72M604 165h42" />
        <circle cx="809" cy="198" r="8" filter="url(#manufacturing-glow)" />
      </g>

      <g className="industry-manufacturing-arm">
        <path d="M332 389l51-93 76 38 58-84" />
        <circle cx="332" cy="389" r="28" />
        <circle cx="383" cy="296" r="21" />
        <circle cx="459" cy="334" r="18" />
        <path d="M501 228l35 20-26 45-35-20zM520 263l48 28" />
      </g>

      <g className="industry-manufacturing-conveyor">
        <path d="M248 456h536M280 500h475" />
        <rect x="355" y="391" width="94" height="63" rx="8" />
        <rect x="532" y="377" width="112" height="77" rx="8" />
        <circle cx="315" cy="478" r="16" />
        <circle cx="432" cy="478" r="16" />
        <circle cx="549" cy="478" r="16" />
        <circle cx="666" cy="478" r="16" />
        <circle cx="755" cy="478" r="16" />
      </g>

      <g className="industry-manufacturing-signals" filter="url(#manufacturing-glow)">
        <path d="M287 203C411 103 589 71 753 118" pathLength="1" />
        <circle cx="287" cy="203" r="7" />
        <circle cx="520" cy="105" r="7" />
        <circle cx="753" cy="118" r="7" />
      </g>
    </svg>
  )
}
