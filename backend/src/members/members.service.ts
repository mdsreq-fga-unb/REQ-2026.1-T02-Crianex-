import { getSupabaseClient } from '../config/supabase.js';

export type MemberRecord = {
  id: string;
  name: string | null;
  email: string;
  role: 'owner' | 'member';
  status: 'active' | 'inactive';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export class MemberServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'MemberServiceError';
  }
}

const SELECT_FIELDS = 'id, name, email, role, status, avatar_url, created_at, updated_at';

export async function listMembers(): Promise<MemberRecord[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .select(SELECT_FIELDS)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data as MemberRecord[]) ?? [];
}

export async function createMember(
  name: string,
  email: string,
  role: 'owner' | 'member'
): Promise<MemberRecord> {
  const supabase = getSupabaseClient();

  // Case 1: profile exists with a name → real duplicate
  // Case 2: profile exists without a name → ghost from a previous failed create → recover
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id, name')
    .eq('email', email)
    .maybeSingle();

  if (existingProfile?.name) {
    throw new MemberServiceError('E-mail já cadastrado na plataforma.', 'DUPLICATE_EMAIL');
  }

  if (existingProfile && !existingProfile.name) {
    // Ghost profile: auth user exists, trigger created profile but update failed before.
    // Just finish the update now.
    const { data, error } = await supabase
      .from('profiles')
      .update({ name, role })
      .eq('id', existingProfile.id)
      .select(SELECT_FIELDS)
      .single();
    if (error) throw error;
    return data as MemberRecord;
  }

  // Case 3: no profile at all → create auth user (trigger will create profile)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
  });

  if (authError) {
    const msg = authError.message.toLowerCase();
    const isDuplicate =
      msg.includes('already been registered') ||
      msg.includes('already exists') ||
      msg.includes('email_exists') ||
      (authError as unknown as { status?: number }).status === 422;

    if (isDuplicate) {
      // Case 4: auth user exists but profile was deleted manually (out-of-band).
      // Find the orphaned auth user and recreate their profile.
      const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
      const orphan = listData?.users?.find((u) => u.email?.toLowerCase() === email);

      if (orphan) {
        const { data, error } = await supabase
          .from('profiles')
          .upsert(
            { id: orphan.id, email, name, role, status: 'active' },
            { onConflict: 'id' }
          )
          .select(SELECT_FIELDS)
          .single();
        if (error) throw error;
        return data as MemberRecord;
      }

      throw new MemberServiceError('E-mail já cadastrado na plataforma.', 'DUPLICATE_EMAIL');
    }

    throw authError;
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ name, role })
    .eq('id', authData.user.id)
    .select(SELECT_FIELDS)
    .single();

  if (error) throw error;
  return data as MemberRecord;
}

export async function updateMemberStatus(
  id: string,
  status: 'active' | 'inactive',
  requesterId: string
): Promise<MemberRecord> {
  if (status === 'inactive' && id === requesterId) {
    throw new MemberServiceError('Não é possível inativar a própria conta.', 'SELF_DEACTIVATE');
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', id)
    .select(SELECT_FIELDS)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new MemberServiceError('Membro não encontrado.', 'NOT_FOUND');
  return data as MemberRecord;
}

export async function updateMember(
  id: string,
  updates: { name?: string; role?: 'owner' | 'member' }
): Promise<MemberRecord> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select(SELECT_FIELDS)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new MemberServiceError('Membro não encontrado.', 'NOT_FOUND');
  return data as MemberRecord;
}

export async function deleteMember(id: string, requesterId: string): Promise<void> {
  if (id === requesterId) {
    throw new MemberServiceError('Não é possível remover a própria conta.', 'SELF_DELETE');
  }

  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) throw error;
}
