# PQC Secure Comm — UI Redesign Progress

> RUN PROTOCOL: check this file first. Do the NEXT unchecked phase only. STOP after each phase.
> Once DESIGN_SYSTEM.md exists, never invent colors, fonts, blur values or styles outside it.

## Phases

- [x] **PHASE 0**: AUDIT — Component tree, defect catalog, design system proposal, glass performance plan ✅ 2026-11-19
  - Audited both frontends (React 18, Vite 6, Tailwind 3.4, Recharts 2.15, Lucide React)
  - Catalogued 26 defects (design, data, UX); identified root causes and phase assignments
  - Proposed full OKLCH design system, glass recipe, light field, motion tokens; authored BACKEND_ISSUES.md
- [x] **PHASE 1**: DESIGN SYSTEM + MATERIAL + PRIMITIVES ✅ 2026-11-19
  - Installed self-hosted Geist & Geist Mono fonts in both frontends, eliminating Google Fonts CDN dependencies.
  - Rewrote Tailwind configs, index.css, and design tokens with OKLCH palette, real 4-tier backdrop-filter glass, and fluid type clamp scale.
  - Created LightField (Slate Dusk lattice & Mauve Dusk contour lines) and GlassLayer primitives; verified Docker builds & responsive views.
- [x] **PHASE 2**: USER APP (Login + Chat shell) ✅ 2026-11-19
  - Rebuilt LoginPage and RegisterPage with frosted L2 card, Geist Light typography, floating label inputs, password reveal toggle, shake-on-error, and HNDL quantum educational callout (no rainbow gradients).
  - Rebuilt AppShell & Sidebar into a floating visionOS-style window inset over the Slate Dusk lattice field, with pure CSS responsive sidebar drawer, active contact highlighting, and unread badges.
  - Rebuilt ChatHeader, ChatWindow, and MessageBubble with lane-reactive border/surface ambience, semantic Seal glyphs (ML-KEM-768 / QKD-256), clean read receipts, and single-color send button; verified zero clipping at 360/768/1280px.
- [x] **PHASE 3**: SUPERVISOR OVERVIEW (Reference B) ✅ 2026-11-19
  - Rebuilt NavBar, 6 KPI cards with Geist Light numerals (Reference B style), and eliminated neon glow boxes and banned blur blobs.
  - Rebuilt KeyPoolPanel with responsive SVG arc gauge, clamped A(T) Avail. Ratio (D-01 fix), /min unit (D-09 fix), capacity rail (D-15 fix), and honest [SIMULATED] badge.
  - Rebuilt ThreatScorePanel (fixed [0, 1.0] domain, 0.70 threshold line, Threat Level naming) and QueuePanel with lavender gradient chart; verified responsive 360/768/1280px views.
- [x] **PHASE 4**: INSPECTOR + ROUTING FEED ✅ 2026-11-19
  - Rebuilt Cryptographic Process Inspector: eliminated nested scrollbars with single scroll region (D-11 fix), masked plaintext with audit toggle (D-08 fix), and masked key vault with copy feedback (D-12, D-13 fixes).
  - Rebuilt Live Routing Feed: deduplicated repeated ring-buffer events (D-03 fix), added clear column headers (D-07 fix), and normalized local fractional timestamps (D-04 fix).
  - Updated System Health with "Active Connections" (D-14 fix) and verified responsive views at 360/768/1280px.
- [x] **PHASE 5**: HARVEST LAB + DEMO MODE ✅ 2026-11-19
  - Added Harvest Lab HNDL explainer (comprehensive supervisor reference modal + user chat header tooltip) with honest [SIMULATED] disclosure.
  - Implemented interactive Demo Mode button in supervisor NavBar: triggers real WebSocket chat messages with escalating threat scores (0.18 -> 0.79 -> 0.18).
  - Built lane-reactive ambient LightField: smoothly eases from Mauve Dusk to warm amber across base and radial fields over 1.2s when Critical lane engages.
- [x] **PHASE 6**: RESPONSIVE + PERFORMANCE + QUALITY PASS ✅ 2026-11-19
  - Eliminated nested backdrop-filter violations in chart tooltips, strictly enforcing the 6-surface glass budget.
  - Hardened accessibility with WCAG-compliant prefers-reduced-motion rules (animation-iteration-count: 1, scroll-behavior: auto).
  - Verified cross-breakpoint responsiveness (360px mobile, 768px tablet, 1280px desktop) with zero clipping, overflow, or font degradation.
