# Beity — frontend demo

Homemade, from someone's kitchen to yours. Front end only: every cook, dish,
order, request and chat message lives in React state seeded from
`src/data/seed.js`. There is no backend, no auth and no persistence — a refresh
gives you a clean slate.

```bash
npm install
npm run dev      # http://localhost:5173
```

## The 2-minute run-through

1. **Landing** — "Beity" on the blurred stripe. Hit **Sign Up → Craver**, fill
   the form (pick a couple of preferences — they drive the recommendations).
2. **Craver home** — the "Recommended for you" row is ranked by what you just
   picked. Hover a meal card for ingredients, price, calories and reviews;
   click it to order.
3. **Special Request** (bottom left) — post a custom meal; it appears in the
   cooks' Special Requests column.
4. **Profile** (top right) — orders with statuses, the unrated delivered order
   with its Taste / On-time prompt, your requests, liked cooks and reviews.
5. **Switch to the cook** — the round button bottom right → *View as Cook*.
   Sidebar modals (Current Orders, Past Orders, Transaction Tracker with the
   earnings chart), the menu list, and the Special Requests column. **Accept**
   a request, then **Chat** — send a message, or **Propose price & date**.
6. **Switch back to Craver** to accept the proposal from the other side.

The demo button also has **Reset demo data** if a rehearsal left things messy.

## Dish photos

The 15 seeded dishes each map to a photo in `public/dishes/`. The filename comes
from the dish's `photo` field in `src/data/seed.js`, not from its name, so the
two can differ (`Ta'meya & Foul Platter` -> `falafel.jpeg`). Extensions are
tried in order — `.jpeg`, `.jpg`, `.png`, `.webp` — so it does not matter which
you save.

To add another dish, set `photo: 'my-file'` on it and drop `my-file.jpeg` in.
A dish with no matching file (including anything a cook adds live via **Add
Dish**) falls back to a warm gradient plate placeholder, so nothing ever renders
as a broken image.

## Structure

```
src/
  data/seed.js          all mock data (3 cooks, 15 dishes, orders, requests, threads)
  data/filters.js       filter groups, preference and cuisine options
  store/BeityContext.jsx  one reducer holding the entire app state
  lib/match.js          search, filtering, recommendation and request matching
  components/ui/        Button, Modal, Chip, Field, StarRating, FoodImage, BarChart…
  components/layout/    BrandMark, TopBar, DemoRoleSwitcher
  components/auth/      role picker + both signup forms
  components/craver/    search, filters, meal cards, order flow, rating prompt
  components/cook/      sidebar, details panel, menu rows, dashboard modals
  components/chat/      drawer, bubbles, price-and-date proposals
  pages/                Landing, CraverHome, CraverProfile, CookProfile
```

| Route | What it is |
| --- | --- |
| `/` | Landing page |
| `/craver` | Craver home — search, filters, meal grid |
| `/craver/profile` | Craver profile — orders, requests, liked cooks, reviews |
| `/cook` | Cook dashboard — sidebar, details, My Menu, Special Requests |
| `/cooks/:cookId` | Public kitchen page a craver sees — centre column only |

## Wiring up a backend later

`src/store/BeityContext.jsx` is the only place that touches data. Each action on
the context value (`placeOrder`, `addRequest`, `setRequestStatus`, `sendMessage`,
…) maps one-to-one onto an endpoint, so swapping the reducer for API calls
shouldn't need changes in any component.
