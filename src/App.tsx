/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Compass, 
  HelpCircle, 
  Info, 
  Sparkles, 
  X, 
  Download, 
  Copy, 
  Check, 
  AlertCircle, 
  Activity, 
  Wand2, 
  MessageSquare,
  RefreshCw
} from 'lucide-react';

import { ScenarioMode, HorizonType, ScenarioBranch } from './types';
import { 
  MOCK_NATAL_INFLUENCES, 
  MOCK_HYPOTHESES, 
  MOCK_BRANCHES, 
  MOCK_AGENT_REFLECTIONS, 
  MOCK_PATTERN_MEMORY 
} from './data/mockData';

// Component Imports
import ScenarioFan from './components/scenario/ScenarioFan';
import ScenarioControlPanel from './components/scenario/ScenarioControlPanel';
import BranchDetailPanel from './components/scenario/BranchDetailPanel';
import NatalInfluenceOverlay from './components/scenario/NatalInfluenceOverlay';
import CoherenceField from './components/scenario/CoherenceField';
import AgentReflectionPanel from './components/scenario/AgentReflectionPanel';
import SevenHypothesesConstellation from './components/scenario/SevenHypothesesConstellation';
import PatternMemoryPanel from './components/scenario/PatternMemoryPanel';
import DataProvenanceDrawer from './components/scenario/DataProvenanceDrawer';
import EpistemicStatusStrip from './components/scenario/EpistemicStatusStrip';
import ScenarioSeedPreview from './components/scenario/ScenarioSeedPreview';
import PatternAmplifierView from './components/scenario/PatternAmplifierView';

