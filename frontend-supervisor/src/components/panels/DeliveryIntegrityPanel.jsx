import React from 'react';
import { useDashboardState } from '../../hooks/useDashboardState';
import ArcGauge from '../charts/ArcGauge';
import NumeralDisplay from '../common/NumeralDisplay';
import { CheckCircle2 } from 'lucide-react';

/**
 * DeliveryIntegrityPanel — Gauge 3 of Row 1 (Reference B style)
 * 240° arc gauge displaying Delivery Integrity (% verified by ML-DSA-65).
 */
const DeliveryIntegrityPanel = () => {
  const { isReady, kpi } = useDashboardState();

  if (!isReady || !kpi) return null;

  const mdr = parseFloat(kpi.mdrPercent) || 100.0;
  const isHealthy = mdr >= 95.0;

  return (
    <div className="glass-l1 p-4 sm:p-5 flex flex-col h-full relative overflow-hidden border border-[var(--edge-rest)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-1 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[var(--surface-inner)] border border-[var(--edge-rest)] flex items-center justify-center text-[var(--text-secondary)]">
            <CheckCircle2 size={13} strokeWidth={1.8} />
          </div>
          <h2 className="text-[15px] font-medium text-[var(--text-primary)]">
            Delivery Integrity
          </h2>
        </div>
      </div>

      {/* Legend Bullets */}
      <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mb-2 shrink-0">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--col-verified)]" />
          <span>{mdr.toFixed(1)}% Verified</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)]" />
          <span>ML-DSA-65</span>
        </span>
      </div>

      {/* Main 240° Arc Gauge */}
      <div className="flex-1 flex flex-col items-center justify-center relative min-h-0 py-1">
        <ArcGauge
          value={mdr}
          max={100}
          unit="%"
          status="MDR Verified"
          trend="up"
          decimals={1}
          isWarning={!isHealthy}
          className="h-full"
        />
      </div>

      {/* Bottom Summary Strip */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[var(--edge-rest)] shrink-0 text-xs font-sans">
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] text-[var(--text-secondary)] truncate">Delivery ratio</span>
          <div className="mt-0.5">
            <NumeralDisplay value={mdr} unit="%" decimals={1} size="sm" />
          </div>
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-[11px] text-[var(--text-secondary)] truncate">SLA status</span>
          <div className="mt-0.5 text-sm font-light text-[var(--text-primary)]">
            {isHealthy ? 'Nominal' : 'Degraded'}
          </div>
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-[11px] text-[var(--text-secondary)] truncate">Queue buffer</span>
          <div className="mt-0.5">
            <NumeralDisplay value={kpi.queueDepth ?? 0} unit="" decimals={0} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryIntegrityPanel;