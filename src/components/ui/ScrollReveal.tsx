/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number; // ms
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  className?: string;
  threshold?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  threshold = 0.08
}) => {
  const isReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isReduced) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isReduced, threshold]);

  const getDirectionStyles = () => {
    if (isReduced || !isVisible) {
      if (isReduced) return 'opacity-100 transform-none';
      
      switch (direction) {
        case 'up': return 'opacity-0 translate-y-8';
        case 'down': return 'opacity-0 -translate-y-8';
        case 'left': return 'opacity-0 translate-x-8';
        case 'right': return 'opacity-0 -translate-x-8';
        case 'fade': default: return 'opacity-0';
      }
    }
    return 'opacity-100 translate-y-0 translate-x-0';
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${getDirectionStyles()} ${className}`}
    >
      {children}
    </div>
  );
};
