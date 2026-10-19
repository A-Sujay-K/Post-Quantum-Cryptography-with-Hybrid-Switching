import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { useTheme } from '../../theme/useTheme';

/**
 * Custom Tooltip for Queue Depth Chart
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const depth = payload[0].value;
    return (
      <div className="surface-inner bg-[var(--surface-bg)] border border-[var(--edge-rest)] p-2.5 rounded-xl shadow-xl text-xs font-sans">
        <p className="text-[var(--text-secondary)] text-[10px] pb-1 border-b border-[var(--edge-rest)] mb-1.5 font-mono">
          TIME: {label}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[var(--text-secondary)]">Queue Depth:</span>
          <span className="text-[var(--text-primary)] font-medium tabular-nums">{depth}</span>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * QueueDepthChart — SUPERVISOR App (Reference B style)
 * Smooth neutral line with target SLA dashed line, quiet gridlines, and subtle area fill (<= 6%).
 */
const QueueDepthChart = ({ data = [], targetSla = 5.0 }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const gridStroke = isDark ? 'rgba(255, 245, 230, 0.06)' : 'rgba(42, 32, 24, 0.08)';
  const axisLineStroke = 'var(--edge-rest)';
  const axisTextFill = isDark ? 'rgba(255, 245, 230, 0.45)' : 'rgba(42, 32, 24, 0.55)';
  const lineStroke = isDark ? '#f0e8dc' : '#2a2018';
  const slaColor = isDark ? 'rgba(255, 245, 230, 0.35)' : 'rgba(42, 32, 24, 0.35)';

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 select-none">
        <span className="text-xs font-sans text-[var(--text-secondary)]">Queue is empty</span>
        <span className="text-[11px] font-sans text-[var(--text-tertiary)] mt-0.5">
          Zero buffer backlog · messages routed instantly
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-full select-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 12, left: -24, bottom: 6 }}>
          <defs>
            <linearGradient id="queueNeutralAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineStroke} stopOpacity={0.06} />
              <stop offset="100%" stopColor={lineStroke} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />

          <XAxis
            dataKey="time"
            stroke={axisTextFill}
            fontSize={9}
            fontFamily="var(--font-mono, monospace)"
            tickLine={false}
            axisLine={{ stroke: axisLineStroke }}
            minTickGap={25}
          />

          <YAxis
            stroke={axisTextFill}
            fontSize={9}
            fontFamily="var(--font-mono, monospace)"
            tickLine={false}
            axisLine={{ stroke: axisLineStroke }}
            allowDecimals={false}
            domain={[0, 'dataMax + 2']}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Reference line: Target SLA 5.0s */}
          <ReferenceLine 
            y={0} 
            stroke={slaColor} 
            strokeDasharray="4 4" 
            label={{
              position: 'insideTopRight',
              value: 'SLA Floor',
              fill: slaColor,
              fontSize: 9,
              fontFamily: 'monospace',
            }}
          />

          <Area
            type="monotone"
            dataKey="queueDepth"
            stroke={lineStroke}
            strokeWidth={1.75}
            fill="url(#queueNeutralAreaGrad)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default QueueDepthChart;