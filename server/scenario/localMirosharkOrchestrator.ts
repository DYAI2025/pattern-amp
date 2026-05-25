import { SupabaseLoadResult } from './supabaseUserDataLoader';

export async function runLocalMirosharkOrchestration(
  activeUserId: string,
  userLoaderResult: SupabaseLoadResult
): Promise<any> {
  const mirosharkUrl = process.env.MIROSHARK_API_BASE_URL || '';

  if (!mirosharkUrl) {
    return {
      error: 'miroshark_unconfigured',
      message: 'MiroShark API node is unconfigured.'
    };
  }

  // The instructions explicitly require returning "local_miroshark_not_implemented"
  // instead of pretending success.
  return {
    error: 'local_miroshark_not_implemented',
    message: 'Local MiroShark full orchestration boundary is not implemented in this server container. Please use proxy SCENARIO_ORCHESTRATOR_BASE_URL or dev sandbox mocks instead.',
    suggested_action: 'Configure SCENARIO_ORCHESTRATOR_BASE_URL or enable ENABLE_DEV_SCENARIO_MOCK=true.'
  };
}
