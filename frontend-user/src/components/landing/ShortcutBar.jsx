import React from 'react';

/**
 * ShortcutBar
 * Modeled on yannickgregoire.nl (Animation 8 & Reference Frames 1-4):
 * - Slim floating liquid glass capsule with generous margins
 * - Content scrolls under it and is clipped by the viewport padding
 * - 3 columns with inverted key-cap squares:
 *     Column 1: [^H] HOME / [^A] AWARENESS
 *     Column 2: [^↑] PAGE UP / [^↓] PAGE DOWN
 *     Column 3: [^E] ACCESS / [^I] INVERT
 * - Invert keycap toggles Dark/Light theme
 * - Accessible buttons with keyboard input guards
 */
export default function ShortcutBar({
  activeSection = 'home',
  onNavigateSection,
  onNavigateRelative,
  onToggleTheme,
  resolvedTheme = 'dark',
  keyboardActive = true,
  onToggleKeyboard = null
}) {
  return (
    <nav
      aria-label="Keyboard Navigation Capsule"
      className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[960px] rounded-[20px] sm:rounded-full border border-[var(--edge-rest)] bg-[var(--surface-bg)]/75 backdrop-blur-[24px] backdrop-saturate-[130%] shadow-[0_16px_40px_-10px_rgba(0,0,0,0.45)] px-4 sm:px-8 py-2.5 sm:py-3 select-none text-[9px] sm:text-[10px] md:text-[11px] font-mono-light uppercase tracking-wider"
    >
      <div className="grid grid-cols-3 gap-2 sm:gap-6 md:gap-10 items-center">
        {/* Column 1: Home & Awareness */}
        <div className="flex flex-col gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={() => onNavigateSection('home')}
            aria-label="Navigate to Home section"
            className={`flex items-center gap-1.5 sm:gap-2 text-left transition-colors cursor-pointer group ${
              activeSection === 'home'
                ? 'text-[var(--text-primary)] font-medium'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span
              className={`w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-[3px] font-mono text-[8px] sm:text-[9px] font-bold leading-none tracking-tight transition-transform group-hover:scale-105 shrink-0 ${
                activeSection === 'home'
                  ? 'bg-[var(--col-standard)] text-[var(--text-inverse)] shadow-[0_0_8px_rgba(94,234,212,0.4)]'
                  : 'bg-[var(--text-primary)] text-[var(--text-inverse)]'
              }`}
            >
              ^H
            </span>
            <span className="truncate">HOME</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('awareness')}
            aria-label="Navigate to Awareness section"
            className={`flex items-center gap-1.5 sm:gap-2 text-left transition-colors cursor-pointer group ${
              activeSection === 'awareness'
                ? 'text-[var(--text-primary)] font-medium'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span
              className={`w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-[3px] font-mono text-[8px] sm:text-[9px] font-bold leading-none tracking-tight transition-transform group-hover:scale-105 shrink-0 ${
                activeSection === 'awareness'
                  ? 'bg-[var(--col-standard)] text-[var(--text-inverse)] shadow-[0_0_8px_rgba(94,234,212,0.4)]'
                  : 'bg-[var(--text-primary)] text-[var(--text-inverse)]'
              }`}
            >
              ^A
            </span>
            <span className="truncate">AWARENESS</span>
          </button>
        </div>

        {/* Column 2: Page Up & Page Down */}
        <div className="flex flex-col gap-1 sm:gap-1.5 border-x border-[var(--edge-rest)] px-2 sm:px-6 md:px-8">
          <button
            type="button"
            onClick={() => onNavigateRelative('up')}
            aria-label="Navigate to previous section"
            className="flex items-center gap-1.5 sm:gap-2 text-left text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer group"
          >
            <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-[3px] font-mono text-[8px] sm:text-[9px] font-bold leading-none tracking-tight bg-[var(--text-primary)] text-[var(--text-inverse)] transition-transform group-hover:scale-105 shrink-0">
              ^↑
            </span>
            <span className="truncate">PAGE UP</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateRelative('down')}
            aria-label="Navigate to next section"
            className="flex items-center gap-1.5 sm:gap-2 text-left text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer group"
          >
            <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-[3px] font-mono text-[8px] sm:text-[9px] font-bold leading-none tracking-tight bg-[var(--text-primary)] text-[var(--text-inverse)] transition-transform group-hover:scale-105 shrink-0">
              ^↓
            </span>
            <span className="truncate">PAGE DOWN</span>
          </button>
        </div>

        {/* Column 3: Access & Invert */}
        <div className="flex flex-col gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={() => onNavigateSection('access')}
            aria-label="Navigate to Access section"
            className={`flex items-center gap-1.5 sm:gap-2 text-left transition-colors cursor-pointer group ${
              activeSection === 'access'
                ? 'text-[var(--text-primary)] font-medium'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span
              className={`w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-[3px] font-mono text-[8px] sm:text-[9px] font-bold leading-none tracking-tight transition-transform group-hover:scale-105 shrink-0 ${
                activeSection === 'access'
                  ? 'bg-[var(--col-standard)] text-[var(--text-inverse)] shadow-[0_0_8px_rgba(94,234,212,0.4)]'
                  : 'bg-[var(--text-primary)] text-[var(--text-inverse)]'
              }`}
            >
              ^E
            </span>
            <span className="truncate">ACCESS</span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Toggle theme: currently ${resolvedTheme}`}
            className="flex items-center gap-1.5 sm:gap-2 text-left text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer group"
          >
            <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-[3px] font-mono text-[8px] sm:text-[9px] font-bold leading-none tracking-tight bg-[var(--text-primary)] text-[var(--text-inverse)] transition-transform group-hover:scale-105 shrink-0">
              ^I
            </span>
            <span className="truncate">
              INVERT ({resolvedTheme === 'dark' ? 'LIGHT' : 'DARK'})
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
