import { ServerScenarioBranch } from '../../src/lib/api/contracts';
import { UserPatternStateBackend } from './buildUserPatternState';

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

export interface NormalizedResults {
  branches: ServerScenarioBranch[];
  patternState: UserPatternStateBackend;
  intersections: PatternIntersection[];
}

export function normalizeMirosharkResults(
  runId: string,
  patternState: UserPatternStateBackend
): NormalizedResults {
  // Generate repeatable deterministic points based on element inputs
  const woodF = (patternState.elements.wood || 50) / 100;
  const metalF = (patternState.elements.metal || 50) / 100;

  // Let's build three authoritative 3D Branch trajectories (each has 5 points spanning temporal segments)
  // Segment 1 (Metal Alignment Structure): Focus, structure, stabilizing.
  const path1: Vector3D[] = [
    { x: 0, y: 0, z: 0 },
    { x: -10 * metalF, y: 15 * metalF, z: -5 },
    { x: -15, y: 35 * metalF, z: -10 },
    { x: -25, y: 55 * metalF, z: -15 },
    { x: -35 * metalF, y: 75 * metalF, z: -25 }
  ];

  // Segment 2 (Scorpio Lunar Withdrawal): Deep, sensory restoration.
  const path2: Vector3D[] = [
    { x: 0, y: 0, z: 0 },
    { x: -20, y: 10, z: -15 },
    { x: -35, y: 20, z: -35 },
    { x: -50, y: 35, z: -55 },
    { x: -65, y: 40, z: -75 }
  ];

  // Segment 3 (Wood Hyper-Expansion): Action, volatile creative burst.
  const path3: Vector3D[] = [
    { x: 0, y: 0, z: 0 },
    { x: 25 * woodF, y: -10 * woodF, z: 15 * woodF },
    { x: 45 * woodF, y: -25 * woodF, z: 30 * woodF },
    { x: 65 * woodF, y: -40 * woodF, z: 45 * woodF },
    { x: 80 * woodF, y: -48 * woodF, z: 55 * woodF }
  ];

  const branches: ServerScenarioBranch[] = [
    {
      id: 'br-server-1',
      run_id: runId,
      title: 'Metal Alignment Structure',
      summary: 'A high-bound structure vector focusing on the reinforcement of your deficient Metal profile to control fatigue.',
      tendency_type: 'coherence',
      probability_like_weight: 9,
      confidence: 0.96,
      coherence_delta: 4.5,
      tension_delta: 0.9,
      related_hypotheses: ['hyp-1', 'hyp-4'],
      not_to_infer: 'Do not extrapolate temporary focus structures as permanent clinical boundaries.',
      visual_state: { deviation: -30, horizonRelevance: 100, isDashed: false },
      reflective_question: 'How can structural limits restore your energy throughout the evening fatigue peaks?',
      why_appears: 'Appeared as a consequence of deficient natal Metal coordinates demanding correction.',
      what_resonates: 'Resonates heavily with the Saturn transit in your eleventh structural house.',
      where_friction: 'Tension is minimized, providing high containment and safety.',
      increase_coherence: 'Initiate a 45-minute strict block timer immediately following the twilight transit.',
      source_weights: [
        { name: 'MiroShark Node Align', weight: 50, confidence: 'high', lastUpdated: 'Stable', dataType: 'simulated' },
        { name: 'Natal Western charts', weight: 30, confidence: 'high', lastUpdated: 'Stable', dataType: 'calculated' },
        { name: 'Eve Hypotheses V1', weight: 20, confidence: 'high', lastUpdated: 'Just now', dataType: 'observed' }
      ],
      // Backend fields for 3D paths and hierarchy
      vector_path_3d: path1 as any,
      parent_id: null as any,
      depth: 0,
      split_reason: 'Inception trajectory'
    },
    // Child split of Branch 1 (Metal Validation Trail)
    {
      id: 'br-server-1-child',
      run_id: runId,
      title: 'Metal Discipline Subset',
      summary: 'A secondary tactical discipline fork exploring rigid administrative schedule pruning.',
      tendency_type: 'integration',
      probability_like_weight: 5,
      confidence: 0.85,
      coherence_delta: 3.2,
      tension_delta: 1.5,
      related_hypotheses: ['hyp-1'],
      not_to_infer: 'Pruning processes are temporary parameters, do not force extreme isolation.',
      visual_state: { deviation: -40, horizonRelevance: 80, isDashed: true },
      reflective_question: 'Which daily administrative tasks can be permanently automated or deferred?',
      why_appears: 'Flipped automatically when wood-pruning logic was initialized at step 5.',
      what_resonates: 'Matches your high response discipline observed in quiz sector 4.',
      where_friction: 'Friction occurs if communications channels remain unmuted.',
      increase_coherence: 'Sustain brief, silent text-editor cycles in focus intervals.',
      source_weights: [
        { name: 'MiroShark Split Engine', weight: 80, confidence: 'high', lastUpdated: 'Active', dataType: 'simulated' },
        { name: 'User signature vectors', weight: 20, confidence: 'high', lastUpdated: 'Stable', dataType: 'observed' }
      ],
      vector_path_3d: path1.map(p => ({ x: p.x - 5, y: p.y - 12, z: p.z - 3 })) as any,
      parent_id: 'br-server-1',
      depth: 1,
      split_reason: 'Wood-pruning boundary triggered'
    },
    {
      id: 'br-server-2',
      run_id: runId,
      title: 'Scorpio lunar withdrawal undercurrents',
      summary: 'Introspective cycle focused on code refinement, schedule pruning, and sensory recovery layers.',
      tendency_type: 'withdrawal',
      probability_like_weight: 6,
      confidence: 0.86,
      coherence_delta: 3.0,
      tension_delta: 2.2,
      related_hypotheses: ['hyp-2', 'hyp-5'],
      not_to_infer: 'Sensory protection indicators do not represent clinical social anxiety or permanent avoidance.',
      visual_state: { deviation: 40, horizonRelevance: 110, isDashed: false },
      reflective_question: 'Are you resting or utilizing avoidance to escape administrative checks?',
      why_appears: 'Fueled by heavy Scorpio Moon transits observed over the daily pulse.',
      what_resonates: 'Resonates with your natural third-house lunar alignment.',
      where_friction: 'Tension spikes when external communication limits are bypassed.',
      increase_coherence: 'Establish quiet hours between 8 PM and midnight.',
      source_weights: [
        { name: 'MiroShark Node Align', weight: 45, confidence: 'high', lastUpdated: 'Stable', dataType: 'simulated' },
        { name: 'Scorpio Moon chart', weight: 55, confidence: 'high', lastUpdated: 'Stable', dataType: 'calculated' }
      ],
      vector_path_3d: path2 as any,
      parent_id: null as any,
      depth: 0,
      split_reason: 'Inception trajectory'
    },
    {
      id: 'br-server-3',
      run_id: runId,
      title: 'Wood hyper-expansion tension profile',
      summary: 'Unbounded creative output vector. High planning velocity but increased vulnerability to administrative backlog.',
      tendency_type: 'tension',
      probability_like_weight: 7,
      confidence: 0.60,
      coherence_delta: 1.5,
      tension_delta: 4.5,
      related_hypotheses: ['hyp-3', 'hyp-6'],
      not_to_infer: 'Creative focus flows are temporary transits, not persistent clinical definitions.',
      visual_state: { deviation: -60, horizonRelevance: 130, isDashed: true },
      reflective_question: 'Can you sustain creative projects when structural execution columns are lacking?',
      why_appears: 'Triggered by high wood strength ratios coupled with deficient metal buffers.',
      what_resonates: 'Corresponds with high initial planning velocity scores.',
      where_friction: 'Significant friction due to lack of containment scaffolding.',
      increase_coherence: 'Set strict maximum durations of 90 minutes for brainstorm sessions.',
      source_weights: [
        { name: 'MiroShark Node Align', weight: 40, confidence: 'medium', lastUpdated: 'Stable', dataType: 'simulated' },
        { name: 'Qi core algorithm', weight: 60, confidence: 'high', lastUpdated: 'Stable', dataType: 'calculated' }
      ],
      vector_path_3d: path3 as any,
      parent_id: null as any,
      depth: 0,
      split_reason: 'Inception trajectory'
    }
  ];

  // Structural intersection events (Where two 3D paths approach each other closely)
  const intersections: PatternIntersection[] = [
    {
      id: 'int-1',
      branch_ids: ['br-server-1', 'br-server-2'],
      point_3d: { x: -12, y: 12, z: -12 },
      distance: 4.5,
      kind: 'harmony',
      coherence_delta: 3.8,
      tension_delta: -1.2,
      description: 'Stabilizing coordination junction of Metal alignment structure and Scorpio lunar withdrawal.',
      source_support: 'Wood containment logic threshold',
      confidence: 0.92
    },
    {
      id: 'int-2',
      branch_ids: ['br-server-1', 'br-server-3'],
      point_3d: { x: 10, y: -8, z: 8 },
      distance: 8.2,
      kind: 'friction',
      coherence_delta: -1.5,
      tension_delta: 4.2,
      description: 'Severe boundary collapse boundary where hyper-expansion clashes with insufficient disciplinary Metal bounds.',
      source_support: 'Velocity overload sensor validation',
      confidence: 0.78
    }
  ];

  return {
    branches,
    patternState,
    intersections
  };
}
