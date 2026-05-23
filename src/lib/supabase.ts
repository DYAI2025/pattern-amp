/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { 
  ScenarioBranch, 
  Hypothesis, 
  AgentReflection, 
  NatalInfluence 
} from '../types';
import { UserPatternState } from '../components/scenario/branchGrowthEngine';

// Read config environment variables safely.
const meta = import.meta as any;
const supabaseUrl = meta.env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = meta.env?.VITE_SUPABASE_ANON_KEY || '';

// Check if configured
export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co'
);

// Graceful creation to bypass runtime crashes
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Table definitions metadata for transparency
export const SUPABASE_TABLES_INFO = [
  {
    name: 'scenario_calibrations',
    description: 'Holds customized user pattern variables used to calculate growth trajectories (UserPatternState).',
    columns: [
      { name: 'id', type: 'UUID/TEXT (PK)', description: 'Primary key (default "active")' },
      { name: 'natal_wood_strength', type: 'FLOAT', description: 'Wood growth force percentage (0 to 1)' },
      { name: 'natal_metal_strength', type: 'FLOAT', description: 'Metal structural boundary capability (0 to 1)' },
      { name: 'transit_pressure', type: 'FLOAT', description: 'Planetary transit pressure coefficient (0 to 1)' },
      { name: 'quiz_discipline', type: 'FLOAT', description: 'Calibration response discipline score (0 to 1)' },
      { name: 'agent_harmony', type: 'FLOAT', description: 'Consensus compatibility index (0 to 1)' },
      { name: 'hypothesis_sustained', type: 'FLOAT', description: 'Sustenance status coefficient (0 to 1)' },
      { name: 'skeptic_damping', type: 'FLOAT', description: 'Skeptic damping and grounding factor (0 to 1)' },
      { name: 'updated_at', type: 'TIMESTAMP', description: 'Last upload timestamp (auto-set)' }
    ],
    sql: `CREATE TABLE scenario_calibrations (
  id text PRIMARY KEY DEFAULT 'active',
  natal_wood_strength float8 NOT NULL DEFAULT 0.85,
  natal_metal_strength float8 NOT NULL DEFAULT 0.30,
  transit_pressure float8 NOT NULL DEFAULT 0.70,
  quiz_discipline float8 NOT NULL DEFAULT 0.60,
  agent_harmony float8 NOT NULL DEFAULT 0.75,
  hypothesis_sustained float8 NOT NULL DEFAULT 0.80,
  skeptic_damping float8 NOT NULL DEFAULT 0.40,
  updated_at timestamp WITH time zone DEFAULT now()
);`
  },
  {
    name: 'scenario_branches',
    description: 'Stores calculated and observed scenario trajectories.',
    columns: [
      { name: 'id', type: 'TEXT (PK)', description: 'Unique identifier (e.g., "br-1")' },
      { name: 'title', type: 'TEXT', description: 'The title of this scenario branch' },
      { name: 'summary', type: 'TEXT', description: 'The conceptual synthesis summary text' },
      { name: 'tendency_type', type: 'TEXT', description: 'Categorized archetype: resonance, friction, etc.' },
      { name: 'probability_weight', type: 'INTEGER', description: 'Thick path weight slider value (1 to 10)' },
      { name: 'confidence', type: 'FLOAT', description: 'Uncertainty transparency vector (0 to 1)' },
      { name: 'horizon_relevance', type: 'INTEGER', description: 'Scaffolding path length' },
      { name: 'deviation', type: 'INTEGER', description: 'Cockpit radial deviation curving angle' },
      { name: 'coherence_delta', type: 'FLOAT', description: 'Coherence field alignment glow intensity' },
      { name: 'tension_delta', type: 'FLOAT', description: 'Atmospheric stress friction edge indicator' },
      { name: 'is_dashed', type: 'BOOLEAN', description: 'Low-evidence speculative visual indicator' },
      { name: 'not_to_infer', type: 'TEXT', description: 'Warning disclaimer regarding systemic overshooting' },
      { name: 'reflective_question', type: 'TEXT', description: 'Interactive prompt reflection question' },
      { name: 'why_appears', type: 'TEXT', description: 'Etiological cosmic/quiz origin justification' },
      { name: 'what_resonates', type: 'TEXT', description: 'Active resonance assessment text' },
      { name: 'where_friction', type: 'TEXT', description: 'Psychological limit assessment' },
      { name: 'increase_coherence', type: 'TEXT', description: 'Suggested tactical integration habit' },
      { name: 'sources', type: 'JSONB', description: 'Raw contribution array with weight, name, etc.' },
      { name: 'related_hypotheses_ids', type: 'JSONB', description: 'Array of related hypothesis keys' }
    ],
    sql: `CREATE TABLE scenario_branches (
  id text PRIMARY KEY,
  title text NOT NULL,
  summary text NOT NULL,
  tendency_type text NOT NULL,
  probability_weight integer NOT NULL DEFAULT 5,
  confidence float8 NOT NULL DEFAULT 0.5,
  horizon_relevance integer NOT NULL DEFAULT 100,
  deviation integer NOT NULL DEFAULT 0,
  coherence_delta float8 NOT NULL DEFAULT 0.0,
  tension_delta float8 NOT NULL DEFAULT 0.0,
  is_dashed boolean NOT NULL DEFAULT false,
  not_to_infer text NOT NULL,
  reflective_question text NOT NULL,
  why_appears text NOT NULL,
  what_resonates text NOT NULL,
  where_friction text NOT NULL,
  increase_coherence text NOT NULL,
  sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  related_hypotheses_ids jsonb NOT NULL DEFAULT '[]'::jsonb
);`
  },
  {
    name: 'hypotheses',
    description: 'Active, emerging, or contradicted patterns inside the Bazodiac Constellation system.',
    columns: [
      { name: 'id', type: 'TEXT (PK)', description: 'Primary unique key (e.g. "hyp-1")' },
      { name: 'title', type: 'TEXT', description: 'The title of the hypothesis' },
      { name: 'statement', type: 'TEXT', description: 'Synthesized scientific/intuitive statement' },
      { name: 'confidence', type: 'INTEGER', description: 'Calibration certainty percentage (0-100)' },
      { name: 'activation', type: 'INTEGER', description: 'Current dynamic focus strength (0-100)' },
      { name: 'status', type: 'TEXT', description: 'Active, emerging, weak, or contradicted' },
      { name: 'evidence', type: 'TEXT', description: 'Factual quiz indicators or logs backing it up' },
      { name: 'counter_evidence', type: 'TEXT', description: 'Counter factual observations by Skeptic Agent' },
      { name: 'source_mix', type: 'TEXT', description: 'Summary weights of contributing origins' },
      { name: 'related_scenario_branches', type: 'JSONB', description: 'Scenario branches linked to this hypothesis' },
      { name: 'last_updated', type: 'TEXT', description: 'Datetime stamp string' }
    ],
    sql: `CREATE TABLE hypotheses (
  id text PRIMARY KEY,
  title text NOT NULL,
  statement text NOT NULL,
  confidence integer NOT NULL DEFAULT 50,
  activation integer NOT NULL DEFAULT 50,
  status text NOT NULL DEFAULT 'emerging',
  evidence text NOT NULL,
  counter_evidence text NOT NULL,
  source_mix text NOT NULL,
  related_scenario_branches jsonb NOT NULL DEFAULT '[]'::jsonb,
  last_updated text NOT NULL
);`
  },
  {
    name: 'agent_reflections',
    description: 'Expert agent analysis vectors and cautions concerning active branches.',
    columns: [
      { name: 'id', type: 'TEXT (PK)', description: 'Unique agent ID' },
      { name: 'agent_name', type: 'TEXT', description: 'Name of the reflective counselor node' },
      { name: 'role', type: 'TEXT', description: 'The philosophical/analytic orientation role' },
      { name: 'observation', type: 'TEXT', description: 'Direct dynamic assessment' },
      { name: 'caution', type: 'TEXT', description: 'Scaffolding caution warning text' },
      { name: 'reflective_question', type: 'TEXT', description: 'Personal integration query' },
      { name: 'confidence', type: 'INTEGER', description: 'Self-assessment coefficient (0-100)' },
      { name: 'stance', type: 'TEXT', description: 'Supports, cautions, reframes, or contradicts' }
    ],
    sql: `CREATE TABLE agent_reflections (
  id text PRIMARY KEY,
  agent_name text NOT NULL,
  role text NOT NULL,
  observation text NOT NULL,
  caution text NOT NULL,
  reflective_question text NOT NULL,
  confidence integer NOT NULL DEFAULT 50,
  stance text NOT NULL DEFAULT 'reframes'
);`
  },
  {
    name: 'natal_influences',
    description: 'Western astrological, BaZi elements, and Soulprint sectors governing baseline parameters.',
    columns: [
      { name: 'id', type: 'TEXT (PK)', description: 'Primary baseline ID (e.g. "nat-1")' },
      { name: 'symbol', type: 'TEXT', description: 'Unicode glyph character visual identifier' },
      { name: 'label', type: 'TEXT', description: 'Label and coordinate description' },
      { name: 'category', type: 'TEXT', description: 'Western, BaZi, Wu-Xing, or Soulprint' },
      { name: 'strength', type: 'TEXT', description: 'Static anchor severity: high, medium, low' },
      { name: 'explanation', type: 'TEXT', description: 'Detailed hermeneutic annotation' }
    ],
    sql: `CREATE TABLE natal_influences (
  id text PRIMARY KEY,
  symbol text NOT NULL,
  label text NOT NULL,
  category text NOT NULL,
  strength text NOT NULL DEFAULT 'medium',
  explanation text NOT NULL
);`
  }
];

