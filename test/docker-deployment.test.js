const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.join(__dirname, '..');

function readFile(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Dockerfile provides a Node 22 multi-stage stdio runtime', () => {
  const dockerfile = readFile('Dockerfile');

  assert.match(dockerfile, /^FROM node:22-alpine AS build/m);
  assert.match(dockerfile, /^FROM node:22-alpine AS runtime/m);
  assert.match(dockerfile, /RUN npm ci/m);
  assert.match(dockerfile, /RUN npm run build/m);
  assert.match(dockerfile, /CMD \["node", "dist\/main\.js"\]/m);
});

test('.dockerignore excludes build outputs and local workspace state', () => {
  const dockerignore = readFile('.dockerignore');

  assert.match(dockerignore, /^node_modules$/m);
  assert.match(dockerignore, /^dist$/m);
  assert.match(dockerignore, /^\.omx$/m);
  assert.match(dockerignore, /^\.claude$/m);
});

test('README documents Docker build, Docker run, and Docker MCP client config', () => {
  const readme = readFile('README.md');

  assert.match(readme, /docker build -t sigma-streaming-platform-mcp \./);
  assert.match(readme, /docker run -i --rm/);
  assert.match(readme, /"command": "docker"/);
  assert.match(readme, /sigma-streaming-platform-mcp:latest/);
});
