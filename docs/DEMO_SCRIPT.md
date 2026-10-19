# PQC Secure Comm — 60-Second Live Demo Script

> **Audience**: Principal Product Designers, Senior Frontend Engineers, Security Architects  
> **Target Duration**: Exactly 60 seconds  
> **Demo Assets**: User App (`http://localhost:5173`), Supervisor App (`http://localhost:5174`)

---

## Storyline Overview

The demo presents **PQC Secure Comm**, an enterprise-grade post-quantum cryptographic communication suite designed to defend against the **Harvest-Now-Decrypt-Later (HNDL)** quantum adversary model. The suite couples NIST FIPS 203 (ML-KEM-768) and FIPS 204 (ML-DSA-65) with simulated Quantum Key Distribution (QKD-256), wrapped in an **Apple visionOS / Linear-grade Liquid Glass v2** design system supporting dual themes: *"Ember Dusk"* and *"Cream Dawn"*.

---

## Second-by-Second Presentation Script

### [00:00 – 00:10] The Threshold: Login & Physical Caustics
- **Action**: Open User App at `/login` in Dark Theme ("Ember Dusk").
- **Voiceover**: 
  > *"Every packet intercepted on the wire today is vulnerable to retrospective decryption the moment a Cryptographically Relevant Quantum Computer comes online. Welcome to PQC Secure Comm. Notice the login composition: a 24-pixel Liquid Glass card suspended over our warm-neutral 'Ember Dusk' backdrop, with an authentic 620-pixel luminous caustics ring refracting through the glass with zero layout shift."*
- **Interaction**: Toggle the Theme Button (top-right) to "Cream Dawn", then back to "Ember Dusk" to show circular view transition / crossfade.

### [00:10 – 00:20] One-Click Demo Access & Instant App Shell
- **Action**: Click `[ Continue as demo user (@alice) ]`.
- **Voiceover**: 
  > *"Clicking 'Continue as demo user' opens the visionOS-grade app shell. The background stack is root-mounted once—meaning zero flash or canvas remounting on route transitions. Notice the 2.5% procedural grain preventing gradient banding, and the ambient teal tint signaling nominal security."*
- **Interaction**: Click on Bob Smith in the sidebar. Message history loads instantly.

### [00:20 – 00:35] Zero-Blur Bubble Architecture & Adaptive QKD Switching
- **Action**: Point out standard and critical lane message bubbles. Click the **Security Toggle** in the header from *Standard* to *Critical (QKD)*.
- **Voiceover**: 
  > *"To ensure 60fps scrolling under heavy message volume, our message bubbles adhere to a strict zero-blur Surface Inner budget. In light mode, peer messages render as crisp frosted white cards while user messages take a warm cream tint. Watch what happens when I switch to the Critical Lane: the ambient backdrop tint shifts to golden amber, engaging simulated QKD-256 pre-shared entropy combined with ML-KEM-768 via HKDF."*
- **Interaction**: Type `"Emergency grid dispatch authorization"` and press Send. The message appears with an amber outline and `[QKD-256]` Seal glyph.

### [00:35 – 00:50] The Supervisor Command Center: Real-Time Telemetry
- **Action**: Switch to the Supervisor Console tab (`http://localhost:5174`).
- **Voiceover**: 
  > *"Simultaneously on the Supervisor Console, the packet is analyzed in real time. Our SVG arc gauge tracks the single-use QKD reservoir with zero Recharts resizing jitter. In the center, our heuristic risk model plots threat scores against a strict 0.70 threshold. Notice that across this entire dashboard, exactly 6 blurred L1 surfaces are active—keeping GPU compositing within strict frame budgets."*
- **Interaction**: Click `[ Demo ]` in the top navbar to fire 10 automated test packets. Watch the live scatter plot and routing feed update.

### [00:50 – 01:00] Deep Cryptographic Proof & Closing
- **Action**: Scroll down to the **Cryptographic Process Inspector**. Click the latest event.
- **Voiceover**: 
  > *"In the Cryptographic Process Inspector, supervisors inspect each step: ML-KEM keypair generation, KEM encapsulation, HKDF recovery, and Dilithium3 signatures. Every key is default-masked with one-click audit reveal and copy confirmation. PQC Secure Comm proves that enterprise quantum resilience can be mathematically uncompromising and aesthetically sublime."*
- **Interaction**: Click `[ Harvest Lab ]` in the top bar to display the HNDL defense reference sheet as the closing visual.

---

## Key Talking Points for the Judges

1. **Design System & Visual Craft**:
   - Single-hue Ember accent (`#e8622c` / `#c2410c`) used exclusively for CTAs and focus; never conflated with semantic alert or lane states.
   - Dual theme system: "Ember Dusk" (film-grain dark brown) and "Cream Dawn" (sunlit warm cream).
   - Zero raw color leaks across 73 components; 100% adherence to CSS custom property tokens.
2. **Performance Engineering**:
   - Strict adherence to the 6-surface blurred glass budget.
   - Message bubbles and sub-panels leverage zero-blur `surface-inner` fills to preserve 60fps rendering.
   - Single-scroll container in the Cryptographic Inspector preventing nested scroll-trap anti-patterns.
3. **Cryptographic Rigor & Transparency**:
   - Real implementations of NIST FIPS 203 (ML-KEM-768), NIST FIPS 204 (ML-DSA-65), and AES-256-GCM.
   - Transparent disclosure that QKD is currently a deterministic pre-shared simulation with physical hardware integration endpoints.
