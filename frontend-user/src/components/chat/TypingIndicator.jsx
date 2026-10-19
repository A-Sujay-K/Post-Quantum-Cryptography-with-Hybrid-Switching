import React from 'react';

const TypingIndicator = ({ name }) => {
  return (
    <div className="px-3.5 py-2 rounded-2xl rounded-tl-sm inline-flex items-center gap-2.5 bg-[var(--surface-inner)] border border-[var(--edge-rest)] text-xs text-[var(--text-secondary)] shadow-sm select-none">
      <span className="text-[11px] font-sans font-normal text-[var(--text-tertiary)]">{name} is typing</span>
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};

export default TypingIndicator;
