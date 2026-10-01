# HeartSpace — Design System & Style Guide
**Version:** 1.0
**Date:** 5 May 2026
**Design Direction:** Youthful, Warm, Movement-energy — Youth Healthcare & Humanitarian NGO

---

## Design Philosophy

HeartSpace is not a traditional charity. It is a **movement** — built by youth, for humanity. The design must feel like it belongs to a generation that uses Canva, consumes Instagram Reels, and expects brands to look as credible as they are passionate. It should inspire action, not pity. Hope, not despair.

**Three words that drive every decision:**
> **Bold. Warm. Human.**

The visual language borrows from modern impact brands — think Charity: Water, UNICEF's youth campaigns, or One Young World. Clean structure, large typography, real photography, and the brand's two-color system used with confidence. The logo gives us everything we need: teal for trust and health, coral for warmth and humanity. Use them deliberately.

---

## Color Palette

Extracted directly from the HeartSpace logo.

```css
:root {
  /* Brand Teal — primary (health, trust, action) */
  --color-teal:         #1AACB0;   /* extracted from logo "Heart" */
  --color-teal-dark:    #128A8E;
  --color-teal-light:   #4DC4C7;
  --color-teal-pale:    #E6F7F7;   /* backgrounds, badges */

  /* Brand Coral — accent (warmth, humanity, heart) */
  --color-coral:        #F07B72;   /* extracted from logo "Space" */
  --color-coral-dark:   #D45E55;
  --color-coral-light:  #F5A39C;
  --color-coral-pale:   #FEF0EF;   /* warm section tints */

  /* Base */
  --color-white:        #FFFFFF;
  --color-off-white:    #F8FAFA;   /* teal-tinted off-white — page background */

  /* Neutrals */
  --color-ash:          #F0F4F4;   /* alternate sections */
  --color-stone:        #E2E8E8;   /* borders, dividers */
  --color-charcoal:     #1C2B2B;   /* near-black with teal undertone */

  /* Text */
  --color-text-primary: #1C2B2B;   /* headings */
  --color-text-body:    #374040;   /* body copy */
  --color-text-muted:   #6B7F7F;   /* captions, meta */

  /* Utility */
  --color-border:       #D4E0E0;
  --color-shadow:       rgba(26, 172, 176, 0.10);

  /* Campaign / Status colors */
  --color-success:      #22C55E;   /* goal reached */
  --color-warning:      #F59E0B;   /* urgent campaign */
  --color-zakat:        #10B981;   /* zakat badge */
  --color-waqf:         #8B5CF6;   /* waqf badge */
}
```

### Color Usage Rules

| Element | Token |
|---|---|
| Page background | `--color-off-white` |
| Alternate sections | `--color-ash` |
| Primary headings | `--color-charcoal` |
| Body copy | `--color-text-body` |
| Muted text | `--color-text-muted` |
| Primary CTA (bg) | `--color-teal` |
| Primary CTA (text) | `--color-white` |
| Primary CTA hover | `--color-teal-dark` |
| Secondary CTA (border) | `--color-teal` |
| Secondary CTA (text) | `--color-teal` |
| Secondary CTA hover | fill teal, white text |
| Donate button | `--color-coral` bg, white text |
| Donate button hover | `--color-coral-dark` |
| Nav links | `--color-charcoal` |
| Nav link hover | `--color-teal` |
| Footer bg | `--color-charcoal` |
| Footer text | `--color-white` |
| Campaign progress bar fill | `--color-teal` |
| Campaign progress bar bg | `--color-teal-pale` |
| Impact counter number | `--color-teal` |
| Section accent line | `--color-coral` |
| Card border | `--color-border` |
| Card bg | `--color-white` |
| Zakat badge | `--color-zakat` |
| Waqf badge | `--color-waqf` |

---

## Typography

Install via `next/font/google`.

### Display Font — **Plus Jakarta Sans**
- Weights: 600 (SemiBold), 700 (Bold), 800 (ExtraBold)
- Style: Modern, rounded humanist sans — youthful, energetic, credible
- Usage: H1, H2, H3, hero text, impact numbers, campaign titles, nav brand

```css
--font-display: 'Plus Jakarta Sans', system-ui, sans-serif;
```

### Body Font — **Inter**
- Weights: 400 (Regular), 500 (Medium)
- Style: Clean, neutral, highly readable — trusted across devices
- Usage: Body copy, nav links, labels, buttons, form fields, admin UI, captions

