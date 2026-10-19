import React from 'react';

/**
 * MetricCard — SUPERVISOR App (Reference B style)
 * Large light-weight numerals, clear visual hierarchy, calm semantic accents.
 * Zero-blur surface-inner observing the global glass performance budget.
 * Designed to prevent text clipping across 360px mobile, 768px tablet, and 1280px desktop.
 */
const MetricCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  colorClass = 'text-[var(--text-primary)]',
  accentColor,
}) => {
  return (
    <div className="surface-inner p-3 sm:p-4 rounded-xl flex flex-col justify-between h-full transition-colors border border-[var(--surface-inner-border)] hover:border-[var(--border)] bg-[var(--surface-inner)] min-h-[105px]">
      {/* Top row: Label + Icon */}
      <div className="flex items-start justify-between gap-1.5 mb-1.5">
        <span className="text-[10px] sm:text-[11px] font-medium tracking-normal sm:tracking-wider uppercase text-[var(--text-secondary)] leading-tight line-clamp-2 min-h-[1.5rem] flex items-center">
          {title}
        </span>
        {Icon && (
          <div
            className="w-4 h-4 sm:w-5 sm:h-5 rounded flex items-center justify-center shrink-0 mt-0.5"
            style={{ color: accentColor || 'var(--text-secondary)' }}
          >
            <Icon size={14} strokeWidth={1.75} />
          </div>
        )}
      </div>

      {/* Hero Numeral: Geist Light, tabular nums */}
      <div className="my-auto py-0.5">
        <div
          className={`font-sans font-light tracking-tight text-2xl sm:text-3xl lg:text-[1.85rem] leading-none tabular-nums truncate ${colorClass}`}
        >
          {value}
        </div>
      </div>

      {/* Bottom subtitle / context note */}
      {subtitle && (
        <div className="mt-1.5 pt-1.5 border-t border-[var(--border)] text-[9px] sm:text-[9.5px] font-mono text-[var(--text-tertiary)] truncate uppercase tracking-wider">
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
