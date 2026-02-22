# PRD — HackInsights Feedback Wall

**Status:** Complete
**Last Updated:** 2025-02-21

---

## 1. Purpose

HackInsights is a one-page public website where hackathon attendees can leave
anonymous short-form feedback. The wall surfaces all feedback as floating
"thought bubbles" — dimmed by default, fully readable on hover — creating a
live, ambient mosaic of opinions from the event.

---

## 2. User Story

> As a hackathon attendee, I want to drop a quick anonymous thought on the
> event page so others can see how people felt, without needing to sign up or
> reveal my identity.

---

## 3. Functional Requirements

| # | Requirement | Detail |
|---|---|---|
| F-1 | Add Feedback button | Visible at all times on the page (fixed position) |
| F-2 | Modal with textarea | Opens on button click; auto-focuses the input |
| F-3 | Character limit | Max 100 characters; live counter shown |
| F-4 | Anonymous submission | No name, email, or identity collected |
| F-5 | Persisted to Sanity | Stored via server-side Route Handler using `writeClient` |
| F-6 | Feedback wall | All submissions displayed as floating cards on the page |
| F-7 | Hover-to-reveal | Cards are visually dimmed/blurred at rest; fully legible on hover |
| F-8 | Real-time feel | Page fetches latest feedback on load; no manual refresh needed |

---

## 4. Non-Functional Requirements

- No authentication — fully public read and anonymous write
- No personally identifiable information stored
- Submission must succeed or show an error — no silent failures
- Page must be usable on mobile (modal, floating cards adapt to small screens)

---

## 5. Schema Change (Breaking)

The existing `feedback` schema at [`sanity/schemas/feedback.ts`](sanity/schemas/feedback.ts)
was designed for named, rated reviews. The new requirements are simpler and
incompatible. The schema must be replaced:

**Remove:** `name`, `role`, `rating`
**Keep:** `message` (rename constraint to max 100), `submittedAt`
**Add:** nothing

New shape:
```
{
  _type: "feedback",
  message: string   // 1–100 chars, required
  submittedAt: datetime  // set server-side, hidden in Studio
}
```

---

## 6. Architecture Notes

- **Reads:** Server Component on `src/app/page.tsx` fetches all feedback via
  `client` (read-only, CDN) using a GROQ query.
- **Writes:** A Next.js Route Handler at `src/app/api/feedback/route.ts` receives
  POST requests and uses `writeClient` (token-gated, server-side) to create the
  document. The token never reaches the browser.
- **UI interactivity:** The modal and feedback wall are Client Components
  (`"use client"`). The page shell remains a Server Component.

---

## 7. Milestones

Each milestone is a shippable vertical slice. Complete them in order.

---

### Milestone 1 — Schema Simplification
**Goal:** Align the Sanity data model with the anonymous, 100-char spec.

- [x] Replace [`sanity/schemas/feedback.ts`](sanity/schemas/feedback.ts):
  - Remove `name`, `role`, `rating` fields
  - Change `message` max validation from 500 → 100, min from 10 → 1
  - Keep `submittedAt` hidden field
  - Update `preview` block to use `message` as title
- [x] Verify Sanity Studio at `/studio` reflects the new schema

**Done when:** Studio shows only a `message` field on the feedback document.

---

### Milestone 2 — Write API
**Goal:** Accept anonymous feedback submissions server-side.

- [x] Create `src/app/api/feedback/route.ts` (POST handler)
  - Read `message` from request body
  - Validate: non-empty, max 100 chars (server-side guard)
  - Write to Sanity via `writeClient` with `submittedAt: new Date().toISOString()`
  - Return `201` on success, `400` on validation failure, `500` on Sanity error
- [x] Test with `curl` or a REST client before wiring up the UI

**Done when:** `POST /api/feedback` with `{"message":"hello"}` creates a document in Sanity.

---

### Milestone 3 — Feedback Wall (Display)
**Goal:** Render all existing feedback as floating cards on the page.

- [x] Update `src/app/page.tsx` (Server Component):
  - Fetch all feedback documents via `client.fetch()` with GROQ
  - Pass results as props to a `<FeedbackWall>` Client Component
- [x] Create `src/components/FeedbackWall.tsx` (`"use client"`):
  - Render each card at a pseudo-random position using seeded offsets from `_id`
  - Default state: `opacity-30` + `blur-sm`
  - Hover state: `opacity-100` + `blur-none` + smooth `transition`
  - Card shows only the `message` text — no metadata visible to users

**Done when:** Existing feedback documents appear as floating, hover-to-reveal cards.

---

### Milestone 4 — Add Feedback Modal
**Goal:** Let users write and submit anonymous feedback from the page.

- [x] Create `src/components/AddFeedbackButton.tsx` (`"use client"`):
  - Fixed position button (bottom-right corner)
  - Controls modal open/close state
- [x] Create `src/components/FeedbackModal.tsx` (`"use client"`):
  - Overlay with `<textarea>` (auto-focus on open)
  - Live character counter: `{count}/100`
  - Disables submit when empty or over 100 chars
  - On submit: POST to `/api/feedback`, show loading state, close on success
  - On error: show inline error message, keep modal open
  - Close on `Escape` key or clicking outside
- [x] Mount both components in `src/app/page.tsx`

**Done when:** Full submit flow works end-to-end: button → modal → POST → new card appears on next page load.

---

### Milestone 5 — Optimistic UI & Polish
**Goal:** Make the experience feel instant and production-quality.

- [x] After successful submit, optimistically append the new card to the wall
  without a full page reload (update local state in `FeedbackWall`)
- [x] Add entrance animation for newly added cards (`animate-pop-in`)
- [x] Add empty-state copy for when there are zero submissions
- [x] Ensure modal and wall are responsive on screens < 375px
- [x] Accessibility: focus trap in modal, `aria-modal`, `aria-label` on button

**Done when:** New feedback appears instantly after submit; page passes a basic
accessibility check.

---

## 8. Out of Scope (this version)

- Moderation / admin approval before cards appear publicly
- Edit or delete own submission
- Reactions or replies to cards
- Rate limiting on the write API
- Authentication of any kind
