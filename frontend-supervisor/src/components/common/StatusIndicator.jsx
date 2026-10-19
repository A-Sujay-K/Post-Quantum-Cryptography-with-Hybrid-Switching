import React from 'react';

/**
 * StatusIndicator — SUPERVISOR App
 * Clean semantic status dot with theme-aware tooltip.
 * Follows DESIGN_SYSTEM.md: NO neon glow box-shadows.
 */
const StatusIndicator = ({ status, label }) => {
  // status: 'good' | 'warning' | 'critical' | 'offline'

  const colorMap = {
    good: 'bg-[var(--col-verified)] border-[var(--col-verified)]/40',
    warning: 'bg-[var(--col-critical)] border-[var(--col-critical)]/40',
    critical: 'bg-[var(--col-danger)] border-[var(--col-danger)]/40',
    offline: 'bg-[var(--text-tertiary)] border-[var(--text-tertiary)]/40',
  };

  const dotClass = colorMap[status] || colorMap.offline;
  const pulseClass = status === 'good' ? 'animate-pulse' : '';

  return (
    <div className="inline-flex items-center gap-2 group relative">
      <span className={`w-2.5 h-2.5 rounded-full border ${dotClass} ${pulseClass}`} />
      {label && <span className="text-xs text-[var(--text-secondary)] font-mono">{label}</span>}

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-[var(--surface-bg)] border border-[var(--edge-rest)] text-[11px] text-[var(--text-primary)] font-sans rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
        {status === 'good' ? 'Connected' : status === 'critical' ? 'Disconnected' : status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    </div>
  );
};

export default StatusIndicator;
