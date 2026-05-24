import type { Request, Response } from 'express';
import { checkHealth } from './health.service.js';

export async function healthController(_req: Request, res: Response): Promise<Response> {
  try {
    const health = await checkHealth();

    return res.status(200).json(health);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected health check failure';

    return res.status(503).json({
      status: 'error',
      message,
    });
  }
}