/**
 * Upload general calibrations that can be used to dynamically calculate scenarios
 */
export async function uploadCalibration(state: UserPatternState): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase client is not initialized.' };
  
  try {
    const { error } = await supabase
      .from('scenario_calibrations')
      .upsert({
        id: 'active',
        natal_wood_strength: state.natalWoodStrength,
        natal_metal_strength: state.natalMetalStrength,
        transit_pressure: state.transitPressure,
        quiz_discipline: state.quizDiscipline,
        agent_harmony: state.agentHarmony,
        hypothesis_sustained: state.hypothesisSustained,
        skeptic_damping: state.skepticDamping,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('Failed to upload calibration:', err);
    return { success: false, error: err?.message || 'Unknown network error' };
  }
}

/**
 * Downloads the stored calibrations
 */
export async function fetchCalibration(): Promise<UserPatternState | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('scenario_calibrations')
      .select('*')
      .eq('id', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Record not found
        return null;
      }
      throw error;
    }

    return {
      natalWoodStrength: data.natal_wood_strength,
      natalMetalStrength: data.natal_metal_strength,
      transitPressure: data.transit_pressure,
      quizDiscipline: data.quiz_discipline,
      agentHarmony: data.agent_harmony,
      hypothesisSustained: data.hypothesis_sustained,
      skepticDamping: data.skeptic_damping
    };
  } catch (err) {
    console.error('Failed to fetch calibration:', err);
    return null;
  }
}

