import { env } from '$env/dynamic/public';

const BASE_URL = env.PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { token?: string }
): Promise<T> {
  const { token, ...fetchInit } = init ?? {};

  const res = await fetch(`${BASE_URL}${path}`, {
    ...fetchInit,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...fetchInit.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`[backend] ${res.status} ${res.statusText} — ${path}`);
  }

  return res.json() as Promise<T>;
}
