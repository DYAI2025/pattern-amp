/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Network, BatteryCharging, CheckSquare, Zap, Activity, ShieldCheck, Eye, Compass, Info } from 'lucide-react';

export type EpistemicClass = 'calculated' | 'observed' | 'inferred' | 'simulated' | 'speculative' | 'excluded' | 'disabled';

interface EpistemicTagProps {
  type: EpistemicClass;
  className?: string;
}

/**
 * Universal Epistemic Tag component to display clear labels for data/interpretation provenance.
 */
export function EpistemicTag({ type, className = '' }: EpistemicTagProps) {
  const styles = {
    calculated: 'bg-purple-950/20 text-purple-400 border-purple-500/25 shadow-[0_0_4px_rgba(168,85,247,0.1)]',
    observed: 'bg-emerald-950/20 text-emerald-400 border-emerald-500/25 shadow-[0_0_4px_rgba(16,185,129,0.1)]',
    inferred: 'bg-sky-950/20 text-sky-400 border-sky-500/25 shadow-[0_0_4px_rgba(14,165,233,0.1)]',
    simulated: 'bg-amber-950/20 text-amber-500 border-amber-500/25 shadow-[0_0_4px_rgba(245,158,11,0.1)]',
    speculative: 'bg-indigo-950/20 text-indigo-400 border-indigo-500/25 shadow-[0_0_4px_rgba(99,102,241,0.1)]',
    excluded: 'bg-slate-950/50 text-slate-500 border-slate-900 line-through opacity-60',
    disabled: 'bg-slate-950/50 text-slate-500 border-slate-900 opacity-60'
  }[type];

  const labels = {
    calculated: '✦ CALCULATED BASELINE',
    observed: '✦ OBSERVED DATA',
    inferred: '✦ INFERRED COGNITIVE',
    simulated: '✦ SIMULATED PROJECTION',
    speculative: '✦ SPECULATIVE PROBE',
    excluded: '✦ EXCLUDED (QUIZ V1)',
    disabled: '✦ DISABLED FOR V1'
  }[type];

  return (
    <span className={`text-[9px] font-mono border px-2 py-0.5 rounded font-bold uppercase tracking-widest inline-flex items-center gap-1 shrink-0 ${styles} ${className}`}>
      {labels}
    </span>
  );
}

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
