import React from 'react';
import { useDashboardState } from '../../hooks/useDashboardState';
import StatusIndicator from '../common/StatusIndicator';
import NumeralDisplay from '../common/NumeralDisplay';
import { Wifi, Server, Activity, Users } from 'lucide-react';

/**
 * SystemHealthPanel — SUPERVISOR App (Reference B style)
 * Clean system health panel with rest edges and sentence-case typography.
 */
const SystemHealthPanel = () => {
  const { isConnected, snapshot } = useDashboardState();

  const getStatus = (condition) => (condition ? 'good' : 'critical');

  return (
    <div className="flex flex-col h-full justify-between gap-3 select-none">
      {/* Title */}
      <div className="flex items-center gap-2 mb-1 shrink-0">
        <div className="w-6 h-6 rounded-lg bg-[var(--surface-inner)] border border-[var(--edge-rest)] flex items-center justify-center text-[var(--text-secondary)]">
          <Activity size={13} strokeWidth={1.8} />
        </div>
        <h2 className="text-[15px] font-medium text-[var(--text-primary)]">
          System Health
        </h2>
      </div>

      {/* Service Health Rows */}
      <div className="space-y-2">
        {/* Telemetry WebSocket */}
        <div className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--edge-rest)] bg-[var(--surface-inner)]">
          <div className="flex items-center gap-2">
            <Wifi size={13} className="text-[var(--text-secondary)]" />
            <span className="text-xs text-[var(--text-secondary)] font-sans">Telemetry WSS</span>
          </div>
          <StatusIndicator status={getStatus(isConnected)} />
        </div>

        {/* Backend REST API */}
        <div className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--edge-rest)] bg-[var(--surface-inner)]">
          <div className="flex items-center gap-2">
            <Server size={13} className="text-[var(--text-secondary)]" />
            <span className="text-xs text-[var(--text-secondary)] font-sans">Backend API</span>
          </div>
          <StatusIndicator status={getStatus(snapshot !== null)} />
        </div>

        {/* Active Connections */}
        <div className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--edge-rest)] bg-[var(--surface-inner)]">
          <div className="flex items-center gap-2">
            <Users size={13} className="text-[var(--text-secondary)]" />
            <span className="text-xs text-[var(--text-secondary)] font-sans">Active connections</span>
          </div>
          <NumeralDisplay 
            value={snapshot?.active_connections || 0} 
            unit="" 
            decimals={0} 
            size="sm" 
          />
        </div>
      </div>

      {/* Supervisor Health Summary */}
      <div className="p-3 rounded-xl border border-[var(--edge-rest)] bg-[var(--surface-inner)] text-center mt-1">
        <div className="text-[11px] text-[var(--text-secondary)] font-sans mb-0.5">
          Supervisor status
        </div>
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-[var(--text-primary)] font-sans">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--col-verified)]" />
          <span>Nominal</span>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthPanel;