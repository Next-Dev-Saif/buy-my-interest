# UI/UX Design Guidelines for AI Agents
### Centralized Design Rules — Crafted to Eliminate Generic AI Output

> **Mission:** Every interface you produce must look like it was designed by a senior product designer with 10+ years of craft. Not assembled. Not generated. *Designed.*

---

## PART 1 — THE MINDSET BEFORE YOU TOUCH A PIXEL

### 1.1 Design With Intent, Not Instinct

Every decision — padding, color, font weight, border radius — must have a *reason*. Ask yourself:
- What is the user trying to do on this screen?
- What is the single most important action?
- What information is secondary and should recede?

If you can't answer why an element exists, remove it.

### 1.2 Design for the User's Mental Model

Real users don't read interfaces — they *scan* them. Eye-tracking studies confirm an **F-pattern** or **Z-pattern** scan across most layouts. Place the most critical content top-left, primary CTAs at natural resting points, and never bury key actions.

### 1.3 Treat AI Defaults as a Starting Point — Never a Finish

AI-generated UI has identifiable "tells" (see Part 6). Your job is to override every default that makes the design look assembled rather than intentional.

---

## PART 2 — VISUAL HIERARCHY (THE MOST IMPORTANT SKILL)

> *"If everything is important, nothing is."* — Malewicz

### 2.1 The Three-Tier Hierarchy Rule

Every screen must have exactly three tiers of visual weight:

| Tier | Role | Example Treatment |
|------|------|-------------------|
| **Primary** | The one thing that matters most | Large, high contrast, full color |
| **Secondary** | Supporting context | Medium size, muted tone, regular weight |
| **Tertiary** | Background data or meta info | Small, low contrast, light weight |

Never promote more than **1–2 elements** to Primary on a single screen.

### 2.2 Scale is the Strongest Hierarchy Tool

Use a **logarithmic scale** for typography and element sizing:
- H1 / Hero: 48–72px
- H2 / Section: 28–36px
- H3 / Card title: 20–24px
- Body: 15–17px
- Caption / Meta: 12–13px

Never use more than **4 distinct sizes** on a screen. More creates chaos, not hierarchy.

### 2.3 Weight Over Size When Space Is Tight

When you can't increase size, increase **font weight**. A `700` heading at 18px beats a `400` heading at 22px for attention-grabbing.

### 2.4 Contrast as a Hierarchy Signal

- Primary text: 90–95% opacity or solid `#111` / `#1a1a1a`
- Secondary text: 60–70% opacity
- Tertiary / placeholder: 35–45% opacity

Never use pure `#000000` on pure `#FFFFFF` — it's harsh. Use near-blacks and off-whites.

---

## PART 3 — SPACING & LAYOUT SYSTEM

### 3.1 The 8px Grid — Non-Negotiable

All spacing, padding, margins, and sizes must be multiples of **8** (or 4 for fine-tuning):
- `4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128`

Random values like `13px`, `22px`, `37px` are immediately visible as AI artifacts. They destroy cohesion.

### 3.2 Spacing Communicates Relationships (Proximity Law)

- Elements that belong together → **tight spacing** (8–12px)
- Elements in the same group → **medium spacing** (16–24px)
- Separate sections or groups → **generous spacing** (40–64px)

Use space as a *divider* before you ever reach for a line or border.

### 3.3 Breathing Room Is a Feature

Crowded layouts signal low confidence. **Whitespace is not wasted space** — it reduces cognitive load, guides focus, and elevates perceived quality. When in doubt, add 16px more padding.

### 3.4 Max-Width and Container Awareness

- Always check the parent container's max-width before adding a new one.
- If the parent already constrains width (e.g., `max-width: 1200px`), your inner element should use `width: 100%` — not add a new max-width on top.
- Global layout max-widths: `640px` (narrow), `768px` (content), `1024px` (wide), `1280px` (full desktop).

### 3.5 Fill Empty Space Intelligently

Before shipping a layout, scan for large empty areas. Ask: *"What logically belongs here?"*
- A stat, metric, or supporting callout?
- A secondary action or contextual link?
- A visual accent (icon, illustration placeholder, subtle pattern)?

Never fill space with decoration. Fill it with **relevant content**.

---

## PART 4 — TYPOGRAPHY

### 4.1 Font Choice

- Default to **Inter**, **Geist**, or **Poppins** for modern product UI.
- Use a **custom or display typeface** only for hero/brand moments — never for body text.
- Stick to **1 typeface** with multiple weights, or **2 typefaces max** (one display, one UI).
- Avoid system defaults (Arial, Times New Roman) unless the project context demands it.

