/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NatalInfluence } from '../../types';
import { Target, Info, Flame, Trees, Mountain, Wind, ShieldAlert, HelpCircle, Sparkles } from 'lucide-react';

interface NatalInfluenceOverlayProps {
  influences: NatalInfluence[];
}

export default function NatalInfluenceOverlay({ influences }: NatalInfluenceOverlayProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showWhy, setShowWhy] = useState(false);

  // Group by category
  const categories: ('Western' | 'BaZi' | 'Wu-Xing' | 'Soulprint')[] = ['Western', 'BaZi', 'Wu-Xing', 'Soulprint'];

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'high':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'low':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default:
        return 'bg-slate-500/5 text-slate-505';
    }
  };

  const getCategoryThemeColors = (category: string) => {
    switch (category) {
      case 'Western': return 'text-sky-400 border-sky-950/40 bg-sky-950/10';
      case 'BaZi': return 'text-purple-400 border-purple-950/40 bg-purple-950/10';
      case 'Wu-Xing': return 'text-emerald-400 border-emerald-950/40 bg-emerald-950/10';
      case 'Soulprint': return 'text-pink-400 border-pink-950/40 bg-pink-950/10';
      default: return 'text-slate-400 border-slate-900 bg-slate-950/40';
    }
  };

  return (
    <div className="border border-slate-800 bg-[#080a0f]/60 rounded-2xl p-5 backdrop-blur-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Target size={13} className="text-indigo-505 text-indigo-400 animate-pulse" />
          <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">User Pattern Summary</h4>
          <span className="text-[8px] font-mono bg-purple-950/20 text-purple-400 border border-purple-500/25 px-1.5 py-0.2 rounded uppercase font-bold tracking-tight">
            ✦ Calculated
          </span>
          <span className="text-[8px] font-mono bg-emerald-950/20 text-emerald-405 text-emerald-400 border border-emerald-500/25 px-1.5 py-0.2 rounded uppercase font-bold tracking-tight">
            ✦ Observed
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

      {/* WHY AM I SEEING THIS FOR PROFILE */}
      {showWhy && (
        <div className="p-3 bg-indigo-950/15 border border-indigo-500/20 rounded-xl space-y-2.5 text-[11px] animate-fadeIn">
          <div className="text-[9.5px] font-bold text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-1">
            <Sparkles size={11} />
            <span>Profile Epistemic Breakdown</span>
          </div>
          <div className="space-y-1.5 text-slate-300 font-sans">
            <div>
              <span className="text-slate-500 block text-[9.5px] uppercase font-mono">Input Sources:</span>
              <span className="font-semibold text-slate-200">Birth Longevity Matrices, Solar Longitude Degree matching, Wu-Xing Phase ratios, Chronological self-rating indices.</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9.5px] uppercase font-mono">Source Weights:</span>
              <span className="text-slate-200">Stable Natal baseline configuration (100% weight for cosmic core coordinates).</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9.5px] uppercase font-mono">Confidence Level:</span>
              <span className="font-mono text-emerald-400 font-bold">100% (Mathematical Solar Certainty)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9.5px] uppercase font-mono">Model Explanation:</span>
              <p className="text-slate-450 leading-relaxed text-[10px] text-slate-400">
                Derived directly from solar degree alignments overlaying Wu-Xing element densities, calibrated with self-reports on metal/structure indices.
              </p>
            </div>
            <div className="p-2 bg-red-950/10 border border-red-500/20 rounded-lg">
              <span className="text-red-400 block font-bold text-[9px] font-mono uppercase">Not-To-Infer constraints:</span>
              <p className="text-slate-400 leading-normal text-[10px]">
                Do not conclude that deficient wood/metal scores dictate concrete physical limits or replace active personal development strategies.
              </p>
            </div>
          </div>
        </div>
      )}


      {/* Wu-Xing element breakdown visualization if applicable */}
      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono p-2 bg-slate-950/40 rounded-xl border border-slate-900">
        <div>
          <span className="text-slate-500">DOMINANT ELEMENT:</span>
          <div className="flex items-center gap-1 text-emerald-400 mt-0.5">
            <Trees size={12} />
            <span className="font-semibold">Wood (木) - 64%</span>
          </div>
        </div>
        <div>
          <span className="text-slate-500">DEFICIENT ELEMENT:</span>
          <div className="flex items-center gap-1 text-red-400 mt-0.5">
            <ShieldAlert size={12} />
            <span className="font-semibold">Metal (金) - 12%</span>
          </div>
        </div>
      </div>

      {/* Main categories stacked list */}
      <div className="space-y-4">
        {categories.map(cat => {
          const items = influences.filter(x => x.category === cat);
          if (items.length === 0) return null;

          return (
            <div key={cat} className="space-y-1.5">
              <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-semibold border ${getCategoryThemeColors(cat)}`}>
                {cat}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {items.map(infl => {
                  const isHovered = hoveredId === infl.id;
                  return (
                    <div
                      key={infl.id}
                      className="relative"
                      onMouseEnter={() => setHoveredId(infl.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      {/* Chip */}
                      <div className="px-2 py-1 rounded-xl bg-slate-900 hover:bg-slate-850 hover:border-slate-700 transition-all border border-slate-900 text-xs flex items-center gap-1.5 cursor-help">
                        <span className="text-slate-500 font-serif font-semibold">{infl.symbol}</span>
                        <span className="text-slate-305 font-medium text-slate-300">{infl.label.split(' / ')[0]}</span>
                        <span className={`text-[8px] font-mono px-1 rounded uppercase tracking-tighter ${getStrengthColor(infl.strength)}`}>
                          {infl.strength}
                        </span>
                      </div>

                      {/* Micro inline tooltip on hover */}
                      {isHovered && (
                        <div className="absolute z-30 bottom-full left-0 mb-1.5 w-52 p-2.5 bg-slate-900 border border-slate-800 text-[10px] text-slate-300 rounded-lg shadow-xl leading-normal">
                          <div className="font-semibold text-white mb-0.5">{infl.label}</div>
                          <div className="text-[9px] text-slate-500 mb-1">Influence magnitude: {infl.strength.toUpperCase()}</div>
                          <p className="font-sans text-slate-400">{infl.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* MANDATORY WARNING LABEL */}
      <div className="p-2 border border-slate-900 bg-slate-950/20 rounded-xl">
        <div className="text-[9.5px] font-mono text-center text-slate-500 uppercase flex items-center justify-center gap-1.5">
          <Info size={11} className="text-amber-500/60" />
          <span>Influence map, not deterministic cause.</span>
        </div>
      </div>
    </div>
  );
}
