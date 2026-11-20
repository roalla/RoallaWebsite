import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const visuals = {
  legal: {
    en: [
      ['Attract & Qualify', 'Visibility, practice-area journeys, referrals, and fit'],
      ['Intake & Respond', 'Calls, inquiries, consultations, conflicts, and handoff'],
      ['Manage Matters & Documents', 'Matter workflows, documents, knowledge, and automation'],
      ['Connect Teams & Clients', 'Calling, collaboration, client updates, and secure exchange'],
      ['Protect & Govern', 'Identity, privilege, resilience, retention, and oversight'],
    ],
    fr: [
      ['Attirer et qualifier', 'Visibilité, parcours par domaine, références et adéquation'],
      ['Accueillir et répondre', 'Appels, demandes, consultations, conflits et transfert'],
      ['Gérer dossiers et documents', 'Flux de dossiers, documents, savoir et automatisation'],
      ['Relier équipes et clients', 'Appels, collaboration, suivis clients et échange sécurisé'],
      ['Protéger et gouverner', 'Identité, privilège, résilience, conservation et supervision'],
    ],
  },
  manufacturing: {
    en: [
      ['Win & Plan', 'Demand, customer visibility, forecasting, and capacity signals'],
      ['Quote & Order', 'Requirements, estimates, approvals, orders, and promise dates'],
      ['Produce & Fulfill', 'Production, inventory, quality, shipping, and service'],
      ['Connect Plant & Teams', 'Plant connectivity, calling, alerts, collaboration, and handoffs'],
      ['Protect & Improve', 'IT and OT security, continuity, analytics, and improvement'],
    ],
    fr: [
      ['Gagner et planifier', 'Demande, visibilité client, prévisions et signaux de capacité'],
      ['Soumissionner et commander', 'Exigences, estimations, approbations, commandes et dates'],
      ['Produire et exécuter', 'Production, inventaire, qualité, expédition et service'],
      ['Relier usine et équipes', 'Connectivité, appels, alertes, collaboration et transferts'],
      ['Protéger et améliorer', 'Sécurité TI et TO, continuité, analytique et amélioration'],
    ],
  },
  retail: {
    en: [
      ['Attract & Convert', 'Visibility, campaigns, commerce, and conversion paths'],
      ['Capture & Respond', 'Calls, messages, inquiries, bookings, and follow-up'],
      ['Sell & Fulfill', 'Point of sale, inventory, orders, payments, and delivery'],
      ['Connect Teams & Locations', 'Calling, collaboration, connectivity, and shared operations'],
      ['Protect & Improve', 'Security, continuity, analytics, governance, and improvement'],
    ],
    fr: [
      ['Attirer et convertir', 'Visibilité, campagnes, commerce et parcours de conversion'],
      ['Saisir et répondre', 'Appels, messages, demandes, réservations et suivi'],
      ['Vendre et exécuter', 'Point de vente, inventaire, commandes, paiements et livraison'],
      ['Relier équipes et établissements', 'Appels, collaboration, connectivité et opérations'],
      ['Protéger et améliorer', 'Sécurité, continuité, analytique, gouvernance et amélioration'],
    ],
  },
}

const panels = [
  { x: 70, y: 105, w: 420, h: 175 },
  { x: 950, y: 105, w: 420, h: 175 },
  { x: 35, y: 510, w: 420, h: 175 },
  { x: 985, y: 510, w: 420, h: 175 },
  { x: 510, y: 680, w: 420, h: 175 },
]

const escapeXml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

function wrap(value, max) {
  const words = value.split(' ')
  const lines = []
  for (const word of words) {
    const last = lines.at(-1)
    if (!last || `${last} ${word}`.length > max) lines.push(word)
    else lines[lines.length - 1] = `${last} ${word}`
  }
  return lines
}

