# sigma-streaming-platform-mcp

MCP server for Sigma Streaming Platform. Lets DevOps operators query and operate the platform from any AI client (Claude Desktop, Cursor, Kiro).

## Prerequisites

1. A Personal API Token — create at your Sigma portal under **Settings → API Tokens**
2. Node.js 22+

## Setup

```bash
cd /path/to/sigma-streaming-platform-mcp
npm install
npm run build    # uses tsgo (TypeScript native compiler)
npm run lint     # uses Biome for linting + formatting
npm run lint:fix # auto-fix
```

## Deployment Options

This MCP supports two deployment paths without changing the server architecture:

1. `npx` for direct local execution
2. Docker for a containerized stdio process launched via `docker run -i --rm sigmastreaming/cloud-mcp`

Choose Docker when your MCP client can invoke Docker directly and you want isolated runtime dependencies.

## Run Via npx

The package currently published on npm is `@sigmaott/cloud-mcp`. Run the MCP server directly with:

```bash
SIGMA_TOKEN=pat_your_token_here \
SIGMA_BASE_URL=https://api.sigma.example.com \
npx -y @sigmaott/cloud-mcp
```

This works because the package exposes a CLI binary pointing to `dist/main.js`.

## Run Via Docker

Build the image from this repository:

```bash
docker build -t sigmastreaming/cloud-mcp .
```

Or use the bundled script:

```bash
npm run docker:build
```

Run the MCP server as a stdio container:

```bash
docker run -i --rm \
  -e SIGMA_TOKEN=pat_your_token_here \
  -e SIGMA_BASE_URL=https://api.sigma.example.com \
  sigmastreaming/cloud-mcp:latest
```

Or, if you prefer to pass environment variables from your current shell:

```bash
export SIGMA_TOKEN=pat_your_token_here
export SIGMA_BASE_URL=https://api.sigma.example.com
npm run docker:run
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SIGMA_TOKEN` | ✅ | Personal API Token (`pat_...`) |
| `SIGMA_BASE_URL` | ✅ | Traefik ingress URL (e.g. `https://api.sigma.example.com`) |

## Claude Desktop Configuration

### Using npx

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "sigma-streaming-platform": {
      "command": "npx",
      "args": ["-y", "@sigmaott/cloud-mcp"],
      "env": {
        "SIGMA_TOKEN": "pat_your_token_here",
        "SIGMA_BASE_URL": "https://api.sigma.example.com"
      }
    }
  }
}
```

### Using Docker

If Claude Desktop on your machine can invoke Docker directly, use:

```json
{
  "mcpServers": {
    "sigma-streaming-platform": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "SIGMA_TOKEN",
        "-e",
        "SIGMA_BASE_URL",
        "sigmastreaming/cloud-mcp:latest"
      ],
      "env": {
        "SIGMA_TOKEN": "pat_your_token_here",
        "SIGMA_BASE_URL": "https://api.sigma.example.com"
      }
    }
  }
}
```

## Kiro CLI Configuration

### Using npx

Add to `~/.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "sigma-streaming-platform": {
      "command": "npx",
      "args": ["-y", "@sigmaott/cloud-mcp"],
      "env": {
        "SIGMA_TOKEN": "pat_your_token_here",
        "SIGMA_BASE_URL": "https://api.sigma.example.com"
      }
    }
  }
}
```

### Using Docker

```json
{
  "mcpServers": {
    "sigma-streaming-platform": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "SIGMA_TOKEN",
        "-e",
        "SIGMA_BASE_URL",
        "sigmastreaming/cloud-mcp:latest"
      ],
      "env": {
        "SIGMA_TOKEN": "pat_your_token_here",
        "SIGMA_BASE_URL": "https://api.sigma.example.com"
      }
    }
  }
}
```

## Local Development (kubectl port-forward)

If accessing via port-forward to the Traefik ingress:

```bash
kubectl port-forward svc/traefik 8080:80 -n traefik
```

Then use:

```
SIGMA_BASE_URL=http://localhost:8080
```

## Available Tools

| Tool | Params | Description |
|------|--------|-------------|
| `list_apps` | page?, perPage?, search? | List all tenant apps/workspaces |
| `get_app_detail` | appId | Get app detail |
| `list_servers` | appId, page?, perPage? | List media servers for an app |
| `get_server_info` | appId, serverId | Get server detail |
| `list_channels` | appId, status?, name?, page?, perPage? | List transcoding channels |
| `get_channel_detail` | appId, channelId | Get channel detail |
| `list_error_channels` | appId | List channels in error state |
| `start_channel` | appId, channelId | Start a stopped channel |
| `stop_channel` | appId, channelId | Stop a channel |
| `restart_channel` | appId, channelId | Restart a channel (error recovery) |

## Typical Workflow

```
User: "Tìm xem app nào đang có channel lỗi"

AI → list_apps()
   → [{id: "app_abc", name: "VTV Live"}, ...]

AI → list_error_channels(appId: "app_abc")
   → [{channelId: "ch_1", name: "VTV HD", status: "error"}]

AI → restart_channel(appId: "app_abc", channelId: "ch_1")
   → {success: true}
```

## Adding More Services

1. Create `src/services/sigma-<name>.service.ts`
2. Create `src/tools/<name>/` with tool handlers
3. Register in `src/tools/tool-registry.ts`
4. Add service instance in `src/main.ts`

## Publish To npm

1. Use the published package name `@sigmaott/cloud-mcp`.
2. Run `npm login`.
3. Bump the version with `npm version patch` (or `minor` / `major`).
4. Publish with `npm publish`.

Because `prepack` runs `npm run build` and `files` only includes `dist` plus `README.md`, the published tarball is ready for `npx` and excludes local workspace artifacts.

## Docker Notes

- This image keeps the MCP transport on stdio; it does not expose HTTP or SSE.
- Use `docker run -i` so stdin/stdout remain attached to the MCP client.
- Rebuild the image after changing source code or package dependencies.
