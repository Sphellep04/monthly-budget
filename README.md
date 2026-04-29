# BudgetWise

A personal finance app for tracking monthly budgets and expenses. Built on the Internet Computer Protocol (ICP) with a React + TypeScript frontend and a Motoko backend canister.

---

## Features

- **Monthly budget tracking** — create budget categories with limits and track spending in real time
- **Expense logging** — add, edit, and delete expenses per category
- **Recurring templates** — set up recurring expenses (subscriptions, rent, etc.) that auto-apply each month
- **Spending insights** — progress bars, status indicators (On Track / Near Limit / Over Budget), and alerts
- **Annual summary** — year-over-year view of all categories
- **Charts** — visualise spending trends over time
- **CSV export** — download a full month's budget and expense breakdown
- **Dark / light / system theme** — toggle in Settings
- **PWA support** — install to your phone or desktop home screen for a native app feel

---

## Tech Stack

| Layer                 | Technology                                                 |
| --------------------- | ---------------------------------------------------------- |
| Frontend              | React 19, TypeScript, Vite                                 |
| Routing               | TanStack Router                                            |
| State / data fetching | TanStack Query                                             |
| Styling               | Tailwind CSS v3 (oklch color space), shadcn/ui             |
| Fonts                 | Bricolage Grotesque (display), DM Sans (body), Geist Mono  |
| Backend               | Motoko canister on ICP                                     |
| Auth                  | Internet Identity                                          |
| PWA                   | vite-plugin-pwa + Workbox                                  |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) 8+
- [DFX](https://internetcomputer.org/docs/current/developer-docs/getting-started/install/) (for deploying to ICP — not needed for local mock dev)

### Local development (mock backend)

The frontend runs fully without a deployed canister using the built-in mock backend.

> **Important:** all `pnpm` commands must be run from inside `monthly-budget/src/frontend/`, not the repo root. Running them from the wrong directory will produce `ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND`.

**Step 1 — Navigate to the frontend folder**

```powershell
cd "monthly-budget\src\frontend"
```

**Step 2 — Install dependencies** *(first time only)*

```powershell
pnpm install
```

**Step 3 — Enable mock mode** *(first time only — creates `.env.local`)*

```powershell
# PowerShell
"VITE_USE_MOCK=true" | Out-File -FilePath .env.local -Encoding utf8
```

```bash
# bash / Git Bash
echo "VITE_USE_MOCK=true" > .env.local
```

**Step 4 — Start the dev server**

```powershell
pnpm dev
```

**Step 5 — Open in your browser**

```
http://localhost:5173
```

The app will skip the login screen and load with sample data automatically.

---

### Full ICP deployment

```bash
# From the monthly-budget/ directory
dfx start --background
dfx deploy
```

Then open the frontend canister URL printed by DFX.

---

## Project Structure

```text
monthly-budget/
├── src/
│   ├── frontend/          # React app (Vite)
│   │   ├── src/
│   │   │   ├── components/    # UI components (Sidebar, BudgetCard, …)
│   │   │   ├── hooks/         # Data hooks (useBudget, useActorOrMock, …)
│   │   │   ├── mocks/         # Mock backend for local dev
│   │   │   ├── pages/         # Route pages
│   │   │   └── types/         # Shared types + helpers
│   │   ├── public/
│   │   │   ├── icons/             # PWA icons (generated from BudgetWise-Logo.png)
│   │   │   ├── BudgetWise-Logo.png  # Source logo — run gen-pwa-icons.mjs after updating
│   │   │   └── apple-touch-icon.png
│   │   └── vite.config.js
│   ├── backend/           # Motoko canister
│   └── declarations/      # Auto-generated Candid bindings
└── dfx.json
```

---

## PWA / Mobile

BudgetWise is configured as a Progressive Web App. After deploying:

1. Open the app in Chrome (Android) or Safari (iOS)
2. Tap **Add to Home Screen**
3. The app will launch full-screen, like a native app

**Updating icons:** PWA icons are generated from `public/BudgetWise-Logo.png`. If you update the logo file, regenerate all icon sizes by running:

```bash
cd src/frontend
node scripts/gen-pwa-icons.mjs
```

This will overwrite `public/icons/*.png` and `public/apple-touch-icon.png`.

---

## Theme

The app respects your OS preference by default (light/dark/system). You can override it any time via **Settings → Appearance**.

---

## Environment Variables

| Variable              | Default                       | Purpose                                               |
| --------------------- | ----------------------------- | ----------------------------------------------------- |
| `VITE_USE_MOCK`       | `false`                       | Set to `true` to bypass ICP and use mock data locally |
| `CANISTER_ID_BACKEND` | —                             | Set automatically by DFX on deploy                    |
| `II_URL`              | identity.internetcomputer.org | Internet Identity URL                                 |

---

## License

Private — all rights reserved.
