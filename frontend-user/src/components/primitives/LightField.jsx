import React from 'react';
import BackgroundStack from '../../theme/BackgroundStack';

/**
 * LightField — USER App (Backward Compatibility Wrapper around BackgroundStack)
 */
export const LightField = ({ children, className = '' }) => {
  return (
    <BackgroundStack variant="user" className={className}>
      {children}
    </BackgroundStack>
  );
};

export default LightField;
