# Roalla brand rules

Short corporate rules for product and marketing surfaces. Tokens live in `tokens.css` / `tokens.json`; this file is the human checklist.

## Fonts

| Role | Family | CSS token |
|---|---|---|
| UI body / UI chrome | **Figtree** | `--roalla-font-body` |
| Display titles / product name lockups | **Sora** | `--roalla-font-display` |

Do not introduce a third product font (no Inter, Merriweather, or Material defaults) on Roalla-owned surfaces. Marketing may adjust weight and letter-spacing, not the family.

## Color

| Role | Value | Notes |
|---|---|---|
| Brand teal | `#00b4c5` | Primary actions, links, focus companions |
| Deep teal | `#007a87` / mid `#0099a8` | Hover / emphasis |
| Accent gold | `#f5c518` | Focus rings, CTA highlight, brand accent — **not** `#ffd700` |
| Ink / navy | `#0f172a` | Topbars, footers, dark chrome |

Utility colors (success, danger, “internal” badges) are semantic, not brand. Do not use purple as a brand accent.

## Logo

- Use the canonical `logo.svg` from this package (checksum in `checksums.json`).
- Lockup: logo mark + **Roalla** wordmark + optional product subtitle (e.g. Tools, RCOS Platform).
- Do not redraw, recolor, or substitute a different mark per app.

## Naming

| Use | Form |
|---|---|
| Company / brand | **Roalla** (title case; avoid `ROALLA` in UI chrome) |
| Legal / long form | Roalla Business Enablement Group (footer, contracts) |
| Product shell labels | **Operators:** Home · Studio · Apps · Documentation · Account. **Customers (Client Portal):** Projects · Account only — never Studio / Apps / Documentation |
| Product subtitles | Short noun after the brand (Tools, Platform, Home, Client Portal) — not a second brand name |

## Shell

Logged-in Roalla **operator** apps use `@roalla/app-shell` with `audience="operator"` (or a static adapter with the same structure and labels). **Client Portal** uses `audience="customer"` so customers never see Home / Studio / Apps / Documentation. Authentication and routing stay in each app.

## Drift control

Sibling repos must keep `tokens.css` and `logo.svg` digests identical to `checksums.json`. Run `product:validate` / brand-adapter checks in CI; refresh vendors with `design-system:export` from the RCOS repo root after token or logo changes.
