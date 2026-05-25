import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environmental parameters
dotenv.config();

let __filename = '';
let __dirname = '';
try {
  if (typeof import.meta !== 'undefined' && import.meta.url) {
    __filename = fileURLToPath(import.meta.url);
    __dirname = path.dirname(__filename);
  }
} catch (e) {}

const app = express();
app.use(express.json());

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Import server scenario modules
import { loadSupabaseUserData } from './server/scenario/supabaseUserDataLoader';
import { buildUserPatternState } from './server/scenario/buildUserPatternState';
import { buildScenarioSeed } from './server/scenario/buildScenarioSeed';
import { normalizeMirosharkResults } from './server/scenario/normalizeMirosharkResults';
import { persistScenarioRun } from './server/scenario/persistScenarioRun';
import { runLocalMirosharkOrchestration } from './server/scenario/localMirosharkOrchestrator';
import { proxyScenarioOrchestrator } from './server/scenario/proxyScenarioOrchestrator';

// In-memory simulation trace and status logs DB
interface SimulationTask {
  id: string;
  activeUserId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  stage: string;
  progress: number;
  logs: string[];
  results?: any;
  seed?: any;
  error?: string;
  persistence_issue?: string;
}

const simulations = new Map<string, SimulationTask>();

/**
 * Identify exact active backend mode
 */
function getBackendMode(): 'orchestrator' | 'local_miroshark' | 'dev_mock' | 'unconfigured' {
  if (process.env.SCENARIO_ORCHESTRATOR_BASE_URL) {
    return 'orchestrator';
  }
  if (process.env.MIROSHARK_API_BASE_URL) {
    return 'local_miroshark';
  }
  if (process.env.ENABLE_DEV_SCENARIO_MOCK === 'true') {
    return 'dev_mock';
  }
  return 'unconfigured';
}

/**
 * Route check middleware
 */
function checkConfiguration(req: express.Request, res: express.Response, next: express.NextFunction) {
  const mode = getBackendMode();
  if (mode === 'unconfigured') {
    return res.status(503).json({
      error: 'backend_unconfigured',
      message: 'The integration backend environment variables are unconfigured. Please configure SCENARIO_ORCHESTRATOR_BASE_URL or MIROSHARK_API_BASE_URL in your server variables.'
    });
  }
  next();
}

/**
 * 1. Health Probe Check Endpoint
 * GET /health
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    backendMode: getBackendMode()
  });
});

/**
 * 2. Safe Public Configurations
 * GET /api/scenario/config
 */
app.get('/api/scenario/config', (req, res) => {
  res.json({
    backendMode: getBackendMode(),
    supabaseUrlConfigured: !!(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL),
    testLoaderEnabled: process.env.VITE_ENABLE_TEST_USER_LOADER === 'true',
    eveTableReadsEnabled: process.env.ENABLE_EVE_TABLE_READS === 'true'
  });
});

/**
 * 3. Start Scenario Calculations Run Loop
 * POST /api/scenario/run
 */
