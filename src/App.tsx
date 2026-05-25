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

import { 
  fetchLiveDataset, 
  uploadAllBaselineAspects, 
  isSupabaseConfigured 
} from './lib/supabase';

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
import SupabaseManager from './components/scenario/SupabaseManager';
import UserLoader from './components/scenario/UserLoader';
import { UserPatternState } from './components/scenario/branchGrowthEngine';

// API & Orchestration imports
import { 
  runScenario, 
  getScenarioStatus, 
  getScenarioResults, 
  getScenarioSeed 
} from './lib/api/scenarioClient';
import { mapServerBranchesToUiBranches } from './lib/api/branchMapper';

// Motion design system components
import { RollingText } from './components/ui/RollingText';
import { ScrollReveal } from './components/ui/ScrollReveal';
import { StageRail } from './components/ui/StageRail';
import { AuroraBackdrop } from './components/ui/AuroraBackdrop';
import { ScenarioRunStage } from './lib/api/contracts';

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

  // Live Syncing databases states & tables mapping
  const [activeBranchList, setActiveBranchList] = useState<ScenarioBranch[]>(MOCK_BRANCHES);
  const [activeHypotheses, setActiveHypotheses] = useState(MOCK_HYPOTHESES);
  const [activeNatalInfluences, setActiveNatalInfluences] = useState(MOCK_NATAL_INFLUENCES);
  const [activeAgentReflections, setActiveAgentReflections] = useState(MOCK_AGENT_REFLECTIONS);

  // Standalone test-mode user context states
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [activeUserData, setActiveUserData] = useState<any | null>(null);
  const [userPatternState, setUserPatternState] = useState<UserPatternState | null>(null);

  // Centralized Provenance Metadata variables from live run lifecycle
  const [scenarioRunId, setScenarioRunId] = useState<string | null>(null);
  const [patternStateId, setPatternStateId] = useState<string | null>('prov_fused_72_baseline_qi');
  const [seedDocumentId, setSeedDocumentId] = useState<string | null>('doc_seed_dynamic_baseline_v2');
  const [miroSharkProjectId, setMiroSharkProjectId] = useState<string | null>('proj_miro_default_align');
  const [miroSharkGraphTaskId, setMiroSharkGraphTaskId] = useState<string | null>('tok_g_task_9122');
  const [miroSharkSimulationId, setMiroSharkSimulationId] = useState<string | null>('sim_empty_baseline');
  const [statusLevel, setStatusLevel] = useState<string | null>(null);
  const [normalizerWarnings, setNormalizerWarnings] = useState<string[] | null>(null);
  const [backendSeedData, setBackendSeedData] = useState<any | null>(null);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);

  // Integrated Scenario Orchestration Run States
  const [runStage, setRunStage] = useState<ScenarioRunStage>('idle');
  const [runProgress, setRunProgress] = useState<number>(0);
  const [runError, setRunError] = useState<string | null>(null);
  const [currentRunTrace, setCurrentRunTrace] = useState<any | null>(null);

  // Mappers translating raw Backend branches schema contract to UI schema contract
  const mapServerBranchToUiBranch = (server: any): ScenarioBranch => {
    const visual = server.visual_state || {};
    return {
      id: server.id,
      title: server.title,
      summary: server.summary,
      tendencyType: server.tendency_type || 'coherence',
      probabilityWeight: server.probability_like_weight || 5,
      confidence: server.confidence !== undefined ? server.confidence : 0.8,
      horizonRelevance: visual.horizonRelevance || 100,
      deviation: visual.deviation !== undefined ? visual.deviation : 0,
      coherenceDelta: server.coherence_delta || 0,
      tensionDelta: server.tension_delta || 0,
      isDashed: !!visual.isDashed,
      notToInfer: server.not_to_infer || 'No direct clinical boundaries calculated.',
      reflectiveQuestion: server.reflective_question || 'What does this highlight inside your routine?',
      whyAppears: server.why_appears || 'Appears due to elemental indicators.',
      whatResonates: server.what_resonates || 'Resonates with target discipline parameters.',
      whereFriction: server.where_friction || 'Tension lines detected across workspace coordinates.',
      increaseCoherence: server.increase_coherence || 'Establish consistent workspace baseline habits.',
      sources: Array.isArray(server.source_weights) 
        ? server.source_weights 
        : [
            { name: 'Server Core Sync', weight: 50, confidence: 'high', lastUpdated: 'Stable', dataType: 'simulated' },
            { name: 'Core Baseline transits', weight: 50, confidence: 'high', lastUpdated: 'Stable', dataType: 'calculated' }
          ],
      relatedHypothesesIds: Array.isArray(server.related_hypotheses) ? server.related_hypotheses : []
    };
  };

  const mapServerBranchesToUiBranches = (branches: any[]): ScenarioBranch[] => {
    if (!Array.isArray(branches)) return [];
    return branches.map(mapServerBranchToUiBranch);
  };

  const handleUserLoaded = (userData: any, patternState: UserPatternState | null) => {
    setActiveUserId(userData.activeUserId);
    setActiveUserData(userData);
    setUserPatternState(patternState);

    // If active user profile elements contain custom data, enrich active elements dynamically
    if (userData.natalCharts && userData.natalCharts.length > 0) {
      const dynamicInfluences = userData.natalCharts.map((chart: any, i: number) => ({
        id: chart.id || `dynamic-nat-${i}`,
        symbol: chart.symbol || '✦',
        label: chart.label || `Chart Node ${String(chart.id).slice(0, 5)}`,
        category: chart.category || 'Western Astrological',
        strength: chart.strength || 'high',
        explanation: chart.explanation || `Dynamically synchronized user natal factor: ${chart.sign_name || 'Astro placement'} at ${chart.degree || '15'}°, influencing calibration elements.`
      }));
      setActiveNatalInfluences(dynamicInfluences);
    }

    if (userData.eveData?.eveHypotheses && userData.eveData.eveHypotheses.length > 0) {
      const customHyps = userData.eveData.eveHypotheses.map((h: any, i: number) => ({
        id: h.id || `hyp-dyn-${i}`,
        title: h.title || `Hypothesis ${String(h.id).slice(0, 5)}`,
        statement: h.statement || 'Dynamic user statement query tracking',
        confidence: Number(h.confidence) || 75,
        activation: Number(h.activation) || 60,
        status: h.status || 'active',
        evidence: h.evidence || 'Loaded via active customer database index',
        counterEvidence: h.counter_evidence || 'Skeptic review pending',
        sourceMix: h.source_mix || 'User custom',
        relatedScenarioBranches: h.related_scenario_branches || [],
        lastUpdated: h.last_updated || new Date().toISOString()
      }));
      setActiveHypotheses(customHyps);
    }
  };

  const handleClearUser = () => {
    setActiveUserId(null);
    setActiveUserData(null);
    setUserPatternState(null);
    setActiveBranchList(MOCK_BRANCHES);
    setActiveHypotheses(MOCK_HYPOTHESES);
    setActiveNatalInfluences(MOCK_NATAL_INFLUENCES);
    setActiveAgentReflections(MOCK_AGENT_REFLECTIONS);
  };

  // Supabase states
  const [isMockDeactivated, setIsMockDeactivated] = useState<boolean>(false);
  const [isUploadingDB, setIsUploadingDB] = useState<boolean>(false);
  const [isFetchingDB, setIsFetchingDB] = useState<boolean>(false);
  const [dbLogs, setDbLogs] = useState<string>('');

  // Toggle live data deactivation of mockup
  const handleToggleMockMode = async (deactivate: boolean) => {
    if (!deactivate) {
      // Revert to mocks
      setDbLogs(`Restoring local mockup playground default dataset...\n`);
      setActiveBranchList(MOCK_BRANCHES);
      setActiveHypotheses(MOCK_HYPOTHESES);
      setActiveNatalInfluences(MOCK_NATAL_INFLUENCES);
      setActiveAgentReflections(MOCK_AGENT_REFLECTIONS);
      setIsMockDeactivated(false);
      setDbLogs(prev => prev + `[STATUS] Local mockup data successfully restored.`);
      return;
    }

    // Deactivating mock data -> Load live from database
    setIsFetchingDB(true);
    setDbLogs(`Acquiring dynamic telemetry from remote Supabase schema...\n`);
    try {
      const data = await fetchLiveDataset();
      setIsFetchingDB(false);

      if (!data.branches || data.branches.length === 0) {
        setDbLogs(prev => prev + `[EMPTY DATABASE SCHEMAS ALERT] Selected tables generated 0 active rows.\nYou must SEED/initial upload standard aspects to populate your tables first.\nUse the 'Seed / Upload Aspects' operation to perform this task automatically.`);
        // Graceful empty fallback states
        setActiveBranchList([]);
        setActiveHypotheses([]);
        setActiveNatalInfluences([]);
        setActiveAgentReflections([]);
        setIsMockDeactivated(true);
      } else {
        setActiveBranchList(data.branches);
        if (data.hypotheses) setActiveHypotheses(data.hypotheses);
        if (data.natalInfluences) setActiveNatalInfluences(data.natalInfluences);
        if (data.agentReflections) setActiveAgentReflections(data.agentReflections);
        
        setIsMockDeactivated(true);
        setDbLogs(prev => prev + `[SUCCESS] Synchronized with Supabase and verified calculations:\n- scenario_branches: ${data.branches.length}\n- hypotheses: ${data.hypotheses?.length || 0}\n- agent_reflections: ${data.agentReflections?.length || 0}\n- natal_influences: ${data.natalInfluences?.length || 0}`);
      }
    } catch (err: any) {
      setIsFetchingDB(false);
      setDbLogs(prev => prev + `[CRITICAL CONFIG ERROR] Network handshake aborted: ${err?.message || err}`);
    }
  };

  // Seed the Supabase tables with initial baseline aspectos
  const handleSeedDatabase = async () => {
    setIsUploadingDB(true);
    setDbLogs(`Seeding default aspect models...`);
    try {
      const res = await uploadAllBaselineAspects({
        branches: MOCK_BRANCHES,
        hypotheses: MOCK_HYPOTHESES,
        agentReflections: MOCK_AGENT_REFLECTIONS,
        natalInfluences: MOCK_NATAL_INFLUENCES
      });
      setIsUploadingDB(false);
      setDbLogs(prev => prev + `\n` + res.log);
      
      // If live mode is selected, reload aspects automatically
      if (isMockDeactivated) {
        await handleToggleMockMode(true);
      }
    } catch (err: any) {
      setIsUploadingDB(false);
      setDbLogs(prev => prev + `\n[ERROR] Seed upload pipeline failed: ${err?.message || err}`);
    }
  };

  // Force trigger live sync
  const handleForceRefresh = async () => {
    await handleToggleMockMode(true);
  };


  // Dialogue Interaction Modals
  const [activeConsultation, setActiveConsultation] = useState<{
    agent: string;
    branchTitle: string;
    text: string;
  } | null>(null);

  // "Why am I seeing this?" Explainer Overlay
  const [showExplainModal, setShowExplainModal] = useState(false);
  const [isExported, setIsExported] = useState(false);

  // Handle Simulation using scenarioClient proxy integrations
  const handleSimulateMiroShark = async () => {
    // Clear old result states before starting a new run
    setActiveBranchList([]);
    setSelectedBranchId(null);
    setRunError(null);
    setSimulationProgress(0);
    setRunProgress(0);
    setIsSimulating(true);
    setStatusLevel('pending');
    setRunStage('initiating');

    const targetUserId = activeUserId || 'guest_prototype_uuid_9102';
    setSimulationLogs([
      `[INITIATE] Inception parameters loaded for active user signature: ${targetUserId}`,
      "Contacting secure backend coordinator for scenario run execution..."
    ]);

    try {
      const runResult = await runScenario(targetUserId);
      const runId = runResult.runId;
      setScenarioRunId(runId);
      setRunStage('running');
      setMiroSharkSimulationId(`sim_accel_${runId.substring(0, 6)}`);
      setSimulationLogs(prev => [...prev, `[STARTED] Run ID persisted: ${runId}. Spinning status polling loop.`]);

      const pollInterval = setInterval(async () => {
        try {
          const statusObj = await getScenarioStatus(runId);
          setSimulationLogs(statusObj.logs || []);
          setSimulationProgress(statusObj.progress || 0);
          setRunProgress(statusObj.progress || 0);
          setRunStage((statusObj.stage as ScenarioRunStage) || 'running');
          setStatusLevel(statusObj.status);

          if (statusObj.status === 'completed') {
            clearInterval(pollInterval);
            setSimulationLogs(prev => [...prev, "✓ Task node run complete. Fetching dynamic trajectories..."]);
            setRunStage('completed');

            // Download results and seed logs
            const resultsData = await getScenarioResults(runId);
            const seedObj = await getScenarioSeed(runId);

            // Ingest raw seed schemas
            setBackendSeedData(seedObj);
            setSeedDocumentId(`doc_seed_${runId}`);
            setPatternStateId(`prov_fused_72_${runId}`);

            if (seedObj.missing_data_warnings) {
              setNormalizerWarnings(seedObj.missing_data_warnings);
            }
            if (seedObj.miro_shark_run_id) {
              setMiroSharkProjectId('proj_miro_active_sprint');
              setMiroSharkGraphTaskId(`tok_g_task_${runId.slice(-4)}`);
              setMiroSharkSimulationId(seedObj.miro_shark_run_id);
            }

            // Map and load the branches into active display list
            const uiBranches = mapServerBranchesToUiBranches(resultsData.branches);
            setActiveBranchList(uiBranches);

            // Calibrate pattern state
            if (resultsData.patternState) {
              setUserPatternState({
                activeUserId: resultsData.patternState.activeUserId,
                woodBalance: resultsData.patternState.elements?.wood ?? 50,
                metalBalance: resultsData.patternState.elements?.metal ?? 50,
                moonPhase: 'Scorpio Waning Aspect',
                dailyCoherenceIndex: resultsData.patternState.alignmentIndex ?? 100,
                isLiveValidated: true
              });
            }

            setIsSimulating(false);
            if (uiBranches.length > 0) {
              setSelectedBranchId(uiBranches[0].id);
            }
          } else if (statusObj.status === 'failed') {
            clearInterval(pollInterval);
            setIsSimulating(false);
            setRunStage('failed');
            const errMsg = statusObj.error || "MiroShark target node run sequence aborted.";
            setRunError(errMsg);
            setSimulationLogs(prev => [
              ...prev,
              `[CRITICAL FAILURE] ${errMsg}`
            ]);
          }
        } catch (pollErr: any) {
          clearInterval(pollInterval);
          setIsSimulating(false);
          setRunStage('failed');
          const errMsg = pollErr?.message || String(pollErr);
          setRunError(errMsg);
          setSimulationLogs(prev => [
            ...prev,
            `[POLL EXCEPTION] Ingestion failure: ${errMsg}`
          ]);
        }
      }, 700);

    } catch (err: any) {
      setIsSimulating(false);
      setRunStage('failed');
      const errMsg = err?.message || String(err);
      setRunError(errMsg);
      setSimulationLogs(prev => [
        ...prev,
        `[CRITICAL INITIALIZE ABORT] Orchestration pipeline failed: ${errMsg}`
      ]);
    }
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
      setActiveBranchList([questionBranch, ...activeBranchList.filter(b => b.id !== 'br-custom')]);
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
  const relatedHypotheses = activeHypotheses.filter(h => relatedHypothesesIds.includes(h.id));

  return (
    <div id="app" className="min-h-screen bg-[#03060b] text-slate-300 flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200 font-sans relative overflow-hidden">
      
      {/* Light atmospheric backdrop */}
      <AuroraBackdrop radialIntensity={0.5} activeSignal={isSimulating} />

      {/* 1. TOP ANCHOR: COCKPIT CONTROL NAV BAR */}
      <header className="border-b border-slate-800/40 bg-[#06090e]/75 backdrop-blur-md sticky top-0 z-40 transition-all">
        <div id="header-container" className="max-w-7xl mx-auto px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full border border-cyan-500/30 flex items-center justify-center bg-cyan-500/5 relative">
              <div className="absolute inset-0 rounded-full bg-cyan-500/10 animate-pulse"></div>
              <Compass size={14} className="text-cyan-400 z-10" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-sans font-bold tracking-widest uppercase text-slate-100 flex items-center min-h-[1.5rem]">
                  <RollingText text="BAZODIAC SCENARIO LAB" />
                </h1>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full border border-cyan-950 bg-cyan-950/20 text-cyan-400 font-semibold uppercase">
                  v2.24 COCKPIT
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-500 leading-none mt-1.5 uppercase tracking-wider">
                Reflective micro-scaffolding engine for calibrated pattern awareness
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Export trigger */}
            <button
              onClick={handleExportMarkdown}
              className="p-1.5 px-3 rounded-full border border-slate-800 bg-[#070b12] hover:bg-slate-850 text-slate-405 hover:text-white text-xs flex items-center gap-1.5 transition-colors border-slate-800/60"
              title="Export Current Scenario Projections"
            >
              {isExported ? <Check size={13} className="text-emerald-400" /> : <Download size={13} />}
              <span className="font-semibold uppercase tracking-wider text-[10px]">{isExported ? 'EXPORTED MD' : 'EXPORT'}</span>
            </button>
          </div>
        </div>
      </header>


      {/* 2. MAIN COCKPIT DASHBOARD: Responsive Three-Zone Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6 relative z-10">
        
        {/* Connection health & indicators strip */}
        <EpistemicStatusStrip 
          isMock={!isSimulating && selectedBranchId !== 'br-custom'}
          calibrationStrength="88% (High Calibration)"
          activeHypothesesCount={5}
        />

        {/* Dynamic task orchestration Stage Rail */}
        <StageRail 
          currentStage={runStage} 
          progress={runProgress} 
          error={runError}
        />

        {/* Simulation logging spinner overlay */}
        {isSimulating && (
          <div className="p-4 bg-cyan-950/10 border border-cyan-500/20 rounded-2xl flex items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-3">
              <RefreshCw size={14} className="animate-spin text-cyan-400" />
              <div className="space-y-0.5">
                <span className="font-bold text-slate-200">MIROSHARK LAB OVERWATCH RUNNING...</span>
                <p className="text-slate-500 text-[10px] leading-none">Mapping counterfactual trajectories based on calibrated elements</p>
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-500">
              {simulationLogs[simulationLogs.length - 1] || 'Ingesting datasets...'}
            </div>
          </div>
        )}

        {/* Standalone User Context Loader */}
        <UserLoader 
          onUserLoaded={handleUserLoaded}
          activeUserId={activeUserId}
          onClearUser={handleClearUser}
        />

        {/* Supabase Dynamic Database Control Center (Gated behind Developer flag) */}
        {(import.meta as any).env.VITE_ENABLE_SUPABASE_DEBUG_PANEL === 'true' && (
          <SupabaseManager 
            isMockDeactivated={isMockDeactivated}
            onToggleMockMode={handleToggleMockMode}
            onSeedDatabase={handleSeedDatabase}
            onForceRefresh={handleForceRefresh}
            isUploading={isUploadingDB}
            isFetching={isFetchingDB}
            operationLogs={dbLogs}
          />
        )}

        {/* THREE ZONES GRID CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ================= ZONE 1: LEFT CONTEXT RAIL (Profile, baseline & Hypotheses) ================= */}
          <section className="col-span-12 xl:col-span-3 lg:col-span-4 space-y-6 order-2 lg:order-1">
            <ScrollReveal direction="left" delay={155}>
              <div className="space-y-6">
                {/* Profile summary baseline */}
                <NatalInfluenceOverlay influences={activeNatalInfluences} />

                {/* Constellation matrix working hypotheses */}
                <SevenHypothesesConstellation 
                  hypotheses={activeHypotheses}
                  selectedBranchId={selectedBranchId}
                  selectedBranchHypothesesIds={relatedHypothesesIds}
                  selectedHypothesisId={selectedHypothesisId}
                  onSelectHypothesis={setSelectedHypothesisId}
                />
              </div>
            </ScrollReveal>
          </section>

          {/* ================= ZONE 2: CENTER CANVAS (Scenario Fan & Controls) ================= */}
          <section className="col-span-12 xl:col-span-5 lg:col-span-8 space-y-6 order-1 lg:order-2">
            <ScrollReveal direction="fade" delay={100}>
              <div className="space-y-6">
                {showAmplifier ? (
                  <PatternAmplifierView 
                    onSelectBranch={setSelectedBranchId}
                    selectedBranchId={selectedBranchId}
                    reducedMotion={reducedMotion}
                    externalPatternState={userPatternState}
                    onPatternStateChange={setUserPatternState}
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
              </div>
            </ScrollReveal>

            {/* Prompt payload calculations seed */}
            <ScrollReveal direction="up" delay={200}>
              <ScenarioSeedPreview mode={mode} horizon={horizon} backendSeedData={backendSeedData} />
            </ScrollReveal>
          </section>

          {/* ================= ZONE 3: RIGHT INTERPRETATION RAIL (Interpretation Details & Reflections) ================= */}
          <section className="col-span-12 xl:col-span-4 lg:col-span-12 space-y-6 order-3">
            <ScrollReveal direction="right" delay={150}>
              <div className="space-y-6">
                {/* Branch descriptive details (Exact model interpretive structure) */}
                <BranchDetailPanel 
                  selectedBranch={selectedBranch}
                  relatedHypotheses={relatedHypotheses}
                  agentReflections={activeAgentReflections}
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
              </div>
            </ScrollReveal>
          </section>

        </div>

        {/* Multi-agent reflexives list */}
        <section className="border-t border-slate-900 pt-6">
          <AgentReflectionPanel 
            reflections={activeAgentReflections}
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
          isMock={!isMockDeactivated}
          activeUserId={activeUserId}
          patternStateId={patternStateId}
          seedDocumentId={seedDocumentId}
          scenarioRunId={scenarioRunId}
          miroSharkProjectId={miroSharkProjectId}
          miroSharkGraphTaskId={miroSharkGraphTaskId}
          miroSharkSimulationId={miroSharkSimulationId}
          statusLevel={statusLevel}
          persistedBranchCount={activeBranchList.length}
          normalizerWarnings={normalizerWarnings}
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