function textLines(lines, x, y, className, step) {
  return `<text x="${x}" y="${y}" class="${className}">${lines
    .map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : step}">${escapeXml(line)}</tspan>`)
    .join('')}</text>`
}

function renderSvg(industry, language, categories) {
  const title = language === 'fr' ? `Catégories technologiques ${industry}` : `${industry} technology categories`
  const panelMarkup = categories.map(([label, detail], index) => {
    const panel = panels[index]
    const titleLines = wrap(label, 24).slice(0, 2)
    const detailLines = wrap(detail, 39).slice(0, 3)
    const titleY = panel.y + 54
    const detailY = titleY + (titleLines.length - 1) * 32 + 39
    return `<g class="panel p${index + 1}"><rect x="${panel.x}" y="${panel.y}" width="${panel.w}" height="${panel.h}" rx="24"/>${textLines(titleLines, panel.x + 36, titleY, 'label', 32)}${textLines(detailLines, panel.x + 36, detailY, 'detail', 25)}</g>`
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(title)}</title><desc id="desc">ROALLA connects five technology outcomes for ${escapeXml(industry)}.</desc>
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#071522"/><stop offset="1" stop-color="#0b2630"/></linearGradient><linearGradient id="panel" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#123546"/><stop offset="1" stop-color="#0b2230"/></linearGradient><radialGradient id="halo"><stop stop-color="#00b4c5" stop-opacity=".25"/><stop offset="1" stop-color="#00b4c5" stop-opacity="0"/></radialGradient><filter id="shadow" x="-20%" y="-30%" width="140%" height="160%"><feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#000" flood-opacity=".36"/></filter><style>.connector{fill:none;stroke:#39d5df;stroke-width:3;stroke-linecap:round;stroke-dasharray:10 14;opacity:.58;animation:flow 6s linear infinite}.node{fill:#d4af37;filter:url(#shadow);animation:pulse 2.8s ease-in-out infinite}.panel{fill:url(#panel);stroke:#3bd1dc;stroke-opacity:.36;stroke-width:2;filter:url(#shadow);animation:drift 5s ease-in-out infinite}.p2{animation-delay:-1s}.p3{animation-delay:-2s}.p4{animation-delay:-3s}.p5{animation-delay:-4s}.label{fill:#fff;font:700 27px Georgia,serif}.detail{fill:#bdcbd3;font:400 17px Arial,sans-serif}@keyframes flow{to{stroke-dashoffset:-96}}@keyframes pulse{50%{opacity:.48;transform:scale(.84);transform-origin:center}}@keyframes drift{50%{transform:translateY(-7px)}}@media (prefers-reduced-motion:reduce){.connector,.node,.panel{animation:none}}</style></defs>
  <rect width="1440" height="900" rx="36" fill="url(#bg)"/><circle cx="720" cy="450" r="295" fill="url(#halo)"/><g aria-hidden="true"><path class="connector" d="M590 386 451 280M850 386l139-106M572 474 414 530M868 474l158 56M720 574v100"/><circle class="node" cx="451" cy="280" r="7"/><circle class="node" cx="989" cy="280" r="7"/><circle class="node" cx="414" cy="530" r="7"/><circle class="node" cx="1026" cy="530" r="7"/><circle class="node" cx="720" cy="674" r="7"/></g>${panelMarkup}
  <g filter="url(#shadow)"><circle cx="720" cy="450" r="142" fill="#071722" stroke="#d4af37" stroke-width="3"/><circle cx="720" cy="450" r="126" fill="none" stroke="#00b4c5" stroke-opacity=".32" stroke-width="2"/><g fill="#00B4C5" transform="translate(635 346) scale(.17)"><path d="M454 222 86 116l24 58h32v46h32l80 306 174-83z"/><path d="m546 222 368-106-24 58h-32v46h-32l-80 306-174-83z"/><path d="m428 478-168 82 119 196 89-211z"/><path d="m572 478 168 82-119 196-89-211z"/><path d="M500 188 698 756h-92L500 449 394 756h-92z"/></g><text x="720" y="557" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="23" font-weight="700" letter-spacing="5">ROALLA</text></g></svg>`
}

const outputDirectory = path.resolve('public/images/industries')
await fs.mkdir(outputDirectory, { recursive: true })

for (const [industry, languages] of Object.entries(visuals)) {
  for (const [language, categories] of Object.entries(languages)) {
    const suffix = language === 'fr' ? '.fr' : ''
    const baseName = `${industry}-technology-categories${suffix}`
    const svg = renderSvg(industry, language, categories)
    await fs.writeFile(path.join(outputDirectory, `${baseName}.svg`), svg)
    await sharp(Buffer.from(svg), { density: 144 }).resize(1440, 900).webp({ quality: 88 }).toFile(path.join(outputDirectory, `${baseName}.webp`))
  }
}
