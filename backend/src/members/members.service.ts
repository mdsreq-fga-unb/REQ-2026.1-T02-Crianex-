import { getSupabaseClient } from '../config/supabase.js';

export type MemberRecord = {
  id: string;
  name: string | null;
  email: string;
  role: 'owner' | 'member';
  display_role: string | null;
  status: 'active' | 'inactive';
  permissions: Record<string, string[]>;
  avatar_url: string | null;
  last_sign_in_at?: string | null;
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

const SELECT_FIELDS =
  'id, name, email, role, display_role, status, permissions, avatar_url, created_at, updated_at';

export async function listMembers(): Promise<MemberRecord[]> {
  const supabase = getSupabaseClient();
  const [{ data: profiles, error }, { data: authData }] = await Promise.all([
    supabase.from('profiles').select(SELECT_FIELDS).order('created_at', { ascending: true }),
    supabase.auth.admin.listUsers({ perPage: 1000 }),
  ]);

  if (error) throw error;

  const signInMap = new Map((authData?.users ?? []).map((u) => [u.id, u.last_sign_in_at ?? null]));

  return ((profiles as MemberRecord[]) ?? []).map((p) => ({
    ...p,
    last_sign_in_at: signInMap.get(p.id) ?? null,
  }));
}

export async function createMember(
  name: string,
  email: string,
  role: 'owner' | 'member',
  display_role?: string,
  permissions?: Record<string, string[]>
): Promise<MemberRecord> {
  const supabase = getSupabaseClient();

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id, name')
    .eq('email', email)
    .maybeSingle();

  if (existingProfile?.name) {
    throw new MemberServiceError('E-mail já cadastrado na plataforma.', 'DUPLICATE_EMAIL');
  }

  const extraFields: Record<string, unknown> = {};
  if (display_role !== undefined) extraFields['display_role'] = display_role;
  if (permissions !== undefined) extraFields['permissions'] = permissions;

  if (existingProfile && !existingProfile.name) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ name, role, status: 'active', ...extraFields })
      .eq('id', existingProfile.id)
      .select(SELECT_FIELDS)
      .single();
    if (error) throw error;
    return data as MemberRecord;
  }

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
      const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
      const orphan = listData?.users?.find((u) => u.email?.toLowerCase() === email);

      if (orphan) {
        const { data, error } = await supabase
          .from('profiles')
          .upsert(
            { id: orphan.id, email, name, role, status: 'active', ...extraFields },
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
    .update({ name, role, status: 'active', ...extraFields })
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
  updates: {
    name?: string;
    role?: 'owner' | 'member';
    display_role?: string;
    permissions?: Record<string, string[]>;
  }
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

  const { data: profile } = await supabase.from('profiles').select('id').eq('id', id).maybeSingle();
  if (!profile) throw new MemberServiceError('Membro não encontrado.', 'NOT_FOUND');

  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) throw error;
}
