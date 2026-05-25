/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScenarioBranch, SourceContribution } from '../../types';

export type ScenarioRunStage =
  | 'idle'
  | 'loading_user'
  | 'building_pattern_state'
  | 'building_seed'
  | 'miroshark_ontology'
  | 'miroshark_graph'
  | 'miroshark_prepare'
  | 'miroshark_running'
  | 'normalizing_results'
  | 'persisting_results'
  | 'completed'
  | 'failed';

export type BackendMode = 'orchestrator' | 'local_miroshark' | 'dev_mock' | 'unconfigured';

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface PatternIntersection {
  id: string;
  branch_ids: string[];
  point_3d: Vector3D;
  distance: number;
  kind: 'friction' | 'harmony' | 'neutral';
  coherence_delta: number;
  tension_delta: number;
  description: string;
  source_support: string;
  confidence: number;
}

export interface ScenarioDataSourceStatus {
  tableName: string;
  queryColumn: string;
  rowCount: number;
  status: 'success' | 'empty' | 'missing' | 'permission_error' | 'disabled';
  error?: string;
}

export interface ScenarioRunTrace {
  runId: string;
  backendMode: BackendMode;
  stagesPassed: ScenarioRunStage[];
  supabase_table_status: Record<string, ScenarioDataSourceStatus>;
  warnings: string[];
}

export interface ScenarioRunRequest {
  activeUserId: string;
  mode: string;
  horizon: string;
  question?: string;
}

export interface ScenarioRunResponse {
  runId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface ScenarioRunStatus {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  logs: string[];
  stage?: ScenarioRunStage;
  error?: string;
}

export interface MiroSharkTrace {
  project_id: string;
  graph_task_id: string;
  simulation_id: string;
  run_id: string;
  api_status: string;
}

export interface ScenarioProvenance {
  user_id: string;
  pattern_state_id: string;
  seed_document_id: string;
  scenario_run_id: string;
  miroshark_trace: MiroSharkTrace;
  status_stage: ScenarioRunStage;
  persisted_branches_count: number;
  normalizer_warnings: string[];
  is_mock_run: boolean;
}

export interface ServerScenarioBranch {
  id: string;
  run_id?: string;
  title: string;
  summary: string;
  tendency_type: string;
  probability_like_weight: number;
  confidence: number;
  coherence_delta: number;
  tension_delta: number;
  source_weights: SourceContribution[];
  natal_influences?: any;
  bazi_influences?: any;
  fusion_influences?: any;
  quiz_patterns?: any;
  related_hypotheses: string[];
  agent_votes?: any;
  not_to_infer: string;
  visual_state: {
    deviation: number;
    horizonRelevance: number;
    isDashed: boolean;
  };
  reflective_question?: string;
  why_appears?: string;
  what_resonates?: string;
  where_friction?: string;
  increase_coherence?: string;
  vector_path_3d?: Vector3D[];
  parent_id?: string | null;
  depth?: number;
  split_reason?: string;
  children?: ServerScenarioBranch[];
}

export interface ScenarioResultsResponse {
  branches: ServerScenarioBranch[];
  intersections?: PatternIntersection[];
  patternState: {
    activeUserId: string;
    elements: {
      wood: number;
      metal: number;
      fire: number;
      water: number;
      earth: number;
    };
    moonScorpioIntensity: number;
    alignmentIndex: number;
    lastCalculated: string;
    provenanceId: string;
  };
}

export interface ScenarioSeedResponse {
  seed_markdown: string;
  seed_json: any;
  used_supabase_tables: string[];
  missing_data_warnings: string[];
  miro_shark_run_id: string;
  not_to_infer_rules: string[];
}