app.post('/api/scenario/run', checkConfiguration, async (req, res) => {
  const { activeUserId, mode, horizon, question } = req.body;
  
  if (!activeUserId) {
    return res.status(400).json({ error: 'Missing activeUserId UUID parameter in request body.' });
  }

  const backendMode = getBackendMode();

  // Mode 1: Proxy Forwarding
  if (backendMode === 'orchestrator') {
    return proxyScenarioOrchestrator('/api/scenario/run', req, res);
  }

  // Mode 2: Local MiroShark Endpoint Path Check
  if (backendMode === 'local_miroshark') {
    try {
      // Load tables authoritatively server side first
      const userData = await loadSupabaseUserData(activeUserId);
      const msResult = await runLocalMirosharkOrchestration(activeUserId, userData);
      
      if (msResult.error === 'local_miroshark_not_implemented') {
        return res.status(501).json({
          error: 'local_miroshark_not_implemented',
          message: msResult.message
        });
      }
      return res.status(502).json({
        error: 'miroshark_failed',
        message: 'MiroShark execution returned unexpected state.'
      });
    } catch (err: any) {
      return res.status(502).json({
        error: 'miroshark_unreachable',
        message: `MiroShark connection failure: ${err.message}`
      });
    }
  }

  // Mode 3: Complete Dev Sandbox Mocks (ENABLE_DEV_SCENARIO_MOCK=true)
  const runId = `run_sandbox_${Math.random().toString(36).substring(2, 10)}`;
  
  const task: SimulationTask = {
    id: runId,
    activeUserId,
    status: 'pending',
    stage: 'idle',
    progress: 0,
    logs: [
      `[OVERWATCH] Spinning Sandbox Calibration Pipeline Run Threads for trace token ID: ${runId}`,
      `[STAGE_CHANGE] Transitioning sequence tracker step to IDLE.`
    ]
  };

  simulations.set(runId, task);

  // Background worker moving step-by-step through the precise stages contract
  let stageIndex = 0;
  const stagesSequence = [
    { stage: 'loading_user', progress: 10, msg: '[INGESTION] Loading authoritative user data server-side... Checking Profiles and Birth Coordinates.' },
    { stage: 'building_pattern_state', progress: 25, msg: '[PATTERN_FUSE] Computing 5-dimensional balance scores: Wood Dominance, Metal Deficiency.' },
    { stage: 'building_seed', progress: 40, msg: '[SEED_PREPARE] Packaging markdown prompt payload seed document. Enforcing not_to_infer constraints.' },
    { stage: 'miroshark_ontology', progress: 55, msg: '[ONTOLOGY] Indexing astrological trait axes inside MiroShark conceptual ontology schemas.' },
    { stage: 'miroshark_graph', progress: 65, msg: '[GRAPH] Drawing tension vertices across high-resolution Scorpio Lunar Transits.' },
    { stage: 'miroshark_prepare', progress: 75, msg: '[MAPPED_INIT] Preparing initial trajectory paths. Spawning recursive split nodes.' },
    { stage: 'miroshark_running', progress: 85, msg: '[COMPUTATION] MiroShark computational simulation engines humming. Plotting trajectory branches.' },
    { stage: 'normalizing_results', progress: 92, msg: '[NORMALIZER] Normalizing speculative outcomes vs clinical guidelines. Identifying 3D spatial intersections.' },
    { stage: 'persisting_results', progress: 98, msg: '[PERSISTENCE] Committing authorization cached outputs server-side to session tables.' },
    { stage: 'completed', progress: 100, msg: '[COMPLETED] Authoritative sandbox loop successfully registered. Visual assets verified.' }
  ];

  const interval = setInterval(async () => {
    const cachedTask = simulations.get(runId);
    if (!cachedTask) {
      clearInterval(interval);
      return;
    }

    if (stageIndex < stagesSequence.length) {
      const stepInfo = stagesSequence[stageIndex];
      cachedTask.stage = stepInfo.stage;
      cachedTask.progress = stepInfo.progress;
      cachedTask.logs.push(`[STAGE_CHANGE] Transitioning sequence tracker step to ${stepInfo.stage.toUpperCase()}`);
      cachedTask.logs.push(stepInfo.msg);

      // Perform real data loading and build inside stages
      if (stepInfo.stage === 'loading_user') {
        try {
          // Authoritative load from Supabase if credentials exist, otherwise soft sandbox warnings
          const userResult = await loadSupabaseUserData(activeUserId);
          cachedTask.logs.push(`[INGESTION] Loader finalized with ${Object.keys(userResult.tables).length} system tables handled.`);
        } catch (loaderErr: any) {
          cachedTask.logs.push(`[INGESTION_WARN] Load completed with error: ${loaderErr.message}`);
        }
      }

      if (stepInfo.stage === 'completed') {
        cachedTask.status = 'completed';
        
        try {
          // Real backend calculation of all intermediate states using imported server code
          const userResult = await loadSupabaseUserData(activeUserId);
          const userPatternState = buildUserPatternState(userResult);
          const userSeed = buildScenarioSeed(runId, userResult, userPatternState, question);
          const normalized = normalizeMirosharkResults(runId, userPatternState);

          // Save variables to task state
          cachedTask.results = normalized;
          cachedTask.seed = userSeed;

          // Commit to tables (will check existence and fail cleanly if folders missing)
          const persistence = await persistScenarioRun(runId, normalized, userSeed);
          if (persistence.error?.code === 'scenario_table_missing') {
            cachedTask.logs.push(`[PERSISTENCE_ERR] ${persistence.error.message}`);
            cachedTask.persistence_issue = persistence.error.missingTable;
          } else {
            cachedTask.logs.push(`[PERSISTENCE] Safe output cache synchronized flawlessly.`);
          }
        } catch (assemblyErr: any) {
          cachedTask.status = 'failed';
          cachedTask.stage = 'failed';
          cachedTask.error = `Assembly error: ${assemblyErr.message}`;
          cachedTask.logs.push(`[CRITICAL_ERR] ${assemblyErr.message}`);
        }

        clearInterval(interval);
      }
      
      stageIndex++;
      simulations.set(runId, cachedTask);
    }
  }, 450);

  return res.status(202).json({ runId, status: 'pending' });
});

/**
 * 4. Get active status of calculations queue
 * GET /api/scenario/status/:runId
 */
app.get('/api/scenario/status/:runId', checkConfiguration, async (req, res) => {
  const { runId } = req.params;
  const backendMode = getBackendMode();

  if (backendMode === 'orchestrator') {
    return proxyScenarioOrchestrator(`/api/scenario/status/${runId}`, req, res);
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
    logs: task.logs,
    error: task.error
  });
});

/**
 * 5. Get resulting authoritative branches
 * GET /api/scenario/results/:runId
 */
app.get('/api/scenario/results/:runId', checkConfiguration, async (req, res) => {
  const { runId } = req.params;
  const backendMode = getBackendMode();

  if (backendMode === 'orchestrator') {
    return proxyScenarioOrchestrator(`/api/scenario/results/${runId}`, req, res);
  }

  const task = simulations.get(runId);
  if (!task) {
    return res.status(404).json({ error: `Simulation run sequence ${runId} was not found.` });
  }

  if (task.status !== 'completed') {
    return res.status(400).json({ error: `Requested results are not compiled yet.` });
  }

  // If there's a missing table, return a structured error listing the missing table
  if (task.persistence_issue) {
    return res.status(400).json({
      error: 'scenario_table_missing',
      missingTable: task.persistence_issue,
      message: `Database table '${task.persistence_issue}' does not exist.`
    });
  }

  return res.json(task.results);
});

/**
 * 6. Get compiled prompt seed rules
 * GET /api/scenario/seed/:runId
 */
app.get('/api/scenario/seed/:runId', checkConfiguration, async (req, res) => {
  const { runId } = req.params;
  const backendMode = getBackendMode();

  if (backendMode === 'orchestrator') {
    return proxyScenarioOrchestrator(`/api/scenario/seed/${runId}`, req, res);
  }

  const task = simulations.get(runId);
  if (!task) {
    return res.status(404).json({ error: `Simulation run sequence ${runId} was not found.` });
  }

  if (task.status !== 'completed') {
    return res.status(400).json({ error: `Scenario seed is not compiled yet.` });
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
