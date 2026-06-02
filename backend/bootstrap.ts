import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');

dotenv.config({ path: envPath });

console.log('✓ Dotenv loaded');
console.log('✓ DATABASE_URL:', !!process.env.DATABASE_URL ? 'configured' : 'missing!');

await import('./src/server.js');
