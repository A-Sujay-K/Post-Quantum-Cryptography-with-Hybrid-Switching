import React from 'react';
import { useTheme } from '../../theme/useTheme';
import NumeralDisplay from '../common/NumeralDisplay';

/**
 * ArcGauge — Reference B 240-degree Arc Gauge
 * Thin 240° arc with subtle needle/bead, centered light NumeralDisplay,
 * neutral stroke with soft value glow, and quiet capacity rail.
 */
export const ArcGauge = ({
  value = 0,
  max = 100,
  unit = '%',
  displayValue = null,
  trend = null,
  decimals = 1,
  status = 'Nominal',
  isWarning = false,
  isDanger = false,
  className = ''
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const safeMax = Math.max(max, 1);
  const numVal = typeof value === 'number' ? value : parseFloat(value) || 0;
  const ratio = Math.min(Math.max(numVal / safeMax, 0), 1);
  const percent = ratio * 100;

  // 240° Arc geometry: cx=110, cy=105, R=80
  // Sweeps from 150° (bottom-left) to 390° (bottom-right)
  const R = 80;
  const cx = 110;
  const cy = 105;
  const totalLength = 335.1;
  const strokeDashoffset = totalLength * (1 - ratio);

  // Bead coordinates at current value angle
  const angleDeg = 150 + ratio * 240;
  const angleRad = (angleDeg * Math.PI) / 180;
  const bx = cx + R * Math.cos(angleRad);
  const by = cy + R * Math.sin(angleRad);

  // Neutral arc stroke (monochrome first rule D)
  let activeStroke = isDark ? 'rgba(255, 245, 230, 0.88)' : 'rgba(42, 32, 24, 0.85)';
  let beadFill = isDark ? '#ffffff' : '#1a1410';
  let glowColor = isDark ? 'rgba(255, 245, 230, 0.35)' : 'rgba(42, 32, 24, 0.15)';

  if (isDanger) {
    activeStroke = isDark ? '#ef4444' : '#dc2626';
    beadFill = activeStroke;
    glowColor = 'rgba(239, 68, 68, 0.4)';
  } else if (isWarning) {
    activeStroke = isDark ? '#f59e0b' : '#b45309';
    beadFill = activeStroke;
    glowColor = 'rgba(245, 158, 11, 0.4)';
  }

  const railStroke = isDark ? 'rgba(255, 245, 230, 0.08)' : 'rgba(42, 32, 24, 0.09)';

  return (
    <div className={`w-full flex flex-col items-center justify-center relative select-none ${className}`}>
      <svg
        viewBox="0 0 220 160"
        className="w-full max-w-[210px] h-auto overflow-visible"
        aria-label={`Gauge: ${displayValue || numVal}${unit} (${status})`}
      >
        <defs>
          <filter id={`glow-${cx}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={glowColor} />
          </filter>
        </defs>

        {/* Background Track Rail (240° arc) */}
        <path
          d="M 40.7 145.0 A 80 80 0 1 1 179.3 145.0"
          fill="none"
          stroke={railStroke}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Active Value Arc */}
        <path
          d="M 40.7 145.0 A 80 80 0 1 1 179.3 145.0"
          fill="none"
          stroke={activeStroke}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={totalLength}
          strokeDashoffset={strokeDashoffset}
          filter={`url(#glow-${cx})`}
          style={{
            transition: 'stroke-dashoffset 600ms cubic-bezier(0.16, 1, 0.3, 1), stroke 400ms ease',
          }}
        />

        {/* Bead / Marker Point on Arc */}
        {ratio > 0.01 && (
          <circle
            cx={bx}
            cy={by}
            r="4.5"
            fill={beadFill}
            stroke={isDark ? '#1a1410' : '#ffffff'}
            strokeWidth="1.5"
            style={{
              transition: 'cx 600ms cubic-bezier(0.16, 1, 0.3, 1), cy 600ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        )}
      </svg>

      {/* Centered Numeral & Status */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-1 pointer-events-none">
        <NumeralDisplay
          value={displayValue !== null ? displayValue : numVal}
          unit={unit}
          trend={trend}
          decimals={decimals}
          size="md"
        />
        {status && (
          <span className="text-[11px] font-sans font-normal text-[var(--text-secondary)] mt-0.5">
            {status}
          </span>
        )}
      </div>
    </div>
  );
};

export default ArcGauge;