import Image from "next/image";

export type CinematicHeroVariant =
  | "growth-visibility"
  | "automation-ai"
  | "execution"
  | "experience-products"
  | "security-compliance"
  | "digital-products"
  | "ai-agents"
  | "security-risk-compliance"
  | "managed-optimization";

type Props = {
  variant: CinematicHeroVariant;
  className?: string;
  priority?: boolean;
};

const baseArtwork: Partial<Record<CinematicHeroVariant, string>> = {
  "growth-visibility": "/images/services/search-ai-visibility-hero.opt.webp",
  "automation-ai": "/images/services/automation-hero.opt.webp",
  execution: "/images/services/technology-advisory-hero.opt.webp",
  "experience-products": "/images/services/website-design-hero.opt.webp",
  "digital-products": "/images/services/digital-outcome-launch.opt.webp",
  "ai-agents": "/images/services/ai-agents-hero.opt.webp",
  "managed-optimization": "/images/services/digital-outcome-operations.opt.webp",
};

const flowPaths = {
  "growth-visibility": ["M620 180C735 130 845 140 940 220", "M650 390C760 330 860 335 1025 405", "M705 275C815 235 920 260 1080 205"],
  "automation-ai": ["M590 150H730V235H865", "M590 300H715V300H865", "M590 450H730V365H865", "M865 235C945 235 950 300 1025 300", "M865 365C945 365 950 300 1025 300"],
  execution: ["M610 430C715 395 775 420 850 350S990 295 1090 215", "M610 470H1090"],
  "experience-products": ["M650 210C735 145 850 145 945 210", "M650 390C760 455 900 455 1010 360"],
  "security-compliance": ["M590 170C720 165 750 215 820 265", "M590 430C720 435 750 385 820 335", "M990 300H1110"],
  "digital-products": ["M590 160H700", "M590 300H700", "M590 440H700", "M980 300H1100"],
  "ai-agents": ["M590 160C710 165 740 220 810 270", "M590 300H785", "M590 440C710 435 740 380 810 330", "M970 300H1090"],
  "security-risk-compliance": ["M600 150C720 170 750 220 820 265", "M600 450C720 430 750 380 820 335", "M990 300H1100"],
  "managed-optimization": ["M610 390C700 345 770 410 850 335S990 280 1090 210", "M610 460H1090"],
} satisfies Record<CinematicHeroVariant, readonly string[]>;

function InterfaceCards({ product = false }: { product?: boolean }) {
  return (
    <g className="cinematic-cards">
      <g className="cinematic-card cinematic-card-a" transform="translate(660 125)">
        <rect width="330" height="220" rx="18" />
        <circle cx="25" cy="24" r="4" /><circle cx="40" cy="24" r="4" /><circle cx="55" cy="24" r="4" />
        <path d="M22 54H308M105 54V198" />
        {product ? <><rect className="cinematic-card-block" x="126" y="78" width="158" height="34" rx="7" /><rect className="cinematic-card-block" x="126" y="127" width="72" height="52" rx="7" /><rect className="cinematic-card-block" x="212" y="127" width="72" height="52" rx="7" /></> : <><path className="cinematic-card-chart" d="M126 168C157 151 175 161 201 132S247 115 284 83" /><circle className="cinematic-hotspot" cx="284" cy="83" r="7" /></>}
      </g>
      <g className="cinematic-card cinematic-card-b" transform="translate(935 345)"><rect width="185" height="120" rx="15" /><path d="M20 31H100M20 54H155M20 77H130" /><rect className="cinematic-card-block" x="20" y="92" width="86" height="10" rx="5" /></g>
      <path className="cinematic-cursor" d="M1002 270L1018 310L1028 294L1047 313L1056 304L1037 285L1054 276Z" />
    </g>
  );
}

