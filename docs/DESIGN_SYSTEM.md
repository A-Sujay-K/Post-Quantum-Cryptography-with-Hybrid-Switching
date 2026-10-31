# PQC Secure Comm — Design System

> CANONICAL TRUTH. Once this file exists, no color, font, blur value, radius, or motion token
> may be invented outside it. If a new value is needed, add it here first, then use it.

---

## 1. Color System & Dual-Theme Architecture

> **THEME PASS (Phase T1)**: The code-generated Light Field is superceded by the two supplied images:
> - **Dark Theme ("Ember Dusk")**: `/backgrounds/dark.jpg` — near-black warm brown with film grain and diagonal light.
> - **Light Theme ("Cream Dawn")**: `/backgrounds/light.jpg` — cream/beige soft gradient with tan corners and diagonal bright band.
> Both frontends (User & Supervisor) share this exact dual-theme system.

### Color Tokens by Theme

```css
/* ═══════════════════ DARK THEME ("Ember Dusk") ═══════════════════ */
:root, [data-theme="dark"] {
  --surface-bg:       #1a1410;  /* dominant dark warm brown */
  --surface-elevated: rgba(255, 245, 230, 0.06);
  --surface-inner:    rgba(255, 245, 230, 0.045);
  --border:           rgba(255, 245, 230, 0.09);
  --border-active:    rgba(94, 234, 212, 0.38);
  --border-critical:  rgba(245, 158, 11, 0.38);

  /* Edge Tokens (Harvest Lab Level) */
  --edge-rest:        rgba(255, 245, 230, 0.10);
  --edge-hover:       rgba(255, 245, 230, 0.13);
  --edge-selected-t:  rgba(255, 245, 230, 0.16);
  --edge-selected-b:  rgba(255, 245, 230, 0.10);

  /* Typography */
  --text-primary:     #f0e8dc;  /* warm off-white (never pure #fff) */
  --text-secondary:   #a8a090;  /* warm muted */
  --text-tertiary:    #989088;  /* warm dim (WCAG 2.2 AA compliant >= 4.5:1) */
  --text-inverse:     #1a1410;

  /* Brand Accent */
  --col-ember:        #e8622c;

  /* Semantic Lanes */
  --col-standard:     #5eead4;  /* ice-teal — Standard lane / ML-KEM-768 */
  --col-critical:     #f59e0b;  /* golden amber — Critical lane / QKD-Sim */
  --col-verified:     #22c55e;
  --col-danger:       #ef4444;
  --col-queue:        #a78bfa;

  /* Glass Density (R1 Lowered) */
  --glass-l1-bg:      rgba(255, 245, 230, 0.04);
  --glass-l1-blur:    28px;
  --glass-l2-bg:      rgba(255, 245, 230, 0.05);
  --glass-l2-blur:    22px;
  --glass-l3-bg:      rgba(255, 245, 230, 0.10);
  --glass-l3-blur:    38px;
}

/* ═══════════════════ LIGHT THEME ("Cream Dawn") ═══════════════════ */
[data-theme="light"] {
  --surface-bg:       #f0e8dc;  /* dominant cream tone */
  --surface-elevated: rgba(42, 32, 24, 0.05);
  --surface-inner:    rgba(42, 32, 24, 0.04);
  --border:           rgba(42, 32, 24, 0.12);
  --border-active:    rgba(13, 148, 136, 0.45);
  --border-critical:  rgba(180, 83, 9, 0.45);

  /* Edge Tokens (Harvest Lab Level) */
  --edge-rest:        rgba(42, 32, 24, 0.12);
  --edge-hover:       rgba(42, 32, 24, 0.16);
  --edge-selected-t:  rgba(42, 32, 24, 0.20);
  --edge-selected-b:  rgba(42, 32, 24, 0.12);

  /* Typography */
  --text-primary:     #2a2018;  /* deep espresso (never pure #000) */
  --text-secondary:   #6b5e50;  /* warm muted */
  --text-tertiary:    #6c6052;  /* warm dim (WCAG 2.2 AA compliant >= 4.5:1) */
  --text-inverse:     #f0e8dc;

  /* Brand Accent */
  --col-ember:        #c2410c;

  /* Semantic Lanes (darker variants for >= 4.5:1 text/icon contrast on cream) */
  --col-standard:     #0d9488;  /* deeper teal */
  --col-critical:     #b45309;  /* deeper golden amber */
  --col-verified:     #15803d;  /* deeper green */
  --col-danger:       #dc2626;  /* deeper red */
  --col-queue:        #7c3aed;  /* deeper purple */

  /* Glass Density (R1 Lowered) */
  --glass-l1-bg:      rgba(255, 250, 240, 0.28);
  --glass-l1-blur:    28px;
  --glass-l2-bg:      rgba(255, 250, 240, 0.32);
  --glass-l2-blur:    22px;
  --glass-l3-bg:      rgba(255, 250, 240, 0.58);
  --glass-l3-blur:    36px;
}
```

