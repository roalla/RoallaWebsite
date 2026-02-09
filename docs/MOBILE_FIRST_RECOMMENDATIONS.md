# Mobile-first UI recommendations

Users use both desktop and mobile; these recommendations keep mobile as a first-class experience.

## Already in place

- **Viewport & PWA**: `viewport` meta, `theme-color`, `maximum-scale=5` (allows zoom for accessibility).
- **Public header**: Hamburger menu on `< lg`, full nav on desktop; mobile menu includes auth and CTA.
- **Touch targets**: In `globals.css`, buttons, links, inputs, and selects have `min-height/min-width: 44px` on viewports `max-width: 768px`.
- **Layout**: Responsive grids (`grid-cols-1` → `md:grid-cols-2` etc.), `section-padding`, `container` with `px-4 sm:px-6 lg:px-8`.
- **Forms**: Login, profile, 2FA use `max-w-md`, adequate padding, and centered layout.

---

## Recommendations

### 1. Admin area – mobile navigation (high impact)

**Issue**: Admin layout uses a horizontal nav (Dashboard, Team, Portal, Requests, Trust, Security, etc.). On small screens this overflows or wraps badly.

**Recommendation**: Add a mobile-first admin nav:

- **&lt; lg**: Hamburger button that opens a drawer/sheet with all admin links and user/sign-out.
- **≥ lg**: Keep current horizontal nav.

**Status**: Implemented (AdminNav drawer + layout adjustments).

---

### 2. Tables on small screens (high impact)

**Issue**: `RequestsTable`, `TeamManager`, and similar use full `<table>` with many columns. `overflow-x-auto` allows horizontal scroll but is poor UX on phones.

**Recommendation**:

- **RequestsTable**: On mobile, render each request as a **card** (stacked) with key fields and actions. Use a single breakpoint (e.g. `md:`) to switch to table.
- **TeamManager** (and other admin tables): Same pattern – card layout for small viewports, table for `md+`.

**Status**: RequestsTable and TeamManager mobile card views implemented. Trust requests page uses list layout (no table); touch targets added. Portal resources/articles and AccessRequestsManager use touch-friendly buttons.

---

### 3. Touch targets (medium impact)

**Issue**: Some controls are still under the 44×44px minimum:

- **UserMenu**: Avatar/trigger is `w-9 h-9` (36px).
- Small text links (e.g. “Forgot password?”, “Back to sign in”) rely on global `min-height/min-width` for `<a>`, which can look odd.

**Recommendation**:

- UserMenu trigger: Use `min-w-[44px] min-h-[44px]` (or equivalent) and keep icon centered.
- For inline links: Prefer padding (e.g. `py-2 px-1` or `inline-block py-2`) so the hit area is at least 44px without forcing a huge box.

**Status**: UserMenu trigger updated to meet 44px minimum.

---

### 4. Safe area insets (medium impact)

**Issue**: Fixed header sits under notches or status bars on devices with safe areas (e.g. iPhone X+).

**Recommendation**:

- Add `padding-top: env(safe-area-inset-top)` (or Tailwind `pt-[env(safe-area-inset-top)]`) to the fixed header.
- Add `padding-bottom: env(safe-area-inset-bottom)` to any fixed bottom bar or sticky CTAs.
- Ensure main content has top padding that accounts for header height + safe area (e.g. `pt-24` is already used; ensure it’s enough when safe area is present).

**Status**: Header and main content use safe-area-aware padding where applicable.

---

### 5. Focus rings on mobile (low impact)

**Issue**: `:focus` outline appears after tap, which can look like a persistent “selected” state on touch devices.

**Recommendation**:

- Use `:focus-visible` for outline/ring so keyboard users get a visible focus indicator and tap users don’t get a lingering ring.
- In Tailwind: e.g. `focus-visible:ring-2 focus-visible:ring-primary` and remove or reduce `focus: ring` where it’s only for outline.

**Status**: Optional; can be applied incrementally to buttons and links in `globals.css`.

---

### 6. Typography on very small screens (low impact)

**Issue**: Hero uses `text-5xl md:text-7xl`. On 320px-wide devices, `text-5xl` can feel large and cause wrapping.

**Recommendation**:

- Use a smaller base size and step up: e.g. `text-4xl sm:text-5xl md:text-7xl` for the main heading.
- Keep line-height and spacing comfortable on narrow viewports.

**Status**: Hero heading updated with `text-4xl sm:text-5xl md:text-7xl`.

---

### 7. Resources portal and other app pages

- **Portal logout**: Ensure the “Logout” control has at least 44px touch target (e.g. `min-h-[44px] min-w-[44px]` or padding).
- **Admin dashboard**: Card grid is already `grid-cols-1 sm:grid-cols-2 lg:grid-cols-5`; ensure each card is tappable and not too small on mobile.

---

### 8. General mobile-first habits

- **Start with mobile**: When adding new UI, write styles for the narrowest layout first, then `sm:`, `md:`, `lg:`.
- **Breakpoints**: Prefer `min-width` (Tailwind default) so base styles are mobile and you layer on larger screens.
- **Touch**: Prefer `min-h-[44px]` / `min-w-[44px]` or padding for any control that triggers an action.
- **Tables**: Prefer card/list layouts on small screens; reserve tables for `md+` or use responsive table patterns (e.g. hide less important columns on mobile).
- **Modals/drawers**: On mobile, prefer full-width or bottom sheets so they feel native and don’t require pinch-zoom.

---

## Summary

| Area              | Recommendation                          | Priority |
|-------------------|-----------------------------------------|----------|
| Admin nav         | Hamburger + drawer on mobile            | High     |
| Admin/portal tables | Card layout on mobile, table on md+   | High     |
| Touch targets     | UserMenu and small links ≥ 44px        | Medium   |
| Safe area         | Header and sticky elements use insets   | Medium   |
| Focus             | Prefer focus-visible for rings          | Low      |
| Hero typography   | Slightly smaller base on very small     | Low      |

Implementing the high- and medium-priority items will make the app much more usable on phones while keeping the desktop experience intact.