/**
 * Upload (Seed) mock baseline aspects directly to Supabase
 */
export async function uploadAllBaselineAspects(data: {
  branches: ScenarioBranch[];
  hypotheses: Hypothesis[];
  agentReflections: AgentReflection[];
  natalInfluences: NatalInfluence[];
}): Promise<{ success: boolean; log: string }> {
  if (!supabase) return { success: false, log: 'Supabase not configured' };

  let logs: string[] = ['Starting database initialization upload...'];
  try {
    // 1. Branches
    logs.push(`Uploading ${data.branches.length} branches...`);
    for (const b of data.branches) {
      const { error } = await supabase.from('scenario_branches').upsert({
        id: b.id,
        title: b.title,
        summary: b.summary,
        tendency_type: b.tendencyType,
        probability_weight: b.probabilityWeight,
        confidence: b.confidence,
        horizon_relevance: b.horizonRelevance,
        deviation: b.deviation,
        coherence_delta: b.coherenceDelta,
        tension_delta: b.tensionDelta,
        is_dashed: b.isDashed,
        not_to_infer: b.notToInfer,
        reflective_question: b.reflectiveQuestion,
        why_appears: b.whyAppears,
        what_resonates: b.whatResonates,
        where_friction: b.whereFriction,
        increase_coherence: b.increaseCoherence,
        sources: b.sources,
        related_hypotheses_ids: b.relatedHypothesesIds
      });
      if (error) throw new Error(`Branch ${b.id} upload failed: ${error.message}`);
    }

    // 2. Hypotheses
    logs.push(`Uploading ${data.hypotheses.length} hypotheses...`);
    for (const h of data.hypotheses) {
      const { error } = await supabase.from('hypotheses').upsert({
        id: h.id,
        title: h.title,
        statement: h.statement,
        confidence: h.confidence,
        activation: h.activation,
        status: h.status,
        evidence: h.evidence,
        counter_evidence: h.counterEvidence,
        source_mix: h.sourceMix,
        related_scenario_branches: h.relatedScenarioBranches,
        last_updated: h.lastUpdated
      });
      if (error) throw new Error(`Hypothesis ${h.id} upload failed: ${error.message}`);
    }

    // 3. Agent Reflections
    logs.push(`Uploading ${data.agentReflections.length} agent reflections...`);
    for (const ar of data.agentReflections) {
      const { error } = await supabase.from('agent_reflections').upsert({
        id: ar.id,
        agent_name: ar.agentName,
        role: ar.role,
        observation: ar.observation,
        caution: ar.caution,
        reflective_question: ar.reflectiveQuestion,
        confidence: ar.confidence,
        stance: ar.stance
      });
      if (error) throw new Error(`Agent Reflection ${ar.id} upload failed: ${error.message}`);
    }

    // 4. Natal Influences
    logs.push(`Uploading ${data.natalInfluences.length} natal influences...`);
    for (const ni of data.natalInfluences) {
      const { error } = await supabase.from('natal_influences').upsert({
        id: ni.id,
        symbol: ni.symbol,
        label: ni.label,
        category: ni.category,
        strength: ni.strength,
        explanation: ni.explanation
      });
      if (error) throw new Error(`Natal influence ${ni.id} upload failed: ${error.message}`);
    }

    logs.push('All baseline aspects uploaded successfully!');
    return { success: true, log: logs.join('\n') };
  } catch (err: any) {
    logs.push(`Upload aborted due to error: ${err?.message || err}`);
    return { success: false, log: logs.join('\n') };
  }
}