### 4.2 Weight Contrast Creates Rhythm

Most AI-generated designs are boring because they use only `400` and `600`. Use the full range:
- `300` — delicate labels, captions
- `400` — body copy
- `500` — emphasized body, nav items
- `600` — subheadings, card titles
- `700–800` — major headings
- `900` — hero statements only

### 4.3 Line Height & Letter Spacing

| Context | Line Height | Letter Spacing |
|---------|------------|----------------|
| Large display (48px+) | 1.0–1.15 | -0.02em to -0.04em (tighter) |
| Headings (24–40px) | 1.2–1.3 | -0.01em to 0 |
| Body text (15–17px) | 1.5–1.65 | 0 to +0.01em |
| Captions / labels | 1.4–1.5 | +0.02em to +0.08em |

Large headings **must** be tightened. Body text **must** breathe. These are not suggestions.

### 4.4 Typographic Hierarchy Strips (Malewicz Principle)

When grouping related information (e.g., a user profile, a form section, a card), separate **action groups** with visual space before touching any other styling. Think in blocks of meaning first, then style them.

---

## PART 5 — COLOR SYSTEM

### 5.1 The Restrained Palette Rule

| Role | Count | Usage |
|------|-------|-------|
| **Primary** | 1 color + 2–3 tints/shades | CTAs, active states, brand moments |
| **Neutral** | 6–8 grayscale steps | Backgrounds, text, dividers, surfaces |
| **Semantic** | 3 colors | Success (green), Warning (amber), Error (red) |
| **Accent** | 0–1 color | Highlights only — use sparingly |

Never use more than **2 non-neutral colors** at full saturation on a single screen.

### 5.2 Dark Mode Color Logic (Malewicz Light Source Rule)

In dark mode, think of the phone held at a 45° angle with a light source above. Elements **closer to the user** appear slightly lighter. Use this:
- Elevated cards → slightly lighter surface than the background
- Background → darkest value
- Avoid pure `#000000` — use a dark shade tinted with your primary color (e.g., `#0d0f14` for a blue-accent app)
- Avoid pure `#FFFFFF` — use a slightly warm or tinted near-white

### 5.3 Color Contrast — Minimum Requirements

- Body text on background: **4.5:1** (WCAG AA)
- Large text / UI components: **3:1**
- Check contrast at every step. Use a tool. Don't guess.

### 5.4 Subtle Gradients Over Flat or Neon

If using gradients:
- Keep the hue shift **narrow** (e.g., blue-500 to blue-700, not blue to purple)
- Use gradients for backgrounds, cards, or hero sections — not on text unless it's a deliberate brand moment
- Avoid saturated neon gradients (cyan → magenta → orange) — they are the #1 AI design tell

### 5.5 Semantic Color Discipline

Never repurpose semantic colors for decoration. Red is for errors. Green is for success. Using green as a "vibey" accent color on a non-success element trains users to misread the interface.

---

## PART 6 — THE AI DESIGN ANTI-PATTERNS (WHAT TO NEVER DO)

> These are the signals that scream "AI generated." Eliminate all of them.

| Anti-Pattern | Why It's Bad | What to Do Instead |
|---|---|---|
| Excessive pill-shaped everything | Homogenizes all elements, loses hierarchy | Use `border-radius: 8–12px` for cards/inputs, reserve full pills for tags/badges only |
| Neon/oversaturated gradients | Screams template, no brand identity | Use narrow-hue, subtle gradients or flat color |
| Heavy glow effects | Decorative, no functional purpose | Use shadow (`box-shadow`) for elevation only |
| Blinking / looping animations | Distracts, can cause accessibility issues | Use transitions only on interaction (hover, focus, click) |
| Random floating shapes/blobs | No hierarchy, no meaning | Use background shapes only if they reinforce structure |
| Pure `#000` on `#FFF` | Harsh, unrefined | Use `#111827` on `#FAFAFA` or equivalent |
| Every element the same border-radius | Flat, monotonous | Vary radius by component purpose — buttons tighter, modals more rounded |
| Vague marketing copy | Users can't act on it | Use clear, task-oriented language ("Save Changes", "View Report") |
| Phantom borders everywhere | Visual noise, weak hierarchy | Use spacing and background contrast as dividers first |
| Emojis as UI elements | Looks unfinished, unprofessional | Use icons from a consistent icon set (Lucide, Phosphor, Heroicons) |
| Centered everything | Breaks F/Z scan patterns | Left-align most content; center only for empty states, hero sections |
| Card borders instead of shadows | Flat, low depth | Use `box-shadow` with low opacity for elevation cues |
| Inconsistent icon sizes | Chaotic, unpolished | Pick a single icon size per context (16px inline, 20px nav, 24px feature) |

