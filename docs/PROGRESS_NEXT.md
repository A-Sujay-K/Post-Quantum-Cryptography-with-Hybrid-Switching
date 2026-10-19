# PQC Secure Comm — Next Features Pass Progress (Phases N0–N6)

> Target: Deliver the three core next-generation features with Awwwards-level craft and meticulous engineering:
> 1. New HOME page modeled on `yannickgregoire.nl` (terminal-typographic structure, dot-matrix display headings, real-time shaded ASCII Bloch sphere qubit hero with mouse tracking/collapse, 3 staggered scramble info lines, justified 3-column text block, fixed 4-column keycap shortcut bar, invert theme toggle, 5 snap pages: Home, Awareness, Solution, Lanes, Access).
> 2. Profile-image upload (avatar) during registration and in-chat profile sheet (square crop, circular mask, zoom slider, WebP 512x512, EXIF stripped).
> 3. Manual contact list: eliminate global directory listing, add users by debounced search, gate non-contact threads with liquid-glass security banner, disable composer until added, and backfill demo users as mutual contacts.
>
> Run protocol: ONE phase per run. List touched files before editing. Tick + 3-line summary before stopping. N0 ends with a STOP for user approval.

---

## 📋 Master Phase Index

- [x] **N0 — Architecture Audit, Technical Specification & Progress Plan**
- [x] **N1 — Home Page Scaffold, Dot-Matrix Typography & Scramble Engine**
- [x] **N2 — Real-time ASCII Qubit Bloch Sphere Hero & Interactive Collapse**
- [x] **N3 — 5 Snap Pages, Justified 3-Col Text Blocks, 4-Col Keycap Shortcut Bar & Invert Toggle**
- [x] **N4 — Profile Avatar Upload (Backend Pillow Pipeline + Frontend Crop/Mask)**
- [x] **N5 — Manual Contact List, Debounced Search & Non-Contact Security Gating**
- [x] **N6 — Multi-Viewport Audit, Dual-Theme Verification & End-to-End Polish**

---

## ✅ N0 — Architecture Audit, Technical Specification & Progress Plan

- **Comprehensive Technical Specification**: Completed complete architectural blueprints for Home Page (terminal-typographic structure, ASCII Bloch sphere, scramble engine, 5 snap pages), Avatar Upload (Pillow pipeline, magic byte verification, 512x512 WebP, static serving), and Manual Contact List (MongoDB collection, debounced search, WS gating, backfill).
- **Run Protocol & Safeguards**: Established strictly isolated phase execution boundaries N0–N6, preserving the core crypto pipeline (ML-KEM-768, ML-DSA-65, AES-256-GCM, simulated QKD, HKDF, threat scoring) untouched while ensuring zero hardcoded URLs via documented environment variables (`VITE_SUPERVISOR_URL`, `VITE_HOME_URL`, `VITE_CHAT_URL`).
- **Audit & Phase Plan**: Authored `docs/PROGRESS_NEXT.md` establishing explicit acceptance criteria, viewport benchmarks (360px, 768px, 1280px, 1920px), monochrome budget targets ($\le 8\%$ saturation), and stopping checkpoint for user approval.

---

## ✅ N1 — Home Page Scaffold, Dot-Matrix Typography & Scramble Engine

- **Route, Font & Layout Scaffolding**: Integrated Google Fonts `Doto` (dot-matrix display), `Geist Mono`, and `Urbanist` in `frontend-user/src/index.css`; mounted full-viewport snap-scrolling `HomePage.jsx` at `/`, routed `/login` logo back to `/`, and retired the old supervisor console button from the login card.
- **Terminal Scramble & Title Wipe Engines**: Built `ScrambleText.jsx` featuring per-character noise resolution (`▒░█▓/-+_`), stagger timing, hover triggers (`/ PQC` $\rightarrow$ `ML-KEM-768 + ML-DSA-65`, `/ QKD` $\rightarrow$ `256-BIT ONE-TIME KEYS . SIMULATED`), `prefers-reduced-motion` detection, and full ARIA accessibility; created `TitleWipe.jsx` running a 1.2s left-to-right noise wave across the giant dot-matrix heading.
- **5 Snap Viewports & Responsive Keycap Bar**: Established full-height scroll-snapped viewports (`#home`, `#awareness`, `#solution`, `#lanes`, `#access`) including the 3-column space-between justified text block layout and fixed 4-column shortcut bar (`^H`, `^A`, `^S`, `^L`, `^▲`, `^▼`, `^E`, `^I`); verified across 360px, 768px, 1280px, and 1920px viewports in both Dark and Light themes with zero regressions.