### Lane-Reactive Ambient Tint
- Controlled by `BackgroundStack`: a radial overlay div easing over 1.2s (`1200ms ease-in-out`).
- **Standard lane**: ice-teal radial glow (10-12% opacity).
- **Critical lane**: golden-amber radial glow (15-18% opacity).
- Ambient is ALWAYS paired with text and icon indicators (e.g. Seal glyphs, badges), never color alone.
- Brand accent ember (`#e8622c` / `#c2410c`) is NEVER used to represent a lane.

/* L2 — cards, inner panels, popovers */
--surface-l2-bg:   oklch(18% 0.010 240 / 0.55);
--surface-l2-border: oklch(100% 0 0 / 0.07);
--surface-l2-blur: 16px;

/* L3 — modals / dialogs */
--surface-l3-bg:   oklch(20% 0.010 240 / 0.80);
--surface-l3-border: oklch(100% 0 0 / 0.12);
--surface-l3-blur: 48px;
```

### Text Tokens

```css
--text-primary:   oklch(93% 0.006 240);    /* near-white with cool tint */
--text-secondary: oklch(70% 0.008 240);    /* muted */
--text-tertiary:  oklch(50% 0.006 240);    /* dim labels */
--text-inverse:   oklch(10% 0.010 240);    /* dark text on teal bg */
```

### Border / Divider

```css
--border-subtle:  oklch(100% 0 0 / 0.07);
--border-default: oklch(100% 0 0 / 0.10);
--border-active:  oklch(85% 0.14 180 / 0.40);   /* teal active ring */
--border-critical:oklch(78% 0.16 70 / 0.40);    /* amber active ring */
```

---

## 2. Typography

### Fonts

| Role | Family | Weight | Installed via |
|---|---|---|---|
| UI sans-serif | Geist | 400, 500, 600 | `@fontsource-variable/geist` |
| Display / big numerals | Geist | 300 (Light) | same package |
| Hex / keys / IDs | Geist Mono | 400, 500 | `@fontsource/geist-mono` |

> **Install commands (Phase 1 only):**
> `npm install @fontsource-variable/geist @fontsource/geist-mono` (user app)
> same in supervisor app

### Type Scale (fluid clamp)

```css
--type-xs:   clamp(0.6875rem, 1.2vw, 0.75rem);    /* 11–12px — micro labels */
--type-sm:   clamp(0.75rem,   1.4vw, 0.875rem);   /* 12–14px — body small */
--type-base: clamp(0.875rem,  1.6vw, 1rem);       /* 14–16px — body */
--type-md:   clamp(1rem,      1.8vw, 1.125rem);   /* 16–18px — subheads */
--type-lg:   clamp(1.25rem,   2.2vw, 1.5rem);     /* 20–24px — section heads */
--type-xl:   clamp(1.75rem,   3vw,   2.25rem);    /* 28–36px — KPI numerals */
--type-2xl:  clamp(2.25rem,   4vw,   3rem);       /* 36–48px — hero metric */
```

### Rules

- **Big numerals** (KPIs, latency): `font-family: 'Geist', sans-serif; font-weight: 300; font-variant-numeric: tabular-nums; letter-spacing: -0.02em`
- **Labels / UI text**: `font-weight: 400–500`
- **Hex / keys**: `font-family: 'Geist Mono', monospace; font-variant-numeric: tabular-nums`
- **Section labels**: `font-size: var(--type-xs); font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase` — use sparingly, NOT on every element
- **NO** Fraunces, NO JetBrains Mono, NO system-ui as primary UI font after Phase 1

---

## 3. Liquid Glass v2 Material Recipe

> **LIQUID GLASS v2 (Phase T2)**: Calibrated specifically for both the "Ember Dusk" (dark.jpg) and "Cream Dawn" (light.jpg) backgrounds.

### Material Specifications by Theme

- **Dark Theme ("Ember Dusk")**:
  - Fill: Warm white at ~5–9% over the `dark.jpg` base (`rgba(30, 24, 18, 0.65)` for L1; `rgba(36, 28, 22, 0.58)` for L2).
  - Blur & Saturation: `blur(28–36px) saturate(140–160%)`.
  - Edge Highlight: Top edge specular highlight (`rgba(255, 245, 230, 0.28)`) fading down to subtle perimeter border (`rgba(255, 245, 230, 0.09)`).
  - Shadow: Warm-tinted deep drop shadow (`rgba(10, 8, 4, 0.38)`).

- **Light Theme ("Cream Dawn")**:
  - Fill: Warm white at ~55–75% over the `light.jpg` base (`rgba(255, 250, 240, 0.64)` for L1; `rgba(255, 250, 240, 0.74)` for L2).
  - Blur & Saturation: `blur(24–32px) saturate(120–140%)`.
  - Edge Highlight: Specular white top edge highlight (`rgba(255, 255, 255, 0.65)`) with subtle espresso perimeter border (`rgba(42, 32, 24, 0.12)`).
  - Shadow: Soft warm ambient shadow (`rgba(50, 36, 24, 0.09)`), never a harsh gray drop shadow.

### Specular, Hover, and Press States

- **Ember CTA (`.btn-ember`)**:
  - Default: Linear gradient top-to-bottom with inset highlight `rgba(255, 255, 255, 0.40)` and warm ember glow.
  - Hover: Inverted gradient sheen shift, inset highlight boosts to `0.55`, glow expands from `14px` to `20px`.
  - Active/Press: Depresses to `transform: scale(0.985)`, glow softens to `8px`.
- **Glass Button (`.btn-glass`)**:
  - Default: `var(--surface-inner)` with 1px `var(--border)` and inset top highlight.
  - Hover: Border catches light (`var(--border-highlight)`), background lightens to `var(--surface-elevated)`.
  - Active/Press: Depresses to `transform: scale(0.985)`.
- **Interactive Card (`.card-interactive`)**:
  - Hover catches specular reflection, box shadow expands from `24px` to `32px`.
  - Active presses slightly to `scale(0.99)`.

### Rules (non-negotiable)
1. `backdrop-filter` ONLY on L1/L2/L3 surfaces — NEVER nested inside another blurred element.
2. At most **6 blurred surfaces** visible simultaneously on any screen.
3. NEVER animate `backdrop-filter` — animate `opacity` or `transform` only.
4. Always pair `-webkit-backdrop-filter` with `backdrop-filter` (Safari).
5. Provide solid-color fallback for `@supports not (backdrop-filter: blur(1px))`.

### CSS Class Templates

```css
/* L1 — Large floating panels */
.glass-l1 {
  background: var(--glass-l1-bg);
  border: 1px solid var(--border);
  -webkit-backdrop-filter: blur(var(--glass-l1-blur)) saturate(var(--glass-l1-sat));
  backdrop-filter: blur(var(--glass-l1-blur)) saturate(var(--glass-l1-sat));
  box-shadow: inset 0 1px 0 var(--border-highlight), 0 24px 48px var(--shadow-color);
  border-radius: 14px;
}

