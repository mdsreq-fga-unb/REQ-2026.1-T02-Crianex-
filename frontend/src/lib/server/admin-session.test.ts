import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_COOKIE,
  ADMIN_SESSION_EXPIRES_COOKIE,
  readAdminSessionCookies,
  setAdminSessionCookies,
  clearAdminSessionCookies,
  getAuthenticatedAdminSession,
} from './admin-session';

vi.mock('$env/dynamic/public', () => ({ env: {} }));
vi.mock('$lib/api/backend', () => ({ ApiError: class ApiError extends Error {} }));
vi.mock('$lib/api/admin-auth', () => ({
  authorizeAdminSession: vi.fn().mockResolvedValue({ id: 'u1', name: 'Admin', role: 'owner' }),
}));

function makeCookies(initial: Record<string, string> = {}) {
  const store: Record<string, string> = { ...initial };
  const calls = { set: [] as { name: string; value: string; opts: Record<string, unknown> }[] };

  return {
    store,
    calls,
    get: (name: string) => store[name] ?? undefined,
    set: (name: string, value: string, opts: Record<string, unknown> = {}) => {
      store[name] = value;
      calls.set.push({ name, value, opts });
    },
    delete: (name: string) => {
      delete store[name];
    },
  };
}

describe('readAdminSessionCookies', () => {
  it('retorna null quando sem tokens', () => {
    expect(readAdminSessionCookies(makeCookies() as never)).toBeNull();
  });

  it('lê sessionExpiresAt do cookie quando presente', () => {
    const cookies = makeCookies({
      [ADMIN_ACCESS_TOKEN_COOKIE]: 'acc',
      [ADMIN_REFRESH_TOKEN_COOKIE]: 'ref',
      [ADMIN_SESSION_EXPIRES_COOKIE]: '9999999999',
    });
    const result = readAdminSessionCookies(cookies as never);
    expect(result?.sessionExpiresAt).toBe(9999999999);
  });

  it('sessionExpiresAt é null quando cookie ausente', () => {
    const cookies = makeCookies({
      [ADMIN_REFRESH_TOKEN_COOKIE]: 'ref',
    });
    const result = readAdminSessionCookies(cookies as never);
    expect(result?.sessionExpiresAt).toBeNull();
  });
});

describe('setAdminSessionCookies', () => {
  let cookies: ReturnType<typeof makeCookies>;

  beforeEach(() => {
    cookies = makeCookies();
  });

  it('define os 3 cookies de sessão', () => {
    const now = Math.floor(Date.now() / 1000);
    setAdminSessionCookies(cookies as never, {
      accessToken: 'acc',
      refreshToken: 'ref',
      expiresAt: now + 3600,
    });

    expect(cookies.store[ADMIN_ACCESS_TOKEN_COOKIE]).toBe('acc');
    expect(cookies.store[ADMIN_REFRESH_TOKEN_COOKIE]).toBe('ref');
    expect(cookies.store[ADMIN_SESSION_EXPIRES_COOKIE]).toBeDefined();
  });

  it('sessionExpiresAt padrão é ~8h a partir de agora', () => {
    const before = Math.floor(Date.now() / 1000);
    setAdminSessionCookies(cookies as never, { accessToken: 'a', refreshToken: 'r' });
    const after = Math.floor(Date.now() / 1000);

    const stored = parseInt(cookies.store[ADMIN_SESSION_EXPIRES_COOKIE] ?? '', 10);
    expect(stored).toBeGreaterThanOrEqual(before + 8 * 3600);
    expect(stored).toBeLessThanOrEqual(after + 8 * 3600);
  });

  it('preserva sessionExpiresAt quando fornecido (não estende janela)', () => {
    const fixedExpiry = 1_800_000_000; // timestamp futuro fixo
    setAdminSessionCookies(cookies as never, {
      accessToken: 'a',
      refreshToken: 'r',
      sessionExpiresAt: fixedExpiry,
    });

    expect(cookies.store[ADMIN_SESSION_EXPIRES_COOKIE]).toBe(String(fixedExpiry));
  });

  it('maxAge do refresh token respeita sessionExpiresAt', () => {
    const now = Math.floor(Date.now() / 1000);
    const fixedExpiry = now + 1800; // 30 min restantes
    setAdminSessionCookies(cookies as never, {
      accessToken: 'a',
      refreshToken: 'r',
      sessionExpiresAt: fixedExpiry,
    });

    const refreshCall = cookies.calls.set.find((c) => c.name === ADMIN_REFRESH_TOKEN_COOKIE);
    expect(refreshCall?.opts['maxAge']).toBeGreaterThan(0);
    expect(refreshCall?.opts['maxAge'] as number).toBeLessThanOrEqual(1800);
  });
});

describe('clearAdminSessionCookies', () => {
  it('remove os 3 cookies incluindo o novo', () => {
    const cookies = makeCookies({
      [ADMIN_ACCESS_TOKEN_COOKIE]: 'acc',
      [ADMIN_REFRESH_TOKEN_COOKIE]: 'ref',
      [ADMIN_SESSION_EXPIRES_COOKIE]: '9999999999',
    });

    clearAdminSessionCookies(cookies as never);

    expect(cookies.store[ADMIN_ACCESS_TOKEN_COOKIE]).toBeUndefined();
    expect(cookies.store[ADMIN_REFRESH_TOKEN_COOKIE]).toBeUndefined();
    expect(cookies.store[ADMIN_SESSION_EXPIRES_COOKIE]).toBeUndefined();
  });
});

describe('getAuthenticatedAdminSession — expiração absoluta', () => {
  it('limpa cookies e retorna null quando sessionExpiresAt já passou', async () => {
    const expiredAt = Math.floor(Date.now() / 1000) - 1; // 1s no passado
    const cookies = makeCookies({
      [ADMIN_REFRESH_TOKEN_COOKIE]: 'ref',
      [ADMIN_SESSION_EXPIRES_COOKIE]: String(expiredAt),
    });

    const result = await getAuthenticatedAdminSession(cookies as never);

    expect(result).toBeNull();
    expect(cookies.store[ADMIN_REFRESH_TOKEN_COOKIE]).toBeUndefined();
    expect(cookies.store[ADMIN_SESSION_EXPIRES_COOKIE]).toBeUndefined();
  });

  it('retorna null sem refreshToken', async () => {
    const cookies = makeCookies({});
    const result = await getAuthenticatedAdminSession(cookies as never);
    expect(result).toBeNull();
  });
});
