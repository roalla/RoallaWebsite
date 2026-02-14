# Portal UI/UX enhancement ideas

Suggestions to improve the admin Portal and Portal access experience. Items marked **Done** are implemented.

---

## Portal access page (`/admin/portal-access`)

| Idea | Status | Notes |
|------|--------|--------|
| **Tab badges** — Show count per tab (e.g. Pending (3), Approved (12)) | Done | Uses existing request list; clear at a glance. |
| **Request/added date** — Show "Requested 2 days ago" or date on each row | Done | Uses `createdAt` from API. |
| **Auto-dismiss messages** — Success/error bar fades or dismisses after a few seconds | Done | 5s auto-dismiss; reduces clutter. |
| **Escape to close modals** — All modals (Add, Bulk, Approve) close on Escape | Done | Keyboard-friendly. |
| **Approve modal focus trap** — Keep focus inside modal when tabbing (a11y) | Done | Matches Add/Bulk modals. |
| **Expand all / Collapse all** — When many approved users, one-click expand/collapse | Consider | Helpful once list grows. |
| **Search/filter approved list** — Filter by email, name, or company | Consider | Useful with 20+ users. |
| **Sort options** — By date, name, or access type | Consider | Dropdown or toggle. |
| **Save confirmation** — Toast or inline "Saved" after updating access | Consider | Reuse message area with short-lived success. |
| **Empty state** — Icon or short copy for "No pending requests" / "No approved users" | Consider | Softer than plain text. |

---

## Portal landing (`/admin/portal`)

| Idea | Status | Notes |
|------|--------|--------|
| **Remember guide open/closed** — Persist in localStorage | Done | Fewer clicks on repeat visits. |
| **Content card counts** — e.g. "12 resources, 5 links" on Portal content card | Consider | Needs counts API or include in existing. |
| **Skeleton for pending count** — Subtle loading state while badge loads | Consider | Avoids layout shift. |

---

## Portal content hub (`/admin/portal-content`)

| Idea | Status | Notes |
|------|--------|--------|
| **Breadcrumb** — "Portal > Portal content" at top | Done | Clear hierarchy. |
| **Live counts** — "X resources, Y links" on the two cards | Consider | Requires API or server component. |

---

## Navigation & consistency

| Idea | Status | Notes |
|------|--------|--------|
| **Breadcrumbs** — "Portal > Portal access" (and similar) on subpages | Done | Same pattern as Portal content. |
| **Back link style** — Use same "← Back to Portal" / "Back to Portal" + icon everywhere | Done | Already consistent. |

---

## Client-facing portal (`/resources/portal`)

| Idea | Status | Notes |
|------|--------|--------|
| **Skeleton loaders** — While content or auth is loading | Consider | Smoother perceived performance. |
| **Empty state** — Friendly message when no content (e.g. "Nothing here yet") | Consider | If API can return empty. |
| **"Request access" link** — When logged in, link back to request page for re-request flow | Consider | Only if product needs it. |

---

## Future / larger scope

- **Dark mode** — If design system supports it.
- **Bulk actions** — e.g. select multiple pending and approve with same options.
- **Export** — Download approved list (CSV) for reporting.
- **Audit log** — Who approved/rejected when (if stored in DB).

Use this doc as a backlog; pick items that best match your priorities.
