# HeartSpace (MyHeart) — Website Master Build Plan
**Client:** MyHeart / HeartSpace
**Stack:** Next.js 15 (App Router) + shadcn/ui + Tailwind CSS + Better Auth
**Design Direction:** Youthful, Warm, Movement-energy — Youth Healthcare & Humanitarian NGO
**Build Method:** Phased prompts to Claude Code — one phase per prompt session

---

## Client Brief Summary

| Field | Detail |
|---|---|
| Organisation | MyHeart / HeartSpace |
| Type | NGO — Youth Healthcare & Humanitarian Movement |
| Vision | Asia's leading youth-driven healthcare & humanitarian movement by 2030 |
| North Star | Serve 100,000+ people/year, raise USD 7–11M annually |
| Primary audiences | Donors, youth volunteers, corporate partners, international bodies |
| Site type | NGO campaign site — donations, news/impact, campaigns, volunteer mobilisation |
| Language | English primary (assume — confirm with client) |
| Payment | ToyyibPay (Malaysian payment gateway — FPX, cards, e-wallets) |
| Auth | Better Auth |
| CMS | Custom admin with Better Auth + Prisma (client-specified) |
| Domain | TBC — assume `heartspace.my` or `myheart.org.my` |
| WhatsApp | Yes (assume — standard for Malaysian NGO) |
| Analytics | Yes — Google Analytics 4 + Meta Pixel (campaign tracking essential for NGO) |

---

## Key Context — This Is Not a Standard Brochure Site

HeartSpace has 8 strategic pillars and a 5-year vision document. The website must:

1. **Inspire** — youth want to join, donors want to give, partners want to collaborate
2. **Accept donations** — ToyyibPay integration, zakat/waqf/sadaqah categories
3. **Run campaigns** — each humanitarian campaign needs its own page with a fundraising progress bar
4. **Publish news & impact** — CMS-driven news, mission reports, impact numbers
5. **Recruit volunteers** — youth sign-up flow, YERT registration
6. **Show credibility** — ISO, CHS, UN partnerships, real impact data

**Tone:** Bold, warm, hopeful. Not corporate NGO. Not pitiful charity aesthetics. Movement energy.

---

## Recommended Stack

| Layer | Tool | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR + SSG mix, SEO-critical for NGO fundraising |
| UI | shadcn/ui + Tailwind CSS | Consistent, ownable components |
| Auth | Better Auth | Client-specified — handles admin, donor accounts, volunteer profiles |
| Database | PostgreSQL + Prisma | Relational — campaigns, donations, users, news all need relations |
| CMS | Custom admin (Better Auth + Prisma) | Client-specified — build admin panel in Phase 3 |
| Payment | ToyyibPay API | Client-specified — FPX, cards, e-wallets, MYR |
| Donation categories | Sadaqah / Zakat / Waqf / General | Separate ToyyibPay bill codes per category |
| Email | Resend | Donation receipts, volunteer confirmations, campaign updates |
| Animation | Framer Motion | Impact counters, campaign progress bars, hero entrances |
| Fonts | next/font/google | See design.md |
| Image | next/image + Cloudinary (optional) | Mission photography, campaign images |
| Deployment | Vercel | Zero-config Next.js |
| Package manager | Bun | Faster |

> **Claude Code Note:** Better Auth handles authentication for the admin dashboard AND optionally for donor/volunteer accounts (saved giving history, volunteer profile). Set up Better Auth in Phase 1 foundation — do not defer it. ToyyibPay does not require user accounts for donations — guest checkout is sufficient.

---

## Database Schema (Prisma — key models)

```prisma
model Campaign {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String
  target      Float    // fundraising target (MYR)
  raised      Float    @default(0)
  image       String
  status      String   // active | completed | draft
  category    String   // healthcare | disaster | waqf | zakat
  startDate   DateTime
  endDate     DateTime?
  donations   Donation[]
  createdAt   DateTime @default(now())
}

model Donation {
  id           String   @id @default(cuid())
  amount       Float
  currency     String   @default("MYR")
  type         String   // sadaqah | zakat | waqf | general
  campaignId   String?
  campaign     Campaign? @relation(fields: [campaignId], references: [id])
  donorName    String
  donorEmail   String
  donorPhone   String?
  billCode     String   // ToyyibPay bill code
  status       String   // pending | paid | failed
  paidAt       DateTime?
  createdAt    DateTime @default(now())
}

model NewsPost {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  excerpt     String
  content     String   // rich text / markdown
  coverImage  String
  category    String   // news | mission | impact | press
  published   Boolean  @default(false)
  publishedAt DateTime?
  author      String
  createdAt   DateTime @default(now())
}

model Volunteer {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  phone     String
  age       Int?
  city      String
  program   String   // YERT | fellowship | general | event
  status    String   // pending | active | alumni
  createdAt DateTime @default(now())
}

model ImpactStat {
  id    String @id @default(cuid())
  label String // "People Served", "Countries Reached"
  value String // "100,000+", "20"
  icon  String // lucide icon name
  order Int
}
```

