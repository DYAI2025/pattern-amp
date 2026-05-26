/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScenarioBranch, Hypothesis, AgentReflection } from '../../types';
import SourceContributionBars from './SourceContributionBars';
import { EpistemicTag } from './EpistemicStatusStrip';
import { 
  AlertCircle, Eye, Compass, ShieldAlert, Sparkles, HelpCircle, 
  ChevronRight, Activity, Zap, Shield, MessageSquare, ArrowRightLeft 
} from 'lucide-react';
import { RollingText } from '../ui/RollingText';

interface BranchDetailPanelProps {
  selectedBranch: ScenarioBranch | null;
  relatedHypotheses: Hypothesis[];
  agentReflections: AgentReflection[];
  onSelectHypothesis: (id: string) => void;
  onSelectAgent: (id: string) => void;
  onAskEve: (branch: ScenarioBranch) => void;
  onAskSkeptic: (branch: ScenarioBranch) => void;
}

export default function BranchDetailPanel({
  selectedBranch,
  relatedHypotheses,
  agentReflections,
  onSelectHypothesis,
  onSelectAgent,
  onAskEve,
  onAskSkeptic
}: BranchDetailPanelProps) {
  const [showWhy, setShowWhy] = useState(false);

  if (!selectedBranch) {
    return (
      <div className="border border-slate-800 bg-[#080a0f]/60 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-center items-center text-center min-h-[400px]">
        <div className="w-12 h-12 rounded-full border border-dashed border-indigo-500/30 flex items-center justify-center text-slate-500 mb-4 animate-pulse">
          <Activity size={20} className="text-indigo-400" />
        </div>
        <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">No Branch Locked</h4>
        <p className="text-xs text-slate-500 max-w-[240px] mt-2 leading-relaxed font-sans">
          Hover over or click a curved path in the Scenario Fan cockpit to analyze its tendency projection.
        </p>
      </div>
    );
  }

  // Stance styles for agent list
  const getStanceBadgeStyle = (stance: string) => {
    switch (stance) {
      case 'supports':
        return 'bg-emerald-950/30 text-emerald-400 border-emerald-900/55';
      case 'cautions':
        return 'bg-amber-950/30 text-amber-400 border-amber-900/55';
      case 'reframes':
        return 'bg-blue-950/30 text-blue-400 border-blue-900/55';
      case 'contradicts':
        return 'bg-red-950/30 text-red-400 border-red-900/55';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  const currentThemeColor = {
    'resonance': 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20 shadow-[0_0_8px_rgba(16,185,129,0.15)]',
    'friction': 'text-red-400 border-red-500/20 bg-red-950/20 shadow-[0_0_8px_rgba(239,68,68,0.15)]',
    'activation': 'text-blue-400 border-blue-500/20 bg-blue-950/20 shadow-[0_0_8px_rgba(59,130,246,0.15)]',
    'withdrawal': 'text-purple-400 border-purple-500/20 bg-purple-950/20 shadow-[0_0_8px_rgba(168,85,247,0.15)]',
    'coherence': 'text-cyan-400 border-cyan-500/20 bg-cyan-950/20 shadow-[0_0_8px_rgba(34,211,238,0.15)]',
    'tension': 'text-amber-400 border-amber-500/20 bg-amber-950/20 shadow-[0_0_8px_rgba(245,158,11,0.15)]',
    'integration': 'text-pink-400 border-pink-500/20 bg-pink-950/20 shadow-[0_0_8px_rgba(236,72,153,0.15)]',
  }[selectedBranch.tendencyType] || 'text-slate-400 bg-slate-900 border-slate-800';

  // Calculate Resonance & Friction levels for top dashboard gauges (0-10 Scale)
  const calculatedResonance = Math.max(0, Math.min(10, Math.round((selectedBranch.coherenceDelta + 3) * 1.5)));
  const calculatedFriction = Math.max(0, Math.min(10, Math.round(selectedBranch.tensionDelta * 2)));

  return (
    <div className="border border-slate-800 bg-[#080a0f]/60 rounded-2xl p-6 backdrop-blur-md space-y-6 overflow-y-auto max-h-[85vh] custom-scrollbar">
      
      {/* 1. Header: Headline & Summary & Tendency */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <span className={`text-[9px] font-mono font-bold uppercase py-0.5 px-2.5 rounded border tracking-widest ${currentThemeColor}`}>
            Projected Pattern: {selectedBranch.tendencyType.toUpperCase()}
          </span>
          
          <EpistemicTag type={selectedBranch.isDashed ? 'speculative' : 'simulated'} />
        </div>
        
        <h3 className="text-lg font-bold text-slate-100 tracking-tight leading-snug">
          <RollingText text={selectedBranch.title} />
        </h3>
        
        <p className="text-xs text-slate-450 text-slate-350 italic leading-relaxed border-l-2 border-indigo-500/40 pl-3.5 bg-indigo-950/5 py-1.5 rounded-r-xl">
          &ldquo;{selectedBranch.summary}&rdquo;
        </p>
      </div>

      {/* 2. Top Signals Engine Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 border-t border-b border-slate-900 py-4">
        
        {/* Resonance Signal Gauge */}
        <div className="p-3 bg-emerald-950/5 border border-emerald-500/10 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Sparkles size={11} />
              RESONANCE SIGNAL
            </span>
            <span className="text-slate-400 font-semibold">{calculatedResonance}/10 Magnitude</span>
          </div>
          <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden w-full flex border border-slate-900">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_8px_#10b981]" 
              style={{ width: `${calculatedResonance * 10}%` }}
            />
          </div>
          <p className="text-[9.5px] font-mono text-slate-500">
            Measures structural support from Wood alignments and active transits.
          </p>
        </div>

        {/* Friction Signal Gauge */}
        <div className="p-3 bg-red-950/5 border border-red-500/10 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-red-400 font-bold flex items-center gap-1">
              <ShieldAlert size={11} />
              FRICTION SIGNAL
            </span>
            <span className="text-slate-400 font-semibold">{calculatedFriction}/10 Resistance</span>
          </div>
          <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden w-full flex border border-slate-900">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_8px_#ef4444]" 
              style={{ width: `${calculatedFriction * 10}%` }}
            />
          </div>
          <p className="text-[9.5px] font-mono text-slate-500">
            Measures counterfactual resistance points and boundaries pressure.
          </p>
        </div>

      </div>

      {/* 3. Coherence and Tension Shifts */}
      <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl flex items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-2">
          <ArrowRightLeft size={13} className="text-[#22d3ee]" />
          <span className="font-mono text-slate-400 font-semibold">COHERENCE & TENSION SHIFT STATS:</span>
        </div>
        <div className="flex gap-4 font-mono text-xs">
          <div className="flex items-center gap-1 bg-emerald-950/10 px-2.5 py-1 rounded border border-emerald-500/20 text-emerald-400 font-bold">
            Coherence: {selectedBranch.coherenceDelta >= 0 ? `+${selectedBranch.coherenceDelta}` : selectedBranch.coherenceDelta}
          </div>
          <div className="flex items-center gap-1 bg-amber-950/10 px-2.5 py-1 rounded border border-amber-500/20 text-amber-500 font-bold">
            Tension: {selectedBranch.tensionDelta >= 0 ? `+${selectedBranch.tensionDelta}` : selectedBranch.tensionDelta}
          </div>
        </div>
      </div>

      {/* 4. Epistemic Disclosure Button Option & Inline Reveal Drawer */}
      <div className="flex items-center justify-between gap-2.5 bg-black/20 p-2.5 rounded-xl border border-slate-900">
        <div className="flex items-center gap-2 font-mono text-[9.5px] text-slate-400">
          <Shield size={12} className="text-indigo-400" />
          <span>Need explanation on the sources mapping calculations?</span>
        </div>
        
        <button
          onClick={() => setShowWhy(!showWhy)}
          className="text-[9px] font-mono px-3 py-1.5 rounded-lg bg-black font-semibold border border-indigo-500/30 text-indigo-400 hover:text-indigo-300 hover:border-indigo-400 hover:shadow-[0_0_6px_rgba(99,102,241,0.2)] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <HelpCircle size={11} className="text-indigo-400 animate-pulse" />
          <span>Why am I seeing this?</span>
        </button>
      </div>

      {/* EPISTEMIC DISCLOSURE DRAWER CARDS COLLAPSIBLE */}
      {showWhy && (
        <div className="p-4 bg-indigo-950/15 border border-indigo-500/20 rounded-xl space-y-4 text-xs animate-fadeIn duration-200">
          <div className="text-[10px] font-bold text-indigo-450 text-indigo-400 uppercase tracking-widest font-mono flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles size={11} className="text-indigo-400" />
              <span>Epistemic Disclosure Matrix</span>
            </span>
            <span className="text-slate-500 text-[9px]">TRACE ID: {selectedBranch.id}-001</span>
          </div>

          <div className="space-y-3.5 text-slate-300">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider block mb-1.5 font-bold">
                Trace Input Sources & Scaled Weights:
              </span>
              <div className="space-y-1.5 pl-2.5 border-l-2 border-indigo-500/30">
                {selectedBranch.sources.map((s, idx) => (
                  <div key={idx} className="flex justify-between font-mono text-[10px] text-slate-400 bg-slate-950/60 p-1.5 rounded-lg border border-slate-900/60">
                    <span className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                      {s.name} <span className="text-[8.5px] text-slate-650">({s.dataType})</span>
                    </span>
                    <span className="text-indigo-400 font-bold">{s.weight}% <span className="text-[8.5px] text-slate-600 font-normal">({s.confidence} confidence)</span></span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 bg-black/40 p-2 rounded-lg border border-slate-900">
              <div>AUTHORITATIVE CONFIDENCE: <span className="text-emerald-400 font-bold">{Math.round(selectedBranch.confidence * 100)}%</span></div>
              <div className="text-right">CALIBRATION RE-RUN: <span className="text-slate-200 font-bold">22-05-2026</span></div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider block font-bold">Rule & Model Explanation:</span>
              <p className="font-sans text-slate-400 leading-relaxed text-[11px]">
                {selectedBranch.whyAppears} This projection maps multi-aspect solar parameters against the dynamic natal framework {selectedBranch.deviation > 0 ? "curving away" : "aligning toward"} the horizon threshold. Core not-to-infer boundaries are enforced at source to prevent predictive oversteering.
              </p>
            </div>

            <div className="p-3 bg-red-950/15 border border-red-500/20 rounded-lg">
              <span className="text-red-400 block font-bold text-[10px] tracking-wide font-mono uppercase">Not-To-Infer Guidance (Safety Limiter):</span>
              <p className="font-sans text-slate-400 leading-normal text-[10.5px] mt-1 italic">
                {selectedBranch.notToInfer}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. MANDATORY INTERPRETIVE STRUCTURE */}
      <div className="space-y-4 border-t border-slate-900 pt-4 font-sans text-xs">
        
        {/* 1. What the model sees */}
        <div className="space-y-1 p-2 bg-slate-950/10 border border-slate-900/40 rounded-xl relative">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold uppercase text-[10px] tracking-wider">
            <Eye size={13} className="text-sky-400 shrink-0" />
            <span>What the model sees</span>
            <span className="absolute right-2 top-2"><EpistemicTag type="simulated" className="text-[7.5px] px-1.5" /></span>
          </div>
          <p className="text-slate-400 pl-5 leading-relaxed font-sans text-[11.5px] mt-1">
            The mathematical trajectory maps a counterfactual path extending {selectedBranch.horizonRelevance} focus-points into your selected horizon. The alignment profile indexes Wood at its high base value, offset by {selectedBranch.coherenceDelta >= 0 ? `+${selectedBranch.coherenceDelta}` : selectedBranch.coherenceDelta} coherence units.
          </p>
        </div>

        {/* 2. Why this branch appears */}
        <div className="space-y-1 p-2 bg-slate-950/10 border border-slate-900/40 rounded-xl relative">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold uppercase text-[10px] tracking-wider">
            <HelpCircle size={13} className="text-purple-400 shrink-0" />
            <span>Why this branch appears</span>
            <span className="absolute right-2 top-2"><EpistemicTag type="inferred" className="text-[7.5px] px-1.5" /></span>
          </div>
          <p className="text-slate-400 pl-5 leading-relaxed font-sans text-[11.5px] mt-1">
            {selectedBranch.whyAppears} Active transit forces trigger responses on both your Wood-growth initiative tracks and Scorpio comfort baselines.
          </p>
        </div>

        {/* 3. What may resonate */}
        <div className="space-y-1 p-2 bg-slate-950/10 border border-slate-900/40 rounded-xl relative">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold uppercase text-[10px] tracking-wider">
            <Compass size={13} className="text-emerald-400 shrink-0" />
            <span>What may resonate</span>
            <span className="absolute right-2 top-2"><EpistemicTag type="calculated" className="text-[7.5px] px-1.5" /></span>
          </div>
          <p className="text-slate-400 pl-5 leading-relaxed font-sans text-[11.5px] mt-1">
            {selectedBranch.whatResonates} The core Jia Wood upward expansion seeks immediate release and growth strategies.
          </p>
        </div>

        {/* 4. Where friction may arise */}
        <div className="space-y-1 p-2 bg-slate-950/10 border border-slate-900/40 rounded-xl relative">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold uppercase text-[10px] tracking-wider">
            <ShieldAlert size={13} className="text-amber-500 shrink-0" />
            <span>Where friction may arise</span>
            <span className="absolute right-2 top-2"><EpistemicTag type="simulated" className="text-[7.5px] px-1.5" /></span>
          </div>
          <p className="text-slate-400 pl-5 leading-relaxed font-sans text-[11.5px] mt-1">
            {selectedBranch.whereFriction} Scorpio Moon avoidance impulses clash with high professional schedule accountability, leading to {selectedBranch.tensionDelta} shift units of dynamic friction.
          </p>
        </div>

        {/* 5. What would increase coherence */}
        <div className="space-y-1 p-2 bg-slate-950/10 border border-slate-900/40 rounded-xl relative">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold uppercase text-[10px] tracking-wider">
            <Sparkles size={13} className="text-cyan-400" />
            <span>What would increase coherence</span>
            <span className="absolute right-2 top-2"><EpistemicTag type="calculated" className="text-[7.5px] px-1.5" /></span>
          </div>
          <p className="text-slate-400 pl-5 leading-relaxed font-sans text-[11.5px] mt-1">
            {selectedBranch.increaseCoherence} Adding strong Metal trellis scaffolding (such as visual calendars and non-negotiable boundaries) channels wild growths into productive outputs.
          </p>
        </div>

        {/* 6. What not to conclude (Safety block) */}
        <div className="p-3 bg-red-950/15 border-2 border-red-500/20 rounded-xl space-y-1 relative">
          <span className="absolute right-2 top-2"><EpistemicTag type="speculative" className="text-[7.5px] px-1.5" /></span>
          <div className="flex items-center gap-1.5 text-red-400 font-bold block text-[10px] tracking-wide font-mono uppercase">
            <AlertCircle size={13} />
            <span>What not to conclude (Critical Limiter)</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed font-sans pl-5 pt-0.5">
            {selectedBranch.notToInfer} Do not read these patterns as fixed psychic doom predictions or unavoidable setbacks.
          </p>
        </div>

      </div>

      {/* 6. Scented Reflective Challenge */}
      <div className="border-t border-slate-900 pt-4 space-y-2">
        <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-widest font-bold">Reflective Challenge Challenge</h4>
        <div className="p-4 bg-indigo-950/20 border border-indigo-900/40 rounded-2xl relative shadow-[inset_0_0_12px_rgba(99,102,241,0.1)]">
          <div className="absolute right-3 top-3"><EpistemicTag type="inferred" className="text-[7.5px] px-1.5" /></div>
          <p className="text-[11.5px] font-sans text-indigo-300 font-semibold italic pl-1 leading-relaxed pr-8">
            &ldquo;{selectedBranch.reflectiveQuestion}&rdquo;
          </p>
        </div>
      </div>

      {/* 7. Primary Source Mix Breakdown */}
      <div className="border-t border-slate-900 pt-4">
        <SourceContributionBars sources={selectedBranch.sources} />
      </div>

      {/* 8. Related Working Hypotheses Linkages */}
      <div className="border-t border-slate-900 pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-widest font-bold">Related working hypotheses</h4>
          <span className="text-[8.5px] font-mono text-slate-600">CLICK CARD TO FLIP/FOCUS</span>
        </div>
        
        <div className="space-y-2">
          {relatedHypotheses.length === 0 ? (
            <div className="text-xs text-slate-600 italic font-mono">No active pattern linkages connected.</div>
          ) : (
            relatedHypotheses.map(hyp => (
              <div 
                key={hyp.id}
                onClick={() => onSelectHypothesis(hyp.id)}
                className="p-3 border border-slate-900 hover:border-indigo-500/50 bg-slate-950/40 hover:bg-slate-950/80 rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200"
              >
                <div className="min-w-0 space-y-1">
                  <div className="text-xs font-semibold text-slate-200 truncate pr-2">{hyp.title}</div>
                  <div className="flex items-center gap-2 text-[9px] font-mono">
                    <EpistemicTag type="inferred" className="text-[7px] px-1 border-0" />
                    <span className="text-slate-500">Confidence: <span className="text-slate-300 font-bold">{hyp.confidence}%</span></span>
                  </div>
                </div>
                <ChevronRight size={13} className="text-indigo-400 shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* 9. Agent Stance & Disagreement Alignment */}
      <div className="border-t border-slate-900 pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-widest font-bold">Agent Alignment Disagreement</h4>
          <span className="text-[8.5px] font-mono text-slate-600">Universal Tags Activated</span>
        </div>
        
        <div className="space-y-2">
          {agentReflections.map(ref => {
            return (
              <div 
                key={ref.id}
                onClick={() => onSelectAgent(ref.id)}
                className="p-3 bg-[#0c0f16]/30 border border-slate-900 rounded-xl cursor-pointer hover:border-slate-800 hover:bg-[#0c0f16]/60 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2.5 flex-wrap">
                  <span className="text-xs font-semibold text-slate-250 font-sans flex items-center gap-1">
                    <MessageSquare size={11} className="text-slate-500" />
                    {ref.agentName}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className={`text-[8.5px] px-1.5 py-0.2 rounded border uppercase font-bold tracking-tight shrink-0 ${getStanceBadgeStyle(ref.stance)}`}>
                      {ref.stance}
                    </span>
                    <EpistemicTag type="observed" className="text-[7.5px] border-0" />
                  </div>
                </div>
                <p className="text-[10.5px] text-slate-400 leading-normal pl-4 font-sans line-clamp-2">
                  &ldquo;{ref.observation}&rdquo;
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Agent Controls Button Footers */}
      <div className="border-t border-slate-800 pt-4.5 space-y-2.5 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onAskEve(selectedBranch)}
            className="w-full py-2.5 px-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl text-center font-mono hover:bg-indigo-500/20 transition-all font-semibold uppercase tracking-wider text-[10px] cursor-pointer"
          >
            Consult Eve Agent
          </button>
          <button
            onClick={() => onAskSkeptic(selectedBranch)}
            className="w-full py-2.5 px-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-center font-mono hover:bg-red-500/20 transition-all font-semibold uppercase tracking-wider text-[10px] cursor-pointer"
          >
            Consult Skeptic Agent
          </button>
        </div>

        <button
          onClick={() => onAskEve(selectedBranch)}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(79,70,229,0.35)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] cursor-pointer"
        >
          REFLECT WITH LEVI STRATEGIC
        </button>
      </div>

    </div>
  );
}
