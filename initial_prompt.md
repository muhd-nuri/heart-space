# HeartSpace — Claude Code Initial Prompt
**Phase:** 1 of 4 — Foundation, Auth & Homepage
**Prerequisites:** Next.js 15 repo initialised with App Router via Bun. shadcn/ui installed.

---

## Your Mission

You are building the website for **HeartSpace (MyHeart)** — a youth-driven healthcare and humanitarian NGO aiming to become Asia's leading humanitarian movement by 2030.

This is **not a brochure site.** It accepts donations via ToyyibPay, manages fundraising campaigns, publishes news and impact reports, and recruits youth volunteers. It has an admin dashboard protected by Better Auth.

Read these two files before writing a single line of code:
- `heartspace_master_plan.md` — full scope, database schema, site map, phases, copy
- `heartspace_design.md` — complete design system, color tokens, typography, animation specs

**Phase 1 covers:** Foundation setup (DB + Auth) + complete homepage.

**Key design rule:** Teal (`#1AACB0`) = all primary actions. Coral (`#F07B72`) = donate only. Never swap these.

---

## Step 1 — Install Dependencies

```bash
# Core
bun add framer-motion
bun add lucide-react
bun add clsx tailwind-merge

# Database
bun add prisma @prisma/client
bun add -d prisma

# Auth
bun add better-auth

# Forms
bun add react-hook-form zod @hookform/resolvers

# Email
bun add resend

# Donation UI
bun add react-countup

# Rich text (for admin — Phase 3, but install now)
bun add @tiptap/react @tiptap/pm @tiptap/starter-kit
```

Extend `tailwind.config.ts` with all tokens from `heartspace_design.md`:
- Colors: `teal`, `coral`, `charcoal`, `off-white`, `ash`, `stone`
- Fonts: `display` (Plus Jakarta Sans), `body` (Inter)
- Border radius: `DEFAULT: 8px`, `card: 12px`

---

## Step 2 — Database Setup

### `prisma/schema.prisma`

Create the full schema from `heartspace_master_plan.md` (Campaign, Donation, NewsPost, Volunteer, ImpactStat models).

Run:
```bash
bunx prisma init
# Add DATABASE_URL to .env
bunx prisma migrate dev --name init
bunx prisma generate
```

### Seed file `prisma/seed.ts`

```typescript
// Seed initial ImpactStats (homepage counters)
const stats = [
  { label: 'People Served', value: '50,000+', icon: 'Heart', order: 1 },
  { label: 'Mobile Clinics', value: '8', icon: 'Truck', order: 2 },
  { label: 'Countries', value: '12', icon: 'Globe', order: 3 },
  { label: 'Youth Trained', value: '3,000+', icon: 'Users', order: 4 },
]

// Seed 3 placeholder campaigns
const campaigns = [
  {
    title: 'Gaza Medical Relief',
    slug: 'gaza-medical-relief',
    description: 'Emergency medical supplies and field hospital support for families in Gaza.',
    target: 500000,
    raised: 312000,
    image: '/images/campaigns/gaza.jpg',
    status: 'active',
    category: 'disaster',
    startDate: new Date('2025-01-01'),
  },
  {
    title: 'Mobile Clinic — Sabah',
    slug: 'mobile-clinic-sabah',
    description: 'Bringing primary healthcare to remote communities in Sabah, East Malaysia.',
    target: 150000,
    raised: 89000,
    image: '/images/campaigns/sabah.jpg',
    status: 'active',
    category: 'healthcare',
    startDate: new Date('2025-03-01'),
  },
  {
    title: 'Waqf Health Fund 2025',
    slug: 'waqf-health-fund-2025',
    description: 'Build a Shariah-compliant endowment fund for sustainable healthcare for the ummah.',
    target: 1000000,
    raised: 445000,
    image: '/images/campaigns/waqf.jpg',
    status: 'active',
    category: 'waqf',
    startDate: new Date('2025-01-01'),
  },
]
```

---

