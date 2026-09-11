# Beity — Fullstack Hackathon Build

*Homemade, from someone's kitchen to yours.*

## The Problem

This platform was made with two problems in mind:

- There are thousands of students who travel to a different city to attend university, leaving behind their family, and starting an independent life in university dorms. A problem most of them face is their meals. Some students don't have the time to prepare a healthy, nourishing meal everyday; others simply don't know how to cook. This problem faces not only students, but also employees, mothers, athletes and many more. The solution that they usually turn to is ordering fast food, but that's neither healthy nor cost-efficient on the long run.

- On the other end of this problem, many Egyptian women try to provide a secondary (or sometimes primary) source household income by preparing homecooked meals for anyone who orders. However, they usually rely entirely on word of mouth to grow their customer base — an unreliable channel that leaves them without orders for days at a time, with no way to grow beyond their personal network.

**Beity** connects home cooks ("Cooks"), who provide delicious homecooked meals at a reasonable price, with people longing for those healthy, nourishing meals ("Cravers") — giving Cooks a real path to more customers, and Cravers a real path to home-cooked food.

## Demo Video

[Link to demo video](#) https://drive.google.com/drive/folders/1J8iNCuZkjv82ZI2EZxWHoQponw1ORcaN?usp=sharing

## Tech Stack

**Frontend**
- React (Vite)
- JavaScript (plain JSX, no TypeScript)
- Tailwind CSS
- React Router
- lucide-react (icons)
- Hand-rolled UI primitives (Button, Modal, Card, Chip, Input, Textarea, Slider, TagInput, StarRating, Avatar, FoodImage, Badge, EmptyState, BarChart)
- Leaflet.js + react-leaflet with OpenStreetMap tiles (location pinning, no API key required)
- Context API + useReducer for shared app state

**Backend**
- Node.js + Express
- SQLite via better-sqlite3 (no external database server required)
- Plain SQL (no ORM)
- CORS for local frontend↔backend communication
- Custom Haversine formula for distance calculations


## Running the App

### 1. Install dependencies
```bash
npm install
```

### 2. Start the Backend (Node.js + Express + SQLite)
```bash
npm run server     # Starts on http://localhost:5000
```
> The server automatically initializes SQLite (`server/data/beity.db`) and seeds it with demo Egyptian cooks, dishes, orders, reviews, and chat threads if empty.
> To re-seed at any time, run: `npm run seed`

### 3. Start the Frontend (React + Vite)
In a second terminal:
```bash
npm run dev        # http://localhost:5173
```
> Vite proxies `/api/*` directly to `http://localhost:5000`.

## Feature Walkthrough

1. **Landing** — "Beity" on the blurred stripe. Hit **Sign Up → Craver**, fill in the form (pick a couple of preferences — they drive the recommendations).
2. **Craver home** — the "Recommended for you" row is ranked by what you just picked. Hover a meal card for ingredients, price, calories, and reviews; click it to order.
3. **Special Request** (bottom left) — post a custom meal; it appears in the cooks' Special Requests column.
4. **Profile** (top right) — orders with statuses, the unrated delivered order with its Taste / On-time rating prompt, your requests, liked cooks, and reviews.
5. **Switch to the cook view** — the round button bottom right → *View as Cook*. Sidebar modals (Current Orders, Past Orders, Transaction Tracker with the earnings chart), the menu list, and the Special Requests column. **Accept** a request, then open **Chat** — send a message, or **Propose price & date**.
6. **Switch back to Craver** to accept the proposal from the other side.

The demo button also has **Reset demo data** if a rehearsal left things messy.

## Dish photos

The 15 seeded dishes each map to a photo in `public/dishes/`. The filename comes from the dish's `photo` field in `src/data/seed.js`, not from its name, so the two can differ (e.g. `Ta'meya & Foul Platter` → `falafel.jpeg`). Extensions are tried in order — `.jpeg`, `.jpg`, `.png`, `.webp` — so it doesn't matter which you save.

To add another dish, set `photo: 'my-file'` on it and drop `my-file.jpeg` into `public/dishes/`. A dish with no matching file (including anything a cook adds live via **Add Dish**) falls back to a warm gradient plate placeholder, so nothing ever renders as a broken image.

## Project Structure

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

## Backend Architecture

The backend is built with **Node.js**, **Express**, and **better-sqlite3**:

- **Database**: SQLite database stored at `server/data/beity.db`.
- **Bilingual & Model Serialization**: Rows are mapped to `{ en, ar }` bilingual shapes matching the frontend React UI requirements.
- **Polling Chat**: Messages are fetched with regular lightweight polling (`GET /api/threads/:id/messages`) without requiring WebSockets.

### API Endpoints

- `GET /api/demo-users` — Fetch demo accounts for login
- `GET /api/cooks` & `GET /api/cooks/:id` & `POST /api/cooks` — Cook profiles and signup
- `POST /api/cravers` & `PATCH /api/cravers/:id` — Craver signup and profile updates
- `GET /api/dishes` & `POST /api/dishes` — Dish browsing with search & tags, and menu additions
- `GET /api/orders` & `POST /api/orders` & `PATCH /api/orders/:id/status` — Order placement & status changes
- `GET /api/requests` & `POST /api/requests` & `PATCH /api/requests/:id/status` — Custom meal requests & cook responses
- `GET /api/threads/:id/messages` & `POST /api/threads/:id/messages` & `PATCH /api/threads/:id/messages/:messageId` — Real-time chat & price/date proposals
- `POST /api/reviews` — Craver ratings & dish rating recalculations
