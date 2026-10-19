import React, { useEffect, useRef, useState, useCallback } from 'react';

const LUMINANCE_RAMP = ' .,:-=+*#%@';
const NOISE_CHARS = '▒░█▓%#*+=-:·';

/**
 * QubitHero
 * Real-time 2D Canvas ASCII Bloch Sphere renderer.
 * Features:
 * - Analytic 3D spherical shading with top-left illumination
 * - Equator and prime meridian rings
 * - Poles labelled |0> (north) and |1> (south)
 * - State vector |psi> with arrowhead glyph
 * - Live telemetry readout (theta, phi, P(0), P(1))
 * - Cursor tracking with spring damping
 * - Interactive measurement collapse (Click / Tap / Key 'M')
 * - Staggered slice-collapse on scroll exit
 */
export default function QubitHero({ scrollProgress = 0, className = '' }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameRef = useRef(null);
  const isVisibleRef = useRef(true);

  // Quantum state
  const [telemetry, setTelemetry] = useState({
    theta: 0.96,
    phi: 1.57,
    p0: 0.79,
    p1: 0.21,
    status: 'SUPERPOSITION'
  });

  const stateRef = useRef({
    theta: 0.96,
    phi: 1.57,
    p0: 0.79,
    p1: 0.21,
    targetTheta: 0.96,
    targetPhi: 1.57,
    tiltX: 0,
    tiltY: 0,
    targetTiltX: 0,
    targetTiltY: 0,
    isCollapsed: false,
    collapsedBit: null,
    collapseBurst: 0, // 0 to 1 noise intensity
    time: 0,
    lastTime: performance.now(),
  });

  // Check prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Measurement collapse handler
  const triggerCollapse = useCallback(() => {
    const s = stateRef.current;
    if (s.isCollapsed) return;

    s.isCollapsed = true;
    s.collapseBurst = 1.0;

    // Quantum probability collapse
    const r = Math.random();
    const bit = r < s.p0 ? 0 : 1;
    s.collapsedBit = bit;
    s.targetTheta = bit === 0 ? 0.05 : Math.PI - 0.05;

    setTelemetry((prev) => ({
      ...prev,
      p0: bit === 0 ? 1.0 : 0.0,
      p1: bit === 1 ? 1.0 : 0.0,
      status: `COLLAPSED: |${bit}>`
    }));

    // Auto-return to superposition after ~1.2s per specification
    setTimeout(() => {
      s.isCollapsed = false;
      s.collapseBurst = 0.5;
      s.targetTheta = 0.96;
      s.targetPhi = 1.57;

      setTimeout(() => {
        s.collapseBurst = 0;
        setTelemetry((prev) => ({
          ...prev,
          status: 'SUPERPOSITION'
        }));
      }, 300);
    }, 1200);
  }, []);

  // Keyboard shortcut listener ('M' for measure)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        triggerCollapse();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerCollapse]);

  // Mouse / Pointer tracking
  const handlePointerMove = (e) => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1

    const s = stateRef.current;
    s.targetTiltX = nx * 0.45;
    s.targetTiltY = ny * 0.35;

    if (!s.isCollapsed) {
      s.targetTheta = Math.max(0.2, Math.min(Math.PI - 0.2, 0.96 + ny * 0.6));
      s.targetPhi = 1.57 + nx * 1.2;
    }
  };

  const handlePointerLeave = () => {
    const s = stateRef.current;
    s.targetTiltX = 0;
    s.targetTiltY = 0;
    if (!s.isCollapsed) {
      s.targetTheta = 0.96;
      s.targetPhi = 1.57;
    }
  };

  // Visibility detection (pause when offscreen or hidden)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    const handleVisibility = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    // Grid configuration: ~110 columns x ~55 rows
    const COLS = 104;
    const ROWS = 52;
    const CELL_W = 6;
    const CELL_H = 10;

    canvas.width = COLS * CELL_W;
    canvas.height = ROWS * CELL_H;

    let lastTelemetryUpdate = 0;

    const render = (now) => {
      if (!isVisibleRef.current) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const s = stateRef.current;
      const dt = Math.min(0.05, (now - s.lastTime) / 1000);
      s.lastTime = now;
      s.time += dt;

      // Spring damping physics
      s.tiltX += (s.targetTiltX - s.tiltX) * 0.12;
      s.tiltY += (s.targetTiltY - s.tiltY) * 0.12;

      if (!s.isCollapsed) {
        // Precession oscillation
        const idlePhi = s.targetPhi + s.time * 0.35;
        const idleTheta = s.targetTheta + Math.sin(s.time * 0.7) * 0.08;
        s.phi += (idlePhi - s.phi) * 0.1;
        s.theta += (idleTheta - s.theta) * 0.1;
      } else {
        s.theta += (s.targetTheta - s.theta) * 0.2;
        s.phi += (s.targetPhi - s.phi) * 0.2;
      }

      // Compute quantum probabilities
      const p0 = Math.cos(s.theta / 2) ** 2;
      const p1 = Math.sin(s.theta / 2) ** 2;
      s.p0 = p0;
      s.p1 = p1;

      // Decay noise burst
      if (s.collapseBurst > 0) {
        s.collapseBurst = Math.max(0, s.collapseBurst - dt * 2.2);
      }

      // Throttle telemetry state updates to ~15fps for UI smooth performance
      if (now - lastTelemetryUpdate > 65) {
        lastTelemetryUpdate = now;
        setTelemetry((prev) => ({
          ...prev,
          theta: s.theta,
          phi: s.phi,
          p0: s.isCollapsed ? (s.collapsedBit === 0 ? 1 : 0) : p0,
          p1: s.isCollapsed ? (s.collapsedBit === 1 ? 1 : 0) : p1
        }));
      }

      // Check theme
      const isDark = document.documentElement.dataset.theme !== 'light';
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Colors
      const colPrimary = isDark ? '#f0e8dc' : '#2a2018';
      const colSecondary = isDark ? '#8c8276' : '#8c8074';
      const colTeal = isDark ? '#5eead4' : '#0d9488';
      const colAmber = isDark ? '#f59e0b' : '#d97706';

      ctx.font = '300 9px "Geist Mono", monospace';
      ctx.textBaseline = 'top';

      const cx = Math.floor(COLS / 2);
      const cy = Math.floor(ROWS / 2);
      const radiusX = 28;
      const radiusY = 20;

      // Light vector from top-left front: [-0.5, -0.6, 0.62]
      const lx = -0.52;
      const ly = -0.58;
      const lz = 0.62;

      // Vector |psi> position on unit sphere:
      // Physics: x = sin(theta)*cos(phi), y = cos(theta), z = sin(theta)*sin(phi)
      const vx = Math.sin(s.theta) * Math.cos(s.phi);
      const vy = -Math.cos(s.theta); // -y is up in canvas
      const vz = Math.sin(s.theta) * Math.sin(s.phi);

      // Sphere rotation matrix (idle + tilt)
      const rotY = s.tiltX + (s.time * 0.15);
      const rotX = -s.tiltY;
      const cosRY = Math.cos(rotY);
      const sinRY = Math.sin(rotY);
      const cosRX = Math.cos(rotX);
      const sinRX = Math.sin(rotX);

      // Slice-collapse parameter (when scrolling away)
      const collapse = Math.min(1, Math.max(0, scrollProgress));

      // Generate cell grid
      for (let r = 0; r < ROWS; r++) {
        // Staggered slice-collapse horizontal shift for animation 6
        let xOffset = 0;
        let rowOpacity = 1;

        if (collapse > 0) {
          const rowStagger = Math.sin(r * 0.35 + s.time) * (r % 2 === 0 ? 1 : -1);
          xOffset = rowStagger * collapse * 180;
          rowOpacity = Math.max(0, 1 - collapse * 1.5);
        }

        if (rowOpacity <= 0) continue;

        for (let c = 0; c < COLS; c++) {
          const dx = (c - cx) / radiusX;
          const dy = (r - cy) / radiusY;
          const distSq = dx * dx + dy * dy;

          let char = ' ';
          let charColor = colSecondary;

          // 1. Noise burst override
          if (s.collapseBurst > 0 && Math.random() < s.collapseBurst * 0.75) {
            char = NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)];
            charColor = Math.random() > 0.5 ? colAmber : colTeal;
            ctx.fillStyle = charColor;
            ctx.fillText(char, c * CELL_W + xOffset, r * CELL_H);
            continue;
          }

          // 2. Axis North |0> and South |1> labels
          if (c === cx && r === cy - radiusY - 2) {
            ctx.fillStyle = colTeal;
            ctx.fillText('|0>', (c - 1) * CELL_W + xOffset, r * CELL_H);
            continue;
          }
          if (c === cx && r === cy + radiusY + 1) {
            ctx.fillStyle = colAmber;
            ctx.fillText('|1>', (c - 1) * CELL_W + xOffset, r * CELL_H);
            continue;
          }

          if (distSq <= 1.0) {
            // Front hemisphere 3D point
            const dz = Math.sqrt(Math.max(0, 1.0 - distSq));

            // Apply 3D rotation
            // 1. Rotate around Y
            const x1 = dx * cosRY + dz * sinRY;
            const z1 = -dx * sinRY + dz * cosRY;
            // 2. Rotate around X
            const y2 = dy * cosRX - z1 * sinRX;
            const z2 = dy * sinRX + z1 * cosRX;

            // Surface normal
            const nx = x1;
            const ny = y2;
            const nz = z2;

            // Diffuse Lambertian luminance
            const diffuse = Math.max(0, nx * lx + ny * ly + nz * lz);
            const rampIndex = Math.min(
              LUMINANCE_RAMP.length - 1,
              Math.max(0, Math.floor(diffuse * (LUMINANCE_RAMP.length - 1)))
            );
            char = LUMINANCE_RAMP[rampIndex];

            // 3. Equator Ring (y2 ~ 0)
            if (Math.abs(y2) < 0.08) {
              char = '=';
              charColor = colPrimary;
            }

            // 4. Prime Meridian Ring (x1 ~ 0)
            if (Math.abs(x1) < 0.06) {
              char = ':';
              charColor = colSecondary;
            }

            // 5. State vector line rendering from center (0,0) to tip (vx, vy)
            // Interpolate ray from origin (0,0) to rotated vector
            const vRotX = vx * cosRY + vz * sinRY;
            const vRotZ = -vx * sinRY + vz * cosRY;
            const vRotY = vy * cosRX - vRotZ * sinRX;

            const vDistSq = (dx - vRotX) ** 2 + (dy - vRotY) ** 2;

            // Arrowhead at tip
            if (vDistSq < 0.04) {
              char = s.isCollapsed ? (s.collapsedBit === 0 ? '▲' : '▼') : '◆';
              charColor = s.isCollapsed ? (s.collapsedBit === 0 ? colTeal : colAmber) : colPrimary;
            } else {
              // Check if point lies on line segment from (0,0) to (vRotX, vRotY)
              const lineLen = Math.hypot(vRotX, vRotY);
              if (lineLen > 0.05) {
                const dot = (dx * vRotX + dy * vRotY) / (lineLen * lineLen);
                if (dot >= 0 && dot <= 1.0) {
                  const perpDist = Math.hypot(dx - dot * vRotX, dy - dot * vRotY);
                  if (perpDist < 0.055) {
                    char = '*';
                    charColor = colTeal;
                  }
                }
              }
            }

            // Outer sphere boundary silhouette
            if (distSq > 0.92) {
              char = '.';
              charColor = colSecondary;
            }
          }

          if (char !== ' ') {
            ctx.fillStyle = charColor;
            ctx.fillText(char, c * CELL_W + xOffset, r * CELL_H);
          }
        }
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
      className={`w-full flex flex-col items-center select-none ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={triggerCollapse}
      role="region"
      aria-label="Interactive Bloch Sphere Qubit Visualizer"
    >
      {/* Screen reader live announcement */}
      <span className="sr-only">
        Interactive Bloch sphere representing a qubit state vector in {telemetry.status}.
        Current probability P(0) is {telemetry.p0.toFixed(2)}, P(1) is {telemetry.p1.toFixed(2)}.
        Click or press M to perform measurement collapse.
      </span>

      {/* Canvas Frame */}
      <div className="w-full max-w-[480px] min-h-[350px] rounded-lg border border-[var(--edge-rest)] bg-[var(--surface-inner)]/25 backdrop-blur-sm flex flex-col items-center justify-between p-3.5 relative overflow-hidden group hover:border-[var(--edge-hover)] transition-colors cursor-crosshair">
        {/* Top Header inside frame */}
        <div className="w-full flex-shrink-0 flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] border-b border-[var(--edge-rest)] pb-1.5 px-1">
          <span className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${stateRef.current.isCollapsed ? 'bg-[var(--col-critical)] animate-ping' : 'bg-[var(--col-standard)]'}`} />
            <span>BLOCH SPHERE · 120×60 ASCII</span>
          </span>
          <span className="text-[var(--text-secondary)] font-medium">
            {telemetry.status}
          </span>
        </div>

        {/* 2D HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="w-full h-auto max-h-[230px] object-contain my-auto py-1"
        />

        {/* Real-time Telemetry Readout */}
        <div className="w-full flex-shrink-0 pt-2 border-t border-[var(--edge-rest)] px-1 flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <span>θ: {telemetry.theta.toFixed(2)} rad</span>
            <span>·</span>
            <span>φ: {telemetry.phi.toFixed(2)} rad</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <span className="text-[var(--col-standard)]">
              P(0): {telemetry.p0.toFixed(2)}
            </span>
            <span>·</span>
            <span className="text-[var(--col-critical)]">
              P(1): {telemetry.p1.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Prompt Pill */}
        <div className="w-full flex-shrink-0 mt-1 text-[8px] md:text-[9px] uppercase tracking-wider text-[var(--text-tertiary)] text-center">
          [ CLICK / TAP / KEY 'M' TO MEASURE &amp; COLLAPSE ]
        </div>
      </div>

      {/* Accurate Caption in Terminal Font */}
      <p className="mt-3 text-[10px] md:text-[11px] leading-relaxed text-[var(--text-secondary)] uppercase max-w-[480px] tracking-wide font-mono-light text-left w-full">
        A large fault-tolerant quantum computer running Shor's algorithm breaks RSA and ECC.
      </p>
    </div>
  );
}