/**
 * Live Fetch operations
 */
export async function fetchLiveDataset(): Promise<{
  branches: ScenarioBranch[] | null;
  hypotheses: Hypothesis[] | null;
  agentReflections: AgentReflection[] | null;
  natalInfluences: NatalInfluence[] | null;
}> {
  if (!supabase) return { branches: null, hypotheses: null, agentReflections: null, natalInfluences: null };

  try {
    const [bRes, hRes, rRes, nRes] = await Promise.all([
      supabase.from('scenario_branches').select('*'),
      supabase.from('hypotheses').select('*'),
      supabase.from('agent_reflections').select('*'),
      supabase.from('natal_influences').select('*')
    ]);

    const branches = bRes.data ? bRes.data.map(dbRow => ({
      id: dbRow.id,
      title: dbRow.title,
      summary: dbRow.summary,
      tendencyType: dbRow.tendency_type,
      probabilityWeight: dbRow.probability_weight,
      confidence: dbRow.confidence,
      horizonRelevance: dbRow.horizon_relevance,
      deviation: dbRow.deviation,
      coherenceDelta: dbRow.coherence_delta,
      tensionDelta: dbRow.tension_delta,
      isDashed: dbRow.is_dashed,
      notToInfer: dbRow.not_to_infer,
      reflectiveQuestion: dbRow.reflective_question,
      whyAppears: dbRow.why_appears,
      whatResonates: dbRow.what_resonates,
      whereFriction: dbRow.where_friction,
      increaseCoherence: dbRow.increase_coherence,
      sources: dbRow.sources,
      relatedHypothesesIds: dbRow.related_hypotheses_ids
    } as ScenarioBranch)) : null;

    const hypotheses = hRes.data ? hRes.data.map(dbRow => ({
      id: dbRow.id,
      title: dbRow.title,
      statement: dbRow.statement,
      confidence: dbRow.confidence,
      activation: dbRow.activation,
      status: dbRow.status,
      evidence: dbRow.evidence,
      counterEvidence: dbRow.counter_evidence,
      sourceMix: dbRow.source_mix,
      relatedScenarioBranches: dbRow.related_scenario_branches,
      lastUpdated: dbRow.last_updated
    } as Hypothesis)) : null;

    const agentReflections = rRes.data ? rRes.data.map(dbRow => ({
      id: dbRow.id,
      agentName: dbRow.agent_name,
      role: dbRow.role,
      observation: dbRow.observation,
      caution: dbRow.caution,
      reflectiveQuestion: dbRow.reflective_question,
      confidence: dbRow.confidence,
      stance: dbRow.stance
    } as AgentReflection)) : null;

    const natalInfluences = nRes.data ? nRes.data.map(dbRow => ({
      id: dbRow.id,
      symbol: dbRow.symbol,
      label: dbRow.label,
      category: dbRow.category,
      strength: dbRow.strength,
      explanation: dbRow.explanation
    } as NatalInfluence)) : null;

    return { branches, hypotheses, agentReflections, natalInfluences };
  } catch (err) {
    console.error('Failed to fetch full interactive dataset from Supabase:', err);
    return { branches: null, hypotheses: null, agentReflections: null, natalInfluences: null };
  }
}

