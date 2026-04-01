import type { SigmaHttpClient } from '../http-client';

export class SigmaAuthService {
  constructor(private readonly client: SigmaHttpClient) {}

  async listApps(params?: { page?: number; perPage?: number; name?: string }) {
    return this.client.get('/auth-service/v1/apps', params);
  }

  async getAppDetail(appId: string) {
    return this.client.get(`/auth-service/v1/apps/${appId}`);
  }
}
