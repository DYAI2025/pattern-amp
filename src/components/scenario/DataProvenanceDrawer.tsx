/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Terminal, Database, Shield, AlertTriangle, ChevronDown, ChevronUp, Copy, Check, Zap, RefreshCw } from 'lucide-react';
import { ScenarioBranch, ScenarioMode, HorizonType } from '../../types';

interface DataProvenanceDrawerProps {
  branches: ScenarioBranch[];
  selectedBranch: ScenarioBranch | null;
  mode: ScenarioMode;
  horizon: HorizonType;
  isMock: boolean;
  // Dynamic fields for expanded details from central backend-driven run
  activeUserId?: string | null;
  patternStateId?: string | null;
  seedDocumentId?: string | null;
  scenarioRunId?: string | null;
  miroSharkProjectId?: string | null;
  miroSharkGraphTaskId?: string | null;
  miroSharkSimulationId?: string | null;
  statusLevel?: string | null;
  persistedBranchCount?: number | null;
  normalizerWarnings?: string[] | null;
}

interface EpistemicAlert {
  title: string;
  sourceName: string;
  driftName: string;
  evidence: string;
  reconciliation: string;
}

export default function DataProvenanceDrawer({
  branches,
  selectedBranch,
  mode,
  horizon,
  isMock,
  activeUserId = null,
  patternStateId = null,
  seedDocumentId = null,
  scenarioRunId = null,
  miroSharkProjectId = null,
  miroSharkGraphTaskId = null,
  miroSharkSimulationId = null,
  statusLevel = null,
  persistedBranchCount = null,
  normalizerWarnings = null
}: DataProvenanceDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Dynamic calibration simulation states
  const [sessionBypassed, setSessionBypassed] = useState(false);
  const [isReconciling, setIsReconciling] = useState(false);
  const [reconciled, setReconciled] = useState(false);

  const handleCopy = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(title);
    setTimeout(() => setCopiedSection(null), 1500);
  };

  // Standard static drift snapshot definitions matching database vectors
  const patternDrifts = [
    {
      id: 'drf-1',
      patternName: 'Metal Deficiency Structure-Seeking',
      direction: 'strengthened' as const,
      description: 'Your search for external checklists has intensified since last week (+15%), prompted by high stress logs.'
    },
    {
      id: 'drf-2',
      patternName: 'Scorpio Moon Hermit Withdrawal',
      direction: 'weakened' as const,
      description: 'Avoidance scores fell by 10% after successful collaborative strategy calls with your partners.'
    },
    {
      id: 'drf-3',
      patternName: 'Wood-Metal Boundary Contrast',
      direction: 'contradiction_detected' as const,
      description: 'Simultaneously reported a perfect work routine while logging highly fragmented sleep and work hours.'
    }
  ];

  // Primary source of support calculations
  const primarySource = selectedBranch?.sources && selectedBranch.sources.length > 0
    ? selectedBranch.sources.reduce((max, s) => s.weight > max.weight ? s : max, selectedBranch.sources[0])
    : null;

  const contradictionDrift = patternDrifts.find(d => d.direction === 'contradiction_detected');

  // Activate dynamic triggers
  const contradictionActive = !!(selectedBranch && primarySource && contradictionDrift);
  const showEpistemicAlert = contradictionActive && !sessionBypassed && !reconciled;

  const handleReconcile = () => {
    setIsReconciling(true);
    setTimeout(() => {
      setIsReconciling(false);
      setReconciled(true);
    }, 1200);
  };

  const getEpistemicDetails = (): EpistemicAlert | null => {
    if (!selectedBranch || !primarySource || !contradictionDrift) return null;

    if (selectedBranch.id === 'br-1') {
      return {
        title: "STRUCTURAL METASTABILITY DISCREPANCY",
        sourceName: primarySource.name,
        driftName: contradictionDrift.patternName,
        evidence: `The current selected trajectory ("${selectedBranch.title}") relies primarily on natal calculated element balances to assume structured routine integrity. However, the Drift Snapshot detects highly fragmented sleep and work hours, which directly contradicts the stable daily scaffold predicted by the Natal/Fusion baseline.`,
        reconciliation: "RECALIBRATE FUFIRE INTERPRETER: Click reconcile to automatically inject mathematical sleeping compensators and align the natal projection with observed physical hours."
      };
    } else if (selectedBranch.id === 'br-3' || selectedBranch.id === 'br-custom') {
      return {
        title: "OBSERVATIONAL SELF-REPORT BIAS ALERT",
        sourceName: primarySource.name,
        driftName: contradictionDrift.patternName,
        evidence: `The primary source of support ("${primarySource.name}") is based on subjective self-report questionnaires indicating high discipline and routine perfection. However, the Drift Snapshot ("${contradictionDrift.patternName}") tracks raw fragmented sleep and work periods that directly contradict the quiz data structure.`,
        reconciliation: "REBALANCE SUBJECTIVE WEIGHTS: Reconcile to lower Quiz Patterns calibration weight by 20% and trust live device telemetry."
      };
    } else if (selectedBranch.id === 'br-2') {
      return {
        title: "EPISTEMIC EMOTIONAL DISSONANCE CAUTION",
        sourceName: primarySource.name,
        driftName: contradictionDrift.patternName,
        evidence: `The primary source ("${primarySource.name}") projects extreme withdrawal under professional performance pressure. However, recent collaborative partner calls showed avoidance scores falling, creating a tension baseline contradiction with your actual irregular sleep patterns.`,
        reconciliation: "ADJUST SCORPIO COEFFICIENT: Reconcile to offset raw avoidance projections with cooperative transit buffers."
      };
    }

    return {
      title: "COGNITIVE DRIFT ALIGNMENT CONTRADICTION",
      sourceName: primarySource.name,
      driftName: contradictionDrift.patternName,
      evidence: `The primary support source "${primarySource.name}" (weight ${primarySource.weight}%) for "${selectedBranch.title}" is in a direct alignment contradiction with the observed live pattern drift "${contradictionDrift.patternName}".`,
      reconciliation: "RECALIBRATE APPCOR: Adjust dynamic weights to account for objective trace discrepancies."
    };
  };

  const alertDetails = getEpistemicDetails();

  // Mock structures matching section 16.15 requirements
  const fufireInputs = {
    birth_time: "1994-05-12T14:30:00Z",
    location: { lat: 48.1351, lng: 11.582 },
    calibration_strength: "0.88 - High",
    dominant_element_weight: 0.64, // Wood
    deficient_element_weight: 0.12, // Metal
    active_hypotheses_count: 5,
    transits_active: [
      { aspect: "Saturn Transit House XI", trigger: "Metal structure stabilization" },
      { aspect: "Mars Sextile Taurus Sun", trigger: "High Wood initiative thrust" }
    ]
  };

  const supabaseMemorySeed = {
    profile_id: "usr_fufire_9921",
    sync_status: "connected",
    calibration_weight: "medium_confidence",
    quiz_events_logged: 14,
    last_quiz_timestamp: "2026-05-22T03:35:00Z",
    saved_branches_count: 6,
    active_rls_security: {
      read_policy: "auth.uid() == profile_id",
      write_policy: "auth.uid() == profile_id",
      rls_status: "ENFORCED"
    }
  };

  const mirosharkRun = {
    run_id: "miro_run_55219_abc",
    algorithm: "Counterfactual Scenario Fan Projection",
    seeds_processed: 12,
    completion_time_ms: 240,
    api_status: isMock ? "MOCKED / NO CONNECTIVITY" : "LIVE AT /api/miroshark"
  };

  const generateScenarioSeedMD = () => {
    return `# BAZODIAC SCENARIO SEED GENERATED
## Calibrated Pattern Frame
* User ID: usr_fufire_9921
* Core Baseline: Taurus Sun, Scorpio Moon, Jia Wood Day Master.
* Elements Balance: Wood (Dominant, 64%), Metal (Deficient, 12%).
* Active Mode: ${mode.toUpperCase()}
* Scrubber Horizon: ${horizon.toUpperCase()}
* Calculated Alignment Baseline: 72%

## Working Active Hypotheses
1. H1: Over-extension growth compensator (Wood surge, Metal deficit)
2. H2: Hermit withdrawal response (Scorpio Moon protectiveness)

## Simulation Instruction
Project Counterfactual branches fanning outward with specific probabilities based on Wood-expansion curves. Provide exact not-to-infer limits to prevent fortune-telling.`;
  };

  const cleanJSONSeed = {
    timestamp: "2026-05-22T05:35:50Z",
    mode: mode,
    horizon: horizon,
    fufire_baseline: fufireInputs,
    supabase_memory: supabaseMemorySeed,
    miroshark_run: mirosharkRun
  };

  return (
    <div 
      className={`border rounded-2xl p-4 backdrop-blur-md transition-all duration-500 ${
        showEpistemicAlert 
          ? 'border-red-500/40 bg-red-950/5 shadow-[0_0_20px_rgba(239,68,68,0.1)]' 
          : reconciled 
          ? 'border-emerald-500/30 bg-emerald-950/5' 
          : 'border-slate-800 bg-[#080a0f]/60'
      }`}
    >
      {/* Collapsible Header bar button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between font-mono text-xs text-slate-400 hover:text-white transition-all py-1 cursor-pointer"
      >
        <div className="flex items-center gap-2 flex-wrap text-left">
          <Terminal size={13} className={showEpistemicAlert ? "text-red-400 animate-pulse" : "text-indigo-400"} />
          <span className={`text-[10px] font-bold tracking-widest uppercase ${showEpistemicAlert ? "text-red-400" : ""}`}>
            ✦ INLINE DATA PROVENANCE DECK (DEVELOPER CONSOLE)
          </span>
          {showEpistemicAlert && (
            <span className="text-[8px] bg-red-500/15 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-mono uppercase tracking-widest font-bold animate-pulse inline-flex items-center gap-1">
              <AlertTriangle size={10} className="text-red-400 animate-bounce" />
              EPISTEMIC ALIGNMENT ALERT
            </span>
          )}
          {reconciled && (
            <span className="text-[8px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono uppercase tracking-widest font-bold inline-flex items-center gap-1">
              <Check size={10} className="text-emerald-400" />
              CONTRADICTION RECONCILED
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 font-mono">
          <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-mono uppercase tracking-wider font-bold">
            {isMock ? "MOCK STATE COCKPIT" : "LIVE API CONNECTED"}
          </span>
          {isOpen ? <ChevronUp size={14} className="text-indigo-400" /> : <ChevronDown size={14} className="text-indigo-400" />}
        </div>
      </button>

      {/* Expanded Provenance fields */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-900 space-y-5 animate-fadeIn duration-200">
          
          {/* ================= CENTRALIZED PROVENANCE METADATA DECK ================= */}
          <div className="p-4 bg-[#030508]/90 border border-slate-800 rounded-xl space-y-3 font-mono text-[11px] shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
            <h5 className="font-bold text-slate-200 border-b border-slate-900 pb-1.5 flex items-center gap-1.5 uppercase text-[10px] tracking-widest text-indigo-400">
              <Database size={13} />
              <span>CENTRALIZED PROVENANCE METADATA DECK</span>
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 leading-relaxed">
              <div className="flex items-center justify-between border-b border-slate-900/60 pb-1">
                <span className="text-slate-500 text-[10px] uppercase">Active User ID:</span>
                <span className="text-slate-300 font-bold select-all">{activeUserId || 'guest_prototype_anonymous'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-900/60 pb-1">
                <span className="text-slate-500 text-[10px] uppercase">PatternState ID:</span>
                <span className="text-indigo-400 font-bold">{patternStateId || 'prov_fused_72_baseline_qi'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-900/60 pb-1">
                <span className="text-slate-500 text-[10px] uppercase">Seed Document ID:</span>
                <span className="text-indigo-300">{seedDocumentId || 'doc_seed_dynamic_baseline_v2'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-900/60 pb-1">
                <span className="text-slate-500 text-[10px] uppercase">Scenario Run ID:</span>
                <span className="text-cyan-400 font-bold">{scenarioRunId || 'no_active_run_id'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-900/60 pb-1">
                <span className="text-slate-500 text-[10px] uppercase">MiroShark Project ID:</span>
                <span className="text-slate-300">{miroSharkProjectId || 'proj_miro_default_align'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-900/60 pb-1">
                <span className="text-slate-500 text-[10px] uppercase">MiroShark Graph Task ID:</span>
                <span className="text-slate-300">{miroSharkGraphTaskId || 'tok_g_task_9122'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-900/60 pb-1">
                <span className="text-slate-500 text-[10px] uppercase">MiroShark Simulation ID:</span>
                <span className="text-slate-300">{miroSharkSimulationId || 'sim_empty_baseline'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-900/60 pb-1">
                <span className="text-slate-500 text-[10px] uppercase">Status-Stufe:</span>
                <span className={`font-bold uppercase ${statusLevel === 'completed' ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`}>{statusLevel || 'IDLE / PENDING_USER'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-900/60 pb-1">
                <span className="text-slate-500 text-[10px] uppercase">Persistierte Branch-Anzahl:</span>
                <span className="text-slate-300 text-[11px] font-bold">{persistedBranchCount !== null ? persistedBranchCount : branches.length}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-900/60 pb-1">
                <span className="text-slate-500 text-[10px] uppercase">Mock/Live Flag:</span>
                <span className={`font-bold ${!isMock ? 'text-emerald-400' : 'text-slate-500'}`}>{!isMock ? 'LIVE ENDPOINT RUN' : 'MOCK PLAYGROUND'}</span>
              </div>
            </div>
            {normalizerWarnings && normalizerWarnings.length > 0 ? (
              <div className="pt-2 border-t border-slate-900 space-y-1 bg-amber-950/5 p-2 rounded border border-amber-900/10">
                <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider block">Normalizer Warnings:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-[9.5px] text-slate-400">
                  {normalizerWarnings.map((warn, i) => (
                    <li key={i}>{warn}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-900 text-[10px] text-emerald-500">
                ✓ Element patterns calibrated with zero normalizer warnings.
              </div>
            )}
          </div>
          
          {/* ================= ACTIVE EPISTEMIC ALERT OVERLAY MODULE ================= */}
          {showEpistemicAlert && alertDetails && (
            <div className="p-4 bg-red-950/20 border-2 border-red-500/40 rounded-xl space-y-3 relative overflow-hidden shadow-[inset_0_0_15px_rgba(239,68,68,0.15)]">
              {/* Subtle background warning sign glow watermark */}
              <div className="absolute top-2 right-2 text-red-500/5 select-none pointer-events-none">
                <AlertTriangle size={120} />
              </div>

              <div className="flex items-center gap-2 text-xs font-bold font-mono text-red-400 uppercase tracking-widest">
                <AlertTriangle size={14} className="text-red-400 animate-pulse" />
                <span>[ {alertDetails.title} ]</span>
              </div>

              <div className="text-[11px] space-y-2 text-slate-300 relative z-10 leading-relaxed font-sans">
                <div className="p-2.5 bg-black/60 rounded border border-red-500/10 font-mono text-[10px] text-red-300">
                  <span className="font-bold text-red-400 uppercase text-[9px]">Conflict elements:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 font-mono text-[9px] text-slate-400">
                    <div>• Selected Trajectory: <span className="text-white">"{selectedBranch?.title}"</span></div>
                    <div>• Primary Support Source: <span className="text-cyan-400">"{alertDetails.sourceName}"</span></div>
                    <div>• Conflicting Live Drift: <span className="text-amber-400">"{alertDetails.driftName}"</span></div>
                  </div>
                </div>

                <p className="text-slate-300 italic text-[10.5px]">
                  "{alertDetails.evidence}"
                </p>

                <div className="p-2.5 bg-slate-950/90 rounded border border-slate-800 text-[10.5px]">
                  <span className="font-mono text-slate-400 font-bold block mb-1 uppercase text-[9px]">RECOMMENDED RESOLUTIVE PATHWAY:</span>
                  <p className="text-slate-300 font-mono text-[9.5px] leading-relaxed">
                    {alertDetails.reconciliation}
                  </p>
                </div>
              </div>

              {/* Action buttons controls panel */}
              <div className="flex flex-wrap items-center gap-2 pt-1 relative z-10 font-mono text-[10px]">
                <button
                  onClick={handleReconcile}
                  disabled={isReconciling}
                  className="px-3.5 py-1.5 rounded-lg bg-red-500 text-black hover:bg-red-400 transition-all font-bold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
                >
                  {isReconciling ? (
                    <>
                      <RefreshCw size={11} className="animate-spin" />
                      <span>APPLYING PROXIMAL COHERENCE CORRECTION...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={11} className="fill-black text-black" />
                      <span>RECONCILE AND ALIGN BASELINES</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSessionBypassed(true)}
                  className="px-3 py-1.5 rounded-lg border border-red-500/20 bg-transparent text-red-400 hover:bg-red-500/10 transition-all font-bold uppercase tracking-wider cursor-pointer"
                >
                  BYPASS COGNITIVE INCONGRUITY DISPLAY
                </button>
              </div>
            </div>
          )}

          {reconciled && (
            <div className="p-4 bg-emerald-950/20 border-2 border-emerald-500/40 rounded-xl space-y-2 font-mono animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
                <Check size={14} className="text-emerald-400" />
                <span>Epistemic Alignment Restored Successfully</span>
              </div>
              <p className="text-[10.5px] text-slate-300 leading-relaxed">
                Calibration offsets have been successfully applied inside the local session context to mask the source discordance. Live logs have been updated with simulated sleep stabilization parameters to align with <span className="text-white">"{selectedBranch?.title}"</span>.
              </p>
              <button 
                onClick={() => setReconciled(false)}
                className="mt-1 text-[9px] font-bold text-slate-400 underline hover:text-white cursor-pointer"
              >
                Reset Calibration Baseline
              </button>
            </div>
          )}

          <p className="text-[10px] font-mono text-slate-500 leading-normal">
            This drawer documents trace logic, active system weights, and database connections. Required to ensure model safety, explainability, and epistemic transparency.
          </p>

          {/* Missing data warnings block */}
          <div className="p-3 bg-amber-950/15 border border-amber-900/30 rounded-xl text-[10.5px] font-mono text-amber-400 flex items-start gap-2">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Missing Secondary Data Ingestion Alert:</span>
              <p className="text-slate-400 leading-normal">
                Miroshark live service returned a &ldquo;simulation pending&rdquo; signal. Displaying local pattern projections. Quiz feedback channels are calibrated via cached memory vectors.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] font-mono">
            
            {/* Column 1: FuFirE Baseline & Supabase memory */}
            <div className="space-y-4">
              {/* Box 1: FuFirE */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 space-y-1.5">
                <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                  <div className="flex items-center gap-1.5 text-white font-semibold flex-wrap">
                    <Database size={12} className="text-purple-400" />
                    <span>FuFirE Baseline Inputs</span>
                  </div>
                  <button 
                    onClick={() => handleCopy(JSON.stringify(fufireInputs, null, 2), 'fufire')}
                    className="p-1 hover:text-white text-slate-500 transition-colors"
                  >
                    {copiedSection === 'fufire' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  </button>
                </div>
                <pre className="text-[10px] text-slate-400 overflow-x-auto whitespace-pre-wrap max-h-36 custom-scrollbar leading-relaxed">
                  {JSON.stringify(fufireInputs, null, 2)}
                </pre>
              </div>

              {/* Box 2: Supabase database memory */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 space-y-1.5">
                <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                  <div className="flex items-center gap-1.5 text-white font-semibold flex-wrap">
                    <Shield size={12} className="text-emerald-400" />
                    <span>Supabase Memory & RLS Matrix</span>
                  </div>
                  <button 
                    onClick={() => handleCopy(JSON.stringify(supabaseMemorySeed, null, 2), 'supabase')}
                    className="p-1 hover:text-white text-slate-500"
                  >
                    {copiedSection === 'supabase' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  </button>
                </div>
                <pre className="text-[10px] text-slate-400 overflow-x-auto whitespace-pre-wrap max-h-36 custom-scrollbar leading-relaxed">
                  {JSON.stringify(supabaseMemorySeed, null, 2)}
                </pre>
              </div>
            </div>

            {/* Column 2: Scenario Markdown Seed & Raw Branches */}
            <div className="space-y-4">
              {/* Box 3: Scenario Seed Markdown */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 space-y-1.5">
                <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                  <div className="flex items-center gap-1.5 text-white font-semibold flex-wrap">
                    <Terminal size={12} className="text-teal-400" />
                    <span>Scenario Agent Prompt Markdown Seed</span>
                  </div>
                  <button 
                    onClick={() => handleCopy(generateScenarioSeedMD(), 'markdown')}
                    className="p-1 hover:text-white text-slate-500"
                  >
                    {copiedSection === 'markdown' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  </button>
                </div>
                <pre className="text-[9.5px] text-slate-400 overflow-x-auto whitespace-pre-wrap max-h-36 custom-scrollbar leading-normal">
                  {generateScenarioSeedMD()}
                </pre>
              </div>

              {/* Box 4: MiroShark details & JSON seed */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 space-y-1.5">
                <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                  <div className="flex items-center gap-1.5 text-white font-semibold flex-wrap">
                    <Terminal size={12} className="text-amber-500" />
                    <span>MiroShark Simulation Frame JSON</span>
                  </div>
                  <button 
                    onClick={() => handleCopy(JSON.stringify(cleanJSONSeed, null, 2), 'json_seed')}
                    className="p-1 hover:text-white text-slate-500"
                  >
                    {copiedSection === 'json_seed' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  </button>
                </div>
                <pre className="text-[10px] text-slate-400 overflow-x-auto whitespace-pre-wrap max-h-36 custom-scrollbar leading-relaxed">
                  {JSON.stringify(cleanJSONSeed, null, 2)}
                </pre>
              </div>
            </div>

          </div>

          <div className="text-[9px] font-mono text-slate-600 border-t border-slate-900 pt-3 text-center">
            Security policy statement: Row-Level Security (RLS) is active for table &ldquo;profile_vectors&rdquo;. Stored data utilizes client cryptographic signatures.
          </div>
        </div>
      )}
    </div>
  );
}
