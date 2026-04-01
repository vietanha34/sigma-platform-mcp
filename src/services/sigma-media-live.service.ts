import type { SigmaHttpClient } from '../http-client';

export class SigmaMediaLiveService {
  constructor(private readonly client: SigmaHttpClient) {}

  async listChannels(appUuid: string, params?: { status?: string; name?: string; limit?: number; skip?: number }) {
    return this.client.get('/api/transcode/channels/', params, appUuid);
  }

  async getChannelDetail(appUuid: string, channelId: string) {
    return this.client.get(`/api/transcode/channels/${channelId}`, undefined, appUuid);
  }

  async listErrorChannels(appUuid: string) {
    return this.client.get('/api/transcode/channels/', { status: 'error' }, appUuid);
  }

  async startChannel(appUuid: string, channelId: string) {
    return this.client.put(`/api/transcode/channels/${channelId}/actions/start`, {}, appUuid);
  }

  async stopChannel(appUuid: string, channelId: string) {
    return this.client.put(`/api/transcode/channels/${channelId}/actions/stop`, {}, appUuid);
  }

  async restartChannel(appUuid: string, channelId: string) {
    return this.client.put(`/api/transcode/channels/${channelId}/actions/reset`, {}, appUuid);
  }

  async checkHealthSummary(appUuid: string) {
    return this.client.get('/api/transcode/channels/', { limit: 1000 }, appUuid);
  }
}
