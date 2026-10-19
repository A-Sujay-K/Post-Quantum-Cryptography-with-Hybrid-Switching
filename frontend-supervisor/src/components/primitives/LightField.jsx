import React from 'react';
import BackgroundStack from '../../theme/BackgroundStack';

/**
 * LightField — SUPERVISOR App (Backward Compatibility Wrapper around BackgroundStack)
 */
export const LightField = ({ children, className = '', activeLane = 'standard' }) => {
  return (
    <BackgroundStack variant="supervisor" activeLane={activeLane} className={className}>
      {children}
    </BackgroundStack>
  );
};

export default LightField;
