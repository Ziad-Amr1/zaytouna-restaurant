# Zaytouna Restaurant — Frontend Architecture

## Overview

A modern restaurant ordering app built with React. This document describes the **current foundation** (already set up) and the **rules** for building features on top of it. Features that are planned but not yet implemented are marked as "future".

The frontend lives at the repository root; the Express backend lives in `backend/`.

## Tech Stack (current)

- **Build tool**: Vite
- **UI library**: React 19+ — **JavaScript only, no TypeScript**
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **Component library**: shadcn/ui (Radix primitives, unified `radix-ui` package)
- **Routing**: React Router v7 (`BrowserRouter` in `main.jsx`)
- **HTTP client**: Axios (single shared instance)
- **Icons**: lucide-react
- **Toasts**: sonner
- **i18n**: i18next + react-i18next (see i18n section)

## Project Structure (current)

```
zaytouna-restaurant/
├── public/                    # Static assets
├── src/
│   ├── api/                   # Axios client + feature API modules
│   │   ├── axiosClient.js     # Single shared Axios instance (interceptors)
│   │   ├── authApi.js         # /auth/* endpoints
│   │   ├── menuApi.js         # /menu/* endpoints
│   │   └── ordersApi.js       # /orders/* endpoints
│   ├── assets/                # Images, fonts (empty)
│   ├── components/
│   │   ├── ui/                # shadcn/ui components (button, card, dialog, …)
│   │   └── layouts/           # Layout components (empty)
│   ├── context/               # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── AuthProvider.jsx
│   ├── hooks/                 # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useTheme.js
│   │   └── useApiAvailability.js
│   ├── i18n/                  # i18next setup + RTL direction
│   │   ├── index.js
│   │   ├── DirectionProvider.jsx
│   │   └── locales/{en,ar,fr}.json
│   ├── lib/
│   │   └── utils.js           # cn() helper (clsx + tailwind-merge)
│   ├── pages/                 # Page = what it is, not who can see it
│   │   ├── public/            # No auth required (future: Landing, Menu)
│   │   ├── auth/              # Login, Register (future)
│   │   ├── user/              # Authenticated user experience (future)
│   │   └── admin/             # Admin experience (future)
│   ├── routes/                # Who-can-access-what lives here
│   │   ├── AppRoutes.jsx      # Route table
│   │   ├── ProtectedRoute.jsx # Auth gate (implemented)
│   │   └── RoleGuard.jsx      # Role gate (implemented)
│   ├── App.jsx                # Renders AppRoutes
│   ├── index.css              # Design system (tokens + theme)
│   └── main.jsx               # Entry point, BrowserRouter
├── backend/                   # Express API (out of scope)
├── docs/Architecture.md
├── components.json            # shadcn/ui config
├── index.html
├── jsconfig.json              # @/ alias for editors
├── vite.config.js             # React + Tailwind plugins, @ alias
├── .env.example               # VITE_API_URL template
├── package.json
└── README.md
```

> Previous layout note: there is **no** `src/services/` and **no** `src/pages/protected/`. They were removed in the foundation cleanup.

## Axios Architecture (current)

- **`src/api/axiosClient.js`** is the ONLY Axios instance in the app.
  - `baseURL` from `import.meta.env.VITE_API_URL` (fallback `/api`).
  - Request interceptor attaches `Authorization: Bearer <token>` from `localStorage` (key `token`).
  - Response interceptor handles **401 globally**: clears `token`/`user` from localStorage and dispatches `window` event `auth:unauthorized` (AuthProvider listens and clears session; routes then redirect via React Router).
  - `withCredentials: true` and `Content-Type`/`Accept: application/json` headers.
- **Feature API modules** (`authApi.js`, `menuApi.js`, `ordersApi.js`) are thin wrappers over `axiosClient` — one file per backend resource. They return `response.data`.
- **Rules**:
  - Never create another axios instance.
  - Never attach the token manually inside a service/hook/component — the interceptor does it.
  - Components/pages/hooks must NOT call `axios` directly; they import the feature API module.

## Pages Architecture (current)

Pages describe **what** the page is; `src/routes/` describes **who** can access it.

- `pages/public/` → no authentication required (Landing, Menu browsing — future)
- `pages/auth/` → authentication pages (Login, Register — future)
- `pages/user/` → authenticated user experience (profile, orders, reservations — future)
- `pages/admin/` → admin experience (dashboard, menu management — future)

All four directories exist and are tracked via `.gitkeep`; they contain no page components yet.

## Routing (current)

- `src/routes/AppRoutes.jsx` is the single route table, rendered by `App.jsx`.
- `ProtectedRoute.jsx` renders `LoadingScreen` while the session restores, redirects guests to `/login` (preserving the intended destination in `state.from`), and otherwise renders the protected subtree.
- `RoleGuard.jsx` (`allowedRoles`, e.g. `["admin"]`) redirects logged-in users with the wrong role to `/unauthorized`.
- `main.jsx` wraps the app in `<BrowserRouter>` **and** `<AuthProvider>`.

