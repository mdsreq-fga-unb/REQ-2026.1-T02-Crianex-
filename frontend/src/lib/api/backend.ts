import { env } from '$env/dynamic/public';
import { browser } from '$app/environment';
import { supabase } from './supabase';

// In Docker, SSR runs inside the frontend container and cannot reach localhost:3000.
// PUBLIC_API_SSR_BASE_URL uses the Docker service name (http://backend:3000) for
// container-to-container communication. The browser still uses PUBLIC_API_BASE_URL.
const BASE_URL =
  !browser && env.PUBLIC_API_SSR_BASE_URL
    ? env.PUBLIC_API_SSR_BASE_URL
    : (env.PUBLIC_API_BASE_URL ?? 'http://localhost:3000');
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

  // frontend and backend live on different Render subdomains, which the
  // browser treats as different sites (onrender.com is on the public suffix
  // list) — cookies set by SvelteKit never reach the backend cross-site, so
  // the access token must be sent explicitly as a Bearer header.
  let authToken = token;
  if (!authToken && browser && supabase) {
    authToken = (await supabase.auth.getSession()).data.session?.access_token;
  }

  const res = await fetch(`${BASE_URL}${API_PREFIX}${normalizedPath}`, {
    cache: 'no-store',
    ...fetchInit,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
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
