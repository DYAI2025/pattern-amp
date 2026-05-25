/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Hypothesis, HypothesisStatus } from '../../types';
import { Target, Info, Sparkles, Filter, CheckCircle, HelpCircle } from 'lucide-react';

interface SevenHypothesesConstellationProps {
  hypotheses: Hypothesis[];
  selectedBranchId: string | null;
  selectedBranchHypothesesIds: string[];
  onSelectHypothesis: (id: string | null) => void;
  selectedHypothesisId: string | null;
}

const DEFAULT_COORDINATES = [
  { x: 100, y: 55 },   // Node 1
  { x: 260, y: 40 },   // Node 2
  { x: 420, y: 70 },   // Node 3
  { x: 180, y: 155 },  // Node 4
  { x: 340, y: 170 },  // Node 5
  { x: 110, y: 265 },  // Node 6
  { x: 290, y: 275 }   // Node 7
];

export default function SevenHypothesesConstellation({
  hypotheses,
  selectedBranchId,
  selectedBranchHypothesesIds,
  onSelectHypothesis,
  selectedHypothesisId
}: SevenHypothesesConstellationProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'contradicted' | 'high-confidence' | 'high-activation' | 'linked'>('all');
  const [showWhy, setShowWhy] = useState(false);

  // Load state coords with fallback & storage persistence
  const [coords, setCoords] = useState<{ x: number; y: number }[]>(() => {
    try {
      const saved = localStorage.getItem('seven_hypotheses_constellation_coords');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === DEFAULT_COORDINATES.length) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved constellation coordinates', e);
    }
    return DEFAULT_COORDINATES;
  });

  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const hasMovedRef = useRef<boolean>(false);

  const resetLayout = () => {
    setCoords(DEFAULT_COORDINATES);
    try {
      localStorage.setItem('seven_hypotheses_constellation_coords', JSON.stringify(DEFAULT_COORDINATES));
    } catch (e) {
      console.error('Failed to reset coordinates in localStorage', e);
    }
  };

  const handlePointerDown = (index: number, e: React.PointerEvent<SVGGElement>) => {
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {
      // safe fallback
    }
    hasMovedRef.current = false;
    setDraggingIdx(index);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (draggingIdx === null) return;
    hasMovedRef.current = true;
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 500;
    const y = ((e.clientY - rect.top) / rect.height) * 320;

    // Constrain nodes nicely within bounds
    const boundedX = Math.max(20, Math.min(480, x));
    const boundedY = Math.max(20, Math.min(300, y));

    setCoords(prev => {
      const copy = [...prev];
      copy[draggingIdx] = { x: Math.round(boundedX), y: Math.round(boundedY) };
      return copy;
    });
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (draggingIdx !== null) {
      try {
        localStorage.setItem('seven_hypotheses_constellation_coords', JSON.stringify(coords));
      } catch (err) {
        console.error('Failed to save coordinates in localStorage', err);
      }
      setDraggingIdx(null);
    }
  };

  // Links representing structural nodes interactions (reinforcement or contradiction)
  // [from_idx, to_idx, type: 'reinforces' | 'contradicts']
  const links = [
    { from: 0, to: 2, type: 'reinforces' },
    { from: 0, to: 3, type: 'contradicts' },
    { from: 1, to: 4, type: 'reinforces' },
    { from: 2, to: 4, type: 'reinforces' },
    { from: 3, to: 5, type: 'reinforces' },
    { from: 5, to: 6, type: 'contradicts' }
  ];

  // Filtering Logic
  const filteredHypotheses = hypotheses.filter((hyp) => {
    switch (filter) {
      case 'active':
        return hyp.status === 'active';
      case 'contradicted':
        return hyp.status === 'contradicted';
      case 'high-confidence':
        return hyp.confidence > 60;
      case 'high-activation':
        return hyp.activation > 60;
      case 'linked':
        return selectedBranchHypothesesIds.includes(hyp.id);
      default:
        return true;
    }
  });

  const getStatusBorder = (status: HypothesisStatus, isSelected: boolean) => {
    if (isSelected) return 'stroke-indigo-400 stroke-[2.5]';
    switch (status) {
      case 'active': return 'stroke-emerald-500';
      case 'emerging': return 'stroke-indigo-500';
      case 'weak': return 'stroke-slate-605 text-slate-600';
      case 'contradicted': return 'stroke-red-500 stroke-dasharray="3 2"';
    }
  };

  const getStatusColor = (status: HypothesisStatus) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'emerging': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'weak': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'contradicted': return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
  };

  return (
    <div className="border border-slate-800 bg-[#080a0f]/60 rounded-2xl p-5 backdrop-blur-md space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Sparkles size={13} className="text-indigo-400 animate-pulse" />
          <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">7 Hypotheses Matrix</h4>
          <span className="text-[8px] font-mono bg-sky-950/20 text-sky-400 border border-sky-500/25 px-1.5 py-0.2 rounded uppercase font-bold tracking-tight">
            ✦ Inferred
          </span>
          <span className="text-[8px] font-mono bg-amber-950/20 text-amber-500 border border-amber-500/25 px-1.5 py-0.2 rounded uppercase font-bold tracking-tight">
            ✦ Speculative
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={resetLayout}
            className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/40 border border-slate-800 text-slate-450 text-slate-400 hover:text-white hover:border-slate-705 hover:border-slate-700 transition-all cursor-pointer"
            title="Restore Baseline Nodes Positions"
          >
            Reset Layout
          </button>
          
          <button
            onClick={() => setShowWhy(!showWhy)}
            className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/40 border border-slate-800 text-slate-400 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle size={10} className="text-indigo-404 text-indigo-400" />
            <span>Why is this visible?</span>
          </button>
        </div>
      </div>

      {/* WHY AM I SEEING THIS FOR COGNITIVE HYPOTHESES */}
      {showWhy && (
        <div className="p-3 bg-indigo-950/15 border border-indigo-500/20 rounded-xl space-y-2.5 text-[11px] animate-fadeIn">
          <div className="text-[9.5px] font-bold text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-1">
            <Sparkles size={11} className="text-indigo-400" />
            <span>Hypotheses Constellation Epistemic Base</span>
          </div>
          <div className="space-y-1.5 text-slate-300 font-sans leading-relaxed">
            <div>
              <span className="text-slate-500 block text-[9.5px] uppercase font-mono">Input Sources:</span>
              <span className="text-slate-200">Daily focus quizzes, interactive dialogue memory nodes, Mercury-Skeptic natal indicators.</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9.5px] uppercase font-mono">Source Weights:</span>
              <span className="text-slate-200">Subjective Focus Rating trends (45%), Dialogue patterns feedback (30%), Scorpio Moon profile weights (25%).</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9.5px] uppercase font-mono">Confidence Range:</span>
              <span className="font-mono text-emerald-400 font-bold">65% – 84% based on active daily quiz updates</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9.5px] uppercase font-mono">Model Explanation:</span>
              <p className="text-slate-400 text-[10px]">
                These hypotheses track dynamic correlates between cognitive assertions (e.g., self-sufficiency, structural resistance) and verified natal baselines.
              </p>
            </div>
            <div className="p-2 bg-red-950/10 border border-red-500/20 rounded-lg">
              <span className="text-red-400 block font-bold text-[9px] font-mono uppercase">Not-To-Infer constraints:</span>
              <p className="text-slate-400 text-[10px]">
                Do not view these hypotheses as fixed analytical diagnoses or permanent psychiatric traits. They represent transient psychological potentials.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2D Interactive Constellation SVG Map */}
      <div className="relative rounded-xl border border-slate-800 bg-black/20 overflow-hidden flex justify-center items-center" style={{ minHeight: '340px' }}>

        <svg 
          ref={svgRef}
          viewBox="0 0 500 320" 
          className="w-full max-w-[480px] overflow-visible select-none touch-none"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Constellation Star Pulse Style Definition */}
          <defs>
            <style>{`
              @keyframes star-pulse {
                0% {
                  transform: scale(1);
                  opacity: 0.15;
                }
                50% {
                  transform: scale(var(--pulse-scale, 1.25));
                  opacity: 0.75;
                }
                100% {
                  transform: scale(1);
                  opacity: 0.15;
                }
              }
              .star-pulse-element {
                animation-name: star-pulse;
                animation-iteration-count: infinite;
                animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
              }
            `}</style>
          </defs>

          {/* Constellation Grid markings */}
          <g opacity="0.08" stroke="#ffffff" strokeWidth="0.5">
            <line x1={0} y1={80} x2={500} y2={80} />
            <line x1={0} y1={160} x2={500} y2={160} />
            <line x1={0} y1={240} x2={500} y2={240} />
            <line x1={125} y1={0} x2={125} y2={320} />
            <line x1={250} y1={0} x2={250} y2={320} />
            <line x1={375} y1={0} x2={375} y2={320} />
          </g>

          {/* Links between stars showing reinforcement or contradiction */}
          {links.map((link, idx) => {
            const startNode = coords[link.from];
            const endNode = coords[link.to];
            if (!startNode || !endNode) return null;

            const isContradiction = link.type === 'contradicts';
            const selectedHypothesisIndex = hypotheses.findIndex(h => h.id === selectedHypothesisId);
            const hasSelection = selectedHypothesisIndex !== -1;
            const isConnectedToSelected = hasSelection && (link.from === selectedHypothesisIndex || link.to === selectedHypothesisIndex);

            // Dynamically highlight matching connections, dim other links if there is a selection
            let linkStrokeWidth = isContradiction ? '1.5' : '1';
            let linkOpacity = '0.35';
            if (hasSelection) {
              if (isConnectedToSelected) {
                linkStrokeWidth = isContradiction ? '3' : '2.5';
                linkOpacity = '0.95';
              } else {
                linkOpacity = '0.08';
              }
            }

            return (
              <line
                key={idx}
                x1={startNode.x}
                y1={startNode.y}
                x2={endNode.x}
                y2={endNode.y}
                stroke={isContradiction ? '#f43f5e' : '#6366f1'}
                strokeWidth={linkStrokeWidth}
                strokeDasharray={isContradiction ? '4 3' : undefined}
                opacity={linkOpacity}
                className="transition-all duration-350 ease-out"
              />
            );
          })}

          {/* Star nodes representing hypotheses */}
          {hypotheses.map((hyp, index) => {
            const coord = coords[index];
            if (!coord) return null;

            const isSelected = selectedHypothesisId === hyp.id;
            const size = 11 + (hyp.confidence / 20); // Confidence maps to star radius size
            const isLinkedBranch = selectedBranchHypothesesIds.includes(hyp.id);

            const selectedHypothesisIndex = hypotheses.findIndex(h => h.id === selectedHypothesisId);
            const hasSelection = selectedHypothesisIndex !== -1;
            const isNodeRelated = !hasSelection || index === selectedHypothesisIndex || (
              links.some(link => 
                (link.from === index && link.to === selectedHypothesisIndex) || 
                (link.from === selectedHypothesisIndex && link.to === index)
              )
            );

            // Activation levels maps to brightness/glow
            const brightnessStyle = hyp.activation > 75 
              ? 'fill-cyan-400' 
              : hyp.activation > 45 
              ? 'fill-sky-500' 
              : 'fill-slate-500';

            const pulseScale = 1 + (hyp.activation / 100) * 0.45;
            const pulseDuration = `${Math.max(1.0, 3.5 - (hyp.activation / 100) * 2.5)}s`;

            return (
              <g
                key={hyp.id}
                className="cursor-grab active:cursor-grabbing group select-none transition-opacity duration-350 ease-out"
                style={{ opacity: hasSelection && !isNodeRelated ? 0.22 : 1.0 }}
                onPointerDown={(e) => handlePointerDown(index, e)}
                onClick={(e) => {
                  if (hasMovedRef.current) {
                    e.stopPropagation();
                    return;
                  }
                  onSelectHypothesis(isSelected ? null : hyp.id);
                }}
              >
                {/* Dynamically scaling & timing star pulse glow based on hypothesis activation */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={size + 3}
                  className="star-pulse-element fill-none"
                  stroke={hyp.activation > 75 ? '#22d3ee' : hyp.activation > 45 ? '#0ea5e9' : '#334155'}
                  strokeWidth="1.5"
                  opacity={(hyp.activation / 100) * 0.6 + 0.15}
                  style={{
                    '--pulse-scale': pulseScale,
                    animationDuration: pulseDuration,
                    transformOrigin: `${coord.x}px ${coord.y}px`
                  } as React.CSSProperties}
                />

                {/* Secondary highlight ring if linked to selected branch */}
                {isLinkedBranch && (
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={size + 7}
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    className="animate-spin"
                    style={{ animationDuration: '8s' }}
                  />
                )}

                {/* External core glow */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={size + 4}
                  className="fill-none stroke-current"
                  opacity={isSelected ? '0.7' : '0.15'}
                  stroke={isSelected ? '#818cf8' : '#334155'}
                  strokeWidth="1"
                />

                {/* Star base circle */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={size}
                  fill="#0b1329"
                  className={getStatusBorder(hyp.status, isSelected)}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                />

                {/* Center glowing core point */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r="4"
                  className={brightnessStyle}
                />

                {/* Star visual numeric label */}
                <text
                  x={coord.x}
                  y={coord.y - size - 5}
                  textAnchor="middle"
                  className="text-[9px] font-mono select-none"
                  fill={isSelected ? '#ffffff' : isLinkedBranch ? '#0ea5e9' : '#64748b'}
                  fontWeight={isSelected ? 'bold' : 'normal'}
                >
                  H{index + 1}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Constellation Legend */}
        <div className="absolute top-2 left-2 p-1.5 bg-slate-950/90 border border-slate-900 rounded text-[8px] font-mono text-slate-500 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-indigo-400">
            <span>✧ Interactive Star Map</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>Bright: High Activation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Star size: Confidence</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-indigo-500"></span>
            <span>Blue path: Reinforces</span>
          </div>
          <div className="flex items-center gap-1.5 border-b border-slate-900 pb-1">
            <span className="w-3 h-0.5 border-t border-dashed border-red-500"></span>
            <span>Red dotted: Contradicts</span>
          </div>
          <div className="text-[7.5px] uppercase tracking-wider text-indigo-400 font-bold animate-pulse pt-0.5">
            ⚡ Drag stars to reposition
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-wrap gap-1 border-t border-slate-900 pt-3">
        {(['all', 'active', 'contradicted', 'high-confidence', 'high-activation', 'linked'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-1.5 py-0.5 rounded text-[9px] font-mono border transition-all ${
              filter === f
                ? 'bg-slate-900 text-white border-sky-500'
                : 'bg-slate-950/20 text-slate-550 border-slate-900 hover:text-white'
            }`}
          >
            {f === 'linked' ? 'linked to branch' : f}
          </button>
        ))}
      </div>

      {/* Hypotheses details card lists */}
      <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
        {filteredHypotheses.map((hyp, index) => {
          const isSelected = selectedHypothesisId === hyp.id;
          return (
            <div
              key={hyp.id}
              onClick={() => onSelectHypothesis(isSelected ? null : hyp.id)}
              className={`p-3 border rounded-xl hover:bg-slate-900/50 cursor-pointer transition-all ${
                isSelected ? 'border-indigo-500 bg-indigo-950/10' : 'border-slate-900 bg-slate-950/20'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">H{hypotheses.indexOf(hyp) + 1}</span>
                  <h5 className="text-xs font-semibold text-slate-200 truncate max-w-[200px]">{hyp.title}</h5>
                </div>
                <span className={`text-[8px] font-mono font-semibold px-2 py-0.2 rounded border uppercase ${getStatusColor(hyp.status)}`}>
                  {hyp.status}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-sans mt-2">
                {hyp.statement}
              </p>

              {/* Extended diagnostics panel */}
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-slate-900 space-y-2 text-xs">
                  <div>
                    <span className="text-[9.5px] font-mono uppercase text-emerald-400">Positive Evidence Markers:</span>
                    <p className="text-slate-400 text-[11px] font-sans mt-0.5 leading-normal">{hyp.evidence}</p>
                  </div>
                  <div>
                    <span className="text-[9.5px] font-mono uppercase text-red-400">Counter-Evidence Signals:</span>
                    <p className="text-slate-400 text-[11px] font-sans mt-0.5 leading-normal">{hyp.counterEvidence}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500 border-t border-slate-900/50 pt-2 leading-none">
                    <div>CONFIDENCE: <span className="text-slate-300 font-bold">{hyp.confidence}%</span></div>
                    <div>ACTIVATION: <span className="text-slate-300 font-bold">{hyp.activation}%</span></div>
                    <div className="col-span-2 mt-1 truncate">SOURCE MIX: {hyp.sourceMix}</div>
                    <div className="col-span-2 text-right text-[8.5px] text-slate-600 mt-1">LAST INDEX CALIBRATION: {hyp.lastUpdated}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mandatory Label */}
      <div className="p-2 bg-slate-900/40 rounded-xl border border-slate-900">
        <div className="text-[10px] font-mono text-slate-500 text-center uppercase flex items-center justify-center gap-1.5">
          <Info size={11} className="sky-400/50" />
          <span>Working hypotheses about recurring patterns.</span>
        </div>
      </div>
    </div>
  );
}
