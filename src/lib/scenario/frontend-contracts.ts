/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Frontend API Contracts for V1 Pattern Amp (hypotheses_only mode).
 */

export type ScenarioModeV1 = 
  | 'current_pattern_field' 
  | 'pattern_under_pressure' 
  | 'coherence_path' 
  | 'tension_path' 
  | 'open_user_question';

export interface HypothesisPatternStateV1 {
  activeUserId: string;
  generatedAt: string;
  mode: 'hypotheses_only';
  profileSummary: Record<string, any>;
  astroContext: Record<string, any>;
  natalContext: Record<string, any>;
  selectedSevenHypotheses: any[]; // Define deeper structure as needed
  dailyContext: Record<string, any>;
  agentConversationContext: Record<string, any>;
  dataCompleteness: number; // 0-1
  warnings: string[];
}

export interface ScenarioBranchV1 {
  id: string;
  title: string;
  summary: string;
  tendencyType: string;
  confidence: number;
  sourceWeights: {
    hypotheses: number;
    natal?: number;
    daily?: number;
    agentMemory?: number;
    miroshark?: number;
    quiz?: number; // MUST BE 0 or undef in V1
  };
  relatedHypothesisIds: string[];
  coherenceDelta: number;
  tensionDelta: number;
  notToInfer: string[];
  visualState: Record<string, any>;
  epistemicLabels: ('calculated' | 'observed' | 'inferred' | 'simulated' | 'uncertain')[];
}

export type ScenarioRunStatusV1 = 
  | 'idle'
  | 'loading_source'
  | 'source_loaded'
  | 'source_error_partial'
  | 'no_hypotheses'
  | 'building_seed'
  | 'seed_ready'
  | 'running_scenario'
  | 'polling_status'
  | 'normalizing_results'
  | 'completed'
  | 'failed';
