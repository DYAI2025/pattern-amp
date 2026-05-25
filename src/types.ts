/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TendencyCategory =
  | 'resonance'
  | 'friction'
  | 'activation'
  | 'withdrawal'
  | 'coherence'
  | 'tension'
  | 'integration';

export type SourceType =
  | 'calculated'
  | 'observed'
  | 'inferred'
  | 'simulated';

export interface SourceContribution {
  name: string;
  weight: number; // percentage (0-100)
  confidence: 'high' | 'medium' | 'low';
  lastUpdated: string;
  dataType: SourceType;
}

export interface ScenarioBranch {
  id: string;
  title: string;
  summary: string;
  tendencyType: TendencyCategory;
  probabilityWeight: number; // branch thickness (1-10)
  confidence: number; // opacity (0-1)
  horizonRelevance: number; // path length relative (50-150)
  deviation: number; // curvature amplitude (-80 to 80)
  coherenceDelta: number; // positive = glow strength (0-5)
  tensionDelta: number; // positive = red edge aura vibration (0-5)
  isDashed: boolean; // low evidence speculative branch
  notToInfer: string;
  reflectiveQuestion: string;
  whyAppears: string;
  whatResonates: string;
  whereFriction: string;
  increaseCoherence: string;
  sources: SourceContribution[];
  relatedHypothesesIds: string[];
  vectorPath3D?: { x: number; y: number; z: number }[];
  parentId?: string | null;
  depth?: number;
  splitReason?: string;
}

export type HypothesisStatus = 'active' | 'emerging' | 'weak' | 'contradicted';

export interface Hypothesis {
  id: string;
  title: string;
  statement: string;
  confidence: number; // 0-100
  activation: number; // 0-100
  status: HypothesisStatus;
  evidence: string;
  counterEvidence: string;
  sourceMix: string;
  relatedScenarioBranches: string[];
  lastUpdated: string;
}

export type AgentStance = 'supports' | 'cautions' | 'reframes' | 'contradicts';

export interface AgentReflection {
  id: string;
  agentName: string;
  role: string;
  observation: string;
  caution: string;
  reflectiveQuestion: string;
  confidence: number; // 0-100
  stance: AgentStance;
}

export interface NatalInfluence {
  id: string;
  symbol: string;
  label: string;
  category: 'Western' | 'BaZi' | 'Wu-Xing' | 'Soulprint';
  strength: 'high' | 'medium' | 'low';
  explanation: string;
}

export interface AgentObservation {
  id: string;
  sourceAgent: string;
  snippet: string;
  tag: string;
  confidence: number; // 0-100
  freshness: string; // e.g., "2 hours ago", "3 days ago"
}

export interface PatternDrift {
  id: string;
  patternName: string;
  direction: 'strengthened' | 'weakened' | 'contradiction_detected';
  description: string;
}

export interface PatternMemory {
  quizSectors: { sector: string; value: number }[]; // 12 sectors
  traitAxes: {
    label: string;
    value: number; // -100 to 100 or 0 to 100
    leftLabel: string;
    rightLabel: string;
  }[];
  activationStyle: string;
  avoidanceStyle: string;
  stressResponse: string;
  confidenceByDimension: { dimension: string; confidence: number }[];
  agentObservations: AgentObservation[];
  patternDrifts: PatternDrift[];
}

export type HorizonType = 'now' | '7d' | '30d' | '90d';

export type ScenarioMode =
  | 'field'
  | 'move'
  | 'pressure'
  | 'coherence'
  | 'tension'
  | 'question';
