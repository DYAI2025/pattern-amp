/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Network, BatteryCharging, CheckSquare, Zap, Activity, ShieldCheck } from 'lucide-react';

interface EpistemicStatusStripProps {
  isMock: boolean;
  calibrationStrength: string;
  activeHypothesesCount: number;
}

export default function EpistemicStatusStrip({
  isMock,
  calibrationStrength,
  activeHypothesesCount
}: EpistemicStatusStripProps) {
  return (
    <div className="border border-slate-800 bg-[#080a0f]/60 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
      {/* Group A: Calibration statistics */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Activity size={13} className="text-indigo-400 animate-pulse" />
          <span>Calibration Strengths:</span>
          <span className="font-bold text-slate-200">{calibrationStrength}</span>
        </div>

        <div className="h-4 w-[1px] bg-slate-800 hidden sm:block"></div>

        <div className="flex items-center gap-2">
          <CheckSquare size={13} className="text-indigo-500" />
          <span>Active Hypotheses Count:</span>
          <span className="font-bold text-slate-200">{activeHypothesesCount} active</span>
        </div>
      </div>

      {/* Group B: Real-time source status indicators connected vs mock */}
      <div className="flex flex-wrap items-center gap-3.5 text-[10px] font-mono">
        {/* FuFirE status */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 rounded-full border border-slate-800">
          <span className={`w-1.5 h-1.5 rounded-full ${isMock ? 'bg-amber-500 shadow-[0_0_6px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse'}`}></span>
          <span className="text-slate-500 uppercase">FuFirE:</span>
          <span className={isMock ? 'text-amber-500 font-semibold' : 'text-emerald-400 font-bold'}>
            {isMock ? 'MOCK' : 'CONNECTED'}
          </span>
        </div>

        {/* Supabase status */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 rounded-full border border-slate-800">
          <span className={`w-1.5 h-1.5 rounded-full ${isMock ? 'bg-amber-500 shadow-[0_0_6px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse'}`}></span>
          <span className="text-slate-500 uppercase">Supabase:</span>
          <span className={isMock ? 'text-amber-500 font-semibold' : 'text-emerald-400 font-bold'}>
            {isMock ? 'MOCK' : 'CONNECTED'}
          </span>
        </div>

        {/* MiroShark status */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 rounded-full border border-slate-800">
          <span className={`w-1.5 h-1.5 rounded-full ${isMock ? 'bg-slate-500 shadow-[0_0_6px_#64748b]' : 'bg-indigo-500 shadow-[0_0_8px_#6366f1] animate-pulse'}`}></span>
          <span className="text-slate-500 uppercase">MiroShark:</span>
          <span className={isMock ? 'text-slate-400 font-semibold' : 'text-indigo-400 font-bold'}>
            {isMock ? 'MOCK' : 'LIVE'}
          </span>
        </div>
      </div>
    </div>
  );
}
