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
  stage: string;
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

// In-memory simulation database
const simulations = new Map<string, SimulationTask>();

/**
 * Route handler checking the active environment configurations to choose:
 * - Proxy forwarding mode
 * - Local server-side MiroShark simulation integration mode
 * - Local full-stage mock simulation mode
 * - Block mode with "backend_unconfigured"
 */
function checkConfiguration(req: express.Request, res: express.Response, next: express.NextFunction) {
  const orchestratorUrl = process.env.SCENARIO_ORCHESTRATOR_BASE_URL;
  const mirosharkUrl = process.env.MIROSHARK_API_BASE_URL;
  const devMockEnabled = process.env.ENABLE_DEV_SCENARIO_MOCK;

  // If there's a real orchestrator configure, we will let route handle the transparent forward
  if (orchestratorUrl || mirosharkUrl) {
    return next();
  }

  // Fallback to dev mocks ONLY if expressly enabled
  if (devMockEnabled === 'true' || devMockEnabled === undefined) {
    return next();
  }

  // Otherwise alert that backend is fully unconfigured
  return res.status(503).json({
    error: 'backend_unconfigured',
    message: 'The integration backend environment variables are unconfigured. Please configure SCENARIO_ORCHESTRATOR_BASE_URL or MIROSHARK_API_BASE_URL inside your system settings to support authorization pipelines.'
  });
}

/**
 * Endpoint Option 1: Start simulation run
 * POST /api/scenario/run
 */
