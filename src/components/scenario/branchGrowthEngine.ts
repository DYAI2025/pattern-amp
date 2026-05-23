/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PatternAxis3D, PatternForce, GrowthBranch } from './patternAmplifierTypes';
import { TendencyCategory } from '../../types';

// Deterministic mock pattern state that can be calibrated
export interface UserPatternState {
  natalWoodStrength: number;
  natalMetalStrength: number;
  transitPressure: number;
  quizDiscipline: number;
  agentHarmony: number;
  hypothesisSustained: number;
  skepticDamping: number;
}

export const DEFAULT_PATTERN_STATE: UserPatternState = {
  natalWoodStrength: 0.85,  // high wood
  natalMetalStrength: 0.30, // low metal
  transitPressure: 0.70,
  quizDiscipline: 0.60,
  agentHarmony: 0.75,
  hypothesisSustained: 0.80,
  skepticDamping: 0.40
};

// Growth force configuration for 6 primary directions
export function getSourceForcesForBranch(
  branchType: TendencyCategory,
  state: UserPatternState
): PatternForce[] {
  // Let's model forces based on the axes definitions:
  // X = Activation / Agency delta (forward action vs stabilization/retreat)
  // Y = Coherence / Tension delta (alignment vs conflict)
  // Z = Externalization / Internalization delta (world-facing vs depth/retreat)
  
  switch (branchType) {
    case 'activation': // Upward extension, very proactive, medium tension, high action, outward
      return [
        { source: 'natal', vector: { x: 1.2, y: 0.4, z: 1.0 }, weight: state.natalWoodStrength, confidence: 0.9, label: 'Jia Wood Growth Impulse' },
        { source: 'transit', vector: { x: 0.8, y: -0.2, z: 0.6 }, weight: state.transitPressure, confidence: 0.7, label: 'Transits Accelerator' },
        { source: 'quiz', vector: { x: 1.0, y: 0.2, z: 0.8 }, weight: state.quizDiscipline, confidence: 0.8, label: 'Active Quiz Motivation' },
        { source: 'agent_memory', vector: { x: 0.5, y: 0.3, z: 0.5 }, weight: state.agentHarmony, confidence: 0.9, label: 'Eve Optimistic Assessment' },
        { source: 'hypothesis', vector: { x: 0.7, y: 0.5, z: 0.4 }, weight: state.hypothesisSustained, confidence: 0.8, label: 'Core Extended Growth Hypothesis' },
        { source: 'skeptic', vector: { x: -0.4, y: -0.6, z: -0.2 }, weight: state.skepticDamping, confidence: 0.65, label: 'Skeptic Overextension warning' }
      ];

    case 'resonance': // Highly balanced, optimal alignment
      return [
        { source: 'natal', vector: { x: 0.8, y: 1.2, z: 0.6 }, weight: state.natalWoodStrength * 0.9, confidence: 0.95, label: 'Natal Sympathy Balance' },
        { source: 'transit', vector: { x: 0.4, y: 1.0, z: 0.4 }, weight: state.transitPressure * 0.8, confidence: 0.85, label: 'Harmonic Planetary Alignment' },
        { source: 'quiz', vector: { x: 0.6, y: 1.1, z: 0.5 }, weight: state.quizDiscipline * 0.9, confidence: 0.9, label: 'Centered Quiz State Indicator' },
        { source: 'agent_memory', vector: { x: 0.7, y: 0.9, z: 0.5 }, weight: state.agentHarmony, confidence: 0.9, label: 'Consensus Agent Flow Validation' },
        { source: 'hypothesis', vector: { x: 0.5, y: 1.0, z: 0.4 }, weight: state.hypothesisSustained, confidence: 0.85, label: 'Adaptive Structurer Confirmation' },
        { source: 'skeptic', vector: { x: -0.1, y: 0.1, z: -0.1 }, weight: state.skepticDamping * 0.5, confidence: 0.8, label: 'Skeptic Validation Guard' }
      ];

    case 'coherence': // Focus on stabilization and order, metal integration
      return [
        { source: 'natal', vector: { x: -0.8, y: 1.5, z: -0.8 }, weight: state.natalMetalStrength * 1.5, confidence: 0.9, label: 'Natal Metal Structuring Needs' },
        { source: 'transit', vector: { x: -0.5, y: 1.1, z: -0.5 }, weight: state.transitPressure, confidence: 0.8, label: 'Chronological Saturn Ordering' },
        { source: 'quiz', vector: { x: -0.6, y: 1.3, z: -0.7 }, weight: state.quizDiscipline, confidence: 0.9, label: 'Disciplined Boundary Quiz Score' },
        { source: 'agent_memory', vector: { x: -0.4, y: 1.0, z: -0.6 }, weight: state.agentHarmony, confidence: 0.85, label: 'Levi Structure Blueprint Guidelines' },
        { source: 'hypothesis', vector: { x: -0.3, y: 1.2, z: -0.5 }, weight: state.hypothesisSustained, confidence: 0.9, label: 'Scaffolding Synthesis Hypothesis' },
        { source: 'skeptic', vector: { x: 0.2, y: -0.2, z: 0.1 }, weight: state.skepticDamping, confidence: 0.9, label: 'Repetitive Routine Warnings' }
      ];

    case 'friction': // High conflict,Element clash
      return [
        { source: 'natal', vector: { x: 1.3, y: -1.3, z: 0.5 }, weight: state.natalWoodStrength, confidence: 0.85, label: 'Excess Wood Element Outflow' },
        { source: 'transit', vector: { x: 0.9, y: -1.1, z: 0.8 }, weight: state.transitPressure * 1.2, confidence: 0.8, label: 'Mars Metal Conflict aspect' },
        { source: 'quiz', vector: { x: 1.1, y: -1.2, z: 0.6 }, weight: Math.max(0.2, 1.0 - state.quizDiscipline), confidence: 0.75, label: 'Chaotic Work Environment Marker' },
        { source: 'agent_memory', vector: { x: 0.6, y: -0.8, z: 0.4 }, weight: state.agentHarmony * 0.8, confidence: 0.8, label: 'Agents Conflict Alerts' },
        { source: 'hypothesis', vector: { x: 0.8, y: -1.0, z: 0.5 }, weight: state.hypothesisSustained, confidence: 0.7, label: 'Compensator Loop Hypotheses' },
        { source: 'skeptic', vector: { x: -0.8, y: -0.5, z: -0.4 }, weight: state.skepticDamping * 1.5, confidence: 0.75, label: 'Skeptic Active Dissociation alert' }
      ];

    case 'withdrawal': // Retreat into depth, internal processing
      return [
        { source: 'natal', vector: { x: -1.4, y: 0.3, z: -1.5 }, weight: state.natalWoodStrength * 0.7, confidence: 0.9, label: 'Scorpio Moon Subconscious Needs' },
        { source: 'transit', vector: { x: -1.0, y: 0.1, z: -1.2 }, weight: state.transitPressure, confidence: 0.8, label: 'Cosmic Hermit Void transit' },
        { source: 'quiz', vector: { x: -1.2, y: 0.2, z: -1.4 }, weight: 0.9, confidence: 0.95, label: 'Low Interpersonal Battery Quiz Index' },
        { source: 'agent_memory', vector: { x: -0.8, y: 0.4, z: -1.0 }, weight: state.agentHarmony, confidence: 0.85, label: 'Eve Psycho-emotional Isolation observation' },
        { source: 'hypothesis', vector: { x: -0.9, y: 0.3, z: -1.1 }, weight: state.hypothesisSustained, confidence: 0.8, label: 'Defensive Hermit Hypothesis' },
        { source: 'skeptic', vector: { x: 0.5, y: -0.4, z: 0.5 }, weight: state.skepticDamping, confidence: 0.9, label: 'Skeptic Objective Discrepancy Guard' }
      ];

    case 'tension': // Contradictory pull, high friction and highly outwards
    default:
      return [
        { source: 'natal', vector: { x: 0.5, y: -1.5, z: 1.3 }, weight: state.natalWoodStrength, confidence: 0.8, label: 'Autonomy demands against Taurus' },
        { source: 'transit', vector: { x: 0.8, y: -1.2, z: 1.0 }, weight: state.transitPressure, confidence: 0.75, label: 'Stressful Horizon Scrubber values' },
        { source: 'quiz', vector: { x: 0.6, y: -1.4, z: 1.2 }, weight: 0.85, confidence: 0.8, label: 'Double-Bind Quiz contradictions' },
        { source: 'agent_memory', vector: { x: 0.4, y: -1.0, z: 0.9 }, weight: state.agentHarmony * 0.5, confidence: 0.7, label: 'Skeptic Agent Warning levels' },
        { source: 'hypothesis', vector: { x: 0.5, y: -1.1, z: 1.1 }, weight: state.hypothesisSustained, confidence: 0.85, label: 'Double-Bind Initiator Hypothesis' },
        { source: 'skeptic', vector: { x: -0.7, y: -0.8, z: -0.6 }, weight: state.skepticDamping * 1.8, confidence: 0.85, label: 'Skeptic Damping System limits' }
      ];
  }
}

