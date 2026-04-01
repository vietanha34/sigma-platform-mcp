import axios, { type AxiosInstance } from 'axios';

export class SigmaHttpClient {
  private readonly client: AxiosInstance;

  constructor(baseUrl: string, token: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 15000,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async get<T = unknown>(path: string, params?: object, appId?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (appId) headers['x-app-id'] = appId;
    const res = await this.client.get<T>(path, { params, headers });
    return res.data;
  }

  async post<T = unknown>(path: string, body?: object, appId?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (appId) headers['x-app-id'] = appId;
    const res = await this.client.post<T>(path, body, { headers });
    return res.data;
  }

  async put<T = unknown>(path: string, body?: object, appId?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (appId) headers['x-app-id'] = appId;
    const res = await this.client.put<T>(path, body, { headers });
    return res.data;
  }
}
