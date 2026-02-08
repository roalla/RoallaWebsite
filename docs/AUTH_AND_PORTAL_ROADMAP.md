# Auth, Admin GUI, Audit & Partners – Recommendation

This document recommends how to add **login**, **admin management**, **audit tracking** for approved users, and **partner access** with their own content and branding on your existing Next.js + Railway + PostgreSQL stack.

---

## Goals (summary)

| Who | Need |
|-----|------|
| **You (admin)** | Log in → GUI to manage access requests, view users, see audit stats. |
| **Approved users** | Log in → access resources portal; track what they view/download (audit) and show volume/stats. |
| **Partners** | Log in → add their content, see stats for their content, apply their branding to their section. |

---

## Recommended approach

- **Auth:** **NextAuth.js (Auth.js)** with **Prisma adapter** – sessions in your DB, works with Next.js App Router, supports credentials (email/password) and later OAuth. No extra hosted cost.
- **Roles:** Stored in your DB (`User.role`: `admin` | `member` | `partner`). Middleware or checks protect `/admin`, `/dashboard`, and partner areas.
- **Audit:** New table `ResourceAccess` (or `AuditLog`) – who (userId), what (resourceId), action (view/download), when. Admin and partners see stats/volume in their GUIs.
- **Partners:** New `Partner` model (name, slug, logo, branding). Partner users linked to a partner; they get a partner dashboard to add content and see analytics. Public portal shows “Partner name” sections with optional partner branding.

---

## Data model (high level)

- **User** – id, email, passwordHash (or auth provider), **role** (admin | member | partner), **partnerId** (if partner), name, createdAt, etc.
- **Session** – NextAuth sessions (via Prisma adapter).
- **Account** – NextAuth OAuth accounts (if you add Google/GitHub later).
- **AccessRequest** – keep as-is; when you “approve”, optionally create a **User** (role: member) and send “Set your password” email so they can log in.
- **Resource** – id, title, description, type (article | template | file), fileUrl or content, **partnerId** (null = Roalla), addedByUserId, createdAt. Replaces or extends current hardcoded resource list.
- **ResourceAccess** – id, userId, resourceId, action (view | download), createdAt. For audit and stats.
- **Partner** – id, name, slug, logoUrl, primaryColor, secondaryColor (or JSON branding), createdAt.

---

## Phased implementation

### Phase 1: Login + Admin GUI (foundation)

- Add NextAuth.js + Prisma adapter; User and Session (and Account) tables.
- Single role for now: **admin**. One admin user (you) – created via script or one-time signup.
- **Login page** at `/login`; after login, redirect by role (admin → `/admin`).
- **Admin GUI** at `/admin` (protected):
  - List **access requests** (pending/approved/rejected), approve/reject (reuse existing approve API or mirror it here).
  - List **approved users** (from AccessRequest where status=approved, or from User where role=member).
  - Optional: simple dashboard (counts of pending requests, total members).
- No change yet to how **approved users** access the portal (they can keep using the token link); focus is you logging in and managing requests.

**Deliverables:** Login, one admin user, `/admin` with request list + approve/reject + user list.

---

### Phase 2: Approved users login + audit

- **Member** role: when you approve a request, optionally “Convert to member” → create User (role: member), send “Set your password” email (or temporary password). They log in at `/login`.
- **Resources portal** for members: same content but **gated by session** (logged-in member) instead of (or in addition to) token-in-URL. If they arrive with token, log them in and link token to their new User.
- **Audit:** On each view or download of a resource, insert **ResourceAccess** (userId, resourceId, action, timestamp).
- **Admin GUI:** New “Audit” or “Activity” section – filter by user, date range, resource, action; show volume (views/downloads per resource, per user) and basic stats (e.g. top resources, most active users).

**Deliverables:** Members can log in; portal tracks views/downloads; admin sees audit and stats.

---

### Phase 3: Partners – content, branding, stats

- **Partner** model and **Partner user** (User.role = partner, User.partnerId = Partner).
- **Partner dashboard** (e.g. `/partner` or `/dashboard/partner`): partner logs in → add/edit **their** resources (title, description, file/link), see list of their resources.
- **Resource** model: add **partnerId**; “Roalla” content has partnerId = null; partner content has partnerId set.
- **Public resources portal:** Show “Roalla” section + one section per partner (e.g. “Content from [Partner Name]”). When showing a partner section, apply **partner branding** (logo, colors) from Partner table.
- **Partner stats:** In partner dashboard, show views/downloads (from ResourceAccess) only for resources where resource.partnerId = their partner. No need to expose other partners’ or Roalla’s raw data.

**Deliverables:** Partners log in; add/edit content; see stats for their content; portal shows partner sections with their branding.

---

## Tech choices (short)

| Need | Choice | Why |
|------|--------|-----|
| Auth | NextAuth.js + Prisma | Fits Next.js, uses your DB, supports credentials + OAuth later, no extra vendor. |
| Passwords | bcrypt (via NextAuth Credentials) | Standard, secure. |
| Roles | Column on User (admin/member/partner) | Simple, easy to check in middleware and API. |
| Audit | Table ResourceAccess | Simple, queryable for admin and partner stats. |
| Partner branding | Partner table (logo, colors) | Rendered in portal when showing that partner’s block. |
| File uploads (partner content) | Start with URL/link; add file upload later (e.g. S3/Railway volume or Vercel Blob) | Keeps Phase 3 smaller; you can add upload in a follow-up. |

---

## Suggested order of work

1. **Phase 1** – Auth + admin GUI (login, manage requests, list users). This unblocks you day-to-day and is the base for the rest.
2. **Phase 2** – Member login + audit (approved users log in, everything they open/download is logged; you see stats in admin).
3. **Phase 3** – Partners (partner users, partner content, branding, partner-only stats).

If you want to prioritize partners over audit, Phase 2 and 3 can be swapped, but audit is usually quicker to implement and gives immediate value for “track what they downloaded, volume, stats.”

---

## Next step

Implement **Phase 1**: NextAuth.js + Prisma (User, Session), one admin user, `/login`, and `/admin` GUI to manage access requests and view approved users. After that we can wire Phase 2 (member login + audit) and then Phase 3 (partners).
