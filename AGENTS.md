# Building in this project

## Personas

`packages/functions/src/personas.ts` declares this app's people, primary role first — the
person who uses it daily, not the one who administers it. The shipped `visitor` is a
placeholder to replace, and `fabric build-complete` refuses a build that left it beside real
roles, naming every edit that removal needs.

## Routing

Three fixed slots, so a URL means the same thing in every app built from this template:

- **`/api`** — the API. Better Auth lives under `/api/auth/*`.
- **`/app`** — the signed-in application. EVERY screen you build goes under here
  (`/app/orders`, `/app/orders/$orderId`), named to match its route file
  (`app.orders.$orderId.tsx`). The `app.tsx` layout renders the shell and gates everything
  nested under it. The auth screens live at `/app/auth/login`, `/app/auth/signup`, `/app/auth/forgot-password`
  and `/app/auth/reset-password` but must NOT be gated — so their files use TanStack's non-nested
  segment, `app_.auth.login.tsx`: same URL prefix, outside the `app.tsx` layout. Writing
  `app.auth.login.tsx` instead puts the login page behind the gate that redirects to it.
- **`/`** — the marketing homepage. Everything outside `/app` is brand register. The starter has none, so `/` redirects to `/app` and the
  app's own gate forwards a signed-out visitor to `/app/auth/login`. Building a landing page means
  replacing `src/routes/index.tsx` with a component; nothing else changes.

## Navigation and the phone

`useNavItems()` in `src/components/layout/nav.tsx` is the ONE place navigation is defined. Add
a screen there and it appears in the desktop sidebar and in whichever phone navigation the
shell mounts.

Below `sm` the sidebar is gone and one of two components replaces it — never both:

- **`<MobileTabBar />` — the default.** A foot bar of destination tabs, within thumb reach,
  overflowing past four tabs into a More sheet. Keep the `<Box hiddenFrom="sm">` spacer beside
  it in the shell, or the last row of every page hides under the bar.
- **`<MobileNavDrawer />`** — a burger in a phone-only header. Swap to it when the nav is
  long or hierarchical, when the foot belongs to the screen itself (a composer, a media
  transport), or for a canvas tool that wants every pixel. It needs
  `header={{ height: { base: MOBILE_HEADER_HEIGHT, sm: 0 } }}` on the shell plus a
  `<AppShell.Header hiddenFrom="sm">` to sit in, and no foot spacer.