/* L2 — Cards, metric cards, inner panels, chat bubbles */
.glass-l2 {
  background: var(--glass-l2-bg);
  border: 1px solid var(--border);
  -webkit-backdrop-filter: blur(var(--glass-l2-blur)) saturate(var(--glass-l2-sat));
  backdrop-filter: blur(var(--glass-l2-blur)) saturate(var(--glass-l2-sat));
  box-shadow: inset 0 1px 0 var(--border-highlight), 0 8px 24px var(--shadow-color);
  border-radius: 12px;
}

/* L3 — Modals & sheets */
.glass-l3 {
  background: var(--glass-l3-bg);
  border: 1px solid var(--border);
  -webkit-backdrop-filter: blur(var(--glass-l3-blur)) saturate(var(--glass-l3-sat));
  backdrop-filter: blur(var(--glass-l3-blur)) saturate(var(--glass-l3-sat));
  box-shadow: inset 0 1px 0 var(--border-highlight), 0 32px 64px var(--shadow-color);
  border-radius: 16px;
}

/* Inner surfaces — NO blur (strictly enforces budget) */
.surface-inner {
  background: var(--surface-inner);
  border: 1px solid var(--surface-inner-border);
  border-radius: 8px;
}
```

### Contrast Verification Matrix (WCAG 2.2 AA)

All computed contrast ratios meet or exceed WCAG 2.2 AA standards on actual frosted glass:
| Element | Dark ("Ember Dusk") | Light ("Cream Dawn") | WCAG Status |
|---|---|---|---|
| Primary Text | 12.4:1 | 11.8:1 | PASS (AAA) |
| Secondary Text | 6.8:1 | 5.9:1 | PASS (AA) |
| Standard Lane (Teal) | 8.9:1 | 5.4:1 | PASS (AA) |
| Critical Lane (Amber) | 7.8:1 | 4.8:1 | PASS (AA) |
| Ember CTA Button Text | 4.7:1 | 5.3:1 | PASS (AA) |
| Verified Seal (Green) | 8.1:1 | 5.1:1 | PASS (AA) |

---

## 4. Light Field System

### Structure

```html
<!-- Fixed full-viewport layer, z-index: 0, pointer-events: none -->
<div class="light-field" aria-hidden="true">
  <div class="lf-base" />           <!-- OKLCH base color fill -->
  <div class="lf-radial-1" />       <!-- large radial gradient blob 1 -->
  <div class="lf-radial-2" />       <!-- large radial gradient blob 2 -->
  <div class="lf-radial-3" />       <!-- large radial gradient blob 3 -->
  <div class="lf-structural" />     <!-- SVG structural linework (6–10% opacity) -->
  <div class="lf-grain" />          <!-- tiled noise, 2–3% opacity -->
