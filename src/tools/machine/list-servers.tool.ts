import type { SigmaMachineService } from '../../services/sigma-machine.service';

export async function handleListServers(
  svc: SigmaMachineService,
  args: { appUuid: string; status?: string; page?: number; perPage?: number },
) {
  try {
    const result = await svc.listServers(args.appUuid, { page: args.page, perPage: args.perPage, status: args.status });
    return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { content: [{ type: 'text' as const, text: `Error: ${message}` }], isError: true };
  }
}
