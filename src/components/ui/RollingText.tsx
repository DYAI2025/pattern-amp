/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useReducedMotion } from './useReducedMotion';

interface RollingCharProps {
  char: string;
  delayMultiplier: number;
}

const RollingChar: React.FC<RollingCharProps> = ({ char, delayMultiplier }) => {
  const isReduced = useReducedMotion();
  const [displayedChar, setDisplayedChar] = useState(' ');
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (isReduced) {
      setDisplayedChar(char);
      return;
    }

    // List of placeholder transit characters to simulate mechanization
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-*+#';
    const target = char.toUpperCase();
    
    if (target === ' ') {
      setDisplayedChar(' ');
      return;
    }

    let cycleCount = 0;
    const maxCycles = 5 + Math.floor(Math.random() * 5);
    const delay = delayMultiplier * 60;

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        cycleCount++;
        setIsFlipped(prev => !prev);
        
        if (cycleCount >= maxCycles) {
          clearInterval(interval);
          setDisplayedChar(char);
          setIsFlipped(false);
        } else {
          const randomIndex = Math.floor(Math.random() * characters.length);
          setDisplayedChar(characters[randomIndex]);
        }
      }, 40);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [char, delayMultiplier, isReduced]);

  if (isReduced) {
    return <span className="inline-block transition-all font-mono opacity-90">{char}</span>;
  }

  return (
    <span className="relative inline-flex items-center justify-center font-mono select-none overflow-hidden h-6 w-[0.65em] bg-[#020406] text-slate-100 border border-slate-900 rounded mx-px shadow-sm">
      <motion.span
        key={displayedChar}
        initial={{ rotateX: 90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        exit={{ rotateX: -90, opacity: 0 }}
        transition={{ duration: 0.18, ease: 'easeInOut' }}
        style={{ transformOrigin: 'center center' }}
        className="text-[11px] font-bold text-slate-200"
      >
        {displayedChar}
      </motion.span>
      {/* Structural horizontal slot split line for authentic flap feeling */}
      <span className="absolute left-0 right-0 top-1/2 h-px bg-slate-950/90 pointer-events-none" />
    </span>
  );
};

interface RollingTextProps {
  text: string;
}

export const RollingText: React.FC<RollingTextProps> = ({ text }) => {
  const chars = text.split('');

  return (
    <span className="inline-flex flex-wrap items-center">
      {chars.map((char, index) => {
        if (char === ' ') {
          return <span key={index} className="w-2 inline-block">&nbsp;</span>;
        }
        return (
          <RollingChar 
            key={`${char}-${index}`} 
            char={char} 
            delayMultiplier={index} 
          />
        );
      })}
    </span>
  );
};
