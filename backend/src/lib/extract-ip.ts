import type { Request } from 'express';

export function extractIp(req: Request): string {
  // req.ip is resolved by Express from the socket, or from X-Forwarded-For only
  // when 'trust proxy' is configured (see app.ts). Reading the header directly
  // would let a client spoof it and bypass the lead rate limit (RNF10).
  const ip = (req.ip ?? '').trim();
  if (!ip) console.warn('[contact] could not determine client IP');
  return ip;
}
