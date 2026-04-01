export interface SigmaConfig {
  token: string;
  baseUrl: string;
}

export function loadConfig(): SigmaConfig {
  const token = process.env.SIGMA_TOKEN;
  if (!token) throw new Error('SIGMA_TOKEN is required');

  const baseUrl = process.env.SIGMA_BASE_URL;
  if (!baseUrl) throw new Error('SIGMA_BASE_URL is required');

  return { token, baseUrl: baseUrl.replace(/\/+$/, '') };
}