---

## ✅ N2 — Real-time ASCII Qubit Bloch Sphere Hero & Interactive Collapse

- **Real-time Shaded ASCII Bloch Sphere**: Built `QubitHero.jsx` on an HTML5 2D Canvas grid (~104×52 cells) with analytic Lambertian spherical shading from a top-left light vector, equator ring (`=`), prime meridian ring (`:`), polar labels (`|0>`, `|1>`), state vector path (`*`), and arrowhead glyphs (`▲`, `▼`, `◆`).
- **Interactive Measurement Collapse & Quantum Physics**: Integrated spring-damped pointer tracking and keyboard/click measurement collapse (key `M` / click), generating a dynamic burst of quantum static noise (`▒░█▓%#`), collapsing $P(0)$ or $P(1)$ to $1.00$ probabilistically, and automatically returning to superposition after 1.2s; accompanied by live telemetry ($\theta, \phi, P(0), P(1)$) and the verified Shor's algorithm caption.
- **Scroll Slice-Collapse Transition & A11y**: Connected dynamic slice-collapse where ASCII character rows slide horizontally with staggered sinusoidal offsets and compress vertically into thin lines upon scrolling toward Awareness; fully accessible with `aria-hidden` canvas, descriptive screen-reader live announcements, `prefers-reduced-motion` fallbacks, and multi-viewport verification across 360px, 768px, 1280px, and 1920px in both themes.
- `frontend-user/src/components/landing/QubitReadout.jsx` (new: live quantum telemetry readout)
- `frontend-user/src/components/landing/InfoLines.jsx` (new: 3 staggered scramble info lines)
- `frontend-user/src/pages/HomePage.jsx` (integrate hero and info lines into Home section)

---

## ✅ N3 — 5 Snap Pages, Justified 3-Col Text Blocks, 4-Col Keycap Shortcut Bar & Invert Toggle

