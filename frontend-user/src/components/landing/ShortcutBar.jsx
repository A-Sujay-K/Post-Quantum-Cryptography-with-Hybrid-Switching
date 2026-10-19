import React from 'react';

/**
 * ShortcutBar
 * Modeled on yannickgregoire.nl (Animation 8):
 * - Fixed bottom bar, 4 columns
 * - Each column has two stacked navigation items with inverted keycap squares
 * - Page content scrolls underneath and is clipped by it
 * - Invert toggles dark/light theme
 */
export default function ShortcutBar({
  activeSection = 'home',
  onNavigateSection,
  onNavigateRelative,
  onToggleTheme,
  resolvedTheme = 'dark'
}) {
  return (
    <nav
      aria-label="Keyboard Shortcuts"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--edge-rest)] bg-[var(--surface-bg)]/90 backdrop-blur-md px-4 sm:px-8 py-3 select-none text-[10px] md:text-[11px] font-mono-light uppercase tracking-wider"
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {/* Column 1: Home & Awareness */}
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => onNavigateSection('home')}
            className={`flex items-center gap-2 text-left transition-colors cursor-pointer group ${
              activeSection === 'home'
                ? 'text-[var(--text-primary)] font-medium'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span className={`px-1.5 py-0.5 rounded-[2px] font-mono text-[9px] font-bold tracking-tight transition-transform group-hover:scale-105 ${
              activeSection === 'home'
                ? 'bg-[var(--col-standard)] text-[var(--text-inverse)]'
                : 'bg-[var(--text-primary)] text-[var(--text-inverse)]'
            }`}>
              ^H
            </span>
            <span>HOME</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('awareness')}
            className={`flex items-center gap-2 text-left transition-colors cursor-pointer group ${
              activeSection === 'awareness'
                ? 'text-[var(--text-primary)] font-medium'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span className={`px-1.5 py-0.5 rounded-[2px] font-mono text-[9px] font-bold tracking-tight transition-transform group-hover:scale-105 ${
              activeSection === 'awareness'
                ? 'bg-[var(--col-standard)] text-[var(--text-inverse)]'
                : 'bg-[var(--text-primary)] text-[var(--text-inverse)]'
            }`}>
              ^A
            </span>
            <span>AWARENESS</span>
          </button>
        </div>

        {/* Column 2: Solution & Lanes */}
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => onNavigateSection('solution')}
            className={`flex items-center gap-2 text-left transition-colors cursor-pointer group ${
              activeSection === 'solution'
                ? 'text-[var(--text-primary)] font-medium'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span className={`px-1.5 py-0.5 rounded-[2px] font-mono text-[9px] font-bold tracking-tight transition-transform group-hover:scale-105 ${
              activeSection === 'solution'
                ? 'bg-[var(--col-standard)] text-[var(--text-inverse)]'
                : 'bg-[var(--text-primary)] text-[var(--text-inverse)]'
            }`}>
              ^S
            </span>
            <span>SOLUTION</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('lanes')}
            className={`flex items-center gap-2 text-left transition-colors cursor-pointer group ${
              activeSection === 'lanes'
                ? 'text-[var(--text-primary)] font-medium'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span className={`px-1.5 py-0.5 rounded-[2px] font-mono text-[9px] font-bold tracking-tight transition-transform group-hover:scale-105 ${
              activeSection === 'lanes'
                ? 'bg-[var(--col-standard)] text-[var(--text-inverse)]'
                : 'bg-[var(--text-primary)] text-[var(--text-inverse)]'
            }`}>
              ^L
            </span>
            <span>LANES</span>
          </button>
        </div>

        {/* Column 3: Page Up & Page Down */}
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => onNavigateRelative('up')}
            className="flex items-center gap-2 text-left text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer group"
          >
            <span className="px-1.5 py-0.5 rounded-[2px] bg-[var(--text-primary)] text-[var(--text-inverse)] font-mono text-[9px] font-bold tracking-tight group-hover:scale-105 transition-transform">
              ^▲
            </span>
            <span>PAGE UP</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateRelative('down')}
            className="flex items-center gap-2 text-left text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer group"
          >
            <span className="px-1.5 py-0.5 rounded-[2px] bg-[var(--text-primary)] text-[var(--text-inverse)] font-mono text-[9px] font-bold tracking-tight group-hover:scale-105 transition-transform">
              ^▼
            </span>
            <span>PAGE DOWN</span>
          </button>
        </div>

        {/* Column 4: Access & Invert */}
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => onNavigateSection('access')}
            className={`flex items-center gap-2 text-left transition-colors cursor-pointer group ${
              activeSection === 'access'
                ? 'text-[var(--text-primary)] font-medium'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span className={`px-1.5 py-0.5 rounded-[2px] font-mono text-[9px] font-bold tracking-tight transition-transform group-hover:scale-105 ${
              activeSection === 'access'
                ? 'bg-[var(--col-standard)] text-[var(--text-inverse)]'
                : 'bg-[var(--text-primary)] text-[var(--text-inverse)]'
            }`}>
              ^E
            </span>
            <span>ACCESS</span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className="flex items-center gap-2 text-left text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer group"
          >
            <span className="px-1.5 py-0.5 rounded-[2px] bg-[var(--text-primary)] text-[var(--text-inverse)] font-mono text-[9px] font-bold tracking-tight group-hover:scale-105 transition-transform">
              ^I
            </span>
            <span>INVERT ({resolvedTheme === 'dark' ? 'LIGHT' : 'DARK'})</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
