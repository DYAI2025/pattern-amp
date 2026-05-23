/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AgentReflection, AgentStance } from '../../types';
import { Users, ShieldAlert, Sparkles, CheckCircle, HelpCircle, ChevronRight, MessageSquareOff } from 'lucide-react';

interface AgentReflectionPanelProps {
  reflections: AgentReflection[];
  selectedBranchId: string | null;
  onSelectAgent: (id: string | null) => void;
  selectedAgentId: string | null;
}

export default function AgentReflectionPanel({
  reflections,
  selectedBranchId,
  onSelectAgent,
  selectedAgentId
}: AgentReflectionPanelProps) {
  const [filterStance, setFilterStance] = useState<'all' | AgentStance>('all');
  const [showWhy, setShowWhy] = useState(false);

  const filteredReflections = filterStance === 'all' 
    ? reflections 
    : reflections.filter(r => r.stance === filterStance);

  // Compute stats for Agreement Index visualIZER
  const supportsCount = reflections.filter(r => r.stance === 'supports').length;
  const cautionsCount = reflections.filter(r => r.stance === 'cautions').length;
  const reframesCount = reflections.filter(r => r.stance === 'reframes').length;
  const contradictsCount = reflections.filter(r => r.stance === 'contradicts').length;

  const total = reflections.length;
  const consensusLevel = Math.round(((supportsCount + reframesCount) / total) * 100);

  const getStanceClasses = (stance: AgentStance) => {
    switch (stance) {
      case 'supports':
        return { border: 'border-emerald-950/40 bg-emerald-950/10 text-emerald-400', leftBar: 'bg-emerald-500' };
      case 'cautions':
        return { border: 'border-amber-950/40 bg-amber-950/10 text-amber-400', leftBar: 'bg-amber-500' };
      case 'reframes':
        return { border: 'border-blue-950/40 bg-blue-950/10 text-blue-405 text-blue-400', leftBar: 'bg-blue-500' };
      case 'contradicts':
        return { border: 'border-red-950/40 bg-red-950/10 text-red-400', leftBar: 'bg-red-500' };
    }
  };

  return (
    <div className="border border-slate-800 bg-[#080a0f]/60 rounded-2xl p-5 backdrop-blur-md space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Users size={13} className="text-indigo-400 animate-pulse" />
          <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Agent Reflection Board</h4>
          <span className="text-[8px] font-mono bg-sky-950/20 text-sky-400 border border-sky-500/25 px-1.5 py-0.2 rounded uppercase font-bold tracking-tight">
            ✦ Inferred
          </span>
          <span className="text-[8px] font-mono bg-amber-950/20 text-amber-500 border border-amber-500/25 px-1.5 py-0.2 rounded uppercase font-bold tracking-tight">
            ✦ Simulated
          </span>
        </div>
        
        <button
          onClick={() => setShowWhy(!showWhy)}
          className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/40 border border-slate-800 text-slate-400 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
        >
          <HelpCircle size={10} className="text-indigo-400" />
          <span>Why is this visible?</span>
        </button>
      </div>

      {/* WHY AM I SEEING THIS FOR COGNITIVE DIALOGUES */}
      {showWhy && (
        <div className="p-3 bg-indigo-950/15 border border-indigo-500/20 rounded-xl space-y-2.5 text-[11px] animate-fadeIn">
          <div className="text-[9.5px] font-bold text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-1">
            <Sparkles size={11} className="text-indigo-400" />
            <span>Agent Consensus Epistemic Profile</span>
          </div>
          <div className="space-y-1.5 text-slate-300 font-sans leading-relaxed">
            <div>
              <span className="text-slate-500 block text-[9.5px] uppercase font-mono">Input Sources:</span>
              <span className="text-slate-200">Selected Scenario Branch metrics, active simulation modes, agent persona vectors.</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9.5px] uppercase font-mono">Source Weights:</span>
              <span className="text-slate-200">Eve Strategic Agent (35%), Levi Analytical Agent (45%), Skeptic Objector Agent (20%).</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9.5px] uppercase font-mono">Consensus Confidence:</span>
              <span className="font-mono text-emerald-400 font-bold">{consensusLevel}% Multi-Agent Harmony rating</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9.5px] uppercase font-mono">Model Explanation:</span>
              <p className="text-slate-400 text-[10px]">
                Agent reflections are synthesized by taking distinct philosophical stances to explore potential tensions, helping expose narrative blind spots.
              </p>
            </div>
            <div className="p-2 bg-red-950/10 border border-red-500/20 rounded-lg">
              <span className="text-red-400 block font-bold text-[9px] font-mono uppercase">Not-To-Infer constraints:</span>
              <p className="text-slate-400 text-[10px]">
                Reflecting personas are simulated archetypes designed for self-examination. They are not sentient advisers and should not replace clinical counseling.
              </p>
            </div>
          </div>
        </div>
      )}


      {/* AGREEMENT INDEX VISUALIZER */}
      <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-[11px] font-sans">
          <span className="text-slate-400">Multi-Agent Consensus Index:</span>
          <span className="font-mono text-slate-200 font-bold">{consensusLevel}% Harmony</span>
        </div>
        {/* Proportional Consensus Stacked Bar */}
        <div className="h-2 bg-slate-900 rounded-full flex overflow-hidden w-full">
          <div className="h-full bg-emerald-500" style={{ width: `${(supportsCount / total) * 100}%` }} title="Supports" />
          <div className="h-full bg-blue-500" style={{ width: `${(reframesCount / total) * 100}%` }} title="Reframes" />
          <div className="h-full bg-amber-500" style={{ width: `${(cautionsCount / total) * 100}%` }} title="Cautions" />
          <div className="h-full bg-red-500" style={{ width: `${(contradictsCount / total) * 100}%` }} title="Contradicts" />
        </div>
        <div className="flex justify-between text-[8px] font-mono text-slate-500">
          <span>{supportsCount} Supports</span>
          <span>{reframesCount} Reframes</span>
          <span>{cautionsCount} Cautions</span>
          <span className="text-red-400 font-semibold">{contradictsCount} Skeptic Objections</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1">
        {(['all', 'supports', 'reframes', 'cautions', 'contradicts'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterStance(tab)}
            className={`px-2 py-1 rounded text-[9.5px] uppercase font-mono border transition-all ${
              filterStance === tab
                ? 'bg-slate-900 text-white border-sky-500'
                : 'bg-slate-950/20 text-slate-450 border-slate-900 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* DISAGREEMENT HIGHLIGHT */}
      {filterStance === 'all' && (
        <div className="p-2.5 bg-red-950/5 border border-red-500/10 rounded-xl flex items-start gap-2 text-[10.5px]">
          <MessageSquareOff size={13} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-slate-400 leading-normal">
            <span className="font-semibold text-red-400">Skeptic Agent objection highlighted:</span> &ldquo;The entire construct here is a narrative proxy. If you are sleep-deprived, no amount of cosmic compensation balances focus.&rdquo;
          </p>
        </div>
      )}

      {/* List of Reflections */}
      <div className="space-y-3 max-h-[460px] overflow-y-auto custom-scrollbar pr-1">
        {filteredReflections.map(ref => {
          const style = getStanceClasses(ref.stance);
          const isSelected = selectedAgentId === ref.id;

          return (
            <div
              key={ref.id}
              onClick={() => onSelectAgent(isSelected ? null : ref.id)}
              className={`p-3 border rounded-xl hover:bg-slate-900/45 cursor-pointer transition-all ${
                isSelected ? 'ring-1 ring-sky-500 border-sky-900' : 'border-slate-900 bg-slate-950/25'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[11px] font-semibold text-slate-300">{ref.agentName}</div>
                  <div className="text-[9px] font-mono text-slate-500 mt-0.5 uppercase">{ref.role}</div>
                </div>
                <span className={`text-[8px] font-mono font-bold uppercase py-0.2 px-1 rounded border tracking-tight ${style.border}`}>
                  {ref.stance}
                </span>
              </div>

              {/* Observation Snippet */}
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed font-sans">
                {ref.observation}
              </p>

              {/* Expanded details if selected */}
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-slate-900 space-y-2 text-xs">
                  <div>
                    <span className="text-[9.5px] font-mono uppercase text-amber-400">Cautionary Indicator:</span>
                    <p className="text-slate-400 mt-0.5 font-sans italic">{ref.caution}</p>
                  </div>
                  <div>
                    <span className="text-[9.5px] font-mono uppercase text-sky-400">Reflective Prompter:</span>
                    <p className="text-indigo-300 mt-0.5 font-medium">&ldquo;{ref.reflectiveQuestion}&rdquo;</p>
                  </div>
                  <div className="text-[8.5px] font-mono text-slate-500 text-right">
                    AGENT CONFIDENCE: {ref.confidence}%
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
