import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import TitleWipe from '../components/landing/TitleWipe';
import ScrambleText from '../components/landing/ScrambleText';
import QubitHero from '../components/landing/QubitHero';
import JustifiedTextBlock from '../components/landing/JustifiedTextBlock';
import ShortcutBar from '../components/landing/ShortcutBar';
import { useTheme } from '../theme/useTheme';

const SECTIONS = ['home', 'awareness', 'solution', 'lanes', 'access'];

export default function HomePage() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('home');
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);

  // Detect touch capability
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }
  }, []);

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    const container = containerRef.current;
    if (el && container) {
      container.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const navigateRelative = useCallback((direction) => {
    const currentIndex = SECTIONS.indexOf(activeSection);
    if (direction === 'up' && currentIndex > 0) {
      scrollToSection(SECTIONS[currentIndex - 1]);
    } else if (direction === 'down' && currentIndex < SECTIONS.length - 1) {
      scrollToSection(SECTIONS[currentIndex + 1]);
    }
  }, [activeSection, scrollToSection]);

  const handleScroll = (e) => {
    const top = e.target.scrollTop;
    const windowH = window.innerHeight || 800;
    const p = Math.min(1, Math.max(0, top / windowH));
    setScrollProgress(p);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const key = e.key.toUpperCase();

      if (key === 'H') {
        e.preventDefault();
        scrollToSection('home');
      } else if (key === 'A') {
        e.preventDefault();
        scrollToSection('awareness');
      } else if (key === 'S') {
        e.preventDefault();
        scrollToSection('solution');
      } else if (key === 'L') {
        e.preventDefault();
        scrollToSection('lanes');
      } else if (key === 'E') {
        e.preventDefault();
        scrollToSection('access');
      } else if (key === 'I') {
        e.preventDefault();
        toggleTheme();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        navigateRelative('up');
      } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        navigateRelative('down');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollToSection, toggleTheme, navigateRelative]);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: [0.5] }
    );

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const supervisorUrl = import.meta.env.VITE_SUPERVISOR_URL || 'http://localhost:5174';

  // Section 2: Awareness content
  const awarenessContent = [
    {
      label: '01 / ASYMMETRIC VULNERABILITY',
      paragraphs: [
        'RSA, Diffie-Hellman, and Elliptic Curve Cryptography (ECC) depend on the mathematical intractability of integer factorization and discrete logarithms. On a cryptographically relevant quantum computer, Shor\'s algorithm solves these problems in polynomial time, completely dismantling classical public-key infrastructure.',
        'In contrast, symmetric ciphers are only quadratically weakened by Grover\'s algorithm: AES-256 retains 128 bits of post-quantum security and remains resilient against quantum search.'
      ],
      footer: 'SHOR (1994) · GROVER (1996) · NIST IR 8547'
    },
    {
      label: '02 / HARVEST NOW, DECRYPT LATER',
      paragraphs: [
        'Hostile intelligence actors are actively capturing and archiving encrypted communications across global telecommunications backbones today. When large fault-tolerant quantum computers emerge, these intercepted ciphertexts will be decrypted retrospectively.',
        'Mosca\'s Theorem mandates that if data security shelf-life (X) plus cryptographic migration time (Y) exceeds the time until a quantum computer exists (Z), organizations are already compromised. The exact date of Q-Day is unknown; migration cannot be deferred.'
      ],
      footer: 'MOSCA\'S THEOREM: (X + Y) > Z → CRITICAL ACTION REQUIRED'
    },
    {
      label: '03 / NIST STANDARDS & SIMULATION',
      paragraphs: [
        'In August 2024, NIST published FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), and FIPS 205 (SLH-DSA). NIST IR 8547 guidance proposes deprecating classical RSA and ECC around 2030 and fully disallowing them around 2035.',
        'This web application simulates an enterprise hybrid switching environment. Every payload receives dynamic quantum threat scoring (Q_TL) and routes autonomously between Standard and Critical lanes. Quantum key distribution is simulated. Do not enter real credentials.'
      ],
      footer: 'FIPS 203 (ML-KEM) · FIPS 204 (ML-DSA) · SIMULATION BUILD'
    }
  ];

  // Section 3: Solution content
  const solutionContent = [
    {
      label: '01 / WHY HYBRID SWITCHING',
      paragraphs: [
        'Pure post-quantum cryptography algorithms are mathematically mature but relatively new in long-term production deployments. Classical algorithms have decades of cryptanalytic scrutiny but cannot withstand quantum attacks.',
        'A hybrid architecture pairs post-quantum lattice security with established symmetric ciphers, providing defense-in-depth ("belts and braces") that remains completely impenetrable to both classical and quantum adversaries.'
      ],
      footer: 'DEFENSE-IN-DEPTH · DUAL CRYPTOGRAPHIC ASSURANCE'
    },
    {
      label: '02 / DUAL-ENGINE ARCHITECTURE',
      paragraphs: [
        'Session Encapsulation: NIST FIPS 203 ML-KEM-768 establishes high-entropy post-quantum shared secrets based on the Module Learning With Errors (MLWE) lattice problem, encrypted with authenticated AES-256-GCM.',
        'Identity & Signatures: NIST FIPS 204 ML-DSA-65 generates quantum-resistant digital signatures for every message, ensuring non-repudiation, origin authenticity, and tamper detection.'
      ],
      footer: 'ML-KEM-768 (LATTICE) + ML-DSA-65 (SIGNATURE)'
    },
    {
      label: '03 / AUTONOMOUS TELEMETRY ROUTING',
      paragraphs: [
        'The cryptographic pipeline dynamically computes a quantum threat score: Q_TL = w1·S + w2·I, evaluating payload sensitivity (S) and simulated network intercept probability (I).',
        'When Q_TL exceeds 0.70 or critical sensitivity is flagged, traffic instantly re-routes into the Critical Lane, combining lattice keys with one-time pad material with zero session interruption.'
      ],
      footer: 'Q_TL = 0.6·S + 0.4·I · REAL-TIME ARBITRATION'
    }
  ];

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-screen w-screen overflow-y-scroll overflow-x-hidden snap-y snap-mandatory no-scrollbar text-[var(--text-primary)] font-mono-light relative select-none"
    >
      {/* ── Fixed Vertical Badge (Right Edge) ─────────────────────────────── */}
      <aside
        aria-label="Standards Compliance Badge"
        className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-40 pointer-events-none hidden sm:block"
      >
        <div className="rotate-90 origin-right text-[10px] md:text-[11px] tracking-[0.25em] text-[var(--text-tertiary)] uppercase font-mono-light whitespace-nowrap opacity-75">
          NIST FIPS 203 · 204 · SIMULATION BUILD
        </div>
      </aside>

      {/* ── SECTION 1: HOME ────────────────────────────────────────────────── */}
      <section
        id="home"
        className="min-h-screen w-full snap-start flex flex-col justify-between p-6 sm:p-8 md:p-12 relative pb-36 md:pb-28"
      >
        {/* Top Edge: Giant Dot-Matrix Title */}
        <header className="pt-2 md:pt-4">
          <TitleWipe className="text-[clamp(2.4rem,8.2vw,7.2rem)] tracking-[-0.03em]" />
        </header>

        {/* Hero Area: ASCII Qubit (Left) + 3 Staggered Info Lines (Right) */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-auto py-6">
          {/* Left Column: Real-time ASCII Qubit Hero Canvas */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <QubitHero scrollProgress={scrollProgress} />
          </div>

          {/* Right Column: 3 Diagonal Staggered Info Lines */}
          <div className="lg:col-span-7 flex flex-col justify-center gap-6 md:gap-10 pt-4 lg:pt-8">
            {/* Line 1: Main Proposition (Stagger 0) */}
            <div className="text-xs sm:text-sm md:text-base lg:text-lg tracking-wide uppercase font-mono-light text-[var(--text-primary)]">
              <span className="text-[var(--text-tertiary)] mr-2">/</span>
              <ScrambleText
                text="POST-QUANTUM CRYPTOGRAPHY WITH HYBRID SWITCHING"
                delay={200}
                duration={700}
              />
            </div>

            {/* Line 2: PQC Algorithm (Stagger 1) */}
            <div className="text-xs sm:text-sm md:text-base lg:text-lg tracking-wide uppercase font-mono-light pl-4 sm:pl-10 md:pl-20 text-[var(--text-primary)] group cursor-pointer">
              <span className="text-[var(--text-tertiary)] mr-2">/</span>
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--col-standard)] mr-2.5 align-middle opacity-80 group-hover:scale-125 transition-transform" />
              <ScrambleText
                text="PQC"
                hoverText="ML-KEM-768 + ML-DSA-65"
                delay={500}
                duration={500}
                className="hover:text-[var(--col-standard)] transition-colors"
              />
            </div>

            {/* Line 3: QKD / OTP (Stagger 2) */}
            <div className="text-xs sm:text-sm md:text-base lg:text-lg tracking-wide uppercase font-mono-light pl-8 sm:pl-20 md:pl-36 text-[var(--text-primary)] group cursor-pointer">
              <span className="text-[var(--text-tertiary)] mr-2">/</span>
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--col-critical)] mr-2.5 align-middle opacity-80 group-hover:scale-125 transition-transform" />
              <ScrambleText
                text="QKD"
                hoverText="256-BIT ONE-TIME KEYS . SIMULATED"
                delay={800}
                duration={500}
                className="hover:text-[var(--col-critical)] transition-colors"
              />
            </div>
          </div>
        </main>

        {/* Lower Right Navigation Prompt */}
        <footer className="flex justify-end pt-2 pb-2">
          <div className="text-[10px] md:text-xs uppercase tracking-widest text-[var(--text-secondary)] font-mono-light flex items-center gap-1.5">
            <span className="text-[var(--text-tertiary)]">/</span>
            <span>{isTouchDevice ? 'SCROLL TO NAVIGATE' : 'USE YOUR KEYBOARD TO NAVIGATE'}</span>
            <span className="animate-bounce inline-block">↓</span>
          </div>
        </footer>
      </section>

      {/* ── SECTION 2: AWARENESS ───────────────────────────────────────────── */}
      <section
        id="awareness"
        className="min-h-screen w-full snap-start flex flex-col justify-between p-6 sm:p-8 md:p-12 relative pb-36 md:pb-28 border-t border-[var(--edge-rest)]"
      >
        <header className="pt-2 md:pt-4">
          <h2 className="text-[clamp(2.2rem,7vw,5.5rem)] font-doto font-black tracking-tight uppercase leading-[0.9] text-[var(--text-primary)]">
            <ScrambleText text="AWARENESS" trigger="inView" duration={800} />
          </h2>
        </header>

        <div className="my-auto py-8">
          <JustifiedTextBlock items={awarenessContent} />
        </div>

        <footer className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider flex items-center justify-between flex-wrap gap-2">
          <span>FIPS 203 · ML-KEM-768 / FIPS 204 · ML-DSA-65 / NIST IR 8547 TRANSITION GUIDANCE</span>
          <span>PAGE 02 / 05</span>
        </footer>
      </section>

      {/* ── SECTION 3: SOLUTION ────────────────────────────────────────────── */}
      <section
        id="solution"
        className="min-h-screen w-full snap-start flex flex-col justify-between p-6 sm:p-8 md:p-12 relative pb-36 md:pb-28 border-t border-[var(--edge-rest)]"
      >
        <header className="pt-2 md:pt-4">
          <h2 className="text-[clamp(2.2rem,7vw,5.5rem)] font-doto font-black tracking-tight uppercase leading-[0.9] text-[var(--text-primary)]">
            <ScrambleText text="SOLUTION" trigger="inView" duration={800} />
          </h2>
        </header>

        <div className="my-auto py-8">
          <JustifiedTextBlock items={solutionContent} />
        </div>

        <footer className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider flex items-center justify-between flex-wrap gap-2">
          <span>HYBRID SWITCHING ARCHITECTURE · DETERMINISTIC ADAPTIVE ROUTING</span>
          <span>PAGE 03 / 05</span>
        </footer>
      </section>

      {/* ── SECTION 4: LANES ───────────────────────────────────────────────── */}
      <section
        id="lanes"
        className="min-h-screen w-full snap-start flex flex-col justify-between p-6 sm:p-8 md:p-12 relative pb-36 md:pb-28 border-t border-[var(--edge-rest)]"
      >
        <header className="pt-2 md:pt-4">
          <h2 className="text-[clamp(2.2rem,7vw,5.5rem)] font-doto font-black tracking-tight uppercase leading-[0.9] text-[var(--text-primary)]">
            <ScrambleText text="LANES" trigger="inView" duration={800} />
          </h2>
        </header>

        <div className="max-w-[1200px] w-full my-auto py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Standard Lane Card */}
            <div className="p-6 md:p-8 rounded-xl border border-[var(--edge-rest)] bg-[var(--surface-inner)]/30 backdrop-blur-sm flex flex-col justify-between gap-6 hover:border-[var(--edge-hover)] transition-colors">
              <div>
                <div className="flex items-center justify-between border-b border-[var(--edge-rest)] pb-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--col-standard)] shadow-[0_0_8px_var(--col-standard)]" />
                    <span className="text-sm md:text-base font-bold text-[var(--text-primary)] tracking-widest uppercase">
                      STANDARD LANE
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--col-standard)]/10 text-[var(--col-standard)] border border-[var(--col-standard)]/20">
                    NOMINAL TRAFFIC
                  </span>
                </div>

                <p className="text-xs md:text-sm uppercase text-[var(--text-secondary)] leading-relaxed font-mono-light mb-6">
                  Primary encrypted transport channel designed for high-throughput, low-overhead secure communication. Employs NIST FIPS 203 ML-KEM-768 for post-quantum key encapsulation, paired with AES-256-GCM authenticated payload encryption and ML-DSA-65 digital signatures.
                </p>

                <div className="grid grid-cols-2 gap-3 text-[10px] md:text-[11px] font-mono text-[var(--text-tertiary)] uppercase border-t border-[var(--edge-rest)] pt-4">
                  <div>
                    <span className="text-[var(--text-secondary)] block">LATENCY PROFILE</span>
                    <span>&lt; 20ms instantaneous</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)] block">KEY ENCAPSULATION</span>
                    <span>ML-KEM-768 (Lattice)</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)] block">CIPHER MODE</span>
                    <span>AES-256-GCM 128-bit tag</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)] block">SIGNATURE SCHEME</span>
                    <span>ML-DSA-65 (Dilithium)</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-[var(--col-standard)] uppercase flex items-center justify-between pt-2 border-t border-[var(--edge-rest)]">
                <span>SECURITY: POST-QUANTUM RESILIENT</span>
                <span>STATUS: OPERATIONAL</span>
              </div>
            </div>

            {/* Critical Lane Card */}
            <div className="p-6 md:p-8 rounded-xl border border-[var(--edge-rest)] bg-[var(--surface-inner)]/30 backdrop-blur-sm flex flex-col justify-between gap-6 hover:border-[var(--edge-hover)] transition-colors">
              <div>
                <div className="flex items-center justify-between border-b border-[var(--edge-rest)] pb-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--col-critical)] shadow-[0_0_8px_var(--col-critical)]" />
                    <span className="text-sm md:text-base font-bold text-[var(--text-primary)] tracking-widest uppercase">
                      CRITICAL LANE
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--col-critical)]/10 text-[var(--col-critical)] border border-[var(--col-critical)]/20">
                    CONTINGENCY LOCK
                  </span>
                </div>

                <p className="text-xs md:text-sm uppercase text-[var(--text-secondary)] leading-relaxed font-mono-light mb-6">
                  Maximum-assurance contingency channel activated during elevated quantum threat environments (Q_TL ≥ 0.70) or sensitive payload flags. Combines ML-KEM-768 lattice keys with single-use simulated Quantum Key Distribution (QKD) One-Time Pad material.
                </p>

                <div className="grid grid-cols-2 gap-3 text-[10px] md:text-[11px] font-mono text-[var(--text-tertiary)] uppercase border-t border-[var(--edge-rest)] pt-4">
                  <div>
                    <span className="text-[var(--text-secondary)] block">FORWARD SECRECY</span>
                    <span>Information-Theoretic OTP</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)] block">KEY RESERVOIR</span>
                    <span>256-Bit Hardware Pool</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)] block">BUFFER DELIVERY</span>
                    <span>Adaptive τ_eff Scheduling</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)] block">ARBITRATION</span>
                    <span>Autonomous Q_TL ≥ 0.70</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-[var(--col-critical)] uppercase flex items-center justify-between pt-2 border-t border-[var(--edge-rest)]">
                <span>SECURITY: DUAL PQC + QKD PAD</span>
                <span>STATUS: HIGH ASSURANCE</span>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider flex items-center justify-between flex-wrap gap-2">
          <span>CONTINUOUS LANE ARBITRATION · ZERO DOWNTIME HANDSHAKE RE-NEGOTIATION</span>
          <span>PAGE 04 / 05</span>
        </footer>
      </section>

      {/* ── SECTION 5: ACCESS ──────────────────────────────────────────────── */}
      <section
        id="access"
        className="min-h-screen w-full snap-start flex flex-col justify-between p-6 sm:p-8 md:p-12 relative pb-36 md:pb-28 border-t border-[var(--edge-rest)]"
      >
        <header className="pt-2 md:pt-4">
          <h2 className="text-[clamp(2.2rem,7vw,5.5rem)] font-doto font-black tracking-tight uppercase leading-[0.9] text-[var(--text-primary)]">
            <ScrambleText text="ACCESS" trigger="inView" duration={800} />
          </h2>
        </header>

        <div className="max-w-[760px] w-full my-auto py-8 flex flex-col gap-8">
          <p className="text-xs md:text-sm uppercase tracking-wider text-[var(--text-secondary)] font-mono-light leading-relaxed">
            Select a terminal access point to launch the simulated post-quantum cryptographic application stack.
          </p>

          <div className="flex flex-col gap-3 font-mono text-xs md:text-sm uppercase">
            <Link
              to="/login"
              className="p-4 sm:p-5 rounded-lg border border-[var(--edge-rest)] bg-[var(--surface-inner)]/40 hover:bg-[var(--surface-elevated)] hover:border-[var(--text-primary)]/40 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors">&gt;</span>
                <div className="flex flex-col">
                  <span className="font-medium tracking-wider text-[var(--text-primary)]">
                    LAUNCH SECURE CHAT APP
                  </span>
                  <span className="text-[10px] text-[var(--text-tertiary)] lowercase font-mono">
                    /login · authenticated messaging &amp; manual contacts
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-[var(--text-secondary)] tracking-widest font-mono">
                [ SIGN IN ]
              </span>
            </Link>

            <Link
              to="/register"
              className="p-4 sm:p-5 rounded-lg border border-[var(--edge-rest)] bg-[var(--surface-inner)]/40 hover:bg-[var(--surface-elevated)] hover:border-[var(--text-primary)]/40 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors">&gt;</span>
                <div className="flex flex-col">
                  <span className="font-medium tracking-wider text-[var(--text-primary)]">
                    CREATE SECURE PROFILE
                  </span>
                  <span className="text-[10px] text-[var(--text-tertiary)] lowercase font-mono">
                    /register · custom avatar upload &amp; identity registration
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-[var(--text-secondary)] tracking-widest font-mono">
                [ REGISTER ]
              </span>
            </Link>

            <a
              href={supervisorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 sm:p-5 rounded-lg border border-[var(--edge-rest)] bg-[var(--surface-inner)]/40 hover:bg-[var(--surface-elevated)] hover:border-[var(--col-standard)]/40 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-[var(--col-standard)]">&gt;</span>
                <div className="flex flex-col">
                  <span className="font-medium tracking-wider text-[var(--text-primary)] group-hover:text-[var(--col-standard)] transition-colors">
                    SUPERVISOR COMMAND CENTER
                  </span>
                  <span className="text-[10px] text-[var(--text-tertiary)] lowercase font-mono">
                    {supervisorUrl} · live routing feed, key pools &amp; analytics
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-[var(--col-standard)] tracking-widest font-mono">
                [ PORT 5174 ↗ ]
              </span>
            </a>
          </div>
        </div>

        <footer className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider flex items-center justify-between flex-wrap gap-2">
          <span>SIMULATED ENVIRONMENT · DO NOT USE REAL PASSWORDS</span>
          <span>PAGE 05 / 05</span>
        </footer>
      </section>

      {/* ── FIXED BOTTOM SHORTCUT BAR (4 Columns) ──────────────────────────── */}
      <ShortcutBar
        activeSection={activeSection}
        onNavigateSection={scrollToSection}
        onNavigateRelative={navigateRelative}
        onToggleTheme={toggleTheme}
        resolvedTheme={resolvedTheme}
      />
    </div>
  );
}
