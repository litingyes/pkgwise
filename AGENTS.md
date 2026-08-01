# pkgwise — Agent Guide

Intelligent insights for the software package ecosystem.

## Tech Stack

- **Framework**: Nuxt 4 (Vue 3, TypeScript, SSR)
- **UI**: Nuxt UI v4, Tailwind CSS 4, reka-ui
- **Utilities**: VueUse (`@vueuse/nuxt`)
- **Tooling**: ESLint (@antfu/eslint-config + eslint-plugin-better-tailwindcss), pnpm

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start dev server at http://localhost:3000 |
| `pnpm lint` | Lint the whole project |
| `pnpm lint:fix` | Lint and auto-fix the whole project |
| `pnpm typecheck` | Run `nuxt typecheck` (vue-tsc) |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |

## Code Conventions

This section is a living document — keep it up to date as the project evolves.

### 1. Explicit imports only

Nuxt auto-import scanning is disabled (`imports.scan: false` in `nuxt.config.ts`). Always import Vue APIs, Nuxt composables, and utilities explicitly:

```ts
import { computed, ref } from 'vue'
import { useFetch, useRoute } from '#app'
```

### 2. Component organization

- `app/components/` — shared, reusable components only.
- Page-specific components live next to their page at `app/pages/<route>/components/`. This path is excluded from routing via `pages.pattern` in `nuxt.config.ts`.

### 3. Component implementation order

1. Prefer Nuxt UI components first.
2. When Nuxt UI does not cover a need, build the component with reka-ui headless primitives + Tailwind CSS.
3. Do not introduce other component libraries.

### 4. Linting and formatting

- ESLint with @antfu/eslint-config and eslint-plugin-better-tailwindcss (Tailwind class ordering/correctness enforced in `.vue` files).
- No comments in code unless explicitly requested.

### 5. Project skills

Local skills are installed under `.agents/skills/`: `nuxt`, `nuxt-ui`, `vue`, `vueuse-functions`, `frontend-design`. Consult them when working on the corresponding areas.

## Workflow Rules

### 1. Browser verification after every change

After each change, verify the actual behavior against the local dev server using the `agent-browser` CLI, simulating real user behavior:

- Start (or reuse) the dev server with `pnpm dev` (http://localhost:3000).
- Use Chrome **Profile 2** to reuse the existing auth state: `agent-browser --profile "Profile 2" open http://localhost:3000`.
- Project config lives in `agent-browser.json` (session `pkgwise`, screenshots saved to `.agent-browser/screenshots/`).
- Take screenshots and confirm both functionality and styling/layout match expectations before considering the change done.

### 2. Lint and format after confirmation

Once changes are confirmed working:

1. Run `eslint --fix` on every changed file and fix any remaining errors.
2. Run `pnpm typecheck` to make sure types are clean.
