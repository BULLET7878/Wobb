# Wobb Frontend Assignment

A starter influencer search application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. This project is intentionally left in a rough-but-working state for candidates to improve.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## What's Included

- **Search / Dashboard** — filter influencers by platform (Instagram, YouTube, TikTok) and search by username or full name
- **Profile Details** — click a profile to view extended data loaded from individual JSON files
- **Routing** — `react-router-dom` with `/` (search) and `/profile/:username` (details)

Sample data lives in:

- `src/assets/data/search/` — platform search results (10 profiles each)
- `src/assets/data/profiles/` — detailed profile JSON per username

## How to Submit

1. **Download or clone** this starter project to your machine.
2. **Create a new repository** on your own GitHub account. Do not fork the original assignment repo — push your work to a repo you own.
3. Complete the tasks below and push your changes to that repository.
4. **Share the public GitHub repository URL** with us as your submission.

### Deadline (strict)

- **Due:** **2 July 2026, 2:00 PM IST** (Indian Standard Time, UTC+5:30)
- **Any git commits made after this deadline will disqualify your submission.** We will only consider the repository state as of the deadline; late commits will not be reviewed.
- Make sure your final work is pushed **before** the cutoff.

## AI Usage

You may use any AI tools (Cursor, ChatGPT, Claude, GitHub Copilot, etc.). We are evaluating your final solution and engineering decisions.

## Your Tasks

Complete the following as part of your submission:

1. **Find and fix all bugs and quality issues** — the codebase contains intentional bugs and quality issues. Identify and resolve them.

2. **Completely redesign the UI/UX** — replace the basic layout with a polished, modern interface. Focus on usability, visual hierarchy, and delight.

3. **Replace React Context with Zustand** — when you implement state management for the selected list, use [Zustand](https://github.com/pmndrs/zustand) instead of React Context.

4. **Implement "Select profile & Add to List"** — the disabled "Add to List" button is a stub. Build the full feature:
   - Select / add profiles to a persistent list
   - View and manage the selected list
   - Handle duplicates appropriately

5. **Improve code quality and project structure** — refactor as needed, add proper types, and follow React best practices.

6. **Optimize performance** — apply sensible optimizations where appropriate.

7. **Use any libraries you need** — you are not limited to the current stack. Choose tools that help you deliver a great result (UI kits, state managers, testing libraries, etc.).

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start development server |
| `npm run build`| Production build         |
| `npm run lint` | Run ESLint               |

## Submission Notes

- Document any assumptions or trade-offs in your README
- Ensure `npm run build` passes before submitting
- Focus on demonstrating your judgment — not every possible feature needs to be built, but the core assignment items should be addressed thoughtfully
- Double-check that your repo is public (or that we have access) and that the link is included in your submission
- Please make meaningful commits throughout your work. We may review your commit history.
- **Bonus:** Deploying the app (e.g. Vercel, Netlify, GitHub Pages) is optional but will be considered a plus — include the live URL in your submission if you do

Good luck!

---

# Candidate Submission Notes

I have successfully resolved all starter issues and delivered a premium, high-performance web dashboard.

## Key Changes & Bug Fixes

1. **Bug: Case-Sensitive Username Filtering** (`src/utils/dataHelpers.ts`)
   - **Issue:** Query searches matched username case-sensitively while full name was case-insensitive.
   - **Fix:** Converted the username matching check to lowercase to ensure a consistent, case-insensitive search experience.

2. **Bug: Miscalculated Engagement Rate** (`src/pages/ProfileDetailPage.tsx`)
   - **Issue:** The detail page multiplied the raw engagement rate decimal (e.g., `0.01425`) by `10000` (yielding `142.50%` instead of `1.43%`).
   - **Fix:** Standardized to use the consolidated formatter, which correctly multiplies by `100` and fixes standard decimal rounding.

3. **Bug: Stale Click Count Console Logging** (`src/pages/SearchPage.tsx`)
   - **Issue:** The `handleProfileClick` method logged `clickCount` before the state update took effect.
   - **Fix:** Completely refactored `SearchPage.tsx` navigation actions and removed this unused, buggy counter logic.

4. **Bug: Engagements Metric Displaying Rate** (`src/pages/ProfileDetailPage.tsx`)
   - **Issue:** The detail card for "Engagements" displayed the formatted engagement rate percentage instead of the raw engagements count.
   - **Fix:** Updated the bindings to correctly format and display the total engagements count.

5. **Consolidated Formatters** (`src/utils/formatters.ts`)
   - Cleaned up duplicated follower/view formatters that were scattered in different local files and unified them.

## Zustand State Store & Persistent List

- Installed and integrated `zustand` to replace the React Context stub.
- Created `src/store/useInfluencerStore.ts` using Zustand's `persist` middleware to persist selected creators in `localStorage` across page reloads.
- Developed an interactive slide-over drawer (`SavedInfluencerDrawer.tsx`) to inspect saved creators, aggregate outreach reach (total followers), and compute average engagement rate.
- Added quick export tools:
  - **Copy Handles:** Copies all selected handles (e.g. `@mrbeast, @cristiano`) with success state alerts.
  - **Export CSV / JSON:** Triggers instant downloads of formatted spreadsheets and data packets for outreach campaigns.

## UI/UX Redesign (Tailwind CSS v4)

- **Root Dark Theme:** Overhauled the basic layout to implement an ultra-premium dark theme with deep purples, neon accents, and clean layout hierarchies.
- **Glassmorphism:** Styled search containers, card wrappers, and sidebar sheets with frosted glass panels (`backdrop-filter`) and violet glowing borders.
- **Platform Accents:** Provided custom glow colors, overlays, and outline rings tailored specifically to platform brands: pink-purple for Instagram, red for YouTube, and aquamarine for TikTok.
- **Responsive Layout:** Engineered responsive grids, transitions, and slide-in panels to adapt cleanly to all screen sizes.