## Step 3 — Better Auth Setup

### `lib/auth.ts`

```typescript
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: { enabled: true },
})
```

### `app/api/auth/[...all]/route.ts`

```typescript
import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

export const { GET, POST } = toNextJsHandler(auth)
```

### `middleware.ts` — protect admin routes

```typescript
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/admin')) {
    // Check Better Auth session cookie
    const session = request.cookies.get('better-auth.session_token')
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

### `/app/login/page.tsx` — simple admin login form

Email + password fields, submit → Better Auth signIn, redirect to `/admin` on success.

---

## Step 4 — Global Setup

### `app/globals.css`
Full `:root {}` block from `heartspace_design.md`. Base styles:

```css
html { scroll-behavior: smooth; }

body {
  font-family: var(--font-body);
  background-color: var(--color-off-white);
  color: var(--color-text-body);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
  font-family: var(--font-display);
  color: var(--color-charcoal);
}
```

### `app/layout.tsx`
- Load `Plus_Jakarta_Sans` (weights: 600, 700, 800) and `Inter` (weights: 400, 500) via `next/font/google`
- Apply CSS variables to `<html>`
- Metadata:
  - title: `"HeartSpace | Youth Healthcare & Humanitarian Movement"`
  - description: `"HeartSpace mobilises youth, clinics and communities to deliver healthcare and humanitarian aid across Asia and beyond. Donate, volunteer, or partner with us."`
- Render: `<Navbar />` → `{children}` → `<Footer />` → `<WhatsAppFloat />`

---

## Step 5 — Shared Components

### `/components/layout/Navbar.tsx`
```
Height: 68px desktop / 60px mobile
White bg, 1px border-bottom, sticky
Left: HeartSpace logo — next/image src="/images/logo.png"
Center (desktop): Inter 500, --color-charcoal, hover: --color-teal
  Links: Home | About | Campaigns | Volunteer | News | Contact
Right:
  "Volunteer" ghost teal button
  "Donate" coral filled button → /donate
