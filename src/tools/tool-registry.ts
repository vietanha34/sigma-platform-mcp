import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { SigmaAuthService } from '../services/sigma-auth.service';
import type { SigmaMachineService } from '../services/sigma-machine.service';
import type { SigmaMediaLiveService } from '../services/sigma-media-live.service';
import { handleGetAppDetail } from './auth/get-app-detail.tool';
import { handleListApps } from './auth/list-apps.tool';
import { handleGetServerInfo } from './machine/get-server-info.tool';
import { handleListServers } from './machine/list-servers.tool';
import { handleCheckHealthSummary } from './media-live/check-health-summary.tool';
import { handleGetChannelDetail } from './media-live/get-channel-detail.tool';
import { handleListChannels } from './media-live/list-channels.tool';
import { handleListErrorChannels } from './media-live/list-error-channels.tool';
import { handleRestartChannel } from './media-live/restart-channel.tool';
import { handleStartChannel } from './media-live/start-channel.tool';
import { handleStopChannel } from './media-live/stop-channel.tool';

export interface Services {
  authService: SigmaAuthService;
  machineService: SigmaMachineService;
  mediaLiveService: SigmaMediaLiveService;
}

export function registerTools(server: McpServer, { authService, machineService, mediaLiveService }: Services) {
  // ── sigma-auth ──

  server.tool(
    'list_apps',
    'List all tenant apps/workspaces. Use the returned id field (UUID) as appUuid for subsequent operations. The slug field is human-readable only.',
    { page: z.number().optional(), perPage: z.number().optional(), search: z.string().optional() },
    (args) => handleListApps(authService, args),
  );

  server.tool('get_app_detail', 'Get detail of a specific tenant app by UUID id.', { appId: z.string() }, (args) =>
    handleGetAppDetail(authService, args),
  );

  // ── sigma-machine ──

  server.tool(
    'list_servers',
    'List media servers (transcoders) for a given app UUID.',
    {
      appUuid: z.string(),
      status: z.string().optional(),
      page: z.number().optional(),
      perPage: z.number().optional(),
    },
    (args) => handleListServers(machineService, args),
  );

  server.tool(
    'get_server_info',
    'Get detailed info for a specific server including config and current state. appUuid must be the app UUID.',
    { appUuid: z.string(), serverId: z.string() },
    (args) => handleGetServerInfo(machineService, args),
  );

  // ── sigma-media-live ──

  server.tool(
    'list_channels',
    'List live transcoding channels for an app UUID. Supports filtering by status and name.',
    {
      appUuid: z.string(),
      status: z.enum(['live', 'error', 'stop']).optional(),
      name: z.string().optional(),
      limit: z.number().optional(),
      skip: z.number().optional(),
    },
    (args) => handleListChannels(mediaLiveService, args),
  );

  server.tool(
    'get_channel_detail',
    'Get full detail of a single transcoding channel including config, inputs, targets, jobs. appUuid must be the app UUID.',
    { appUuid: z.string(), channelId: z.string() },
    (args) => handleGetChannelDetail(mediaLiveService, args),
  );

  server.tool(
    'list_error_channels',
    'List all channels currently in error state for an app UUID. Quick debugging overview.',
    { appUuid: z.string() },
    (args) => handleListErrorChannels(mediaLiveService, args),
  );

  server.tool(
    'check_health_summary',
    'Get a health overview for an app UUID: total channels and count by status (live, error, stop, etc.).',
    { appUuid: z.string() },
    (args) => handleCheckHealthSummary(mediaLiveService, args),
  );

  server.tool(
    'start_channel',
    'Start a stopped transcoding channel. appUuid must be the app UUID.',
    { appUuid: z.string(), channelId: z.string() },
    (args) => handleStartChannel(mediaLiveService, args),
  );

  server.tool(
    'stop_channel',
    'Stop a transcoding channel. appUuid must be the app UUID.',
    { appUuid: z.string(), channelId: z.string() },
    (args) => handleStopChannel(mediaLiveService, args),
  );

  server.tool(
    'restart_channel',
    'Restart a channel (stop + start). Best for error recovery. appUuid must be the app UUID.',
    { appUuid: z.string(), channelId: z.string() },
    (args) => handleRestartChannel(mediaLiveService, args),
  );
}