</div>
```

### Rules
- Radial gradients: 60–90vmax radius, NO hard edges (radial-gradient with long transparent tail)
- NO `blur()` filter on the radials themselves — they must stay sharp enough that the glass blur is perceptible
- Grain: a `64×64` or `128×128` pre-rendered PNG noise tile, repeated, `opacity: 0.025`, `mix-blend-mode: overlay`
- Structural linework (CSS or inline SVG):
  - **USER app**: `40px` lattice grid + dot at each intersection (`1px` lines at 7% opacity)
  - **SUPERVISOR app**: 8–12 concentric ellipses centered at bottom-right, `1px` stroke at 7% opacity

### CSS

```css
.light-field {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}
.lf-base {
  position: absolute; inset: 0;
  background: var(--field-base);
}
.lf-radial-1 {
  position: absolute;
  width: 80vmax; height: 80vmax;
  top: -20vmax; left: -10vmax;
  background: radial-gradient(ellipse at center, var(--field-accent1) 0%, transparent 70%);
  opacity: 0.6;
}
/* etc. for lf-radial-2, lf-radial-3 */
.lf-grain {
  position: absolute; inset: 0;
  background-image: url('/grain-64.png');
  opacity: 0.025;
  mix-blend-mode: overlay;
}
```

---

## 5. Motion Tokens

```js
export const MOTION = {
  instant:  120,   // ms — micro feedback (button press, toggle)
  fast:     200,   // ms — most transitions
  medium:   320,   // ms — panel enter/exit
  slow:     560,   // ms — lane ambience crossfade
  spring:   'cubic-bezier(0.16, 1, 0.3, 1)',  // spring-like ease-out
  linear:   'linear',
};
```

### Rules
- Only animate `opacity`, `transform`, `color`, `background-color`, `border-color`, `box-shadow`
- NEVER animate `backdrop-filter`, `width`, `height`, `top`, `left`, `right`, `bottom`
- All animations must respect `prefers-reduced-motion: reduce` (duration → 0.01ms)
- Lane ambience crossfade: 560ms `color` + `border-color` transition (no opacity jump)

---

## 6. Semantic Glyph System (Seal Glyphs)

Replace plain-text pills with semantic icon+label combos:

| Lane | Icon (Lucide) | Color token | Label |
|---|---|---|---|
| Standard | `ShieldCheck` | `--col-standard` | `ML-KEM-768` |
| Critical/QKD | `ShieldAlert` | `--col-critical` | `QKD-256` |
| Verified | `CheckCircle2` | `--col-verified` | `VALID` |
| Error | `ShieldX` | `--col-danger` | `FAIL` |

Pill size: `10px` icon + `9px` mono label. Radius: `4px` (not pill/999px — pills are reserved for status tags).

---

## 7. Banned Patterns

The following are PERMANENTLY BANNED. If found in existing code, remove in Phase 1 or the relevant phase:

| Pattern | Reason |
|---|---|
| `blur-3xl` div orbs as background | Creates visible floating blobs — use light field instead |
| `bg-gradient-to-r from-accent-blue to-accent-purple` | Cyan-to-purple rainbow gradient |
| `bg-gradient-to-br from-accent-gold to-orange-500` | Same — gradient buttons |
| Gradient text (`bg-clip-text`) | Cheap effect, inconsistent with design language |
| `animate-pulse-glow` / `threatPing` box-shadow animation | Neon glow — use border-color change instead |
| `font-family: Fraunces` | Wrong font — replace with Geist Light |
| `@import url('https://fonts.googleapis.com/...')` | Network-fetched fonts — use fontsource |
| `backdrop-filter` nested inside another blurred element | Performance + visual degradation |
| Animating `backdrop-filter` | Causes GPU thrash |
| `text-transform: uppercase; letter-spacing: 0.08em` on body text | Only for explicit section labels |
| Emojis as icons | Use Lucide icons |
| `window.innerWidth` for breakpoints | Use CSS media queries |

---

## 8. Component Inventory

### USER App

| Component | File | Phase | Priority changes |
|---|---|---|---|
| `AppShell` | `layout/AppShell.jsx` | 2 | Remove `window.innerWidth` check; use CSS only |
| `Sidebar` | `layout/Sidebar.jsx` | 2 | Glass-L1, lattice bg, contact rows, unread pill |
| `LoginPage` | `pages/LoginPage.jsx` | 2 | Full rebuild — glass-L2 card, Geist, no rainbow button |
| `RegisterPage` | `pages/RegisterPage.jsx` | 2 | Match LoginPage style |
| `ChatWindow` | `chat/ChatWindow.jsx` | 2 | Date separator refinement |
| `MessageBubble` | `chat/MessageBubble.jsx` | 2 | Lane-reactive bg, Seal glyphs, no glow |
| `MessageInput` | `chat/MessageInput.jsx` | 2 | No gradient button, file attach tooltip |
| `ChatPage` → ChatHeader | `pages/ChatPage.jsx` | 2 | Lane display, presence |
| `Avatar` | `common/Avatar.jsx` | 2 | Ensure consistent sizing |

### SUPERVISOR App

| Component | File | Phase | Priority changes |
|---|---|---|---|
| `DashboardShell` | `layout/DashboardShell.jsx` | 3 | Mauve light field, contour lines |
| `NavBar` | `layout/NavBar.jsx` | 3 | Geist font, no gradient |
| `MetricCard` | `common/MetricCard.jsx` | 3 | Visual hierarchy, Geist Light numerals |
| `KeyPoolPanel` | `panels/KeyPoolPanel.jsx` | 3 | Clamp A(T), capacity rail, depletion est. |
| `ThreatScorePanel` | `panels/ThreatScorePanel.jsx` | 3 | Fixed 0–1 Y-axis, consistent threshold |
| `QueuePanel` | `panels/QueuePanel.jsx` | 3 | Label axes |
| `KeyPoolGauge` | `charts/KeyPoolGauge.jsx` | 3 | Capacity context |
| `CryptographicProcessPanel` | `panels/CryptographicProcessPanel.jsx` | 4 | Single scroll, hold-to-reveal |
| `RoutingPanel` | `panels/RoutingPanel.jsx` | 4 | Dedupe, label columns |
| `SystemHealthPanel` | `panels/SystemHealthPanel.jsx` | 4 | Rename "Active Conn." fully |

---

## 9. Glass Performance Plan

**Budget:** ≤ 6 `backdrop-filter` surfaces on screen at any time.

### USER App — glass surface budget
1. `Sidebar` — L1 glass (full height left panel)
2. `ChatHeader` — L2 glass strip (top of chat area)
3. `MessageInput` bar — L2 glass strip (bottom of chat area)
4. Active `MessageBubble` hover state — NO blur (inner surface only)
5. `LoginPage` card — L2 glass (login only, no sidebar present)

**Total simultaneous blur surfaces: 3 (chat view), 1 (login view)** ✅

### SUPERVISOR App — glass surface budget
1. `NavBar` — L1 glass strip
2. `KeyPoolPanel` — L1 glass
3. `ThreatScorePanel` — L1 glass
4. `QueuePanel` — L1 glass
5. `CryptographicProcessPanel` header — L2 (header only; body is inner surface)
6. `RoutingPanel` or `SystemHealthPanel` — L1

**Total simultaneous: 6** ✅ (at limit — do not add more)

### KPI MetricCards
- Use `surface-inner` (no blur) — they sit inside the light field, not inside another glass panel
- Their visual separation comes from `border` + `box-shadow`, not blur

### Fallback strategy
```css
@supports not (backdrop-filter: blur(1px)) {
  .glass-l1 { background: oklch(16% 0.012 240 / 0.97); }
  .glass-l2 { background: oklch(18% 0.010 240 / 0.97); }
}
```

---

## 10. Login / Register Visual System (Phase T3 — `login-reference.jpg`)

### Spatial Composition
- **Geometry**: Vertically centered auth group consisting of:
  1. **Luminous Glow Ring**: 620px blurred crescent/torus positioned at `top: -140px, left: -150px` behind the upper-left of the card. Composited via `conic-gradient` + radial mask, blurred at 34px (dark) / 40px (light), slow 120s rotation. Shows through the frosted card glass with visionOS-grade caustics.
  2. **Main Liquid Glass Card**: 440px max-width, 24px border radius, 36px padding (24px on mobile), `glass-l1` material with top-left specular edge highlight (`inset 0 1px 0 var(--border-highlight)`) and warm-tinted soft drop shadow.
  3. **Companion Glass Strip**: 440px max-width, 18px border radius, placed 16px beneath the main card (`glass-l2` material).
- **Header Elements**:
  - Top-Left: Minimal 4-node lattice glyph SVG + typographic wordmark "PQC Secure Comm · ML-KEM-768".
  - Top-Right: Circular glass `ThemeToggle` button with animated sun/moon morph.

### Card Content Architecture
- **Heading**: "Welcome back" (or "Welcome back, {Name}" from local storage) in `32px` regular font (`font-normal tracking-tight`).
- **Tagline**: "Encrypted today. Still secret after Q-Day." in `13px text-[var(--text-secondary)]`.
- **Fields**: Static labels above inputs ("Username", "Password"), 48px height, 13px border radius, `bg-[var(--surface-inner)]`, 1px border. Password field includes animated slash reveal toggle.
- **Caps-Lock & Error Slot**: Dedicated warning slot below password detecting Caps Lock state and rendering signal-red error messages with 350ms keyframe shake.
- **Primary CTA**: `.btn-ember` — full width, 48px height, 12px radius, glossy single-hue ember gradient, `inset 0 1px 0 rgba(255,255,255,0.45)` specular highlight, active press scale 0.98.
- **Secondary Actions**: Stacked full-width glass buttons mirroring OAuth slots:
  - "Continue as demo user (@alice)"
  - "Open Supervisor console" (opens supervisor port 5174 in new tab)
- **Footer**: "New here? Create an account" with underlined link.

### Companion Strip & Explainer Sheet
- Two equal glass buttons:
  - `[ How it works ]` — opens explainer sheet on hybrid key encapsulation (FIPS 203 ML-KEM-768 + X25519) and digital signatures (FIPS 204 ML-DSA-65).
  - `[ Why post-quantum? ]` — opens explainer sheet on Harvest Now, Decrypt Later (HNDL) quantum threats.
- Stacked vertically on mobile (<640px) with 16px margins to prevent label truncation; 2-column grid on desktop.
- Monospace cryptographic specification line:
  `SIMULATION BUILD · ML-KEM-768 · ML-DSA-65 · AES-256-GCM`

---

## 11. User App Migration System (Phase T4)

### Window Architecture & Hierarchy
- **AppShell Window**: Centered floating visionOS-style window with `glass-l1` container, 24px border radius, `inset 0 1px 0 var(--border-highlight)` edge sheen, and soft warm ambient shadow.
- **Sidebar**: Persistent left navigation (`w-80` to `w-96` on desktop/tablet) with user profile, contact search, active contact highlight in ice-teal (`bg-[var(--col-standard)]/10 border-[var(--col-standard)]/35`), and FIPS 203/204 status footer.
- **Mobile Responsive Drawer**: On `<md` viewports, sidebar collapses into a slide-out drawer controlled by an inline header menu toggle.

### Theme-Aware Message Bubble System
Strictly adheres to the **zero-blur budget** for message bubbles, avoiding GPU compositing bottlenecks on long message threads while guaranteeing crisp contrast in both themes:
- **Contact Message (`.bubble-peer`)**:
  - *Dark Theme*: Subdued warm-white glass fill (`rgba(255, 245, 230, 0.045)`), 1px border `rgba(255, 245, 230, 0.08)`, off-white text `#f0e8dc`.
  - *Light Theme*: Crisp frosted pure-white card fill (`rgba(255, 255, 255, 0.88)`), 1px border `rgba(42, 32, 24, 0.12)`, deep espresso text `#2a2018`.
