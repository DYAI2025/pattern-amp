/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScenarioBranch, Hypothesis, AgentReflection } from '../../types';
import SourceContributionBars from './SourceContributionBars';
import { AlertCircle, Eye, Compass, ShieldAlert, Sparkles, HelpCircle, ChevronRight, Activity } from 'lucide-react';

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
        <div className="w-12 h-12 rounded-full border border-dashed border-indigo-505/50 border-indigo-500/30 flex items-center justify-center text-slate-500 mb-4 animate-pulse">
          <Activity size={20} className="text-indigo-400" />
        </div>
        <h4 className="text-[10px] font-bold text-indigo-405 text-indigo-400 uppercase tracking-widest">No Branch Locked</h4>
        <p className="text-xs text-slate-500 max-w-[240px] mt-2 leading-relaxed font-sans">
          Hover over or click a curved path in the Scenario Fan cockpit to analyze its tendency projection.
        </p>
      </div>
    );
  }

  // Get dynamic subsets of epistemic labels
  const getEpistemicLabels = (branchId: string) => {
    switch (branchId) {
      case 'br-1':
        return ['Calculated', 'Observed', 'Inferred'];
      case 'br-2':
        return ['Calculated', 'Observed', 'Simulated', 'Uncertain'];
      case 'br-3':
        return ['Observed', 'Calculated'];
      case 'br-4':
        return ['Simulated', 'Inferred'];
      case 'br-5':
        return ['Speculative', 'Uncertain'];
      case 'br-6':
        return ['Simulated', 'Speculative', 'Uncertain'];
      default:
        return ['Inferred', 'Speculative'];
    }
  };

  // Get stance styles
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
    'resonance': 'text-emerald-400 border-emerald-500/20 bg-emerald-950/10',
    'friction': 'text-red-400 border-red-500/20 bg-red-950/10',
    'activation': 'text-blue-400 border-blue-500/20 bg-blue-950/10',
    'withdrawal': 'text-purple-400 border-purple-500/20 bg-purple-950/10',
    'coherence': 'text-cyan-400 border-cyan-500/20 bg-cyan-950/10',
    'tension': 'text-amber-400 border-amber-500/20 bg-amber-950/10',
    'integration': 'text-pink-400 border-pink-500/20 bg-pink-950/10',
  }[selectedBranch.tendencyType] || 'text-slate-400 bg-slate-900';

  return (
    <div className="border border-slate-800 bg-[#080a0f]/60 rounded-2xl p-6 backdrop-blur-md space-y-6 overflow-y-auto max-h-[85vh] custom-scrollbar">
      {/* Label and Headline */}
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[9px] font-mono font-bold uppercase py-0.5 px-2.5 rounded border tracking-widest ${currentThemeColor}`}>
            Selected: {selectedBranch.tendencyType.toUpperCase()}
          </span>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
            {Math.round(selectedBranch.confidence * 100)}% CONFIDENCE
          </span>
        </div>
        <h3 className="text-base font-bold text-slate-100 mt-2 tracking-tight">
          {selectedBranch.title}
        </h3>
        <p className="text-xs text-slate-405 text-slate-400 italic leading-relaxed">
          &ldquo;{selectedBranch.summary}&rdquo;
        </p>
      </div>


      {/* EPISTEMIC TRANSIT LABELS & EXPLAIND DECLARATIONS */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80 pt-4">
        <div className="flex flex-wrap gap-1.5">
          {getEpistemicLabels(selectedBranch.id).map(lbl => (
            <span
              key={lbl}
              className={`text-[8.5px] font-mono border px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                lbl === 'Calculated' ? 'bg-purple-950/20 text-purple-400 border-purple-500/25' :
                lbl === 'Observed' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/25' :
                lbl === 'Inferred' ? 'bg-sky-950/20 text-sky-400 border-sky-500/25' :
                lbl === 'Simulated' ? 'bg-amber-950/20 text-amber-500 border-amber-500/25' :
                lbl === 'Speculative' ? 'bg-indigo-950/20 text-indigo-400 border-indigo-505/25' :
                'bg-red-950/20 text-rose-400 border-red-500/25'
              }`}
            >
              ✦ {lbl}
            </span>
          ))}
        </div>
        
        <button
          onClick={() => setShowWhy(!showWhy)}
          className="text-[9px] font-mono px-2 py-1 rounded bg-black/40 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-705 hover:border-slate-700 transition-all flex items-center gap-1 cursor-pointer"
        >
          <HelpCircle size={11} className="text-indigo-405 text-indigo-400" />
          <span>Why am I seeing this?</span>
        </button>
      </div>

      {/* WHY AM I SEEING THIS? COLLAPSED CONTAINER */}
      {showWhy && (
        <div className="p-3.5 bg-indigo-950/15 border border-indigo-500/20 rounded-xl space-y-3 text-xs animate-fadeIn duration-200">
          <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-1">
            <Sparkles size={11} className="text-indigo-400" />
            <span>Epistemic Disclosure Matrix</span>
          </div>
          <div className="space-y-2 text-slate-300">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider block mb-1">Input Sources & Weights:</span>
              <div className="space-y-1.5 pl-2 border-l border-indigo-500/30">
                {selectedBranch.sources.map((s, idx) => (
                  <div key={idx} className="flex justify-between font-mono text-[10px] text-slate-400 bg-slate-950/40 p-1 rounded px-1.5 border border-slate-900/60">
                    <span>{s.name} <span className="text-[8.5px] text-slate-600">({s.dataType})</span>:</span>
                    <span className="text-indigo-400 font-bold">{s.weight}% <span className="text-[8px] text-slate-600 font-normal">(Conf: {s.confidence})</span></span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 bg-black/20 p-2 rounded-lg border border-slate-900">
              <div>CONFIDENCE: <span className="text-emerald-400 font-bold">{Math.round(selectedBranch.confidence * 100)}%</span></div>
              <div className="text-right">CALIBRATION TIME: <span className="text-slate-200">22-05-2026</span></div>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider block">Rule & Model Explanation:</span>
              <p className="font-sans text-slate-400 leading-relaxed text-[11px] mt-0.5">
                {selectedBranch.whyAppears} This sequence represents a predictive projection matching solar-degree natal vectors against subjective quiz traits {selectedBranch.deviation > 0 ? "diverging positively" : "curving symmetrically"} along the {selectedBranch.horizonRelevance} unit path.
              </p>
            </div>
            <div className="p-2.5 bg-red-950/10 border border-red-500/20 rounded-lg">
              <span className="text-red-400 block font-bold text-[10px] tracking-wide font-mono uppercase">Not-To-Infer Block (Limiter):</span>
              <p className="font-sans text-slate-400 leading-normal text-[10.5px] mt-0.5">
                {selectedBranch.notToInfer}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MANDATORY INTERPRETIVE STRUCTURE */}
      <div className="space-y-4 border-t border-slate-900 pt-4 font-sans text-xs">
        
        {/* 1. What the model sees */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <Eye size={13} className="text-sky-400" />
            <span>What the model sees</span>
          </div>
          <p className="text-slate-450 pl-4 leading-relaxed font-sans text-[11.5px]">
            The system maps a projected path of {selectedBranch.deviation > 0 ? 'internalised withdrawal' : 'active externalization'} extending {selectedBranch.horizonRelevance} arbitrary focus-points outward. The calculated coherence impact is standardly offset by {selectedBranch.coherenceDelta > 0 ? `+${selectedBranch.coherenceDelta}` : selectedBranch.coherenceDelta} points.
          </p>
        </div>

        {/* 2. Why this branch appears */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <HelpCircle size={13} className="text-purple-400" />
            <span>Why this branch appears</span>
          </div>
          <p className="text-slate-450 pl-4 leading-relaxed font-sans text-[11.5px]">
            {selectedBranch.whyAppears} This sequence reflects the convergence of natal aspects loaded on the dominant field with recent daily indicators.
          </p>
        </div>

        {/* 3. What may resonate */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <Compass size={13} className="text-emerald-400" />
            <span>What may resonate</span>
          </div>
          <p className="text-slate-450 pl-4 leading-relaxed font-sans text-[11.5px]">
            {selectedBranch.whatResonates} Direct resonance vectors match your primary baseline configurations.
          </p>
        </div>

        {/* 4. Where friction may arise */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <ShieldAlert size={13} className="text-yellow-505 text-amber-500" />
            <span>Where friction may arise</span>
          </div>
          <p className="text-slate-450 pl-4 leading-relaxed font-sans text-[11.5px]">
            {selectedBranch.whereFriction} Potential friction score levels hover near {selectedBranch.tensionDelta} deviation points of structural tension.
          </p>
        </div>

        {/* 5. What would increase coherence */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <Sparkles size={13} className="text-cyan-400" />
            <span>What would increase coherence</span>
          </div>
          <p className="text-slate-450 pl-4 leading-relaxed font-sans text-[11.5px]">
            {selectedBranch.increaseCoherence} This targets the primary metal structures deficit, adding necessary system boundaries.
          </p>
        </div>

        {/* 6. What not to conclude (NOT-TO-INFER block) */}
        <div className="p-3 bg-red-950/15 border border-red-500/20 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-rose-450 font-semibold text-red-400">
            <AlertCircle size={13} />
            <span className="uppercase text-[10px] tracking-wide font-mono">What not to conclude (Critical Limiter)</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed font-sans pl-4">
            {selectedBranch.notToInfer}
          </p>
        </div>
      </div>

      {/* REFLECTIVE ACTION EXPLANATION COMPONENT */}
      <div className="border-t border-slate-900 pt-4 space-y-2">
        <h4 className="text-[11px] font-mono text-slate-400 uppercase">Scented Reflective Challenge</h4>
        <div className="p-3.5 bg-indigo-950/20 border border-indigo-900/40 rounded-xl">
          <p className="text-[11.5px] font-sans text-indigo-300 font-medium italic">
            &ldquo;{selectedBranch.reflectiveQuestion}&rdquo;
          </p>
        </div>
      </div>

      {/* DATA WEIGHT TRACKING (Embedded Source Bars) */}
      <div className="border-t border-slate-900 pt-4">
        <SourceContributionBars sources={selectedBranch.sources} />
      </div>

      {/* MATCHED HYPOTHESES */}
      <div className="border-t border-slate-900 pt-4 space-y-3">
        <h4 className="text-[11px] font-mono text-slate-400 uppercase">Related working hypotheses</h4>
        <div className="space-y-2">
          {relatedHypotheses.length === 0 ? (
            <div className="text-xs text-slate-600 italic">No specific linkages declared.</div>
          ) : (
            relatedHypotheses.map(hyp => (
              <div 
                key={hyp.id}
                onClick={() => onSelectHypothesis(hyp.id)}
                className="p-2 border border-slate-900 hover:border-slate-800 bg-slate-950/40 rounded-lg flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-350 truncate">{hyp.title}</div>
                  <div className="text-[9.5px] font-mono text-slate-500 mt-0.5 uppercase">Status: {hyp.status} ({hyp.confidence}% Confidence)</div>
                </div>
                <ChevronRight size={12} className="text-slate-500 shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* MATCHED AGENTS ALIGNMENT */}
      <div className="border-t border-slate-900 pt-4 space-y-3">
        <h4 className="text-[11px] font-mono text-slate-400 uppercase">Agent Alignment & Disagreement</h4>
        <div className="space-y-2">
          {agentReflections.map(ref => {
            return (
              <div 
                key={ref.id}
                onClick={() => onSelectAgent(ref.id)}
                className="p-2 bg-slate-950/20 border border-slate-900 rounded-lg cursor-pointer transition-colors hover:border-slate-800"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-slate-300">{ref.agentName}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase tracking-tight shrink-0 ${getStanceBadgeStyle(ref.stance)}`}>
                    {ref.stance}
                  </span>
                </div>
                <p className="text-[10px] text-slate-550 truncate mt-0.5 text-slate-500">{ref.observation}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* INTERACTIVE ACTION BUTTONS */}
      <div className="border-t border-slate-800 pt-4 flex flex-col gap-3 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onAskEve(selectedBranch)}
            className="w-full py-2.5 px-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl text-center font-mono hover:bg-indigo-500/20 transition-all font-semibold uppercase tracking-wider text-[10px]"
          >
            Consult Eve
          </button>
          <button
            onClick={() => onAskSkeptic(selectedBranch)}
            className="w-full py-2.5 px-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-center font-mono hover:bg-red-500/20 transition-all font-semibold uppercase tracking-wider text-[10px]"
          >
            Consult Skeptic
          </button>
        </div>

        <button
          onClick={() => onAskEve(selectedBranch)}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(79,70,229,0.35)] mt-1 hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] cursor-pointer"
        >
          REFLECT WITH LEVI
        </button>
      </div>


    </div>
  );
}
