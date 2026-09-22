# @roalla/design-system

Canonical, versioned Roalla visual tokens and logo. React apps import `@roalla/design-system/base.css` (or `tokens.css`); static surfaces sync `tokens.css` and `logo.svg` into their public folder and load them before product stylesheets. Product CSS may define layout, but must map colours, typography, radii, shadows, and focus treatment to these tokens.

## Corporate standards

| Token | Value |
|---|---|
| Brand teal | `#00b4c5` (`--roalla-color-brand`) |
| Accent gold | `#f5c518` (`--roalla-color-accent`) — not `#ffd700` |
| Body font | Figtree (`--roalla-font-body`) |
| Display font | Sora (`--roalla-font-display`) |
| Logo | `logo.svg` (SHA-256 in `checksums.json`) |

## Consumption

**Preferred (React / Node workspaces):** depend on this package.

- Inside the RCOS monorepo: `"@roalla/design-system": "workspace:1.0.0"`.
- Sibling apps until GitHub Packages publish is wired: vendor this directory (same pattern as `@roalla/auth`) and depend with `"@roalla/design-system": "file:../../vendor/roalla-design-system"`, then `import "@roalla/design-system/tokens.css"`.

**Static hubs (Auth Hub, AI Gateway):** keep served adapters under `public/roalla-tokens.css` and `public/roalla-logo.svg`. Generate them with the export script; do not hand-edit. CI must verify digests against `checksums.json`.

**Publish (when registry access is available):** `pnpm publish --filter @roalla/design-system --access restricted` to `https://npm.pkg.github.com` with org scope `@roalla`.

## Sync / export

From the RCOS repo root:

```bash
node scripts/export-design-system.mjs ../roalla-auth-hub ../roalla-ai-gateway ../roalla-tools ../roallawebsite
```

Writes vendor snapshots and public adapters. Re-run after any token or logo change, then refresh `checksums.json` if you edit files here:

```bash
node scripts/refresh-design-system-checksums.mjs
```