- **5 Viewport-Snapped PQC Threat & Solution Sections**: Built all 5 full-height scroll-snapped pages with exact, hedged cryptography copy: (1) `HOME` (Qubit hero + 3 info lines); (2) `AWARENESS` (Shor's factoring, Grover's symmetric resilience, HNDL, Mosca's theorem, NIST FIPS 203/204 timeline, simulation disclosure); (3) `SOLUTION` (Hybrid defense-in-depth, ML-KEM-768 + ML-DSA-65, autonomous $Q_{\text{TL}}$ telemetry routing); (4) `LANES` (Standard vs. Critical lane technical comparison cards); (5) `ACCESS` (Terminal links for chat login, identity registration, and external supervisor console).
- **Yannick Gregoire Typographic & Shortcut Bar System**: Modeled `JustifiedTextBlock.jsx` spreading thin uppercase monospace prose across 3 columns per row (~70% width with negative right space), and built fixed 4-column `ShortcutBar.jsx` with inverted keycaps (`^H`, `^A`, `^S`, `^L`, `^▲`, `^▼`, `^E`, `^I`), keyboard shortcut listeners, active section teal highlights, and dark/light theme invert toggle.
- **Environment Isolation & Clean Routing**: Documented `VITE_SUPERVISOR_URL`, `VITE_HOME_URL`, and `VITE_CHAT_URL` in `.env.example`, verified zero hardcoded URLs, retired the legacy supervisor button from `/login`, and validated all 5 sections across viewports and both themes.

---

## ✅ N4 — Profile Avatar Upload (Backend Pillow Pipeline + Frontend Crop/Mask)

- **Hardened Backend Pillow Pipeline**: Added `Pillow==10.4.0` in `backend/requirements.txt`, created `avatar_service.py` enforcing strict magic byte verification (JPEG/PNG/WebP), 5MB size limit, EXIF metadata stripping, 1:1 aspect center-cropping, 512x512 Lanczos resizing, and WebP compression stored in `/uploads/avatars/` with `nosniff` static serving.
- **REST Endpoints & User Schema**: Extended `UserDoc` and `UserResponse` with additive `avatar_url: Optional[str]`, added authenticated `POST /api/v1/auth/me/avatar` and `DELETE /api/v1/auth/me/avatar` endpoints in `routes_auth.py`, returning updated user profile and cleaning stale files.
- **Interactive Crop Modal & Liquid Glass Profile Sheet**: Built `AvatarCropModal.jsx` with circular mask cutout, zoom slider (1x–3x), and pan dragging; built in-chat `ProfileModal.jsx` accessible from sidebar; upgraded `Avatar.jsx` with graceful image loading and deterministic monogram fallback; validated across 360px, 768px, 1280px, and 1920px viewports in both Dark and Light themes.

### Scope & Goals
- Backend Additive Changes:
  - Update `UserDoc` in `backend/app/models/user.py`: add `avatar_url: Optional[str] = None`.
  - Install `Pillow==10.4.0` in `backend/requirements.txt` and docker container.
  - Implement avatar processing service (`backend/app/services/avatar_service.py`):
    - Magic bytes validation (JPEG `FF D8 FF`, PNG `89 50 4E 47`, WebP `52 49 46 46...57 45 42 50`).
    - Enforce maximum 5MB upload size.
    - Strip all EXIF / metadata to prevent geographic and device data leakage.
    - Center-crop to 1:1 aspect ratio and resize to canonical 512x512 pixels.
    - Re-encode as WebP format (`quality=85`).
    - Persist to `/app/uploads/avatars/{user_id}_{uuid}.webp`.
  - Add API endpoints in `backend/app/api/routes_auth.py` (or dedicated `routes_users.py`):
    - `POST /api/v1/users/me/avatar`: accepts multipart form file, verifies auth, processes image, updates user document, returns `{ "avatar_url": "/uploads/avatars/..." }`.
    - `DELETE /api/v1/users/me/avatar`: verifies auth, removes file from disk, sets `avatar_url: null` in DB, returns `{ "avatar_url": null }`.
  - Ensure static file serving at `/uploads` includes `X-Content-Type-Options: nosniff` and proper cache headers.
- Frontend Implementation:
  - Registration Avatar Upload (`RegisterPage.jsx`):
    - File input accepting image files.
    - Interactive modal/inline crop preview: circular mask cutout, zoom slider (1x–3x), pan adjustment, reset button.
    - Non-blocking/optional: users can register without an avatar (retains generated deterministic avatar color).
  - In-Chat Profile Management (`ProfileModal.jsx` / User Settings Sheet):
    - Click user profile in sidebar header or bottom controls to open settings.
    - View current avatar, upload new photo, zoom/crop, or remove avatar.
  - Avatar Component Integration (`Avatar.jsx`):
    - If `avatar_url` is present, render `<img>` with smooth opacity fade-in on load and graceful error fallback to monogram initials.
    - Maintain visual consistency across sidebar contact list, chat header, message bubbles, and supervisor telemetry feed.

### Files to Touch
- `backend/requirements.txt` (add `Pillow==10.4.0`)
- `backend/app/models/user.py` (add `avatar_url` field to `UserDoc`)
- `backend/app/services/avatar_service.py` (new: Pillow sanitization, EXIF stripping, 512x512 WebP processing)
- `backend/app/api/routes_auth.py` (add `POST /me/avatar` and `DELETE /me/avatar` endpoints)
- `frontend-user/src/components/common/AvatarCropModal.jsx` (new: circular crop & zoom modal)
- `frontend-user/src/components/chat/ProfileModal.jsx` (new: user profile settings sheet)
- `frontend-user/src/pages/RegisterPage.jsx` (integrate avatar upload during registration)
- `frontend-user/src/components/common/Avatar.jsx` (support `avatar_url` with monogram fallback)
- `frontend-user/src/components/layout/Sidebar.jsx` (trigger profile modal on user avatar click)
- `frontend-user/src/services/api.js` (add avatar upload and delete API methods)

---

## ✅ N5 — Manual Contact List, Debounced Search & Non-Contact Security Gating

- **Targeted Contact Architecture & Privacy Safeguards**: Created `ContactDoc` model with compound unique indexing `[("user_id", 1), ("contact_id", 1)]`, backfilled mutual demo relationships in `seed_users.py`, built `GET /api/v1/contacts` merging manual contacts with active message threads (`is_contact: bool`), and added authenticated `GET /api/v1/users/search` enforcing $\ge 3$ characters and 5-result limit to prevent directory enumeration.
- **Debounced Directory Search & Add Flow**: Integrated debounced 300ms remote directory search in `Sidebar.jsx` with instant local filtering for $< 3$ characters, interactive result cards with liquid-glass `+ Add` button, and distinct visual labeling (`UNVERIFIED` amber badge) for incoming threads from unknown senders.
- **Liquid-Glass Security Alert Banner & Composer Lock**: Built non-contact threat defense strip in `ChatPage.jsx` warning users of unverified senders with a 1-click `Add Contact` action; locked composer inputs (`MessageInput.jsx`) with italic guidance and disabled send until verified; captured and validated across 360px, 768px, 1280px, and 1920px viewports in both Dark and Light themes.

### Scope & Goals
- Backend Additive Changes:
  - Add `contacts` collection in MongoDB:
    ```python
    class ContactDoc(TypedDict):
        _id: str
        user_id: str         # Owner of the contact list
        contact_id: str      # Added contact user ID
        created_at: datetime
    ```
    - Compound unique index: `[("user_id", 1), ("contact_id", 1)]`.
  - Add API endpoints in `backend/app/api/routes_contacts.py`:
    - `GET /api/v1/contacts`: returns contacts for current user combined with users who have sent incoming messages to the current user (with boolean flag `is_contact: true/false`).
    - `POST /api/v1/contacts`: accepts `{ "username": str }` or `{ "contact_id": str }`. Validates target user exists, is not self, and is not already added.
    - `DELETE /api/v1/contacts/{contact_id}`: removes contact relationship. Message history is preserved.
    - `GET /api/v1/users/search?q=query`: authenticated search requiring minimum 3 characters, returns maximum 5 matches (`id`, `username`, `display_name`, `avatar_url`, `is_contact`). Prevents leaking the global user directory.
  - WebSocket Enforcement (`backend/app/ws/ws_chat.py`):
    - When a message is sent to recipient, verify if recipient has the sender in contacts or mark as unverified external communication.
  - Database Seed Migration (`backend/app/db/init_db.py`):
    - Backfill mutual contact relationships among default demo accounts (`alice`, `bob`, `charlie`, `devraj`, `diana`, `eve`, `admin`) to prevent breaking existing demo scripts and test suites.
- Frontend Implementation:
  - Sidebar Contacts Pane (`Sidebar.jsx`):
    - Remove full directory enumeration; render only added contacts and active message threads.
    - Add search bar with 300ms debounce: searches existing contacts immediately, and queries `/api/v1/users/search` when $\ge 3$ characters typed.
    - Display search result dropdown with `+ Add Contact` action button.
  - Non-Contact Security Alert Banner (`SecurityBanner.jsx` / `ChatWindow.jsx`):
    - When viewing a thread from a sender not in user's contact book (`is_contact === false`), display a quiet liquid-glass alert banner:
      `"Incoming message from unverified sender @username. Verify identity and add to contacts to reply."`
    - Provide a primary button: `Add Contact`.
  - Message Composer Lock (`MessageInput.jsx`):
    - When `is_contact === false`, disable composer input and send button with explanatory placeholder: `"Add @username to contacts to send a message."`
    - Instantly unlocks upon adding contact.

### Files to Touch
- `backend/app/models/contact.py` (new: `ContactDoc` model and helper functions)
- `backend/app/api/routes_contacts.py` (new: contact CRUD and debounced search endpoints)
- `backend/app/db/mongodb.py` (add index creation for `contacts` collection)
- `backend/app/db/init_db.py` (backfill mutual contacts for demo users)
- `backend/app/main.py` (include contacts router)
- `backend/app/ws/ws_chat.py` (add contact relationship awareness to incoming messages)
- `frontend-user/src/components/layout/Sidebar.jsx` (integrate contact search and add UI)
- `frontend-user/src/components/chat/ChatWindow.jsx` (render non-contact security alert banner)
- `frontend-user/src/components/chat/MessageInput.jsx` (disable composer for non-contact threads)
- `frontend-user/src/services/api.js` (add contact APIs: `getContacts`, `addContact`, `removeContact`, `searchUsers`)
- `frontend-user/src/context/ChatContext.jsx` (manage contacts state and search actions)

---

## ✅ N6 — Multi-Viewport Audit, Dual-Theme Verification & End-to-End Polish

- **Full Multi-Viewport Suite (360 / 768 / 1280 / 1920px)**: Captured and validated all viewports across Home Page (5 scroll-snapped sections), Avatar Upload pipeline, Chat Application (Manual contacts, debounced directory search, unverified sender gating banner, composer lock), and Supervisor Command Center in both Dark (`Ember Dusk`) and Light (`Cream Dawn`) themes.
- **Strict Monochrome & Edge Token Adherence**: Verified 100% adherence to design system tokens with automated crawler (`scripts/audit_next_qa.cjs`), achieving $\le 1.0\%$ saturated pixels across all surfaces (far below the $8\%$ limit), 0 edge token violations, and 100% WCAG 2.2 AA text contrast compliance.
- **End-to-End Interactive Polish & Delivery**: Validated all interactive mechanics including real-time ASCII Bloch sphere pointer tracking and wave-function collapse, 8 keyboard shortcuts (`H`, `A`, `S`, `L`, `E`, `I`, `▲`, `▼`), instant profile photo crop/mask and upload, 1-click unverified contact resolution, and zero regressions in the core PQC/QKD cryptographic pipeline.

### Scope & Goals
- Automated Puppeteer / Playwright test suite capturing screenshots across all required viewports:
  - Mobile (360x780)
  - Tablet (768x1024)
  - Desktop Laptop (1280x800)
  - Ultra-Wide Desktop (1920x1080)
- Dual-Theme Capture:
  - Dark Theme (`Ember Dusk` / `dark.jpg`)
  - Light Theme (`Cream Dawn` / `light.jpg`)
- Contrast & Token Audits:
  - Zero edge violations (`--edge-rest`, `--edge-hover`, `--edge-selected`).
  - Strict monochrome saturation budget ($\le 8\%$ saturated pixels across Home, Chat, and Supervisor).
  - 100% WCAG 2.2 AA contrast compliance.
- Interactive End-to-End Flow Validation:
  - Home page load scramble $\rightarrow$ Qubit hover/pointer tracking $\rightarrow$ measurement collapse key 'M'.
  - 5-page keyboard navigation (`H`, `A`, `S`, `L`, `E`, `I`, `ArrowUp`, `ArrowDown`).
  - Registration with avatar crop/upload $\rightarrow$ avatar visibility across all views.
  - User search $\rightarrow$ add contact $\rightarrow$ non-contact banner test $\rightarrow$ chat message send.
  - Supervisor console link launch.
- Documentation update: update `docs/PROGRESS_NEXT.md`, update `.env.example`, and generate final verification artifact report.

### Files to Touch
- `capture_next_features.cjs` (new: comprehensive multi-viewport capture script)
- `audit_next_qa.cjs` (new: automated QA validator for saturation, contrast, and edges)
- `docs/PROGRESS_NEXT.md` (record all audit results and mark all phases completed)
