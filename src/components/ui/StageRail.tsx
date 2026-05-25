/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ScenarioRunStage } from '../../lib/api/contracts';
import { useReducedMotion } from './useReducedMotion';
import { Check, Loader, AlertTriangle, Play } from 'lucide-react';

interface StageConfig {
  stage: ScenarioRunStage;
  label: string;
  description: string;
}

const STAGE_ORDER: StageConfig[] = [
  { stage: 'loading_user', label: 'User Ingestion', description: 'Query natal alignments & memory vectors.' },
  { stage: 'building_pattern_state', label: 'Pattern Fusing', description: 'Compute user Wu-Xing elements score ratios.' },
  { stage: 'building_seed', label: 'Seed Generation', description: 'Structure boundaries & not-to-infer directives.' },
  { stage: 'miroshark_ontology', label: 'Ontology Sync', description: 'Cross-link astronomical entities.' },
  { stage: 'miroshark_graph', label: 'Graph Calibration', description: 'Map trajectory tension vectors.' },
  { stage: 'miroshark_running', label: 'MiroShark Engine', description: 'Parallel simulation runs on nodes.' },
  { stage: 'normalizing_results', label: 'Result Normalizer', description: 'Screen and smooth deviation levels.' },
  { stage: 'persisting_results', label: 'Session Logging', description: 'Commit state caches to remote store.' }
];

interface StageRailProps {
  currentStage: ScenarioRunStage;
  progress: number;
  className?: string;
}

export const StageRail: React.FC<StageRailProps> = ({
  currentStage,
  progress,
  className = ''
}) => {
  const isReduced = useReducedMotion();

  // Find index of current stage in sequence
  const currentIdx = STAGE_ORDER.findIndex(s => s.stage === currentStage);
  const isFailed = currentStage === 'failed';
  const isCompleted = currentStage === 'completed';

  return (
    <div className={`border border-slate-900 bg-[#030509]/80 backdrop-blur-md rounded-2xl p-5 relative overflow-hidden space-y-4 ${className}`}>
      
      {/* Background radial accent flare */}
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 relative z-10">
        <div className="flex items-center gap-1.5 font-mono text-xs uppercase uppercase- tracking-wider text-slate-300">
          <Play size={11} className={currentStage !== 'idle' && currentStage !== 'completed' && currentStage !== 'failed' ? "text-cyan-400 animate-spin" : "text-slate-500"} />
          <span>Stage Rail Tracker</span>
        </div>
        <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950/20 border border-cyan-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
          <span>PROGRESS:</span>
          <span className="font-bold">{progress}%</span>
        </div>
      </div>

      {/* Grid containing stages list */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {STAGE_ORDER.map((item, idx) => {
          let state: 'upcoming' | 'active' | 'done' = 'upcoming';
          if (isCompleted) {
            state = 'done';
          } else if (isFailed) {
            state = idx < currentIdx ? 'done' : idx === currentIdx ? 'upcoming' : 'upcoming';
          } else {
            if (idx < currentIdx) state = 'done';
            else if (idx === currentIdx) state = 'active';
          }

          const getStatusStyles = () => {
            switch (state) {
              case 'done':
                return {
                  bg: 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400',
                  icon: <Check size={10} className="text-emerald-400" />
                };
              case 'active':
                return {
                  bg: 'bg-cyan-950/30 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.15)]',
                  icon: <Loader size={10} className="animate-spin text-cyan-400" />
                };
              case 'upcoming':
              default:
                return {
                  bg: 'bg-slate-950/80 border-slate-900 text-slate-500',
                  icon: <span className="w-1 h-1 rounded-full bg-slate-700" />
                };
            }
          };

          const s = getStatusStyles();

          return (
            <div 
              key={item.stage} 
              className={`border rounded-xl p-2.5 flex flex-col justify-between h-20 transition-all ${s.bg}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono tracking-widest text-slate-500">0{idx + 1}</span>
                <div className="w-4 h-4 rounded-full flex items-center justify-center bg-black/40 border border-current">
                  {s.icon}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold block truncate leading-snug">{item.label}</span>
                <span className="text-[8.5px] text-slate-400 font-mono block truncate mt-0.5 opacity-80" title={item.description}>
                  {item.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Underline overall progression track */}
      {!isReduced && (
        <div className="h-1 bg-slate-950 rounded-full overflow-hidden relative border border-slate-900 mt-1">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={`h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 relative`}
          />
        </div>
      )}
    </div>
  );
};
