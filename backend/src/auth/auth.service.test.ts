import { describe, expect, it } from 'vitest';
import {
  normalizeDisplayName,
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
});
