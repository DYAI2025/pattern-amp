/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PatternMemory, AgentObservation, PatternDrift } from '../../types';
import { Database, Eye, Award, HelpCircle, GitCommit, Compass, TrendingUp, Info, Sparkles, Calendar } from 'lucide-react';

interface PatternMemoryPanelProps {
  memory: PatternMemory;
}

export default function PatternMemoryPanel({ memory }: PatternMemoryPanelProps) {
  const [activeTab, setActiveTab] = useState<'quiz' | 'observations' | 'drifts'>('quiz');
  const [showWhy, setShowWhy] = useState(false);
  const [hoveredEventIdx, setHoveredEventIdx] = useState<number | null>(null);

  // Historical trends of the top 3 patterns over the last four check-in events
  const checkInEvents = ['Check-in T-3', 'Check-in T-2', 'Check-in T-1', 'Current Snapshot'];
  
  const checkInDates = [
    'May 01, 2026',
    'May 08, 2026',
    'May 15, 2026',
    'May 22, 2026'
  ];
  
  const driftHistory = [
    {
      patternName: 'Metal Deficiency Structure-Seeking',
      color: '#10b981', // emerald
      glowColor: 'rgba(16, 185, 129, 0.4)',
      textColor: 'text-emerald-400',
      tagColor: 'bg-emerald-950/30 text-emerald-400 border-emerald-500/20',
      values: [55, 60, 65, 80] // strengthened over time
    },
    {
      patternName: 'Scorpio Moon Hermit Withdrawal',
      color: '#6366f1', // indigo
      glowColor: 'rgba(99, 102, 241, 0.4)',
      textColor: 'text-indigo-400',
      tagColor: 'bg-indigo-950/30 text-indigo-400 border-indigo-500/20',
      values: [70, 65, 58, 45] // weakened over time
    },
    {
      patternName: 'Wood-Metal Boundary Contrast',
      color: '#ef4444', // red/rose/coral - conflict detected
      glowColor: 'rgba(239, 68, 68, 0.4)',
      textColor: 'text-red-400',
      tagColor: 'bg-red-950/30 text-red-400 border-red-500/20',
      values: [40, 65, 35, 78] // volatile/polarizing shift
    }
  ];

  const xCoords = [55, 175, 295, 415];
  const scaleY = (val: number) => {
    // 0 -> 115, 100 -> 25
    return 115 - (val / 100) * 90;
  };

  return (
    <div className="border border-slate-800 bg-[#080a0f]/60 rounded-2xl p-5 backdrop-blur-md space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Database size={13} className="text-indigo-405 text-indigo-400 animate-pulse" />
          <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Pattern Memory</h4>
          <span className="text-[8px] font-mono bg-emerald-950/20 text-emerald-400 border border-emerald-500/25 px-1.5 py-0.2 rounded uppercase font-bold tracking-tight animate-pulse">
            ✦ Observed
          </span>
          <span className="text-[8px] font-mono bg-purple-950/20 text-purple-400 border border-purple-500/25 px-1.5 py-0.2 rounded uppercase font-bold tracking-tight">
            ✦ Calculated
          </span>
          <span className="text-[8px] font-mono bg-sky-950/20 text-sky-400 border border-sky-500/25 px-1.5 py-0.2 rounded uppercase font-bold tracking-tight">
            ✦ Inferred
          </span>
        </div>
        
        <button
          onClick={() => setShowWhy(!showWhy)}
          className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/40 border border-slate-800 text-slate-400 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
        >
          <HelpCircle size={10} className="text-indigo-450 text-indigo-400" />
          <span>Why is this visible?</span>
        </button>
      </div>

      {/* WHY AM I SEEING THIS FOR PATTERN MEMORY */}
      {showWhy && (
        <div className="p-3.5 bg-indigo-950/15 border border-indigo-500/20 rounded-xl space-y-3 text-[11px] animate-fadeIn">
          <div className="text-[9.5px] font-bold text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-1">
            <Sparkles size={11} className="text-indigo-400" />
            <span>Memory Grid Epistemic Profile</span>
          </div>
          <div className="space-y-1.5 text-slate-300 font-sans leading-relaxed">
            <div>
              <span className="text-slate-500 block text-[9.5px] uppercase font-mono">Input Sources:</span>
              <span className="text-slate-200">Past quiz answers, conversational history logs, self-reported trait calibrations.</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9.5px] uppercase font-mono">Source Weights:</span>
              <span className="text-slate-200">Subjective User Inputs (100% direct calibration weight for quiz metrics).</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9.5px] uppercase font-mono">Confidence Level:</span>
              <span className="font-mono text-emerald-400 font-bold">90% (Direct self-report veracity indices)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9.5px] uppercase font-mono">Model Explanation:</span>
              <p className="text-slate-400 text-[10px]">
                Memory logs compile your scores into twelve standard houses, allowing near-term tendencies to reference explicit subjective baselines.
              </p>
            </div>
            <div className="p-2 bg-red-950/10 border border-red-500/20 rounded-lg">
              <span className="text-red-400 block font-bold text-[9px] font-mono uppercase">Not-To-Infer constraints:</span>
              <p className="text-slate-400 text-[10px]">
                Do not conclude that historical self-reports dictate permanent psychological limits or fully eliminate subconscious cognitive biases.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-black/40 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveTab('quiz')}
          className={`py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase text-center transition-colors cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-black text-indigo-400 border border-slate-800/80 shadow'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          1. Quiz Vectors
        </button>
        <button
          onClick={() => setActiveTab('observations')}
          className={`py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase text-center transition-colors cursor-pointer ${
            activeTab === 'observations'
              ? 'bg-black text-indigo-400 border border-slate-800/80 shadow'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          2. Observations
        </button>
        <button
          onClick={() => setActiveTab('drifts')}
          className={`py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase text-center transition-colors cursor-pointer ${
            activeTab === 'drifts'
              ? 'bg-black text-indigo-400 border border-slate-800/80 shadow'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          3. Drift Snapshot
        </button>
      </div>


      {/* TAB 内容 */}
      {activeTab === 'quiz' && (
        <div className="space-y-4">
          {/* Section 1: 12-Sector Grid representation */}
          <div className="space-y-2">
            <span className="text-[9.5px] font-mono uppercase text-slate-500">Sector Vector 12 Grid</span>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              {memory.quizSectors.map((sec, idx) => (
                <div key={idx} className="p-2 bg-slate-950/40 border border-slate-900 rounded-lg text-center">
                  <div className="text-[8px] font-mono text-slate-500 block truncate">{sec.sector.split(' ')[1]}</div>
                  <div className="text-xs font-mono font-bold text-slate-200 mt-1">{sec.value}%</div>
                  {/* Progress Micro Dot bar */}
                  <div className="h-1 bg-slate-900 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_4px_#6366f1]" style={{ width: `${sec.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Visual Trait slider scales */}
          <div className="space-y-3.5 border-t border-slate-800 pt-3">
            <span className="text-[9.5px] font-mono uppercase text-slate-505 text-slate-500">Trait Axes Profiles</span>
            <div className="space-y-3">
              {memory.traitAxes.map((axis, idx) => {
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-sans">
                      <span className="font-semibold text-slate-300">{axis.label}</span>
                      <span className="font-mono text-indigo-400 font-bold">{axis.value}%</span>
                    </div>
                    {/* Visual Balance scale */}
                    <div className="relative flex items-center h-2 bg-slate-900/60 rounded-full w-full">
                      <div 
                        className="absolute h-full rounded-full bg-gradient-to-r from-indigo-600 via-indigo-550 to-indigo-400 transition-all duration-300 shadow-[0_0_6px_rgba(79,70,229,0.3)]"
                        style={{
                          left: '0%',
                          width: `${axis.value}%`
                        }}
                      />
                      <div 
                        className="absolute w-2 h-2 rounded-full bg-white transition-all duration-300"
                        style={{
                          left: `${axis.value}%`,
                        }}
                      />
                    </div>

                    <div className="flex justify-between text-[8px] font-mono text-slate-550">
                      <span>{axis.leftLabel}</span>
                      <span>{axis.rightLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Activation & Avoidance style summaries */}
          <div className="border-t border-slate-900 pt-3 space-y-2.5 text-xs text-slate-300">
            <div>
              <span className="text-[9.5px] font-mono uppercase text-sky-400 block pb-0.5">Activation Style:</span>
              <p className="pl-2 border-l border-slate-800 text-[11px] text-slate-400 leading-normal">{memory.activationStyle}</p>
            </div>
            <div>
              <span className="text-[9.5px] font-mono uppercase text-purple-400 block pb-0.5">Avoidance Style:</span>
              <p className="pl-2 border-l border-slate-800 text-[11px] text-slate-400 leading-normal">{memory.avoidanceStyle}</p>
            </div>
            <div>
              <span className="text-[9.5px] font-mono uppercase text-amber-500 block pb-0.5">Stress Response Core:</span>
              <p className="pl-2 border-l border-slate-800 text-[11px] text-slate-400 leading-normal">{memory.stressResponse}</p>
            </div>
          </div>

          {/* Dimension Confidence Bars */}
          <div className="border-t border-slate-900 pt-3 space-y-1.5">
            <span className="text-[9.5px] font-mono uppercase text-slate-500">Confidence Calibration by Dimension</span>
            <div className="space-y-1.5">
              {memory.confidenceByDimension.map((dim, idx) => (
                <div key={idx} className="flex items-center justify-between text-[10px] font-mono p-1 bg-slate-950/20 rounded">
                  <span className="text-slate-400">{dim.dimension}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-bold">{dim.confidence}%</span>
                    <div className="w-12 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${dim.confidence}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'observations' && (
        <div className="space-y-3">
          <p className="text-[10px] font-mono text-slate-500 leading-normal border-b border-slate-900 pb-2">
            Dialogue insights captured from Eve & Levi strategic communications in this calibration frame. Raw debug outputs are minimizedsurrounding client data privacy rules.
          </p>

          <div className="space-y-3">
            {memory.agentObservations.map((obs) => (
              <div key={obs.id} className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-300">{obs.sourceAgent}</span>
                  <span className="text-[8.5px] font-mono bg-slate-900 text-slate-500 px-1 rounded">{obs.freshness}</span>
                </div>
                {/* Visual observation text bubble style */}
                <div className="text-xs text-slate-400 font-sans italic leading-relaxed pl-3 border-l-2 border-cyan-500/30">
                  &ldquo;{obs.snippet}&rdquo;
                </div>
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                  <div>Tag: <span className="text-cyan-400 font-medium">{obs.tag}</span></div>
                  <div>Observation confidence: {obs.confidence}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'drifts' && (
        <div className="space-y-3">
          <p className="text-[10px] font-mono text-slate-500 leading-normal border-b border-slate-900 pb-2">
            Algorithmic drift detections measuring differential variations between consecutive baseline snapshots. This is an overview tracking process.
          </p>

          {/* ================= PATTERN DRIFT HISTORICAL STREAM TREND-LINE CHART ================= */}
          <div className="bg-[#0b0f19]/80 border border-slate-900 rounded-xl p-4 space-y-3 shadow-inner relative overflow-hidden">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <TrendingUp size={12} className="text-emerald-400" />
                  <span className="text-[10px] font-bold tracking-widest font-mono text-slate-300 uppercase">
                    HISTORICAL SHIFT TREND-LINE
                  </span>
                </div>
                <p className="text-[9.5px] text-slate-500 font-sans">
                  Visual differential strength shifts of top three active patterns.
                </p>
              </div>
              <span className="text-[8.5px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded uppercase">
                {hoveredEventIdx !== null ? `${checkInEvents[hoveredEventIdx]}` : 'Hover Points for Details'}
              </span>
            </div>

            {/* Custom SVG Trend-Line Chart Canvas */}
            <div className="relative bg-black/40 border border-slate-950 rounded-lg p-2 overflow-visible">
              <svg 
                className="w-full h-34 overflow-visible" 
                viewBox="0 0 460 135" 
                preserveAspectRatio="none"
              >
                {/* Horizontal reference threshold grids */}
                {[25, 50, 75, 100].map((gridVal) => {
                  const y = scaleY(gridVal);
                  return (
                    <g key={gridVal} opacity="0.15">
                      <line 
                        x1="30" 
                        y1={y} 
                        x2="435" 
                        y2={y} 
                        stroke="#475569" 
                        strokeWidth="0.75" 
                      />
                      <text 
                        x="22" 
                        y={y + 3} 
                        className="text-[7.5px] font-mono fill-slate-500 font-medium" 
                        textAnchor="end"
                      >
                        {gridVal}%
                      </text>
                    </g>
                  );
                })}

                {/* Vertical Event Tick Columns */}
                {xCoords.map((x, idx) => (
                  <line
                    key={idx}
                    x1={x}
                    y1="10"
                    x2={x}
                    y2="115"
                    stroke="#1e293b"
                    strokeWidth="1"
                    opacity={hoveredEventIdx === idx ? "0.6" : "0.3"}
                    className="transition-all duration-300"
                  />
                ))}

                {/* Horizontal Event Month/Step Labels */}
                {xCoords.map((x, idx) => (
                  <text
                    key={idx}
                    x={x}
                    y="128"
                    className={`text-[8px] font-mono font-semibold text-center transition-all duration-300 ${
                      hoveredEventIdx === idx ? 'fill-indigo-400' : 'fill-slate-500'
                    }`}
                    textAnchor="middle"
                  >
                    {idx === 3 ? 'Current' : `Event T-${3 - idx}`}
                  </text>
                ))}

                {/* Dynamic hovered event marker guide strip line underlay */}
                {hoveredEventIdx !== null && (
                  <line 
                    x1={xCoords[hoveredEventIdx]} 
                    y1="10" 
                    x2={xCoords[hoveredEventIdx]} 
                    y2="115" 
                    stroke="#4f46e5" 
                    strokeWidth="1" 
                    strokeDasharray="2 2"
                    className="animate-pulse"
                  />
                )}

                {/* Draw line series and circles for each dataset pattern group */}
                {driftHistory.map((pt, idx) => {
                  const pathData = pt.values.map((v, valIdx) => {
                    const x = xCoords[valIdx];
                    const y = scaleY(v);
                    return `${valIdx === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ');

                  return (
                    <g key={idx}>
                      {/* Ambient base color shadow backplane */}
                      <motion.path
                        d={pathData}
                        fill="none"
                        stroke={pt.color}
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.1"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.2, delay: idx * 0.1, ease: "easeOut" }}
                      />
                      {/* Dominant crisp trend line element */}
                      <motion.path
                        d={pathData}
                        fill="none"
                        stroke={pt.color}
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.2, delay: idx * 0.1, ease: "easeOut" }}
                      />
                      {/* Coordinate dot markers points */}
                      {pt.values.map((v, valIdx) => {
                        const isNodeHovered = hoveredEventIdx === valIdx;
                        return (
                          <g key={valIdx}>
                            <circle
                              cx={xCoords[valIdx]}
                              cy={scaleY(v)}
                              r={isNodeHovered ? "4.5" : "3"}
                              fill="#080a0f"
                              stroke={pt.color}
                              strokeWidth={isNodeHovered ? "2.5" : "1.5"}
                              className="transition-all duration-200"
                            />
                            {isNodeHovered && (
                              <circle
                                cx={xCoords[valIdx]}
                                cy={scaleY(v)}
                                r="8"
                                fill="none"
                                stroke={pt.color}
                                strokeWidth="1"
                                className="animate-ping opacity-30"
                              />
                            )}
                          </g>
                        );
                      })}
                    </g>
                  );
                })}

                {/* Invisible hover zones to capture index interactions seamlessly without gaps */}
                {xCoords.map((x, idx) => {
                  const startX = idx === 0 ? 0 : (xCoords[idx - 1] + x) / 2;
                  const endX = idx === xCoords.length - 1 ? 460 : (x + xCoords[idx + 1]) / 2;
                  const width = endX - startX;
                  return (
                    <rect
                      key={idx}
                      x={startX}
                      y="5"
                      width={width}
                      height="125"
                      fill="transparent"
                      className="cursor-pointer select-none"
                      onMouseEnter={() => setHoveredEventIdx(idx)}
                      onMouseLeave={() => setHoveredEventIdx(null)}
                    />
                  );
                })}
              </svg>

              {/* FLOATING HUD TOOLTIP INDICATION */}
              {hoveredEventIdx !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute z-20 pointer-events-none bg-slate-950/95 border border-indigo-500/30 rounded-xl p-3 w-52 shadow-[0_12px_28px_rgba(0,0,0,0.9),_0_0_15px_rgba(99,102,241,0.25)] text-left backdrop-blur-sm"
                  style={{
                    left: `${(xCoords[hoveredEventIdx] / 460) * 100}%`,
                    top: '-70px', // float ABOVE the chart lines
                    transform: 'translateX(-50%)',
                    // Prevent spilling off-screen in container margins:
                    marginLeft: hoveredEventIdx === 0 ? '55px' : hoveredEventIdx === 3 ? '-55px' : '0px'
                  }}
                >
                  <div className="space-y-2">
                    {/* Header with Event & Date */}
                    <div className="border-b border-indigo-505/20 pb-1.5 border-slate-900">
                      <div className="text-[9.5px] font-mono font-bold text-indigo-400 uppercase tracking-widest">
                        {checkInEvents[hoveredEventIdx]}
                      </div>
                      <div className="text-[8.5px] font-mono text-slate-400 mt-0.5 flex items-center gap-1 font-semibold">
                        <Calendar size={9} className="text-slate-500 shrink-0" />
                        <span>{checkInDates[hoveredEventIdx]}</span>
                      </div>
                    </div>

                    {/* Historical values of the top 3 patterns */}
                    <div className="space-y-1.5">
                      {driftHistory.map((pt, i) => (
                        <div key={i} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 max-w-[70%]">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: pt.color }} />
                            <span className="text-[8.5px] text-slate-300 font-sans truncate tracking-tight">
                              {pt.patternName}
                            </span>
                          </div>
                          <span className={`text-[10px] font-bold font-mono tracking-tight ${pt.textColor}`}>
                            {pt.values[hoveredEventIdx]}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Subtle triangle arrow pointer at the bottom */}
                  <div 
                    className="absolute w-2.5 h-2.5 bg-slate-950 border-r border-b border-indigo-500/30 rotate-45 -bottom-1.5 shadow"
                    style={{
                      left: hoveredEventIdx === 0 ? 'calc(25% - 5px)' : hoveredEventIdx === 3 ? 'calc(75% - 5px)' : 'calc(50% - 5px)'
                    }}
                  />
                </motion.div>
              )}
            </div>

            {/* Micro HUD Dashboard Tooltip Indicator Panel */}
            <div className={`p-2.5 rounded-lg border leading-normal transition-all duration-300 ${
              hoveredEventIdx !== null 
                ? 'bg-slate-950/90 border-slate-800' 
                : 'bg-slate-950/35 border-slate-950 text-slate-500'
            }`}>
              {hoveredEventIdx !== null ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 pb-1 border-b border-slate-900 text-[10px] font-mono text-slate-400 font-bold">
                    <Calendar size={10} className="text-indigo-400" />
                    <span>METRIC SNAPSHOT POINT: {checkInEvents[hoveredEventIdx].toUpperCase()}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 font-mono text-[9px]">
                    {driftHistory.map((pt, i) => (
                      <div key={i} className={`p-1.5 rounded border ${pt.tagColor} flex flex-col justify-between`}>
                        <span className="truncate block font-semibold text-slate-300">
                          {pt.patternName}
                        </span>
                        <div className="flex justify-between items-end mt-1">
                          <span className="text-[8px] text-slate-500 capitalize">Strength:</span>
                          <span className={`text-[11px] font-bold ${pt.textColor}`}>
                            {pt.values[hoveredEventIdx]}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 py-1 text-center font-mono text-[9.5px]">
                  <Sparkles size={11} className="text-slate-500 animate-pulse" />
                  <span>Hover points on the trend-line to analyze metric variances by event timeframe</span>
                </div>
              )}
            </div>

            {/* Custom Sleek Legend Badge Panel */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-1 font-mono text-[8px] border-t border-slate-950">
              {driftHistory.map((pt, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pt.color }} />
                  <span className="text-slate-400 font-semibold">{pt.patternName}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {memory.patternDrifts.map((drift) => {
              const isContradiction = drift.direction === 'contradiction_detected';
              const directionStyle = isContradiction 
                ? 'text-red-400 border-red-500/20 bg-red-950/15'
                : drift.direction === 'strengthened'
                ? 'text-emerald-400 border-emerald-500/20 bg-emerald-950/15'
                : 'text-amber-450 text-amber-500 border-amber-500/10 bg-amber-950/10';

              return (
                <div key={drift.id} className="p-3 bg-slate-950/20 border border-slate-900 rounded-xl space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-xs font-semibold text-slate-300">{drift.patternName}</span>
                    <span className={`text-[8.5px] font-mono px-1.5 py-0.2 rounded border uppercase font-bold tracking-tight ${directionStyle}`}>
                      {drift.direction.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-normal font-sans">
                    {drift.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
