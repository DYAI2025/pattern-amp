/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SupabaseLoadResult } from './supabaseUserDataLoader';

export interface HypothesisPatternStateV1 {
  activeUserId: string;
  generatedAt: string;
  mode: 'hypotheses_only';
  profileSummary: Record<string, any>;
  astroContext: Record<string, any>;
  natalContext: Record<string, any>;
  selectedSevenHypotheses: any[];
  hypothesisConfidenceSummary?: Record<string, any>;
  contradictionSummary?: Record<string, any>;
  triggerMap?: Record<string, any>;
  exceptionMap?: Record<string, any>;
  planetaryCorrelationSummary?: Record<string, any>;
  dailyContext: Record<string, any>;
  agentConversationContext: Record<string, any>;
  dataCompleteness: number; // 0 to 1
  warnings: string[];
}

export function buildHypothesisPatternStateV1(
  bundle: SupabaseLoadResult
): HypothesisPatternStateV1 {
  const profile = bundle.tables['profiles']?.data?.[0] || {};
  const bd = bundle.tables['birth_data']?.data?.[0] || {};
  const ap = bundle.tables['astro_profiles']?.data?.[0] || {};
  const nc = bundle.tables['natal_charts']?.data?.[0] || {};
  const allHypotheses = bundle.tables['eve_hypotheses']?.data || [];
  const dailyPulses = bundle.tables['daily_pulses']?.data || [];
  const dailyInterpretations = bundle.tables['daily_interpretations']?.data || [];
  const agentConversations = bundle.tables['agent_conversations']?.data || [];
  
  const warnings: string[] = [];
  let successfulTablesCount = 0;
  const totalTables = 8; // core tables checked for completeness marker

  // Safe checks for data completeness
  if (bundle.tables['profiles']?.status === 'success') successfulTablesCount++;
  if (bundle.tables['natal_charts']?.status === 'success') successfulTablesCount++;
  if (bundle.tables['eve_hypotheses']?.status === 'success') successfulTablesCount++;
  if (bundle.tables['eve_anchors']?.status === 'success') successfulTablesCount++;
  if (bundle.tables['agent_conversations']?.status === 'success') successfulTablesCount++;
  if (bundle.tables['daily_pulses']?.status === 'success') successfulTablesCount++;
  
  const dataCompleteness = Math.min(1.0, successfulTablesCount / totalTables);

  // Map Hypotheses
  const mappedHypotheses = allHypotheses.map((eh: any) => {
    return {
      id: eh.id || '',
      anchorId: eh.anchor_id || null,
      version: eh.version || 1,
      statement: eh.core_statement || '',
      status: eh.status || 'draft',
      maturity: eh.maturity || 'new',
      confidence: Number(eh.confidence) || 0,
      createdFrom: eh.created_from || 'manual',
      promotionType: eh.promotion_type || 'none',
      evidence: {
        confirmations: eh.confirmation_count || 0,
        userConfirmations: eh.user_confirmation_count || 0,
        indirectConfirmations: eh.indirect_confirmation_count || 0,
        contradictions: eh.contradiction_count || 0,
        relevantSessions: eh.relevant_session_count || 0
      },
      robustness: Number(eh.robustness_score) || 0,
      triggers: eh.known_triggers || [],
      exceptions: eh.known_exceptions || [],
      recurringLanguage: eh.recurring_language || [],
      confirmedContexts: eh.confirmed_contexts || [],
      openQuestions: eh.open_questions || [],
      subpatterns: eh.subpatterns || [],
      protectiveFunction: eh.protective_function || null,
      planetaryCorrelations: eh.planetary_correlations || [],
      enrichmentNotes: eh.enrichment_notes || null,
      createdAt: eh.created_at || new Date().toISOString(),
      updatedAt: eh.updated_at || new Date().toISOString()
    };
  });

  // Sort / Rank hypotheses
  // 1. status active zuerst
  // 2. confidence desc
  // 3. robustness desc
  // 4. updatedAt desc
  const sortedHypotheses = [...mappedHypotheses].sort((a, b) => {
    // status 'active' is prioritized over draft/inactive
    const aActive = a.status === 'active' ? 1 : 0;
    const bActive = b.status === 'active' ? 1 : 0;
    if (aActive !== bActive) return bActive - aActive;

    // confidence
    if (b.confidence !== a.confidence) return b.confidence - a.confidence;

    // robustness
    if (b.robustness !== a.robustness) return b.robustness - a.robustness;

    // updatedAt
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const selectedSevenHypotheses = sortedHypotheses.slice(0, 7);

  if (selectedSevenHypotheses.length < 7) {
    if (selectedSevenHypotheses.length === 0) {
      warnings.push("Es liegen noch keine Eve-Hypothesen für diesen User vor. Pattern Amp kann ohne Hypothesen keinen belastbaren V1-Run starten.");
    } else {
      warnings.push(`Noch nicht sieben belastbare Hypothesen vorhanden. Die Simulation arbeitet mit reduzierter Datentiefe (Anzahl: ${selectedSevenHypotheses.length}).`);
    }
  }

  // Quiz Exclusions Check
  const hasQuizDataInV1Input = (bundle.tables['quiz_sessions']?.data || []).length > 0;
  if (hasQuizDataInV1Input) {
    warnings.push("Quiz evaluation is explicitly excluded in V1: hypotheses_only mode.");
  }

  return {
    activeUserId: bundle.activeUserId,
    generatedAt: new Date().toISOString(),
    mode: 'hypotheses_only',
    profileSummary: {
      fullName: profile.full_name || 'Anonymous User',
      timezone: profile.timezone || 'UTC'
    },
    astroContext: {
      sign: ap.natal_sun_sign || bd.natal_sun_sign || 'Unknown',
      moonSign: ap.natal_moon_sign || bd.natal_moon_sign || 'Unknown',
      risingSign: ap.natal_ascendant_sign || bd.natal_ascendant_sign || 'Unknown'
    },
    natalContext: {
      birthData: {
        birthDate: bd.birth_date || null,
        birthTime: bd.birth_time || null,
        city: bd.birth_city || null
      },
      chartPlaced: !!nc.id
    },
    selectedSevenHypotheses,
    hypothesisConfidenceSummary: {
      averageConfidence: selectedSevenHypotheses.length > 0
        ? selectedSevenHypotheses.reduce((acc, h) => acc + h.confidence, 0) / selectedSevenHypotheses.length
        : 0
    },
    contradictionSummary: {
      totalContradictions: selectedSevenHypotheses.reduce((acc, h) => acc + h.evidence.contradictions, 0)
    },
    dailyContext: {
      recentPulseCount: dailyPulses.length,
      interpretationsLoaded: dailyInterpretations.length,
      averageTension: dailyPulses.length > 0
        ? dailyPulses.reduce((acc: number, p: any) => acc + (p.tension_level || 0), 0) / dailyPulses.length
        : 1.5
    },
    agentConversationContext: {
      sessionCount: agentConversations.length,
      latestInteraction: agentConversations[0]?.created_at || null
    },
    dataCompleteness,
    warnings
  };
}