export default function App() {
  // Scenario & cockpit configuration State
  const [mode, setMode] = useState<ScenarioMode>('field');
  const [horizon, setHorizon] = useState<HorizonType>('7d');
  const [symbolicMode, setSymbolicMode] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [showAmplifier, setShowAmplifier] = useState<boolean>(false);

  // Locked item selection state
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>('br-1'); // default to br-1 for immediate beautiful view!
  const [selectedHypothesisId, setSelectedHypothesisId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  // Simulation interaction states
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [activeBranchList, setActiveBranchList] = useState<ScenarioBranch[]>(MOCK_BRANCHES);

  // Dialogue Interaction Modals
  const [activeConsultation, setActiveConsultation] = useState<{
    agent: string;
    branchTitle: string;
    text: string;
  } | null>(null);

  // "Why am I seeing this?" Explainer Overlay
  const [showExplainModal, setShowExplainModal] = useState(false);
  const [isExported, setIsExported] = useState(false);

  // Handle Simulation
  const handleSimulateMiroShark = () => {
    setIsSimulating(true);
    setSimulationLogs(["Initializing MiroShark API node...", "Parsing active Wu-Xing elements balance..."]);
    
    setTimeout(() => {
      setSimulationLogs(prev => [...prev, "Syncing quiz memory vectors via Supabase...", "Calibrating 90-day trajectory with Saturn transits..."]);
    }, 450);

    setTimeout(() => {
      // Modify mock parameters slightly to simulate a "Live run response"
      const modifiedBranches = MOCK_BRANCHES.map(b => {
        if (b.id === 'br-1') {
          return {
            ...b,
            confidence: 0.99,
            probabilityWeight: 10,
            coherenceDelta: 5.0
          };
        }
        return b;
      });
      setActiveBranchList(modifiedBranches);
      setIsSimulating(false);
      setSimulationLogs([]);
      // Select the strengthened branch
      setSelectedBranchId('br-1');
    }, 1200);
  };

  // Strategic customized query parsing
  const handleAskQuestion = () => {
    if (!userQuestion.trim()) return;
    setIsSimulating(true);

    setTimeout(() => {
      // Generate a custom strategic branch based on the question
      const questionBranch: ScenarioBranch = {
        id: 'br-custom',
        title: 'Custom Query Trajectory',
        summary: `Optimized scenario based on your question: "${userQuestion}"`,
        tendencyType: userQuestion.toLowerCase().includes('metal') ? 'coherence' : 'tension',
        probabilityWeight: 7,
        confidence: 0.72,
        horizonRelevance: 110,
        deviation: -25,
        coherenceDelta: 2.8,
        tensionDelta: 1.5,
        isDashed: true,
        notToInfer: 'This custom query projection utilizes local keyword matching, and is not a clinical or objective forecast of events.',
        reflectiveQuestion: 'Are you looking for structural validation, or an excuse to divert from scheduled tasks?',
        whyAppears: 'Appears because current transits temporarily support creative wood initiatives, while your recent quiz entries show sustained discipline.',
        whatResonates: 'Creative impulse is flowing intensely; high excitement about multi-tasking.',
        whereFriction: 'Tension arises around finishing details; loose ends will pile up rapidly.',
        increaseCoherence: 'Locking in the 7-day calendar baseline and committing to offline review slots before noon.',
        sources: [
          { name: 'Quiz Patterns', weight: 45, confidence: 'medium', lastUpdated: 'Just now', dataType: 'observed' },
          { name: 'Custom Query Parsing', weight: 35, confidence: 'high', lastUpdated: 'Just now', dataType: 'inferred' },
          { name: 'Natal/Fusion', weight: 20, confidence: 'high', lastUpdated: 'Stable', dataType: 'calculated' }
        ],
        relatedHypothesesIds: ['hyp-1', 'hyp-3']
      };

      // Append custom branch to top
      setActiveBranchList([questionBranch, ...MOCK_BRANCHES.filter(b => b.id !== 'br-custom')]);
      setSelectedBranchId('br-custom');
      setIsSimulating(false);
    }, 800);
  };

  // Strategic consult prompts
  const handleConsultEve = (branch: ScenarioBranch) => {
    setActiveConsultation({
      agent: 'Eve Reflection Agent (Empathic Undercurrent Analyst)',
      branchTitle: branch.title,
      text: `Concerning the "${branch.title}" trajectory, I sense you are navigating a fear that structure will smother your creative spark. That is why your Scorpio Moon is seeking withdrawal. Let's look closely at why rigid routines feel or act like constraints, rather than a protective trellis. My alignment recommendation: commit to 3 structured 45-minute focus intervals tomorrow.`
    });
  };

  const handleConsultSkeptic = (branch: ScenarioBranch) => {
    setActiveConsultation({
      agent: 'Skeptic Agent (Epistemic Discrepancies Guard)',
      branchTitle: branch.title,
      text: `Let's strip away the cosmic vocabulary for a brief moment. You are analyzing a simulated trend with ${Math.round(branch.confidence * 100)}% model confidence. If you logged 5 hours of sleep, this "Tension projection" is simple physical exhaustion. Do not reify these Taurus/Scorpio archetypes. Focus on simple restorative sleep tonight and see if the symbolic friction collapses on its own.`
    });
  };

  const handleExportMarkdown = () => {
    setIsExported(true);
    setTimeout(() => setIsExported(false), 2000);
  };

  // Retrieve current active locked items
  const selectedBranch = activeBranchList.find(b => b.id === selectedBranchId) || null;
  const relatedHypothesesIds = selectedBranch ? selectedBranch.relatedHypothesesIds : [];
  const relatedHypotheses = MOCK_HYPOTHESES.filter(h => relatedHypothesesIds.includes(h.id));

  return (
    <div id="app" className="min-h-screen bg-brand-bg text-slate-300 flex flex-col antialiased selection:bg-indigo-500/30 selection:text-indigo-200 font-sans">
      
      {/* 1. TOP ANCHOR: COCKPIT CONTROL NAV BAR */}
      <header className="border-b border-slate-800/50 bg-[#080a0f]/60 backdrop-blur-md sticky top-0 z-40 transition-all">
        <div id="header-container" className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500/50 flex items-center justify-center bg-indigo-500/10 relative">
              <div className="absolute inset-0 rounded-full bg-indigo-500/10 animate-pulse"></div>
              <Compass size={14} className="text-indigo-400 z-10" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-sans font-bold tracking-widest uppercase text-slate-100">
                  Bazodiac Scenario Lab
                </h1>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full border border-slate-800 bg-slate-900 text-slate-400 font-semibold uppercase">
                  v2.24 COCKPIT
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-500 leading-none mt-0.5 uppercase tracking-wider">
                Reflective micro-scaffolding engine for calibrated pattern awareness
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Export trigger */}
            <button
              onClick={handleExportMarkdown}
              className="p-1.5 px-3 rounded-full border border-slate-800 bg-slate-900 hover:bg-slate-850 text-slate-450 hover:text-white text-xs flex items-center gap-1.5 transition-colors border-slate-800/60"
              title="Export Current Scenario Projections"
            >
              {isExported ? <Check size={13} className="text-emerald-400" /> : <Download size={13} />}
              <span className="font-semibold uppercase tracking-wider text-[10px]">{isExported ? 'EXPORTED MD' : 'EXPORT'}</span>
            </button>
          </div>
        </div>
      </header>


      {/* 2. MAIN COCKPIT DASHBOARD: Responsive Three-Zone Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        
        {/* Connection health & indicators strip */}
        <EpistemicStatusStrip 
          isMock={!isSimulating && selectedBranchId !== 'br-custom'}
          calibrationStrength="88% (High Calibration)"
          activeHypothesesCount={5}
        />

        {/* Simulation loading spinner overlay */}
        {isSimulating && (
          <div className="p-4 bg-indigo-950/25 border border-indigo-500/20 rounded-2xl flex items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-3">
              <RefreshCw size={14} className="animate-spin text-cyan-450 text-cyan-400" />
              <div className="space-y-0.5">
                <span className="font-bold text-slate-200">MIROSHARK ENGINES ACTIVE...</span>
                <p className="text-slate-450 text-slate-500 text-[10px] leading-none">Mapping counterfactual trajectories based on Wood-expansion curves</p>
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-500">
              {simulationLogs[simulationLogs.length - 1] || 'Ingesting datasets...'}
            </div>
          </div>
        )}

        {/* THREE ZONES GRID CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ================= ZONE 1: LEFT CONTEXT RAIL (Profile, baseline & Hypotheses) ================= */}
          <section className="col-span-12 xl:col-span-3 lg:col-span-4 space-y-6 order-2 lg:order-1">
            {/* Profile summary baseline */}
            <NatalInfluenceOverlay influences={MOCK_NATAL_INFLUENCES} />

            {/* Constellation matrix working hypotheses */}
            <SevenHypothesesConstellation 
              hypotheses={MOCK_HYPOTHESES}
              selectedBranchId={selectedBranchId}
              selectedBranchHypothesesIds={relatedHypothesesIds}
              selectedHypothesisId={selectedHypothesisId}
              onSelectHypothesis={setSelectedHypothesisId}
            />
          </section>

          {/* ================= ZONE 2: CENTER CANVAS (Scenario Fan & Controls) ================= */}
          <section className="col-span-12 xl:col-span-5 lg:col-span-8 space-y-6 order-1 lg:order-2">
            
            {showAmplifier ? (
              <PatternAmplifierView 
                onSelectBranch={setSelectedBranchId}
                selectedBranchId={selectedBranchId}
                reducedMotion={reducedMotion}
              />
            ) : (
              /* Scenic curved branches fan widget */
              <ScenarioFan 
                branches={activeBranchList}
                selectedBranchId={selectedBranchId}
                onSelectBranch={setSelectedBranchId}
                symbolicMode={symbolicMode}
                reducedMotion={reducedMotion}
                mode={mode}
                horizon={horizon}
              />
            )}

            {/* Cockpit control sliders desk */}
            <ScenarioControlPanel 
              mode={mode}
              setMode={setMode}
              horizon={horizon}
              setHorizon={setHorizon}
              symbolicMode={symbolicMode}
              setSymbolicMode={setSymbolicMode}
              reducedMotion={reducedMotion}
              setReducedMotion={setReducedMotion}
              onSimulateRun={handleSimulateMiroShark}
              isSimulating={isSimulating}
              onToggleExplain={() => setShowExplainModal(true)}
              userQuestion={userQuestion}
              setUserQuestion={setUserQuestion}
              onAskQuestion={handleAskQuestion}
              showAmplifier={showAmplifier}
              onToggleAmplifier={() => setShowAmplifier(!showAmplifier)}
            />

            {/* Prompt payload calculations seed */}
            <ScenarioSeedPreview mode={mode} horizon={horizon} />
          </section>

          {/* ================= ZONE 3: RIGHT INTERPRETATION RAIL (Interpretation Details & Reflections) ================= */}
          <section className="col-span-12 xl:col-span-4 lg:col-span-12 space-y-6 order-3">
            {/* Branch descriptive details (Exact model interpretive structure) */}
            <BranchDetailPanel 
              selectedBranch={selectedBranch}
              relatedHypotheses={relatedHypotheses}
              agentReflections={MOCK_AGENT_REFLECTIONS}
              onSelectHypothesis={setSelectedHypothesisId}
              onSelectAgent={setSelectedAgentId}
              onAskEve={handleConsultEve}
              onAskSkeptic={handleConsultSkeptic}
            />

            {/* Coherence field meters */}
            <CoherenceField 
              baselineCoherence={72}
              currentCoherence={68}
              selectedBranch={selectedBranch}
            />

            {/* Calibration database memory tabs (Quiz vectors,observations,drifts) */}
            <PatternMemoryPanel memory={MOCK_PATTERN_MEMORY} />
          </section>

        </div>

        {/* Multi-agent reflexives list */}
        <section className="border-t border-slate-900 pt-6">
          <AgentReflectionPanel 
            reflections={MOCK_AGENT_REFLECTIONS}
            selectedBranchId={selectedBranchId}
            onSelectAgent={setSelectedAgentId}
            selectedAgentId={selectedAgentId}
          />
        </section>

        {/* Data Provenance tracking developer console drawer */}
        <DataProvenanceDrawer 
          branches={activeBranchList}
          selectedBranch={selectedBranch}
          mode={mode}
          horizon={horizon}
          isMock={!isSimulating && selectedBranchId !== 'br-custom'}
        />

      </main>

      {/* Footer copyright */}
      <footer className="border-t border-slate-910 bg-slate-950 py-8 text-center text-xs text-slate-505 text-slate-500 font-mono border-slate-900">
        <p>&copy; {new Date().getFullYear()} Bazodiac Scenario Lab Cockpit. Configured for high-contrast epistemic safety.</p>
        <p className="text-[10px] text-slate-650 opacity-40 mt-1">This prototype maps tendencies surrrounding natal balances. It does not output destiny forecasts.</p>
      </footer>

      {/* ================= MODAL OVERLAYS & INTERACTIVE POPUPS ================= */}

      {/* 1. WHY AM I SEEING THIS? Explainer Backdrop Overlay */}
      {showExplainModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative select-none">
            <button
              onClick={() => setShowExplainModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X size={16} />
            </button>
            
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <HelpCircle className="text-cyan-400" size={17} />
              <h3 className="text-sm font-sans font-bold text-white uppercase">Epistemic Calibration Framework</h3>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Bazodiac models construct counterfactual branches by merging stable historical factors with immediate feedback. Here is how your visualizations are generated:
            </p>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-850">
                <span className="font-mono text-cyan-400 font-semibold uppercase text-[10px]">1. Historical Baselines (35% weight)</span>
                <p className="text-slate-400 leading-normal text-[11px] mt-0.5">Calculated from solar degrees, four pillars configurations, and structural void aspects.</p>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-850">
                <span className="font-mono text-indigo-400 font-semibold uppercase text-[10px]">2. Subjective Quizzes (30% weight)</span>
                <p className="text-slate-400 leading-normal text-[11px] mt-0.5">Observed through daily rhythm responses, trait axes slider matrices, and stress tags.</p>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-850">
                <span className="font-mono text-purple-400 font-semibold uppercase text-[10px]">3. Tactical Conversations (20% weight)</span>
                <p className="text-slate-400 leading-normal text-[11px] mt-0.5">Dialogue snippets processed through secondary reflective agents to extract behavioral tags.</p>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-850">
                <span className="font-mono text-amber-500 font-semibold uppercase text-[10px]">4. Transits and Space Weather (15% weight)</span>
                <p className="text-slate-400 leading-normal text-[11px] mt-0.5">Simulated cosmic transits and field weather maps triggering baseline adjustments.</p>
              </div>
            </div>

            <p className="text-[10px] font-mono text-slate-500 leading-normal text-center">
              Coherence is purely a model safety proxy representation, not a definitive human scoring mechanism.
            </p>
          </div>
        </div>
      )}

      {/* 2. AGENT DIALOGUE consultation overlay modal */}
      {activeConsultation && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setActiveConsultation(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <MessageSquare className="text-indigo-400" size={17} />
              <div>
                <h3 className="text-sm font-sans font-bold text-white uppercase">Active Agent Reflection Channel</h3>
                <p className="text-[9.5px] font-mono text-slate-500">MAPPED ONTO: {activeConsultation.branchTitle}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-950/40 text-[12.5px] leading-relaxed text-slate-300 font-sans italic">
              &ldquo;{activeConsultation.text}&rdquo;
            </div>

            <p className="text-[10px] font-mono text-slate-500 text-center leading-normal">
              Conversation session simulated using cached agent parameters to prevent raw data leaks.
            </p>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveConsultation(null)}
                className="px-4 py-2 bg-slate-850 border border-slate-800 hover:border-slate-750 text-slate-200 text-xs rounded-xl font-medium transition-colors"
              >
                Dismiss Integration View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