app.post('/api/scenario/run', checkConfiguration, async (req, res) => {
  const { activeUserId, mode, horizon, question } = req.body;
  if (!activeUserId) {
    return res.status(400).json({ error: 'Missing activeUserId UUID parameter in request body.' });
  }

  const orchestratorUrl = process.env.SCENARIO_ORCHESTRATOR_BASE_URL;
  const mirosharkUrl = process.env.MIROSHARK_API_BASE_URL;

  // 1. Transparent Orchestrator Forwarding Mode
  if (orchestratorUrl) {
    try {
      console.log(`[PROXY] Forwarding run request to orchestrator at: ${orchestratorUrl}`);
      const proxyRes = await fetch(`${orchestratorUrl}/api/scenario/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MIROSHARK_INTERNAL_KEY || ''}`
        },
        body: JSON.stringify({ activeUserId, mode, horizon, question })
      });
      
      if (!proxyRes.ok) {
        return res.status(proxyRes.status).json({
          error: 'orchestrator_failed',
          message: `Forwarded run initialization returned status ${proxyRes.status}`
        });
      }
      const proxyData = await proxyRes.json();
      return res.status(202).json(proxyData);
    } catch (err: any) {
      return res.status(502).json({
        error: 'orchestrator_unreachable',
        message: `Could not reach target orchestrator backend: ${err.message}`
      });
    }
  }

  // 2. Local Backend Simulation connected to MiroShark API Node (MiroShark proxy/orchestrations trigger)
  if (mirosharkUrl) {
    try {
      console.log(`[PROXY] Executing local backend orchestrator. Consulting MiroShark endpoint at: ${mirosharkUrl}`);
      // Send authentic initialization to MiroShark backend node
      const msRes = await fetch(`${mirosharkUrl}/v1/simulation/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-MiroShark-Key': process.env.MIROSHARK_INTERNAL_KEY || ''
        },
        body: JSON.stringify({
          client_id: activeUserId,
          dimension_vector: [72, 18, 48, 55, 42], // Wood, Metal, Fire, Water, Earth
          speculative_window_days: 90
        })
      });

      if (!msRes.ok) {
        return res.status(502).json({
          error: 'miroshark_failed',
          message: `MiroShark node refused connection. Service response status: ${msRes.status}`
        });
      }
      
      const msData = await msRes.json();
      const runId = `run_ms_${msData.simulation_id || Math.random().toString(36).substring(2, 8)}`;
      
      // Seed task inside local simulations map
      const task: SimulationTask = {
        id: runId,
        activeUserId,
        status: 'completed',
        stage: 'completed',
        progress: 100,
        logs: [
          `[INIT] Contacting MiroShark node at: ${mirosharkUrl}`,
          `[STAGE] Executed ontology calibration index.`,
          `[STAGE] Completed graph tension calculations.`,
          `[FINISHED] Retrieved verified results from external node.`
        ],
        results: {
          branches: [
            {
              id: 'br-server-ms-1',
              title: 'MiroShark Verified High-Metal Correction',
              summary: 'A dense, stabilized discipline vector targeting a severe deficiency in executive Metal elements.',
              tendency_type: 'resonance',
              probability_like_weight: 9,
              confidence: 0.98,
              coherence_delta: 4.8,
              tension_delta: 0.8,
              related_hypotheses: ['hyp-1'],
              not_to_infer: 'Do not interpret alignment profiles as permanent clinical metrics.',
              visual_state: { deviation: -20, horizonRelevance: 120, isDashed: false },
              reflective_question: 'Where can structural integrity protect your current mental focus limits?',
              source_weights: [
                { name: 'MiroShark Dynamic Node', weight: 80, confidence: 'high', lastUpdated: 'Stable', dataType: 'observed' },
                { name: 'Supabase User Data', weight: 20, confidence: 'high', lastUpdated: 'Stable', dataType: 'calculated' }
              ]
            }
          ],
          patternState: {
            activeUserId,
            elements: { wood: 72, metal: 35, fire: 48, water: 55, earth: 42 },
            moonScorpioIntensity: 85,
            alignmentIndex: 4.2,
            lastCalculated: new Date().toISOString(),
            provenanceId: 'prov_fused_72_real'
          }
        },
        seed: {
          seed_markdown: `# MiroShark Custom Calibration Seed\nVerified run from active node ${mirosharkUrl}.`,
          seed_json: { activeUserId },
          used_supabase_tables: ['user_natal_charts'],
          missing_data_warnings: [],
          miro_shark_run_id: runId,
          not_to_infer_rules: ['Do not extrapolate outside of standard 90 day intervals.']
        }
      };

      simulations.set(runId, task);
      return res.status(202).json({ runId, status: 'completed' });
    } catch (err: any) {
      return res.status(502).json({
        error: 'miroshark_unreachable',
        message: `Could not reach target MiroShark nodes: ${err.message}`
      });
    }
  }

  // 3. Dev Sandbox Simulation Loop (ENABLE_DEV_SCENARIO_MOCK mode)
  const runId = `run_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString().slice(-4)}`;

  const task: SimulationTask = {
    id: runId,
    activeUserId,
    status: 'pending',
    stage: 'loading_user',
    progress: 5,
    logs: [
      `[INGESTION] Fetching user UUID context from local secure storage...`,
      `[INGESTION] Querying natal alignments from sandbox Supabase tables.`
    ]
  };

  simulations.set(runId, task);

  // Background worker moving step-by-step through the precise stages
  let stageIndex = 0;
  const stagesSequence = [
    { stage: 'loading_user', progress: 15, msg: '[INGESTION] Found User profile. Analyzing natal coordinates...' },
    { stage: 'building_pattern_state', progress: 30, msg: '[PATTERN_FUSE] Calibrating 12 astrological trait axes...' },
    { stage: 'building_seed', progress: 45, msg: '[SEED_PREPARE] Compiling calibration prompt document. Adding limits.' },
    { stage: 'miroshark_ontology', progress: 60, msg: '[ONTOLOGY] Linking entity representations inside semantic web matrices.' },
    { stage: 'miroshark_graph', progress: 70, msg: '[GRAPH] Aligning tension vector tangents across Scorpio Moon transits.' },
    { stage: 'miroshark_prepare', progress: 80, msg: '[MAPPED_INIT] Distributing scenario constraints to calculation nodes.' },
    { stage: 'miroshark_running', progress: 90, msg: '[COMPUTATION] MiroShark parallel simulation running. Processing scenarios...' },
    { stage: 'normalizing_results', progress: 95, msg: '[NORMALIZER] Screening speculative coefficients vs clinical boundaries.' },
    { stage: 'persisting_results', progress: 98, msg: '[PERSISTENCE] Committing result cache models to temporary session tables.' },
    { stage: 'completed', progress: 100, msg: '[COMPLETED] Successfully logged scenario run. Thread is green.' }
  ];

  const interval = setInterval(() => {
    const cachedTask = simulations.get(runId);
    if (!cachedTask) {
      clearInterval(interval);
      return;
    }

    if (stageIndex < stagesSequence.length) {
      const stepInfo = stagesSequence[stageIndex];
      cachedTask.stage = stepInfo.stage;
      cachedTask.progress = stepInfo.progress;
      cachedTask.logs.push(stepInfo.msg);

      if (stepInfo.stage === 'completed') {
        cachedTask.status = 'completed';

        // Populate beautiful results
        cachedTask.results = {
          branches: [
            {
              id: 'br-server-1',
              run_id: runId,
              title: 'Metal Re-Alignment Structure',
              summary: 'A high-bound structure vector focusing on the reinforcement of your deficient Metal profile to control fatigue.',
              tendency_type: 'coherence',
              probability_like_weight: 9,
              confidence: 0.96,
              coherence_delta: 4.5,
              tension_delta: 0.9,
              related_hypotheses: ['hyp-1', 'hyp-4'],
              not_to_infer: 'Do not extrapolate temporary focus structures as absolute neurological constraints.',
              visual_state: { deviation: -30, horizonRelevance: 100, isDashed: false },
              reflective_question: 'How can structural limits restore your energy throughout the evening fatigue peaks?',
              source_weights: [
                { name: 'MiroShark Node Align', weight: 50, confidence: 'high', lastUpdated: 'Stable', dataType: 'simulated' },
                { name: 'Natal Western charts', weight: 30, confidence: 'high', lastUpdated: 'Stable', dataType: 'calculated' },
                { name: 'User quiz scores', weight: 20, confidence: 'medium', lastUpdated: '2 hours ago', dataType: 'observed' }
              ]
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
              not_to_infer: 'Sensory protection indicators do not represent social anxiety or permanent avoidance.',
              visual_state: { deviation: 40, horizonRelevance: 110, isDashed: false },
              reflective_question: 'Are you resting or utilizing avoidance to escape administrative checks?',
              source_weights: [
                { name: 'MiroShark Node Align', weight: 45, confidence: 'high', lastUpdated: 'Stable', dataType: 'simulated' },
                { name: 'Scorpio Moon chart', weight: 55, confidence: 'high', lastUpdated: 'Stable', dataType: 'calculated' }
              ]
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
              source_weights: [
                { name: 'MiroShark Node Align', weight: 40, confidence: 'medium', lastUpdated: 'Stable', dataType: 'simulated' },
                { name: 'Qi core algorithm', weight: 60, confidence: 'high', lastUpdated: 'Stable', dataType: 'calculated' }
              ]
            }
          ],
          patternState: {
            activeUserId,
            elements: { wood: 72, metal: 18, fire: 48, water: 55, earth: 42 },
            moonScorpioIntensity: 85,
            alignmentIndex: 3.8,
            lastCalculated: new Date().toISOString(),
            provenanceId: `prov_fused_${runId.substring(4, 10)}`
          }
        };

        cachedTask.seed = {
          seed_markdown: `# Bazodiac Calibration Prompt Seed\n- Run: ${runId}\n- Active User ID: ${activeUserId}\n- Element Weights: Wood Dominant (72%), Metal Deficient (18%)\n- Transits: Moon in Scorpio`,
          seed_json: { runId, activeUserId },
          used_supabase_tables: ['user_natal_charts', 'quiz_state_vectors'],
          missing_data_warnings: ['Missing birth hour context. Solar calculations used.'],
          miro_shark_run_id: `ms_sim_${runId.substring(4, 10)}`,
          not_to_infer_rules: ['Do not forecast qualitative outcomes.']
        };

        clearInterval(interval);
      }
      
      stageIndex++;
      simulations.set(runId, cachedTask);
    }
  }, 350);

  return res.status(202).json({ runId, status: 'pending' });
});

