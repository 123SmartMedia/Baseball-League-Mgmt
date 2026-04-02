# Baseball League Mgtm – Project Brief

## 🎯 Objective

Build a premium, mobile-first, white-label youth sports league management platform.

This platform will support:

* Leagues
* Tournaments
* Coach/Admin portals
* Scheduling and standings
* Payments
* Messaging
* Community (message board)

It must be scalable to support multiple organizations (white-label SaaS).

---

## 🧠 Product Vision

This is NOT just a website.

This is:

> A vertically integrated sports management platform designed for coaches, admins, and organizations.

Primary users:

* Coaches
* League administrators

Secondary users:

* Parents (via communication, no login initially)

---

## 🏗️ Core Systems

1. Public Website (marketing + discovery)
2. Coach/Admin Portal
3. League Management System
4. Tournament Management System
5. Scheduling + Standings Engine
6. Rules Engine
7. Message Board
8. Payments (Stripe)
9. Messaging (Email + SMS)

---

## 🧑‍💻 User Roles

### Admin

* Full system control
* Manage leagues, tournaments, teams, games
* Input scores
* Manage rules
* Moderate message board
* Send communications

### Coach

* Manage teams
* Input roster
* View schedule
* View standings
* Communicate with parents

---

## 📱 UX REQUIREMENTS (CRITICAL)

* Mobile-first design (primary use case)
* Fast load times (field usage, poor signal)
* Clean, modern UI (premium feel)
* Large tap targets
* Minimal friction

Design inspiration:

* Apple-level simplicity
* ESPN-style data display
* GameChanger-style usability

---

## 🎨 DESIGN SYSTEM (PREMIUM)

* Typography: clean, bold headings
* Spacing: generous whitespace
* Components: card-based UI
* Colors: configurable per organization (white-label)
* Animations: subtle, fast, modern

Reusable components:

* GameCard
* TeamCard
* PlayerCard
* ScheduleList
* StandingsTable
* FormModal

---

## 🏷️ WHITE-LABEL REQUIREMENTS

The platform must support multiple organizations.

Each organization can override:

* Logo
* Colors
* Domain
* League/tournament data
* Sponsors/ads

Architecture:

* Multi-tenant database design (organization_id)
* Config-driven branding

---

## 🧱 TECH STACK

Frontend:

* Next.js (App Router)
* Tailwind CSS

Backend:

* Supabase (PostgreSQL + Auth)

Payments:

* Stripe

Messaging:

* SendGrid (email)
* Twilio (SMS)

Hosting:

* Vercel

Version Control:

* GitHub

AI Dev:

* Claude

---

## 🗂️ CORE FEATURES

### Leagues & Tournaments

* Listing pages
* Detail pages with tabs:

  * Overview
  * Teams
  * Schedule
  * Standings
  * Rules

---

### Roster Management

Fields:

* First Name
* Last Name
* DOB
* Jersey Number
* Parent Info (name, email, phone)

Features:

* Manual entry (mobile optimized)
* CSV upload
* Validation

---

### Scheduling

* Admin creates games
* Assign teams, date, field
* Display by day/team

---

### Standings

* Auto-calculated from game results
* Wins/Losses
* Runs for/against

---

### Rules Engine

* Filter by:

  * Age group
  * League vs Tournament
* Deep linking from pages

---

### Message Board

* Categories
* Threads
* Comments
* Admin moderation

---

### Payments

* Stripe checkout
* Tournament/league registration
* Webhooks

---

### Messaging

* Email (SendGrid)
* SMS (Twilio)
* Triggered by:

  * Registration
  * Schedule updates
  * Game reminders

---

## 📲 MOBILE APP STRATEGY

Phase 1:

* Progressive Web App (PWA)

Phase 2:

* Native app using React Native / Expo

---

## ⚙️ PERFORMANCE REQUIREMENTS

* Fast loading (<2s target)
* Optimized images
* Minimal API calls
* Lazy loading where possible

---

## 🔐 SECURITY

* Role-based access control
* Supabase RLS policies
* Secure API routes

---

## 🚀 FUTURE EXPANSION

* Parent/player login
* Live scoring
* Push notifications
* Advanced analytics
* White-label SaaS dashboard

---

## 🧠 DEVELOPMENT RULES (FOR CLAUDE)

* Always build mobile-first
* Use reusable components
* Keep logic modular
* Separate UI from business logic
* Write clean, scalable code
* Avoid hardcoding (use config where possible)
