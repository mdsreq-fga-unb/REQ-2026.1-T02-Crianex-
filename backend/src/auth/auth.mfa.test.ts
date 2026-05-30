import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as authService from './auth.service.js';
import { createClient } from '@supabase/supabase-js';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}));

process.env['SUPABASE_URL'] = 'http://localhost:54321';
process.env['SUPABASE_SECRET_KEY'] = 'service-role-key';
process.env['PUBLIC_SUPABASE_PUBLISHABLE_KEY'] = 'anon-key';

describe('challengeAndVerifyTotp error mapping', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('maps expired verification to reason "expired"', async () => {
    const mockClient = {
      auth: {
        mfa: {
          listFactors: vi
            .fn()
            .mockResolvedValue({ data: { totp: [{ id: 'f1' }], all: [] }, error: null }),
          challenge: vi.fn().mockResolvedValue({ data: { id: 'c1' }, error: null }),
          verify: vi
            .fn()
            .mockResolvedValue({ data: null, error: { message: 'challenge expired' } }),
        },
      },
    } as unknown as ReturnType<typeof createClient>;

    vi.mocked(createClient).mockReturnValue(mockClient);

    await expect(authService.challengeAndVerifyTotp('token', '123456')).rejects.toMatchObject({
      reason: 'expired',
    });
  });

  it('maps invalid verification to reason "invalid"', async () => {
    const mockClient = {
      auth: {
        mfa: {
          listFactors: vi
            .fn()
            .mockResolvedValue({ data: { totp: [{ id: 'f1' }], all: [] }, error: null }),
          challenge: vi.fn().mockResolvedValue({ data: { id: 'c1' }, error: null }),
          verify: vi.fn().mockResolvedValue({ data: null, error: { message: 'invalid code' } }),
        },
      },
    } as unknown as ReturnType<typeof createClient>;

    vi.mocked(createClient).mockReturnValue(mockClient);

    await expect(authService.challengeAndVerifyTotp('token', '000000')).rejects.toMatchObject({
      reason: 'invalid',
    });
  });
});
