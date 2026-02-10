# Resources Portal Improvements – Recommendations

This document recommends improvements for [https://roalla.com/en/resources/portal](https://roalla.com/en/resources/portal) to support:

1. **Access control** – Lock/unlock tiles by admin; unlock all or selected items per user; packages (bundles) via codes; full access for partners.
2. **In-page PDF viewing** – View PDFs without leaving the page or downloading (for sensitive/IP-protected content).
3. **Link and document protection** – Limit sharing of links and reuse; optional view-only mode to reduce IP exposure.

The portal serves **business users** in three main scenarios:

| Scenario | Who | How they get access | What they see |
|----------|-----|---------------------|----------------|
| **Consultation clients** | Businesses that requested consultation | Consultant approves request; consultant selects which items the client can use | Only tiles unlocked for that user/org |
| **Training / code-based** | Businesses that completed training | Special code (e.g. from consultant) unlocks a **bundle** of documents | Predefined package of resources + links |
| **Partners** | Partner organizations | Admin gives partner “full access” (or org-level access) | All content, or all content for their org |

---

## 1. Access control: lock/unlock and per-user access

### 1.1 Keep the tile UI; add “locked” state

- **Tiles** – Keep the current tile layout for both **Downloadable resources** and **Links** (articles). It is clear and professional.
- **Lock/unlock per item** – Each `PortalResource` and `PortalArticle` should be explicitly **locked** or **unlocked** by default from the admin perspective:
  - **Locked** – Item is hidden from the portal unless the viewer has been granted access (see below).
  - **Unlocked** – Item is visible to everyone who can reach the portal (current behaviour for non-gated items).

Recommendation: add a single **admin-controlled flag** per item, e.g. `lockedByAdmin Boolean @default(false)`. When `true`, the item is only visible to users who have been granted access to it (or have “unlock all” / partner access).

### 1.2 How to decide what a user can see

Use a single, consistent rule so the portal and API are simple:

**A user (identified by token+email, or by logged-in User) can see a tile if and only if:**

1. The tile is **not** locked by admin, **or**
2. The user has been granted access to that tile (see below), **or**
3. The user has **“unlock all”** (e.g. partner or full-access flag), **or**
4. The user has access via a **bundle/code** that includes that tile.

So:

- **Unlock all for a select user** – Store a “full portal access” flag for that user (e.g. on `AccessRequest` or on a new `PortalAccessGrant` table). When building the portal content API, if the viewer has this flag, return all tiles (respecting existing org scoping if you keep it).
- **Unlock only select items for a user** – Store per-user, per-item grants (e.g. “user/request X can see resource Y and article Z”). Your existing `GatedAccessGrant` is per-email and per-resource/article; the same idea can be used for the general portal: “this email/token can see these resource IDs and these article IDs.”

Suggested data model additions (conceptual):

- **PortalResource / PortalArticle**  
  - Add: `lockedByAdmin Boolean @default(false)`.

- **AccessRequest** (or a small extension table keyed by access request / user)  
  - Add: `fullAccess Boolean @default(false)`  
  - When `true`, this user sees all unlocked content (and optionally all locked content too). Use this for **partners** and “unlock all” clients.

- **Per-item grants**  
  - Option A: Reuse and extend **GatedAccessGrant** so it can be used for both “Trust Center gated” and “portal locked-item” access. Add a field like `source: 'gated_request' | 'portal_grant'` if you need to distinguish.  
  - Option B: New table **PortalItemGrant** – `email` (or `accessRequestId`), `resourceId?`, `articleId?`, `grantedByUserId?`, `grantedAt`.  
  - Either way: “Unlock only select items for a user” = create one grant per (user/request, resource or article).

Admin UI:

- In **Portal tiles** and **Portal articles** admin pages: add a **Lock/Unlock** toggle per item. Locked items only appear for users who have access (see above).
- New **Portal access** (or **User access**) admin section:
  - List approved access requests (and/or org users).
  - For each user: either set **Full access** (unlock all) or **Select items** (choose which locked resources/links they can see). Saving creates/updates the grants or full-access flag.

This gives you:

- **Consultation clients** – Consultant selects items in admin; only those tiles (plus any globally unlocked) appear.
- **Partners** – Mark them as full access (or associate with an org that has full access); they see everything.

---

## 2. Training / code-based bundles (packages)

- **Bundle** – A named set of resources and articles (e.g. “Post-training package Q1 2026”).
- **Code** – A short, unique code (e.g. `ROALLA-TRAIN-2026`) that, when entered in the portal, unlocks a specific bundle for that user/session.

Flow:

1. Admin creates a **Bundle** (name + list of PortalResource IDs + PortalArticle IDs).
2. Admin creates a **Code** linked to that bundle (code string, optional expiry, optional max redemptions).
3. User opens the portal with their normal access (token+email or login). In the portal UI they see a “Enter access code” (or “Redeem code”) field.
4. User enters the code. Backend validates:
   - Code exists, not expired, under redemption limit.
   - Optionally: code is tied to a training event or segment (if you need it).
5. On success: attach the bundle to that user’s session (or to their AccessRequest/User record so it persists). From then on, when loading portal content, include all resources/articles in that bundle for this user (in addition to whatever they already have from “unlock all” or per-item grants).

Data model (conceptual):

- **PortalBundle** – id, name, createdAt.  
- **PortalBundleItem** – bundleId, resourceId?, articleId? (many-to-many: a bundle has many resources/articles).  
- **PortalCode** – id, code (unique), bundleId, expiresAt?, maxRedemptions?, redeemedCount.  
- **PortalCodeRedemption** – codeId, email (or accessRequestId/userId), redeemedAt.  
  - When a user redeems a code, create a redemption and either:  
    - attach the bundle to the user’s “portal profile” (e.g. list of bundle IDs for this email/request), or  
    - store “user X has bundle Y” in a small table (e.g. **UserPortalBundle** – email/requestId, bundleId, redeemedAt).

Portal content API: when building the list of visible resources/articles, include:

- Unlocked items, plus  
- Items the user has via per-item grants, plus  
- Items the user has via “full access,” plus  
- Items that belong to any bundle the user has redeemed.

This supports **training clients** who receive a code from a consultant and get a fixed set of documents/links.

---

## 3. In-page PDF viewer (view without leaving or downloading)

- **Goal** – For selected resources (e.g. PDFs), allow the user to **view** the file inside the portal page, without opening a new tab or downloading. This helps with:
  - UX (stay in context).
  - Control (you can later add view-only mode and disable download in the UI).

### 3.1 Implementation approach

- **Detection** – For a resource that has `downloadUrl` ending in `.pdf` (or mime type PDF), show two actions on the tile:
  - **View** – Opens the PDF in an in-page viewer.
  - **Download** – Optional; can be hidden for “view only” resources (see below).
- **Viewer** – Use an iframe or a dedicated PDF viewer component:
  - **iframe** – `src` pointing to a **protected URL** that streams the PDF (see next section). Simple and works in all modern browsers.
  - **PDF.js** (e.g. `react-pdf`) – Renders PDF in canvas; better for custom UI (toolbar, no right-click, etc.) and for “view only” (no native browser download button). Slightly more work.
- **Recommendation** – Start with **iframe** to a route that serves the file with proper access checks (e.g. `/api/resources/portal/file/[resourceId]?token=...&email=...`). If you need stricter “no download” and custom UX, add PDF.js later and stream the PDF blob to the client instead of giving a direct file URL.

### 3.2 “View only” (no download) for sensitive documents

- Add a flag on **PortalResource**, e.g. `viewOnly Boolean @default(false)`. When `true`:
  - In the UI: only show **View** (no Download button).
  - In the backend: serve the file through a **streaming endpoint** that:
    - Verifies the user (token+email or session).
    - Optionally sets headers to discourage caching and right-click save (e.g. `Content-Disposition: inline` only, no `attachment`; `X-Content-Type-Options: nosniff`). Note: true “cannot save” is not possible in the browser; view-only reduces casual copying and avoids giving a direct download link.
  - For extra control, serve the PDF in chunks or via a short-lived signed URL that expires in minutes, so the link cannot be reused by someone else.

This supports **limiting IP exposure** by avoiding handing out a permanent download link and encouraging viewing in a controlled context.

---

## 4. Link and document protection (limit reuse and sharing)

Goals:

- **No permanent public URLs** – Download/view links should require the user to be authenticated (token+email or session).
- **No “copy link and send to a friend”** – Links should be bound to the current user/session and, where possible, time-limited.

### 4.1 Download and view links

- **Do not expose** raw file URLs (e.g. `/resources/business-growth-guide.pdf`) in the portal. Instead:
  - **Downloads** – Use an API route, e.g. `GET /api/resources/portal/download/[resourceId]?token=...&email=...` (or session cookie). The route:
    - Verifies token+email (or session).
    - Checks the user is allowed to see this resource (unlocked, or granted, or full access, or in a redeemed bundle).
    - Streams the file with `Content-Disposition: attachment` (for download) or `inline` (for view in browser/iframe).
    - Optionally: short-lived signed URL (e.g. 5–10 minutes) for the actual stream, so the link in the email or copy-paste is useless after a short time.
- **View-only** – Same route or a dedicated “view” route; same checks; stream with `Content-Disposition: inline` and no Download button in your UI for that resource.

### 4.2 Link tiles (external or internal tools)

- For **links** (PortalArticle or resource with `linkUrl`):
  - **Option A (simplest)** – Keep links as-is but log access (see audit below). Users can still copy the URL; you rely on token/session to enter the portal.
  - **Option B (stricter)** – Do not show the real URL. Use a redirect endpoint: `GET /api/resources/portal/out?articleId=...&token=...&email=...`. The API verifies the user, logs the click, then redirects (302) to the real URL. The user never sees the final URL in the tile; sharing the `/out?articleId=...` link still requires token+email, so it’s tied to one user’s access.

### 4.3 Audit (recommended)

- Log **who** (email/user id), **what** (resource or article id), **when**, and **action** (view / download / link_click). Your existing **TrustAccessLog** is a good pattern; you can extend it or add a **PortalAccessLog** for all portal actions.
- Use this for:
  - Detecting unusual reuse (e.g. same token from many IPs).
  - Stats for consultants (how often a client used which resource).
  - Optional: rate limits (e.g. max downloads per user per day) to discourage sharing accounts.

---

## 5. Summary of recommended features

| Feature | Purpose |
|--------|---------|
| **Lock/unlock per tile** | Admin hides sensitive items by default; only visible to users who are granted access. |
| **Unlock all for a user** | Partners or selected clients see all content (full access flag). |
| **Unlock select items for a user** | Consultant chooses exactly which resources/links a consultation client can use. |
| **Bundles + codes** | Training clients redeem a code to get a fixed package of documents/links. |
| **In-page PDF viewer** | View PDFs in the portal; optional “View” only (no Download button). |
| **View-only flag** | For sensitive docs: stream via API, no direct download link, reduce casual copying. |
| **Protected file/link URLs** | All files and optional outbound links go through API; verify user and optionally use short-lived URLs. |
| **Audit log** | View/download/link clicks for security and analytics. |

---

## 6. Suggested implementation order

1. **Lock/unlock + per-user access**  
   - Add `lockedByAdmin` (and optionally `viewOnly`) to schema.  
   - Extend portal content API to filter by “can this user see this item?” (unlocked OR granted OR full access).  
   - Add per-item grants and “full access” (reuse or extend GatedAccessGrant / add PortalItemGrant + fullAccess on AccessRequest or equivalent).  
   - Admin UI: lock/unlock toggles; user access management (full vs select items).

2. **Protected file serving**  
   - Replace direct `downloadUrl` in the frontend with “Download”/“View” that call `/api/resources/portal/file/[id]` with token (or session).  
   - Implement the API: verify user, check access, stream file (attachment or inline).  
   - Add in-page PDF viewer (iframe or PDF.js) using the same view endpoint.

3. **View-only and link protection**  
   - Add `viewOnly`; for view-only resources, hide Download and use inline streaming.  
   - Optionally: outbound link redirect endpoint and audit for link clicks.

4. **Bundles and codes**  
   - Add PortalBundle, PortalBundleItem, PortalCode, PortalCodeRedemption (and UserPortalBundle or equivalent).  
   - Admin UI: create bundles, create codes.  
   - Portal UI: “Redeem code” field; backend attaches bundle to user and includes bundle items in content API.

5. **Audit and polish**  
   - Ensure all view/download/link actions are logged; add basic admin view of activity if needed.

---

## 7. Professional UX notes

- **Tiles** – Keep the current tile design; ensure locked items are never shown as “broken” (they simply don’t appear for users without access).
- **Messaging** – If a user has no access to any locked content, the portal can show the same tile layout with only the items they can see; no need to say “you have no access” unless they see an empty list. For “Enter code” use copy like “Have a training or bundle code? Enter it below to unlock additional resources.”
- **Partners** – Use “Full access” so they see the full catalog without per-item setup; optionally segment by org so partner A only sees their org’s content if you use org-scoped resources.

This design keeps the portal professional, preserves the tile feature, and supports consultation clients, training bundles, and partners while adding in-page viewing and stronger control over downloads and link reuse.
