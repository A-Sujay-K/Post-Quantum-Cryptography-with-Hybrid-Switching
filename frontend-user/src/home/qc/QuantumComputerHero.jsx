import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import pathsData from './paths.json';
import { GlyphAtlas } from './GlyphAtlas';
import { ParticleSystem } from './ParticleSystem';

/**
 * QuantumComputerHero.jsx
 *
 * Photographic dilution-refrigerator quantum computer chandelier with real-wire data flow.
 *
 * Architecture:
 * - Layer 1 (bottom): Base machine image (unboxed, transparent background)
 * - Layer 2 (middle): High-speed particle canvas (Geist Mono glyphs '0', '1', '0/1')
 * - Layer 3 (top): Front-mask occlusion image (plates & column occlude particles passing behind)
 * - Interactive: Pointer 3-band parallax tilt, Click / Tap / Key 'M' wavefunction collapse
 * - Load: Top-to-bottom scan line with noise-to-clean image wipe (1.2s)
 * - Scroll Exit: Reference-accurate horizontal row slice-collapse
 * - Telemetry: Real-time Bloch sphere angles (theta, phi) and eigenstate probabilities P(0), P(1)
 */
export default function QuantumComputerHero({ scrollProgress = 0, className = '' }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const sliceCanvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const isVisibleRef = useRef(true);

  // Check URL debug mode (?debug=paths)
  const isDebugMode = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('debug') === 'paths';
  }, []);

  // Theme detection
  const [currentTheme, setCurrentTheme] = useState('dark');
  useEffect(() => {
    const updateTheme = () => {
      const theme = document.documentElement.dataset.theme || localStorage.getItem('pqc-theme') || 'dark';
      setCurrentTheme(theme);
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mq.matches);
      const handler = (e) => setPrefersReducedMotion(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, []);

  // Readout telemetry state
  const [telemetry, setTelemetry] = useState({
    theta: 1.00,
    phi: 4.94,
    p0: 0.77,
    p1: 0.23,
    lastMeasure: null,
    status: 'SUPERPOSITION'
  });

  // Load wipe state
  const [loadScanProgress, setLoadScanProgress] = useState(0.0);
  const loadStartTimeRef = useRef(Date.now());

  // Parallax spring physics ref
  const parallaxRef = useRef({
    tiltX: 0,
    tiltY: 0,
    targetTiltX: 0,
    targetTiltY: 0,
  });

  // Particle engine instances
  const glyphAtlasRef = useRef(null);
  const particleSystemRef = useRef(null);

  // Initialize Particle Engine
  useEffect(() => {
    const atlas = new GlyphAtlas();
    atlas.init();
    glyphAtlasRef.current = atlas;

    const ps = new ParticleSystem(pathsData, atlas);
    // Responsive pool size
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    ps.setPoolSize(isMobile ? 120 : 260);
    particleSystemRef.current = ps;
  }, []);

  // Wavefunction measurement trigger
  const executeMeasure = useCallback(() => {
    if (!particleSystemRef.current) return;
    const bit = particleSystemRef.current.triggerMeasure();
    setTelemetry(prev => ({
      ...prev,
      lastMeasure: bit,
      status: `COLLAPSED |${bit}⟩`
    }));

    setTimeout(() => {
      setTelemetry(prev => ({
        ...prev,
        status: 'SUPERPOSITION'
      }));
    }, 1200);
  }, []);

  // Keyboard shortcut: Key 'M' for Measurement
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        executeMeasure();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executeMeasure]);

  // Pointer move tracking for Parallax & State Vector angles
  const handlePointerMove = useCallback((e) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1));
    const ny = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1));

    // Parallax tilt targets (max 6px horizontal, 4px vertical)
    parallaxRef.current.targetTiltX = nx * 6.0;
    parallaxRef.current.targetTiltY = ny * 4.0;

    // Map pointer to state vector (Theta: 0..PI, Phi: 0..2PI)
    const newTheta = 1.00 + ny * 0.45;
    const newPhi = 4.94 + nx * 0.85;
    const p0 = Math.cos(newTheta / 2) ** 2;
    const p1 = 1 - p0;

    if (particleSystemRef.current) {
      particleSystemRef.current.setStateVector(newTheta, newPhi);
    }

    setTelemetry(prev => ({
      ...prev,
      theta: newTheta,
      phi: newPhi,
      p0,
      p1
    }));
  }, [prefersReducedMotion]);

  // Visibility detection (pause when scrolled offscreen)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Main 60fps Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let lastTime = performance.now();

    const loop = (time) => {
      animFrameRef.current = requestAnimationFrame(loop);

      if (!isVisibleRef.current || document.hidden) return;

      const dt = Math.min(0.05, (time - lastTime) / 1000.0);
      lastTime = time;

      // 1. Load Scan Wipe (1.2s)
      const elapsed = (Date.now() - loadStartTimeRef.current) / 1200.0;
      if (elapsed <= 1.0) {
        setLoadScanProgress(elapsed);
      } else if (loadScanProgress < 1.0) {
        setLoadScanProgress(1.0);
      }

      // 2. Parallax Spring Easing
      const p = parallaxRef.current;
      p.tiltX += (p.targetTiltX - p.tiltX) * 0.08;
      p.tiltY += (p.targetTiltY - p.tiltY) * 0.08;

      // 3. Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 4. Update and Render Particles
      const ps = particleSystemRef.current;
      if (ps && !prefersReducedMotion) {
        ps.update(dt);
        ps.draw(ctx, canvas.width, canvas.height);

        // Render debug overlay if requested
        if (isDebugMode) {
          ps.drawDebugOverlay(ctx, canvas.width, canvas.height);
        }
      }

      // 5. Draw Load Scan Sweep Line
      if (elapsed < 1.0) {
        const scanY = elapsed * canvas.height;
        ctx.save();
        const grad = ctx.createLinearGradient(0, scanY - 8, 0, scanY + 8);
        grad.addColorStop(0, 'rgba(94, 234, 212, 0)');
        grad.addColorStop(0.5, 'rgba(94, 234, 212, 0.85)');
        grad.addColorStop(1, 'rgba(94, 234, 212, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, scanY - 6, canvas.width, 12);

        // Bright center beam
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(canvas.width, scanY);
        ctx.stroke();
        ctx.restore();
      }
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [prefersReducedMotion, isDebugMode, loadScanProgress]);

  // Asset paths based on theme
  const isLight = currentTheme === 'light';
  const baseSrc1x = isLight ? '/hero/qc-base-light-1x.webp' : '/hero/qc-base-1x.webp';
  const baseSrc2x = isLight ? '/hero/qc-base-light-2x.webp' : '/hero/qc-base-2x.webp';
  const maskSrc1x = isLight ? '/hero/qc-mask-light-1x.webp' : '/hero/qc-mask-1x.webp';
  const maskSrc2x = isLight ? '/hero/qc-mask-light-2x.webp' : '/hero/qc-mask-2x.webp';

  // Parallax transform styles for 3-band layer displacement
  const tiltX = parallaxRef.current.tiltX;
  const tiltY = parallaxRef.current.tiltY;

  // Slice-collapse transition on scroll
  const isSlicing = scrollProgress > 0.05;
  const sliceCollapseStyle = useMemo(() => {
    if (!isSlicing) return {};
    const p = Math.min(1.0, scrollProgress * 2.2);
    return {
      opacity: Math.max(0, 1 - p * 1.4),
      transform: `translateY(${p * 40}px) scaleY(${Math.max(0.1, 1 - p * 0.8)})`,
      filter: `blur(${p * 4}px)`,
      transition: 'none'
    };
  }, [isSlicing, scrollProgress]);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onClick={executeMeasure}
      className={`relative w-full max-w-[220px] sm:max-w-[250px] md:max-w-[280px] lg:max-w-[310px] xl:max-w-[330px] mx-auto select-none flex flex-col items-start cursor-pointer group ${className}`}
      style={sliceCollapseStyle}
    >
      {/* ── 3-Layer Quantum Computer Chandelier ────────────────────────────── */}
      <div className="relative w-full aspect-[640/816] overflow-visible">
        {/* Layer 1: Base Machine Image (Z-index: 10) */}
        <picture>
          <source srcSet={`${baseSrc2x} 2x, ${baseSrc1x} 1x`} type="image/webp" />
          <img
            src={baseSrc1x}
            alt=""
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10 transition-transform duration-75 ease-out"
            style={{
              transform: `translate(${tiltX * 0.6}px, ${tiltY * 0.6}px)`,
            }}
          />
        </picture>

        {/* Layer 2: Particle Canvas (Z-index: 20) */}
        <canvas
          ref={canvasRef}
          width={640}
          height={816}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20"
          style={{
            transform: `translate(${tiltX * 0.8}px, ${tiltY * 0.8}px)`,
          }}
        />

        {/* Layer 3: Front-Mask Occlusion Layer (Z-index: 30) */}
        <picture>
          <source srcSet={`${maskSrc2x} 2x, ${maskSrc1x} 1x`} type="image/webp" />
          <img
            src={maskSrc1x}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none z-30 transition-transform duration-75 ease-out"
            style={{
              transform: `translate(${tiltX}px, ${tiltY}px)`,
            }}
          />
        </picture>
      </div>

      {/* ── Visually Hidden Description for Accessibility ───────────────────── */}
      <span className="sr-only">
        Illustration of a quantum computer with three plates and a central column; animated glyphs show data flowing through its wiring.
      </span>

      {/* ── Readout Telemetry & Micro Caption ──────────────────────────────── */}
      <div className="mt-3 sm:mt-4 w-full flex flex-col gap-1.5 px-1 font-mono-light text-[10px] sm:text-[11px] tracking-wider text-[var(--text-secondary)] uppercase">
        {/* Real Vector Readout: Two fixed lines, nowrap units, zero stray separators */}
        <div className="flex flex-col gap-1 text-[10px] sm:text-[11px] font-mono">
          {/* Line 1: Angles */}
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span>THETA {telemetry.theta.toFixed(2)} RAD</span>
            <span className="text-[var(--text-tertiary)]">·</span>
            <span>PHI {telemetry.phi.toFixed(2)} RAD</span>
          </div>

          {/* Line 2: Probabilities & Measurement */}
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-[var(--col-standard)]">P(0) {telemetry.p0.toFixed(2)}</span>
            <span className="text-[var(--text-tertiary)]">·</span>
            <span className="text-[var(--col-critical)]">P(1) {telemetry.p1.toFixed(2)}</span>
            <span className="text-[var(--text-tertiary)]">·</span>
            <span className="text-[var(--text-primary)]">
              LAST MEASURE: {telemetry.lastMeasure !== null ? telemetry.lastMeasure : '—'}
            </span>
          </div>
        </div>

        {/* Nature of Render Disclaimer (Quiet Terminal Font) */}
        <div className="text-[9px] text-[var(--text-tertiary)] tracking-widest uppercase opacity-75">
          ILLUSTRATIVE RENDER · SIMULATED DATA FLOW
        </div>

        {/* Educational Caption */}
        <p className="text-[10px] tracking-normal text-[var(--text-tertiary)] max-w-[440px] normal-case leading-relaxed">
          A large fault-tolerant quantum computer running Shor's algorithm breaks RSA and ECC.
        </p>
      </div>
    </div>
  );
}