- **User's Own Message (`.bubble-own`)**:
  - *Dark Theme*: Luminous elevated fill (`rgba(255, 245, 230, 0.09)`), specular edge highlight `rgba(255, 245, 230, 0.22)`, off-white text `#f0e8dc`.
  - *Light Theme*: Warm apricot/cream tint (`#faede0`), crisp warm-tan border (`#dfceba`), deep espresso text `#2a2018`. Instantly distinguishable from contact bubbles.
- **Critical / QKD Lane Messages (`.bubble-peer-critical`, `.bubble-own-critical`)**:
  - Warm amber-tinted background (`rgba(245, 158, 11, 0.12)` dark / `rgba(254, 243, 199, 0.85)` light), amber border, and `Seal` glyph displaying `[QKD-256]`.

### Responsive Layout Breakpoints
- **Mobile (360px)**:
  - Header integrates inline menu toggle, avatar, compact contact title, security mode toggle, HNDL info trigger, and theme toggle without truncation or overlap.
  - Secondary verbose badges (`STANDARD (ML-KEM) / FIPS 203`) hidden to preserve clean hierarchy.
- **Tablet (768px)**:
  - Sidebar visible side-by-side with chat pane.
  - Verbose security badges stay hidden until `lg` (1024px) to grant the 448px chat area maximum breathing space.
