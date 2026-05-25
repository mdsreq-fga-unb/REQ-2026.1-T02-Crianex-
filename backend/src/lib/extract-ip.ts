import type { Request } from 'express';

export function extractIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const raw = Array.isArray(forwarded)
    ? (forwarded[0] ?? '')
    : (forwarded?.split(',')[0] ?? req.ip ?? '');
  const ip = raw.trim();
  if (!ip) console.warn('[contact] could not determine client IP');
  return ip;
}
