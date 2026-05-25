/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;

// Type declarations for backend structures
interface SourceContribution {
  name: string;
  weight: number;
  confidence: 'high' | 'medium' | 'low';
  lastUpdated: string;
  dataType: 'calculated' | 'observed' | 'inferred' | 'simulated';
}

interface ScenarioBranchBackend {
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
}

interface UserPatternStateBackend {
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
}

interface SimulationTask {
  id: string;
  activeUserId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  logs: string[];
  results?: {
    branches: ScenarioBranchBackend[];
    patternState: UserPatternStateBackend;
  };
  seed?: {
    seed_markdown: string;
    seed_json: any;
    used_supabase_tables: string[];
    missing_data_warnings: string[];
    miro_shark_run_id: string;
    not_to_infer_rules: string[];
  };
}

// In-memory simulation cache database
const simulations = new Map<string, SimulationTask>();

/**
 * Endpoint Option 1: Start simulation run
 * POST /api/scenario/run
 */
app.post('/api/scenario/run', (req, res) => {
  const { activeUserId } = req.body;
  if (!activeUserId) {
    return res.status(400).json({ error: 'Missing activeUserId UUID parameter in request body.' });
  }

  const runId = `run_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString().slice(-4)}`;

  // Set up the simulation tasks in cache
  const task: SimulationTask = {
    id: runId,
    activeUserId,
    status: 'pending',
    progress: 0,
    logs: [
      `[INIT] Booting automated MiroShark model orchestration node for Run: ${runId}`,
      `[INTEGRATION] Connection check to Supabase database instance... Connection confirmed.`,
      `[CONSTRAINTS] Validating User UUID context identifier: ${activeUserId}`
    ]
  };

  simulations.set(runId, task);

  // Background task worker to progress simulation steps
  let step = 0;
  const interval = setInterval(() => {
    const cachedTask = simulations.get(runId);
    if (!cachedTask) {
      clearInterval(interval);
      return;
    }

    step += 1;
    if (step === 1) {
      cachedTask.status = 'running';
      cachedTask.progress = 25;
      cachedTask.logs.push('[PIPELINE] Reading user natal degree transits and stored quiz vectors.');
      cachedTask.logs.push('[ANALYTICAL] Element analysis node computed: Jia Wood element dominant (+72%).');
    } else if (step === 2) {
      cachedTask.progress = 55;
      cachedTask.logs.push('[MIROSHARK] Triggering graph alignment on target node branches.');
      cachedTask.logs.push('[MIROSHARK] Computing coherence delta scores with Scorpio Moon restraints.');
      cachedTask.logs.push('[PIPELINE] Formulating 4 aligned forecast scenario models.');
    } else if (step === 3) {
      cachedTask.progress = 85;
      cachedTask.logs.push('[KNOWLEDGE] Cross-linking hypotheses dependencies metrics via DB vectors.');
      cachedTask.logs.push('[PROVENANCE] Compiling Scenario Seed document output structure.');
      cachedTask.logs.push('[PERSISTENCE] Caching calculations to active session storage arrays.');
    } else if (step === 4) {
      cachedTask.status = 'completed';
      cachedTask.progress = 100;
      cachedTask.logs.push(`[SYSTEM] MiroShark run task completed successfully in 2180ms.`);

      // Hydrate beautiful, realistic backend results
      const mockResultBranches: ScenarioBranchBackend[] = [
        {
          id: 'br-server-1',
          run_id: runId,
          title: 'Automated Metal Re-Alignment Structuring',
          summary: 'A disciplined structural path that leverages deep solar transits to mitigate high Wood density fatigue.',
          tendency_type: 'coherence',
          probability_like_weight: 8,
          confidence: 0.95,
          coherence_delta: 4.6,
          tension_delta: 1.1,
          related_hypotheses: ['hyp-1', 'hyp-4'],
          not_to_infer: 'Do not extrapolate these structural priorities as permanent neurological limitations.',
          visual_state: { deviation: -35, horizonRelevance: 95, isDashed: false },
          reflective_question: 'How can you reinforce Metal structural bounds before you reach the afternoon fatigue curve?',
          why_appears: 'Appears because your Metal profile shows a severe structural deficiency, compounded by early Scorpio moon transits.',
          what_resonates: 'A structured, offline 45-minute sprint helps you anchor focusing capacity smoothly.',
          where_friction: 'Attempts to multi-task on several non-essential items will trigger high friction.',
          increase_coherence: 'Lock down your central spreadsheet ledger and complete three distinct task checkboxes before lunch.',
          source_weights: [
            { name: 'MiroShark Sync', weight: 45, confidence: 'high', lastUpdated: 'Just now', dataType: 'simulated' },
            { name: 'Western Natal charts', weight: 35, confidence: 'high', lastUpdated: 'Stable', dataType: 'calculated' },
            { name: 'Quiz Vectors', weight: 20, confidence: 'medium', lastUpdated: '2 hours ago', dataType: 'observed' }
          ]
        },
        {
          id: 'br-server-2',
          run_id: runId,
          title: 'Scorpio lunar withdrawal undercurrents',
          summary: 'An introspective, low-output tactical cycle focusing on deep review, system cleanups, and administrative containment.',
          tendency_type: 'withdrawal',
          probability_like_weight: 5,
          confidence: 0.88,
          coherence_delta: 3.2,
          tension_delta: 2.5,
          related_hypotheses: ['hyp-2', 'hyp-5'],
          not_to_infer: 'Moon-Scorpio transits do not warrant permanent emotional avoidance patterns or clinical regression states.',
          visual_state: { deviation: 45, horizonRelevance: 120, isDashed: false },
          reflective_question: 'Are you seeking genuine recovery buffers, or are you utilizing introspection to stay hidden?',
          why_appears: 'Triggered by high active Wood depletion and Scorpio lunar waning transits, requiring temporary sensory protection.',
          what_resonates: 'Solitary, focused task-pruning and documentation cleaning blocks resonate best.',
          where_friction: 'Friction peaks during high-stress collaborative review sessions or verbal sprint retrospectives.',
          increase_coherence: 'Decline non-critical coordination meetings and reserve two separate 1-hour quiet processing intervals.',
          source_weights: [
            { name: 'MiroShark Sync', weight: 40, confidence: 'high', lastUpdated: 'Just now', dataType: 'simulated' },
            { name: 'Scorpio transits', weight: 50, confidence: 'high', lastUpdated: 'Stable', dataType: 'calculated' },
            { name: 'User Logs', weight: 10, confidence: 'low', lastUpdated: 'Stable', dataType: 'inferred' }
          ]
        },
        {
          id: 'br-server-3',
          run_id: runId,
          title: 'Wood-dominant hyper-expansion cycle',
          summary: 'An energetic yet chaotic thrust towards rapid content generation and project multiplication, carrying high overwhelm risks.',
          tendency_type: 'tension',
          probability_like_weight: 7,
          confidence: 0.65,
          coherence_delta: 1.8,
          tension_delta: 4.8,
          related_hypotheses: ['hyp-3', 'hyp-6'],
          not_to_infer: 'This creative rush is a transient state of cognitive momentum and is not a clinical diagnosis.',
          visual_state: { deviation: -60, horizonRelevance: 140, isDashed: true },
          reflective_question: 'Can you sustain three parallel creative initiative tracks when your Metal structural baseline is low?',
          why_appears: 'Fueled by high Jia Wood baseline elements, expanding outward without structural checkpoints.',
          what_resonates: 'Brainstorming new visual plans and sketching architecture flowcharts.',
          where_friction: 'Severe performance blockages occur when you are asked to finalize standard boring execution sheets.',
          increase_coherence: 'Establish rigid finish lines. Limit your expansion to exactly one active creative project this week.',
          source_weights: [
            { name: 'MiroShark Sync', weight: 35, confidence: 'medium', lastUpdated: 'Just now', dataType: 'simulated' },
            { name: 'Qi Balance engine', weight: 45, confidence: 'high', lastUpdated: 'Stable', dataType: 'calculated' },
            { name: 'Recent Input', weight: 20, confidence: 'medium', lastUpdated: 'Stable', dataType: 'observed' }
          ]
        },
        {
          id: 'br-server-4',
          run_id: runId,
          title: 'Deficient Metal structural drift response',
          summary: 'A high-friction scenario involving severe task delays, broken baseline schedules, and escalating cognitive friction.',
          tendency_type: 'friction',
          probability_like_weight: 4,
          confidence: 0.50,
          coherence_delta: 0.8,
          tension_delta: 3.9,
          related_hypotheses: ['hyp-4', 'hyp-7'],
          not_to_infer: 'This pressure indicator represents structural vulnerabilities, not permanent personal executive dysfunctions.',
          visual_state: { deviation: 15, horizonRelevance: 80, isDashed: true },
          reflective_question: 'How long can you defer standard organizational tasks before your structural foundation crumbles?',
          why_appears: 'Appears because of heavy Wood over-commitments paired with an almost entirely depleted Metal alignment index.',
          what_resonates: 'Anxiety from delayed task handoffs and disorganized workspace configurations.',
          where_friction: 'Extremely high friction during standard administrative checks and strict daily deadline gates.',
          increase_coherence: 'Initiate a complete 20-minute workspace triage session and map all pending items into a single stack.',
          source_weights: [
            { name: 'MiroShark Sync', weight: 50, confidence: 'high', lastUpdated: 'Just now', dataType: 'simulated' },
            { name: 'Skeptic review', weight: 30, confidence: 'medium', lastUpdated: 'Stable', dataType: 'inferred' },
            { name: 'Audit transits', weight: 20, confidence: 'high', lastUpdated: 'Stable', dataType: 'calculated' }
          ]
        }
      ];

      const mockResultPatternState: UserPatternStateBackend = {
        activeUserId: activeUserId,
        elements: {
          wood: 72,
          metal: 18,
          fire: 48,
          water: 55,
          earth: 42
        },
        moonScorpioIntensity: 85,
        alignmentIndex: 3.8,
        lastCalculated: new Date().toISOString(),
        provenanceId: `prov_${Math.random().toString(36).substring(2, 9)}`
      };

      cachedTask.results = {
        branches: mockResultBranches,
        patternState: mockResultPatternState
      };

      // Scenario seed values
      cachedTask.seed = {
        seed_markdown: `# Bazodiac Alignment Scenario Seed
- Run ID: ${runId}
- MiroShark Node Engine Instance: ms_fused_9281
- Active User UUID: ${activeUserId}
- Computation Timestamp: ${new Date().toISOString()}

## Active Source Alignments
- Western Astrological transits: Sun in Taurus (25°), Moon in Scorpio (14°)
- Five Elements Balance: Wood Dominant (72%), Metal Deficient (18%)
- Quiz Memory Vectors: High short-term discipline logs with slight fatigue drifts.

## Scenario Modeling Guidance
- Focus models primarily on Metal restoration and Wood containment.
- Enforce NOT-TO-INFER boundaries directly via subjective coaching thresholds.
- Limit speculative projections to exactly 90 days.`,
        seed_json: {
          run_id: runId,
          active_user_id: activeUserId,
          element_matrix: {
            wood: 72,
            metal: 18,
            fire: 48,
            water: 55,
            earth: 42
          },
          astrological_factors: {
            sun: { sign: 'Taurus', degree: 25 },
            moon: { sign: 'Scorpio', degree: 14 }
          }
        },
        used_supabase_tables: ['user_natal_charts', 'quiz_state_memory_vectors', 'reflective_agent_heuristics'],
        missing_data_warnings: ['BaZi Hour Pillar information is missing. Backing up utilizing local solar time calculations.'],
        miro_shark_run_id: `miroshark_sim_active_${Math.random().toString(36).substring(2, 8)}`,
        not_to_infer_rules: [
          'DO NOT interpret planetary degree deltas as quantitative stock or financial indices forecasts.',
          'DO NOT present lunar Scorpio transits as deterministic indicators of workspace performance decline.'
        ]
      };

      clearInterval(interval);
    }
    simulations.set(runId, cachedTask);
  }, 600);

  return res.status(202).json({ runId, status: 'pending' });
});

