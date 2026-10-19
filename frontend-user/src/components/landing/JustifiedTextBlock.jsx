import React from 'react';

/**
 * JustifiedTextBlock
 * Modeled on yannickgregoire.nl's text layout (Animation 7):
 * - Thin uppercase monospace type
 * - Spread across 3 columns per line with generous horizontal breathing room
 * - Blank lines between paragraphs
 * - ~65% of viewport width with intentional negative space on the right
 */
export default function JustifiedTextBlock({ items = [], className = '' }) {
  return (
    <div className={`w-full max-w-[1100px] lg:w-[70%] select-text ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-14 text-xs md:text-[13px] uppercase tracking-wider text-[var(--text-secondary)] font-mono-light leading-relaxed">
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-4">
            {item.label && (
              <h3 className="text-[var(--text-primary)] font-medium tracking-widest text-[11px] md:text-xs border-b border-[var(--edge-rest)] pb-1.5">
                {item.label}
              </h3>
            )}
            {item.paragraphs.map((p, pIdx) => (
              <p key={pIdx} className="text-justify font-mono-light">
                {p}
              </p>
            ))}
            {item.footer && (
              <div className="mt-auto pt-2 text-[10px] text-[var(--text-tertiary)] font-mono">
                {item.footer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
