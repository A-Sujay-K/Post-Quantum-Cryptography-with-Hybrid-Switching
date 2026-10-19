import React from 'react';
import Sidebar from './Sidebar';
import GlassLayer from '../primitives/GlassLayer';

const AppShell = ({ children, mobileMenuOpen, setMobileMenuOpen }) => {
  return (
    <div className="h-screen w-screen p-2 sm:p-4 md:p-6 overflow-hidden flex items-center justify-center relative">
      {/* visionOS style single floating L1 glass window */}
      <GlassLayer 
        level="l1" 
        className="w-full h-full max-w-[1600px] flex overflow-hidden rounded-[24px] md:rounded-[28px] border border-[var(--edge-rest)] shadow-[0_24px_64px_var(--shadow-color)] relative"
      >
        {/* Mobile drawer backdrop */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
          />
        )}
        
        {/* Contacts Pane — Denser Glass */}
        <div 
          className={`
            fixed md:static inset-y-0 left-0 z-40 w-80 sm:w-84 md:w-80 lg:w-96 flex-shrink-0 h-full
            transform transition-transform duration-300 ease-spring
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            border-r border-[var(--edge-rest)] bg-[var(--glass-l2-bg)] backdrop-blur-xl
          `}
        >
          <Sidebar onContactSelect={() => setMobileMenuOpen && setMobileMenuOpen(false)} />
        </div>

        {/* Conversation Pane — Lighter, Subtler Fill (Background reads through) */}
        <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden bg-transparent">
          {children}
        </div>
      </GlassLayer>
    </div>
  );
};

export default AppShell;
