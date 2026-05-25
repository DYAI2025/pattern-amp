import { SupabaseLoadResult } from './supabaseUserDataLoader';
import { UserPatternStateBackend } from './buildUserPatternState';

export interface ScenarioSeedBackend {
  seed_markdown: string;
  seed_json: any;
  used_supabase_tables: string[];
  missing_tables: string[];
  missing_data_warnings: string[];
  miro_shark_run_id: string;
  not_to_infer_rules: string[];
}

export function buildScenarioSeed(
  runId: string,
  userLoaderResult: SupabaseLoadResult,
  patternState: UserPatternStateBackend,
  question?: string
): ScenarioSeedBackend {
  const usedTables: string[] = [];
  const missingTables: string[] = [];
  const warnings: string[] = [];

  // Categorize tables based on load result status
  for (const [key, details] of Object.entries(userLoaderResult.tables)) {
    if (details.status === 'success') {
      usedTables.push(key);
    } else if (details.status === 'missing') {
      missingTables.push(key);
    }
  }

  // Generate logical warnings
  if (userLoaderResult.tables['birth_data']?.status !== 'success') {
    warnings.push('Birth location and precise hour coordinates are missing. Absolute Solar House calculations utilized.');
  }
  if (userLoaderResult.tables['quiz_sessions']?.status !== 'success') {
    warnings.push('Core quiz-response history vector is unaligned. Defaulting to sandbox element multipliers.');
  }
  if (process.env.ENABLE_EVE_TABLE_READS !== 'true') {
    warnings.push('Eve cognitive-agent interaction logs are offline (ENABLE_EVE_TABLE_READS=false).');
  }

  const notToInferRules = [
    'Do not forecast deterministic real-world events or absolute future-predictive milestones.',
    'Do not extrapolate internal focus balances as rigid psychological or clinical conditions.',
    'Adhere strictly to 90-day trajectory limit parameters.'
  ];

  const seedMarkdown = `# BAZODIAC SCENARIO CALIBRATION SEED
- **Scenario Run ID**: \`${runId}\`
- **User Identifier UUID**: \`${userLoaderResult.activeUserId}\`
- **Calculated Bazi Element State**: Wood: ${patternState.elements.wood}%, Metal: ${patternState.elements.metal}%
- **Space Weather Alignment**: Scorpio Lunar Index: ${patternState.moonScorpioIntensity}%
- **Authoritative Data Sources**: ${usedTables.join(', ') || 'None (Local client state)'}
- **Active User Prompt/Question**: "${question || 'How can structural limits restore focus?'}"

## Structural Boundaries & Warnings
${warnings.map(w => `- ⚠️ ${w}`).join('\n') || '- ✓ All foundational database tables loaded cleanly.'}

## Strict Evaluation Rules
${notToInferRules.map(r => `- ${r}`).join('\n')}
`;

  return {
    seed_markdown: seedMarkdown,
    seed_json: {
      runId,
      activeUserId: userLoaderResult.activeUserId,
      usedTables,
      missingTables,
      elements: patternState.elements,
      question
    },
    used_supabase_tables: usedTables,
    missing_tables: missingTables,
    missing_data_warnings: warnings,
    miro_shark_run_id: `ms_sim_${runId.substring(runId.indexOf('_') + 1, runId.indexOf('_') + 7)}`,
    not_to_infer_rules: notToInferRules
  };
}
