import { ApiError } from './backend';
import type { AdminSessionUser } from './admin-auth';

type AdminSessionResponse = {
  user: AdminSessionUser;
};

export type AdminClientSession = {
  access_token: string;
  refresh_token: string;
  expires_at?: number | null;
};

export async function syncAdminSession(session: AdminClientSession): Promise<AdminSessionUser> {
  const response = await fetch('/api/admin/session', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: session.expires_at ?? null,
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;

    throw new ApiError(
      payload?.message ?? 'Não foi possível sincronizar sua sessão.',
      response.status
    );
  }

  const payload = (await response.json()) as AdminSessionResponse;
  return payload.user;
}
