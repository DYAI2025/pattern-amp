/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

export function useReducedMotion(): boolean {
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    // Check if window is available
    if (typeof window === 'undefined') return;

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReduced(query.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReduced(e.matches);
    };

    query.addEventListener('change', handleChange);
    return () => {
      query.removeEventListener('change', handleChange);
    };
  }, []);

  return isReduced;
}
