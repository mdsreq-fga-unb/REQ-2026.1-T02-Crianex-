#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const url = process.env.PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? 'http://127.0.0.1:54321';
const serviceKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceKey) {
  console.error('Please set SUPABASE_SECRET_KEY in the environment');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  const email = process.env.TEST_USER_EMAIL ?? 'tester@crianex.local';
  const password = process.env.TEST_USER_PASSWORD ?? 'ChangeMe123!';

  // Find profile
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('id,email')
    .eq('email', email)
    .maybeSingle();

  if (profileErr) {
    console.error('Failed to query profiles:', profileErr.message ?? profileErr);
    process.exit(1);
  }

  if (!profile?.id) {
    console.error('No profile found for', email);
    process.exit(1);
  }

  const userId = profile.id;

  const { data, error } = await supabase.auth.admin.updateUserById(userId, { password });

  if (error) {
    console.error('Failed to update user password:', error.message ?? error);
    process.exit(1);
  }

  console.log('Password updated for user', email);
}

main().catch((e) => {
  console.error(e?.message ?? e);
  process.exit(1);
});
