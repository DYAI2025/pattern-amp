/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SourceContribution } from '../../types';
import { ShieldCheck, Info } from 'lucide-react';

interface SourceContributionBarsProps {
  sources: SourceContribution[];
}

export default function SourceContributionBars({ sources }: SourceContributionBarsProps) {
  // Sort by contribution weight descending
  const sortedSources = [...sources].sort((a, b) => b.weight - a.weight);

  const getDataTypeStyle = (type: string) => {
    switch (type) {
      case 'calculated':
        return 'border-purple-500/30 text-purple-300 bg-purple-950/20';
      case 'observed':
        return 'border-emerald-500/30 text-emerald-300 bg-emerald-950/20';
      case 'inferred':
        return 'border-sky-500/30 text-sky-300 bg-sky-950/20';
      case 'simulated':
        return 'border-amber-500/30 text-amber-300 bg-amber-950/20';
      default:
        return 'border-slate-800 text-slate-400 bg-slate-900/40';
    }
  };

  const getConfidenceColor = (conf: string) => {
    switch (conf) {
      case 'high':
        return 'text-emerald-400';
      case 'medium':
        return 'text-sky-450';
      case 'low':
        return 'text-yellow-500';
      default:
        return 'text-slate-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
        <h5 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Source Contribution Balance</h5>
        <span className="text-[9px] font-mono text-slate-500">PROVENANCE TRACKING</span>
      </div>

      <div className="space-y-3">
        {sortedSources.map((source, idx) => {
          return (
            <div key={idx} className="space-y-1.5 p-2 bg-slate-950/40 border border-slate-900 rounded-xl">
              <div className="flex items-center justify-between text-[11px] font-sans">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  <span className="font-semibold text-slate-200 truncate">{source.name}</span>
                  <span className={`text-[8px] px-1 py-0.2 rounded border uppercase font-mono tracking-tight shrink-0 ${getDataTypeStyle(source.dataType)}`}>
                    {source.dataType}
                  </span>
                </div>
                <div className="font-mono text-slate-300 shrink-0">
                  {source.weight}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden w-full">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    source.dataType === 'calculated' ? 'bg-purple-500' :
                    source.dataType === 'observed' ? 'bg-emerald-500' :
                    source.dataType === 'inferred' ? 'bg-sky-500' :
                    'bg-amber-500'
                  }`}
                  style={{ width: `${source.weight}%` }}
                />
              </div>

              {/* Provenance breakdown footer label */}
              <div className="flex flex-wrap items-center justify-between text-[8.5px] font-mono text-slate-500 gap-2">
                <div>
                  Confidence: <span className={`font-semibold ${getConfidenceColor(source.confidence)}`}>{source.confidence.toUpperCase()}</span>
                </div>
                <div>
                  Updated: <span className="text-slate-400">{source.lastUpdated}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-2.5 bg-slate-900/40 rounded-lg border border-slate-900 flex items-start gap-2">
        <Info size={11} className="text-slate-400 mt-0.5 shrink-0" />
        <p className="text-[9px] font-mono text-slate-500 leading-normal">
          Example calculation: &ldquo;Quiz Pattern: 22 percent contribution, medium confidence, inferred from 3 quiz events.&rdquo; This visualizes data fusion without flattening distinct sources.
        </p>
      </div>
    </div>
  );
}
