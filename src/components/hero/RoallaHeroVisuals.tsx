import React from 'react'

type VisualProps = {
  className?: string
}

function Spark({ className = '' }: VisualProps) {
  return <span className={`roalla-hero-spark ${className}`} aria-hidden />
}

export function ConnectedIntelligenceVisual({ className = '' }: VisualProps) {
  const nodes = [
    { label: 'Strategy', className: 'left-[5%] top-[14%]' },
    { label: 'Technology', className: 'right-[3%] top-[18%]' },
    { label: 'Automation', className: 'bottom-[12%] right-[8%]' },
    { label: 'Growth', className: 'bottom-[8%] left-[7%]' },
  ]

  return (
    <div
      className={`roalla-hero-visual roalla-connected-intelligence ${className}`}
      data-testid="connected-intelligence-hero"
      aria-hidden
    >
      <div className="roalla-visual-grid" />
      <div className="roalla-orbit roalla-orbit-wide" />
      <div className="roalla-orbit roalla-orbit-tight" />
      <svg className="absolute inset-[8%] h-[84%] w-[84%]" viewBox="0 0 520 420" fill="none">
        <path className="roalla-data-path" pathLength="1" d="M74 74C154 91 179 142 260 210C337 274 392 271 454 337" />
        <path className="roalla-data-path roalla-data-path-reverse" pathLength="1" d="M446 81C373 104 332 141 260 210C188 278 136 303 71 344" />
        <path className="roalla-data-path roalla-data-path-soft" pathLength="1" d="M70 77C134 183 159 223 71 343M446 82C371 178 373 250 454 337" />
      </svg>
      <div className="roalla-core">
        <span className="roalla-core-halo" />
        <span className="text-[10px] font-bold tracking-[0.24em] text-white sm:text-xs">ROALLA</span>
        <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-cyan-200 sm:text-[9px]">
          Connected
        </span>
      </div>
      {nodes.map((node, index) => (
        <div key={node.label} className={`roalla-intelligence-node ${node.className}`}>
          <span className="roalla-node-dot" style={{ animationDelay: `${index * -0.7}s` }} />
          <span>{node.label}</span>
        </div>
      ))}
      <Spark className="left-[25%] top-[31%]" />
      <Spark className="bottom-[27%] right-[24%]" />
    </div>
  )
}

export function DigitalCommandCentreVisual({ className = '' }: VisualProps) {
  return (
    <div
      className={`roalla-hero-visual roalla-command-centre ${className}`}
      data-testid="digital-command-centre-hero"
      aria-hidden
    >
      <div className="roalla-visual-grid" />
      <div className="roalla-command-shell">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-300">Digital command centre</p>
            <p className="mt-1 text-xs font-semibold text-white">Decision intelligence</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-300">
            <span className="roalla-status-pulse" /> Live
          </span>
        </div>
        <div className="grid grid-cols-[1.25fr_.75fr] gap-3 p-3">
          <div className="rounded-lg border border-white/10 bg-slate-950/55 p-3">
            <div className="flex items-center justify-between text-[9px] font-semibold text-slate-400">
              <span>READINESS SIGNAL</span><span className="text-cyan-300">84%</span>
            </div>
            <svg className="mt-3 h-20 w-full" viewBox="0 0 250 80" fill="none">
              <defs>
                <linearGradient id="command-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="#22D3EE" stopOpacity=".32" />
                  <stop offset="1" stopColor="#22D3EE" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M2 69L34 59L64 63L96 43L126 48L158 28L190 35L220 13L248 18V80H2Z" fill="url(#command-fill)" />
              <path className="roalla-chart-line" pathLength="1" d="M2 69L34 59L64 63L96 43L126 48L158 28L190 35L220 13L248 18" />
            </svg>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {['Fit', 'Risk', 'Value'].map((label, index) => (
                <div key={label} className="rounded-md bg-white/[0.045] px-2 py-2">
                  <p className="text-[8px] uppercase tracking-wider text-slate-500">{label}</p>
                  <p className="mt-1 text-xs font-bold text-white">{[92, 18, 87][index]}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.07] p-3">
              <p className="text-[8px] uppercase tracking-[0.14em] text-cyan-200">Priority</p>
              <p className="mt-2 text-xs font-semibold leading-4 text-white">Unify the customer journey</p>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10"><span className="roalla-progress block h-full w-4/5 bg-cyan-300" /></div>
            </div>
            <div className="rounded-lg border border-amber-300/20 bg-amber-300/[0.06] p-3">
              <p className="text-[8px] uppercase tracking-[0.14em] text-amber-200">Next decision</p>
              <p className="mt-2 text-xs font-semibold leading-4 text-white">Compare viable paths</p>
              <div className="mt-3 flex gap-1.5">{[0, 1, 2].map((item) => <span key={item} className="h-1.5 flex-1 rounded-full bg-amber-300/50" />)}</div>
            </div>
          </div>
        </div>
      </div>
      <Spark className="right-[7%] top-[11%]" />
    </div>
  )
}

export function DigitalTransformationVisual({ className = '' }: VisualProps) {
  const stages = [
    { label: 'Capture', value: '01' },
    { label: 'Connect', value: '02' },
    { label: 'Automate', value: '03' },
    { label: 'Improve', value: '04' },
  ]

  return (
    <div
      className={`roalla-hero-visual roalla-transformation ${className}`}
      data-testid="digital-transformation-hero"
      aria-hidden
    >
      <div className="roalla-visual-grid" />
      <div className="roalla-transform-ring roalla-transform-ring-outer" />
      <div className="roalla-transform-ring roalla-transform-ring-inner" />
      <div className="roalla-transform-core">
        <span className="text-[9px] font-bold uppercase tracking-[0.17em] text-cyan-200">Human</span>
        <span className="mt-1 text-sm font-bold text-white">Control</span>
        <span className="mt-1 text-[8px] uppercase tracking-[0.15em] text-amber-200">AI enabled</span>
      </div>
      <svg className="absolute inset-[8%] h-[84%] w-[84%]" viewBox="0 0 480 400" fill="none">
        <path className="roalla-data-path" pathLength="1" d="M57 101C155 69 162 158 240 200C318 242 331 314 428 295" />
        <path className="roalla-data-path roalla-data-path-reverse" pathLength="1" d="M55 300C132 328 172 253 240 200C307 148 363 79 427 102" />
      </svg>
      {stages.map((stage, index) => {
        const positions = ['left-[3%] top-[17%]', 'right-[2%] top-[17%]', 'bottom-[15%] right-[1%]', 'bottom-[13%] left-[2%]']
        return (
          <div key={stage.label} className={`roalla-transform-stage ${positions[index]}`}>
            <span className="text-[8px] font-bold text-amber-200">{stage.value}</span>
            <span>{stage.label}</span>
          </div>
        )
      })}
      <Spark className="left-[23%] top-[29%]" />
      <Spark className="bottom-[28%] right-[22%]" />
    </div>
  )
}
