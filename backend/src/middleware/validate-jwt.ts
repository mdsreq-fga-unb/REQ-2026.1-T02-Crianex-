import type { NextFunction, Request, Response } from 'express';
import { getSupabaseClient } from '../config/supabase.js';
import { parseBearerToken, parseCookieHeader, validateAccessToken } from '../auth/auth.service.js';

export type ValidatedAuthContext = {
  accessToken: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
};

function getAccessTokenFromRequest(request: Request): string | null {
  const bearerToken = parseBearerToken(request.headers.authorization);

  if (bearerToken) {
    return bearerToken;
  }

  const cookies = parseCookieHeader(request.headers.cookie);

  return cookies['access_token'] ?? null;
}

const TEST_AUTH_BYPASS_CONTEXT: ValidatedAuthContext = {
  accessToken: 'bypass',
  user: { id: 'bypass', name: 'Bypass', role: 'owner' },
};

export async function validateJWT(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  if (process.env['ADMIN_AUTH_BYPASS'] === 'true') {
    (response.locals as { auth?: ValidatedAuthContext }).auth = TEST_AUTH_BYPASS_CONTEXT;
    next();
    return;
  }

  const accessToken = getAccessTokenFromRequest(request);

  if (!accessToken) {
    response.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const supabase = getSupabaseClient();
    const user = await validateAccessToken(supabase, accessToken);

    (response.locals as { auth?: ValidatedAuthContext }).auth = {
      accessToken,
      user,
    };

    next();
  } catch {
    response.status(401).json({ error: 'Unauthorized' });
  }
}