/**
 * TEST MODE ONLY: In production, activeUserId must come from authenticated session context, not manual input.
 */
export async function loadPrototypeUserData(activeUserId: string) {
  const errors: Record<string, string> = {};
  const missingTables: string[] = [];

  const result = {
    activeUserId,
    profile: null as any,
    birthData: null as any,
    natalCharts: [] as any[],
    astroProfiles: [] as any[],
    contributionEvents: [] as any[],
    quizSessions: [] as any[],
    agentConversations: [] as any[],
    signatureState: null as any,
    dailyData: {
      dailyHoroscopeCache: [] as any[],
      weeklyInsightsCache: [] as any[],
      vibesCache: [] as any[],
      spaceWeatherCache: [] as any[],
      dailyPulses: [] as any[],
      dailyInterpretations: [] as any[]
    },
    eveData: {
      eveNarrativeProfiles: [] as any[],
      eveSessions: [] as any[],
      eveAnchors: [] as any[],
      eveHypotheses: [] as any[],
      eveHypothesisEvents: [] as any[],
      eveDeviationCandidates: [] as any[],
      evePlanetStates: [] as any[],
      eveSignatureEvents: [] as any[],
      eveFollowUpHooks: [] as any[],
      eveModeHistory: [] as any[]
    },
    missingTables,
    errors
  };

  if (!supabase) {
    errors['global'] = 'Supabase client is not configured or initialized.';
    return result;
  }

  // Validate UUID early
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(activeUserId);
  if (!isUuid) {
    errors['activeUserId'] = 'Entered value does not match standard 36-character UUID pattern';
    return result;
  }

  const fetchTable = async (table: string, possibleCols: string[], isSingle = false) => {
    try {
      let data: any[] | null = null;
      let lastError: any = null;

      for (const col of possibleCols) {
        const { data: resData, error: resError } = await supabase!
          .from(table)
          .select('*')
          .eq(col, activeUserId);

        if (resError) {
          lastError = resError;
          // Undefined column error code: 42703
          if (resError.code === '42703') {
            continue; // Try next possible column (like id or user_id)
          }
          break; // Stop iterating if other db error
        }
        data = resData;
        break;
      }

      if (lastError && !data) {
        // Table not found error code: 42P01
        if (lastError.code === '42P01' || lastError.message?.includes('relation') || lastError.message?.includes('does not exist')) {
          missingTables.push(table);
        } else {
          errors[table] = `${lastError.code || 'UNKNOWN'}: ${lastError.message}`;
        }
        return null;
      }

      if (!data) return null;
      return isSingle ? (data[0] || null) : data;
    } catch (err: any) {
      errors[table] = err?.message || 'Unexpected exception';
      return null;
    }
  };

  // 1. Core Profile schemas
  result.profile = await fetchTable('profiles', ['id', 'user_id'], true);
  result.birthData = await fetchTable('birth_data', ['user_id', 'id'], true);
  result.natalCharts = await fetchTable('natal_charts', ['user_id', 'id']) || [];
  result.astroProfiles = await fetchTable('astro_profiles', ['user_id', 'id']) || [];
  result.contributionEvents = await fetchTable('contribution_events', ['user_id', 'id']) || [];
  result.quizSessions = await fetchTable('quiz_sessions', ['user_id', 'id']) || [];
  result.agentConversations = await fetchTable('agent_conversations', ['user_id', 'id']) || [];
  result.signatureState = await fetchTable('user_signature_state', ['user_id', 'id'], true);

  // 2. Daily & Astrological caches
  result.dailyData.dailyHoroscopeCache = await fetchTable('daily_horoscope_cache', ['user_id', 'id']) || [];
  result.dailyData.weeklyInsightsCache = await fetchTable('weekly_insights_cache', ['user_id', 'id']) || [];
  result.dailyData.vibesCache = await fetchTable('vibes_cache', ['user_id', 'id']) || [];
  result.dailyData.dailyPulses = await fetchTable('daily_pulses', ['user_id', 'id']) || [];
  result.dailyData.dailyInterpretations = await fetchTable('daily_interpretations', ['user_id', 'id']) || [];

  // Space weather cache (query by user_id, or globally if user_id doesn't apply)
  try {
    const { data: swData, error: swError } = await supabase
      .from('space_weather_cache')
      .select('*')
      .limit(5);

    if (swError) {
      if (swError.code === '42P01' || swError.message?.includes('relation')) {
        missingTables.push('space_weather_cache');
      } else {
        errors['space_weather_cache'] = `${swError.code}: ${swError.message}`;
      }
    } else {
      result.dailyData.spaceWeatherCache = swData || [];
    }
  } catch (err: any) {
    errors['space_weather_cache'] = err?.message || 'Unexpected space weather exception';
  }

  // 3. Eve dynamics elements
  result.eveData.eveNarrativeProfiles = await fetchTable('eve_narrative_profiles', ['user_id', 'id']) || [];
  result.eveData.eveSessions = await fetchTable('eve_sessions', ['user_id', 'id']) || [];
  result.eveData.eveAnchors = await fetchTable('eve_anchors', ['user_id', 'id']) || [];
  result.eveData.eveHypotheses = await fetchTable('eve_hypotheses', ['user_id', 'id']) || [];
  result.eveData.eveHypothesisEvents = await fetchTable('eve_hypothesis_events', ['user_id', 'id']) || [];
  result.eveData.eveDeviationCandidates = await fetchTable('eve_deviation_candidates', ['user_id', 'id']) || [];
  result.eveData.evePlanetStates = await fetchTable('eve_planet_states', ['user_id', 'id']) || [];
  result.eveData.eveSignatureEvents = await fetchTable('eve_signature_events', ['user_id', 'id']) || [];
  result.eveData.eveFollowUpHooks = await fetchTable('eve_follow_up_hooks', ['user_id', 'id']) || [];
  result.eveData.eveModeHistory = await fetchTable('eve_mode_history', ['user_id', 'id']) || [];

  return result;
}