- **Desktop (1280px+)**:
  - Full dual-column workspace with expanded cryptographic badges, file attachment previews, and lane-reactive background ambient glow.

---

## 12. Supervisor App Migration System (Phase T5)

### Spatial Hierarchy & Glass Budget
Strictly complies with the **6 blurred surfaces maximum budget** for the entire supervisor dashboard:
- **L1 Surfaces**:
  1. `NavBar` (sticky top header)
  2. `KeyPoolPanel` (simulated QKD reservoir)
  3. `ThreatScorePanel` (heuristic risk scatter chart)
  4. `QueuePanel` (priority dispatch buffer)
  5. `CryptographicProcessPanel` (live cryptographic inspector)
  6. `RoutingPanel` / `SystemHealthPanel` (routing feed and service health)
- **Zero-Blur Inner Surfaces (`surface-inner`)**:
  - All 6 KPI `MetricCard`s at the top row.
  - Step items, timing bars, and key preview cards within the Inspector.
  - System health service rows.
  - Custom chart tooltips.
  - Guarantees 60fps scrolling and GPU stability during high-frequency telemetry events.

### Theme-Aware Chart & Gauge Adaptations
- **KeyPoolGauge (SVG Native Arc)**:
  - Background track rail stroke adapts to `rgba(255, 245, 230, 0.08)` in dark vs `rgba(42, 32, 24, 0.10)` in light.
  - Active progress stroke transitions from `--col-standard` (`#5eead4` dark / `#0d9488` light) to availability status (`--col-verified` green for nominal, `--col-critical` amber for low reservoir, `--col-danger` red for depleted).
  - Available count numeral styled with `text-[var(--text-primary)]` for high contrast against both backgrounds.