function VariantArtwork({ variant }: { variant: CinematicHeroVariant }) {
  if (variant === "growth-visibility") return <><g className="cinematic-orbits" transform="translate(875 294)"><circle r="55" /><circle r="105" /><circle r="155" /><path d="M-20-20L22 22M-20 22L22-20" /></g><g className="cinematic-search" transform="translate(850 270)"><circle r="78" /><path d="M56 56L116 116" /></g><g className="cinematic-rank-bars" transform="translate(990 155)"><rect width="22" height="115" rx="6" /><rect x="34" y="45" width="22" height="70" rx="6" /><rect x="68" y="72" width="22" height="43" rx="6" /></g></>;
  if (variant === "automation-ai") return <><g className="cinematic-workflow">{[[590,130],[590,280],[590,430],[830,215],[830,345],[1025,270]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}><rect width="92" height="58" rx="12" /><circle cx="22" cy="29" r="7" /><path d="M38 23H72M38 35H64" /></g>)}</g><g className="cinematic-gear" transform="translate(910 300)"><circle r="64" /><circle r="24" /><path d="M0-92V-67M65-65L47-47M92 0H67M65 65L47 47M0 92V67M-65 65L-47 47M-92 0H-67M-65-65L-47-47" /></g></>;
  if (variant === "execution") return <><g className="cinematic-dashboard" transform="translate(650 115)"><rect width="430" height="340" rx="22" /><path d="M28 57H402M28 286H402" /><g className="cinematic-bars">{[105,165,130,210,245,190].map((h,i)=><rect key={i} x={45+i*53} y={270-h} width="25" height={h} rx="5" />)}</g><path className="cinematic-chart" d="M45 235L113 205L166 218L230 153L288 170L357 94" /><circle className="cinematic-hotspot" cx="357" cy="94" r="8" /></g></>;
  if (variant === "experience-products") return <InterfaceCards />;
  if (variant === "digital-products") return <InterfaceCards product />;
  if (variant === "security-compliance" || variant === "security-risk-compliance") return <><g className="cinematic-shield" transform="translate(900 295)"><path d="M0-145C55-116 101-112 130-108V-15C130 77 72 127 0 157C-72 127-130 77-130-15V-108C-101-112-55-116 0-145Z" /><path d="M-43 2L-12 34L53-39" /></g><g className="cinematic-radar" transform="translate(900 295)"><circle r="185" /><circle r="225" /><path d="M0 0L152-106" /></g>{variant === "security-risk-compliance" ? <g className="cinematic-control-grid" transform="translate(1020 105)">{[0,1,2].flatMap(row=>[0,1].map(col=><rect key={`${row}-${col}`} x={col*48} y={row*48} width="34" height="34" rx="7" />))}</g> : null}</>;
  if (variant === "ai-agents") return <><g className="cinematic-agent" transform="translate(890 300)"><circle r="116" /><circle r="72" /><path d="M-33-16H33M-33 16H18" /><circle cx="-45" cy="-50" r="8" /><circle cx="45" cy="-50" r="8" /><circle cx="0" cy="58" r="8" /></g><g className="cinematic-tools">{[[600,125],[600,270],[600,415],[1035,125],[1035,415]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}><rect width="82" height="58" rx="13" /><circle cx="25" cy="29" r="8" /><path d="M42 23H66M42 35H60" /></g>)}</g><g className="cinematic-approval" transform="translate(1015 258)"><rect width="116" height="84" rx="14" /><path d="M25 42L45 61L88 20" /></g></>;
  return <><g className="cinematic-telemetry" transform="translate(640 120)"><rect width="440" height="330" rx="22" /><path d="M28 62H412M28 270H412" /><path className="cinematic-chart" d="M35 235C92 222 113 170 161 184S233 228 276 151S350 132 405 84" /><g className="cinematic-metrics"><circle cx="85" cy="105" r="24" /><circle cx="155" cy="105" r="24" /><circle cx="225" cy="105" r="24" /></g></g><g className="cinematic-loop" transform="translate(1005 380)"><path d="M-55 5A62 62 0 1 1 18 57" /><path d="M18 57L7 31M18 57L45 49" /></g></>;
}

export default function RouteCinematicHero({ variant, className = "", priority = false }: Props) {
  const image = baseArtwork[variant];
  return (
    <div className={`route-cinematic-hero route-cinematic-${variant} ${className}`} data-hero-variant={variant} aria-hidden>
      {image ? <Image src={image} alt="" fill priority={priority} fetchPriority={priority ? "high" : "auto"} unoptimized sizes="100vw" className="route-cinematic-image" /> : null}
      <div className="route-cinematic-grid" />
      <svg className="route-cinematic-svg" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" fill="none">
        <defs><filter id={`cinematic-glow-${variant}`} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        <g className="cinematic-flow" filter={`url(#cinematic-glow-${variant})`}>{flowPaths[variant].map((d,index)=><path key={d} d={d} pathLength="100" style={{ animationDelay: `${index * -1.15}s` }} />)}</g>
        <VariantArtwork variant={variant} />
      </svg>
      <div className="route-cinematic-vignette" />
    </div>
  );
}