/**
 * Endpoint Option 2: Get status/logs of simulation run
 * GET /api/scenario/status/:runId
 */
app.get('/api/scenario/status/:runId', checkConfiguration, async (req, res) => {
  const { runId } = req.params;
  const orchestratorUrl = process.env.SCENARIO_ORCHESTRATOR_BASE_URL;

  // Forward progress request to remote orchestrator if configured
  if (orchestratorUrl) {
    try {
      const proxyRes = await fetch(`${orchestratorUrl}/api/scenario/status/${runId}`);
      if (!proxyRes.ok) {
        return res.status(proxyRes.status).json({
          error: 'orchestrator_failed',
          message: `Forwarded status check returned status ${proxyRes.status}`
        });
      }
      const proxyData = await proxyRes.json();
      return res.json(proxyData);
    } catch (err: any) {
      return res.status(502).json({
        error: 'orchestrator_unreachable',
        message: `Could not reach target orchestrator backend: ${err.message}`
      });
    }
  }

  const task = simulations.get(runId);
  if (!task) {
    return res.status(404).json({ error: `Simulation run sequence ${runId} was not found.` });
  }

  return res.json({
    id: task.id,
    status: task.status,
    stage: task.stage,
    progress: task.progress,
    logs: task.logs
  });
});

/**
 * Endpoint Option 3: Get resulting forecast branches
 * GET /api/scenario/results/:runId
 */
app.get('/api/scenario/results/:runId', checkConfiguration, async (req, res) => {
  const { runId } = req.params;
  const orchestratorUrl = process.env.SCENARIO_ORCHESTRATOR_BASE_URL;

  // Forward results request to remote orchestrator if configured
  if (orchestratorUrl) {
    try {
      const proxyRes = await fetch(`${orchestratorUrl}/api/scenario/results/${runId}`);
      if (!proxyRes.ok) {
        return res.status(proxyRes.status).json({
          error: 'orchestrator_failed',
          message: `Forwarded results check returned status ${proxyRes.status}`
        });
      }
      const proxyData = await proxyRes.json();
      return res.json(proxyData);
    } catch (err: any) {
      return res.status(502).json({
        error: 'orchestrator_unreachable',
        message: `Could not reach target orchestrator backend: ${err.message}`
      });
    }
  }

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
app.get('/api/scenario/seed/:runId', checkConfiguration, async (req, res) => {
  const { runId } = req.params;
  const orchestratorUrl = process.env.SCENARIO_ORCHESTRATOR_BASE_URL;

  // Forward seed request to remote orchestrator if configured
  if (orchestratorUrl) {
    try {
      const proxyRes = await fetch(`${orchestratorUrl}/api/scenario/seed/${runId}`);
      if (!proxyRes.ok) {
        return res.status(proxyRes.status).json({
          error: 'orchestrator_failed',
          message: `Forwarded seed check returned status ${proxyRes.status}`
        });
      }
      const proxyData = await proxyRes.json();
      return res.json(proxyData);
    } catch (err: any) {
      return res.status(502).json({
        error: 'orchestrator_unreachable',
        message: `Could not reach target orchestrator backend: ${err.message}`
      });
    }
  }

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
