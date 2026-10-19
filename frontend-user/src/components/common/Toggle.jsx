import React from 'react';

/**
 * Toggle — visionOS / macOS styled toggle switch
 * Smooth spring transition, clear active states, accessible focus
 */
const Toggle = ({ checked, onChange, label, className = '' }) => {
  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer select-none ${className}`}>
      {label && <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>}
      <div className="relative inline-flex items-center">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        {/* Track */}
        <div 
          className={`w-11 h-6 rounded-full transition-colors duration-200 border ${
            checked 
              ? 'bg-[var(--col-critical)]/25 border-[var(--col-critical)]/45' 
              : 'bg-[var(--surface-inner)] border-[var(--border)]'
          }`}
        />
        {/* Thumb */}
        <div 
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-200 ease-spring shadow-sm flex items-center justify-center ${
            checked 
              ? 'translate-x-5 bg-[var(--col-critical)] text-[var(--text-inverse)]' 
              : 'translate-x-0 bg-[var(--text-tertiary)]'
          }`}
        >
          {checked && (
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-inverse)]" />
          )}
        </div>
      </div>
    </label>
  );
};

export default Toggle;
