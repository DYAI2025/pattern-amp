/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScenarioBranch, TendencyCategory } from '../../types';
import { ServerScenarioBranch } from './contracts';

/**
 * Maps a single ServerScenarioBranch payload format to the client-side ScenarioBranch model.
 * Performs rigorous mapping constraints and warns if mandatory values are out of bounds.
 */
export function mapServerBranchToUiBranch(server: ServerScenarioBranch): ScenarioBranch {
  // Validate basic presence
  if (!server) {
    throw new Error('Mapper received an empty server branch payload.');
  }

  const visual = (server.visual_state as any) || {};
  
  // Cast or default tendency types carefully
  const validTendencies: TendencyCategory[] = [
    'resonance',
    'friction',
    'activation',
    'withdrawal',
    'coherence',
    'tension',
    'integration'
  ];
  
  let tendency: TendencyCategory = 'coherence';
  if (server.tendency_type && validTendencies.includes(server.tendency_type as any)) {
    tendency = server.tendency_type as TendencyCategory;
  }

  // Gracefully handle confidence missing or boundary problems
  if (server.confidence === undefined || server.confidence === null) {
    console.warn(`[MAPPER] Branch ${server.id} is missing a confidence score. Defaulting to low confidence.`, server);
  }

  return {
    id: server.id,
    title: server.title || 'Untitled Projected Branch',
    summary: server.summary || 'No summary compiled by MiroShark analytics.',
    tendencyType: tendency,
    probabilityWeight: typeof server.probability_like_weight === 'number' ? Math.max(1, Math.min(10, server.probability_like_weight)) : 5,
    confidence: typeof server.confidence === 'number' ? Math.max(0, Math.min(1, server.confidence)) : 0.5,
    horizonRelevance: typeof visual.horizonRelevance === 'number' ? visual.horizonRelevance : 100,
    deviation: typeof visual.deviation === 'number' ? visual.deviation : 0,
    coherenceDelta: typeof server.coherence_delta === 'number' ? server.coherence_delta : 0,
    tensionDelta: typeof server.tension_delta === 'number' ? server.tension_delta : 0,
    isDashed: !!visual.isDashed,
    notToInfer: server.not_to_infer || 'Do not extrapolate server parameters beyond 90 days.',
    reflectiveQuestion: server.reflective_question || 'How does this resonance align with your baseline energy matrix?',
    whyAppears: server.why_appears || 'Appeared as a consequence of active BaZi element alignments.',
    whatResonates: server.what_resonates || 'Resonates heavily key Scorpio transits in your third house.',
    whereFriction: server.where_friction || 'Primary friction forms at high-volume coordination intersections.',
    increaseCoherence: server.increase_coherence || 'Establish structured, quiet 45-minute focus intervals.',
    sources: Array.isArray(server.source_weights) ? server.source_weights : [],
    relatedHypothesesIds: Array.isArray(server.related_hypotheses) ? server.related_hypotheses : []
  };
}

/**
 * Maps a list of server scenario branches to UI scenario branches.
 * Screens out fully invalid responses or provides logs.
 */
export function mapServerBranchesToUiBranches(serverBranches: ServerScenarioBranch[]): ScenarioBranch[] {
  if (!Array.isArray(serverBranches)) {
    console.error('[MAPPER] Expected branches list but received invalid response:', serverBranches);
    return [];
  }
  
  return serverBranches
    .map((b) => {
      try {
        return mapServerBranchToUiBranch(b);
      } catch (err) {
        console.error('[MAPPER] Failed mapping specific branch item:', b, err);
        return null;
      }
    })
    .filter((b): b is ScenarioBranch => b !== null);
}
