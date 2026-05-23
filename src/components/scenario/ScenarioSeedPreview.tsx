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
}

export default function ScenarioSeedPreview({ mode, horizon }: ScenarioSeedPreviewProps) {
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

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPromptSeed);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="border border-slate-800 bg-slate-950/80 rounded-2xl p-5 backdrop-blur-md space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
        <div className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-cyan-400 animate-pulse" />
          <h4 className="text-xs font-mono uppercase text-slate-100 tracking-wider">Calibration Prompt Seed Preview</h4>
        </div>
        <button
          onClick={handleCopy}
          className="text-[10px] font-mono border border-slate-800 bg-slate-900 text-slate-400 hover:text-white px-2 py-0.5 rounded flex items-center gap-1.5 transition-colors"
        >
          {copied ? <Check size={11} className="text-emerald-400" /> : <Clipboard size={11} />}
          <span>{copied ? 'COPIED' : 'COPY SEED'}</span>
        </button>
      </div>

      <div className="p-3 bg-slate-950 rounded-xl border border-slate-900">
        <pre className="text-[10px] font-mono text-slate-400 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-36 custom-scrollbar">
          {fullPromptSeed}
        </pre>
      </div>

      <p className="text-[9.5px] font-mono text-slate-500 leading-normal">
        The raw prompt seed represents the exact contextual payload sent to our language-generation models, ensuring strict traceability of the output.
      </p>
    </div>
  );
}
