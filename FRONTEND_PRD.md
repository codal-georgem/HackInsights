# Frontend PRD — HackInsights UI Upgrade

**Status:** v1 Complete · v2 In Progress
**Last Updated:** 2025-02-21
**Parent:** [PRD.md](PRD.md)

---

## v2 Requirements (Codal AI Hackathon Rebrand)

### New Packages
| Package | Purpose |
|---|---|
| `framer-motion` | All animations — replaces CSS keyframes |
| `@tiptap/react` + `@tiptap/starter-kit` | Rich text editor (bold, italic only — no HTML/scripts) |
| `@tiptap/extension-character-count` | Enforce 1000-char limit in editor |
| `canvas-confetti` | Celebration burst from both sides after submit |

> **Note on Draft.js:** Draft.js uses deprecated React 16 APIs (`ReactDOM.render`, `React.createClass`) and is incompatible with React 19. **Tiptap** is the modern equivalent — same editing paradigm, React 19-ready, and actively maintained.

> **Note on colors.png:** `public/colors.png` did not exist. Brand colors were derived directly from the downloaded Codal logo (`public/codal-logo.png`) — deep indigo `#4432F5` on near-black background. Color tokens documented in `globals.css`.

### Char Limit Change
`100 → 1000` in: schema validation, API route, editor CharacterCount config.

### Branding
- Header title: **"Codal AI Hackathon"**
- Logo: `public/codal-logo.png` (72×72 PNG, left side of header)
- Full dark theme using Codal brand palette

### Color Palette (from logo)
| Token | Value | Usage |
|---|---|---|
| `--c-bg` | `#060818` | Page background |
| `--c-surface` | `#0C1525` | Cards, modal |
| `--c-border` | `#1B2C4A` | Borders |
| `--c-primary` | `#4432F5` | CTAs, accents |
| `--c-primary-light` | `#6457F0` | Hover states |
| `--c-text` | `#E4EEFF` | Primary text |
| `--c-muted` | `#6B84AD` | Placeholder, secondary text |

### v2 Milestones

#### FE-V2-M1 — Branding + Colors
- [ ] `public/codal-logo.png` downloaded ✓ (done above)
- [ ] `globals.css`: Codal color tokens + ProseMirror editor styles
- [ ] `Header.tsx`: logo + "Codal AI Hackathon" + dark theme
- [ ] `page.tsx`: dark bg using `--c-bg`

#### FE-V2-M2 — Rich Text Editor
- [ ] `FeedbackEditor.tsx`: Tiptap with Bold/Italic toolbar, emoji insert, 1000-char limit
- [ ] Serializes to our existing `**bold**` / `*italic*` markdown format for Sanity storage
- [ ] `FeedbackModal.tsx`: funny copy + framer-motion open/close animation
- [ ] Schema + API route: 100 → 1000

#### FE-V2-M3 — Animations Upgrade
- [ ] `FeedbackWall.tsx`: framer-motion `motion.div` cards (spring entrance + whileHover)
- [ ] `CelebrationBurst.tsx`: `canvas-confetti` from both sides, fired after submit

#### FE-V2-M4 — Organizers Section
- [ ] `OrganizersSection.tsx`: fixed bottom strip, warm thanks to Markus & Stephen Yi
- [ ] Wall cards: clamp top to 80% max to avoid overlap with organizers footer

---

## 1. Scope

UI-only changes. No schema or API changes. All three enhancements must work
within the existing 100-character plain-text constraint stored in Sanity.

---

## 2. Requirements

| # | Requirement | Detail |
|---|---|---|
| FE-1 | Rich editor toolbar | Emoji picker + Bold + Italic formatting in the modal |
| FE-2 | Top-anchored CTA | "Add Thought" button lives in a sticky header, always visible |
| FE-3 | Visible card entrance | New card drops in with a dramatic multi-step animation + glow ring |

---

## 3. Design Decisions

### FE-1 Rich Editor
- **No heavy library** (TipTap/Slate) — 100-char limit makes a full editor overkill
- **Emoji**: curated grid of ~40 hackathon-relevant emojis, toggled by a toolbar button
- **Bold/Italic**: Markdown-style markers (`**bold**`, `*italic*`) inserted at cursor or around selection
- Markers count toward the 100-char budget (displayed in live counter)
- `FeedbackWall` cards parse and render these markers inline (`<strong>`, `<em>`)

### FE-2 Top Header
- Sticky `<header>` with glassmorphism (`backdrop-blur-md bg-white/80`)
- Left: site title + tagline. Right: "Add Thought" pill button with pulse dot
- `FeedbackWall` container gets `pt-[72px]` to avoid overlap
- Replaces the old `fixed bottom-6 right-6` button

### FE-3 Card Animation
- `@keyframes card-launch`: drop from above → overshoot → bounce → settle dimmed
- Glow ring: `box-shadow` pulses outward on the new card then fades
- Duration: ~800ms total so it's noticeable but not annoying

---

## 4. Milestones

---

### FE-M1 — Top Header + CTA Relocation
**Goal:** Replace fixed bottom button with a sticky top header.

- [x] Create `src/components/Header.tsx`
  - Sticky top bar, glassmorphism, site title, tagline
  - "Add Thought" button with a pulsing blue dot indicator
- [x] Update `src/components/FeedbackPageClient.tsx` to use `Header`
- [x] Remove `AddFeedbackButton.tsx` (superseded)
- [x] Update `FeedbackWall.tsx` container: add `pt-[72px]` so cards don't hide behind header

**Done when:** Button is at the top and no card is obscured by the header.

---

### FE-M2 — Rich Editor Toolbar
**Goal:** Modal gains emoji insert and bold/italic formatting.

- [x] Add formatting toolbar row to `FeedbackModal.tsx`:
  - **B** button — wraps selection or inserts `** **` at cursor
  - **I** button — wraps selection or inserts `* *` at cursor
  - Emoji toggle button (😊) — shows/hides emoji grid below textarea
- [x] Build inline emoji grid (40 curated emojis, click to insert at cursor)
- [x] Update `FeedbackWall.tsx`: parse `**bold**` → `<strong>`, `*italic*` → `<em>` in card rendering

**Done when:** User can bold text, italicize, and insert emojis; cards render formatted output.

---

### FE-M3 — Dramatic Card Entrance Animation
**Goal:** New card is unmistakably visible when it appears.

- [x] Replace `@keyframes pop-in` in `globals.css` with `@keyframes card-launch`:
  - 0%: `scale(0.1) translateY(-80px) rotate(-8deg) blur(6px) opacity(0)`
  - 50%: `scale(1.2) translateY(6px) rotate(2deg) blur(0) opacity(1)` + blue glow ring
  - 75%: `scale(0.96) translateY(-2px) rotate(-0.5deg)` + ring fades
  - 100%: `scale(0.95) opacity(0.25)` (resting state)
- [x] Apply `animate-card-launch` to new card in `FeedbackWall.tsx`
- [x] `newestId` timeout extended to 900ms to match animation

**Done when:** New card visibly drops in from above with a bounce and glow, then settles dimmed.

---

## 5. Files Changed

| File | Change |
|---|---|
| `src/components/Header.tsx` | New — sticky header with CTA |
| `src/components/AddFeedbackButton.tsx` | Deleted — superseded by Header |
| `src/components/FeedbackModal.tsx` | Updated — add toolbar + emoji grid |
| `src/components/FeedbackWall.tsx` | Updated — markdown rendering + pt padding + new animation class |
| `src/components/FeedbackPageClient.tsx` | Updated — use Header |
| `src/app/globals.css` | Updated — replace pop-in with card-launch |
