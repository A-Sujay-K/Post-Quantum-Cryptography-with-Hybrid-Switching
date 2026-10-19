import React from 'react';
import { useTheme } from './ThemeProvider';

/**
 * BackgroundStack — Universal Theme + Image Background System (Refined R1)
 * Cleaned stack (no linework, no lattice, no contour arcs):
 * 1. Base color fallback
 * 2. Fixed theme background image (dark.jpg / light.jpg) with soft light-band clarity
 * 3. Tiled film grain (0% on dark, <=1.2% on light)
 * 4. Lane-reactive ambient tint (max ~8-10%, no visible shapes)
 * 5. Foreground content
 */
export const BackgroundStack = ({
  children,
  className = '',
  variant = 'supervisor', // 'user' | 'supervisor'
  activeLane = 'standard', // 'standard' | 'critical'
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const isCritical = activeLane === 'critical';

  return (
    <div className={`relative min-h-screen w-full overflow-hidden text-[var(--text-primary)] ${className}`}>
      {/* Fixed Background Stack */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={{ contain: 'paint', transform: 'translateZ(0)' }}
        aria-hidden="true"
      >
        {/* Layer 1: Base color fallback to prevent flash before image loads */}
        <div
          className="absolute inset-0 transition-colors duration-500 ease-in-out"
          style={{ backgroundColor: isDark ? '#1a1410' : '#f0e8dc' }}
        />

        {/* Layer 1b: Theme Background Image with smooth crossfade */}
        {/* Dark image with slight brightness/contrast boost to ensure diagonal band is perceptible */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-in-out ${
            isDark ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url('/backgrounds/dark.jpg')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            filter: 'brightness(1.08) contrast(1.04)',
          }}
        />

        {/* Light image */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-in-out ${
            !isDark ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url('/backgrounds/light.jpg')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />

        {/* Layer 1c: Light theme subtle diagonal dark accent band (mirrors dark theme light ray) */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ease-in-out ${
            !isDark ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'linear-gradient(135deg, transparent 28%, rgba(55, 42, 32, 0.040) 40%, rgba(55, 42, 32, 0.075) 50%, rgba(55, 42, 32, 0.040) 60%, transparent 72%)',
            mixBlendMode: 'multiply',
          }}
        />

        {/* Layer 2: Film Grain (0% on dark since dark.jpg has grain; 1.2% on light to prevent banding) */}
        <div
          className={`absolute inset-0 mix-blend-overlay pointer-events-none transition-opacity duration-500 ${
            isDark ? 'opacity-0' : 'opacity-[0.012]'
          }`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Layer 3: Lane-Reactive Ambient Tint (max ~8-10%, pure ambient atmosphere, no visible shapes) */}
        {/* Standard Lane Tint (ice-teal) */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-[1200ms] ease-in-out motion-reduce:duration-0"
          style={{
            opacity: !isCritical ? (isDark ? 0.08 : 0.05) : 0,
            background: isDark
              ? 'radial-gradient(circle at 60% 40%, rgba(94,234,212,0.12) 0%, rgba(94,234,212,0.02) 50%, transparent 80%)'
              : 'radial-gradient(circle at 60% 40%, rgba(13,148,136,0.10) 0%, rgba(13,148,136,0.02) 50%, transparent 80%)',
          }}
        />

        {/* Critical Lane Tint (amber) */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-[1200ms] ease-in-out motion-reduce:duration-0"
          style={{
            opacity: isCritical ? (isDark ? 0.10 : 0.07) : 0,
            background: isDark
              ? 'radial-gradient(circle at 50% 50%, rgba(245,158,11,0.14) 0%, rgba(245,158,11,0.03) 50%, transparent 80%)'
              : 'radial-gradient(circle at 50% 50%, rgba(180,83,9,0.11) 0%, rgba(180,83,9,0.02) 50%, transparent 80%)',
          }}
        />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default BackgroundStack;