**Implemented routes:** `/` landing, `/menu`, `/menu/:id`, `/login`, `/register`, `/unauthorized`, protected `/profile`, `/orders`, `/reservations`, `/favorites`, admin `/admin`, `/admin/analytics`, `*` not-found.

**Future rules**: keep new public pages under `public/`, auth pages under `auth/`, and always route user/admin pages behind the guards.

## Context Architecture (current)

- `src/context/AuthContext.jsx` — React context object (default export).
- `src/context/AuthProvider.jsx` — mounted in `main.jsx`. Provides `user`, `isAuthenticated`, `isLoading`, `login`, `register`, `logout`; restores the session on mount via `getCurrentUser()` when a token exists; persists `token`/`user` to `localStorage` on login/register; listens for `auth:unauthorized` to clear the session. Logout is client-side only (no backend endpoint).
- **Rule**: new global state lives in `src/context/` with a separate Provider file; consume via a hook.

## Hooks Architecture (current)

- `useAuth.js` — consumes `AuthContext` (throws if used outside the provider).
- `useTheme.js` — light/dark theme toggle via `data-theme="dark"` attribute on `<html>`.
- `useApiAvailability.js` — checks whether the API is reachable via `GET /health` (base URL already includes `/api`).
- **Rule**: reusable logic lives in `src/hooks/`; hooks that need React context live there too.

## i18n (current)

- `src/i18n/index.js` — initializes i18next; reads the saved language from `localStorage`; exports `setLanguage` and `supportedLanguages`.
- `src/i18n/DirectionProvider.jsx` — sets `dir` (`rtl` for Arabic) + `lang` on `<html>` based on the active language.
- Locale files: `en.json`, `ar.json`, `fr.json`.
- **Not wired yet**: `src/i18n/index.js` is not imported by `main.jsx`, and it currently registers only the `en` locale in i18next `resources`. Wiring i18n (and activating ar/fr) is future work.

## Component Organization (current)

- `src/components/ui/` — shadcn/ui primitives (generated/managed via `components.json`; `tsx: false` → `.jsx` output). Import Radix primitives from the unified `radix-ui` package.
- `src/components/layouts/` — page layout wrappers (empty, future).
- `src/components/` (top level) — app-specific reusable components (future).
- **Rule**: one component per file, PascalCase filename, default export; alias `@/` maps to `src/`.

## Design System (current)

`src/index.css` is the single source of design tokens:

- Base palette (shadcn design tokens): `--background`, `--foreground`, `--primary`, `--muted`, `--border`, `--ring`, `--radius`, etc. — mapped to Tailwind utilities via `@theme inline`.
- Semantic app tokens (used by components via arbitrary values, e.g. `text-(--color-text-primary)`):
  - `--color-surface`, `--color-surface-secondary`
  - `--color-text-primary`, `--color-text-secondary`
  - `--color-focus-ring`
- Dark mode: `.dark` class or `[data-theme="dark"]` attribute both flip the tokens
  (matches `useTheme`, which toggles `data-theme`).
- **Rule**: new colors/shadows/radii are added to `src/index.css`, not inline per-component.

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend (e.g. `https://host/api`) | `/api` |

Copy `.env.example` → `.env` to override. `.env*` is gitignored; `.env.example` is committed.

## Major Architectural Rules

1. **JavaScript only** — no TypeScript (`.ts`/`.tsx`), no Next.js, no other framework.
2. **One Axios instance** — `src/api/axiosClient.js`. Feature calls live in `src/api/*Api.js`.
3. **Pages are feature-shaped** (`public/auth/user/admin`); **routes enforce access** (`ProtectedRoute`/`RoleGuard`). No `pages/protected/`.
4. **Auth state** flows through `AuthProvider`/`useAuth`; backend still enforces authorization — client guards are UX only.
5. **API responds `{ success, data }`** — feature modules `return response.data`; consumers read `.data` (or `.message` on failure).
6. **Token is never handled manually** in features — interceptor attaches it; 401 handled globally.
7. **Backend is out of scope** — never modify `backend/`.

## Current Foundation vs. Future Work

**Foundation (done):** Vite+React+JS app; Tailwind v4 design system; shadcn/ui configured; React Router + `AppRoutes` skeleton; canonical Axios layer (`axiosClient` + `authApi`/`menuApi`/`ordersApi`); Auth context/hooks; i18n scaffolding; pages directory skeleton; lint+build green.

**Auth (done):** Login/Register pages (react-hook-form + zod), session persistence + restore via `/auth/me`, auto-login on register, `ProtectedRoute`/`RoleGuard` behavior, `/unauthorized` page, 401 handling (login/register 401s are form errors; session 401s clear the session globally), `AuthProvider` mounted.

**Future (not implemented):** Landing/Menu pages, orders, reservations, favorites, profile, admin dashboard, analytics, CRUD screens, wiring i18n (ar/fr), password reset / OTP (no backend endpoints exist).