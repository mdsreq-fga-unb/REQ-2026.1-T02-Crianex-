import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { router } from './routes/index.js';
import { healthController } from './health/health.controller.js';

const app = express();
const PORT = Number(process.env['PORT'] ?? 3000);

app.use(helmet());
app.use(
  cors({
    origin: process.env['CORS_ORIGIN'] ?? 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

app.get('/health', healthController);
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`[backend] running on http://localhost:${PORT}`);
});