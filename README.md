# BudgetWise

A personal finance app for tracking monthly budgets and expenses. Built with a React + TypeScript frontend backed by Supabase (Postgres + Auth + Storage), deployed on Cloudflare.

---

## Features

- **Monthly budget tracking** - create budget categories with limits and track spending in real time
- **Expense logging** - add, edit, and delete expenses per category, with photo receipts
- **Receipt scanning (OCR)** - snap a photo of a receipt and the amount is auto-filled via on-device OCR
- **Receipt gallery** - browse every scanned/attached receipt in one place
- **Income tracking** - log salary and other income sources per month
- **Recurring income** - set up income sources (e.g. salary) that auto-log each month on a chosen day
- **Savings goals** - set named targets (e.g. "New Laptop") and track contributions toward them
- **Net savings** - real income-minus-expenses figure on the Dashboard, alongside budget utilization
- **Recurring templates** - set up recurring expenses (subscriptions, rent, etc.) that auto-apply each month
- **Bill reminders** - optional browser notifications for bills due within 3 days
- **Backup & restore** - export/import all your data as a JSON file
- **Spending insights** - progress bars, status indicators (On Track / Near Limit / Over Budget), and alerts
- **Annual summary** - year-over-year view of all categories
- **Charts** - visualise spending trends over time
- **CSV export** - download a full month's budget and expense breakdown
- **Dark / light / system theme** - toggle in Settings
- **PWA support** - install to your phone or desktop home screen for a native app feel

---

## Tech Stack

| Layer                 | Technology                                                 |
| --------------------- | ---------------------------------------------------------- |
| Frontend              | React 19, TypeScript, Vite                                 |
| Routing               | TanStack Router                                            |
| State / data fetching | TanStack Query                                             |
| Styling               | Tailwind CSS v3 (oklch color space), shadcn/ui             |
| Fonts                 | Inter (display/body), JetBrains Mono                       |
| Backend               | Supabase (Postgres, Row Level Security)                    |
| Auth                  | Supabase Auth (email/password)                             |
| File storage          | Supabase Storage (receipt photos)                          |
| Hosting               | Cloudflare Workers (static assets)                         |
| PWA                   | vite-plugin-pwa + Workbox                                  |
