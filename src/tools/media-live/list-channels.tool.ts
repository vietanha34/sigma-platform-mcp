import type { SigmaMediaLiveService } from '../../services/sigma-media-live.service';

export async function handleListChannels(
  svc: SigmaMediaLiveService,
  args: { appUuid: string; status?: string; name?: string; limit?: number; skip?: number },
) {
  try {
    const result = await svc.listChannels(args.appUuid, {
      status: args.status,
      name: args.name,
      limit: args.limit,
      skip: args.skip,
    });
    return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { content: [{ type: 'text' as const, text: `Error: ${message}` }], isError: true };
  }
}
