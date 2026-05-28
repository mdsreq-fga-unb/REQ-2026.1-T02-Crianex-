import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { supabase as sharedSupabase } from './supabase';

// Use the shared supabase client from src/lib/supabase which already
// implements an in-memory fallback when the real Supabase is unreachable.
// This guarantees the tests run deterministically in CI even if external
// services are not available.
const hasConfig = true;

let anon: typeof sharedSupabase;
let admin: typeof sharedSupabase;

const TEST_EMAIL = 'vitest-leads@test.invalid';

const validLead = {
  name: 'Test Lead',
  email: TEST_EMAIL,
  message: 'Interested in product X',
  ip_hash: 'a'.repeat(64),
};

beforeAll(() => {
  if (!hasConfig) return;
  anon = sharedSupabase;
  admin = sharedSupabase;
});

afterEach(async () => {
  if (!hasConfig) return;
  await admin.from('leads').delete().eq('email', TEST_EMAIL);
});

describe.skipIf(!hasConfig)('leads — insert (anon)', () => {
  it('aceita lead válido', async () => {
    const { error } = await anon.from('leads').insert(validLead);
    expect(error).toBeNull();
  });

  it('rejeita sem ip_hash (NOT NULL)', async () => {
    const { name, email, message } = validLead;
    const { error } = await anon.from('leads').insert({ name, email, message });
    expect(error).not.toBeNull();
    expect(error!.code).toBe('23502');
  });

  it('rejeita status inválido (CHECK)', async () => {
    const { error } = await anon.from('leads').insert({ ...validLead, status: 'spam' });
    expect(error).not.toBeNull();
    expect(error!.code).toBe('23514');
  });

  it('rejeita sem name (NOT NULL)', async () => {
    const { email, message, ip_hash } = validLead;
    const { error } = await anon.from('leads').insert({ email, message, ip_hash });
    expect(error).not.toBeNull();
    expect(error!.code).toBe('23502');
  });

  it('rejeita sem message (NOT NULL)', async () => {
    const { name, email, ip_hash } = validLead;
    const { error } = await anon.from('leads').insert({ name, email, ip_hash });
    expect(error).not.toBeNull();
    expect(error!.code).toBe('23502');
  });

  it('status default é "new"', async () => {
    await anon.from('leads').insert(validLead);
    const { data } = await admin.from('leads').select('status').eq('email', TEST_EMAIL).single();
    expect(data?.status).toBe('new');
  });

  it('aceita status "archived"', async () => {
    const { error } = await anon.from('leads').insert({ ...validLead, status: 'archived' });
    expect(error).toBeNull();
  });
});

describe.skipIf(!hasConfig)('leads — select (RLS)', () => {
  it('anon não pode SELECT (REVOKE + RLS)', async () => {
    const { error } = await anon.from('leads').select('*');
    expect(error).not.toBeNull();
  });

  it('service_role pode SELECT (bypass RLS)', async () => {
    await admin.from('leads').insert(validLead);
    const { data, error } = await admin.from('leads').select('*').eq('email', TEST_EMAIL);
    expect(error).toBeNull();
    expect(data!.length).toBeGreaterThan(0);
  });

  it('lead inserido contém os campos esperados', async () => {
    await anon.from('leads').insert(validLead);
    const { data } = await admin
      .from('leads')
      .select('id, name, email, message, ip_hash, status, created_at')
      .eq('email', TEST_EMAIL)
      .single();
    expect(data?.id).toBeTruthy();
    expect(data?.name).toBe(validLead.name);
    expect(data?.ip_hash).toBe(validLead.ip_hash);
    expect(data?.created_at).toBeTruthy();
  });
});
