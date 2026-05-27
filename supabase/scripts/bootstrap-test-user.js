#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const url = process.env.PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Please set PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in the environment.');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  const testEmail = process.env.TEST_USER_EMAIL ?? 'tester@crianex.local';
  const testPassword = process.env.TEST_USER_PASSWORD ?? 'ChangeMe123!';

  const { data: existingProfile, error: profileErr } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('email', testEmail)
    .limit(1)
    .maybeSingle();

  if (profileErr) {
    console.error('Failed to query profiles:', profileErr.message ?? profileErr);
    process.exit(1);
  }

  if (existingProfile) {
    console.log('Test user already exists:', existingProfile);
    return;
  }

  const { data: createData, error: createErr } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true,
  });

  if (createErr) {
    console.error('Failed to create auth user:', createErr.message ?? createErr);
    process.exit(1);
  }

  const createdUser = createData?.user ?? createData ?? null;
  const userId = createdUser?.id ?? createdUser?.user?.id ?? createdUser?.uid ?? null;

  if (!userId) {
    console.error('Could not determine user id from Supabase response:', createData);
    process.exit(1);
  }

  const { error: profileUpdateErr } = await supabase.from('profiles').upsert(
    {
      id: userId,
      name: 'Teste',
      email: testEmail,
      role: 'member',
      status: 'active',
      avatar_url: null,
    },
    { onConflict: 'id' }
  );

  if (profileUpdateErr) {
    console.error('Failed to create profile:', profileUpdateErr.message ?? profileUpdateErr);
    process.exit(1);
  }

  console.log('Test user created:', { id: userId, email: testEmail });
  console.log('This account has no TOTP enrolled yet, so it should trigger the QR setup flow.');
  console.log('Change the password after first login.');
}

main().catch((e) => {
  console.error(e?.message ?? e);
  process.exit(1);
});