Mobile: hamburger → full-height drawer, both buttons at bottom
```

### `/components/layout/Footer.tsx`
```
Background: --color-charcoal, white text, 4-column desktop
Col 1: Logo (white) + "Asia's leading youth-driven healthcare & humanitarian movement." + social icons (Instagram, TikTok, YouTube, LinkedIn) → link to # placeholders
Col 2: Heading "Organisation" + links: About, Our Vision, Team, Partners, Contact
Col 3: Heading "Get Involved" + links: Donate, Campaigns, Volunteer, YERT Programme, Fellowship
Col 4: Heading "Stay Updated" + newsletter email input + Subscribe button (teal) + "No spam. Impact stories only."
Bottom: "© 2026 MyHeart / HeartSpace. All Rights Reserved. Registered NGO Malaysia." white/40
```

### `/components/layout/WhatsAppFloat.tsx`
```
Fixed bottom-right, z-50
Green (#25D366) circle, 52px
MessageCircle icon, white
href="https://wa.me/60XXXXXXXXX" (placeholder)
Pulse on load, stops after 3s
```

### `/components/ui/CTAButton.tsx`
Variants: `primary` (teal), `donate` (coral), `secondary` (outlined teal), `ghost`
Framer Motion whileHover + whileTap. Renders as Link or button.

### `/components/ui/SectionWrapper.tsx`
Props: `dark` (charcoal bg), `teal` (teal bg), `coral` (coral bg), `ash` (ash bg)
Standard: `py-20 md:py-28` + `max-w-6xl mx-auto px-6 md:px-8`

### `/components/ui/ProgressBar.tsx`
```typescript
type Props = {
  raised: number
  target: number
  showLabels?: boolean
}
// Animated fill using Framer Motion whileInView
// Label: "RM X,XXX raised of RM X,XXX"
// Percentage badge: top-right of bar
```

---

## Step 6 — Homepage Sections

Build at `app/page.tsx`. Fetch campaigns and stats from DB using Prisma. Each section = separate file in `/components/sections/home/`.

---

### `HeroSection.tsx`

**Full viewport.** Background: dark overlay (55%) over a full-bleed mission photo (placeholder `/images/hero-bg.jpg`).

```
Pre-label (Inter, label, teal, uppercase): "YOUTH HEALTHCARE & HUMANITARIAN MOVEMENT"

H1 (Plus Jakarta Sans 800, display-xl, white):
"Care Without
Borders."

Body (Inter, body-lg, white/75, max-w: 52ch):
"HeartSpace mobilises youth, clinics, and communities to deliver
healthcare and humanitarian aid across Asia and beyond.
Join us in building a healthier, more compassionate world."

CTA row:
[Coral] "Donate Now"  →  /donate
[Teal outlined, white border on dark] "Join the Movement"  →  /volunteer

Bottom-left: small trust signals in a row:
  "🏥 Registered NGO Malaysia"  ·  "✓ Shariah-Compliant"  ·  "🌍 Active in 12 Countries"
```

Entrance: stagger pre-label → H1 → body → CTAs → trust signals. Delays: 0 / 0.1 / 0.2 / 0.3 / 0.4

---

### `ImpactStatsSection.tsx`

**Background: `--color-teal`** (full-width teal strip, white text)

Fetch `ImpactStat[]` from Prisma. Render 4 stats in a horizontal row.

```
Each stat:
  Number: Plus Jakarta Sans 800, stat size, white — count-up animation via react-countup enableScrollSpy
  Label: Inter 500, label size, white/70, uppercase

Dividers: thin white/20 vertical lines between stats (desktop)
```

---

### `ActiveCampaignsSection.tsx`

**Background: `--color-off-white`**

```
Pre-label: "MAKE AN IMPACT"
H2: "Active Campaigns"
Subtext right-aligned: "View All Campaigns →" ghost link → /campaigns

Fetch top 3 featured/active campaigns from DB
3-column grid desktop / 1-column mobile
```

Each campaign card:
- Campaign image (16:9, border-radius top)
- Category badge (color per type from design.md)
- Campaign title (Plus Jakarta Sans 700, display-sm)
- Excerpt (Inter, body-sm, muted, 2 lines clamp)
- `<ProgressBar raised={c.raised} target={c.target} showLabels />`
- "RM X,XXX raised" in teal + "of RM X,XXX" muted
- [Coral] "Donate to This Campaign" button → `/campaigns/[slug]`

---

### `VisionStripSection.tsx`

**Background: `--color-charcoal`** (dark section, white text)

```
2-column desktop: text left (55%) / image right (45%) — placeholder /images/vision.jpg

Left:
  Pre-label (Inter, label, teal): "OUR 2030 VISION"
  H2 (Plus Jakarta Sans 800, display-lg, white):
  "By 2030, We Will Serve 100,000 People a Year."
  Body (Inter, body-lg, white/65):
  "Asia's leading youth-driven healthcare and humanitarian movement —
  powered by waqf, driven by youth, governed by international standards."
  [Teal outlined, white] "Read Our Full Vision →"  →  /about/vision
```

---

### `WhyHeartSpaceSection.tsx`

**Background: `--color-ash`**

```
Pre-label: "WHY HEARTSPACE"
H2: "A Different Kind of NGO."
Subtext: "We are not building just another charity. We are building a movement."

4-column grid desktop / 2×2 mobile
Each: Lucide icon (28px, teal), H3 (Plus Jakarta Sans 700), 2-line body (Inter, muted)
```

| Icon | Title | Body |
|---|---|---|
| `Users` | "Youth-Driven" | "Over 10,000 young people trained. A standing force ready to mobilise." |
| `Building` | "Waqf-Backed" | "Shariah-compliant, financially resilient. Built to last for generations." |
| `Globe` | "Globally Connected" | "Operating across Asia, the Middle East, and East Africa." |
| `BarChart` | "Data-Driven" | "Impact reports, ISO governance, and evidence-based healthcare delivery." |

---

### `HowToHelpSection.tsx`

**Background: `--color-white`**

```
Pre-label: "GET INVOLVED"
H2: "Three Ways to Make a Difference."

3-column cards, centered, generous padding
```

| Icon | Title | Body | CTA |
|---|---|---|---|
| `Heart` | "Fund the Mission" | "Your donation funds clinics, mobile units, and emergency responses across Asia." | [Coral] "Donate Now" → /donate |
| `Users` | "Join the Movement" | "Train as a YERT member or apply for our Global Humanitarian Fellowship." | [Teal] "Volunteer" → /volunteer |
| `Handshake` | "Partner With Us" | "CSR programmes, corporate partnerships, and institutional collaboration." | [Secondary] "Partner" → /partners |

---

### `LatestNewsSection.tsx`

**Background: `--color-ash`**

```
Pre-label: "LATEST FROM THE FIELD"
H2: "News & Impact"
Right: "View All →" → /news

Fetch latest 3 published NewsPost from DB
3-column card grid desktop / 1-col mobile
Each card: cover image (16:9) + category badge + title + excerpt (2 lines) + date + "Read More →"
```

---

### `CTABannerSection.tsx`

**Background: `--color-coral`** (full-width coral)

```
Centered, py-28

H2 (Plus Jakarta Sans 800, display-lg, white):
"Every Ringgit Saves a Life."

Body (Inter, body-lg, white/80):
"Join thousands of donors who have trusted HeartSpace to
deliver healthcare where it matters most."

[White filled, charcoal text] "Donate Now"  →  /donate
[Ghost, white text] "See How We Use Your Donations →"  →  /about
```

---

## Step 7 — Floating Elements

### WhatsApp Button
Fixed bottom-right, green circle, always visible.
```tsx
href="https://wa.me/60XXXXXXXXX"
// Pulse animation on load, stops after 3s
// Tooltip: "Chat with HeartSpace"
```

---

## Step 8 — Quality Checklist

Before declaring Phase 1 complete:

- [ ] `prisma migrate dev` runs cleanly, all models created
- [ ] Seed data loads: 4 impact stats, 3 campaigns, Better Auth admin user
- [ ] Better Auth login at `/login` works — `/admin` is protected and redirects if not logged in
- [ ] Tailwind tokens match `heartspace_design.md` exactly — teal `#1AACB0`, coral `#F07B72`
- [ ] Plus Jakarta Sans on ALL headings (800 weight for heroes), Inter on ALL body
- [ ] No `<img>` tags — only `next/image`
- [ ] All 8 homepage sections render at 375px / 768px / 1280px
- [ ] ImpactStats section: count-up fires on scroll (react-countup enableScrollSpy)
- [ ] Campaigns section: fetches from DB via Prisma, progress bars animate on scroll
- [ ] Latest News section: fetches from DB (shows placeholder if no posts yet)
- [ ] Donate buttons are always coral — never teal
- [ ] WhatsApp float present and linked
- [ ] `npx tsc --noEmit` passes
- [ ] No console errors

---

## What NOT to Build in Phase 1

- ❌ ToyyibPay integration (Phase 2)
- ❌ `/donate` page flow (Phase 2)
- ❌ `/campaigns/[slug]` detail page (Phase 2)
- ❌ Volunteer registration form (Phase 2)
- ❌ Admin dashboard pages beyond login (Phase 3)
- ❌ News/article detail pages (Phase 4)
- ❌ `/about`, `/events`, `/partners`, `/contact` inner pages (Phase 4)

---

## Done?

When Phase 1 is complete, reply:
> "Phase 1 complete. HeartSpace homepage, DB, and auth foundation are built. Ready for Phase 2."

List:
1. Any DB or auth decisions made that need review
2. All placeholder image paths that need real photos from client
3. Stats seeded (note these are placeholders — client to confirm real numbers)

---

*End of Initial Prompt — Phase 1 — HeartSpace (MyHeart)*