# BudgetWise

A personal finance app for tracking monthly budgets and expenses. Built with a React + TypeScript frontend backed by Supabase (Postgres + Auth + Storage), deployed on Cloudflare.

---

## Features

- **Monthly budget tracking** - create budget categories with limits and track spending in real time
- **Custom categories** - add your own budget categories alongside the built-in list
- **Budget rollover** - opt in per budget to carry unused room into the next month
- **Expense logging** - add, edit, and delete expenses per category, with photo receipts
- **Split transactions** - divide a single expense across multiple budgets
- **Receipt scanning (OCR)** - snap a photo of a receipt and the amount is auto-filled via on-device OCR
- **Receipt gallery** - browse every scanned/attached receipt in one place
- **Income tracking** - log salary and other income sources per month
- **Recurring templates & income** - expenses and income that auto-apply monthly, quarterly, or annually
- **Accounts & net worth** - track checking, savings, credit card, loan, and investment balances in one place
- **Debt payoff planning** - avalanche/snowball payoff simulator with an extra-payment slider
- **Savings goals** - set named targets (e.g. "New Laptop") and track contributions toward them
- **Net savings** - real income-minus-expenses figure on the Dashboard, alongside budget utilization
- **Bill reminders** - optional browser notifications for bills due within 3 days
- **Backup & restore** - export/import all your data as a JSON file
- **Bank statement import** - bulk-add expenses from CSV (handles a few header rows before the real columns, and separate Debit/Credit columns) or OFX/QFX, or download a month's breakdown as CSV
- **Quick Add** - paste a bank SMS/push notification (or a screenshot of one) and the amount, date, and merchant are pulled out automatically for you to check before saving; nothing about the image itself is stored, only the extracted text
- **Auto-categorization** - expenses get a suggested budget from the merchant name, learning from the categories you actually pick so it gets better with use
- **Undo on delete** - deleting an expense or category shows a brief Undo toast instead of deleting instantly
- **Spending insights** - progress bars, status indicators (On Track / Near Limit / Over Budget), and alerts
- **Annual summary** - year-over-year view of all categories
- **Charts** - visualise spending trends over time
- **Dark / light / system theme** - toggle in Settings
- **PWA support** - install to your phone or desktop home screen for a native app feel
- **Offline support** - your last synced data renders instantly with no connection; new expenses queue on-device and sync automatically once you're back online
- **Password reset** - "Forgot password?" on the sign-in screen sends a reset link
- **Account deletion** - permanently delete your account and every budget, expense, and other record tied to it, from Settings

---

## Tech Stack

| Layer                 | Technology                                                 |
| --------------------- | ---------------------------------------------------------- |
| Frontend              | React 19, TypeScript, Vite                                 |
| Routing               | TanStack Router                                            |
| State / data fetching | TanStack Query                                             |
| Styling               | Tailwind CSS v3 (oklch color space), shadcn/ui             |
| Fonts                 | Fraunces (display), Source Sans 3 (body), IBM Plex Mono    |
| Backend               | Supabase (Postgres, Row Level Security)                    |
| Auth                  | Supabase Auth (email/password)                             |
| File storage          | Supabase Storage (receipt photos)                          |
| Testing               | Vitest                                                     |
| Hosting               | Cloudflare Workers (static assets)                         |
| PWA                   | vite-plugin-pwa + Workbox                                  |
| Offline persistence   | TanStack Query persist client + IndexedDB (idb-keyval)     |

---

## Getting Started

Requires Node >=22.13 and pnpm >=11 (both pinned in `package.json`'s
`engines` field) - pnpm itself won't run on an older Node.

```bash
pnpm install
cp src/frontend/.env.example src/frontend/.env.local   # fill in your Supabase project's URL/anon key
pnpm dev
```

Other scripts (run from the repo root, or inside `src/frontend`):
`pnpm build`, `pnpm typecheck`, `pnpm check` (lint + format), `pnpm test`.

Against a fresh Supabase project, apply everything in
`supabase/migrations/` before running the app - see Deployment notes below.

---

## Deployment notes

**Database migrations.** Nothing runs these automatically - apply everything
in `supabase/migrations/`, in filename order, against your Supabase project:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

No CLI/local link handy? Paste each file's contents into the Supabase
Dashboard's SQL Editor instead, in the same filename order.

**Account deletion Edge Function.** `supabase/functions/delete-account` needs
the service-role key, which must never ship to the browser, so it can't run
client-side. Deploy it separately:

```bash
supabase functions deploy delete-account
```
