# Docker Stdio Deployment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a Dockerized stdio deployment path so MCP clients can launch the server via `docker run -i --rm ...`, alongside the existing `npx` flow.

**Architecture:** Keep the MCP server on stdio and containerize the existing Node entrypoint without introducing HTTP/SSE bridging. Build the TypeScript project in the image, run the compiled CLI in the final container, and document both direct Docker usage and MCP client configuration that shells out to Docker.

**Tech Stack:** Node.js 22, npm, tsgo, Docker multi-stage build, Node test runner

---

### Task 1: Lock deployment expectations with failing tests

**Files:**
- Create: `test/docker-deployment.test.js`

**Step 1: Write the failing test**

Add assertions for:
- `Dockerfile` exists and uses a multi-stage Node 22 build
- final image runs `node dist/main.js`
- `.dockerignore` excludes `node_modules`, `dist`, and local metadata
- `README.md` includes `docker build`, `docker run -i --rm`, and MCP client config using `docker`

**Step 2: Run test to verify it fails**

Run: `node --test test/docker-deployment.test.js`
Expected: FAIL because the Docker assets and docs do not exist yet.

### Task 2: Add Docker packaging

**Files:**
- Create: `Dockerfile`
- Create: `.dockerignore`

**Step 1: Write minimal implementation**

Add a multi-stage Dockerfile that:
- uses `node:22-alpine` for both build and runtime
- copies `package.json` and `package-lock.json`
- runs `npm ci`
- copies source files and builds with `npm run build`
- starts with `node dist/main.js`

Add `.dockerignore` to keep build context small and exclude local state.

**Step 2: Run test to verify it passes**

Run: `node --test test/docker-deployment.test.js`
Expected: README assertions may still fail until docs are updated.

### Task 3: Update deployment documentation

**Files:**
- Modify: `README.md`

**Step 1: Write minimal implementation**

Document:
- local Docker build command
- direct Docker run command with `-i --rm` and env vars
- Claude Desktop / compatible MCP client config using `docker run -i --rm`
- relationship between `npx` and Docker deployment paths

**Step 2: Run test to verify it passes**

Run: `node --test test/docker-deployment.test.js`
Expected: PASS

### Task 4: Verify runtime and packaging

**Files:**
- Verify only

**Step 1: Run targeted verification**

Run:
- `node --test`
- `./node_modules/.bin/tsgo --noEmit`
- `npm run build`
- `npm pack --dry-run`
- `docker build -t sigma-streaming-platform-mcp .`

Expected:
- tests green
- typecheck green
- package tarball still only includes intended files
- Docker image builds successfully