// Compute dynamic 3D growth branch paths deterministically
export function generateGrowthBranches(
  state: UserPatternState = DEFAULT_PATTERN_STATE,
  steps: number = 18
): GrowthBranch[] {
  const branchTypes: { type: TendencyCategory; title: string; summary: string; baseConfidence: number; notToInfer: string[] }[] = [
    {
      type: 'resonance',
      title: 'Resonating Growth Spiral',
      summary: 'Wood development aligned with metal grounding coordinates.',
      baseConfidence: 0.90,
      notToInfer: [
        'Do not assume this harmonic pattern dictates permanent serenity.',
        'External disruption factors may easily trigger element imbalance.'
      ]
    },
    {
      type: 'friction',
      title: 'Impulsive Stress Trajectory',
      summary: 'Excessive wood expansion seeking progress without baseline scaffolds.',
      baseConfidence: 0.75,
      notToInfer: [
        'Friction metrics represent models of cognitive drag.',
        'This does not predict specific physical breakdowns or external professional collapse.'
      ]
    },
    {
      type: 'activation',
      title: 'Taurus Sun Career Outreach',
      summary: 'Proactive development of visible, structured career aspirations.',
      baseConfidence: 0.85,
      notToInfer: [
        'Action models project high agency.',
        'They are not a commercial prediction of financial prosperity or external deal signings.'
      ]
    },
    {
      type: 'coherence',
      title: 'Metal Alignment Foundation',
      summary: 'Deliberate search for rigid bounds to structure the inner flow.',
      baseConfidence: 0.82,
      notToInfer: [
        'Coherence measures system alignment, not personal sanity.',
        'This pattern does not guarantee absolute safety from internal biases.'
      ]
    },
    {
      type: 'withdrawal',
      title: 'Scorpio Moon Depth Retreat',
      summary: 'Subconscious retreat to psychological fortress to restore agency.',
      baseConfidence: 0.68,
      notToInfer: [
        'Retreat points indicate a natural deep recharge phase.',
        'This must not be equated with clinical depressive states or complete isolation.'
      ]
    },
    {
      type: 'tension',
      title: 'Counterfactual Double-Bind Fork',
      summary: 'Conflicting priorities between absolute freedom and absolute structure.',
      baseConfidence: 0.55,
      notToInfer: [
        'Tension models map divergent core forces.',
        'This is a visual archetype representing focus friction, not objective grid lock.'
      ]
    }
  ];

  const results: GrowthBranch[] = [];

  branchTypes.forEach((bConfig) => {
    const forcedSources = getSourceForcesForBranch(bConfig.type, state);
    
    // Sum weighted combined vectors
    // branchVector = natalForce * 0.30 + transitForce * 0.20 + quizForce * 0.20 + agentMemoryForce * 0.15 + hypothesisForce * 0.10 - skepticDamping * 0.05
    let dx = 0;
    let dy = 0;
    let dz = 0;
    let confidenceSum = 0;
    let confidenceCount = 0;

    forcedSources.forEach((force) => {
      let multiplier = 0;
      if (force.source === 'natal') multiplier = 0.30;
      else if (force.source === 'transit') multiplier = 0.20;
      else if (force.source === 'quiz') multiplier = 0.20;
      else if (force.source === 'agent_memory') multiplier = 0.15;
      else if (force.source === 'hypothesis') multiplier = 0.10;
      else if (force.source === 'skeptic') multiplier = -0.05;

      const scale = force.weight * multiplier;
      dx += force.vector.x * scale;
      dy += force.vector.y * scale;
      dz += force.vector.z * scale;

      confidenceSum += force.confidence;
      confidenceCount++;
    });

    const averageConfidence = confidenceCount > 0 ? (confidenceSum / confidenceCount) : bConfig.baseConfidence;
    const finalConfidence = (averageConfidence + bConfig.baseConfidence) / 2;

    // Apply incremental progress math 
    const path: PatternAxis3D[] = [{ x: 0, y: 0, z: 0 }];
    const branchWeight = Math.round(Math.max(2, 4 + dx * 2));
    
    // Core deviations 
    const coherenceDelta = Number(Math.max(0.1, 3.5 + dy * 1.5).toFixed(1));
    const tensionDelta = Number(Math.max(0.1, 3.0 - dy * 1.5 + dz * 0.5).toFixed(1));

    // Glyph collection reflecting active elements
    const glyphs = ['☉', '✓', '⌇', '💬', '⚝'];

    // Generate path points with dynamic exponential curve or spiral effect
    for (let s = 1; s <= steps; s++) {
      const progress = s / steps;
      
      // Introduce an elegant dynamic curving behavior to make visual stunning
      // Adding slightly non-linear growth so paths fan out in 3D
      const arcFactor = Math.sin(progress * Math.PI * 0.6);
      
      // Primary combined vector trajectory
      let x = dx * s * 12 * arcFactor;
      let y = dy * s * 14 * progress;
      let z = dz * s * 10 * progress;

      // Add a small tendency-specific helical wave pattern along paths for 3D realism
      if (bConfig.type === 'friction' || bConfig.type === 'tension') {
        x += Math.sin(s * 1.5) * 4;
        y += Math.cos(s * 1.5) * 3;
      } else {
        x += Math.cos(s * 0.8) * 2;
        z += Math.sin(s * 0.8) * 2;
      }

      path.push({
        x: Math.round(x),
        y: Math.round(y),
        z: Math.round(z)
      });
    }

    // Create primary branch
    const primaryBranchId = `amp-${bConfig.type}`;
    const primaryBranch: GrowthBranch = {
      id: primaryBranchId,
      title: bConfig.type === 'resonance' ? 'Resonating Wood Pipeline' : bConfig.title,
      summary: bConfig.summary,
      tendencyType: bConfig.type,
      path,
      sourceWeights: {
        natal: Math.round(20 + 30 * state.natalWoodStrength),
        transit: Math.round(15 + 15 * state.transitPressure),
        quiz: Math.round(10 + 20 * state.quizDiscipline),
        agent_memory: Math.round(5 + 20 * state.agentHarmony),
        hypotheses: Math.round(5 + 15 * state.hypothesisSustained),
        skeptic: Math.round(10 * state.skepticDamping)
      },
      confidence: Number(finalConfidence.toFixed(2)),
      branchWeight,
      coherenceDelta,
      tensionDelta,
      glyphs,
      notToInfer: bConfig.notToInfer
    };

    results.push(primaryBranch);

    // Create SECONDARY SPLIT FORKS if criteria are met!
    // Settle split triggers:
    // - Competing source vectors diverge significantly (e.g. friction or tension is highly present)
    // - Coherence and tension are both elevated (e.g. > 2.0)
    // - Skeptic damping is highly activated
    const hasDivergement = bConfig.type === 'tension' || bConfig.type === 'friction' || (coherenceDelta > 2.2 && tensionDelta > 2.2);

    if (hasDivergement) {
      const splitPath: PatternAxis3D[] = [];
      const splitIndex = Math.floor(steps * 0.5); // split at midpoint
      
      // Clone path up to split point
      for (let s = 0; s <= splitIndex; s++) {
        splitPath.push({ ...path[s] });
      }

      // Fan out in a counterfactual alternative direction!
      for (let s = splitIndex + 1; s <= steps; s++) {
        const progress = s / steps;
        const parentPt = path[s];
        
        // Counterfactual divergence: deflect X and Z in opposite polarities!
        const thetaDeviation = bConfig.type === 'friction' ? -1.8 : 1.8;
        const alternativeX = parentPt.x + (thetaDeviation * (s - splitIndex) * 5);
        const alternativeY = parentPt.y + (s - splitIndex) * 2; // grow slightly upward
        const alternativeZ = parentPt.z - (thetaDeviation * (s - splitIndex) * 6); // pull back in intensity

        splitPath.push({
          x: Math.round(alternativeX),
          y: Math.round(alternativeY),
          z: Math.round(alternativeZ)
        });
      }

      const secondaryBranch: GrowthBranch = {
        id: `${primaryBranchId}-split`,
        parentId: primaryBranchId,
        title: `Speculative ${bConfig.type === 'tension' ? 'Autonomy' : 'Friction'} Fork`,
        summary: `Simulated divergence triggered by heightened epistemic friction.`,
        tendencyType: bConfig.type === 'tension' ? 'coherence' : 'friction',
        path: splitPath,
        sourceWeights: {
          natal: Math.round(primaryBranch.sourceWeights.natal * 0.8),
          transit: Math.round(primaryBranch.sourceWeights.transit * 1.2), // elevated transit volatility
          quiz: Math.round(primaryBranch.sourceWeights.quiz * 0.7),
          agent_memory: Math.round(primaryBranch.sourceWeights.agent_memory * 1.5), // triggered by skeptic warnings
          hypotheses: Math.round(primaryBranch.sourceWeights.hypotheses * 0.9),
          skeptic: Math.round(primaryBranch.sourceWeights.skeptic ? primaryBranch.sourceWeights.skeptic * 2.0 : 20)
        },
        confidence: Number((finalConfidence * 0.75).toFixed(2)), // lower confidence for counterfactual splits
        branchWeight: Math.max(2, branchWeight - 2),
        coherenceDelta: Number(Math.max(0.1, coherenceDelta - 1.2).toFixed(1)),
        tensionDelta: Number(Math.max(1.0, tensionDelta + 1.5).toFixed(1)), // spikes friction
        glyphs: ['⚝', '💬', '✓'],
        notToInfer: [
          'Counterfactual splits represent simulated mathematical options only.',
          'They do not indicate split personalities or permanent psychological fracturing.'
        ]
      };

      results.push(secondaryBranch);
    }
  });

  return results;
}
