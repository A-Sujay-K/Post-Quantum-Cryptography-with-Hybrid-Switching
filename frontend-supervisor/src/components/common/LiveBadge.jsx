import React from 'react';

/**
 * LiveBadge — SUPERVISOR App
 * Clean semantic status indicator: verified green for live, danger red for disconnected.
 * Follows DESIGN_SYSTEM.md: zero neon box-shadows, dual-theme semantic CSS tokens.
 */
const LiveBadge = ({ isLive }) => {
  return (
    <div
      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[var(--surface-inner)] border border-[var(--edge-rest)] text-[11px] font-sans font-medium tracking-normal text-[var(--text-secondary)] transition-colors"
      role="status"
      aria-label={isLive ? 'System status: live telemetry connected' : 'System status: telemetry offline'}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isLive ? 'bg-[var(--col-verified)] animate-pulse' : 'bg-[var(--col-danger)]'
        }`}
      />
      <span className="text-[var(--text-primary)]">{isLive ? 'Live' : 'Offline'}</span>
    </div>
  );
};

export default LiveBadge;
