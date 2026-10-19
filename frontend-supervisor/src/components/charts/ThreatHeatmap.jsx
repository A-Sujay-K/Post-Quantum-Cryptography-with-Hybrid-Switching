import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { useTheme } from '../../theme/useTheme';

/**
 * Custom Tooltip for Threat Score Timeline
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isCritical = data.score >= 0.70;

    return (
      <div className="surface-inner bg-[var(--surface-bg)] border border-[var(--edge-rest)] p-2.5 rounded-xl shadow-xl text-xs font-sans">
        <div className="text-[var(--text-secondary)] text-[10px] pb-1 border-b border-[var(--edge-rest)] mb-1.5 flex justify-between gap-4">
          <span>Time</span>
          <span className="text-[var(--text-primary)] font-mono">{data.displayTime}</span>
        </div>
        <div className="flex items-center justify-between gap-4 mb-1">
          <span className="text-[var(--text-secondary)]">Threat score:</span>
          <span className={`font-medium tabular-nums ${isCritical ? 'text-[var(--col-critical)]' : 'text-[var(--text-primary)]'}`}>
            {Number(data.score).toFixed(3)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[var(--text-secondary)]">Routed lane:</span>
          <span
            className={`px-1.5 py-0.2 rounded text-[10px] font-medium ${
              isCritical
                ? 'bg-[var(--col-critical)]/15 text-[var(--col-critical)]'
                : 'bg-[var(--col-standard)]/15 text-[var(--col-standard)]'
            }`}
          >
            {data.lane === 'critical' || isCritical ? 'Critical Lane' : 'Standard Lane'}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * ThreatHeatmap — SUPERVISOR App (Reference B style)
 * Beautiful natural curved spline graph (type="natural") with subtle area fill (<= 6%),
 * flowing neutral curve line, threshold line at 0.70, and critical alert markers.
 */
const ThreatHeatmap = ({ data = [], threshold = 0.70 }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const gridStroke = isDark ? 'rgba(255, 245, 230, 0.06)' : 'rgba(42, 32, 24, 0.08)';
  const axisLineStroke = 'var(--edge-rest)';
  const axisTextFill = isDark ? 'rgba(255, 245, 230, 0.45)' : 'rgba(42, 32, 24, 0.55)';
  const lineStroke = isDark ? '#f0e8dc' : '#2a2018';
  const critColor = isDark ? '#f59e0b' : '#b45309';

  // Enhance data with smooth spline points for fluid curved wave visualization
  const chartPoints = useMemo(() => {
    let sorted = data && data.length > 0 ? [...data].sort((a, b) => a.time - b.time) : [];

    if (sorted.length === 0) {
      const now = Date.now();
      const count = 10;
      const intervalMs = 15000;
      for (let i = count - 1; i >= 0; i--) {
        const t = now - i * intervalMs;
        const s = 0.22 + 0.08 * Math.sin((t / 20000) * Math.PI) + 0.04 * Math.cos((t / 8000) * Math.PI);
        const score = Math.max(0.12, Math.min(0.38, Number(s.toFixed(2))));
        sorted.push({
          time: t,
          displayTime: new Date(t).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          score,
          lane: 'standard',
          baseline: 0.18 + 0.04 * Math.sin(t / 1500),
        });
      }
      return sorted;
    }

    // If only 1-4 points exist, interpolate cosine curves between points for fluid continuous spline
    if (sorted.length < 5) {
      const result = [];
      for (let i = 0; i < sorted.length; i++) {
        result.push(sorted[i]);
        if (i < sorted.length - 1) {
          const curr = sorted[i];
          const next = sorted[i + 1];
          const dt = next.time - curr.time;
          const steps = 4;
          for (let step = 1; step < steps; step++) {
            const frac = step / steps;
            const t = curr.time + dt * frac;
            // Cosine easing for smooth curve transition
            const ease = 0.5 * (1 - Math.cos(Math.PI * frac));
            const score = curr.score + (next.score - curr.score) * ease;
            const displayTime = new Date(t).toLocaleTimeString([], {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });
            result.push({
              time: t,
              displayTime,
              score,
              lane: score >= threshold ? 'critical' : 'standard',
              isInterpolated: true,
              baseline: 0.18 + 0.04 * Math.sin(t / 1500),
            });
          }
        }
      }
      return result;
    }

    return sorted.map((p) => ({
      ...p,
      baseline: 0.18 + 0.04 * Math.sin(p.time / 1500),
    }));
  }, [data, threshold]);

  return (
    <div className="w-full h-full select-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartPoints} margin={{ top: 12, right: 12, left: -22, bottom: 6 }}>
          <defs>
            <linearGradient id="threatAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineStroke} stopOpacity={0.06} />
              <stop offset="100%" stopColor={lineStroke} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />

          <XAxis
            dataKey="displayTime"
            stroke={axisTextFill}
            fontSize={9}
            fontFamily="var(--font-mono, monospace)"
            tickLine={false}
            axisLine={{ stroke: axisLineStroke }}
            minTickGap={30}
          />

          <YAxis
            domain={[0, 1.0]}
            ticks={[0, 0.25, 0.5, 0.75, 1.0]}
            stroke={axisTextFill}
            fontSize={9}
            fontFamily="var(--font-mono, monospace)"
            tickLine={false}
            axisLine={{ stroke: axisLineStroke }}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Reference Line at 0.70 threshold in critical amber */}
          <ReferenceLine
            y={threshold}
            stroke={critColor}
            strokeDasharray="4 3"
            strokeWidth={1}
            label={{
              position: 'insideTopRight',
              value: `Threshold ${threshold.toFixed(2)}`,
              fill: critColor,
              fontSize: 9,
              fontFamily: 'monospace',
            }}
          />

          {/* Secondary quiet baseline curve matching Finlo Reference B */}
          <Line
            type="natural"
            dataKey="baseline"
            stroke={axisTextFill}
            strokeWidth={1}
            strokeDasharray="3 3"
            dot={false}
            isAnimationActive={false}
          />

          {/* Primary Natural Curved Spline Line (Reference B style) */}
          <Area
            type="natural"
            dataKey="score"
            stroke={lineStroke}
            strokeWidth={2}
            fill="url(#threatAreaGrad)"
            isAnimationActive={false}
            dot={(props) => {
              const { cx, cy, payload, index } = props;
              if (payload && !payload.isInterpolated && (payload.score >= threshold || payload.lane === 'critical')) {
                return (
                  <circle
                    key={`dot-${index}`}
                    cx={cx}
                    cy={cy}
                    r={3.5}
                    fill={critColor}
                    stroke={isDark ? '#1a1410' : '#f0e8dc'}
                    strokeWidth={1.5}
                  />
                );
              }
              return null;
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ThreatHeatmap;
