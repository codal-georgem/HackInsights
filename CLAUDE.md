# HackInsights — Claude Context

## What This Project Is
A one-page SPA for collecting and displaying hackathon participant feedback.
Visitors submit a name, role, message, and star rating. The page also shows a
wall of past submissions. Sanity is the sole data store; there is no custom
backend or database.

---

## Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack in dev) |
| Language | TypeScript 5 — strict mode on |
| Styling | Tailwind CSS 3 |
| CMS / DB | Sanity v3 (embedded Studio at `/studio`) |
| Icons | lucide-react |
| Runtime | Node.js / React 19 |

---

## Key Directories

| Path | Purpose |
|---|---|
| `src/app/` | All Next.js App Router routes and the root layout |
| `src/app/studio/[[...tool]]/` | Catch-all route that mounts the embedded Sanity Studio |
| `src/lib/sanity.config.ts` | Exports `client` (read-only, CDN) and `writeClient` (token-gated writes) |
| `sanity/schemas/` | One file per Sanity document type |
| `sanity.config.ts` | Root Sanity project config — registers schemas and Studio plugins |

---

## Environment Variables
Required in `.env.local` (see `.env.local.example` for the template):
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION` — pin to a date string (e.g. `2025-02-21`)
- `SANITY_API_TOKEN` — server-side only; **never** prefix with `NEXT_PUBLIC_`

---

## Essential Commands
```bash
npm run dev      # Start dev server with Turbopack (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint via eslint-config-next
```

---

## Adding a New Sanity Schema
1. Create `sanity/schemas/<name>.ts` using `defineType` / `defineField`
2. Import and add it to the `schema.types` array in [`sanity.config.ts`](sanity.config.ts:20)
3. Fetch it via `client` in a Server Component or Route Handler

---

## Additional Documentation
Check these files when the task involves the listed topics:

| Topic | File |
|---|---|
| Architectural patterns & design decisions | [`.claude/docs/architectural_patterns.md`](.claude/docs/architectural_patterns.md) |
