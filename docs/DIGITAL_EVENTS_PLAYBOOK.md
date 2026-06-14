# Digital Events — Product Promotion Playbook (Internal)

**Audience:** Roalla team · discovery, scoping, delivery  
**Public page:** [/en/services/digital-events](https://www.roalla.com/en/services/digital-events)  
**Internal URL:** `/en/private/digital-events-playbook` (not indexed; not in sitemap)  
**Anchor proof:** [coldbru.dejabru.ca](https://coldbru.dejabru.ca)

---

## How to use this

1. Open during discovery when a prospect mentions trade shows, booths, launches, or investor days.
2. Use the feature catalog to scope what to propose—not everything on every deal.
3. Use packages as starting proposals; adjust timeline after content-readiness review.
4. Use the discovery checklist before sending a quote or ship-date commitment.
5. Use Cold Deja Bru as the anchor proof when the buyer needs “show me something real.”

---

## Core flow

1. Scan (QR or NFC)
2. Product story
3. Interactive demo
4. Lead or next step
5. Post-event follow-up

---

## Booth feature catalog

### Source-attributed entry paths · Small (days)

- **What:** One event URL with multiple entry points—main booth QR, demo station QR, speaker slide QR, partner co-brand QR. Each path tags the visit (UTM + internal source param).
- **Why:** Sales knows which booth moment drove interest. Product teams learn which story angle converts.
- **Roalla fit:** Lightweight routing on a single Next.js page. No app store. Fast for urgent timelines.
- **Dependencies:** QR artwork per entry point · Analytics or spreadsheet export

### Guided product demo flows · Medium (1–2 weeks)

- **What:** Step-by-step “how it works,” before/after sliders, short product video with chapters, ROI calculators, or product-fit quiz ending in a recommended tier.
- **Why:** Booth staff repeat one story; visitors self-serve when the booth is busy.
- **Roalla fit:** Business Cocoon-style guided workflows. Reusable “demo wizard” module.
- **Dependencies:** Product copy and visuals · Demo step outline from client

### Floor-optimized lead capture · Small (days)

- **What:** Event forms with 2–4 fields: book a demo, send spec sheet, investor/partner/distributor path split, SMS/email opt-in with instant one-pager, vCard for reps.
- **Why:** Generic contact forms underperform on noisy show floors.
- **Roalla fit:** Webhook, HubSpot, Salesforce, Pipedrive, or Google Sheet.
- **Dependencies:** CRM or inbox destination · Persona definitions

### Live booth dashboard (staff-only) · Medium (1–2 weeks)

- **What:** Private view: scans by hour and QR source, demo step completion/drop-off, form submits, swap hero offer mid-show without redeploy.
- **Why:** Booth managers adjust pitch in real time; post-show debrief is data-backed.
- **Roalla fit:** Small admin slice on the same event site.
- **Dependencies:** Auth (password or magic link) · Analytics events in demo flow

### Digital takeaway kit · Small (days)

- **What:** After scan or submit: branded one-pager, shareable “send to colleague” link, pre-written social post + image, optional sample/coupon code.
- **Why:** Product promotion continues after they leave the aisle.
- **Roalla fit:** Static assets + one dynamic share page.
- **Dependencies:** PDF or mobile one-pager · Share copy approval

---

## Pre / during / post event

| Phase | Feature | Product value |
|-------|---------|---------------|
| Pre-event | Personalized invite links for VIP list | Warm traffic arrives oriented to the product |
| Pre-event | Countdown / “See us at Booth #” page | Drives planned visits; SEO for event + product |
| During | Session deep links from stage QR | Captures audience when product is shown live |
| During | Live poll (“Which pain point hits hardest?”) | Qualifies leads; feeds sales talk tracks |
| Post-event | Segmented follow-up pages by interest | “You asked about X—here’s the demo + offer” |
| Post-event | Replay hub (session clips + product CTAs) | Extends launch moment for investors and press |

---

## Selective add-ons (scope carefully)

- AR / 3D product viewer — heavier content pipeline
- Live inventory or “available at booth” — retail/showroom
- Gamified booth challenge + leaderboard — needs moderation
- Native event app — microsite + PWA is usually enough
- Badge scan / lead retrieval — depends on organizer APIs

---

## Productized packages

### Booth Conversion Kit (1–3 weeks)

Trade shows, investor booths, product sampling — extension of Cold Deja Bru.

- QR/NFC landing page
- Guided demo flow (3–8 steps)
- Persona-split CTAs (buyer / partner / press)
- Lead capture + CRM handoff
- Basic analytics (scans, completions, submits)

### Launch Moment Kit (1–2 weeks)

On-stage launches, partner days, sponsor activations.

- Reveal-style hero + product narrative
- Press / investor / customer CTA paths
- Share kit + downloadable assets
- Post-launch redirect to main product site

### Event Hub + Session QR Kit (3–8 weeks)

Conferences and multi-day events.

- Registration / agenda microsite
- Per-session QR deep links to product pages
- Post-event nurture pages by interest tag
- Staff dashboard

### Interactive Product Fit App (scoped)

Complex B2B products where qualification matters.

- Custom wizard or scorecard (Business Cocoon pattern)
- Exportable brief for sales follow-up
- Optional bilingual EN/FR

---

## Discovery checklist

- Product type and primary demo story (30-second pitch)
- Event name, date, and fixed ship deadline
- Number of QR entry points and who each one serves
- Personas: buyer, partner, press, investor, distributor?
- CRM or inbox for leads
- Languages required (EN, FR, both)
- Post-event follow-up owner on client side
- Content readiness: copy, photos, video, legal approvals

---

## Cold Deja Bru reference

**Shipped:** Investor booth landing — six-step MR. COLDBRU demo grid, QR-first entry, co-branding CTAs, urgent timeline.

**Upsell on the next similar deal:**

- Source-attributed QRs (booth vs demo station vs session slide)
- Persona-split CTAs with CRM handoff
- Post-event segmented follow-up by demo completion
- Staff dashboard for scan and drop-off visibility

---

## Do not lead with

- “Full event app” language — sounds expensive and slow
- Generic “engagement” without a product outcome
- AR / 3D unless budget and asset pipeline are confirmed
- Badge-scan integrations unless organizer API is validated
- Gamification unless brand and moderation plan are clear

---

## Safe for the public Digital Events page

Do **not** expose package names, CRM lists, or staff dashboard details publicly. These outcome phrases **are** on the customer-facing page:

- Multiple QR entry points so you know which booth moment drove interest
- Step-by-step product demos visitors can finish while your team is with other guests
- Separate next steps for buyers, partners, and press—not one generic form
- Instant shareable product summary visitors can forward after they leave the aisle
- Follow-up pages tied to what each visitor viewed at the show

---

*Source of truth in code: `src/lib/digital-events-playbook.ts`*
