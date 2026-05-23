/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Activity, ShieldAlert, Award, TrendingUp, Info, HelpCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ScenarioBranch } from '../../types';

interface CoherenceFieldProps {
  baselineCoherence: number; // e.g. 72
  currentCoherence: number; // e.g. 68
  selectedBranch: ScenarioBranch | null;
}

export default function CoherenceField({
  baselineCoherence,
  currentCoherence,
  selectedBranch
}: CoherenceFieldProps) {
  const [isTechnical, setIsTechnical] = useState(false);
  const [showWhy, setShowWhy] = useState(false);

  // Compute calculated values
  const delta = selectedBranch ? selectedBranch.coherenceDelta : 0;
  const absDelta = Math.abs(delta);
  const projectedCoherence = currentCoherence + delta;
  const tensionLevel = selectedBranch ? selectedBranch.tensionDelta : 1.2;

  // Visual text describing tension status
  const getTensionDescription = (t: number) => {
    if (t > 4) return { text: 'Critical Friction Overload', color: 'text-red-400' };
    if (t > 2.5) return { text: 'Elevated Dynamic Resistance', color: 'text-amber-500' };
    return { text: 'Cohesive Flow Stability', color: 'text-emerald-400' };
  };

  const tensionInfo = getTensionDescription(tensionLevel);

  // Simple math for radial meter
  // Circumference of radius 40 circle = 2 * Math.PI * 40 = 251.3
  const circumference = 251.3;
  const strokeDashoffset = circumference - (currentCoherence / 100) * circumference;
  const projectedOffset = circumference - (projectedCoherence / 100) * circumference;

  return (
    <div className="border border-slate-800 bg-slate-950/80 rounded-2xl p-5 backdrop-blur-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Activity size={14} className="text-cyan-400 animate-pulse" />
          <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">Coherence Alignment</h4>
          <span className="text-[8px] font-mono bg-purple-950/20 text-purple-400 border border-purple-500/25 px-1.5. py-0.2 rounded uppercase font-bold tracking-tight">
            ✦ Calculated
          </span>
          <span className="text-[8px] font-mono bg-sky-950/20 text-sky-450 border border-sky-500/25 px-1.5 py-0.2 rounded uppercase font-bold tracking-tight">
            ✦ Inferred
          </span>
        </div>
        
        {/* Toggle View */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowWhy(!showWhy)}
            className="text-[9px] font-mono border border-slate-800 bg-black/40 text-slate-400 px-2 py-0.5 rounded uppercase hover:text-white transition-colors cursor-pointer"
          >
            Why?
          </button>
          <button
            onClick={() => setIsTechnical(!isTechnical)}
            className="text-[9px] font-mono border border-slate-800 bg-slate-900 text-slate-400 px-2 py-0.5 rounded uppercase hover:text-white transition-colors cursor-pointer"
          >
            {isTechnical ? "Simple" : "Technical"}
          </button>
        </div>
      </div>

      {/* WHY AM I SEEING THIS EXPLAINDER FOR COHERENCE */}
      {showWhy && (
        <div className="p-3 bg-indigo-950/15 border border-indigo-500/20 rounded-xl space-y-2 text-[11px] animate-fadeIn">
          <div className="text-[9.5px] font-bold text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-1">
            <Sparkles size={11} className="text-indigo-400" />
            <span>Coherence Field Epistemic Breakdown</span>
          </div>
          <div className="space-y-1.5 text-slate-300 font-sans leading-relaxed">
            <div>
              <span className="text-slate-500 block text-[9.5px] uppercase font-mono">Input Sources:</span>
              <span className="text-slate-200">Active branch direction vectors, raw tension metrics, user quiz history consistency score.</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9.5px] uppercase font-mono">Source Weights:</span>
              <span className="text-slate-200">Direct Formula subtraction weights: 70% Alignment Coherence score, 30% Active friction penalty factor.</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9.5px] uppercase font-mono">Confidence Value:</span>
              <span className="font-mono text-emerald-400 font-bold">92% (High statistical model mapping)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9.5px] uppercase font-mono">Model Explanation:</span>
              <p className="text-slate-400 text-[10.5px]">
                Coherence represents the geometric distance of your current temporal state from the ideal natal alignment vector, minus calculated focus friction.
              </p>
            </div>
            <div className="p-2 bg-red-950/10 border border-red-500/20 rounded-lg">
              <span className="text-red-400 block font-bold text-[9px] font-mono uppercase">Not-To-Infer Restrictions:</span>
              <p className="text-slate-400 text-[10px]">
                This is not a diagnostic index of emotional stability, psychiatric health, or professional success. It is a symbolic model validation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Primary Row: Radial Ring & Basic Analytics */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Radial Stroke Ring */}
        <div className="relative shrink-0 flex items-center justify-center w-28 h-28">
          {/* Dynamic background radial aura backing blur that intensifies based on the absolute value of coherenceDelta */}
          <motion.div
            className={`absolute inset-2.5 rounded-full filter blur-xl ${
              delta >= 0 ? "bg-cyan-500/20" : "bg-rose-500/20"
            }`}
            animate={{
              opacity: [0.10 + absDelta * 0.04, 0.38 + absDelta * 0.12, 0.10 + absDelta * 0.04],
              scale: [0.94, 1.06 + absDelta * 0.03, 0.94]
            }}
            transition={{
              duration: Math.max(0.8, 3.5 - absDelta * 0.5),
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 100 100">
            <defs>
              <filter id="coherence-meter-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Dynamic Full Concentric Ambient Glow (intensifies with absDelta) */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={delta >= 0 ? '#06b6d4' : '#f43f5e'}
              strokeWidth="2"
              filter="url(#coherence-meter-glow)"
              animate={{
                opacity: [0.03 + absDelta * 0.015, 0.12 + absDelta * 0.04, 0.03 + absDelta * 0.015],
                scale: [0.98, 1.02 + absDelta * 0.01, 0.98],
              }}
              transition={{
                duration: Math.max(1.2, 4.0 - absDelta * 0.5),
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ transformOrigin: 'center' }}
            />

            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-slate-900 fill-none"
              strokeWidth="7"
            />

            {/* Dynamic Active Path Glow Underlay (coaligned with loaded arc, intensifies with absDelta) */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={delta >= 0 ? '#06b6d4' : '#f43f5e'}
              strokeWidth={5 + absDelta * 1.5}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              filter="url(#coherence-meter-glow)"
              animate={{
                opacity: [0.12 + absDelta * 0.04, 0.40 + absDelta * 0.10, 0.12 + absDelta * 0.04],
                strokeWidth: [5 + absDelta * 1.0, 8 + absDelta * 2.0, 5 + absDelta * 1.0]
              }}
              transition={{
                duration: Math.max(1.0, 3.5 - absDelta * 0.4),
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Current Coherence Circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-cyan-500 fill-none transition-all duration-500"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />

            {/* Dynamic Active Glow Overlay on top of the meter (intensifies based on the absolute value of coherenceDelta) */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={delta >= 0 ? '#06b6d4' : '#f43f5e'}
              strokeWidth={7}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              filter="url(#coherence-meter-glow)"
              animate={{
                opacity: [0.15 + absDelta * 0.08, 0.52 + absDelta * 0.16, 0.15 + absDelta * 0.08],
                strokeWidth: [7, 8 + absDelta * 0.5, 7]
              }}
              transition={{
                duration: Math.max(0.7, 3.0 - absDelta * 0.4),
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Selected Projected Branch offset indicator */}
            {selectedBranch && (
              <circle
                cx="50"
                cy="50"
                r="40"
                className={`fill-none transition-all duration-500 stroke-dashed ${delta > 0 ? 'stroke-emerald-450 stroke-emerald-400' : 'stroke-rose-500'}`}
                strokeWidth="2.5"
                strokeDasharray="4 2"
                strokeDashoffset={projectedOffset}
              />
            )}
          </svg>
          {/* Inner ring score indicators */}
          <div className="absolute flex flex-col items-center text-center">
            <span className="text-[10px] uppercase font-mono text-slate-500 leading-none">FIELD</span>
            <span className="text-lg font-mono font-bold text-slate-100 mt-0.5">
              {projectedCoherence.toFixed(1)}%
            </span>
            {selectedBranch && (
              <span className={`text-[8.5px] font-mono leading-none ${delta >= 0 ? "text-emerald-400" : "text-rose-450 text-red-400"}`}>
                {delta >= 0 ? `+${delta}` : delta} delta
              </span>
            )}
          </div>
        </div>

        {/* Basic Stats Stack */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex justify-between text-xs font-sans">
            <span className="text-slate-400">Baseline Target Alignment</span>
            <span className="font-mono text-slate-300">{baselineCoherence}%</span>
          </div>
          <div className="flex justify-between text-xs font-sans">
            <span className="text-slate-400">Active Temporal Level</span>
            <span className="font-mono text-slate-300">{currentCoherence}%</span>
          </div>
          <div className="flex justify-between text-xs font-sans">
            <span className="text-slate-400">Projected Branch Shift</span>
            <span className={`font-mono font-semibold ${delta >= 0 ? "text-emerald-400" : "text-rose-400 text-red-450"}`}>
              {projectedCoherence > currentCoherence ? "Gainful Convergence" : "Divergence Risk"}
            </span>
          </div>
          <div className="h-0.5 border-t border-slate-900 my-1"></div>
          <div className="flex justify-between text-[11px] font-sans">
            <span className="text-slate-505 text-slate-500">System Tension Node:</span>
            <span className={`font-mono font-bold ${tensionInfo.color}`}>{tensionInfo.text}</span>
          </div>
        </div>
      </div>

      {/* SECONDARY ROW: TECHNICAL STATISTICAL breakdown */}
      {isTechnical && (
        <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl text-[10.5px] font-mono space-y-2.5">
          <div className="text-slate-400 uppercase tracking-wider text-[9px] border-b border-slate-900 pb-1">
            Raw Calculation Parameters
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-slate-300">
            <div>Baseline alignment constant: <span className="text-white">0.720</span></div>
            <div>Scorpio Moon isolation index: <span className="text-white">0.450</span></div>
            <div>Wood expansion momentum: <span className="text-white">1.250</span></div>
            <div>Metal structural stiffness: <span className="text-white">0.120</span></div>
            <div>Active daily telemetry logs: <span className="text-white">4 instances</span></div>
            <div>Friction penalty coefficient: <span className="text-white">3.141</span></div>
          </div>
          <div className="text-[8.5px] text-slate-500 border-t border-slate-900 pt-1 leading-normal">
            Formula: AlignmentCoherence(F) = baseline_constant + sum(weights_i * dimension_i) - penalty(decay * tension_delta).
          </div>
        </div>
      )}

      {/* SPECIAL MANDATORY LIABILITY NOTE */}
      <div className="p-2.5 bg-slate-950/20 border border-slate-900 rounded-xl flex items-start gap-1.5">
        <Info size={11} className="text-slate-500 shrink-0 mt-0.5" />
        <p className="text-[9px] font-mono text-slate-500 leading-normal">
          Coherence is a symbolic/model-alignment signal in this prototype. It is not a clinical, psychological, or objective life score.
        </p>
      </div>
    </div>
  );
}
