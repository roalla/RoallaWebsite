# ROALLA Insights

Lightweight bilingual sales-campaign landing-page application operated by ROALLA Business Enablement Group.

## Campaign-only role

ROALLA Insights is intentionally not a corporate website, service catalogue, resource hub or general product directory. The homepage is a short outcome hub. Each public campaign page supports one audience, one offer, a focused proof path and a clear conversion action. The complete evergreen service portfolio remains on `www.roalla.com`.

### Current routes

| Path | Role |
| --- | --- |
| `/en/`, `/fr/` | Campaign hub (photo tiles) |
| `/en/campaigns/visibility-review/` | Website & AI Visibility Review |
| `/en/campaigns/ai-employee-readiness/` | AI Employee & Agent Readiness |
| Matching `/fr/campaigns/...` | French campaign landings |

Deep-link ads and email to a specific `/campaigns/{slug}/` URL. Hub traffic is for choosing a campaign.

New campaigns should be added as dedicated localized landing pages only after the audience, offer, campaign message, attribution and destination CTA are defined.

## Local development

Requires Node.js 20 or newer. No third-party runtime dependencies are required.

```powershell
npm run build
$env:PORT=3000
npm start
```

Open `http://localhost:3000`. The health endpoint is `/_health`.

## Tests

```powershell
npm test
```

## Railway deployment

Create or select a Railway service from the parent repository and set **Root Directory** to `/roalla-insights`. Railway will use `railway.json`, run `npm run build`, start with `npm start`, and inject `PORT` automatically.

Set `SITE_URL` during the build when the production hostname differs from the default `https://www.roallainsights.com`. The value is used for canonical URLs, structured data, `robots.txt`, and `sitemap.xml`.

## Attribution

The client preserves `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, and `msclkid` in browser-local storage and adds them to outbound ROALLA calls to action. No server-side visitor profile is created by this application.
