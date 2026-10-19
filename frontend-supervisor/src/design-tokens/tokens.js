/**
 * PQC Secure Comm — Design Tokens
 * Phase R1: Dual-Theme System (Ember Dusk & Cream Dawn)
 * Canonical source for JS-driven styling (canvas, inline styles, recharts)
 * Keep in sync with tailwind.config.js and index.css
 */

export const THEMES = {
  dark: {
    name: 'Ember Dusk',
    surface: '#1a1410',
    surfaceElevated: 'rgba(255, 245, 230, 0.06)',
    surfaceInner: 'rgba(255, 245, 230, 0.040)',
    textPrimary: '#f0e8dc',
    textSecondary: '#a8a090',
    textTertiary: '#6b6460',
    textInverse: '#1a1410',
    border: 'rgba(255, 245, 230, 0.09)',
    borderActive: 'rgba(94, 234, 212, 0.38)',
    borderCritical: 'rgba(245, 158, 11, 0.38)',
    edge: {
      rest: 'rgba(255, 245, 230, 0.10)',
      hover: 'rgba(255, 245, 230, 0.13)',
      selectedT: 'rgba(255, 245, 230, 0.16)',
      selectedB: 'rgba(255, 245, 230, 0.10)',
    },
    ember: '#e8622c',
    standard: '#5eead4',
    critical: '#f59e0b',
    verified: '#22c55e',
    danger: '#ef4444',
    queue: '#a78bfa',
    chart: {
      grid: 'rgba(255, 245, 230, 0.06)',
      axis: '#6b6460',
    },
    glass: {
      l1: 'rgba(255, 245, 230, 0.04)',
      l2: 'rgba(255, 245, 230, 0.05)',
      l3: 'rgba(255, 245, 230, 0.10)',
    },
  },
  light: {
    name: 'Cream Dawn',
    surface: '#f0e8dc',
    surfaceElevated: 'rgba(42, 32, 24, 0.05)',
    surfaceInner: 'rgba(42, 32, 24, 0.04)',
    textPrimary: '#2a2018',
    textSecondary: '#6b5e50',
    textTertiary: '#9a8e80',
    textInverse: '#f0e8dc',
    border: 'rgba(42, 32, 24, 0.12)',
    borderActive: 'rgba(13, 148, 136, 0.45)',
    borderCritical: 'rgba(180, 83, 9, 0.45)',
    edge: {
      rest: 'rgba(42, 32, 24, 0.12)',
      hover: 'rgba(42, 32, 24, 0.16)',
      selectedT: 'rgba(42, 32, 24, 0.20)',
      selectedB: 'rgba(42, 32, 24, 0.12)',
    },
    ember: '#c2410c',
    standard: '#0d9488',
    critical: '#b45309',
    verified: '#15803d',
    danger: '#dc2626',
    queue: '#7c3aed',
    chart: {
      grid: 'rgba(42, 32, 24, 0.08)',
      axis: '#9a8e80',
    },
    glass: {
      l1: 'rgba(255, 250, 240, 0.28)',
      l2: 'rgba(255, 250, 240, 0.32)',
      l3: 'rgba(255, 250, 240, 0.58)',
    },
  },
};

export const COLOR = {
  ember: 'var(--col-ember)',
  standard: 'var(--col-standard)',
  critical: 'var(--col-critical)',
  verified: 'var(--col-verified)',
  danger: 'var(--col-danger)',
  queue: 'var(--col-queue)',
  pqc: 'var(--col-standard)',
  pqcDim: 'rgba(94, 234, 212, 0.15)',
  qkd: 'var(--col-critical)',
  qkdGlow: 'var(--col-critical)',
  qkdDim: 'rgba(245, 158, 11, 0.15)',
  bone: {
    DEFAULT: 'var(--text-primary)',
    muted: 'var(--text-secondary)',
    dim: 'var(--text-tertiary)',
  },
  border: 'var(--border)',
  borderActive: 'var(--border-active)',
  borderCritical: 'var(--border-critical)',
};

export const FONT = {
  sans: '"Urbanist", "Outfit", system-ui, sans-serif',
  display: '"Urbanist", "Outfit", system-ui, sans-serif',
  mono: '"Geist Mono", monospace',
};

export const MOTION = {
  spring: { stiffness: 300, damping: 28 },
  ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
  instant: 120,
  fast: 200,
  medium: 320,
  slow: 560,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

export const CHART = {
  grid: 'var(--border)',
  axis: 'var(--text-tertiary)',
  standard: 'var(--col-standard)',
  critical: 'var(--col-critical)',
  queue: 'var(--col-queue)',
  health: 'var(--col-verified)',
  danger: 'var(--col-danger)',
  pqc: 'var(--col-standard)',
  qkd: 'var(--col-critical)',
};

export const GLASS = {
  l1: 'var(--glass-l1-bg)',
  l2: 'var(--glass-l2-bg)',
  l3: 'var(--glass-l3-bg)',
};