---

## Site Map

```
/                          → Homepage
/about                     → About HeartSpace / MyHeart
/about/vision              → 5-Year Vision (2025–2030)
/about/team                → Leadership & Team
/campaigns                 → All Campaigns (grid)
/campaigns/[slug]          → Individual Campaign + Donate CTA + progress bar
/donate                    → Donation hub — choose type + amount + campaign
/donate/success            → Thank you + receipt info
/donate/failed             → Payment failed, try again
/news                      → News & Impact (CMS-driven)
/news/[slug]               → Individual article
/volunteer                 → Join as volunteer / YERT registration
/volunteer/fellowship      → Global Humanitarian Fellowship info
/events                    → Events (Run for Humanity, Ride for Humanity, etc.)
/events/[slug]             → Individual event page
/partners                  → Corporate & Institutional Partners
/contact                   → Contact + office locations
/admin                     → Admin dashboard (Better Auth protected)
/admin/campaigns           → Manage campaigns
/admin/donations           → View donations + export
/admin/news                → Manage news posts
/admin/volunteers          → View volunteer applications
/admin/stats               → Manage impact stats
```

---

## Build Phases

---

### Phase 1 — Foundation, Auth & Homepage
**Goal:** Full scaffold, Better Auth setup, homepage complete.

**Tasks:**
1. Install all dependencies (see Step 1 in initial_prompt.md)
2. Set up PostgreSQL + Prisma — run `prisma init`, define schema above, run migrations
3. Set up Better Auth — configure providers (email/password minimum), protect `/admin/*` routes
4. Set up global layout: fonts, CSS variables, Navbar, Footer, WhatsApp float
5. Build Homepage sections:
   - Hero — full-bleed, bold headline, dual CTA (Donate Now + Join the Movement)
   - Live Impact Stats bar — animated counters (people served, countries, volunteers, raised)
   - Active Campaigns — 3 featured campaign cards with progress bars
   - Vision Strip — "By 2030..." bold statement section
   - Why HeartSpace — 4 pillars (Youth-driven, Waqf-backed, Global, Data-driven)
   - How to Help — 3 paths (Donate / Volunteer / Partner)
   - Latest News — 3 latest posts (fetched from DB)
   - Events Teaser — upcoming events strip
   - CTA Banner — "Join the Movement"

**Deliverable:** Homepage live, auth working, DB connected.

---

### Phase 2 — Campaigns + Donations (ToyyibPay)
**Goal:** Full donation flow working end-to-end.

**Tasks:**
1. `/campaigns` — grid of all active campaigns, filter by category
2. `/campaigns/[slug]` — campaign detail: description, progress bar, donate button, updates
3. `/donate` — donation hub:
   - Select type: Sadaqah / Zakat / Waqf / General
   - Select campaign (optional) or general fund
   - Enter amount (preset buttons: RM10 / RM25 / RM50 / RM100 / custom)
   - Enter name, email, phone
   - Submit → create Donation record (status: pending) → call ToyyibPay Create Bill API → redirect to ToyyibPay payment page
4. ToyyibPay callback handler (`/api/toyyibpay/callback`):
   - Verify payment status
   - Update Donation status to `paid`
   - Update Campaign `raised` amount
   - Send receipt email via Resend
5. `/donate/success` and `/donate/failed` pages
6. `/volunteer` — registration form → creates Volunteer record → confirmation email

**ToyyibPay Integration Notes:**
- Create separate bill codes per donation type (Sadaqah, Zakat, Waqf)
- Use `toyyibpay` npm package or direct API calls
- Env vars: `TOYYIBPAY_USER_SECRET_KEY`, `TOYYIBPAY_CATEGORY_CODE`
- Callback URL must be publicly accessible (use ngrok for local dev)

**Deliverable:** Complete donation flow — select → pay → receipt. Volunteer signup working.

---

### Phase 3 — Admin Dashboard + CMS
**Goal:** Client team can manage all content without touching code.

**Tasks:**
1. `/admin` — protected by Better Auth, dashboard overview:
   - Total raised this month
   - Active campaigns count
   - Recent donations table
   - Volunteer applications count
