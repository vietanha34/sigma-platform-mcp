import type { SigmaAuthService } from '../../services/sigma-auth.service';

export async function handleGetAppDetail(svc: SigmaAuthService, args: { appId: string }) {
  try {
    const result = await svc.getAppDetail(args.appId);
    return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { content: [{ type: 'text' as const, text: `Error: ${message}` }], isError: true };
  }
}
