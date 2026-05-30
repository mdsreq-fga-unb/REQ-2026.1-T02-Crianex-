import { env } from '$env/dynamic/public';

const BASE_URL = env.PUBLIC_API_BASE_URL ?? 'http://localhost:3000';
const API_PREFIX = '/api';

export class ApiError extends Error {
  status: number;
  reason?: string;

  constructor(message: string, status: number, reason?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.reason = reason;
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { token?: string }
): Promise<T> {
  const { token, ...fetchInit } = init ?? {};
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const res = await fetch(`${BASE_URL}${API_PREFIX}${normalizedPath}`, {
    cache: 'no-store',
    ...fetchInit,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...fetchInit.headers,
    },
  });

  if (res.status === 304) {
    return undefined as unknown as T;
  }

  if (res.status === 204) {
    return undefined as unknown as T;
  }

  if (!res.ok) {
    const payload = (await res.json().catch(() => null)) as {
      message?: string;
      reason?: string;
    } | null;
    throw new ApiError(
      payload?.message ??
        `[backend] ${res.status} ${res.statusText} — ${API_PREFIX}${normalizedPath}`,
      res.status,
      payload?.reason
    );
  }

  return res.json() as Promise<T>;
}
