import { apiFetch } from './backend';

export type AdminSessionUser = {
  id: string;
  name: string;
  role: string;
};

type AdminSessionResponse = {
  user: AdminSessionUser;
};

export async function authorizeAdminSession(accessToken: string): Promise<AdminSessionUser> {
  const response = await apiFetch<AdminSessionResponse>('/api/auth/session', {
    method: 'POST',
    token: accessToken,
  });

  return response.user;
}