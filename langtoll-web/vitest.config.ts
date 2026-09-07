// '@/…' resolves to src/ in tests the way tsconfig paths do for Next — funnel.ts imports the db
// module for its loader, and the unit tests exercise only the pure buildReport().
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
});