```css
--font-body: 'Inter', system-ui, sans-serif;
```

> **Why both from the same sans-serif family?** HeartSpace is a youth movement, not a heritage institution. A serif would feel too formal. Two weights of geometric sans — one expressive, one neutral — creates hierarchy without formality.

### Type Scale

```js
fontSize: {
  'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],   // Hero H1
  'display-lg': ['3.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],  // H1
  'display-md': ['2.25rem',{ lineHeight: '1.25', letterSpacing: '-0.01em' }],  // H2
  'display-sm': ['1.5rem', { lineHeight: '1.35' }],                             // H3
  'stat':       ['3.75rem',{ lineHeight: '1.0',  letterSpacing: '-0.03em' }],  // Impact counters
  'body-lg':    ['1.125rem',{ lineHeight: '1.75' }],                            // Lead copy
  'body-md':    ['1rem',    { lineHeight: '1.75' }],                            // Body
  'body-sm':    ['0.875rem',{ lineHeight: '1.65' }],                            // Caption
  'label':      ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.06em' }],   // Uppercase labels
}
```

### Typography Rules
- H1, H2, H3, impact numbers: Plus Jakarta Sans (800 weight for heroes, 700 for H2, 600 for H3)
- Everything else: Inter
- Heading color: `--color-charcoal` on light bg, `--color-white` on dark bg
- Impact stat numbers: `--color-teal`, Plus Jakarta Sans 800
- Max line length: `65ch`

---

## Spacing System

| Token | Value | Usage |
|---|---|---|
| Section padding | `py-20 md:py-28` | Standard |
| Hero padding | `py-28 md:py-40` | Hero only |
| Container max-width | `max-w-6xl` (72rem) | Main content |
| Container padding | `px-6 md:px-8` | Horizontal gutters |
| Card padding | `p-5 md:p-6` | Campaign/news cards |
| Grid gap | `gap-5 md:gap-6` | Card grids |

---

## Component Design Tokens

### Navbar
```
Height:          68px desktop / 60px mobile
Background:      --color-white, 1px border-bottom, solid always
Logo:            left — next/image src="/images/logo.png"
Nav links:       center desktop — Inter 500, --color-charcoal, hover: --color-teal
Right:           "Donate" button (coral filled) + optional "Volunteer" ghost
Mobile:          hamburger → full-height drawer
Sticky:          yes, shadow on scroll
```

### Buttons

**Primary (Teal — main action)**
```
Background:      --color-teal
Text:            white, Inter 500, 0.9rem, tracking-wide
Padding:         px-7 py-3.5
Border-radius:   8px
Hover:           --color-teal-dark, translateY(-1px)
```

**Donate (Coral — always coral)**
```
Background:      --color-coral
Text:            white, Inter 500, 0.9rem
Padding:         px-7 py-3.5
Border-radius:   8px
Hover:           --color-coral-dark, translateY(-1px)
```

**Secondary (Outlined Teal)**
```
Border:          2px solid --color-teal
Text:            --color-teal, Inter 500
Hover:           fill teal, white text
Border-radius:   8px
```

### Campaign Cards
```
Background:      --color-white
Border:          1px solid --color-border
Border-radius:   12px
Shadow:          0 2px 16px --color-shadow
Hover:           translateY(-4px), shadow deepens
Image:           16:9 ratio, top of card, border-radius 12px 12px 0 0
Body:            category badge + title + excerpt + progress bar + raised/target + Donate button
```

### Progress Bar
```
Container:       --color-teal-pale bg, border-radius full, height 8px
Fill:            --color-teal, animated width from 0 on scroll-into-view
Label:           "RM X,XXX raised of RM X,XXX target" — Inter body-sm, muted
Overflow label:  if > 100%, show "Goal Reached! 🎉" in green
```

### Impact Stat Cards
```
Layout:          horizontal row, 4 stats, centered
Number:          Plus Jakarta Sans 800, stat size, --color-teal
Label:           Inter 500, body-sm, --color-text-muted, uppercase
Animation:       count up from 0 when scrolled into view (react-countup or Framer Motion)
Divider:         thin vertical line between stats (desktop)
```

### Donation Type Badges
```
Sadaqah:   --color-coral-pale bg, --color-coral text
Zakat:     #DCFCE7 bg, #15803D text
Waqf:      #EDE9FE bg, #6D28D9 text
General:   --color-teal-pale bg, --color-teal text
```

