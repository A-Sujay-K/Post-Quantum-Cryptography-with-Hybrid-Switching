import React from 'react';

/**
 * GlassLayer — SUPERVISOR App
 * Renders glass surfaces adhering to the strict 4-tier system (L0-L3)
 * Enforces -webkit-backdrop-filter and supports fallback.
 */
export const GlassLayer = ({
  level = 'l1',
  children,
  className = '',
  as: Component = 'div',
  ...props
}) => {
  const glassClass = level === 'l3' ? 'glass-l3' : level === 'l2' ? 'glass-l2' : 'glass-l1';

  return (
    <Component className={`${glassClass} ${className}`} {...props}>
      {children}
    </Component>
  );
};

export default GlassLayer;
