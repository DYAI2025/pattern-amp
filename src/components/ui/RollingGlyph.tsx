/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from './useReducedMotion';

interface RollingGlyphProps {
  glyph: string;
}

export const RollingGlyph: React.FC<RollingGlyphProps> = ({ glyph }) => {
  const isReduced = useReducedMotion();
  const [currentGlyph, setCurrentGlyph] = useState(glyph);
  const symbols = ['☉', '☽', '☿', '♀', '♂', '♃', '♄', '♅', '♆', '♇', '▲', '▼', '◆', '◈'];

  useEffect(() => {
    if (isReduced) {
      setCurrentGlyph(glyph);
      return;
    }

    let clicks = 0;
    const interval = setInterval(() => {
      clicks++;
      if (clicks >= 6) {
        clearInterval(interval);
        setCurrentGlyph(glyph);
      } else {
        const rand = Math.floor(Math.random() * symbols.length);
        setCurrentGlyph(symbols[rand]);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [glyph, isReduced]);

  if (isReduced) {
    return <span className="font-mono text-cyan-400">{glyph}</span>;
  }

  return (
    <motion.span
      key={currentGlyph}
      initial={{ rotate: -180, scale: 0.6, opacity: 0 }}
      animate={{ rotate: 0, scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 10 }}
      className="inline-block font-mono text-cyan-400 font-bold"
    >
      {currentGlyph}
    </motion.span>
  );
};
