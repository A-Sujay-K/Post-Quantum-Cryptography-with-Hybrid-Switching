/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand accent
        ember: {
          DEFAULT: 'var(--col-ember)',
          dark: '#e8622c',
          light: '#c2410c',
        },
        // Surfaces
        field: {
          base:    'var(--surface-bg)',
          mid:     'var(--field-mid)',
          accent1: 'var(--field-accent1)',
          accent2: 'var(--field-accent2)',
        },
        // Legacy ink aliases
        ink: {
          900: 'var(--ink-900)',
          800: 'var(--ink-800)',
          700: 'var(--ink-700)',
          600: 'var(--ink-600)',
          500: 'var(--ink-500)',
        },
        // Text
        bone: {
          DEFAULT: 'var(--text-primary)',
          muted:   'var(--text-secondary)',
          dim:     'var(--text-tertiary)',
        },
        // Semantic
        standard: {
          DEFAULT: 'var(--col-standard)',
          dim:     'rgba(94, 234, 212, 0.15)',
        },
        critical: {
          DEFAULT: 'var(--col-critical)',
          dim:     'rgba(245, 158, 11, 0.15)',
        },
        verified: 'var(--col-verified)',
        danger:   'var(--col-danger)',
        queue:    'var(--col-queue)',
        // Legacy aliases
        pqc: {
          DEFAULT: 'var(--col-standard)',
          dim:     'rgba(94, 234, 212, 0.15)',
        },
        qkd: {
          DEFAULT: 'var(--col-critical)',
          glow:    'var(--col-critical)',
          dim:     'rgba(245, 158, 11, 0.15)',
        },
        'accent': {
          blue:    'var(--col-standard)',
          emerald: 'var(--col-verified)',
          purple:  'var(--col-queue)',
          gold:    'var(--col-critical)',
        },
        'dark': {
          bg:          'var(--surface-bg)',
          surface:     'var(--surface-inner)',
          surfaceHover:'var(--surface-elevated)',
        },
        health: {
          good:     'var(--col-verified)',
          warning:  'var(--col-critical)',
          critical: 'var(--col-danger)',
        },
      },

      fontFamily: {
        sans:    ['"Geist Variable"', '"Geist"', 'system-ui', 'sans-serif'],
        display: ['"Geist Variable"', '"Geist"', 'system-ui', 'sans-serif'],
        mono:    ['"Geist Mono"', 'monospace'],
      },

      fontSize: {
        'xs':     ['clamp(0.6875rem, 1.2vw, 0.75rem)',   { lineHeight: '1.4' }],
        'sm':     ['clamp(0.75rem,   1.4vw, 0.875rem)',  { lineHeight: '1.5' }],
        'base':   ['clamp(0.875rem,  1.6vw, 1rem)',      { lineHeight: '1.6' }],
        'md':     ['clamp(1rem,      1.8vw, 1.125rem)',  { lineHeight: '1.5' }],
        'lg':     ['clamp(1.25rem,   2.2vw, 1.5rem)',    { lineHeight: '1.3' }],
        'xl':     ['clamp(1.75rem,   3vw,   2.25rem)',   { lineHeight: '1.1', fontVariantNumeric: 'tabular-nums' }],
        '2xl':    ['clamp(2.25rem,   4vw,   3rem)',      { lineHeight: '1',   fontVariantNumeric: 'tabular-nums' }],
        'metric': ['1.5rem',                             { lineHeight: '1',   fontVariantNumeric: 'tabular-nums' }],
      },

      spacing: {
        '18': '4.5rem',
      },

      borderRadius: {
        'panel': '12px',
        'card':  '10px',
        'pill':  '999px',
        'seal':  '4px',
      },

      transitionDuration: {
        'instant': '120ms',
        'fast':    '200ms',
        'medium':  '320ms',
        'slow':    '560ms',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      animation: {
        'enter':      'enter 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'enter-slow': 'enterSlow 320ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in':    'fadeIn 200ms ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in':   'enter 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-glow': 'fadeIn 0.01ms linear forwards',
        'threat-ping':'fadeIn 0.01ms linear forwards',
      },
      keyframes: {
        enter: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        enterSlow: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