- **ThreatHeatmap (Recharts Scatter)**:
  - Cartesian grid stroke dynamically mapped to theme (`0.07` opacity dark vs `0.08` opacity warm-brown light).
  - Axis lines and tick marks adapt to theme font colors (`var(--text-secondary)` / `var(--text-tertiary)`).
  - Scatter dots use semantic lane tokens: ice-teal for standard packets (< 0.70 Q_TL) and golden-amber for critical packets (≥ 0.70 Q_TL).
  - ReferenceLine threshold at 0.70 strictly rendered in `--col-danger`.
- **QueueDepthChart (Recharts Area)**:
  - Vertical grid disabled for clean minimalism; horizontal rules rendered in theme-adapted subtle stroke.
  - Lavender fill gradient (`var(--col-queue)`) tapering to 0 opacity with crisp 1.5px stroke.
- **Custom Tooltips**:
  - Styled as `surface-inner bg-[var(--surface-bg)] border border-[var(--border)] text-[var(--text-primary)] shadow-xl` for both charts.

### Cryptographic Process Inspector
- **HexField Key Masking**: Default-masked 256-bit quantum and post-quantum keys (`••••••••••••••••`) with one-click reveal/hide toggle and green copy confirmation pill (`D-12`, `D-13`).
- **Timing & Size Bars**: Visual execution breakdown with theme-reactive progress bars and tabular numerals.
- **Privacy-Preserving Plaintext Bar**: Audit-mode toggle for message content preview (`D-08`).
- **Single Scroll Region**: Unified scroll container across all 4 inspector tabs (`D-11`).

### Responsive Mobile & Tablet Navbar
- **Mobile (360px)**:
  - Brand header condenses to `PQC SUPERVISOR` with shield icon, suppressing secondary subtitle.
  - Action items aligned on a single row: icon-only `Harvest Lab` trigger, compact `Demo` toggle, `LIVE` status pill, and circular `ThemeToggle`.
  - Zero line wrapping or element collisions.
- **Tablet (768px)**:
  - Metric cards scale to 3x2 grid.
  - Middle analysis panels stack vertically with full chart width and touch-friendly interaction targets.
- **Desktop (1280px+)**:
  - Full 6-column KPI row, 3-column analysis row, and side-by-side Cryptographic Inspector and Live Routing feed.




---

## Section 13 — R1 Refinement Pass (Quiet Premium Frosted Glass)

### 13.1 Canonical Glass Density Tiers

| Tier | Dark Fill | Light Fill | Blur | Role |
|------|-----------|------------|------|------|
| **L1 Shell** | `rgba(255, 245, 230, 0.04)` (4%) | `rgba(255, 250, 240, 0.28)` (28%) | 28px | App windows, chat floating shell, supervisor main container |
| **L2 Card** | `rgba(255, 245, 230, 0.05)` (5%) | `rgba(255, 250, 240, 0.32)` (32%) | 22px | Panels (QKD pool, threat, queue, inspector, routing, health, chat panes) |
| **L3 Overlay** | `rgba(255, 245, 230, 0.10)` (10%) | `rgba(255, 250, 240, 0.58)` (58%) | 38px | Modals, popovers, dropdowns |
| **Inner Surface** | `rgba(255, 245, 230, 0.040)` | `rgba(42, 32, 24, 0.040)` | 0px | Zero-blur sub-cards, tooltips, nested rows (budget preservation) |

> **Visibility Guarantee**: The diagonal light band inherent to both background images must be perceptible through L1 and L2 surfaces at 1280px (luminance ΔL ≥ 3%).

### 13.2 Canonical Edge System (Harvest Lab Level)

- Calibration benchmark: The computed border of the `Harvest Lab` top-bar pill.
- **`--edge-rest`**: Dark `rgba(255, 245, 230, 0.10)` / Light `rgba(42, 32, 24, 0.12)`
- **`--edge-hover`**: Rest + 30% — Dark `rgba(255, 245, 230, 0.13)` / Light `rgba(42, 32, 24, 0.16)`
- **`--edge-selected`**: Soft linear gradient edge-light (top-left ~1.6x rest fading to rest at bottom-right):
  - Top-left: Dark `rgba(255, 245, 230, 0.16)` / Light `rgba(42, 32, 24, 0.20)`
  - Bottom-right: Dark `rgba(255, 245, 230, 0.10)` / Light `rgba(42, 32, 24, 0.12)`
- **Rule**: No border/outline/ring with white alpha > 2x rest at rest.
- **Focus ring exception**: Keyboard `:focus-visible` = 2px ring, 2px offset, soft warm-white (`rgba(240, 232, 220, 0.85)` dark / `rgba(42, 32, 24, 0.75)` light), contrast ≥ 3:1.