---

## PART 7 — COMPONENT DESIGN STANDARDS

### 7.1 Buttons

- **Primary:** Solid background, high contrast text, `border-radius: 6–10px`
- **Secondary:** Outlined or ghost, same radius as primary
- **Destructive:** Only use red when the action is irreversible
- **Size:** Minimum height 40px (desktop), 44px (mobile/touch)
- **Never** use more than 2 button styles in the same view
- **Label rule:** Verb + noun or verb only. "Save", "Delete Account", "Export CSV" — not "Click Here" or "Submit"

### 7.2 Forms

- Label above input, always (not placeholder-only)
- Input height: 40–44px with 12–16px horizontal padding
- Group related fields visually (proximity, shared background)
- Inline validation — show errors at the field level, not only at submit
- Progress indicators for multi-step forms (Hierarchy Strips)

### 7.3 Cards

- Consistent internal padding: 16–24px
- One primary action per card (if interactive)
- Keep shadow subtle: `0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)`
- Don't overload a card — if it needs more than 4–5 elements, reconsider the data model

### 7.4 Navigation

- Top nav for broad products (content sites, marketing)
- Sidebar nav for dense tools (dashboards, admin panels, apps)
- Active state must be unmistakable (color + weight change, not just underline)
- Limit top-level nav items to 5–7 maximum

### 7.5 Tables & Data

- Zebra striping or row hover — pick one, not both
- Align numbers right, text left
- Column headers: uppercase, `font-size: 11–12px`, `letter-spacing: 0.06em`
- Provide empty states with a message AND a primary action

---

## PART 8 — DEPTH & LAYERING

### 8.1 The Z-Axis Tells a Story

Every UI has layers. Communicate them consistently:

| Layer | Element | Treatment |
|-------|---------|-----------|
| 0 — Ground | Page background | Base color, no shadow |
| 1 — Surface | Cards, panels | Subtle shadow or slight tint |
| 2 — Raised | Dropdowns, tooltips | Medium shadow |
| 3 — Floating | Modals, drawers | Strong shadow + backdrop blur |
| 4 — Overlay | Toast/alerts | Highest z-index, strongest shadow |

### 8.2 Shadows as Elevation, Not Decoration

Use `box-shadow` to establish depth, not to look "fancy." A button shouldn't have a shadow just because it looks cool — it should have one if it's visually elevated above its context.

Shadow recipe for each level:
- Level 1: `0 1px 2px rgba(0,0,0,0.05)`
- Level 2: `0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)`
- Level 3: `0 12px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)`
- Level 4: `0 24px 48px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08)`

---

## PART 9 — MICROINTERACTIONS & MOTION

### 9.1 Motion Has a Single Purpose: Feedback

Every animation must answer one question: *"Did my action work?"*

- Hover states: `150ms ease`
- Focus transitions: `100ms ease`
- Entering elements (modal, drawer): `200–280ms ease-out`
- Exiting elements: `150–200ms ease-in` (exits should be faster than entrances)
- Page/route transitions: `200–300ms`

### 9.2 What NOT to Animate

- Don't animate layout shifts (causes cognitive disruption)
- Don't loop animations in idle state (distracting)
- Don't use bouncy/spring animations in B2B/enterprise contexts (feels unserious)
- Don't animate text (almost always illegible mid-animation)

### 9.3 Respect `prefers-reduced-motion`

Always implement `@media (prefers-reduced-motion: reduce)` — disable or minimize transitions for users who need it.

---

## PART 10 — RESPONSIVE DESIGN

### 10.1 Desktop vs. Mobile Are Different Problems

**Desktop:**
- Information density can be higher
- Multi-column layouts are expected
- Hover states are available for secondary actions
- Navigation can be persistent (sidebar)

**Mobile:**
- Touch targets minimum 44×44px
- One primary action per screen
- Bottom navigation preferred over top for frequent actions (thumb zone)
- Never put critical interactions at the very top of long screens

### 10.2 Breakpoints

| Name | Width | Layout |
|------|-------|--------|
| Mobile | < 640px | 1 column, stacked |
| Tablet | 640–1024px | 2 columns, adaptive |
| Desktop | 1024–1280px | 3–4 columns, full nav |
| Wide | > 1280px | Max-width container, extra whitespace |

### 10.3 Never Just "Scale Down" a Desktop Layout

Responsive means *rethinking*, not shrinking. On mobile:
- Tables become stacked cards or horizontal-scroll containers
- Multi-column forms become single-column
- Sidebar nav becomes a bottom bar or hamburger menu
- Data-dense dashboards get simplified to priority metrics only

