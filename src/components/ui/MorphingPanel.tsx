/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useReducedMotion } from './useReducedMotion';

interface MorphingPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'cyan' | 'indigo' | 'slate' | 'rose';
  glowOnHover?: boolean;
}

export const MorphingPanel: React.FC<MorphingPanelProps> = ({
  children,
  className = '',
  variant = 'slate',
  glowOnHover = false
}) => {
  const isReduced = useReducedMotion();

  const getVariantStyles = () => {
    switch (variant) {
      case 'cyan':
        return {
          border: 'border-cyan-500/20 hover:border-cyan-500/40',
          bg: 'bg-[#040810]/90',
          glow: 'group-hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]'
        };
      case 'indigo':
        return {
          border: 'border-indigo-500/20 hover:border-indigo-500/40',
          bg: 'bg-[#04070e]/95',
          glow: 'group-hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]'
        };
      case 'rose':
        return {
          border: 'border-rose-950/40 hover:border-rose-900/60',
          bg: 'bg-[#080406]/98',
          glow: 'group-hover:shadow-[0_0_15px_rgba(244,63,94,0.10)]'
        };
      case 'slate':
      default:
        return {
          border: 'border-slate-800/90 hover:border-slate-700',
          bg: 'bg-[#030509]/95',
          glow: 'group-hover:shadow-[0_0_15px_rgba(100,116,139,0.05)]'
        };
    }
  };

  const s = getVariantStyles();

  return (
    <div 
      className={`group relative rounded-2xl border ${s.border} ${s.bg} p-5 backdrop-blur-md transition-all duration-300 leading-normal ${glowOnHover && !isReduced ? `hover:translate-y-[-2px] ${s.glow}` : ''} ${className}`}
    >
      {/* Visual tech corner ticks */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-slate-700 rounded-tl" />
      <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-slate-700 rounded-tr" />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-slate-700 rounded-bl" />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-slate-700 rounded-br" />

      {/* Actual inside element slot */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
