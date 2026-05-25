/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ScenarioRunRequest,
  ScenarioRunResponse,
  ScenarioRunStatus,
  ScenarioResultsResponse,
  ScenarioSeedResponse,
  BackendMode
} from './contracts';

// Optional custom deployment URL, defaults to same-origin proxy
const API_BASE = (import.meta as any).env?.VITE_SCENARIO_API_BASE || '';

export interface ScenarioConfigResponse {
  backendMode: BackendMode;
  supabaseUrlConfigured: boolean;
  testLoaderEnabled: boolean;
  eveTableReadsEnabled: boolean;
}

/**
 * Retrieves safe, public configuration limits from the backend server.
 */
export async function getScenarioConfig(): Promise<ScenarioConfigResponse> {
  const url = `${API_BASE}/api/scenario/config`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Could not retrieve safe public config variables.');
  }
  return response.json();
}

/**
 * Initiates an advanced server-side multi-stage scenario calculation run with timeout boundaries.
 */
export async function runScenario(request: ScenarioRunRequest): Promise<ScenarioRunResponse> {
  const url = `${API_BASE}/api/scenario/run`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12-second timeout

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errMsg = `Request failed with HTTP status ${response.status}`;
      try {
        const errBody = await response.json();
        if (errBody?.error) {
          errMsg = errBody.error;
          if (errBody.message) errMsg += `: ${errBody.message}`;
        }
      } catch (_) {}
      throw new Error(errMsg);
    }

    return response.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Connection timed out while initializing scenario run sequence.');
    }
    throw err;
  }
}

/**
 * Checks active progress, logs, and stages of an ongoing calculation run.
 */
export async function getScenarioStatus(runId: string): Promise<ScenarioRunStatus> {
  const url = `${API_BASE}/api/scenario/status/${runId}`;
  const response = await fetch(url);

  if (!response.ok) {
    let errMsg = `Status check failed: ${response.statusText}`;
    try {
      const errBody = await response.json();
      if (errBody?.error) errMsg = errBody.error;
    } catch (_) {}
    throw new Error(errMsg);
  }

  return response.json();
}

/**
 * Retrieves finalized forecast branches.
 */
export async function getScenarioResults(runId: string): Promise<ScenarioResultsResponse> {
  const url = `${API_BASE}/api/scenario/results/${runId}`;
  const response = await fetch(url);

  if (!response.ok) {
    let errMsg = `Results retrieval failed: ${response.statusText}`;
    try {
      const errBody = await response.json();
      if (errBody?.error) errMsg = errBody.error;
    } catch (_) {}
    throw new Error(errMsg);
  }

  return response.json();
}

/**
 * Retrieves the raw generated seed document Markdown content and metadata rules.
 */
export async function getScenarioSeed(runId: string): Promise<ScenarioSeedResponse> {
  const url = `${API_BASE}/api/scenario/seed/${runId}`;
  const response = await fetch(url);

  if (!response.ok) {
    let errMsg = `Seed retrieval failed: ${response.statusText}`;
    try {
      const errBody = await response.json();
      if (errBody?.error) errMsg = errBody.error;
    } catch (_) {}
    throw new Error(errMsg);
  }

  return response.json();
}

/**
 * Attempts to cancel a queued or running simulation.
 * Returns unsupported as cancellation is not hardware-supported on the server.
 */
export async function cancelScenarioRun(runId: string): Promise<{ success: boolean; message: string }> {
  console.warn(`[API] Cancellation requested for Run: ${runId} is unsupported by the backend.`);
  return {
    success: false,
    message: 'Operation is not supported by the underlying Scenario Orchestration hardware constraint.'
  };
}
