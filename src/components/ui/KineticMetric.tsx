/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface KineticMetricProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
  duration?: number; // duration in ms
}

export const KineticMetric: React.FC<KineticMetricProps> = ({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
  duration = 800
}) => {
  const isReduced = useReducedMotion();
  const [displayValue, setDisplayValue] = useState<number>(value);

  useEffect(() => {
    if (isReduced) {
      setDisplayValue(value);
      return;
    }

    let start = displayValue;
    const end = value;
    if (start === end) return;

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Cubic easeOut formula
      const ease = 1 - Math.pow(1 - progress, 3);
      
      const current = start + (end - start) * ease;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, isReduced]);

  return (
    <span className={`font-mono tracking-tight font-bold ${className}`}>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
};
