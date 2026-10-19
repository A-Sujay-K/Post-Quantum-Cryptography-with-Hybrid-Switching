import React from 'react';
import { Shield } from 'lucide-react';

const SecurityBanner = ({ banner }) => {
  if (!banner) return null;

  return (
    <div className="w-full relative overflow-hidden bg-[var(--surface-inner)] border-b border-[var(--edge-rest)] shadow-sm animate-enter">
      <div className="px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded bg-[var(--col-critical)]/15 text-[var(--col-critical)]">
            <Shield size={14} />
          </div>
          <span className="text-xs font-medium text-[var(--text-primary)]">
            {banner.message || 'Securing connection...'}
          </span>
        </div>
        
        {banner.queue_position !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[var(--text-secondary)] font-sans">Queue Position:</span>
            <span className="text-xs font-mono text-[var(--col-critical)] font-medium bg-[var(--surface-elevated)] px-2 py-0.5 rounded border border-[var(--edge-rest)]">
              #{banner.queue_position}
            </span>
          </div>
        )}
      </div>
      
      {/* Subtle indicator line */}
      <div className="h-0.5 bg-[var(--col-critical)]/30 w-full overflow-hidden">
        <div className="h-full bg-[var(--col-critical)] w-1/3 rounded-full animate-pulse" />
      </div>
    </div>
  );
};

export default SecurityBanner;
