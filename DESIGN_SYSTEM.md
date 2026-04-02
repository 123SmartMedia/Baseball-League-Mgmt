# 🎨 DESIGN_SYSTEM.md – Baseball League Mgmt Platform

## 🧠 Design Philosophy

This platform must deliver a **premium, modern, mobile-first user experience**.

Core principles:

* Mobile-first design (primary use case)
* Clean, minimal UI (Apple-level simplicity)
* Fast, responsive interactions
* Data clarity (ESPN-style readability)
* Component-driven architecture
* Fully white-label capable

Avoid clutter, excessive colors, and complex layouts.

---

## 🎯 Visual Direction

Design inspiration:

* Apple (clean layouts, whitespace, typography)
* ESPN (data-heavy UI clarity)
* GameChanger (sports usability)
* Modern SaaS dashboards (cards, modular UI)

---

## 🎨 COLOR SYSTEM (WHITE-LABEL READY)

### ⚠️ Rule:

Never hardcode colors. Always use CSS variables.

### Default Theme (HSL format)

```css
:root {
  --primary: 220 90% 50%;
  --primary-foreground: 0 0% 100%;

  --secondary: 210 40% 96%;
  --secondary-foreground: 222 47% 11%;

  --background: 0 0% 100%;
  --foreground: 222 47% 11%;

  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;

  --accent: 12 90% 55%;
  --border: 214 32% 91%;
  --card: 0 0% 100%;
}
```

---

### 🏷️ White-Label Overrides

Each organization can override:

```json
{
  "primary": "210 100% 40%",
  "accent": "0 85% 55%",
  "logo": "/logos/org.png"
}
```

Apply dynamically via CSS variables or theme provider.

---

## 🔤 TYPOGRAPHY

### Font Family

Use:

```css
font-family: 'Inter', system-ui, sans-serif;
```

---

### Type Scale

| Element | Size    | Weight |
| ------- | ------- | ------ |
| H1      | 32–40px | 700    |
| H2      | 24–28px | 600    |
| H3      | 20px    | 600    |
| Body    | 16px    | 400    |
| Small   | 14px    | 400    |

---

## 📦 COMPONENT SYSTEM

All UI must be built from reusable components.

---

### 🧩 GameCard (PRIMARY COMPONENT)

Displays:

* Game time
* Team A vs Team B
* Field
* Status (Scheduled / Live / Final)

Requirements:

* Mobile-first stacked layout
* Clear team names
* Status badge
* Tap-friendly

---

### 🧩 TeamCard

Displays:

* Team name
* Record
* Organization
* CTA (View Team)

---

### 🧩 PlayerCard

Displays:

* Player name
* Jersey number
* DOB
* Parent contact (admin only)

---

### 🧩 StandingsTable

Requirements:

* Scrollable horizontally on mobile
* Sticky header
* Highlight selected team
* Clean spacing

---

### 🧩 ScheduleList

* Group games by date
* Collapsible sections per day
* Mobile card layout

---

### 🧩 FormModal

Used for:

* Add/Edit Player
* Add/Edit Team
* Game entry

Requirements:

* Mobile-friendly
* Clear labels
* Inline validation

---

### 🧩 Buttons

Variants:

* Primary
* Secondary
* Ghost

Styles:

* Rounded (rounded-xl or rounded-2xl)
* Clear hover states
* Fast transitions

---

### 🧩 Status Badges

Types:

* Scheduled (gray)
* Live (green)
* Final (dark)

---

## 📱 MOBILE UX REQUIREMENTS

### ✅ Required Patterns

* Cards instead of tables
* Large tap targets
* Vertical stacking layouts
* Sticky CTAs (Register, View Schedule)
* Minimal input friction

---

### ❌ Avoid

* Dense tables on mobile
* Small text/buttons
* Multi-column layouts on small screens

---

## 🧭 NAVIGATION

### Mobile:

* Top navbar (logo + menu)
* Slide-out menu

Future:

* Bottom navigation (app mode)

---

### Desktop:

* Horizontal navigation
* Clear CTA button (Login / Register)

---

## 🧱 LAYOUT SYSTEM

### Container

* Max width: 1200px
* Centered layout
* Full width on mobile

---

### Spacing

Use Tailwind scale:

* Section padding: `py-12`
* Card padding: `p-4` or `p-6`
* Gaps: `gap-4` or `gap-6`

---

## ✨ INTERACTIONS

### Hover Effects

```css
hover:shadow-md hover:-translate-y-0.5
```

---

### Transitions

```css
transition-all duration-150
```

---

### Rules

* Keep animations subtle
* Prioritize speed over decoration

---

## 📊 DATA DISPLAY STANDARDS

* Always prioritize readability
* Use consistent spacing
* Align numbers properly
* Use badges for status
* Avoid clutter

---

## 📣 SPONSORS / ADS

### Rules:

* Must not disrupt UX
* Clearly labeled
* Integrated naturally into layout

---

### Components:

* SponsorBanner
* InlineAdCard

---

## 🧑‍💻 PORTAL DESIGN

### Dashboard

* Card-based layout
* Sections:

  * Teams
  * Upcoming games
  * Notifications

---

### Roster Management

#### Mobile:

* Add Player button
* Modal form entry

#### Desktop:

* Table + inline editing

---

## ⚙️ TAILWIND GUIDELINES

* Use utility-first approach
* Avoid custom CSS unless necessary
* Use design tokens (CSS variables)
* Maintain consistency across components

---

## 🏷️ WHITE-LABEL DESIGN RULES

* No hardcoded branding
* All colors/logo pulled from config
* Layout must remain consistent across tenants

---

## 📲 PWA / APP DESIGN CONSIDERATIONS

* Must feel like a native app
* Optimize for touch interactions
* Avoid browser-like UI patterns
* Ensure fast load times

---

## 🚀 DEVELOPMENT RULES FOR CLAUDE

When generating UI:

* Always follow this design system
* Build mobile-first
* Use reusable components
* Keep layouts clean and minimal
* Avoid unnecessary complexity
* Ensure accessibility (labels, contrast, spacing)
