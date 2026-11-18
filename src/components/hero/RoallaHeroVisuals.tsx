import React, { type CSSProperties } from 'react'

type VisualProps = {
  className?: string
}

const networkNodes = [
  [72, 86, 7], [148, 48, 5], [214, 116, 6], [314, 62, 8], [410, 104, 5],
  [472, 54, 6], [98, 214, 5], [188, 192, 8], [282, 218, 6], [382, 184, 7],
  [486, 232, 5], [130, 330, 7], [238, 300, 5], [344, 326, 8], [446, 304, 6],
] as const

const networkPaths = [
  'M72 86C118 62 155 67 214 116S270 75 314 62S385 86 410 104S449 71 472 54',
  'M72 86C80 142 72 180 98 214S157 181 188 192S242 224 282 218S341 177 382 184S451 210 486 232',
  'M98 214C121 257 107 293 130 330S204 306 238 300S300 309 344 326S408 289 446 304',
  'M214 116C222 168 244 179 282 218S303 283 344 326',
  'M410 104C397 134 395 151 382 184S407 262 446 304',
] as const

export function ConnectedIntelligenceVisual({ className = '' }: VisualProps) {
  return (
    <div className={`roalla-hero-visual roalla-connected-intelligence ${className}`} data-testid="connected-intelligence-hero" aria-hidden>
      <div className="roalla-network-aura" />
      <svg className="roalla-network-map" viewBox="0 0 540 390" fill="none">
        <defs>
          <filter id="network-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="node-fill"><stop stopColor="#E9FDFF" /><stop offset=".35" stopColor="#00B4C5" /><stop offset="1" stopColor="#006A78" /></radialGradient>
        </defs>
        <g className="roalla-network-lines">{networkPaths.map((path) => <path key={path} d={path} />)}</g>
        <g className="roalla-network-pulses" filter="url(#network-glow)">
          {networkPaths.map((path, index) => <path key={path} d={path} pathLength="100" style={{ animationDelay: `${index * -1.35}s` }} />)}
        </g>
        <g className="roalla-network-nodes" filter="url(#network-glow)">
          {networkNodes.map(([cx, cy, r], index) => (
            <g key={`${cx}-${cy}`} style={{ animationDelay: `${index * -0.21}s` }}>
              <circle className="roalla-network-node-halo" cx={cx} cy={cy} r={r + 7} />
              <circle cx={cx} cy={cy} r={r} fill="url(#node-fill)" />
              <circle cx={cx - r * 0.25} cy={cy - r * 0.28} r={Math.max(1.2, r * 0.22)} fill="white" />
            </g>
          ))}
        </g>
      </svg>
      <div className="roalla-network-signal roalla-network-signal-a" />
      <div className="roalla-network-signal roalla-network-signal-b" />
      <div className="roalla-network-signal roalla-network-signal-c" />
    </div>
  )
}

function MiniBars() {
  return <div className="roalla-command-bars">{[38, 68, 49, 82, 61, 92, 74].map((height, index) => <span key={index} style={{ height: `${height}%`, animationDelay: `${index * 90}ms` }} />)}</div>
}

export function DigitalCommandCentreVisual({ className = '' }: VisualProps) {
  return (
    <div className={`roalla-hero-visual roalla-command-centre ${className}`} data-testid="digital-command-centre-hero" aria-hidden>
      <div className="roalla-command-horizon" />
      <svg className="roalla-command-connectors" viewBox="0 0 480 400" fill="none">
        <path d="M238 198C179 169 154 128 88 104" /><path d="M238 198C305 160 339 137 407 123" />
        <path d="M238 198C183 245 153 269 96 302" /><path d="M238 198C301 239 333 267 405 292" />
      </svg>
      <div className="roalla-command-core"><span /><span /><span /></div>
      <div className="roalla-glass-panel roalla-panel-analytics">
        <div className="roalla-panel-topline"><span /><i>84</i></div>
        <svg viewBox="0 0 190 66" fill="none"><path className="roalla-area-chart" d="M2 58L30 48L55 52L82 33L108 40L136 18L162 25L188 8V66H2Z" /><path className="roalla-line-chart" pathLength="1" d="M2 58L30 48L55 52L82 33L108 40L136 18L162 25L188 8" /></svg>
      </div>
      <div className="roalla-glass-panel roalla-panel-systems">
        <div className="roalla-panel-topline"><span /><i>07</i></div>
        <div className="roalla-system-grid">{Array.from({ length: 6 }, (_, index) => <span key={index}><i /></span>)}</div>
      </div>
      <div className="roalla-glass-panel roalla-panel-signals"><div className="roalla-panel-topline"><span /><i>92</i></div><MiniBars /></div>
      <div className="roalla-glass-panel roalla-panel-status"><div className="roalla-status-orbit"><span /></div><div className="roalla-status-lines"><span /><span /><span /></div></div>
    </div>
  )
}

const transformationParticles = Array.from({ length: 24 }, (_, index) => ({
  x: 6 + ((index * 37) % 72), y: 5 + ((index * 53) % 88), delay: -(index % 8) * 0.38, size: index % 5 === 0 ? 5 : index % 3 === 0 ? 4 : 3,
}))

export function DigitalTransformationVisual({ className = '' }: VisualProps) {
  return (
    <div className={`roalla-hero-visual roalla-transformation ${className}`} data-testid="digital-transformation-hero" aria-hidden>
      <div className="roalla-transform-field">
        {transformationParticles.map((particle, index) => (
          <span key={index} className="roalla-transform-particle" style={{ '--particle-x': `${particle.x}%`, '--particle-y': `${particle.y}%`, '--particle-delay': `${particle.delay}s`, '--particle-size': `${particle.size}px` } as CSSProperties} />
        ))}
      </div>
      <svg className="roalla-workflow-lines" viewBox="0 0 500 390" fill="none">
        <path pathLength="1" d="M64 92C136 92 121 194 194 194H255" /><path pathLength="1" d="M64 194H255" /><path pathLength="1" d="M64 296C136 296 121 194 194 194" />
        <path pathLength="1" d="M255 194H318C359 194 357 102 408 102" /><path pathLength="1" d="M255 194H408" /><path pathLength="1" d="M255 194H318C359 194 357 286 408 286" />
      </svg>
      <div className="roalla-convergence-core"><span /><span /><span /></div>
      <div className="roalla-workflow-node roalla-workflow-node-a"><span /><i /></div><div className="roalla-workflow-node roalla-workflow-node-b"><span /><i /></div><div className="roalla-workflow-node roalla-workflow-node-c"><span /><i /></div>
      <div className="roalla-workflow-node roalla-workflow-node-d"><span /><i /></div><div className="roalla-workflow-node roalla-workflow-node-e"><span /><i /></div><div className="roalla-workflow-node roalla-workflow-node-f"><span /><i /></div>
    </div>
  )
}
