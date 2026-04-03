# Project Status – Baseball League Mgmt Platform

**Last Updated:** April 3, 2026

---

## 🏗️ Overview

Premium, mobile-first, white-label youth sports league management platform built on Next.js 16 (App Router), Supabase, Tailwind CSS, deployed to Vercel.

**Live URL:** https://baseball-league-mgmt.vercel.app

---

## ✅ Completed

### Infrastructure
- [x] Next.js 16 App Router project scaffolded
- [x] Tailwind CSS with full design system (CSS variables, white-label color tokens)
- [x] Supabase project connected via MCP (`ejrbawauwyjfldpurewq`)
- [x] `.env.local` configured with Supabase URL, anon key, service role key
- [x] TypeScript strict mode — zero errors
- [x] ESLint configured
- [x] `autoprefixer` + `.npmrc` (legacy-peer-deps for Vercel)
- [x] Vercel deployment — 25 routes live
- [x] GitHub repo — https://github.com/123SmartMedia/Baseball-League-Mgmt

### Database (Supabase)
- [x] Full schema applied — migrations `0001_initial_schema` + `0002_rls_policies`
- [x] Tables: `organizations`, `profiles`, `leagues`, `tournaments`, `teams`, `players`, `games`, `rules`, `board_categories`, `board_threads`, `board_comments`
- [x] `standings` view — computed from games, no duplication
- [x] Triggers: `handle_new_user` (hardened — never blocks user creation), `update_team_record` (auto W/L on game final)
- [x] Row Level Security — all tables org-scoped, role-based (admin/coach)
- [x] Public read policies for public-facing pages
- [x] Seed data: 1 org, 2 leagues, 1 tournament, 4 teams, 4 games, 4 rules, 3 board categories

### Auth & User Management
- [x] Supabase Auth wired up (email + password)
- [x] Auth middleware — protects all portal routes
- [x] Auth callback route (`/api/auth/callback`)
- [x] Login page (`/login`) — links to signup
- [x] Forgot password page (`/forgot-password`)
- [x] Coach self-signup (`/signup`) — picks org, auto-signed in, role = coach
- [x] Admin invite flow (`/users` portal + `/api/users/invite`) — sends magic link, sets any role
- [x] Service role Supabase client (`lib/supabase/admin.ts`)
- [x] Profile upsert as belt-and-suspenders after user creation

### Public Site
- [x] Public navbar (mobile slide-out + desktop)
- [x] Public footer
- [x] Leagues listing (`/leagues`) — live data, card grid
- [x] League detail (`/leagues/[id]`) — 5 tabs, all live:
  - Overview, Teams, Schedule, Standings, Rules
- [x] Tournaments listing (`/tournaments`) — active/upcoming badges, entry fee
- [x] Tournament detail (`/tournaments/[id]`) — 5 tabs, reuses league components

### Portal (Coach/Admin)
- [x] Portal layout — sidebar (desktop) + topbar
- [x] Dashboard (`/dashboard`) — stats (admin), upcoming games, recent results, teams
- [x] Teams list (`/teams`) — role-filtered
- [x] Roster management (`/teams/[id]/roster`):
  - Add / edit / delete players via FormModal
  - CSV bulk upload with validation
  - Parent info visible to admins only
  - Coach access restricted to own team
- [x] Schedule (`/schedule`) — filter bar, Enter Score / Edit Score buttons (admin)
- [x] Score entry (`ScoreEntryModal`) — scores + status, fires W/L trigger on final
- [x] Users (`/users`) — admin only, user list + invite modal

### Components Built
- [x] `GameCard`, `TeamCard`, `PlayerCard`
- [x] `StandingsTable`, `ScheduleList`, `FormModal`
- [x] `Button`, `Badge`, `Input`
- [x] `LeagueTabs`, `TournamentTabs`
- [x] `ScoreEntryModal`, `ScheduleClient`
- [x] `RosterClient`, `PlayerForm`, `CsvUpload`
- [x] `InviteUserModal`, `UsersClient`
- [x] `StatCard`, `UpcomingGames`, `RecentResults`, `MyTeams`

