import { Request, Response } from 'express';

export async function proxyScenarioOrchestrator(
  endpointPath: string,
  req: Request,
  res: Response
): Promise<void> {
  const orchestratorUrl = process.env.SCENARIO_ORCHESTRATOR_BASE_URL;

  if (!orchestratorUrl) {
    res.status(503).json({
      error: 'orchestrator_unconfigured',
      message: 'Scenario orchestrator endpoint path is missing.'
    });
    return;
  }

  const url = `${orchestratorUrl}${endpointPath}`;
  const method = req.method;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (process.env.MIROSHARK_INTERNAL_KEY) {
    headers['Authorization'] = `Bearer ${process.env.MIROSHARK_INTERNAL_KEY}`;
  }

  try {
    console.log(`[PROXY] Forwarding request: ${method} to ${url}`);
    const fetchOptions: any = {
      method,
      headers
    };

    if (method !== 'GET' && method !== 'HEAD') {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const proxyRes = await fetch(url, fetchOptions);

    if (!proxyRes.ok) {
      res.status(proxyRes.status).json({
        error: 'orchestrator_failed',
        message: `Remote orchestrator returned error status: ${proxyRes.status}`
      });
      return;
    }

    const data = await proxyRes.json();
    res.json(data);
  } catch (err: any) {
    res.status(502).json({
      error: 'orchestrator_unreachable',
      message: `Could not reach target orchestrator backend: ${err.message}`
    });
  }
}
