import type { SigmaMachineService } from '../../services/sigma-machine.service';

export async function handleGetServerInfo(svc: SigmaMachineService, args: { appUuid: string; serverId: string }) {
  try {
    const result = await svc.getServerInfo(args.appUuid, args.serverId);
    return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { content: [{ type: 'text' as const, text: `Error: ${message}` }], isError: true };
  }
}
