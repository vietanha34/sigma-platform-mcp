import type { SigmaHttpClient } from '../http-client';

export class SigmaMachineService {
  constructor(private readonly client: SigmaHttpClient) {}

  async listServers(appUuid: string, params?: { page?: number; perPage?: number; status?: string }) {
    return this.client.get('/api/machine/sigma-machines', params, appUuid);
  }

  async getServerInfo(appUuid: string, serverId: string) {
    return this.client.get(`/api/machine/sigma-machines/${serverId}`, undefined, appUuid);
  }
}
