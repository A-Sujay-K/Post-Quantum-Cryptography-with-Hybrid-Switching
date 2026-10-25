import React, { useEffect, useRef, useState, useCallback } from 'react';

const LUMINANCE_RAMP = ' .,:-=+*#%@';
const NOISE_CHARS = '▒░█▓%#*+=-:·';
const DETECTION_GLYPHS = ['.', '+', '·', ':'];

/**
 * QubitHero — "SUPERPOSITION CLOUD"
 * Awwwards-level creative ASCII quantum volume renderer.
 *
 * Concepts:
 * - Two quantum-orbital lobes: upper |0>, lower |1>, state |psi> = alpha|0> + beta|1>
 * - Density ratio P(0):P(1) where P(0) = cos^2(theta/2), P(1) = sin^2(theta/2)
 * - Thin torus waist ring of dense glyphs where lobes meet
 * - Faint standing-wave phase pattern with radial shimmer
 * - Stochastic scatter of transient detection points (double-slit accumulation)
 * - Pointer move tilts the cloud with spring damping (face tracking feel)
 * - Click, Tap, or Key 'M' triggers wave-function measurement collapse into ONE lobe
 *   with an expanding ASCII noise shockwave and flash detection point, re-expanding after 1.2s
 * - Slice-collapse scroll transitions: rows displace horizontally with alternating stagger
 * - 60fps budget optimization, DPR-aware, reduced motion fallback, full ARIA compliance
 */
