# Project Status – Baseball League Mgmt Platform

**Last Updated:** April 2, 2026

---

## 🏗️ Overview

Premium, mobile-first, white-label youth sports league management platform built on Next.js 16 (App Router), Supabase, Tailwind CSS, and deployed to Vercel.

---

## ✅ Completed

### Infrastructure
- [x] Next.js 16 App Router project scaffolded
- [x] Tailwind CSS with full design system (CSS variables, white-label color tokens)
- [x] Supabase project connected via MCP (`ejrbawauwyjfldpurewq`)
- [x] `.env.local` configured with Supabase URL and anon key
- [x] TypeScript strict mode — zero errors
- [x] ESLint configured
- [x] `autoprefixer` installed and PostCSS configured

### Database (Supabase)
- [x] Full schema applied — migrations `0001_initial_schema` + `0002_rls_policies`
- [x] Tables: `organizations`, `profiles`, `leagues`, `tournaments`, `teams`, `players`, `games`, `rules`, `board_categories`, `board_threads`, `board_comments`
- [x] `standings` view — computed from games, no duplication
- [x] Triggers: auto-create profile on signup, auto-update team W/L on game final
- [x] Row Level Security — all tables org-scoped, role-based (admin/coach)
- [x] Public read policies for public-facing pages (leagues, teams, games, standings, rules)
- [x] Seed data: 1 org, 2 leagues, 1 tournament, 4 teams, 4 games, 4 rules, 3 board categories

### Auth
- [x] Supabase Auth wired up (email + password)
- [x] Auth middleware — protects all portal routes, redirects to `/login`
- [x] Auth callback route (`/api/auth/callback`)
- [x] Login page (`/login`)
- [x] Forgot password page (`/forgot-password`) with SendGrid reset flow

### Public Site
- [x] Public navbar (mobile slide-out + desktop horizontal)
- [x] Public footer
- [x] Leagues listing page (`/leagues`) — live Supabase data
- [x] League detail page (`/leagues/[id]`) — 5 tabs, all live data:
  - Overview (stats, upcoming games preview, standings snapshot)
  - Teams (TeamCard grid)
  - Schedule (ScheduleList grouped by date, collapsible)
  - Standings (StandingsTable, mobile scrollable)
  - Rules (rule cards with deep-link anchors)

### Portal (Coach/Admin)
- [x] Portal layout — sidebar (desktop) + topbar
- [x] Dashboard (`/dashboard`):
  - Welcome header with role badge
  - Stats row — total teams, games played, games scheduled (admin only)
  - Upcoming games (next 5)
  - Recent results
  - My teams / All teams
- [x] Teams list (`/teams`) — role-filtered
- [x] Roster management (`/teams/[id]/roster`):
  - Add player via FormModal
  - Edit player (pre-filled form)
  - Remove player (with confirmation)
  - CSV bulk upload (validates required columns)
  - Parent info visible to admins only
  - Coach access restricted to own team

### Components Built
- [x] `GameCard` — status badge, scores, winner highlight
- [x] `TeamCard` — record, win pct, CTA
- [x] `PlayerCard` — jersey bubble, DOB, parent info (role-gated)
- [x] `StandingsTable` — sticky column, mobile scrollable, row highlight
- [x] `ScheduleList` — grouped by date, collapsible sections
- [x] `FormModal` — slide-up on mobile, centered on desktop, Escape to close
- [x] `Button` — primary / secondary / ghost variants
- [x] `Badge` — scheduled / live / final / cancelled
- [x] `Input` — label, error state, focus ring

### API Routes
- [x] `POST /api/players` — create player
- [x] `PATCH /api/players/[id]` — update player
- [x] `DELETE /api/players/[id]` — remove player
- [x] `POST /api/stripe/webhook` — Stripe webhook handler (stubbed)
- [x] `GET /api/auth/callback` — Supabase OAuth callback

### Lib / Utilities
- [x] `lib/supabase/client.ts` — browser Supabase client
- [x] `lib/supabase/server.ts` — server Supabase client (async cookies)
- [x] `lib/stripe/client.ts` + `checkout.ts`
- [x] `lib/messaging/email.ts` — SendGrid (REST, no SDK)
- [x] `lib/messaging/sms.ts` — Twilio (REST, no SDK)
- [x] `lib/utils.ts` — `cn()`, `formatDate()`, `formatTime()`, `formatCurrency()`, `winPct()`
- [x] `lib/data/leagues.ts` — league data queries
- [x] `lib/data/teams.ts` — team + roster queries
- [x] `lib/data/dashboard.ts` — dashboard data queries

### Config / Types
- [x] `config/org.ts` — `OrgBranding`, `brandingToCssVars()`
- [x] `config/nav.ts` — portal + public nav definitions
- [x] `types/index.ts` — all domain types
- [x] `types/supabase.ts` — hand-authored Supabase DB types
- [x] `hooks/useSupabase.ts`, `useAuth.ts`, `useOrg.ts`

---

## 🔲 In Progress / Next Up

### High Priority
- [ ] Score entry — admin inputs game scores, status → final, W/L auto-updates
- [ ] Tournament detail page — same tab pattern as leagues
- [ ] Create first admin user flow (currently manual via Supabase dashboard)

### Portal Features
- [ ] Schedule page — list view + add game form (admin)
- [ ] Standings page — full standings for all leagues
- [ ] Rules page — manage rules (admin CRUD)
- [ ] Message board — categories, threads, comments, moderation
- [ ] Messaging — compose email/SMS to parents

### Payments
- [ ] Stripe checkout — tournament registration
- [ ] Webhook handler — fulfill registration on payment complete

### Public Site
- [ ] Home page — marketing/discovery landing
- [ ] Tournaments listing + detail page
- [ ] PWA manifest + service worker

### Infrastructure
- [ ] Vercel deployment
- [ ] GitHub Actions CI (lint + type check)
- [ ] Supabase generated types (`npx supabase gen types typescript`)
- [ ] Error boundaries + loading skeletons
- [ ] Toast notifications (replace `alert()` in CSV upload)

---

## 🧱 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS |
| Backend | Supabase (PostgreSQL 17 + Auth) |
| Payments | Stripe (webhook ready, checkout stubbed) |
| Email | SendGrid (REST) |
| SMS | Twilio (REST) |
| Hosting | Vercel (not yet deployed) |
| Version Control | GitHub |

---

## 📁 Key File Locations

| What | Where |
|---|---|
| DB schema | `supabase/migrations/0001_initial_schema.sql` |
| RLS policies | `supabase/migrations/0002_rls_policies.sql` |
| Seed data | `supabase/seed.sql` |
| Design tokens | `app/globals.css` |
| Domain types | `types/index.ts` |
| Org branding config | `config/org.ts` |
| Auth middleware | `middleware.ts` |

---

## 🔑 Environment Variables

See `.env.local.example`. Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET`
- `SENDGRID_API_KEY` + `SENDGRID_FROM_EMAIL`
- `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN` + `TWILIO_PHONE_NUMBER`
