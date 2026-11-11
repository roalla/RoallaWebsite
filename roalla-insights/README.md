# ROALLA Insights

Lightweight bilingual product-discovery and lead-generation application for ROALLA's advisory, digital and enablement portfolio. ROALLA Insights is operated by ROALLA Business Enablement Group.

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
