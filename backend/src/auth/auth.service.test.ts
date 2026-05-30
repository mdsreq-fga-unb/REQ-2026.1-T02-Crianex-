import { describe, expect, it } from 'vitest';
import {
  loadAdminProfile,
  normalizeDisplayName,
  normalizeEmail,
  normalizeRole,
  parseBearerToken,
  parseCookieHeader,
} from './auth.service.js';

describe('auth service helpers', () => {
  it('parses bearer tokens from authorization headers', () => {
    expect(parseBearerToken('Bearer abc.def.ghi')).toBe('abc.def.ghi');
    expect(parseBearerToken('Basic token')).toBeNull();
    expect(parseBearerToken(null)).toBeNull();
  });

  it('parses cookies into a map', () => {
    expect(parseCookieHeader('access_token=abc; refresh_token=def')).toEqual({
      access_token: 'abc',
      refresh_token: 'def',
    });
    expect(parseCookieHeader(null)).toEqual({});
  });

  it('falls back to metadata and email when building the display name', () => {
    expect(normalizeDisplayName('  Hugo  ', 'hugo@example.com', null)).toBe('Hugo');
    expect(normalizeDisplayName(null, 'hugo@example.com', { name: '  Hugo Metadata  ' })).toBe(
      'Hugo Metadata'
    );
    expect(normalizeDisplayName(null, null, null)).toBe('Administrador');
  });

  it('normalizes the role with a member fallback', () => {
    expect(normalizeRole(' owner ')).toBe('owner');
    expect(normalizeRole(null)).toBe('member');
  });

  it('normalizes email addresses for allowlist checks', () => {
    expect(normalizeEmail(' Admin@Example.com ')).toBe('admin@example.com');
    expect(normalizeEmail(null)).toBe('');
  });
});

type ProfileRow = {
  id: string;
  name: string | null;
  role: string | null;
  email: string | null;
  status: string | null;
};

function createProfileClient(rows: ProfileRow[]) {
  return {
    from() {
      return {
        select() {
          return this;
        },
        eq(field: keyof ProfileRow, value: string) {
          return {
            async maybeSingle() {
              return {
                data: rows.find((row) => row[field] === value) ?? null,
                error: null,
              };
            },
          };
        },
      };
    },
  };
}

describe('loadAdminProfile', () => {
  it('authorizes active admin profiles matched by auth user id', async () => {
    const supabase = createProfileClient([
      {
        id: 'auth-user-id',
        name: 'Admin User',
        role: 'owner',
        email: 'admin@example.com',
        status: 'active',
      },
    ]);

    await expect(
      loadAdminProfile(supabase as never, 'auth-user-id', 'admin@example.com', null)
    ).resolves.toEqual({
      id: 'auth-user-id',
      name: 'Admin User',
      role: 'owner',
    });
  });

  it('authorizes Google sessions only when the email has an active admin profile', async () => {
    const supabase = createProfileClient([
      {
        id: 'existing-profile-id',
        name: 'Google Admin',
        role: 'member',
        email: 'admin@example.com',
        status: 'active',
      },
    ]);

    await expect(
      loadAdminProfile(supabase as never, 'google-auth-id', 'Admin@Example.com', null)
    ).resolves.toEqual({
      id: 'google-auth-id',
      name: 'Google Admin',
      role: 'member',
    });
  });

  it('rejects inactive or missing email profiles', async () => {
    const supabase = createProfileClient([
      {
        id: 'existing-profile-id',
        name: 'Inactive Admin',
        role: 'member',
        email: 'inactive@example.com',
        status: 'inactive',
      },
    ]);

    await expect(
      loadAdminProfile(supabase as never, 'google-auth-id', 'inactive@example.com', null)
    ).rejects.toMatchObject({
      status: 403,
      message: 'Conta não autorizada. Solicite acesso ao administrador.',
    });

    await expect(
      loadAdminProfile(supabase as never, 'google-auth-id', 'missing@example.com', null)
    ).rejects.toMatchObject({
      status: 403,
      message: 'Conta não autorizada. Solicite acesso ao administrador.',
    });
  });

  it('rejects active profiles without an admin role', async () => {
    const supabase = createProfileClient([
      {
        id: 'auth-user-id',
        name: 'Viewer User',
        role: 'viewer',
        email: 'viewer@example.com',
        status: 'active',
      },
    ]);

    await expect(
      loadAdminProfile(supabase as never, 'auth-user-id', 'viewer@example.com', null)
    ).rejects.toMatchObject({
      status: 403,
      message: 'Acesso restrito a administradores',
    });
  });
});