2. `/admin/campaigns` — CRUD for campaigns (create, edit, publish/unpause)
3. `/admin/donations` — view all donations, filter by campaign/type/status, CSV export
4. `/admin/news` — rich text editor (use `@tiptap/react`) for news posts, draft/publish
5. `/admin/volunteers` — view applications, mark as active/rejected
6. `/admin/stats` — edit impact stats shown on homepage counter
7. Seed initial data: 8 vision pillars, placeholder campaigns, 3 news posts

**Deliverable:** Full admin panel. Client team can manage campaigns, news, and view donations.

---

### Phase 4 — Inner Pages, SEO & Launch
**Goal:** All remaining pages + production-ready.

**Tasks:**
1. `/about` — organisation story, mission/vision, the 8 pillars overview
2. `/about/vision` — full 5-year vision content (2025–2030)
3. `/news` + `/news/[slug]` — news listing + article pages
4. `/events` + `/events/[slug]` — Run for Humanity, Ride for Humanity, etc.
5. `/partners` — corporate partners logos + partnership CTA
6. `/contact` — contact form + office address + map
7. SEO: metadata on all pages, OG images, NGO + nonprofit JSON-LD schema
8. `sitemap.xml` + `robots.txt`
9. Google Analytics 4 + Meta Pixel (for campaign ad tracking)
10. Performance audit — ISR for news/campaigns, static for about pages
11. Final QA: 375px / 768px / 1280px
12. Deploy to Vercel, domain, env vars

**Deliverable:** Live, fully functional NGO website.

---

## Homepage Copy Placeholders

### Hero
```
Pre-label: "Youth Healthcare & Humanitarian Movement"

H1: "Care Without
Borders."

Body:
"HeartSpace mobilises youth, clinics, and communities to deliver
healthcare and humanitarian aid across Asia and beyond.
Join us in building a healthier, more compassionate world."

CTA Primary: "Donate Now"  →  /donate
CTA Secondary: "Join the Movement"  →  /volunteer
```

### Impact Stats (animated counters — seed data, update from DB)
```
100,000+   People Served Annually (target)
20         Mobile Clinic Units (2030 target)
8          Countries of Operation
10,000+    Youth Trained
```

### Vision Strip
```
H2: "By 2030, We Will Serve 100,000 People a Year."
Body: "Asia's leading youth-driven healthcare and humanitarian movement —
powered by waqf, driven by youth, governed by global standards."
CTA: "Read Our 5-Year Vision →"  →  /about/vision
```

### How to Help (3 paths)
| Path | Icon | Headline | Body |
|---|---|---|---|
| Donate | `Heart` | "Fund the Mission" | "Your donation funds clinics, mobile units, and emergency responses." |
| Volunteer | `Users` | "Join the Movement" | "Train as a YERT member or apply for our Global Humanitarian Fellowship." |
| Partner | `Handshake` | "Partner With Us" | "Corporate partnerships, CSR programmes, and institutional collaboration." |

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/heartspace

# Better Auth
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=https://heartspace.my

# ToyyibPay
TOYYIBPAY_USER_SECRET_KEY=your_toyyibpay_secret
TOYYIBPAY_CATEGORY_CODE=your_category_code
NEXT_PUBLIC_TOYYIBPAY_BASE_URL=https://toyyibpay.com

# Resend
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@heartspace.my

# App
NEXT_PUBLIC_SITE_URL=https://heartspace.my
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Notes for Claude Code

- Better Auth setup is **Phase 1 priority** — admin routes depend on it from the start
- ToyyibPay uses a **redirect flow** — user leaves the site, pays on ToyyibPay, returns via callback
- Campaign progress bars: `(raised / target) * 100` — cap at 100%, animate with Framer Motion on scroll
- Impact counters on homepage: use `useInView` + count-up animation (Framer Motion or `react-countup`)
- All donation amounts in **MYR** — format as `RM X,XXX.00`
- Zakat handling note: display a disclaimer that zakat eligibility should be verified with an Islamic authority
- Admin dashboard is internal — does not need to be pretty, but must be functional and fast
- Use `@tiptap/react` for news post rich text editor in admin
- ISR (`revalidate: 3600`) for news and campaign pages — they change but not every second
- Mobile-first — donors and volunteers are overwhelmingly on mobile

---

## Follow-up Items Required from Client

- [ ] Confirm domain name
- [ ] Confirm language (English only / bilingual BM+EN)
- [ ] ToyyibPay account credentials and bill codes
- [ ] Real impact numbers to seed the counter (current, not 2030 targets)
- [ ] Existing campaign names and targets to seed
- [ ] Organisation photos / mission photography
- [ ] Team member names and bios for `/about/team`
- [ ] Partner logos (if any confirmed partners)
- [ ] Social media links (Instagram, TikTok, YouTube, LinkedIn)
- [ ] Contact details: office address, phone, email

---

*End of Master Plan — HeartSpace (MyHeart)*