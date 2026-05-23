/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HelpCircle, RefreshCw, Eye, Sparkles, AlertTriangle, Play, HelpCircle as HelpIcon, Activity } from 'lucide-react';
import { ScenarioMode, HorizonType } from '../../types';

interface ScenarioControlPanelProps {
  mode: ScenarioMode;
  setMode: (m: ScenarioMode) => void;
  horizon: HorizonType;
  setHorizon: (h: HorizonType) => void;
  symbolicMode: boolean;
  setSymbolicMode: (s: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (r: boolean) => void;
  onSimulateRun: () => void;
  isSimulating: boolean;
  onToggleExplain: () => void;
  userQuestion: string;
  setUserQuestion: (q: string) => void;
  onAskQuestion: () => void;
  showAmplifier: boolean;
  onToggleAmplifier: () => void;
}

export default function ScenarioControlPanel({
  mode,
  setMode,
  horizon,
  setHorizon,
  symbolicMode,
  setSymbolicMode,
  reducedMotion,
  setReducedMotion,
  onSimulateRun,
  isSimulating,
  onToggleExplain,
  userQuestion,
  setUserQuestion,
  onAskQuestion,
  showAmplifier,
  onToggleAmplifier
}: ScenarioControlPanelProps) {

  const modesList: { value: ScenarioMode; label: string; desc: string }[] = [
    { value: 'field', label: '1. Current Field', desc: 'What baseline & transits are currently activated?' },
    { value: 'move', label: '2. Reflective Move', desc: 'What micro-action fits the user state?' },
    { value: 'pressure', label: '3. Pattern Under Pressure', desc: 'What happens to the pattern system under stress?' },
    { value: 'coherence', label: '4. Coherence Path', desc: 'Which trajectory enhances overall alignment?' },
    { value: 'tension', label: '5. Tension Path', desc: 'Which branch increases friction or overload?' },
    { value: 'question', label: '6. Strategic Query', desc: 'Map a custom user question against pattern clusters' },
  ];

  const horizonsList: { value: HorizonType; label: string; sub: string }[] = [
    { value: 'now', label: 'Now', sub: 'Immediate' },
    { value: '7d', label: '7 Days', sub: 'Near drift' },
    { value: '30d', label: '30 Days', sub: 'Medium' },
    { value: '90d', label: '90 Days', sub: 'Speculative' },
  ];

  return (
    <div className="border border-slate-800 bg-[#080a0f]/60 rounded-2xl p-6 backdrop-blur-md space-y-6">
      {/* Simulation & Symbolic Toggle Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">COCKPIT CONFIGURATION</h4>
        
        <div className="flex items-center gap-2">
          {/* Why am I seeing this trigger */}
          <button
            onClick={onToggleExplain}
            className="p-1.5 px-3 rounded-full border border-slate-800 bg-slate-905 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 text-xs flex items-center gap-1.5 transition-colors"
            title="Read Epistemic Framework & Data Sources"
          >
            <HelpIcon size={12} className="text-indigo-400" />
            <span className="font-mono text-[9px] uppercase tracking-wide">FRAMEWORK</span>
          </button>

          <button
            onClick={onSimulateRun}
            disabled={isSimulating}
            className="px-3.5 py-1.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 border border-indigo-500/30 bg-indigo-505/10 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 disabled:opacity-50 cursor-pointer"
          >
            <Play size={11} className={isSimulating ? "animate-spin text-indigo-400" : "text-indigo-400"} />
            <span>{isSimulating ? "SIMULATING..." : "SIMULATE MIROSHARK"}</span>
          </button>

          <button
            onClick={onToggleAmplifier}
            className={`px-3.5 py-1.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 border cursor-pointer ${
              showAmplifier
                ? 'bg-cyan-500/15 border-cyan-400 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
            }`}
            title="Toggle reflective 2.5D speculative tendency growth model"
          >
            <Activity size={11} className={showAmplifier ? 'text-cyan-400 animate-pulse' : 'text-slate-400'} />
            <span>{showAmplifier ? 'CLOSE AMPLIFIER' : 'PATTERN AMPLIFIER'}</span>
          </button>
        </div>
      </div>

      {/* HORIZON SELECTOR & SCRUBBER */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold text-indigo-405 text-indigo-400 block uppercase tracking-widest">
          TEMPORAL SCRUBBER HORIZON
        </label>
        <div className="grid grid-cols-4 gap-2">
          {horizonsList.map((h) => {
            const isActive = horizon === h.value;
            return (
              <button
                key={h.value}
                onClick={() => setHorizon(h.value)}
                className={`py-2 px-1 rounded-xl border text-center transition-all ${
                  isActive
                    ? 'bg-black text-indigo-400 border-indigo-550 border-indigo-500 shadow-md shadow-indigo-505/10 shadow-indigo-500/10 font-bold'
                    : 'bg-[#050608]/40 text-slate-400 border-slate-800/80 hover:bg-[#050608]/80 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-semibold">{h.label}</div>
                <div className="text-[8px] font-mono text-slate-500 mt-0.5 uppercase tracking-wider">{h.sub}</div>
              </button>
            );
          })}
        </div>
        {/* Visual Line Scrubber */}
        <div className="relative pt-2">
          <div className="h-1 bg-slate-900 rounded-full w-full"></div>
          <div 
            className="absolute top-2.5 h-1.5 bg-indigo-500 rounded-full transition-all duration-300 shadow-[0_0_8px_#6366f1]"
            style={{
              left: '0%',
              width: horizon === 'now' ? '12.5%' : horizon === '7d' ? '37.5%' : horizon === '30d' ? '62.5%' : '100%'
            }}
          ></div>
          <div 
            className="absolute top-1.5 w-3 h-3 rounded-full bg-white border border-slate-950 shadow transition-all duration-300 cursor-pointer hover:scale-110"
            style={{
              left: horizon === 'now' ? '12.5%' : horizon === '7d' ? '37.5%' : horizon === '30d' ? '62.5%' : '98%',
              transform: 'translateX(-50%)'
            }}
          ></div>
        </div>
      </div>

      {/* SCENARIO GENERATIVE MODES */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-indigo-400 block uppercase tracking-widest">
          COGNITIVE ENGINE MODE
        </label>

        <div className="space-y-2">
          {modesList.map((m) => {
            const isActive = mode === m.value;
            return (
              <button
                key={m.value}
                onClick={() => setMode(m.value)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                  isActive
                    ? 'bg-slate-900/90 text-white border-indigo-500 shadow-lg shadow-indigo-500/5'
                    : 'bg-slate-950/20 text-slate-400 border-slate-900 hover:bg-slate-900/40 hover:text-slate-200'
                }`}
              >
                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                  isActive ? 'bg-indigo-400 animate-pulse' : 'bg-slate-700'
                }`} />
                <div>
                  <div className={`text-xs font-semibold ${isActive ? 'text-indigo-300 font-medium' : 'text-slate-300'}`}>
                    {m.label}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-sans">
                    {m.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* USER Strategic Question Input */}
      {mode === 'question' && (
        <div className="pt-2 border-t border-slate-900 space-y-2.5">
          <label className="text-[11px] font-mono text-indigo-400 block uppercase tracking-wider">
            Ask the Pattern Model
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder="e.g. Will launching next Tuesday spike my metal deficit stress?"
              className="flex-1 bg-slate-950/60 border border-slate-900 text-xs px-3 py-2 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 placeholder:text-slate-600 font-sans"
            />
            <button
              onClick={onAskQuestion}
              className="px-3 bg-indigo-900/30 text-indigo-400 border border-indigo-800/50 rounded-xl text-xs hover:bg-indigo-900/50 transition-colors"
            >
              Prune
            </button>
          </div>
          <p className="text-[9px] font-mono text-slate-500 leading-normal">
            Queries are instantly parsed against Wood (Expansion), Scorpio (Isolation), and Metal (Rhythm) markers to render customized mock trajectories.
          </p>
        </div>
      )}

      {/* RENDERING PREFERENCE FEEDS */}
      <div className="pt-4 border-t border-slate-900 grid grid-cols-2 gap-3 text-xs">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Visual Level</span>
          <button
            onClick={() => setSymbolicMode(!symbolicMode)}
            className="py-1 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors flex items-center justify-between text-[11px] font-mono"
          >
            <span>Glyph Mode:</span>
            <span className={symbolicMode ? "text-cyan-400 font-semibold" : "text-slate-500 font-medium"}>
              {symbolicMode ? "SYMBOLIC" : "SIMPLE"}
            </span>
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Dynamics</span>
          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            className="py-1 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors flex items-center justify-between text-[11px] font-mono"
          >
            <span>Animations:</span>
            <span className={reducedMotion ? "text-amber-500 font-semibold" : "text-slate-500 font-medium"}>
              {reducedMotion ? "MUTED" : "LIVE"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
