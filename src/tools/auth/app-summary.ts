export interface RawAppSummary {
  id: string;
  appId?: string;
  name?: string;
  status?: string;
  products?: string[];
}

export interface AppSummary {
  id: string;
  slug: string | null;
  name: string | null;
  status: string | null;
  products: string[];
}

export interface RawAppsResponse {
  data?: RawAppSummary[];
  total?: number;
  count?: number;
  page?: number;
  perPage?: number;
}

export interface AppsResponseSummary {
  data: AppSummary[];
  total: number;
  count: number;
  page: number;
  perPage: number;
}

export function summarizeApp(app: RawAppSummary): AppSummary {
  return {
    id: app.id,
    slug: app.appId ?? null,
    name: app.name ?? null,
    status: app.status ?? null,
    products: app.products ?? [],
  };
}

export function summarizeAppsResponse(payload: RawAppsResponse): AppsResponseSummary {
  return {
    data: (payload.data ?? []).map(summarizeApp),
    total: payload.total ?? 0,
    count: payload.count ?? 0,
    page: payload.page ?? 1,
    perPage: payload.perPage ?? 10,
  };
}
