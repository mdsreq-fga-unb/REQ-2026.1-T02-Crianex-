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
  const ownerEmail = process.env.OWNER_EMAIL ?? 'owner@crianex.local';
  const ownerPassword = process.env.OWNER_PASSWORD ?? 'ChangeMe123!';

  // Check for existing owner
  const { data: existingOwners, error: ownersErr } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('role', 'owner')
    .limit(1);

  if (ownersErr) {
    console.error('Failed to query profiles:', ownersErr.message ?? ownersErr);
    process.exit(1);
  }

  if (existingOwners && existingOwners.length > 0) {
    console.log('Owner already exists:', existingOwners[0]);
    return;
  }

  // Create auth user via Admin API
  const { data: createData, error: createErr } = await supabase.auth.admin.createUser({
    email: ownerEmail,
    password: ownerPassword,
    email_confirm: true,
  });

  if (createErr) {
    console.error('Failed to create auth user:', createErr.message ?? createErr);
    process.exit(1);
  }

  // `createData` shape may vary; try to extract id
  const createdUser = createData?.user ?? createData ?? null;
  const userId = createdUser?.id ?? createdUser?.user?.id ?? createdUser?.uid ?? null;

  if (!userId) {
    console.error('Could not determine user id from Supabase response:', createData);
    process.exit(1);
  }

  // O trigger handle_new_user já inseriu o profile com role='member'.
  // Promove para owner via update (service role ignora RLS).
  const { error: profileErr } = await supabase
    .from('profiles')
    .update({ name: 'Owner', role: 'owner' })
    .eq('id', userId);

  if (profileErr) {
    console.error('Failed to promote profile to owner:', profileErr.message ?? profileErr);
    process.exit(1);
  }

  console.log('Owner created:', { id: userId, email: ownerEmail });
  console.log('Change the password after first login.');
}

main().catch((e) => {
  console.error(e?.message ?? e);
  process.exit(1);
});
