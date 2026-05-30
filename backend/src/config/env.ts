import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

const envPaths = [path.resolve(process.cwd(), '.env'), path.resolve(process.cwd(), '..', '.env')];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}
