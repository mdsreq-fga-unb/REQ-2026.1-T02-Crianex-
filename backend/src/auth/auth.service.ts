import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseClient, getSupabaseConfig } from '../config/supabase.js';

export type AuthenticatedAdminUser = {
  id: string;
  name: string;
  role: string;
};

export type AuthSessionResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: {
    id: string;
    email: string | null;
    user_metadata?: Record<string, unknown> | null;
    app_metadata?: Record<string, unknown> | null;
  };
};

export type AdminAuthenticatedSession = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthenticatedAdminUser;
};

export type AdminLoginResponse =
  | (AdminAuthenticatedSession & { mfa_required: false })
  | (AdminAuthenticatedSession & { mfa_required: true });

type MfaVerificationUser = {
  id: string;
  email: string | null;
  user_metadata?: Record<string, unknown> | null;
};

type MfaVerificationSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user?: MfaVerificationUser | null;
};

type MfaVerificationResult = {
  session?: MfaVerificationSession;
  user?: MfaVerificationUser | null;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
} & Partial<MfaVerificationSession>;

type ProfileRow = {
  id: string;
  name: string | null;
  role: string | null;
  email: string | null;
};

type AuthServiceError = Error & {
  status?: number;
};

function createAuthError(message: string, status: number): AuthServiceError {
  const error = new Error(message) as AuthServiceError;

  error.status = status;

  return error;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function normalizeDisplayName(
  name: string | null | undefined,
  email: string | null | undefined,
  userMetadata: Record<string, unknown> | null | undefined
): string {
  const metadataName =
    userMetadata && typeof userMetadata['name'] === 'string' ? userMetadata['name'] : '';
  const fallbackEmail = email?.split('@')[0] ?? '';

  return (name?.trim() || metadataName.trim() || fallbackEmail.trim() || 'Administrador').trim();
}

export function normalizeRole(role: string | null | undefined): string {
  return role?.trim() || 'member';
}

const ADMIN_ROLES = new Set(['admin', 'owner']);

function createAuthenticatedSupabaseClient(accessToken: string): SupabaseClient {
  const { url, serviceRoleKey } = getSupabaseConfig();

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

export function isAdminRole(role: string | null | undefined): boolean {
  return ADMIN_ROLES.has(normalizeRole(role));
}

export function parseBearerToken(authorizationHeader: string | null | undefined): string | null {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token.trim() || null;
}

export function parseCookieHeader(cookieHeader: string | null | undefined): Record<string, string> {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(';').reduce<Record<string, string>>((cookies, entry) => {
    const [rawKey, ...rawValueParts] = entry.split('=');
    const key = (rawKey ?? '').trim();
    const value = rawValueParts.join('=').trim();

    if (key) {
      cookies[key] = decodeURIComponent(value);
    }

    return cookies;
  }, {});
}

function toAuthSessionResponse(payload: unknown): AuthSessionResponse {
  if (!isRecord(payload)) {
    throw createAuthError('Invalid Supabase Auth response', 502);
  }

  const accessToken = typeof payload['access_token'] === 'string' ? payload['access_token'] : '';
  const refreshToken = typeof payload['refresh_token'] === 'string' ? payload['refresh_token'] : '';
  const expiresIn = typeof payload['expires_in'] === 'number' ? payload['expires_in'] : 0;
  const tokenType = typeof payload['token_type'] === 'string' ? payload['token_type'] : 'bearer';
  const userPayload = isRecord(payload['user']) ? payload['user'] : null;

  if (!accessToken || !refreshToken || !userPayload) {
    throw createAuthError('Invalid Supabase Auth response', 502);
  }

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: expiresIn,
    token_type: tokenType,
    user: {
      id: typeof userPayload['id'] === 'string' ? userPayload['id'] : '',
      email: typeof userPayload['email'] === 'string' ? userPayload['email'] : null,
      user_metadata: isRecord(userPayload['user_metadata']) ? userPayload['user_metadata'] : null,
      app_metadata: isRecord(userPayload['app_metadata']) ? userPayload['app_metadata'] : null,
    },
  };
}

async function requestAuthSession(
  path: string,
  body: Record<string, string>
): Promise<AuthSessionResponse> {
  const { url, anonKey } = getSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
    },
    body: JSON.stringify(body),
  });

  const payload: unknown = await response.json();

  if (!response.ok) {
    const message =
      isRecord(payload) && typeof payload['msg'] === 'string'
        ? payload['msg']
        : 'Supabase Auth request failed';
    throw createAuthError(message, response.status);
  }

  return toAuthSessionResponse(payload);
}

