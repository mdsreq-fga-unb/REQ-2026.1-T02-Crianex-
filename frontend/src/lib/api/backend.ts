import { env } from '$env/dynamic/public';

const BASE_URL = env.PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { token?: string }
): Promise<T> {
  const { token, ...fetchInit } = init ?? {};

  const res = await fetch(`${BASE_URL}${path}`, {
    ...fetchInit,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...fetchInit.headers,
    },
  });

  if (!res.ok) {
    const payload = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new ApiError(
      payload?.message ?? `[backend] ${res.status} ${res.statusText} — ${path}`,
      res.status
    );
  }

  return res.json() as Promise<T>;
}