export default function QubitHero({ scrollProgress = 0, className = '' }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameRef = useRef(null);
  const isVisibleRef = useRef(true);

  // Live telemetry readout state
  const [telemetry, setTelemetry] = useState({
    theta: 1.00,
    phi: 4.94,
    p0: 0.77,
    p1: 0.23,
    lastMeasure: null,
    status: 'SUPERPOSITION'
  });

  // State ref for high-frequency 60fps physics
  const stateRef = useRef({
    theta: 1.00,
    phi: 4.94,
    p0: 0.77,
    p1: 0.23,
    targetTheta: 1.00,
    targetPhi: 4.94,
    tiltX: 0,
    tiltY: 0,
    targetTiltX: 0,
    targetTiltY: 0,
    // Collapse physics
    isCollapsed: false,
    collapsedBit: null,
    collapseTimer: 0,
    shockRadius: 0,
    shockActive: false,
    detectionPoint: null,
    // Transient particles
    detections: [], // { x, y, glyph, age, maxAge }
    time: 0,
    lastTime: performance.now(),
  });

  // Check prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Wave-function measurement collapse
  const triggerCollapse = useCallback(() => {
    const s = stateRef.current;
    if (s.isCollapsed) return;

    // Quantum coin-flip weighted by P(0)
    const outcome = Math.random() < s.p0 ? 0 : 1;
    s.isCollapsed = true;
    s.collapsedBit = outcome;
    s.collapseTimer = 1.2; // 1.2s recovery duration
    s.shockRadius = 0;
    s.shockActive = true;
    s.detectionPoint = {
      x: 60 + (Math.random() - 0.5) * 8,
      y: outcome === 0 ? 18 : 42,
      brightness: 1.0
    };

    setTelemetry((prev) => ({
      ...prev,
      lastMeasure: outcome,
      status: `COLLAPSED |${outcome}⟩`
    }));
  }, []);

  // Keyboard shortcut: Key 'M' triggers measurement collapse
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.key === 'm' || e.key === 'M') {
        triggerCollapse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerCollapse]);

  // Pointer tracking with spring physics
  const handlePointerMove = (e) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    const s = stateRef.current;
    s.targetTiltX = ny * 0.45;
    s.targetTiltY = nx * 0.55;
    // Shift theta and phi toward cursor
    s.targetTheta = Math.max(0.25, Math.min(Math.PI - 0.25, 1.0 + ny * 0.7));
    s.targetPhi = (4.94 + nx * 1.5 + Math.PI * 2) % (Math.PI * 2);
  };

  const handlePointerLeave = () => {
    const s = stateRef.current;
    s.targetTiltX = 0;
    s.targetTiltY = 0;
    s.targetTheta = 1.00;
    s.targetPhi = 4.94;
  };

  // Visibility and offscreen observer
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0].isIntersecting && !document.hidden;
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
    };
  }, []);

  // Main 60fps render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    const COLS = 120;
    const ROWS = 60;
    const CELL_W = 4;
    const CELL_H = 7;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = COLS * CELL_W * dpr;
    canvas.height = ROWS * CELL_H * dpr;
    ctx.scale(dpr, dpr);

    const render = (now) => {
      if (!isVisibleRef.current) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const s = stateRef.current;
      const dt = Math.min(0.04, (now - s.lastTime) / 1000);
      s.lastTime = now;
      s.time += dt;

      // Spring damping physics
      s.tiltX += (s.targetTiltX - s.tiltX) * 0.08;
      s.tiltY += (s.targetTiltY - s.tiltY) * 0.08;
      s.theta += (s.targetTheta - s.theta) * 0.08;
      s.phi += (s.targetPhi - s.phi) * 0.08;

      s.p0 = Math.cos(s.theta / 2) ** 2;
      s.p1 = Math.sin(s.theta / 2) ** 2;

      // Update collapse recovery timer
      if (s.isCollapsed) {
        s.collapseTimer -= dt;
        if (s.shockActive) {
          s.shockRadius += dt * 55; // expanding shockwave
          if (s.shockRadius > 70) s.shockActive = false;
        }
        if (s.collapseTimer <= 0) {
          s.isCollapsed = false;
          s.collapsedBit = null;
          s.shockActive = false;
          s.detectionPoint = null;
          setTelemetry((prev) => ({
            ...prev,
            status: 'SUPERPOSITION'
          }));
        }
      }

      // Update detections particle buffer
      if (Math.random() < 0.35 && s.detections.length < 40) {
        // Sample random point around lobes
        const isUpper = Math.random() < s.p0;
        const cy = isUpper ? 20 : 40;
        const rx = (Math.random() - 0.5) * 28;
        const ry = (Math.random() - 0.5) * 16;
        s.detections.push({
          c: Math.floor(COLS / 2 + rx),
          r: Math.floor(cy + ry),
          glyph: DETECTION_GLYPHS[Math.floor(Math.random() * DETECTION_GLYPHS.length)],
          age: 0,
          maxAge: 1.2 + Math.random() * 1.0
        });
      }

      for (let i = s.detections.length - 1; i >= 0; i--) {
        const d = s.detections[i];
        d.age += dt;
        if (d.age >= d.maxAge) {
          s.detections.splice(i, 1);
        }
      }

      // Sync telemetry throttle
      if (Math.floor(s.time * 15) % 3 === 0) {
        setTelemetry((prev) => ({
          ...prev,
          theta: s.theta,
          phi: s.phi,
          p0: s.p0,
          p1: s.p1
        }));
      }

      ctx.clearRect(0, 0, COLS * CELL_W, ROWS * CELL_H);
      ctx.font = `${CELL_H}px "Geist Mono", monospace`;
      ctx.textBaseline = 'top';

      const isDark = document.documentElement.dataset.theme !== 'light';
      const charColor = isDark ? '#f0e8dc' : '#2a2018';
      const dimColor = isDark ? 'rgba(240, 232, 220, 0.22)' : 'rgba(42, 32, 24, 0.22)';
      const accentTeal = isDark ? '#5eead4' : '#0d9488';
      const accentAmber = isDark ? '#f59e0b' : '#b45309';

      const cx = COLS / 2;
      const cy = ROWS / 2;
      const rotY = s.time * 0.32 + s.tiltY;
      const rotX = s.tiltX;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Model parameters
      const breathing = Math.sin(s.time * 1.5) * 1.2;
      const y0 = 12 + breathing;
      const sigSq = 120;
      const rWaist = 14;
      const sigWSq = 14;

      // Slice-collapse parameters on scroll
      const isSlicing = scrollProgress > 0.005;

      // Calculate effective lobe weights based on collapse state
      let activeP0 = s.p0;
      let activeP1 = s.p1;
      if (s.isCollapsed) {
        if (s.collapsedBit === 0) {
          activeP0 = 1.0;
          activeP1 = 0.0;
        } else {
          activeP0 = 0.0;
          activeP1 = 1.0;
        }
      }

      for (let r = 0; r < ROWS; r++) {
        // Staggered slice-collapse row displacement
        let xOffset = 0;
        if (isSlicing) {
          const sliceDir = r % 2 === 0 ? 1 : -1;
          const stagger = ((r % 9) / 9) * 0.45;
          const effProgress = Math.max(0, scrollProgress - stagger);
          xOffset = sliceDir * effProgress * 320;
        }

        const yNorm = (r - cy);
        if (Math.abs(yNorm) > 28) continue;

        for (let c = 0; c < COLS; c++) {
          const xNorm = (c - cx) * 0.6;
          const distSq2D = xNorm * xNorm + yNorm * yNorm;
          if (distSq2D > 750) continue;

          // Outward shockwave ring override
          if (s.shockActive) {
            const distFromCenter = Math.sqrt(distSq2D);
            if (Math.abs(distFromCenter - s.shockRadius) < 2.5) {
              const noiseGlyph = NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)];
              ctx.fillStyle = s.collapsedBit === 0 ? accentTeal : accentAmber;
              ctx.fillText(noiseGlyph, c * CELL_W + xOffset, r * CELL_H);
              continue;
            }
          }

          // 10-step ray accumulation
          let density = 0;
          let lightFactor = 0;

          for (let z = -18; z <= 18; z += 4) {
            // Un-rotate coordinates back into model space
            const xr = xNorm * cosY - z * sinY;
            const zr = xNorm * sinY + z * cosY;
            const yr = yNorm * cosX - zr * sinX;
            const zrr = yNorm * sinX + zr * cosX;

            // Upper lobe |0>
            const d0 = activeP0 * Math.exp(-(xr * xr + (yr - y0) * (yr - y0) * 0.8 + zrr * zrr) / sigSq);
            // Lower lobe |1>
            const d1 = activeP1 * Math.exp(-(xr * xr + (yr + y0) * (yr + y0) * 0.8 + zrr * zrr) / sigSq);
            // Waist torus ring
            const rXZ = Math.sqrt(xr * xr + zrr * zrr);
            const dW = 0.35 * Math.exp(-(yr * yr + (rXZ - rWaist) * (rXZ - rWaist)) / sigWSq);

            const stepD = d0 + d1 + dW;
            if (stepD > 0.015) {
              density += stepD;
              // Directional lighting from top-left: light vector (-0.577, -0.577, 0.577)
              lightFactor += stepD * (1.0 + (xr * -0.45 + yr * -0.55 + zrr * 0.35) / 20);
            }
          }

          if (density > 0.05) {
            // Standing wave radial shimmer
            const r3D = Math.sqrt(distSq2D);
            const shimmer = 1.0 + 0.16 * Math.sin(0.4 * r3D - 2.2 * s.time + s.phi);
            const totalIntensity = density * shimmer * (lightFactor / (density || 1));

            const charIdx = Math.min(
              LUMINANCE_RAMP.length - 1,
              Math.max(0, Math.floor(totalIntensity * 0.65 * (LUMINANCE_RAMP.length - 1)))
            );
            const char = LUMINANCE_RAMP[charIdx];

            // Render glyph
            if (totalIntensity > 0.75) {
              ctx.fillStyle = charColor;
            } else {
              ctx.fillStyle = dimColor;
            }

            ctx.fillText(char, c * CELL_W + xOffset, r * CELL_H);
          }
        }
      }

      // Draw transient detection points
      for (const d of s.detections) {
        const alpha = Math.max(0, 1.0 - d.age / d.maxAge);
        ctx.fillStyle = isDark
          ? `rgba(94, 234, 212, ${alpha.toFixed(2)})`
          : `rgba(13, 148, 136, ${alpha.toFixed(2)})`;
        ctx.fillText(d.glyph, d.c * CELL_W, d.r * CELL_H);
      }

      // Draw bright collapsed detection flash
      if (s.detectionPoint && s.detectionPoint.brightness > 0) {
        ctx.fillStyle = s.collapsedBit === 0 ? accentTeal : accentAmber;
        ctx.fillText('█', s.detectionPoint.x * CELL_W, s.detectionPoint.y * CELL_H);
        s.detectionPoint.brightness -= dt * 1.5;
      }

      if (!prefersReducedMotion) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [scrollProgress, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`w-full flex flex-col items-start select-none cursor-pointer ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={triggerCollapse}
      role="region"
      aria-label="Interactive Superposition Quantum Cloud Visualizer"
    >
      {/* Screen reader live announcement */}
      <span className="sr-only">
        Interactive quantum superposition cloud representing a qubit state vector in {telemetry.status}.
        Upper lobe represents |0⟩ with probability {telemetry.p0.toFixed(2)}.
        Lower lobe represents |1⟩ with probability {telemetry.p1.toFixed(2)}.
        Click, tap, or press key M to measure and collapse the wavefunction.
      </span>

      {/* Unboxed 2D HTML5 Canvas sitting directly on the background */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="w-full max-w-[460px] h-auto max-h-[320px] object-contain transition-transform duration-200"
      />

      {/* Readout beside / below the art in terminal font without card chrome */}
      <div className="w-full max-w-[460px] pt-3 text-[10px] md:text-[11px] font-mono tracking-wider text-[var(--text-secondary)] uppercase flex flex-wrap items-center gap-x-2 gap-y-1">
        <span>THETA {telemetry.theta.toFixed(2)} RAD</span>
        <span>·</span>
        <span>PHI {telemetry.phi.toFixed(2)} RAD</span>
        <span>·</span>
        <span className="text-[var(--col-standard)]">P(0) {telemetry.p0.toFixed(2)}</span>
        <span>·</span>
        <span className="text-[var(--col-critical)]">P(1) {telemetry.p1.toFixed(2)}</span>
        <span>·</span>
        <span>
          LAST MEASURE: {telemetry.lastMeasure !== null ? telemetry.lastMeasure : '—'}
        </span>
      </div>

      {/* Accurate Caption in Terminal Font */}
      <p className="mt-2 text-[10px] md:text-[11px] leading-relaxed text-[var(--text-tertiary)] uppercase max-w-[460px] tracking-wide font-mono-light text-left">
        A LARGE FAULT-TOLERANT QUANTUM COMPUTER RUNNING SHOR'S ALGORITHM BREAKS RSA AND ECC.
      </p>
    </div>
  );
}