export async function loginWithEmailAndPassword(
  email: string,
  password: string
): Promise<AuthSessionResponse> {
  return requestAuthSession('token?grant_type=password', {
    email,
    password,
  });
}

export async function refreshWithRefreshToken(refreshToken: string): Promise<AuthSessionResponse> {
  return requestAuthSession('token?grant_type=refresh_token', {
    refresh_token: refreshToken,
  });
}

export async function loadAdminProfile(
  supabase: SupabaseClient,
  userId: string,
  email: string | null,
  userMetadata: Record<string, unknown> | null | undefined
): Promise<AuthenticatedAdminUser> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id,name,role,email')
    .eq('id', userId)
    .maybeSingle<ProfileRow>();

  if (error) {
    throw createAuthError(error.message, 500);
  }

  const role = normalizeRole(data?.role ?? null);

  if (!ADMIN_ROLES.has(role)) {
    throw createAuthError('Acesso restrito a administradores', 403);
  }

  return {
    id: userId,
    name: normalizeDisplayName(data?.name ?? null, data?.email ?? email, userMetadata),
    role,
  };
}

export async function validateAccessToken(
  supabase: SupabaseClient,
  accessToken: string
): Promise<AuthenticatedAdminUser> {
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    throw createAuthError('Invalid access token', 401);
  }

  return loadAdminProfile(supabase, data.user.id, data.user.email ?? null, data.user.user_metadata);
}

export async function hasVerifiedTotpFactor(accessToken: string): Promise<boolean> {
  const supabase = createAuthenticatedSupabaseClient(accessToken);
  const { data, error } = await supabase.auth.mfa.listFactors();

  if (error) {
    throw createAuthError(error.message, 500);
  }

  return (data.totp ?? []).length > 0;
}

export async function getVerifiedTotpFactorId(accessToken: string): Promise<string | null> {
  const supabase = createAuthenticatedSupabaseClient(accessToken);
  const { data, error } = await supabase.auth.mfa.listFactors();

  if (error) {
    throw createAuthError(error.message, 500);
  }

  return data.totp?.[0]?.id ?? null;
}

export async function challengeAndVerifyTotp(
  accessToken: string,
  code: string
): Promise<AdminAuthenticatedSession> {
  const supabase = createAuthenticatedSupabaseClient(accessToken);
  const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();

  if (factorsError) {
    throw createAuthError(factorsError.message, 500);
  }

  const factorId = factors.totp?.[0]?.id;

  if (!factorId) {
    throw createAuthError('Nenhum fator TOTP cadastrado para este usuário', 400);
  }

  const challenge = await supabase.auth.mfa.challenge({ factorId });

  if (challenge.error || !challenge.data) {
    throw createAuthError(challenge.error?.message ?? 'Não foi possível iniciar o MFA', 400);
  }

  const verification = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challenge.data.id,
    code,
  });

  if (verification.error || !verification.data) {
    throw createAuthError(verification.error?.message ?? 'Código TOTP inválido ou expirado', 400);
  }

  const verificationData = verification.data as MfaVerificationResult;
  const session = verificationData.session ?? verificationData;
  const verifiedUser = verificationData.user ?? session.user ?? null;

  if (!session?.access_token || !session?.refresh_token) {
    throw createAuthError('Resposta inválida do MFA', 502);
  }

  const profile = await loadAdminProfile(
    getSupabaseClient(),
    verifiedUser?.id ?? session.user?.id ?? '',
    verifiedUser?.email ?? session.user?.email ?? null,
    verifiedUser?.user_metadata ?? session.user?.user_metadata ?? null
  );

  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresIn: session.expires_in ?? 0,
    user: profile,
  };
}

export async function revokeSession(supabase: SupabaseClient, accessToken: string): Promise<void> {
  const { error } = await supabase.auth.admin.signOut(accessToken, 'local');

  if (error) {
    throw createAuthError(error.message, 500);
  }
}
