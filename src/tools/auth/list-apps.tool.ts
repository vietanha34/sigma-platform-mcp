import type { SigmaAuthService } from '../../services/sigma-auth.service';
import { type RawAppsResponse, summarizeAppsResponse } from './app-summary';

export async function handleListApps(
  svc: SigmaAuthService,
  args: { page?: number; perPage?: number; search?: string },
) {
  try {
    const result = await svc.listApps({ page: args.page, perPage: args.perPage, name: args.search });
    return {
      content: [
        { type: 'text' as const, text: JSON.stringify(summarizeAppsResponse(result as RawAppsResponse), null, 2) },
      ],
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { content: [{ type: 'text' as const, text: `Error: ${message}` }], isError: true };
  }
}
