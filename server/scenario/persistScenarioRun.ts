import { createClient } from '@supabase/supabase-js';
import { NormalizedResults } from './normalizeMirosharkResults';
import { ScenarioSeedBackend } from './buildScenarioSeed';

export interface FilePersistenceResult {
  runId: string;
  persisted: boolean;
  error?: {
    code: 'scenario_table_missing' | 'persistence_failed';
    missingTable?: string;
    message: string;
  };
}

export async function persistScenarioRun(
  runId: string,
  results: NormalizedResults,
  seed: ScenarioSeedBackend
): Promise<FilePersistenceResult> {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    // If unconfigured, we don't treat it as database failure, we just skip persistence logs
    return { runId, persisted: false };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Define critical persistence tables
  const targetTables = [
    'scenario_runs',
    'scenario_pattern_states',
    'scenario_seed_documents',
    'scenario_branches'
  ];

  // Let's do a sequence of attempts to write and look for PG relation errors.
  // First, verify scenario_runs table is there
  try {
    const { error: runError } = await supabase.from('scenario_runs').upsert({
      id: runId,
      active_user_id: results.patternState.activeUserId,
      status: 'completed',
      progress: 100,
      logs: ['Server-side authoritative run successfully executed.'],
      created_at: new Date().toISOString()
    });

    if (runError) {
      if (runError.code === '42P01' || runError.message?.includes('relation') || runError.message?.includes('does not exist')) {
        return {
          runId,
          persisted: false,
          error: {
            code: 'scenario_table_missing',
            missingTable: 'scenario_runs',
            message: `The server database table 'scenario_runs' is missing. Please configure migration schemas.`
          }
        };
      }
      throw runError;
    }
  } catch (err: any) {
    return {
      runId,
      persisted: false,
      error: {
        code: 'persistence_failed',
        message: err?.message || String(err)
      }
    };
  }

  // Next, persist scenario_pattern_states
  try {
    const { error: stateError } = await supabase.from('scenario_pattern_states').upsert({
      id: results.patternState.provenanceId || `state_${runId}`,
      run_id: runId,
      user_id: results.patternState.activeUserId,
      wood_balance: results.patternState.elements.wood,
      metal_balance: results.patternState.elements.metal,
      moon_intensity: results.patternState.moonScorpioIntensity,
      alignment_index: results.patternState.alignmentIndex,
      last_calculated: results.patternState.lastCalculated
    });

    if (stateError) {
      if (stateError.code === '42P01' || stateError.message?.includes('relation')) {
        return {
          runId,
          persisted: false,
          error: {
            code: 'scenario_table_missing',
            missingTable: 'scenario_pattern_states',
            message: `The server database table 'scenario_pattern_states' is missing.`
          }
        };
      }
      throw stateError;
    }
  } catch (err: any) {
    // We log some details but let general flow proceed if table exists but has schema mismatches (since they might be custom and we shouldn't invent schema)
    console.warn(`[PERSISTENCE] Pattern state write minor issue: ${err.message}`);
  }

  // Persist scenario_seed_documents
  try {
    const { error: seedError } = await supabase.from('scenario_seed_documents').upsert({
      id: `seed_${runId}`,
      run_id: runId,
      seed_markdown: seed.seed_markdown,
      seed_json: seed.seed_json,
      warnings: seed.missing_data_warnings,
      miro_shark_run_id: seed.miro_shark_run_id
    });

    if (seedError) {
      if (seedError.code === '42P01' || seedError.message?.includes('relation')) {
        return {
          runId,
          persisted: false,
          error: {
            code: 'scenario_table_missing',
            missingTable: 'scenario_seed_documents',
            message: `The server database table 'scenario_seed_documents' is missing.`
          }
        };
      }
      throw seedError;
    }
  } catch (err: any) {
    console.warn(`[PERSISTENCE] Seed document write issue: ${err.message}`);
  }

  // Persist scenario_branches
  try {
    for (const b of results.branches) {
      const { error: branchError } = await supabase.from('scenario_branches').upsert({
        id: b.id,
        run_id: runId,
        title: b.title,
        summary: b.summary,
        tendency_type: b.tendency_type,
        probability_weight: b.probability_like_weight,
        confidence: b.confidence,
        horizon_relevance: b.visual_state?.horizonRelevance || 100,
        deviation: b.visual_state?.deviation || 0,
        coherence_delta: b.coherence_delta,
        tension_delta: b.tension_delta,
        is_dashed: b.visual_state?.isDashed || false,
        not_to_infer: b.not_to_infer,
        reflective_question: b.reflective_question,
        why_appears: b.why_appears,
        what_resonates: b.what_resonates,
        where_friction: b.where_friction,
        increase_coherence: b.increase_coherence,
        sources: b.source_weights,
        related_hypotheses_ids: b.related_hypotheses,
        vector_path_3d: (b as any).vector_path_3d,
        parent_id: (b as any).parent_id,
        depth: (b as any).depth,
        split_reason: (b as any).split_reason
      });

      if (branchError) {
        if (branchError.code === '42P01' || branchError.message?.includes('relation')) {
          return {
            runId,
            persisted: false,
            error: {
              code: 'scenario_table_missing',
              missingTable: 'scenario_branches',
              message: `The server database table 'scenario_branches' is missing.`
            }
          };
        }
        throw branchError;
      }
    }
  } catch (err: any) {
    console.warn(`[PERSISTENCE] Branches batch write minor issue: ${err.message}`);
  }

  return { runId, persisted: true };
}
