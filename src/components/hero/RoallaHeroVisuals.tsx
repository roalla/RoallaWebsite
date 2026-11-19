import Image from 'next/image'
import React, { type CSSProperties } from 'react'

type VisualProps = { className?: string; priority?: boolean }

const networkNodes = [
  [412, 708, 5], [500, 650, 4], [602, 696, 5], [704, 626, 4], [822, 675, 6],
  [926, 606, 5], [1035, 676, 5], [1140, 620, 6], [1250, 705, 5], [1375, 633, 4],
  [1495, 742, 5], [1060, 780, 5], [805, 806, 4], [576, 778, 4],
] as const

const networkPaths = [
  'M412 708C493 663 529 658 602 696S744 637 822 675S962 633 1035 676S1169 653 1250 705S1408 682 1495 742',
  'M500 650C569 604 641 623 704 626S861 626 926 606S1080 581 1140 620S1306 601 1375 633',
  'M412 708C471 750 515 780 576 778S741 754 805 806S995 762 1060 780S1186 738 1250 705',
  'M602 696C654 739 746 778 805 806M822 675C861 713 905 735 926 774M1035 676C1046 718 1055 752 1060 780',
] as const

function ArtworkImage({ src, priority = false, className = '' }: { src: string; priority?: boolean; className?: string }) {
  return (
    <Image src={src} alt="" fill priority={priority} fetchPriority={priority ? 'high' : 'auto'} unoptimized
      sizes="100vw" className={`roalla-hero-artwork ${className}`} aria-hidden />
  )
}

export function ConnectedIntelligenceVisual({ className = '', priority = false }: VisualProps) {
  return (
    <div className={`roalla-artwork-motion roalla-connected-intelligence ${className}`} data-testid="connected-intelligence-hero" aria-hidden>
      <picture className="roalla-home-artwork">
        <source media="(max-width: 767px)" srcSet="/images/Hero/roalla-hero-homepage-mobile-1-480.avif" type="image/avif" />
        <source media="(max-width: 767px)" srcSet="/images/Hero/roalla-hero-homepage-mobile-1-480.webp" type="image/webp" />
        <source srcSet="/images/Hero/roalla-hero-homepage-desktop-1.avif" type="image/avif" />
        <img src="/images/Hero/roalla-hero-homepage-desktop-1.webp" alt="" decoding="async"
          fetchPriority={priority ? 'high' : 'auto'} className="roalla-hero-artwork" />
      </picture>
      <svg className="roalla-artwork-overlay roalla-network-overlay" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid slice" fill="none">
        <defs><filter id="connected-node-glow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter></defs>
        <g className="roalla-network-traces">
          {networkPaths.map((path, index) => <path key={path} d={path} pathLength="100" style={{ animationDelay: `${index * -1.55}s` }} />)}
        </g>
        <g className="roalla-network-node-glows" filter="url(#connected-node-glow)">
          {networkNodes.map(([cx, cy, r], index) => (
            <g key={`${cx}-${cy}`} style={{ animationDelay: `${index * -0.23}s` }}>
              <circle className="roalla-node-halo" cx={cx} cy={cy} r={r + 10} /><circle className="roalla-node-core" cx={cx} cy={cy} r={r} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}

const commandPaths = [
  'M706 313C650 269 592 238 512 206', 'M706 313C681 238 665 186 663 130',
  'M706 313C748 255 795 229 828 187', 'M706 313C798 281 860 269 920 232',
  'M706 313C731 386 760 430 811 469',
] as const

export function DigitalCommandCentreVisual({ className = '', priority = false }: VisualProps) {
  return (
    <div className={`roalla-artwork-motion roalla-command-centre ${className}`} data-testid="digital-command-centre-hero" aria-hidden>
      <ArtworkImage src="/images/services/technology-advisory-hero.opt.webp" priority={priority} className="object-cover object-center" />
      <svg className="roalla-artwork-overlay roalla-command-overlay" viewBox="0 0 1024 576" preserveAspectRatio="xMidYMid slice" fill="none">
        <defs><filter id="command-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3.5" /></filter></defs>
        <g className="roalla-command-flow">{commandPaths.map((path, index) => <path key={path} d={path} pathLength="100" style={{ animationDelay: `${index * -0.9}s` }} />)}</g>
        <g className="roalla-command-indicators">
          {[[512, 206], [663, 130], [828, 187], [920, 232], [811, 469]].map(([cx, cy], index) => (
            <g key={`${cx}-${cy}`} style={{ animationDelay: `${index * -0.42}s` }}><circle cx={cx} cy={cy} r="5" /><circle className="roalla-command-ring" cx={cx} cy={cy} r="13" /></g>
          ))}
        </g>
        <g className="roalla-command-dashboard" transform="translate(724 328)">
          <rect width="132" height="72" rx="8" /><path className="roalla-dashboard-grid" d="M12 19H120M12 36H120M12 53H120M39 12V61M66 12V61M93 12V61" />
          <path className="roalla-dashboard-chart" pathLength="1" d="M12 53L31 46L47 49L65 31L82 39L101 21L120 25" /><circle className="roalla-dashboard-cursor" cx="101" cy="21" r="3.5" />
        </g>
        <g className="roalla-command-readout" transform="translate(846 332)"><rect width="72" height="48" rx="7" /><path d="M12 13H39M12 22H57M12 31H48" /><circle cx="58" cy="13" r="4" /></g>
        <circle className="roalla-command-core-glow" cx="706" cy="313" r="20" filter="url(#command-glow)" />
      </svg>
    </div>
  )
}

const particleStyles = Array.from({ length: 22 }, (_, index) => ({
  '--particle-x': `${43 + ((index * 19) % 48)}%`, '--particle-y': `${14 + ((index * 31) % 72)}%`,
  '--particle-target-x': `${72 + ((index % 4) * 5)}%`, '--particle-target-y': `${34 + ((index % 6) * 6)}%`,
  '--particle-delay': `${-(index % 9) * 0.46}s`, '--particle-size': `${index % 5 === 0 ? 5 : index % 3 === 0 ? 4 : 3}px`,
} as CSSProperties))

const automationPaths = [
  'M676 294C598 235 512 187 410 160', 'M676 294C621 223 580 176 563 137',
  'M676 294C686 218 693 169 699 128', 'M676 294C755 233 806 188 855 157',
  'M676 294C615 351 559 393 493 430', 'M676 294C648 368 625 423 612 478',
  'M676 294C727 361 761 413 788 477', 'M676 294C794 349 855 391 918 434',
] as const

export function DigitalTransformationVisual({ className = '', priority = false }: VisualProps) {
  return (
    <div className={`roalla-artwork-motion roalla-transformation ${className}`} data-testid="digital-transformation-hero" aria-hidden>
      <ArtworkImage src="/images/services/automation-hero.opt.webp" priority={priority} className="object-cover object-center" />
      <svg className="roalla-artwork-overlay roalla-automation-overlay" viewBox="0 0 1024 576" preserveAspectRatio="xMidYMid slice" fill="none">
        <g className="roalla-automation-streams">{automationPaths.map((path, index) => <path key={path} d={path} pathLength="100" style={{ animationDelay: `${index * -0.52}s` }} />)}</g>
        <g className="roalla-automation-hub"><path d="M654 278L676 266L698 278V304L676 317L654 304Z" /><path d="M662 283L676 275L690 283V299L676 307L662 299Z" /></g>
      </svg>
      <div className="roalla-particle-field">{particleStyles.map((style, index) => <span key={index} className="roalla-transform-particle" style={style} />)}</div>
    </div>
  )
}
