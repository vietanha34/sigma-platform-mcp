#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config';
import { SigmaHttpClient } from './http-client';
import { SigmaAuthService } from './services/sigma-auth.service';
import { SigmaMachineService } from './services/sigma-machine.service';
import { SigmaMediaLiveService } from './services/sigma-media-live.service';
import { registerTools } from './tools/tool-registry';

async function main() {
  const config = loadConfig();
  const client = new SigmaHttpClient(config.baseUrl, config.token);

  const server = new McpServer({ name: 'sigma-streaming-platform-mcp', version: '1.0.1' });

  registerTools(server, {
    authService: new SigmaAuthService(client),
    machineService: new SigmaMachineService(client),
    mediaLiveService: new SigmaMediaLiveService(client),
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write('Sigma Platform MCP server running on stdio\n');
}

main().catch((err) => {
  process.stderr.write(`Fatal: ${err.message}\n`);
  process.exit(1);
});
