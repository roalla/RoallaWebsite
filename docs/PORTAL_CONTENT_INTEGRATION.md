# Integrating Portal Links and Downloadable Resources

The **Downloadable resources** and **Portal links** sections are conceptually the same: content items on the Resources Portal with title, description, category, URL(s), and access control (gated/locked). This doc recommends ways to integrate them.

---

## Current state

| Aspect | Downloadable resources | Portal links |
|--------|------------------------|--------------|
| **Admin** | `/admin/portal-resources` | `/admin/portal-articles` |
| **Model** | `portalResource` (downloadUrl, linkUrl, color, viewOnly) | `portalArticle` (url, readTime, category) |
| **Client portal** | “Downloadable Resources” – 2-col grid, gradient tiles | “Links” – 4-col grid, smaller cards |
| **Shared** | title, description, category/type, sortOrder, gated, lockedByAdmin, trustCategory |

---

## Recommended approach: unified “Portal content”

### Option A – Single admin entry + single list (recommended long-term)

**Idea:** Treat every item as **one content type** with optional file and optional link.

- **Data:** Use a single table (e.g. keep `portalResource` and extend it). Each item can have:
  - `downloadUrl` (optional) – for PDFs/files
  - `linkUrl` (optional) – for external or internal links
- “Link-only” items are just items with only `linkUrl` set (no `downloadUrl`).
- **Migration:** Copy `portalArticle` rows into `portalResource`: `url` → `linkUrl`, `category` → `type`, `readTime` → store in description or a new optional `label` field. Then deprecate `portalArticle` and the portal-articles API.
- **Admin:** One page “Portal content” with one list. Add/Edit form:
  - **Type:** “File / download” (optional link) or “Link only” (destination URL).
  - For “File / download”: Download URL, optional Link URL, view-only checkbox, color.
  - For “Link only”: Destination URL, optional label (readTime).
  - Shared: title, description, category, order, gated, locked, trust badge.
- **Client portal:** One section “Content” or “Resources & links” with a single grid. Use a small badge or icon to distinguish “Download” vs “Link” tiles if desired.

**Pros:** One place to manage everything; one content API; clearer model.  
**Cons:** Requires migration and updates to bundles/access (which reference both resources and articles).

---

### Option B – One admin page, two tabs (minimal backend change)

**Idea:** Keep `portalResource` and `portalArticle` and their APIs, but expose them from **one** admin page.

- Add a single admin route, e.g. `/admin/portal-content`, with two tabs: **Downloadable resources** and **Links**.
- Each tab shows the existing list and form (reuse current components or embed the existing pages in iframes/tabs).
- On the main portal landing (`/admin/portal`), replace the two cards with **one** card: “Portal content (resources & links)” → `/admin/portal-content`.

**Pros:** No DB migration; reuse existing APIs and logic.  
**Cons:** Still two lists and two models; bundles/access continue to reference both.

---

### Option C – Only change the admin portal landing page (quick win)

**Idea:** Don’t merge the backend or the admin list. Only change how the two sections are presented on `/admin/portal`.

- Replace the two separate cards (“Downloadable resources” and “Portal links”) with **one** card:
  - **Title:** “Portal content (resources & links)”
  - **Description:** “Add or edit resource tiles and links: guides, templates, tools, and external or internal links. Lock items or set view-only.”
  - **Link:** Either to a new combined page (Option B) or to the existing “Downloadable resources” page with a clear note and link to “Portal links” at the top.
- Optionally add a second step in the “How to use” guide that says: “Use the same page for both files and links” (once you have a combined page).

**Pros:** Very fast; makes it clear that the two are related.  
**Cons:** Still two separate admin pages unless you implement Option B.

---

## Client portal display

Today the portal has two sections: “Downloadable Resources” and “Links.” To align with the integration:

- **If you unify the model (Option A):** Use one section, e.g. “Portal content” or “Resources & links,” with one grid. Optionally show a small “Download” or “Link” badge per tile.
- **If you keep two backends (B or C):** You can still show one section by merging the two lists in the frontend: sort by a combined `sortOrder` (e.g. resources first by order, then links by order), or use a single “content” array and one grid. The API can stay as-is (resources + articles) and the client merges and renders one list.

---

## Summary

- **Quick win:** Option C – one card on `/admin/portal` for “Portal content (resources & links)” and a small copy/UX tweak so both concepts feel like one area.
- **Better UX, no migration:** Option B – new `/admin/portal-content` with two tabs, and one card on the portal landing.
- **Cleanest long-term:** Option A – single content model and one admin list; migrate articles into resources and retire the articles table/API.

If you tell me which option you prefer (A, B, or C), I can outline the exact file and API changes next.
