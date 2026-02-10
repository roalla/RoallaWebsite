# Portal & Portal Access – Recommended Improvements

## Implemented (all recommendations)

- **Sync tab to URL** – Tab is reflected in `?tab=...` and survives refresh.
- **Bulk add confirmation** – Confirmation when adding 15+ users; bulk add limited to 100 users per request.
- **Empty state links** – "No resources yet" / "No links yet" include a link to "Add in Portal content".
- **Approve with access** – Approve opens a modal to set Full access and Send email, then Approve (default: public files only).
- **After Add user** – Add API returns `requestId`; after add, switch to Approved tab and auto-expand the new user.
- **Wording** – Standardised to "public files only" for default access.
- **Explicit default on add** – Add API sets `fullAccess: false` when creating/updating.
- **Bulk add limit** – 100 users per request (API + client check).
- **Pending badge** – Portal landing card shows "(X pending)" when there are pending requests (`/api/admin/portal-access/counts`).
- **Modal a11y** – Add user and Bulk add: role="dialog", aria-modal, aria-labelledby; focus first input on open; return focus on close; focus trap (Tab cycles within modal).
- **Revoke / Reject** – Confirm dialogs before Remove access and Reject.
- **Migration doc** – PORTAL_CONTENT_INTEGRATION.md updated: after migration, "Portal links" admin can be retired or hidden.

---

## Quick wins (reference; now implemented)

1. **Sync tab to URL** – When switching Pending / Approved / Rejected, update the URL (e.g. `?tab=pending`) so the tab is shareable and survives refresh. *(Implemented below.)*
2. **Bulk add confirmation** – If the user pastes a large number of lines (e.g. 15+), show a confirm step: “You’re about to add N users. Continue?” *(Implemented below.)*
3. **Empty state links** – In portal-access, when “No resources yet” or “No links yet”, add a link to “Add in Portal content” so the next step is obvious.

---

## UX

4. **Approve with access** – When approving a pending request, optionally “Set access now”: checkbox for Full access and/or grant selected items, then Approve. Avoids approve → find user → expand → set access.
5. **After Add user** – Either return the new request id from the add API and auto-expand that user in Approved, or show a clear message: “Added. Set their access in the Approved list below.”
6. **Wording** – Use one phrase everywhere: e.g. “unlocked content only” or “public files only” (and use it in emails/tooltips).

---

## Technical

7. **Explicit default on add** – In `POST /api/admin/requests/add`, set `fullAccess: false` when creating/updating the access request so the default is explicit, not only from the DB.
8. **Bulk add limit** – Optional cap (e.g. 100 lines per bulk add) with a clear error to avoid timeouts or abuse.
9. **Pending badge** – On the Portal landing card for “Portal access”, show “(X pending)” when there are pending requests, so admins see it at a glance.

---

## Accessibility

10. **Modals** – Add user / Bulk add: focus trap, focus first input on open, return focus on close, and `aria-label` / `aria-modal` where needed.
11. **Revoke / Reject** – Confirm dialog for “Remove access” and “Reject” to prevent misclicks.

---

## Data

12. **Migration** – After running `migrate-articles-to-resources.ts`, document in the integration doc that “Portal links” in admin can be retired or hidden (or keep as read-only list of link-only resources).
