import type { SigmaMediaLiveService } from '../../services/sigma-media-live.service';

export async function handleCheckHealthSummary(svc: SigmaMediaLiveService, args: { appUuid: string }) {
  try {
    const result = await svc.checkHealthSummary(args.appUuid);
    const channels: Array<{ status?: string }> = Array.isArray(result)
      ? result
      : ((result as { data?: Array<{ status?: string }> }).data ?? []);

    const summary: Record<string, number> = {};
    for (const ch of channels) {
      const s = ch.status ?? 'unknown';
      summary[s] = (summary[s] ?? 0) + 1;
    }

    const text = JSON.stringify({ total: channels.length, byStatus: summary }, null, 2);
    return { content: [{ type: 'text' as const, text }] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { content: [{ type: 'text' as const, text: `Error: ${message}` }], isError: true };
  }
}
