import React from 'react';
import ArcGauge from './ArcGauge';

/**
 * KeyPoolGauge — SUPERVISOR App (Reference B style)
 * Clean 240-degree thin arc gauge displaying QKD Entropy Pool.
 */
const KeyPoolGauge = ({ available = 0, capacity = 25, isSimulated = true }) => {
  const safeCapacity = Math.max(capacity, available, 1);
  const ratio = Math.min(Math.max(available / safeCapacity, 0), 1);
  const fillPercent = Math.round(ratio * 100);

  let statusText = 'Nominal';
  let isWarning = false;
  let isDanger = false;

  if (available <= 5 && available > 0) {
    statusText = 'Reservoir Low';
    isWarning = true;
  } else if (available === 0) {
    statusText = 'Depleted';
    isDanger = true;
  }

  return (
    <ArcGauge
      value={fillPercent}
      max={100}
      displayValue={available}
      unit="keys"
      status={statusText}
      isWarning={isWarning}
      isDanger={isDanger}
      trend={available > 10 ? 'up' : null}
      decimals={0}
      className="h-full"
    />
  );
};

export default KeyPoolGauge;