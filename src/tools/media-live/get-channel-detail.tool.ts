import type { SigmaMediaLiveService } from '../../services/sigma-media-live.service';

export async function handleGetChannelDetail(svc: SigmaMediaLiveService, args: { appUuid: string; channelId: string }) {
  try {
    const result = await svc.getChannelDetail(args.appUuid, args.channelId);
    return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { content: [{ type: 'text' as const, text: `Error: ${message}` }], isError: true };
  }
}