export function derivePatternStateFromUserData(userData: any): UserPatternState {
  // Extract info or fallback
  const bd = userData.birthData;
  const ap = userData.astroProfiles?.[0];
  const qs = userData.quizSessions || [];
  const ac = userData.agentConversations || [];
  
  // Base values (standard multipliers)
  let wood = bd?.wood_strength ?? ap?.natal_wood_strength ?? bd?.natal_wood_strength ?? 0.85;
  let metal = bd?.metal_strength ?? ap?.natal_metal_strength ?? bd?.natal_metal_strength ?? 0.30;
  
  // spaceWeather length can shift planet transit pressure
  const swCount = userData.dailyData?.spaceWeatherCache?.length || 0;
  let transit = swCount ? Math.min(1.0, 0.4 + swCount * 0.12) : 0.70;
  
  // Quiz sessions count drives response disciplines
  let discipline = qs.length ? Math.min(1.0, 0.45 + qs.length * 0.10) : 0.60;
  
  // Agent conversations count represents harmony integration
  let harmony = ac.length ? Math.min(1.0, 0.5 + ac.length * 0.08) : 0.75;
  
  // Eve hypotheses can boost consistency
  const ehCount = userData.eveData?.eveHypotheses?.length || 0;
  let sustained = ehCount ? Math.min(1.0, 0.5 + ehCount * 0.10) : 0.80;
  
  // Signatures or fallback
  let damping = bd?.skeptic_damping ?? bd?.damping ?? 0.40;

  return {
    natalWoodStrength: Math.max(0.01, Math.min(1.0, Number(wood) || 0.85)),
    natalMetalStrength: Math.max(0.01, Math.min(1.0, Number(metal) || 0.30)),
    transitPressure: Math.max(0.01, Math.min(1.0, Number(transit) || 0.70)),
    quizDiscipline: Math.max(0.01, Math.min(1.0, Number(discipline) || 0.60)),
    agentHarmony: Math.max(0.01, Math.min(1.0, Number(harmony) || 0.75)),
    hypothesisSustained: Math.max(0.01, Math.min(1.0, Number(sustained) || 0.80)),
    skepticDamping: Math.max(0.01, Math.min(1.0, Number(damping) || 0.40))
  };
}
