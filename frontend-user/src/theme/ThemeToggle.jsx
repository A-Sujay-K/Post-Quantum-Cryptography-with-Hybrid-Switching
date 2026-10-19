import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export const ThemeToggle = ({ className = '', showLabel = false }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200 focus-ring ${
        isDark
          ? 'bg-white/5 border-white/10 text-[#f0e8dc] hover:bg-white/10 hover:border-white/20'
          : 'bg-black/5 border-black/10 text-[#2a2018] hover:bg-black/10 hover:border-black/20'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <div className="relative w-4 h-4 overflow-hidden flex items-center justify-center">
        {/* Moon Icon for Dark Theme */}
        <Moon
          className={`w-4 h-4 absolute transition-all duration-300 ease-spring ${
            isDark
              ? 'opacity-100 rotate-0 scale-100 text-[#f59e0b]'
              : 'opacity-0 -rotate-90 scale-50 text-transparent'
          }`}
        />
        {/* Sun Icon for Light Theme */}
        <Sun
          className={`w-4 h-4 absolute transition-all duration-300 ease-spring ${
            !isDark
              ? 'opacity-100 rotate-0 scale-100 text-[#c2410c]'
              : 'opacity-0 rotate-90 scale-50 text-transparent'
          }`}
        />
      </div>
      {showLabel && (
        <span className="ml-2 text-xs font-mono uppercase tracking-wider">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
