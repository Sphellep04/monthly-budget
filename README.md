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
- **CSV import & export** - bulk-add expenses from a bank statement or another app, or download a month's breakdown
- **Undo on delete** - deleting an expense or category shows a brief Undo toast instead of deleting instantly
- **Spending insights** - progress bars, status indicators (On Track / Near Limit / Over Budget), and alerts
- **Annual summary** - year-over-year view of all categories
- **Charts** - visualise spending trends over time
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
| Fonts                 | Fraunces (display), Source Sans 3 (body), IBM Plex Mono    |
| Backend               | Supabase (Postgres, Row Level Security)                    |
| Auth                  | Supabase Auth (email/password)                             |
| File storage          | Supabase Storage (receipt photos)                          |
| Testing               | Vitest                                                     |
| Hosting               | Cloudflare Workers (static assets)                         |
| PWA                   | vite-plugin-pwa + Workbox                                  |
