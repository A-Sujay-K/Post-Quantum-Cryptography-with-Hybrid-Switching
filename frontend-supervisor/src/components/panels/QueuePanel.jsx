import React from 'react';
import { useDashboardState } from '../../hooks/useDashboardState';
import QueueDepthChart from '../charts/QueueDepthChart';
import NumeralDisplay from '../common/NumeralDisplay';
import { Layers } from 'lucide-react';

/**
 * QueuePanel — SUPERVISOR App (Reference B style)
 * Line Chart 2 of Row 2: Buffer & Dispatch Latency.
 */
const QueuePanel = () => {
  const { isReady, kpi, chartData, alerts } = useDashboardState();

  if (!isReady || !kpi) return null;

  const isQueueActive = kpi.queueDepth > 0;

  return (
    <div
      className={`glass-l1 p-4 sm:p-5 flex flex-col h-full relative overflow-hidden transition-colors border ${
        alerts.queueGrowing ? 'border-[var(--col-queue)]/60' : 'border-[var(--edge-rest)]'
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[var(--surface-inner)] border border-[var(--edge-rest)] flex items-center justify-center text-[var(--text-secondary)]">
            <Layers size={13} strokeWidth={1.8} />
          </div>
          <div>
            <h2 className="text-[15px] font-medium text-[var(--text-primary)]">
              Buffer &amp; Dispatch Latency
            </h2>
            <p className="text-[11px] text-[var(--text-secondary)] font-sans">
              In-flight buffer &amp; dispatch latency
            </p>
          </div>
        </div>
      </div>

      {/* Numeral Display */}
      <div className="flex items-baseline justify-between mb-1 shrink-0">
        <div className="flex items-baseline gap-2">
          <NumeralDisplay 
            value={kpi.queueDepth ?? 0} 
            unit="" 
            decimals={0} 
            size="lg" 
          />
          <span className="text-xs text-[var(--text-secondary)] font-sans">Queue Depth</span>
        </div>
      </div>

      {/* Main Chart */}
      <div className="flex-1 min-h-[160px] -ml-2 -mb-1">
        <QueueDepthChart data={chartData?.timeSeries || []} targetSla={kpi.deadlineSeconds} />
      </div>

      {/* Footer Metrics Row */}
      <div className="mt-2 pt-2.5 border-t border-[var(--edge-rest)] grid grid-cols-2 gap-2 text-xs shrink-0 font-sans">
        <div className="flex flex-col">
          <span className="text-[11px] text-[var(--text-secondary)]">
            Oldest entry
          </span>
          <div className="mt-0.5">
            <NumeralDisplay 
              value={kpi.oldestEntrySeconds != null ? Number(kpi.oldestEntrySeconds) : 0} 
              unit="s" 
              decimals={1} 
              size="sm" 
            />
          </div>
        </div>

        <div className="flex flex-col text-right">
          <span className="text-[11px] text-[var(--text-secondary)]">
            Target SLA
          </span>
          <div className="mt-0.5">
            <NumeralDisplay 
              value={kpi.deadlineSeconds != null ? Number(kpi.deadlineSeconds) : 5.0} 
              unit="s" 
              decimals={1} 
              size="sm" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueuePanel;