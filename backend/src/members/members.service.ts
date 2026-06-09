import { randomBytes } from 'crypto';
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

export type CreateMemberResult = MemberRecord & { generatedPassword: string };

function generateSecurePassword(length = 16): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const special = '!@#$%&*';
  const all = upper + lower + digits + special;

  const pick = (charset: string, buf: Buffer): string =>
    charset[buf[0]! % charset.length] as string;

  const required = [
    pick(upper, randomBytes(1)),
    pick(lower, randomBytes(1)),
    pick(digits, randomBytes(1)),
    pick(special, randomBytes(1)),
  ];
  const remaining = Array.from(randomBytes(length - 4)).map((b) => all[b % all.length] as string);
  const combined: string[] = [...required, ...remaining];
  for (let i = combined.length - 1; i > 0; i--) {
    const j = randomBytes(1)[0]! % (i + 1);
    const tmp = combined[i]!;
    combined[i] = combined[j]!;
    combined[j] = tmp;
  }
  return combined.join('');
}

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
): Promise<CreateMemberResult> {
  const supabase = getSupabaseClient();
  const generatedPassword = generateSecurePassword();

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
    await supabase.auth.admin.updateUserById(existingProfile.id, { password: generatedPassword });
    const { data, error } = await supabase
      .from('profiles')
      .update({ name, role, status: 'active', ...extraFields })
      .eq('id', existingProfile.id)
      .select(SELECT_FIELDS)
      .single();
    if (error) throw error;
    return { ...(data as MemberRecord), generatedPassword };
  }

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password: generatedPassword,
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
        await supabase.auth.admin.updateUserById(orphan.id, { password: generatedPassword });
        const { data, error } = await supabase
          .from('profiles')
          .upsert(
            { id: orphan.id, email, name, role, status: 'active', ...extraFields },
            { onConflict: 'id' }
          )
          .select(SELECT_FIELDS)
          .single();
        if (error) throw error;
        return { ...(data as MemberRecord), generatedPassword };
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
  return { ...(data as MemberRecord), generatedPassword };
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
