import { getSupabaseClient } from '../config/supabase.js';

export interface MemberProfile {
  id: string;
  name: string | null;
  email: string | null;
  role: 'owner' | 'member';
  status: 'active' | 'inactive';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface MemberUpdateInput {
  name?: string;
  role?: 'owner' | 'member';
  avatar_url?: string | null;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class MemberServiceError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'MemberServiceError';
    this.status = status;
  }
}

export async function listAllMembers(): Promise<MemberProfile[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, role, status, avatar_url, created_at, updated_at')
    .order('name', { ascending: true });

  if (error) {
    throw new MemberServiceError(error.message, 500);
  }

  return (data || []) as MemberProfile[];
}

export async function createMember(
  name: string,
  email: string,
  role: 'owner' | 'member'
): Promise<MemberProfile> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!name.trim()) {
    throw new MemberServiceError('Nome é obrigatório.', 400);
  }

  if (!EMAIL_RE.test(normalizedEmail)) {
    throw new MemberServiceError('E-mail inválido.', 400);
  }

  if (role !== 'owner' && role !== 'member') {
    throw new MemberServiceError('Papel inválido.', 400);
  }

  const supabase = getSupabaseClient();

  // Check if profile/email already exists
  const { data: existing, error: findError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (findError) {
    throw new MemberServiceError(findError.message, 500);
  }

  if (existing) {
    throw new MemberServiceError('E-mail já cadastrado.', 409);
  }

  // Invite user via Supabase Auth Admin API
  const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
    normalizedEmail,
    {
      data: { name: name.trim() },
    }
  );

  if (inviteError) {
    if (
      inviteError.status === 409 ||
      inviteError.message.toLowerCase().includes('already exists')
    ) {
      throw new MemberServiceError('E-mail já cadastrado.', 409);
    }
    throw new MemberServiceError(inviteError.message, inviteError.status || 500);
  }

  const userId = inviteData.user.id;

  // The database trigger public.handle_new_user() automatically inserts a row in public.profiles.
  // However, it sets the default role to 'member'. We must update the profile to set the custom name and role.
  const { data: updatedProfile, error: updateError } = await supabase
    .from('profiles')
    .update({
      name: name.trim(),
      role,
    })
    .eq('id', userId)
    .select('id, name, email, role, status, avatar_url, created_at, updated_at')
    .single();

  if (updateError) {
    // Attempt clean up of invited user if profile update fails
    await supabase.auth.admin.deleteUser(userId).catch(() => {});
    throw new MemberServiceError(
      `Falha ao configurar perfil do membro: ${updateError.message}`,
      500
    );
  }

  return updatedProfile as MemberProfile;
}

export async function updateMember(id: string, updates: MemberUpdateInput): Promise<MemberProfile> {
  const supabase = getSupabaseClient();

  const filteredUpdates: Record<string, unknown> = {};
  if (updates.name !== undefined) {
    if (!updates.name.trim()) {
      throw new MemberServiceError('Nome não pode ser vazio.', 400);
    }
    filteredUpdates.name = updates.name.trim();
  }

  if (updates.role !== undefined) {
    if (updates.role !== 'owner' && updates.role !== 'member') {
      throw new MemberServiceError('Papel inválido.', 400);
    }
    filteredUpdates.role = updates.role;
  }

  if (updates.avatar_url !== undefined) {
    filteredUpdates.avatar_url = updates.avatar_url;
  }

  if (Object.keys(filteredUpdates).length === 0) {
    throw new MemberServiceError('Nenhum campo para atualizar foi fornecido.', 400);
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(filteredUpdates)
    .eq('id', id)
    .select('id, name, email, role, status, avatar_url, created_at, updated_at')
    .maybeSingle();

  if (error) {
    throw new MemberServiceError(error.message, 500);
  }

  if (!data) {
    throw new MemberServiceError('Membro não encontrado.', 404);
  }

  return data as MemberProfile;
}

export async function updateMemberStatus(
  id: string,
  status: 'active' | 'inactive'
): Promise<MemberProfile> {
  if (status !== 'active' && status !== 'inactive') {
    throw new MemberServiceError('Status inválido.', 400);
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', id)
    .select('id, name, email, role, status, avatar_url, created_at, updated_at')
    .maybeSingle();

  if (error) {
    throw new MemberServiceError(error.message, 500);
  }

  if (!data) {
    throw new MemberServiceError('Membro não encontrado.', 404);
  }

  return data as MemberProfile;
}

export async function deleteMember(id: string): Promise<void> {
  const supabase = getSupabaseClient();

  // Deleting user via Auth Admin API will trigger ON DELETE CASCADE on the profiles table
  const { error } = await supabase.auth.admin.deleteUser(id);

  if (error) {
    if (error.status === 404 || error.message.toLowerCase().includes('user not found')) {
      throw new MemberServiceError('Membro não encontrado.', 404);
    }
    throw new MemberServiceError(error.message, error.status || 500);
  }
}
