import './config/env.js';
import { createApp } from './app.js';

const app = createApp();
const PORT = Number(process.env['PORT'] ?? 3000);

app.listen(PORT, () => {
  console.log(`[backend] running on http://localhost:${PORT}`);
});
