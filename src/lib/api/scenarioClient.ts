/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ScenarioRunRequest,
  ScenarioRunResponse,
  ScenarioRunStatus,
  ScenarioResultsResponse,
  ScenarioSeedResponse
} from './contracts';

// Optional custom deployment URL, defaults to same-origin proxy
const API_BASE = (import.meta as any).env?.VITE_SCENARIO_API_BASE || '';

/**
 * Initiates an advanced server-side multi-stage scenario calculation run.
 */
export async function runScenario(request: ScenarioRunRequest): Promise<ScenarioRunResponse> {
  const url = `${API_BASE}/api/scenario/run`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    let errMsg = `Request failed: ${response.statusText}`;
    try {
      const errBody = await response.json();
      if (errBody?.error) errMsg = errBody.error;
    } catch (_) {}
    throw new Error(errMsg);
  }

  return response.json();
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
 * Backend-unsupported cancellation is simulated gracefully on the client.
 */
export async function cancelScenarioRun(runId: string): Promise<{ success: boolean; message: string }> {
  console.warn(`[API] Cancellation request sent for Run: ${runId}. Operation is not hardware-supported; execution is client-detached.`);
  return {
    success: true,
    message: 'Run detached from client interface. Thread will run to completion in container.'
  };
}