---

## PART 11 — COPY & CONTENT DESIGN

### 11.1 Every Word Is a Design Decision

Bad copy makes good design look broken. Apply:
- **Clarity over cleverness** — users must understand in under 2 seconds
- **Verb-first CTAs** — "Download Report", "Start Free Trial", "Connect Account"
- **No corporate filler** — delete "Leverage", "Synergy", "Seamless", "Empower"
- **Consistent terminology** — if it's called "Project" in the nav, it's called "Project" everywhere. Not "Workspace", not "Board", not "Space"

### 11.2 Empty States Are Opportunities

Never show a blank screen. Every empty state needs:
1. A clear explanation of why it's empty
2. An illustration or icon (simple, not cartoonish)
3. A primary CTA that resolves the emptiness

### 11.3 Error Messages Are UX

- Say what happened: "We couldn't save your changes"
- Say why (if useful): "Your session has expired"
- Say what to do: "Sign in again to continue"
- Never say: "Error 403" or "Something went wrong" alone

---

## PART 12 — REDESIGN RULES

When redesigning an existing page, section, or component:

1. **Never change the text/copy** unless explicitly asked — only the layout and visual treatment
2. **Preserve the existing color palette** — enhance it, don't replace it
3. **Understand the container structure** before touching a line of code — read the closing tags and parent context
4. **Check the result visually** before committing — does it fit within the parent layout? Is there overflow? Does it break at the edges?
5. **Improve density and hierarchy**, not just decoration — a redesign should feel more *clear*, not more *colorful*
6. **One design system** — if the existing project uses a component library or specific spacing values, match them exactly

---

## PART 13 — THE PRE-SHIP CHECKLIST

Run every design through this before calling it done:

### Visual Quality
- [ ] Is there a clear primary focal point on every screen?
- [ ] Does the type hierarchy have at least 3 distinct levels?
- [ ] Are all spacings multiples of 4 or 8?
- [ ] Does color contrast pass 4.5:1 for body text?
- [ ] Are shadows used for elevation, not decoration?

### Content Quality
- [ ] Is all copy functional (not vague or filler)?
- [ ] Are empty states handled?
- [ ] Are error/success states designed?

### Anti-AI Check
- [ ] Are there any neon or oversaturated gradients?
- [ ] Is anything glowing without reason?
- [ ] Is the border-radius consistent and intentional?
- [ ] Is there any pure black/white being used?
- [ ] Does any element look like it came from a UI kit without modification?

### Responsive Check
- [ ] Does it work on mobile (< 640px)?
- [ ] Are touch targets at least 44px?
- [ ] Does the layout reflow logically, not just shrink?

### Global Consistency Check
- [ ] Is the component using the global max-width system?
- [ ] Are fonts, colors, and icons consistent with the rest of the project?
- [ ] Do new components match the existing design language?

---

## PART 14 — DESIGN VOCABULARY (USE THESE TERMS CORRECTLY)

| Term | Meaning |
|------|---------|
| **Visual hierarchy** | The order in which the eye perceives elements |
| **Affordance** | Visual cues that signal how an element is used (button looks clickable) |
| **Cognitive load** | Mental effort required to process information |
| **Proximity** | Grouping related elements closer together |
| **Gestalt** | Visual principles (similarity, continuity, closure) that explain perception |
| **Contrast ratio** | Numerical measure of readability between text and background |
| **Design token** | Named variable for a design value (color, spacing, radius) used system-wide |
| **Elevation** | The perceived z-height of a UI element, communicated via shadow |
| **Breakpoint** | Screen width at which layout changes |
| **Microinteraction** | A small, purposeful animation triggered by user action |

---

## QUICK REFERENCE — THE GOLDEN RULES

1. **One thing per screen is the hero.** Everything else serves it.
2. **Space is a design element.** Use it with intent.
3. **If it doesn't have a job, remove it.**
4. **Near-black on off-white. Always. Never pure contrast.**
5. **Animate interactions, not decorations.**
6. **Redesign means restructure — not redecorate.**
7. **If it looks AI-generated, simplify until it doesn't.**
8. **Typography is 60% of the UI.** Treat it accordingly.
9. **Color is the last tool, not the first.**
10. **Test it at 375px. If it breaks, it wasn't designed — it was assembled.**

---

*Compiled from principles by Michal Malewicz, Ran Segall (Flux Academy), Mizko, DesignCourse, and cross-referenced against WCAG 2.2, Material Design 3, and Apple HIG. Updated 2025–2026.*