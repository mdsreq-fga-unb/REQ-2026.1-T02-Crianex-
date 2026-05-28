import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { router } from './routes/index.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env['CORS_ORIGIN'] ?? 'http://localhost:5173',
      credentials: true,
    })
  );
  app.use(express.json());

  app.use('/api', router);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', env: process.env['NODE_ENV'] });
  });

  return app;
}
