import { getSupabaseClient } from '../config/supabase.js';

export type ProfileRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  display_role: string | null;
  status: string;
  phone: string | null;
  bio: string | null;
  avatar_url: string | null;
};

const SELECT_FIELDS = 'id, name, email, role, display_role, status, phone, bio, avatar_url';

export async function getMyProfile(userId: string): Promise<ProfileRecord> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .select(SELECT_FIELDS)
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as ProfileRecord;
}

export async function updateMyProfile(
  userId: string,
  updates: { name?: string; phone?: string | null; bio?: string | null }
): Promise<ProfileRecord> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select(SELECT_FIELDS)
    .single();

  if (error) throw error;
  return data as ProfileRecord;
}