### Footer
```
Background:      --color-charcoal
Text:            --color-white
4-column desktop / 2-col tablet / stacked mobile

Col 1: Logo (white) + mission statement + social icons
Col 2: Quick links (About, Campaigns, Donate, Volunteer)
Col 3: Programs (YERT, Fellowship, Events, Partners)
Col 4: Contact + newsletter signup

Bottom bar:
  "© 2026 MyHeart / HeartSpace. All Rights Reserved. Registered NGO Malaysia."
  Inter, 0.75rem, white/40
```

---

## NGO-Specific UI Patterns

### Donation Amount Selector
```
Row of preset buttons: RM10 / RM25 / RM50 / RM100 / RM250 / Custom
Selected: --color-teal bg, white text
Unselected: --color-teal-pale bg, --color-teal text
Custom: text input appears when "Custom" selected
```

### Campaign Progress Bar (on campaign detail page)
```
Large, prominent
Show: percentage, RM raised, RM target, number of donors, days left
Milestone markers at 25% / 50% / 75% (optional)
```

### Volunteer Program Tags
```
Pill tags: YERT / Fellowship / General / Event
Each a different pastel — consistent color per program type
```

---

## Animation & Motion

Use **Framer Motion**. Energetic but not chaotic — this is a humanitarian brand.

### Principles
- Fast entrances: `duration: 0.45–0.55` — youth brand, not a law firm
- Use `[0.16, 1, 0.3, 1]` bezier for most transitions
- Impact counters: count-up animation, `duration: 2s`, triggered on scroll

### Standard Patterns

**Fade + Rise (section entrances)**
```js
initial:   { opacity: 0, y: 20 }
animate:   { opacity: 1, y: 0 }
transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
```

**Staggered cards**
```js
// Parent: staggerChildren: 0.08
// Child: same fade+rise
```

**Progress bar fill**
```js
initial:   { width: '0%' }
animate:   { width: `${percentage}%` }
transition: { duration: 1.2, ease: 'easeOut', delay: 0.3 }
```
Triggered with `whileInView`, `viewport={{ once: true }}`

**Impact counter**
```js
// Use react-countup with enableScrollSpy
// Or Framer Motion useMotionValue + useTransform
// Duration: 2 seconds, ease: easeOut
```

---

## Layout Patterns

| Section | Pattern |
|---|---|
| Hero | Full-viewport, dark overlay on image bg, centered or left text |
| Impact Stats | Full-width teal bg, 4-col stat row, white text |
| Active Campaigns | 3-column card grid |
| Vision Strip | 2-column: bold text left, image right (dark bg) |
| Why HeartSpace | 4-col icon grid on ash bg |
| How to Help | 3-col cards, teal icon, centered |
| Latest News | 3-col card grid |
| Events | Horizontal scroll or 3-col grid |
| CTA Banner | Full-width coral or teal bg, centered, bold H2 + donate button |
| Footer | 4-column desktop / stacked mobile |

---

## Tailwind Config Extensions

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#1AACB0',
          dark:    '#128A8E',
          light:   '#4DC4C7',
          pale:    '#E6F7F7',
        },
        coral: {
          DEFAULT: '#F07B72',
          dark:    '#D45E55',
          light:   '#F5A39C',
          pale:    '#FEF0EF',
        },
        charcoal: '#1C2B2B',
        'off-white': '#F8FAFA',
        ash:       '#F0F4F4',
        stone:     '#E2E8E8',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        card:    '12px',
        full:    '9999px',
      },
    },
  },
}
```

---

## Do's and Don'ts

### ✅ Do
- Use teal for primary actions and trust elements (join, learn more, mission)
- Use coral **exclusively** for donate buttons — train the eye to recognize it
- Use Plus Jakarta Sans 800 for big impact statements and counters
- Show real photography of missions, clinics, and people (when provided)
- Keep campaign cards clean — progress bar is the hero of every card
- WhatsApp float always visible — primary contact channel

### ❌ Don't
- Use "charity poverty aesthetics" — no sad images, no guilt-based design
- Use coral for anything other than donate CTAs — it must mean "give"
- Mix too many colors in a single section — pick teal OR coral per section
- Use serif fonts anywhere — wrong energy for this brand
- Heavy dark overlays on photography — 50% maximum
- Make the admin UI pretty — functional and fast is enough for the admin panel

---

*End of Design Guide — HeartSpace (MyHeart)*