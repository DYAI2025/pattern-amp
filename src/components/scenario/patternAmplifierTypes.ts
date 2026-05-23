/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TendencyCategory } from '../../types';

export type PatternAxis3D = {
  x: number;
  y: number;
  z: number;
};

export type PatternForce = {
  source: 'natal' | 'transit' | 'quiz' | 'agent_memory' | 'hypothesis' | 'skeptic';
  vector: PatternAxis3D;
  weight: number;
  confidence: number;
  label: string;
};

export type GrowthBranch = {
  id: string;
  parentId?: string;
  title: string;
  summary: string;
  tendencyType: TendencyCategory;
  path: PatternAxis3D[];
  sourceWeights: {
    natal: number;
    transit: number;
    quiz: number;
    agent_memory: number;
    hypotheses: number;
    skeptic?: number;
  };
  confidence: number;
  branchWeight: number;
  coherenceDelta: number;
  tensionDelta: number;
  glyphs: string[];
  notToInfer: string[];
  isDashed?: boolean;
};
