# PQC Secure Comm — Theme Pass Progress

> RUN PROTOCOL: check this file first. Do the NEXT unchecked phase only. STOP after each phase.
> Once updated DESIGN_SYSTEM.md exists, never use colors, blur values or backgrounds outside it.

## Phases

- [x] **T1**: BACKGROUND + THEME SYSTEM ✅ 2026-11-19
  - Deployed shared theme-kit (ThemeProvider, useTheme, ThemeToggle, BackgroundStack) mounted once at app root with no-flash pre-paint init script.
  - Replaced procedural canvas with dual-theme image stack: "Ember Dusk" (dark.jpg) and "Cream Dawn" (light.jpg) with tiled grain and 1.2s lane-reactive ambient tint.
  - Established warm-neutral OKLCH palette, ember brand accent token, dual-theme semantic lane tokens, and verified 360/768/1280px views across both apps.
- [x] **T2**: LIQUID GLASS v2 + STYLEGUIDE ✅ 2026-11-19
  - Retuned glass tiers L1–L3 with specular edge highlights, warm-tinted soft shadows, and strict zero-blur Surface Inner budget.
  - Implemented interactive states: glossy ember CTA button, glass button with specular sheen shift, and accessible 0.985 press scaling.
  - Built dev-only `/__styleguide` route on both apps with live WCAG 2.2 AA contrast matrix verifying >=4.5:1 text compliance.
- [x] **T3**: LOGIN/REGISTER REBUILD ✅ 2026-11-19
  - Rebuilt Login & Register from `login-reference.jpg` with 620px blurred crescent warm glow ring refracting through 24px-radius Liquid Glass v2 cards.
  - Implemented glossy single-hue ember CTA button (`.btn-ember`), stacked secondary demo/supervisor buttons, and responsive companion glass strip with HNDL/PQC explainer modal.
  - Captured and validated 10 screenshots at 360/768/1280px in both themes with zero clipping, stacked mobile controls, and WCAG AA contrast compliance.
- [x] **T4**: USER APP MIGRATION ✅ 2026-11-19
  - Migrated entire User App (AppShell, Sidebar, ChatHeader, ChatWindow, MessageInput, SecurityBanner, Tooltips) to Liquid Glass v2 and warm-neutral dual theme system.
  - Implemented zero-blur theme-aware message bubble system with clear distinction between contact (pure frosted white card) and own messages (warm apricot/cream tint) in light theme.
  - Captured and validated responsive screenshots at 360/768/1280px in both themes (including active QKD lane state) with zero text clipping or collision.
- [x] **T5**: SUPERVISOR APP MIGRATION ✅ 2026-11-19
  - Migrated entire Supervisor dashboard (DashboardShell, NavBar, 6 MetricCards, KeyPoolGauge, ThreatHeatmap, QueueDepthChart, CryptographicProcessPanel, RoutingPanel, SystemHealthPanel, HarvestLabPanel) to Liquid Glass v2.
  - Adapted SVG arc gauge and Recharts elements (Cartesian grids, axes, reference lines, custom tooltips) to be dynamically theme-reactive for Ember Dusk and Cream Dawn backgrounds.
  - Captured and validated 10 screenshots at 360/768/1280px in both themes (including live traffic states and scrolled inspector views) with zero clipping or text collisions.
- [x] **T6**: GLOBAL SWEEP + QA ✅ 2026-11-19
  - Enforced zero raw color leaks via `lint_theme.cjs` scanning 73 source files across both apps with 100% token adherence.
  - Executed automated Puppeteer QA suite (`audit_qa.cjs`) verifying <=6 blurred glass surfaces, WCAG 2.2 AA contrast matrix, reduced-motion behavior, and mobile touch targets.
  - Captured definitive 18-screenshot test suite across 360/768/1280px in both themes and authored the 60-second panel demo script (`docs/DEMO_SCRIPT.md`).
