/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SourceContribution, SourceType } from '../../types';
import { ShieldCheck, Info, BarChart3, Database } from 'lucide-react';
import { EpistemicTag, EpistemicClass } from './EpistemicStatusStrip';

interface SourceContributionBarsProps {
  sources?: SourceContribution[];
}

export default function SourceContributionBars({ sources = [] }: SourceContributionBarsProps) {
  // Define the 6 mandatory sources with their native V1 specifications
  const defaultSources: Array<{
    name: string;
    weight: number;
    confidence: 'high' | 'medium' | 'low';
    dataType: SourceType;
    lastUpdated: string;
    isExcluded?: boolean;
    description: string;
  }> = [
    {
      name: 'Natal/Fusion',
      weight: 35,
      confidence: 'high',
      dataType: 'calculated',
      lastUpdated: 'Stable',
      description: 'Calculated from coordinates and times'
    },
    {
      name: 'Current Transit/Daily Field',
      weight: 25,
      confidence: 'high',
      dataType: 'simulated',
      lastUpdated: 'Real-time',
      description: 'Dynamic transit indicators'
    },
    {
      name: 'Quiz Patterns',
      weight: 0, // Strictly 0 in V1 hypotheses_only
      confidence: 'low',
      dataType: 'inferred',
      lastUpdated: 'Disabled/Excluded in V1',
      isExcluded: true,
      description: 'Quiz data is out of scope for hypotheses_only pipeline'
    },
    {
      name: 'Agent Conversations',
      weight: 20,
      confidence: 'medium',
      dataType: 'observed',
      lastUpdated: 'Updated 2 hours ago',
      description: 'Dialogue memory traces with Eve/Levi'
    },
    {
      name: 'Seven Hypotheses',
      weight: 15,
      confidence: 'high',
      dataType: 'inferred',
      lastUpdated: 'Updated 2 hours ago',
      description: 'Astrological cognitive pattern correlates'
    },
    {
      name: 'Space Weather',
      weight: 5,
      confidence: 'low',
      dataType: 'simulated',
      lastUpdated: 'Real-time',
      description: 'Solar flux wind factors'
    }
  ];

  // Merge selected branch inputs to keep visualization synchronized with active selections
  const mergedSources = defaultSources.map(def => {
    // Attempt rescue from selected branch sources list
    const found = sources.find(s => s.name.toLowerCase().includes(def.name.split('/')[0].toLowerCase()) || def.name.toLowerCase().includes(s.name.toLowerCase()));
    if (found) {
      return {
        ...def,
        weight: def.isExcluded ? 0 : found.weight,
        confidence: found.confidence,
        dataType: found.dataType,
        lastUpdated: def.isExcluded ? 'Disabled' : found.lastUpdated
      };
    }
    return def;
  });

  // Re-normalize weights so they sum up to exactly 100% (excluding the quiz source)
  const activeSourcesSum = mergedSources.reduce((sum, s) => s.isExcluded ? sum : sum + s.weight, 0);
  const finalSources = mergedSources.map(s => {
    if (s.isExcluded) {
      return { ...s, weight: 0 };
    }
    // Scale proportionally if total doesn't align
    if (activeSourcesSum > 0) {
      const scaledWeight = Math.round((s.weight / activeSourcesSum) * 100);
      return { ...s, weight: scaledWeight };
    }
    return s;
  }).sort((a, b) => b.weight - a.weight);

  const getConfidenceStyle = (conf: 'high' | 'medium' | 'low') => {
    switch (conf) {
      case 'high':
        return 'text-emerald-400 bg-emerald-950/20 border-emerald-500/30';
      case 'medium':
        return 'text-sky-400 bg-sky-950/20 border-sky-500/30';
      case 'low':
        return 'text-yellow-500 bg-yellow-950/20 border-yellow-500/30';
      default:
        return 'text-slate-400 border-slate-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
        <div className="flex items-center gap-2">
          <BarChart3 size={14} className="text-indigo-400" />
          <h5 className="text-[11px] font-mono text-slate-400 uppercase tracking-widest font-bold">Source Contribution Balance</h5>
        </div>
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Provenance Engine</span>
      </div>

      <div className="space-y-3">
        {finalSources.map((source, idx) => {
          const epType: EpistemicClass = source.isExcluded 
            ? 'excluded' 
            : source.dataType as EpistemicClass;

          return (
            <div 
              key={idx} 
              className={`space-y-2 p-3 rounded-xl border transition-all ${
                source.isExcluded 
                  ? 'bg-slate-950/20 border-slate-950/40 opacity-55' 
                  : 'bg-slate-950/40 border-slate-900 hover:border-slate-800 hover:bg-slate-950/60'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-sans flex-wrap gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    source.isExcluded ? 'bg-slate-600' : 'bg-indigo-400 shadow-[0_0_4px_#4f46e5]'
                  }`}></span>
                  <span className={`font-semibold ${source.isExcluded ? 'text-slate-500' : 'text-slate-200'} truncate`}>
                    {source.name}
                  </span>
                </div>
                
                {/* universal epistemic tags representation */}
                <EpistemicTag type={epType} />
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 bg-slate-900 rounded-full overflow-hidden w-full">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    source.isExcluded ? 'bg-slate-800' :
                    source.dataType === 'calculated' ? 'bg-purple-500' :
                    source.dataType === 'observed' ? 'bg-emerald-500' :
                    source.dataType === 'inferred' ? 'bg-sky-500' :
                    'bg-amber-500'
                  }`}
                  style={{ width: `${source.weight}%` }}
                />
              </div>

              {/* Provenance breakdown footer label */}
              <div className="flex flex-wrap items-center justify-between text-[9px] font-mono text-slate-500 gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-550">Weight:</span>
                  <span className={`font-bold ${source.isExcluded ? 'text-slate-500' : 'text-slate-200'}`}>
                    {source.weight}%
                  </span>
                  
                  {!source.isExcluded && (
                    <>
                      <span className="text-slate-705 text-slate-700">|</span>
                      <span className="text-slate-550">Confidence:</span>
                      <span className={`px-1 rounded border font-semibold uppercase text-[8px] ${getConfidenceStyle(source.confidence)}`}>
                        {source.confidence}
                      </span>
                    </>
                  )}
                </div>
                
                <div className="text-[8px]">
                  <span className="text-slate-600">Updated:</span>{' '}
                  <span className={source.isExcluded ? 'text-slate-500 italic' : 'text-slate-400'}>
                    {source.lastUpdated}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-indigo-950/10 rounded-xl border border-indigo-900/30 flex items-start gap-2.5">
        <Info size={12} className="text-indigo-400 mt-0.5 shrink-0" />
        <div className="text-[10px] font-mono text-slate-400 leading-normal space-y-1">
          <p className="font-bold text-slate-300">Epistemic Fusion Logic:</p>
          <p>
            V1 environment maps active natal weights alongside live trace inputs. Under the current <span className="text-cyan-400 font-bold">hypotheses_only</span> protocol constraint, Quiz Ingestion is completely locked out and reports 0% contribution to preserve baseline purity.
          </p>
        </div>
      </div>
    </div>
  );
}
