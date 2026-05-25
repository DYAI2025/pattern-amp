/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, X } from 'lucide-react';
import { ScenarioBranch, ScenarioMode, HorizonType } from '../../types';

interface ScenarioFanProps {
  branches: ScenarioBranch[];
  selectedBranchId: string | null;
  onSelectBranch: (id: string | null) => void;
  symbolicMode: boolean; // true = Symbolic Mode, false = Reduced Symbolism Mode
  reducedMotion: boolean;
  mode: ScenarioMode;
  horizon: HorizonType;
}

export default function ScenarioFan({
  branches,
  selectedBranchId,
  onSelectBranch,
  symbolicMode,
  reducedMotion,
  mode,
  horizon
}: ScenarioFanProps) {
  const [hoveredBranchId, setHoveredBranchId] = useState<string | null>(null);
  const [activePulse, setActivePulse] = useState(true);
  const [showGlossary, setShowGlossary] = useState(false);
  const [expandAll, setExpandAll] = useState(false);

  // Find the currently selected branch and determine its coherenceDelta rating
  const selectedBranch = selectedBranchId
    ? branches.find(b => b.id === selectedBranchId)
    : null;
  const coherenceDelta = selectedBranch ? selectedBranch.coherenceDelta : 1.5;

  // SVG coordinate definitions
  const width = 600;
  const height = 450;
  
  // Origin node is the "Current User Pattern State"
  const startX = 300;
  const startY = 380;

  // Render variables depending on mode and horizon
  const horizonText = {
    'now': 'Immediate Field',
    '7d': '7-Day Drift',
    '30d': '30-Day Outlook',
    '90d': '90-Day Speculator'
  }[horizon];

  // Dynamic warning label for longer horizons
  const horizonUncertainty = {
    'now': 'High local coherence.',
    '7d': 'Dynamic tendency drift.',
    '30d': 'Increasing confidence fog.',
    '90d': 'Maximum uncertainty. Outer limits of prediction calibration.'
  }[horizon];

  // Helper to get tendency color schema
  const getTendencyColor = (type: string) => {
    switch (type) {
      case 'resonance':
        return { stroke: '#10b981', glow: '#34d399', dark: '#047857', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'friction':
        return { stroke: '#ef4444', glow: '#f87171', dark: '#b91c1c', badge: 'bg-red-500/10 text-red-400 border-red-500/20' };
      case 'activation':
        return { stroke: '#3b82f6', glow: '#60a5fa', dark: '#1d4ed8', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
      case 'withdrawal':
        return { stroke: '#a855f7', glow: '#c084fc', dark: '#6b21a8', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
      case 'coherence':
        return { stroke: '#06b6d4', glow: '#22d3ee', dark: '#0891b2', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };
      case 'tension':
        return { stroke: '#f59e0b', glow: '#fbbf24', dark: '#b45309', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'integration':
        return { stroke: '#ec4899', glow: '#f472b6', dark: '#be185d', badge: 'bg-pink-500/10 text-pink-400 border-pink-500/20' };
      default:
        return { stroke: '#94a3b8', glow: '#cbd5e1', dark: '#475569', badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
    }
  };

  // Maps source weights to symbol character
  const getSourceMainSymbol = (branch: ScenarioBranch) => {
    const sorted = [...branch.sources].sort((a, b) => b.weight - a.weight);
    const main = sorted[0]?.name || '';
    if (main.includes('Natal')) return '☉';
    if (main.includes('Quiz')) return '✓';
    if (main.includes('Transit')) return '⌇';
    if (main.includes('Agent')) return '💬';
    if (main.includes('Hypothesis')) return '⚝';
    return '🧲';
  };

  return (
    <div className="relative w-full border border-slate-800 bg-[#030406] rounded-2xl p-6 backdrop-blur-md overflow-hidden">
      {/* Visual Header / Epistemic warning */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4 mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase bg-indigo-505/10 bg-indigo-500/10 px-2 py-0.5 rounded text-indigo-400 border border-indigo-500/20 tracking-widest font-bold">
            {mode.toUpperCase()} MODE
          </span>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-widest mr-1">
              Scenario Fan <span className="text-slate-500">|</span> {horizonText}
            </h3>
            <button
              onClick={() => setShowGlossary(true)}
              className="p-1 px-2.5 rounded-full border border-slate-800/80 bg-slate-900/60 hover:bg-slate-850 text-slate-400 hover:text-white text-[9.5px] font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all"
              title="Understand Glyphs & Semantics"
            >
              <HelpCircle size={10} className="text-indigo-400 animate-pulse" />
              <span>Glyph Key</span>
            </button>
            <button
              onClick={() => setExpandAll(!expandAll)}
              className={`p-1 px-2.5 rounded-full border ${expandAll ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300' : 'border-slate-800/80 bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-850'} text-[9.5px] font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all`}
              title="Override selection & expand all branches at low opacity"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${expandAll ? 'bg-indigo-400 animate-pulse' : 'bg-slate-500'}`}></span>
              <span>Expand All Branches</span>
            </button>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            {horizonUncertainty}
          </p>
        </div>
      </div>


      {/* Main SVG Container */}
      <div className="relative flex justify-center items-center select-none" style={{ minHeight: '390px' }}>
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full max-w-[550px] overflow-visible rounded"
        >
          {/* Definitions for Filters and Glows */}
          <defs>
            {/* Generic Blur Filter for Confidence Fog */}
            <filter id="fog-filter-light" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" />
            </filter>
            <filter id="fog-filter-heavy" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" />
            </filter>

            {/* Glowing filter for high coherence branches */}
            <filter id="coherence-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Vibrating/turbulence filter for high tension branch paths */}
            <filter id="tension-distortion" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="1" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>

          {/* Grid lines Background to project analytical cockpit feel */}
          <g opacity="0.15">
            <line x1={startX} y1={0} x2={startX} y2={height} stroke="#334155" strokeDasharray="3 3" />
            <line x1={0} y1={startY} x2={width} y2={startY} stroke="#334155" strokeDasharray="3 3" />
            <circle cx={startX} cy={startY} r="80" stroke="#475569" fill="none" strokeDasharray="5 5" />
            <circle cx={startX} cy={startY} r="180" stroke="#475569" fill="none" strokeDasharray="5 5" />
            <circle cx={startX} cy={startY} r="280" stroke="#475569" fill="none" strokeDasharray="5 5" />
            {/* Degree vectors */}
            <line x1={startX} y1={startY} x2={startX - 180} y2={startY - 180} stroke="#475569" strokeDasharray="2 4" />
            <line x1={startX} y1={startY} x2={startX + 180} y2={startY - 180} stroke="#475569" strokeDasharray="2 4" />
          </g>

          {/* BACKGROUND FOG OVERLAY for low confidence areas */}
          <g opacity="0.05" fill="url(#radial-fog)" pointerEvents="none">
            <ellipse cx={startX} cy={startY - 150} rx="180" ry="120" fill="#64748b" filter="url(#fog-filter-heavy)" />
          </g>

          {/* HORIZON SCALE ARC MARKINGS */}
          <g className="text-[9px] font-mono fill-slate-600">
            <text x={startX + 5} y={startY - 85} alignmentBaseline="middle">NOW (0d)</text>
            <text x={startX + 5} y={startY - 185} alignmentBaseline="middle">MID HORIZON (7-30d)</text>
            <text x={startX + 5} y={startY - 285} alignmentBaseline="middle">PROjected drift (90d)</text>
          </g>

          {/* BRANCH ARROWS PATHS */}
          {branches.map((branch, idx) => {
            const colors = getTendencyColor(branch.tendencyType);
            const isSelected = selectedBranchId === branch.id;
            const isHovered = hoveredBranchId === branch.id;
            const renderSelected = expandAll ? false : isSelected;

            // Mathematical calculation of curved paths
            // Using horizontal spacing by index
            const count = branches.length;
            const thetaMin = -55; // leftmost angle deg
            const thetaMax = 55;  // rightmost angle deg
            const angleDeg = count > 1 
              ? thetaMin + idx * ((thetaMax - thetaMin) / (count - 1))
              : 0;
            const angleRad = (angleDeg * Math.PI) / 180;

            // Horizon relevance translates to length
            const length = branch.horizonRelevance * (horizon === 'now' ? 0.7 : horizon === '7d' ? 0.9 : horizon === '30d' ? 1.1 : 1.3);
            
            // Raw end point
            const targetX = startX + Math.sin(angleRad) * length;
            const targetY = startY - Math.cos(angleRad) * length;

            // Control points for Quadratic Bezier Curve
            // Deviation skews the curve left or right
            const midX = (startX + targetX) / 2;
            const midY = (startY + targetY) / 2;
            
            // To normal vector of path for curvature
            const normalX = -Math.cos(angleRad) * branch.deviation;
            const normalY = -Math.sin(angleRad) * branch.deviation;
            
            const ctrlX = midX + normalX;
            const ctrlY = midY + normalY;

            // Compute the real midpoint t = 0.5 to place glyph markers perfectly on path!
            const t = 0.5;
            const glyphX = (1 - t) ** 2 * startX + 2 * (1 - t) * t * ctrlX + t ** 2 * targetX;
            const glyphY = (1 - t) ** 2 * startY + 2 * (1 - t) * t * ctrlY + t ** 2 * targetY;

            // Determine stroke attributes
            const strokeWidth = (branch.probabilityWeight || 4) / 1.3 + (isHovered || renderSelected ? 3 : 0);
            const opacity = expandAll 
              ? (isHovered ? 0.45 : 0.22) 
              : (isSelected ? 1 : isHovered ? 0.9 : Math.max(0.15, branch.confidence));
            const isMisty = branch.confidence < 0.5;
            
            // Filters based on tension and coherence
            let filterString = '';
            if (!reducedMotion) {
              if (isMisty) filterString = 'url(#fog-filter-light)';
              if (branch.tensionDelta > 3 && !expandAll) filterString = 'url(#tension-distortion)';
              if ((branch.coherenceDelta > 3 || renderSelected) && !expandAll) filterString = 'url(#coherence-glow)';
            }

            return (
              <g 
                key={branch.id} 
                className="cursor-pointer transition-all duration-300"
                onClick={() => onSelectBranch(isSelected ? null : branch.id)}
                onMouseEnter={() => setHoveredBranchId(branch.id)}
                onMouseLeave={() => setHoveredBranchId(null)}
              >
                {/* Secondary Red/Amber Tension Aura vibrating layered path */}
                {branch.tensionDelta > 2.5 && !reducedMotion && !expandAll && (
                  <path
                    d={`M ${startX},${startY} Q ${ctrlX},${ctrlY} ${targetX},${targetY}`}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth={strokeWidth + 4}
                    strokeLinecap="round"
                    opacity={(0.2 + branch.tensionDelta / 10) * opacity}
                    className="animate-pulse"
                    style={{
                      transformOrigin: `${startX}px ${startY}px`,
                    }}
                  />
                )}

                {/* Main Path Branch */}
                <path
                  d={`M ${startX},${startY} Q ${ctrlX},${ctrlY} ${targetX},${targetY}`}
                  fill="none"
                  stroke={colors.stroke}
                  strokeWidth={strokeWidth}
                  strokeDasharray={branch.isDashed ? '6 6' : undefined}
                  strokeLinecap="round"
                  opacity={opacity}
                  filter={filterString || undefined}
                  className="transition-all duration-300"
                />

                {/* Selected branch outline / halo */}
                {renderSelected && (
                  <path
                    d={`M ${startX},${startY} Q ${ctrlX},${ctrlY} ${targetX},${targetY}`}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    opacity="0.9"
                    strokeDasharray="4 2"
                  />
                )}

                {/* Sub-branch counters counterfactual branch divergence splits visually! */}
                {branch.isDashed && (
                  <path
                    d={`M ${glyphX},${glyphY} Q ${glyphX + (branch.deviation > 0 ? -25 : 25)},${glyphY - 20} ${targetX + (branch.deviation > 0 ? -20 : 20)},${targetY - 15}`}
                    fill="none"
                    stroke={colors.stroke}
                    strokeWidth={Math.max(1, strokeWidth - 2)}
                    strokeDasharray="2 3"
                    opacity={opacity * 0.5}
                  />
                )}

                {/* GLYPH MARKERS OVER PATHS */}
                {symbolicMode && (isHovered || renderSelected || (!expandAll && branch.confidence > 0.4)) && (
                  <g transform={`translate(${glyphX}, ${glyphY})`}>
                    {/* Ring representing source strength */}
                    <circle 
                      r={10 + (renderSelected ? 2 : 0)} 
                      fill="#0b1329" 
                      stroke={colors.stroke}
                      strokeWidth={renderSelected ? 2 : 1}
                      className="transition-all"
                    />
                    <text
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      className="text-[10px] font-sans font-semibold select-none"
                      fill={colors.glow}
                    >
                      {getSourceMainSymbol(branch)}
                    </text>
                  </g>
                )}

                {/* End terminal indicator */}
                <circle 
                  cx={targetX} 
                  cy={targetY} 
                  r={3 + (renderSelected ? 2 : 0)} 
                  fill={colors.stroke} 
                  opacity={opacity}
                />
              </g>
            );
          })}

          {/* ORIGIN NODE (Representation of Current User Pattern State) */}
          <g 
            transform={`translate(${startX}, ${startY})`}
            onClick={() => onSelectBranch(null)}
            className="cursor-pointer"
          >
            {/* Real-time Coherence Pulse Visual Effect */}
            {!reducedMotion && (
              <>
                {/* Concentric Coherence Pulse Ring 1 */}
                <motion.circle
                  cx="0"
                  cy="0"
                  r="7"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="1.5"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{
                    scale: [1, 1.4 + coherenceDelta * 0.4],
                    opacity: [0.8, 0],
                  }}
                  transition={{
                    duration: Math.max(0.7, 3.0 - (coherenceDelta * 0.4)),
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />

                {/* Concentric Coherence Pulse Ring 2 - lagging echo */}
                <motion.circle
                  cx="0"
                  cy="0"
                  r="7"
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="1"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{
                    scale: [1, 1.25 + coherenceDelta * 0.3],
                    opacity: [0.5, 0],
                  }}
                  transition={{
                    duration: Math.max(0.7, 3.0 - (coherenceDelta * 0.4)),
                    delay: Math.max(0.3, 1.5 - (coherenceDelta * 0.2)),
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />

                {/* Ambient dynamic radial backdrop glow */}
                <motion.circle
                  cx="0"
                  cy="0"
                  r="14"
                  fill="#06b6d4"
                  opacity="0.15"
                  filter="url(#coherence-glow)"
                  animate={{
                    scale: [0.95, 1.05 + (coherenceDelta * 0.04), 0.95],
                    opacity: [0.1, 0.2 + (coherenceDelta * 0.05), 0.1]
                  }}
                  transition={{
                    duration: Math.max(0.9, 3.5 - (coherenceDelta * 0.5)),
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </>
            )}

            {/* Ambient live pulsing glow ring for current temporal field */}
            <circle
              r="24"
              fill="none"
              stroke="#64748b"
              strokeWidth="1"
              opacity="0.3"
              className={reducedMotion ? '' : 'animate-ping'}
              style={{ animationDuration: '3s' }}
            />

            {/* Outer ring = current temporal field  */}
            <circle
              r="18"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              className={reducedMotion ? '' : 'animate-spin'}
              style={{ animationDuration: '12s' }}
            />

            {/* Middle ring = calibrated pattern memory */}
            <circle
              r="12"
              fill="none"
              stroke="#818cf8"
              strokeWidth="2"
              strokeDasharray="4 2"
              className={reducedMotion ? '' : 'animate-spin'}
              style={{ animationDuration: '6s', animationDirection: 'reverse' }}
            />

            {/* Inner ring & seed element = stable natal baseline */}
            <circle
              r="7"
              fill="#c084fc"
              className={reducedMotion ? '' : 'animate-pulse'}
            />

            {/* Microdot center */}
            <circle r="2.5" fill="#f8fafc" />
          </g>
        </svg>

        {/* Dynamic central legend for origin rings on hover */}
        <div className="absolute bottom-1 left-2 space-y-0.5 text-[9px] font-mono text-slate-500 bg-slate-950/90 border border-slate-900 rounded p-1.5 pointer-events-none">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>Outer: Temporal Field</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            <span>Mid: Pattern Memory</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            <span>Core: Natal Baseline</span>
          </div>
        </div>
      </div>

      {/* Floating interactive details layer / Quick tooltip if no selected branch */}
      <AnimatePresence>
        {hoveredBranchId && !selectedBranchId && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-5 left-5 right-5 p-3 bg-slate-900/95 border border-slate-800 rounded-xl shadow-xl flex items-center justify-between gap-3"
          >
            {(() => {
              const b = branches.find(x => x.id === hoveredBranchId);
              if (!b) return null;
              const colorInfo = getTendencyColor(b.tendencyType);
              return (
                <>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${colorInfo.badge}`}>
                        {b.tendencyType}
                      </span>
                      <h4 className="text-xs font-semibold text-white truncate">{b.title}</h4>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{b.summary}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-slate-400">Confidence</span>
                    <div className="text-xs font-semibold text-slate-200">{Math.round(b.confidence * 100)}%</div>
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOSSARY KEY MODAL */}
      <AnimatePresence>
        {showGlossary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setShowGlossary(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="w-full max-w-2xl bg-[#080a0f] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Corner Close button */}
              <button
                onClick={() => setShowGlossary(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>

              {/* Title Header */}
              <div className="space-y-1.5 border-b border-slate-800 pb-4">
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-widest">Dashboard & Amplifier Index</span>
                <h3 className="text-lg font-bold text-white tracking-tight uppercase">Understanding the Glyphs & Semantics</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Deciphering the dynamic branch indicators, mathematical curves, and historical source coordinates of both the Scenario Fan and the reflective Pattern Amplifier.
                </p>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Section A: Source Glyph Markers */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-800/60 pb-1.5">
                    <span className="text-[10px] font-mono font-bold text-indigo-400">01. SOURCE GLYPHS IN COCKPIT & AMPLIFIER</span>
                  </div>
                  <div className="space-y-3.5">
                    <div className="flex gap-3">
                      <div className="w-7 h-7 shrink-0 rounded-lg bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-xs font-bold text-indigo-400 font-mono">
                        ☉
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-200">Western / Natal Baseline</h4>
                        <p className="text-[10.5px] text-slate-400 leading-relaxed">
                          Core chronological coordinates sourced directly from stable planetary solar longitude degree distributions.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-7 h-7 shrink-0 rounded-lg bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-xs font-bold text-indigo-400 font-mono">
                        甲
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-200">BaZi / Day Master & Wu-Xing</h4>
                        <p className="text-[10.5px] text-slate-400 leading-relaxed">
                          Strong dynamic elements balance and fusion coordinates (Wood, Metal, Earth, Fire, Water) that ground individual expression.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-7 h-7 shrink-0 rounded-lg bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-xs font-bold text-indigo-400 font-mono">
                        ✓
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-200">Quiz Vectors</h4>
                        <p className="text-[10.5px] text-slate-400 leading-relaxed">
                          Subjective near-term calibrations calculated from active cognitive quizzes and state-rating questionnaires.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-7 h-7 shrink-0 rounded-lg bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-xs font-bold text-indigo-400 font-mono">
                        💬
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-200">Agent Memory Reflections</h4>
                        <p className="text-[10.5px] text-slate-400 leading-relaxed">
                          Consensus alignment ratings generated from simulated strategic (Eve) and analytical (Levi) agent evaluations.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-7 h-7 shrink-0 rounded-lg bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-xs font-bold text-indigo-400 font-mono">
                        ⚝
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-200">Seven Hypotheses Matrix</h4>
                        <p className="text-[10.5px] text-slate-400 leading-relaxed">
                          Linked astronomical transits mapped dynamically as active cognitive models and tendencies indicators.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-7 h-7 shrink-0 rounded-lg bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-xs font-bold text-indigo-400 font-mono">
                        ⌇
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-200">Transit Daily Field & Space Weather</h4>
                        <p className="text-[10.5px] text-slate-400 leading-relaxed">
                          Real-time space weather, geomagnetic variables, and planetary transit pressure vectors influencing cumulative drift.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section B: Branch Visual Semantics */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-800/60 pb-1.5">
                    <span className="text-[10px] font-mono font-bold text-indigo-400">02. SECTOR & AMPLIFIER VISUAL SEMANTICS</span>
                  </div>
                  <div className="space-y-4 font-sans">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono text-[9px]">Solid vs Dashed Lines</h4>
                      <p className="text-[10.5px] text-slate-400 mt-1 leading-relaxed">
                        Solid pathways signify verified core tendency trajectories with integrated support. Dashed lines indicate counterfactual speculative alternative forks or divergent splits where forces conflict.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono text-[9px]">Confidence Fog</h4>
                      <p className="text-[10.5px] text-slate-400 mt-1 leading-relaxed">
                        Visual clarity represents model precision. High confidence paths are rendered thick and solid; low-confidence projections fade into semi-transparency and thin, misty dashed lines as they approach the fog.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono text-[9px]">vibrating red aura (Friction Aura)</h4>
                      <p className="text-[10.5px] text-slate-400 mt-1 leading-relaxed">
                        High cognitive friction, element clashes, or active emotional resistance triggers a vibrating/pulsating warm red/pink aura overlay on the branch trajectory.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono text-[9px]">Path Curvature / Vector Projection</h4>
                      <p className="text-[10.5px] text-slate-400 mt-1 leading-relaxed">
                        Models of active variation from birth baseline. Our 2.5D SVG/3D projection maps X (Agency action), Y (Coherence alignment), and Z (Externalization visibility) to express qualitative tendencies.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono text-[9px]">Coherence Pulse</h4>
                      <p className="text-[10.5px] text-slate-400 mt-1 leading-relaxed">
                        The origin hub pulsates with concentric turquoise and indigo waves, intensifying or stabilizing dynamically based on the coherence alignment coefficient of your currently locked branch.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Close Bottom bar button */}
              <div className="border-t border-slate-805 border-slate-800 pt-4 text-right">
                <button
                  onClick={() => setShowGlossary(false)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(79,70,229,0.35)] cursor-pointer"
                >
                  Return to Cockpit
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
