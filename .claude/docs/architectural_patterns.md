# Architectural Patterns

## 1. Split Sanity Client — Read vs Write

**Files:** [`src/lib/sanity.config.ts:17`](../../src/lib/sanity.config.ts#L17), [`src/lib/sanity.config.ts:29`](../../src/lib/sanity.config.ts#L29)

Two named exports from a single module, not a class or factory:
- `client` — `useCdn: true`, no token. Safe to import in any Server Component.
- `writeClient` — `useCdn: false`, token from `SANITY_API_TOKEN`. Only used in Route Handlers or Server Actions (never imported into client components).

**Convention:** Any file that needs to write to Sanity imports `writeClient`. Any file that only reads imports `client`. The split enforces the security boundary at the import level rather than at runtime.

---

## 2. Environment Variables — Public vs Secret Split

**Files:** [`.env.local.example`](../../.env.local.example), [`src/lib/sanity.config.ts:3-5`](../../src/lib/sanity.config.ts#L3)

All variables safe for the browser bundle are prefixed `NEXT_PUBLIC_`. Secrets (API tokens) are unprefixed and only accessed server-side. This is enforced by convention — the `writeClient` that uses the token is never imported into `"use client"` components.

---

## 3. Embedded Sanity Studio as a Next.js Route

**File:** [`src/app/studio/[[...tool]]/page.tsx`](../../src/app/studio/%5B%5B...tool%5D%5D/page.tsx)

The Sanity Studio is mounted inside the Next.js app at `/studio` via `NextStudio` from `next-sanity/studio`, using a catch-all route segment `[[...tool]]`. This avoids a separate Sanity deployment.

- Marked `"use client"` because `NextStudio` requires browser APIs.
- `export const dynamic = "force-dynamic"` prevents Next.js from statically rendering it at build time.
- The root [`sanity.config.ts`](../../sanity.config.ts) (project root, not `src/lib/`) is the single source of truth for project ID, dataset, base path, and registered schemas.

---

## 4. Schema-First Document Modelling

**Files:** [`sanity/schemas/feedback.ts`](../../sanity/schemas/feedback.ts), [`sanity.config.ts:20`](../../sanity.config.ts#L20)

Each Sanity document type lives in its own file under `sanity/schemas/`, exported as a named constant. Schemas use `defineType` / `defineField` for full TypeScript inference. Validation rules are co-located with the field definition, not in a separate layer.

The `preview` block on each schema drives the Studio list view — `prepare()` formats the subtitle with derived data (e.g. star repeat) rather than storing a pre-formatted string.

---

## 5. Server-Component-First Data Fetching

**Pattern observed in:** [`src/app/page.tsx`](../../src/app/page.tsx) (shell), [`src/lib/sanity.config.ts`](../../src/lib/sanity.config.ts)

Pages and layouts are Server Components by default (no `"use client"` directive). Data fetching happens at the component level via `await client.fetch(GROQ_QUERY)` — no `useEffect`, no client-side loading states for the initial render. Client interactivity (forms, state) is isolated to leaf components marked `"use client"`.

---

## 6. Path Alias `@/*` → `src/*`

**File:** [`tsconfig.json:17`](../../tsconfig.json#L17)

All internal imports use `@/` to reference anything under `src/`. Do not use relative `../../` paths when crossing directory boundaries — use `@/lib/sanity.config` instead of `../../lib/sanity.config`. (Exception: `sanity.config.ts` at the project root is outside `src/` and must be imported with a relative path, as seen in the Studio route.)
