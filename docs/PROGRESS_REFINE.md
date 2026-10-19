# PQC Secure Comm — Refinement Pass Progress

> Target: Move from "colourful dashboard" to "quiet, premium, frosted glass" matching Reference A (visionOS chat) and Reference B (frosted supervisor dashboard).
> Run protocol: ONE phase per run. Tick + 3-line summary before stopping.

---

## ✅ R1 — Global Tokens (Background, Glass Density, Edges, Typography, Colour)

- **Linework & Rings Deleted**: Completely eliminated lattice grid, supervisor contour lines, login orange glow ring, and canvas linework from both themes; background diagonal light band now clearly visible through L1/L2 glass (ΔL ≥ 3% verified).
- **Glass Density & Edges**: Lowered fills to quiet premium frosted glass (L1 dark 4%/light 28%, L2 dark 5%/light 32%) and unified all borders to Harvest Lab canonical `--edge-rest` with 0 edge violations across all routes.
- **Typography & Monochrome Palette**: Switched entire UI typography to Urbanist with sentence-case labels, established neutral inverse primary button with 0.0%–4.1% saturated pixels (well below the 8% target), and verified Chrome autofill glass overrides.

---

## ✅ R2 — Login / Register / 404 / Loading

- **Card Sheen & Blur Reduced**: Scaled card drop shadow, blur (20px), and top specular highlight down by 25–30%, eliminating glossy flare while preserving quiet visionOS glass depth.
- **Form Controls & Inputs**: Removed blue focus outlines and applied `--edge-rest` with calm focus states; verified Chrome autofill background override preserving the frosted glass interior.
- **Display Name & Routes**: Display heading dynamically formats and capitalizes usernames ("Welcome back, Charlie"), secondary actions use quiet rest-edge glass buttons, and dedicated frosted 404 & loading states match system styling.

---

## ✅ R3 — Chat App (Reference A match)

- **Single Floating Window & Hierarchy**: Single L1 window with denser frosted contacts pane and lighter, subtler conversation pane allowing background light band to clearly read through; header and composer integrated inside the pane with edge-rest hairlines.
- **VisionOS Single-Shape Bubbles**: Custom continuous SVG vector path bubbles with seamless tails on last bubble of group (no translucent double-alpha seams); critical messages use quiet neutral tint (≤8%) without solid yellow fills; internal meta lines feature Urbanist 11px time, clickable seal glyph opening L3 Message Seal popover, and delivery receipts.
- **Controls & Typography**: Segmented lane control (Standard / Critical) with 3 circular glass action buttons, theme toggle moved beside logout in sidebar header, selected contact styled in liquid-glass `--edge-selected` fill, date separators simplified to plain small centered text, and composer refined to floating pill with softened active-lane "Send" pill button.

---

## ✅ R4 — Supervisor Overview (Reference B match)

- **Reference B Architecture & Hero**: Rebuilt supervisor layout into Reference B hierarchy with weight 300 "Command Center" hero title, subtitle, action pills, and completely eliminated the old 6-KPI strip.
- **Two-Column Grid & 240° Arc Gauges**: Built left column Threat Feed + System Health and right column visual center featuring three 240° thin arc gauges (QKD Pool, Lane Ratio, Delivery Integrity) with centered `NumeralDisplay` (weight 300, styled decimals/units).
- **Spline Charts & Top Bar**: Implemented smooth spline Threat Score Timeline (orange 0.70 threshold, critical dot markers) and Buffer Latency charts, unified 24h clock, and top bar tab capsule with 0 edge violations and 0.1% saturation.

---

## ✅ R5 — Supervisor Lower Areas + Inspector

- **Live Routing Feed & Deduplication**: Rebuilt feed with sender monogram avatars, small lane seal glyphs (Standard/Critical), quiet threat pips (amber only when $Q_{\text{TL}} \ge 0.70$), sentence-case headers, and automatic packet deduplication.
- **Cryptographic Process Inspector**: Implemented collapsible lower deck with dedicated tabs (`Encrypt (ML-KEM-768)`, `Decrypt`, `Verify (ML-DSA-65)`, `Key Vault`), strictly limiting monospace to hex/keys/IDs while converting all labels to sentence-case Urbanist.
- **Harvest Lab & Empty States**: Redesigned Harvest Lab into quiet L3 frosted glass modal with `--edge-rest` borders; established quiet glass elegance across all empty states with 0 edge violations and 0.0%–0.3% saturated pixels.

---

## ✅ R6 — Global Sweep + Audit Scripts

- **Full Automated Sweep Across All Routes**: Crawled Login, Register, Chat, and Supervisor Command Center in both themes; verified 0 edge violations (`audit-edges.cjs`), 0.0%–0.2% saturated pixels (`audit-colour.cjs`), and 100% WCAG 2.2 AA contrast compliance (`audit-contrast.cjs`).
- **Interactive Verification**: Verified modal openings, tab switching, collapsible inspector transitions, responsive viewports (360px, 768px, 1280px), and theme cross-fades with zero layout jitter.

---

## ✅ R7 — Interactive Functional Controls, Dedicated Panels & QKD Hard Limit

- **Top Bar Tab Navigation**: Fully activated `Dashboard`, `Analytics`, `Infrastructure`, and `Harvest Lab` in `NavBar.jsx` and `DashboardShell.jsx`; built high-craft dedicated `AnalyticsPanel.jsx` (latency, signature verification, wire frame breakdown) and `InfrastructurePanel.jsx` (BB84 physical hub, hardware accelerators, clustered storage).
- **Hero & Card Interactive Controls**: Connected `All Lanes` (cycles All / Standard / Critical with live filtering in `RoutingPanel.jsx`), `Live (Real-time)` (toggles pause/freeze of live telemetry stream with visual indicator), and `Reload` (refetches snapshot with spin animation); built `PolicyOverrideModal.jsx` in `ThreatFeedCard.jsx` supporting Adaptive, Force Standard, and Force Critical routing with threat threshold tuning.
- **Curved Spline Wave & Light Theme Accent**: Converted Threat Score Timeline into a continuous natural spline wave (`type="natural"`) with ambient nominal baseline oscillation ($0.15 - 0.28$) and threshold gating; added subtle warm espresso diagonal accent band (`mixBlendMode: 'multiply'`) across light theme canvas mirroring dark theme diagonal light ray; enforced strict 25-key QKD pool cap in backend (`config.py`, `key_pool_service.py`), Redis, and frontend.
