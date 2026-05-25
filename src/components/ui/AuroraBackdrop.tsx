/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useReducedMotion } from './useReducedMotion';

export const AuroraBackdrop: React.FC = () => {
  const isReduced = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-50 bg-[#03060a]">
      {/* Precision grid mesh overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05] bg-repeat"
        style={{
          backgroundImage: `radial-gradient(circle, #38bdf8 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Dynamic atmospheric fluid lighting elements */}
      {!isReduced && (
        <>
          {/* Cyan flare */}
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-cyan-500/10 blur-[130px] mix-blend-screen" />
          {/* Indigo flare */}
          <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] rounded-full bg-indigo-500/5 blur-[150px] mix-blend-screen" />
          {/* Emerald flare */}
          <div className="absolute -bottom-40 left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[130px] mix-blend-screen" />
        </>
      )}

      {/* Abstract dark laser horizontal scanner baseline */}
      <div className="absolute top-[280px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent blur-[1px]" />
    </div>
  );
};
