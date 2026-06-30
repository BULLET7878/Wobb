# Wobb Creator Index

A modern, premium influencer search and campaign management dashboard built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**.

> 🔗 **Repository:** https://github.com/BULLET7878/Wobb
> 🔗 **Live Link (vercel)**  

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

---

## What Was Changed

### 1. 🐛 Bug Fixes

| Bug | File | Fix |
|-----|------|-----|
| Case-sensitive username search | `utils/dataHelpers.ts` | Convert both query and username to lowercase before matching |
| Engagement rate displayed as `142.50%` instead of `1.43%` | `pages/ProfileDetailPage.tsx` | Was multiplying by `10000` — fixed to use the `formatEngagementRate` util which multiplies by `100` |
| "Engagements" card showed rate string instead of count | `pages/ProfileDetailPage.tsx` | Bound to `user.engagements` (the raw integer) and formatted with `formatNumber()` |
| Stale `clickCount` in console log | `pages/SearchPage.tsx` | Removed unused counter and dead logging code entirely |
| Profile file loading failed for mixed-case usernames (e.g. `MrBeast6000`) | `utils/profileLoader.ts` | Implemented case-insensitive glob key matching |
| Platform not resolved when query param is missing | `pages/ProfileDetailPage.tsx` | Falls back to `user.type` field from JSON data |
| Duplicate formatter logic scattered across components | Multiple files | Consolidated into `utils/formatters.ts` |
| Unused `SearchBar.tsx` component | Removed | Component was never rendered anywhere in the app |

---

### 2. 🎨 UI/UX Redesign

- **Dark Glassmorphism Theme** — deep charcoal background (`#080710`) with frosted glass panels using `backdrop-filter: blur`
- **Brand-specific Platform Accents** — pink-purple for Instagram, red for YouTube, cyan for TikTok — applied across tabs, badges, and avatar overlays
- **Premium Typography** — Google Fonts (`Outfit` + `Plus Jakarta Sans`) loaded via preconnect in `index.html`
- **Responsive Grid Layout** — double-column creator grid on desktop, single-column on mobile
- **Sticky Navbar** — fixed nav bar with blur background, brand logo, and campaign list counter badge
- **Animated Drawer** — smooth slide-in/out panel for the campaign list
- **Micro-interactions** — hover lifts on cards, glow pulses on active buttons, smooth state transitions
- **Accessibility** — keyboard navigation support, ARIA labels/roles throughout, `prefers-reduced-motion` media query, `focus-visible` rings

---

### 3. ⚡ Performance Optimizations

| Optimization | Where |
|---|---|
| `React.memo` on `ProfileCard`, `ProfileList`, `PlatformFilter` | Prevents re-renders when parent state changes unrelated to these components |
| `useMemo` for profile extraction and filtering | `SearchPage.tsx` — avoids re-running expensive filter on every keystroke unless deps change |
| `useCallback` for all event handlers passed as props | `SearchPage.tsx`, `ProfileCard.tsx`, `PlatformFilter.tsx` |
| Granular Zustand selectors (per field, not whole store) | `ProfileCard.tsx` — subscribes only to `isSaved(id)`, not the full list |
| Static platform icon components extracted outside render | `PlatformFilter.tsx` — avoids JSX recreation on each render cycle |
| Image `loading="lazy"` + explicit `width`/`height` | `ProfileCard.tsx` — prevents layout shift and defers off-screen images |
| `import.meta.glob` for profile JSON | `profileLoader.ts` — lazy-loaded profile chunks, only fetched on demand |

---

### 4. 🗂️ Zustand State Management

Replaced React Context with **Zustand** using the `persist` middleware:

```ts
// src/store/useInfluencerStore.ts
const useInfluencerStore = create(
  persist(
    (set, get) => ({ ... }),
    { name: "wobb-influencers" }  // persisted to localStorage
  )
)
```

**Store API:**
- `addInfluencer(profile, platform)` — adds with duplicate prevention
- `removeInfluencer(userId)` — removes by ID
- `clearList()` — resets the whole list
- `isSaved(userId)` — returns boolean for a given profile

---

### 5. 📋 Campaign List (Add to List Feature)

- **Save/Remove** from both the search card and the profile detail page
- **Persistent across reloads** via `localStorage`
- **Duplicate prevention** built into the store
- **Slide-out Drawer** showing:
  - **Total Reach** — sum of followers across all saved creators
  - **Avg Engagement Rate** — computed mean across those with known rates
  - **Platform Breakdown** — count of saved creators per platform
- **Quick Actions:**
  - Copy all handles to clipboard (e.g. `@mrbeast, @cristiano`)
  - Export as **CSV** — formatted spreadsheet download
  - Export as **JSON** — structured data download
  - Remove individual creators
  - Clear entire list

---

### 6. 🧱 Code Quality Improvements

- **Strict TypeScript** — all components fully typed, no `any` types
- **Folder structure** — `/store`, `/utils`, `/components`, `/pages`, `/types` clearly separated
- **Reusable sub-components** — `VerifiedBadge`, `PlatformBadge`, `PlatformDot`
- **Single responsibility** — each file/component has one clear purpose
- **No dead code** — removed unused `SearchBar.tsx`, unused state variables, and debug `console.log` calls
- **Consistent formatting** — consolidated all number/rate formatters into `utils/formatters.ts`

---

## Libraries Added

| Library | Purpose |
|---|---|
| `zustand` | Lightweight global state management with persistence |
| `lucide-react` | Consistent, accessible SVG icon set |
| `Google Fonts` (via `index.html`) | `Outfit` + `Plus Jakarta Sans` premium typography |

---

## Assumptions & Trade-offs

- **No backend** — all data is served from static JSON files in `src/assets/data/`. The profile detail page shows "not found" for creators without a corresponding JSON file.
- **Platform detection** — the `platform` for a profile detail page is inferred from the profile JSON's `type` field, with a fallback to the URL query param, then to `"instagram"`.
- **No pagination** — the search data contains 10 results per platform, which fits within one view. Pagination was not implemented since the data set is small.
- **No authentication** — the list is stored in `localStorage` and is therefore local to the user's browser session.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build (passes ✅) |
| `npm run lint` | ESLint (passes with 0 errors ✅) |
