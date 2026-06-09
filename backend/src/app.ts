import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { router } from './routes/index.js';

export function createApp() {
  const app = express();

  // Behind a reverse proxy (nginx / k8s ingress) req.ip and rate-limit keys must
  // come from X-Forwarded-For. TRUST_PROXY is the hop count (default 1). When 0,
  // Express ignores the header so it can't be spoofed in a direct-exposure setup.
  app.set('trust proxy', Number(process.env['TRUST_PROXY'] ?? 1));

  // This service only serves a JSON API; no inline scripts/styles are ever sent,
  // so a strict default-src 'none' CSP is safe and blocks any reflected content.
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: false,
        directives: {
          'default-src': ["'none'"],
          'frame-ancestors': ["'none'"],
        },
      },
      crossOriginResourcePolicy: { policy: 'same-site' },
    })
  );

  const allowedOrigins = (process.env['CORS_ORIGIN'] ?? 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin(origin, callback) {
        // Allow non-browser clients (no Origin header) and explicitly allow-listed origins.
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    })
  );

  // Cap request body size to blunt memory-exhaustion DoS from oversized payloads.
  app.use(express.json({ limit: '100kb' }));

  app.use('/api', router);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', env: process.env['NODE_ENV'] });
  });

  return app;
}