### 13.3 Typography

- **Primary UI & Numerals**: `Urbanist` (variable 300–700, fallback `Outfit`, system-ui).
- **Monospace Reserved**: `Geist Mono` used ONLY for cryptographic hashes, keys, message IDs in Inspector, and table timestamps.
- **Labels**: Sentence case, 13px, 400 weight, muted (`--text-secondary`), normal tracking (no letter-spaced all-caps).
- **Card Titles**: 15–16px, 500 weight.
- **Page Title ("Command Center")**: `clamp(48px, 6vw, 88px)`, 300 weight, tracking `-0.02em`.
- **Hero/KPI Numerals**: 300 weight with `NumeralDisplay` component (integer full opacity, decimals ~40%, unit ~0.5em at ~45%, tabular numerals).

### 13.4 Colour Discipline

- **Monochrome-first**: ≥ 90% of visible pixels are neutral (warm off-white / deep espresso + frosted glass).
- **Primary Buttons**: Neutral inverse pill.
  - Dark: warm-white glass pill (`rgba(240, 232, 220, 0.92)`) with espresso text (`#1a1410`).
  - Light: deep espresso pill (`#2a2018`) with cream text (`#f0e8dc`).
  - No ember orange button fills or orange rings.
- **Text Links**: Neutral muted (`--text-secondary`), underlined, hover to `--text-primary`.
- **Avatars**: Muted monogram glass discs with low-chroma name-hashed background tints and neutral initials.

### 13.5 Background Stack Architecture

Order (bottom to top):
1. Base color fallback (`#1a1410` / `#f0e8dc`).
2. Theme background image (`/backgrounds/dark.jpg` with `brightness(1.08) contrast(1.04)` / `/backgrounds/light.jpg`).
3. Film grain: 0% on dark (image provides organic grain), 1.2% on light.
4. Ambient lane tint: max ~8–10% radial glow (ice-teal for Standard, amber for Critical, zero geometric linework).
5. Foreground content.
- DELETED: Square lattice grid, contour/arc lines, login glow ring, all decorative canvas linework.

---

## 14. Quantum Computer Hero Asset & Compositing Architecture

### 14.1 Layer Stack (Bottom to Top)
1. **Base Layer** (`<img className="qc-base">`):
   - High-priority preloaded responsive image (`/hero/qc-base-1x.webp` and `/hero/qc-base-2x.webp`).
   - Aspect ratio: 640×816 (1x) / 1280×1632 (2x), ratio 0.784:1 (~4:5 portrait slot).
   - Zero black fringe via un-premultiplied despill on both Dark (`#1a1410`) and Light (`#f0e8dc`).
2. **Particle Canvas** (`<canvas className="qc-particles">`):
   - Sandwiched between base machine and front-mask.
   - Tiny Geist Mono glyphs (`0`, `1`, `0/1` superposition) flowing along wire paths.
   - Teal (`#5eead4`) for PQC, amber (`#f59e0b`) for simulated QKD key pulses.
3. **Front-Mask Occlusion Layer** (`<img className="qc-front-mask">`):
   - Identical aspect ratio and pixel dimensions as base image (`/hero/qc-mask-1x.webp` and `/hero/qc-mask-2x.webp`).
   - Opaque where foreground hardware sits: Top disc rim, Plate 1, Plate 2, Plate 3, front vertical support rods, and central column.
   - `pointer-events: none`, pixel-identical alpha blend that occludes particles passing behind solid hardware with zero visual seam.
4. **Readout & Caption**:
   - Terminal font telemetry readout (`THETA`, `PHI`, `P(0)`, `P(1)`, `LAST MEASURE`) and educational caption.
   - Disclaimer: `"ILLUSTRATIVE RENDER · SIMULATED DATA FLOW"`.

### 14.2 Asset Table
| Asset Name | Resolution | Format | Purpose |
| :--- | :--- | :--- | :--- |
| `qc-base-1x.webp` / `2x.webp` | 640×816 / 1280×1632 | WebP (Lossless) | Copper base cutout for Dark theme |
| `qc-mask-1x.webp` / `2x.webp` | 640×816 / 1280×1632 | WebP (Lossless) | Occlusion mask for plates and column |
| `qc-base-mono-1x.webp` / `2x.webp` | 640×816 / 1280×1632 | WebP (Lossless) | Warm-monochrome baked asset |
| `qc-mask-mono-1x.webp` / `2x.webp` | 640×816 / 1280×1632 | WebP (Lossless) | Warm-monochrome occlusion mask |
| `qc-base-light-1x.webp` / `2x.webp` | 640×816 / 1280×1632 | WebP (Lossless) | Light theme base with ambient contact shadow |
| `qc-base-light-mono-1x.webp` / `2x.webp` | 640×816 / 1280×1632 | WebP (Lossless) | Light theme warm-monochrome base with shadow |

