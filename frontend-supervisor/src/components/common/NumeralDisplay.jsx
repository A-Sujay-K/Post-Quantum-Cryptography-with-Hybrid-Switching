import React from 'react';

/**
 * NumeralDisplay — Reference B canonical typography component (DESIGN_SYSTEM.md §13)
 * Integer part full opacity; decimal separator + decimals ~40% opacity; unit ~0.5em at ~45%;
 * tiny trend arrow glyph before figure; tabular figures; locale via Intl.NumberFormat.
 */
export const NumeralDisplay = ({
  value,
  unit = '',
  trend = null, // 'up' | 'down' | 'neutral' | null
  decimals = 2,
  size = 'md', // 'sm' | 'md' | 'lg' | 'hero'
  className = '',
  prefix = ''
}) => {
  const num = typeof value === 'number' ? value : parseFloat(value) || 0;
  
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const parts = formatter.formatToParts(num);
  let integerStr = '';
  let decimalStr = '';

  parts.forEach((p) => {
    if (p.type === 'integer' || p.type === 'group') {
      integerStr += p.value;
    } else if (p.type === 'decimal' || p.type === 'fraction') {
      decimalStr += p.value;
    }
  });

  const sizeClasses = {
    sm: 'text-base font-light',
    md: 'text-2xl sm:text-3xl font-light',
    lg: 'text-3xl sm:text-4xl font-light',
    hero: 'text-4xl sm:text-5xl font-light tracking-tight'
  };

  return (
    <span className={`inline-flex items-baseline font-sans tabular-nums text-[var(--text-primary)] select-none ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      {trend && (
        <span className="text-[0.45em] mr-1 opacity-50 self-center">
          {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
        </span>
      )}
      {prefix && <span className="opacity-60 mr-0.5 text-[0.8em]">{prefix}</span>}
      <span className="font-light">{integerStr}</span>
      {decimalStr && (
        <span className="opacity-40 font-light">{decimalStr}</span>
      )}
      {unit && (
        <span className="text-[0.5em] ml-1 opacity-45 font-normal tracking-normal">
          {unit}
        </span>
      )}
    </span>
  );
};

export default NumeralDisplay;
