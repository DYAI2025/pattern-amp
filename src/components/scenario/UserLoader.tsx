/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  Search, 
  Database, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info,
  Layers,
  HelpCircle,
  Clock,
  ExternalLink,
  Loader2,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { loadPrototypeUserData, derivePatternStateFromUserData } from '../../lib/supabase';
import { UserPatternState } from './branchGrowthEngine';

interface UserLoaderProps {
  onUserLoaded: (userData: any, patternState: UserPatternState | null) => void;
  activeUserId: string | null;
  onClearUser: () => void;
}

export default function UserLoader({
  onUserLoaded,
  activeUserId,
  onClearUser
}: UserLoaderProps) {
  const [uuidInput, setUuidInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadedData, setLoadedData] = useState<any | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Dynamic storage key scoped to hostname + path to keep different prototype environments fully segregated
  const getStorageKey = () => {
    const pathSafe = window.location.pathname.replace(/[^a-zA-Z0-9]/g, '_');
    return `bazodiac_prototype_active_user_id_${window.location.host}_${pathSafe}`;
  };

  // Common sample test UUIDs to help users get started
  const SAMPLE_UUIDS = [
    { label: 'Sample Profile A', value: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' },
    { label: 'Sample Profile B', value: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6' },
  ];

  const validateUuid = (uuid: string): boolean => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid.trim());
    return isUuid;
  };

  const handleQueryUser = async (targetUuid: string) => {
    const trimmed = targetUuid.trim();
    if (!trimmed) {
      setInputError('Please enter a standard UUID first.');
      return;
    }

    if (!validateUuid(trimmed)) {
      setInputError('Format is invalid. Standard UUIDs are 36 hexadecimal characters formatted with dashes.');
      return;
    }

    setInputError(null);
    setIsLoading(true);

    try {
      const result = await loadPrototypeUserData(trimmed);
      setLoadedData(result);

      if (Object.keys(result.errors).length > 0 && result.errors['global']) {
        setInputError(result.errors['global']);
        setIsLoading(false);
        return;
      }

      // Calculate the derived dynamic element balances
      const derivedState = derivePatternStateFromUserData(result);

      // Persist user UUID to localStorage under environment-segregated key
      localStorage.setItem(getStorageKey(), trimmed);

      onUserLoaded(result, derivedState);
    } catch (err: any) {
      setInputError(`Handshake error: ${err?.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setUuidInput('');
    setLoadedData(null);
    setInputError(null);
    localStorage.removeItem(getStorageKey());
    onClearUser();
  };

  // Synchronize component state with parent activeUserId
  React.useEffect(() => {
    if (!activeUserId) {
      setUuidInput('');
      setLoadedData(null);
    } else {
      setUuidInput(activeUserId);
    }
  }, [activeUserId]);

  // Read from localStorage on mount and auto-load if available for the current environment
  React.useEffect(() => {
    const saved = localStorage.getItem(getStorageKey());
    if (saved && validateUuid(saved)) {
      setUuidInput(saved);
      handleQueryUser(saved);
    }
  }, []);

  // Counting table statuses for summary metrics
  const getTableSummaryMetrics = () => {
    if (!loadedData) return { success: 0, empty: 0, missing: 0, failed: 0 };
    
    let success = 0;
    let empty = 0;
    let missing = loadedData.missingTables.length;
    let failed = Object.keys(loadedData.errors).length;

    const countAspect = (aspect: any, tableName: string) => {
      if (loadedData.missingTables.includes(tableName)) return;
      if (loadedData.errors[tableName]) return;

      if (Array.isArray(aspect)) {
        if (aspect.length > 0) success++;
        else empty++;
      } else {
        if (aspect) success++;
        else empty++;
      }
    };

    // Core
    countAspect(loadedData.profile, 'profiles');
    countAspect(loadedData.birthData, 'birth_data');
    countAspect(loadedData.natalCharts, 'natal_charts');
    countAspect(loadedData.astroProfiles, 'astro_profiles');
    countAspect(loadedData.contributionEvents, 'contribution_events');
    countAspect(loadedData.quizSessions, 'quiz_sessions');
    countAspect(loadedData.agentConversations, 'agent_conversations');
    countAspect(loadedData.signatureState, 'user_signature_state');

    // Daily
    countAspect(loadedData.dailyData.dailyHoroscopeCache, 'daily_horoscope_cache');
    countAspect(loadedData.dailyData.weeklyInsightsCache, 'weekly_insights_cache');
    countAspect(loadedData.dailyData.vibesCache, 'vibes_cache');
    countAspect(loadedData.dailyData.spaceWeatherCache, 'space_weather_cache');
    countAspect(loadedData.dailyData.dailyPulses, 'daily_pulses');
    countAspect(loadedData.dailyData.dailyInterpretations, 'daily_interpretations');

    // Eve
    countAspect(loadedData.eveData.eveNarrativeProfiles, 'eve_narrative_profiles');
    countAspect(loadedData.eveData.eveSessions, 'eve_sessions');
    countAspect(loadedData.eveData.eveAnchors, 'eve_anchors');
    countAspect(loadedData.eveData.eveHypotheses, 'eve_hypotheses');
    countAspect(loadedData.eveData.eveHypothesisEvents, 'eve_hypothesis_events');
    countAspect(loadedData.eveData.eveDeviationCandidates, 'eve_deviation_candidates');
    countAspect(loadedData.eveData.evePlanetStates, 'eve_planet_states');
    countAspect(loadedData.eveData.eveSignatureEvents, 'eve_signature_events');
    countAspect(loadedData.eveData.eveFollowUpHooks, 'eve_follow_up_hooks');
    countAspect(loadedData.eveData.eveModeHistory, 'eve_mode_history');

    return { success, empty, missing, failed };
  };

  const metrics = getTableSummaryMetrics();

  return (
    <div id="user-context-loader" className="border border-slate-800/80 bg-[#06080d]/95 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden transition-all duration-300">
      
      {/* Absolute test mode badge overlay */}
      <div className="absolute top-0 right-0 bg-rose-500/10 border-l border-b border-rose-500/30 text-rose-400 text-[9px] font-mono uppercase px-3 py-1 rounded-bl-lg font-bold tracking-widest animate-pulse">
        INTERNAL TEST MODE
      </div>

      {/* Header section with toggle button */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl">
            <User size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-wider text-slate-100 font-sans uppercase">
                Prototype User Context Loader
              </h3>
            </div>
            <p className="text-[10px] font-mono text-slate-500 uppercase">
              Simulate authenticated baseline environments with targeted row filters
            </p>
          </div>
        </div>

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-slate-900 border border-transparent hover:border-slate-800 rounded transition-colors"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Note informing about OAuth constraints */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 leading-normal text-[10px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-300">
              <Info size={12} className="text-indigo-400" />
              <span>TEST WORKSPACE BOUNDARIES:</span>
            </div>
            <p className="font-mono">
              In live Bazodiac, manual input is replaced by the Auth Session. The Loader sets <code className="text-indigo-400 bg-black/60 px-1 py-0.5 rounded border border-slate-900">activeUserId</code> and displays a local data preview, but is **not** the source of truth for ScenarioSeed or dynamic PatternState, which are orchestrated server-side.
            </p>
          </div>

          {/* User Input controls */}
          <div className="flex flex-col md:flex-row items-stretch gap-2.5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Search size={14} />
              </div>
              <input
                id="test-user-id-input"
                type="text"
                placeholder="Paste Supabase user UUID here..."
                value={uuidInput}
                onChange={(e) => {
                  setUuidInput(e.target.value);
                  setInputError(null);
                }}
                disabled={isLoading}
                className="w-full bg-[#020305] border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs font-mono text-zinc-100 placeholder:text-zinc-650 focus:outline-none focus:border-indigo-505 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQueryUser(uuidInput)}
                disabled={isLoading}
                className="px-4 py-2.5 bg-rose-950/20 hover:bg-rose-900/40 border border-rose-500/20 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 disabled:opacity-40 select-none flex items-center gap-1.5 transition-all w-full md:w-auto justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Loading Row Context...</span>
                  </>
                ) : (
                  <>
                    <Database size={13} />
                    <span>Load User</span>
                  </>
                )}
              </button>

              {(activeUserId || uuidInput) && (
                <button
                  onClick={handleClear}
                  className="p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-705 text-slate-400 hover:text-slate-100 rounded-xl transition-all"
                  title="Reset Prototype Context"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Interactive sample list */}
          {!activeUserId && !isLoading && (
            <div className="border border-dashed border-slate-850 p-3 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="text-[10px] font-mono text-slate-500 uppercase">
                Don't have a UUID handy? Use prototype presets:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_UUIDS.map(preset => (
                  <button
                    key={preset.value}
                    onClick={() => {
                      setUuidInput(preset.value);
                      handleQueryUser(preset.value);
                    }}
                    className="px-2 py-1 text-[9.5px] font-mono bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded hover:text-slate-200 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Validation / Request level errors */}
          {inputError && (
            <div className="p-3 bg-rose-950/25 border border-rose-500/20 text-rose-400 text-xs font-mono rounded-xl flex items-start gap-2.5">
              <AlertTriangle size={15} className="shrink-0 text-rose-500 animate-bounce" />
              <div className="leading-normal">{inputError}</div>
            </div>
          )}

          {/* Table Level Schema Telemetry */}
          {loadedData && (
            <div className="space-y-3.5 border-t border-slate-900 pt-3">
              {/* Summary Dashboard strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="bg-[#030408] border border-emerald-950/40 p-2 rounded-lg">
                  <span className="block text-[8px] font-mono uppercase text-slate-550 text-slate-500">Populated Tables</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{metrics.success} / 24</span>
                </div>
                <div className="bg-[#030408] border border-slate-900 p-2 rounded-lg">
                  <span className="block text-[8px] font-mono uppercase text-slate-550 text-slate-500">Empty Tables</span>
                  <span className="text-xs font-mono font-bold text-slate-450 text-slate-400">{metrics.empty}</span>
                </div>
                <div className="bg-[#030408] border border-rose-950/40 p-2 rounded-lg">
                  <span className="block text-[8px] font-mono uppercase text-slate-550 text-slate-500">Schema Missing</span>
                  <span className="text-xs font-mono font-bold text-rose-405 text-rose-400">{metrics.missing}</span>
                </div>
                <div className="bg-[#030408] border border-amber-950/40 p-2 rounded-lg">
                  <span className="block text-[8px] font-mono uppercase text-slate-550 text-slate-500">RLS/Fetch Errors</span>
                  <span className="text-xs font-mono font-bold text-amber-400">{metrics.failed}</span>
                </div>
              </div>

              {/* Collapsible details row grid list */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Layers size={11} className="text-indigo-400" />
                  <span>Interactive DB Query Mapping Matrix</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {/* Aspect 1: Core Profile */}
                  <div className="space-y-1.5 bg-slate-950/40 border border-slate-900 p-2.5 rounded-xl">
                    <div className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wider">Core Profiles</div>
                    <div className="space-y-1">
                      {renderTableBadge('profiles', loadedData.profile)}
                      {renderTableBadge('birth_data', loadedData.birthData)}
                      {renderTableBadge('natal_charts', loadedData.natalCharts)}
                      {renderTableBadge('astro_profiles', loadedData.astroProfiles)}
                      {renderTableBadge('contribution_events', loadedData.contributionEvents)}
                      {renderTableBadge('quiz_sessions', loadedData.quizSessions)}
                      {renderTableBadge('agent_conversations', loadedData.agentConversations)}
                      {renderTableBadge('user_signature_state', loadedData.signatureState)}
                    </div>
                  </div>

                  {/* Aspect 2: Astrological Cache */}
                  <div className="space-y-1.5 bg-slate-950/40 border border-slate-900 p-2.5 rounded-xl">
                    <div className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wider">Daily / Astrology Cache</div>
                    <div className="space-y-1">
                      {renderTableBadge('daily_horoscope_cache', loadedData.dailyData.dailyHoroscopeCache)}
                      {renderTableBadge('weekly_insights_cache', loadedData.dailyData.weeklyInsightsCache)}
                      {renderTableBadge('vibes_cache', loadedData.dailyData.vibesCache)}
                      {renderTableBadge('space_weather_cache', loadedData.dailyData.spaceWeatherCache)}
                      {renderTableBadge('daily_pulses', loadedData.dailyData.dailyPulses)}
                      {renderTableBadge('daily_interpretations', loadedData.dailyData.dailyInterpretations)}
                    </div>
                  </div>

                  {/* Aspect 3: EVE Narratives */}
                  <div className="space-y-1.5 bg-slate-950/40 border border-slate-900 p-2.5 rounded-xl">
                    <div className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wider">Eve Multi-Agent Sandbox</div>
                    <div className="space-y-1">
                      {renderTableBadge('eve_narrative_profiles', loadedData.eveData.eveNarrativeProfiles)}
                      {renderTableBadge('eve_sessions', loadedData.eveData.eveSessions)}
                      {renderTableBadge('eve_anchors', loadedData.eveData.eveAnchors)}
                      {renderTableBadge('eve_hypotheses', loadedData.eveData.eveHypotheses)}
                      {renderTableBadge('eve_hypothesis_events', loadedData.eveData.eveHypothesisEvents)}
                      {renderTableBadge('eve_deviation_candidates', loadedData.eveData.eveDeviationCandidates)}
                      {renderTableBadge('eve_planet_states', loadedData.eveData.evePlanetStates)}
                      {renderTableBadge('eve_signature_events', loadedData.eveData.eveSignatureEvents)}
                      {renderTableBadge('eve_follow_up_hooks', loadedData.eveData.eveFollowUpHooks)}
                      {renderTableBadge('eve_mode_history', loadedData.eveData.eveModeHistory)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Dynamic status badges
  function renderTableBadge(tableName: string, dataAspect: any) {
    const isMissing = loadedData?.missingTables?.includes(tableName);
    const hasError = loadedData?.errors?.[tableName];

    if (isMissing) {
      return (
        <div className="flex items-center justify-between p-1 px-1.5 bg-slate-950 border border-slate-900/50 rounded text-[9.5px] font-mono" title="PostgreSQL table does not exist in schema.">
          <span className="text-slate-500">{tableName}</span>
          <span className="text-rose-450 text-rose-400 font-bold bg-rose-950/20 px-1 rounded text-[8.5px]">SCHEMA MISSING</span>
        </div>
      );
    }

    if (hasError) {
      return (
        <div className="flex items-center justify-between p-1 px-1.5 bg-slate-950 border border-slate-900/50 rounded text-[9.5px] font-mono" title={hasError}>
          <span className="text-slate-500">{tableName}</span>
          <span className="text-amber-500 font-bold bg-amber-950/20 px-1 rounded text-[8.5px]">RLS/ACCESS FAIL</span>
        </div>
      );
    }

    let recordsCount = 0;
    if (Array.isArray(dataAspect)) {
      recordsCount = dataAspect.length;
    } else if (dataAspect) {
      recordsCount = 1;
    }

    if (recordsCount > 0) {
      return (
        <div className="flex items-center justify-between p-1 px-1.5 bg-emerald-950/10 border border-emerald-500/10 hover:border-emerald-500/20 rounded text-[9.5px] font-mono transition-colors">
          <span className="text-emerald-300 font-bold">{tableName}</span>
          <span className="text-emerald-400 font-bold bg-emerald-950/30 px-1.5 py-0.2 rounded text-[8.5px] flex items-center gap-0.5">
            <CheckCircle2 size={9} />
            LOADED ({recordsCount})
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between p-1 px-1.5 bg-slate-900/40 border border-slate-850 rounded text-[9.5px] font-mono hover:border-slate-800 transition-colors">
        <span className="text-slate-400">{tableName}</span>
        <span className="text-slate-500 font-semibold bg-slate-950 px-1 py-0.2 rounded text-[8.5px]">EMPTY (0)</span>
      </div>
    );
  }
}