### API Routes
- [x] `POST /api/players` — create player
- [x] `PATCH /api/players/[id]` — update player
- [x] `DELETE /api/players/[id]` — remove player
- [x] `PATCH /api/games/[id]` — score entry (admin only)
- [x] `POST /api/users/signup` — coach self-registration
- [x] `POST /api/users/invite` — admin invites user (any role)
- [x] `POST /api/stripe/webhook` — Stripe webhook handler (stubbed)
- [x] `GET /api/auth/callback` — Supabase OAuth callback

---

## 🔲 Next Up

### High Priority
- [ ] **Admin: Assign coach to team** — coaches who sign up have no team assigned; admin needs UI to set `coach_id` on a team. Coaches currently see empty `/teams` and can't access roster.
- [ ] **Portal standings page** — `/standings` is a stub; needs league/tournament selector + StandingsTable
- [ ] **Portal rules page** — `/rules` is a stub; needs rules list (admin CRUD)
- [ ] **Home/landing page** — `/` is blank; needs marketing content

### UX / Polish
- [ ] **Empty state for coaches** — when coach has no team, show clear message + contact admin prompt instead of blank page
- [ ] **Toast notifications** — replace `alert()` in CSV upload with proper toast (component exists in UsersClient, needs to be shared)
- [ ] **Loading skeletons** — no loading states on server-fetched pages
- [ ] **Fix Next.js middleware deprecation warning** — rename `middleware.ts` → `proxy.ts` per Next.js 16

### Features
- [ ] Message board — categories, threads, comments, moderation
- [ ] Messaging — compose email/SMS to parents (SendGrid + Twilio wired, no UI)
- [ ] Payments — Stripe checkout for tournament registration
- [ ] Admin: create/edit/delete leagues and tournaments from portal
- [ ] Admin: create/edit games (schedule management)

### Infrastructure
- [ ] Supabase generated types (`npx supabase gen types typescript`)
- [ ] Error boundaries + 404 page
- [ ] PWA manifest + service worker

---

## 🧱 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS |
| Backend | Supabase (PostgreSQL 17 + Auth) |
| Payments | Stripe (webhook ready, checkout stubbed) |
| Email | SendGrid (REST, no UI yet) |
| SMS | Twilio (REST, no UI yet) |
| Hosting | Vercel — https://baseball-league-mgmt.vercel.app |
| Version Control | GitHub — https://github.com/123SmartMedia/Baseball-League-Mgmt |

---

## 📁 Key File Locations

| What | Where |
|---|---|
| DB schema | `supabase/migrations/0001_initial_schema.sql` |
| RLS policies | `supabase/migrations/0002_rls_policies.sql` |
| Seed data | `supabase/seed.sql` |
| Design tokens | `app/globals.css` |
| Domain types | `types/index.ts` |
| Org branding | `config/org.ts` |
| Auth middleware | `middleware.ts` |
| Admin Supabase client | `lib/supabase/admin.ts` |

---

## 🔑 Environment Variables

| Variable | Where |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel + `.env.local` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel + `.env.local` |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel + `.env.local` |
| `STRIPE_SECRET_KEY` | Not yet set |
| `STRIPE_WEBHOOK_SECRET` | Not yet set |
| `SENDGRID_API_KEY` | Not yet set |
| `TWILIO_ACCOUNT_SID` | Not yet set |

---

## ⚠️ Known Issues

- Coaches who self-signup have no team assigned — admin must manually set `coach_id` via Supabase dashboard until "Assign Coach" UI is built
- New admin accounts must be manually promoted in Supabase (`profiles.role = 'admin'`) until admin invite flow is used
- Next.js middleware deprecation warning on every build (`middleware` → `proxy`)
