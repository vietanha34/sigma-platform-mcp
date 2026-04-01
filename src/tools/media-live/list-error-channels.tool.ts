import type { SigmaMediaLiveService } from '../../services/sigma-media-live.service';

export async function handleListErrorChannels(svc: SigmaMediaLiveService, args: { appUuid: string }) {
  try {
    const result = await svc.listErrorChannels(args.appUuid);
    return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { content: [{ type: 'text' as const, text: `Error: ${message}` }], isError: true };
  }
}
