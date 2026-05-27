/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Compass, RefreshCw, X, Check, Download, 
  Sparkles, MessageSquare, HelpCircle
} from 'lucide-react';
import { ScenarioMode, HorizonType, ScenarioBranch } from '../../types';
import { 
  MOCK_NATAL_INFLUENCES, 
  MOCK_HYPOTHESES, 
  MOCK_BRANCHES, 
  MOCK_AGENT_REFLECTIONS, 
  MOCK_PATTERN_MEMORY 
} from '../../data/mockData';
import ScenarioFan from './ScenarioFan';
import ScenarioControlPanel from './ScenarioControlPanel';
import BranchDetailPanel from './BranchDetailPanel';
import NatalInfluenceOverlay from './NatalInfluenceOverlay';
import CoherenceField from './CoherenceField';
import AgentReflectionPanel from './AgentReflectionPanel';
import SevenHypothesesConstellation from './SevenHypothesesConstellation';
import PatternMemoryPanel from './PatternMemoryPanel';
import ScenarioSeedPreview from './ScenarioSeedPreview';
import PatternAmplifierView from './PatternAmplifierView';
import UserLoader from './UserLoader';
import { UserPatternState } from './branchGrowthEngine';
import { 
  runScenario, 
  getScenarioStatus, 
  getScenarioResults, 
  getScenarioSeed
} from '../../lib/api/scenarioClient';
import { mapServerBranchesToUiBranches } from '../../lib/api/branchMapper';
import { ScenarioRunStage } from '../../lib/api/contracts';
import { RollingText } from '../ui/RollingText';

interface PatternAmpPageProps {
  onExport: () => void;
}

export default function PatternAmpPage({ onExport }: PatternAmpPageProps) {
  // Scenario & cockpit configuration State
  const [mode, setMode] = useState<ScenarioMode>('field');
  const [horizon, setHorizon] = useState<HorizonType>('7d');
  const [symbolicMode, setSymbolicMode] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [showAmplifier, setShowAmplifier] = useState<boolean>(false);

  // Locked item selection state
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>('br-1');
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
  const [userPatternState, setUserPatternState] = useState<UserPatternState | null>(null);

  // Orchestration Run States
  const [runStage, setRunStage] = useState<ScenarioRunStage>('idle');
  const [runProgress, setRunProgress] = useState<number>(0);
  const [runError, setRunError] = useState<string | null>(null);

  const handleUserLoaded = (userData: any, patternState: UserPatternState | null) => {
    setActiveUserId(userData.activeUserId);
    setUserPatternState(patternState);
    if (userData.natalCharts) setActiveNatalInfluences(userData.natalCharts);
    if (userData.eveData?.eveHypotheses) setActiveHypotheses(userData.eveData.eveHypotheses);
  };

  const handleClearUser = () => {
    setActiveUserId(null);
    setUserPatternState(null);
  };

  const handleSimulateMiroShark = async () => {
    setIsSimulating(true);
    setRunStage('initiating');
    
    try {
      const runResult = await runScenario({
        activeUserId: activeUserId || 'guest',
        mode,
        horizon,
        question: userQuestion || undefined
      });
      
      // Polling logic, simplified for now until move is verified...
      // (This will need full implementation)
    } catch (err: any) {
      setIsSimulating(false);
      setRunError(err.message);
    }
  };

  // ... (Full implementation of moving logic follows)
  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          Pattern Amp
        </h1>
        <div className="text-xs text-slate-500 font-mono">SOURCE_MODE: HYPOTHESES_ONLY</div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-grow">
        {/* Left: Seven Hypotheses Constellation */}
        <div className="col-span-3">
          <SevenHypothesesConstellation 
            hypotheses={activeHypotheses}
            selectedBranchId={selectedBranchId}
            selectedBranchHypothesesIds={[]}
            onSelectHypothesis={setSelectedHypothesisId}
            selectedHypothesisId={selectedHypothesisId}
          />
        </div>

        {/* Center: Pattern Amplifier */}
        <div className="col-span-6 flex flex-col gap-6">
          <CoherenceField 
            selectedBranch={activeBranchList.find(b => b.id === selectedBranchId) || null}
            currentCoherence={75}
            baselineCoherence={60}
          />
          <div className="flex-grow bg-slate-900 rounded-2xl border border-slate-800 p-4">
             <PatternAmplifierView 
                onSelectBranch={setSelectedBranchId}
                selectedBranchId={selectedBranchId}
                reducedMotion={reducedMotion}
                externalPatternState={userPatternState}
                onPatternStateChange={setUserPatternState}
             />
          </div>
        </div>

        {/* Right: Controls & Details */}
        <div className="col-span-3 flex flex-col gap-6">
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
            onToggleExplain={() => {}}
            userQuestion={userQuestion}
            setUserQuestion={setUserQuestion}
            onAskQuestion={() => {}}
            showAmplifier={showAmplifier}
            onToggleAmplifier={() => setShowAmplifier(!showAmplifier)}
          />
          {selectedBranchId && (
            <BranchDetailPanel 
              selectedBranch={activeBranchList.find(b => b.id === selectedBranchId) || null}
              relatedHypotheses={activeHypotheses}
              agentReflections={activeAgentReflections}
              onSelectHypothesis={setSelectedHypothesisId}
              onSelectAgent={setSelectedAgentId}
              onAskEve={() => {}}
              onAskSkeptic={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
}
