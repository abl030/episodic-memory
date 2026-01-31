#!/usr/bin/env node
import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const tsc = resolve(root, 'node_modules', 'typescript', 'bin', 'tsc');

// Step 1: Compile TypeScript
console.log('[build] Compiling TypeScript...');
execSync(`node "${tsc}"`, { cwd: root, stdio: 'inherit' });
console.log('[build] TypeScript compiled.');

// Step 2: Bundle MCP server with esbuild (use JS API, not CLI shim)
console.log('[build] Bundling MCP server...');
const { build } = await import('esbuild');
await build({
  entryPoints: [resolve(root, 'src', 'mcp-server.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: resolve(root, 'dist', 'mcp-server.js'),
  external: [
    'fsevents',
    '@anthropic-ai/claude-agent-sdk',
    'sharp',
    'onnxruntime-node',
    'better-sqlite3',
    '@xenova/transformers',
    'sqlite-vec',
  ],
});
console.log('[build] Done.');