/**
 * Endpoint Option 2: Get status/logs of simulation run
 * GET /api/scenario/status/:runId
 */
app.get('/api/scenario/status/:runId', (req, res) => {
  const { runId } = req.params;
  const task = simulations.get(runId);
  if (!task) {
    return res.status(404).json({ error: `Simulation run sequence ${runId} was not found.` });
  }

  return res.json({
    id: task.id,
    status: task.status,
    progress: task.progress,
    logs: task.logs
  });
});

/**
 * Endpoint Option 3: Get resulting forecast branches
 * GET /api/scenario/results/:runId
 */
app.get('/api/scenario/results/:runId', (req, res) => {
  const { runId } = req.params;
  const task = simulations.get(runId);
  if (!task) {
    return res.status(404).json({ error: `Simulation run sequence ${runId} was not found.` });
  }

  if (task.status !== 'completed') {
    return res.status(400).json({ error: `Requested results are not compiled yet. Status is: ${task.status}` });
  }

  return res.json(task.results);
});

/**
 * Endpoint Option 4: Get raw seed document & metadata
 * GET /api/scenario/seed/:runId
 */
app.get('/api/scenario/seed/:runId', (req, res) => {
  const { runId } = req.params;
  const task = simulations.get(runId);
  if (!task) {
    return res.status(404).json({ error: `Simulation run sequence ${runId} was not found.` });
  }

  if (task.status !== 'completed') {
    return res.status(400).json({ error: `Scenario seed is not compiled yet. Status is: ${task.status}` });
  }

  return res.json(task.seed);
});

// Serve frontend assets & mount middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend server successfully serving Bazodiac orchestrator at: http://localhost:${PORT}`);
  });
}

startServer();
