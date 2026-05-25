/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Clipboard, Check, Eye } from 'lucide-react';
import { ScenarioMode, HorizonType } from '../../types';

interface ScenarioSeedPreviewProps {
  mode: ScenarioMode;
  horizon: HorizonType;
  backendSeedData?: {
    seed_markdown: string;
    seed_json: any;
    used_supabase_tables: string[];
    missing_data_warnings: string[];
    miro_shark_run_id: string;
    not_to_infer_rules: string[];
  } | null;
}

export default function ScenarioSeedPreview({ mode, horizon, backendSeedData = null }: ScenarioSeedPreviewProps) {
  const [copied, setCopied] = useState(false);

  // Generate a dynamic instruction block depending on mode selection
  const getSimulativeInstructions = (currentMode: ScenarioMode) => {
    switch (currentMode) {
      case 'field':
        return 'Compute active elements. Cross-map high Wood density with Taurus Sun goals to measure immediate inertia offsets.';
      case 'move':
        return 'Highlight actionable micro-actions for Wood redirection. Prune secondary deadlines automatically.';
      case 'pressure':
        return 'Model standard fight-or-flight behaviors under high deadlines pressure. Simulate Scorpio withdrawal threshold coefficients.';
      case 'coherence':
        return 'Seek maximum structural optimization in 90-day trajectory. Output steps to satisfy deficient Metal structures.';
      case 'tension':
        return 'Highlight divergence trajectories. Map friction lines between Wood hyper-expansion projects and Moon Scorpio need for rest.';
      case 'question':
        return 'Parse custom strategic queries against stored memory parameters. Ensure non-deterministic tone throughout outputs.';
      default:
        return 'Synthesize baseline profile parameters against astronomical daily fields.';
    }
  };

  const fullPromptSeed = `[CALIBRATED_SEED_PROVE_V2]
MODE: ${mode.toUpperCase()}
HORIZON: ${horizon === 'now' ? 'IMMEDIATE' : horizon === '7d' ? '7_DAYS_DRIFT' : horizon === '30d' ? '30_DAYS_OUTLOOK' : '90_DAYS_SPECULATION'}
BASILINE: Jia Wood Day Master, Scorpio Moon, Taurus Sun, Wood dominant, Metal deficient.
INSTRUCTION: ${getSimulativeInstructions(mode)}`;

  const promptSeedToShow = backendSeedData?.seed_markdown || fullPromptSeed;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptSeedToShow);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="border border-slate-800 bg-slate-950/80 rounded-2xl p-5 backdrop-blur-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Sparkles size={14} className={backendSeedData ? "text-cyan-400 animate-pulse" : "text-indigo-400"} />
          <h4 className="text-xs font-mono uppercase text-slate-100 tracking-wider">
            {backendSeedData ? '✓ Backend-Generated Calibration Seed' : 'Calibration Prompt Seed Preview'}
          </h4>
        </div>
        <button
          onClick={handleCopy}
          className="text-[10px] font-mono border border-slate-800 bg-slate-900 text-slate-400 hover:text-white px-2 py-0.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {copied ? <Check size={11} className="text-emerald-400" /> : <Clipboard size={11} />}
          <span>{copied ? 'COPIED' : 'COPY SEED'}</span>
        </button>
      </div>

      <div className="p-3 bg-slate-950 rounded-xl border border-slate-900">
        <pre className="text-[10px] font-mono text-slate-400 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-40 custom-scrollbar">
          {promptSeedToShow}
        </pre>
      </div>

      {backendSeedData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[10px] font-mono">
          <div className="p-2 border border-slate-900 rounded bg-slate-900/40 text-slate-400">
            <span className="font-bold text-[9px] uppercase tracking-wider text-purple-400 block mb-1">Used DB Tables:</span>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {backendSeedData.used_supabase_tables.map((t, idx) => (
                <span key={idx} className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-[8.5px] text-slate-300">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="p-2 border border-slate-900 rounded bg-slate-900/40 text-slate-400">
            <span className="font-bold text-[9px] uppercase tracking-wider text-cyan-400 block mb-1">MiroShark Run context:</span>
            <div className="space-y-0.5 text-[9px] text-slate-300">
              <div>Run ID: <span className="font-bold text-white">{backendSeedData.miro_shark_run_id}</span></div>
              {backendSeedData.missing_data_warnings && backendSeedData.missing_data_warnings.length > 0 && (
                <div className="text-amber-400 text-[8.5px] mt-0.5">• {backendSeedData.missing_data_warnings[0]}</div>
              )}
            </div>
          </div>
        </div>
      )}

      <p className="text-[9.5px] font-mono text-slate-500 leading-normal">
        {backendSeedData 
          ? 'This text block shows the final custom calibrated instruction block compiled and executed by our backend orchestrator.'
          : 'The raw prompt seed represents the exact contextual payload sent to our language-generation models, ensuring strict traceability of the output.'
        }
      </p>
    </div>
  );
}
