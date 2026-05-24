import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { hashIp } from './leads.service.js';
import { contactController } from './leads.controller.js';

const windowMs = Number(process.env['RATE_LIMIT_WINDOW_MS'] ?? 600_000);
const max = Number(process.env['RATE_LIMIT_MAX'] ?? 5);

const contactRateLimit = rateLimit({
  windowMs,
  max,
  keyGenerator: (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    const raw = Array.isArray(forwarded)
      ? (forwarded[0] ?? '')
      : (forwarded?.split(',')[0] ?? req.ip ?? '');
    return hashIp(raw.trim());
  },
  handler: (_req, res) => {
    const minutes = Math.ceil(windowMs / 60_000);
    res.status(429).json({
      error: `Muitas tentativas. Tente novamente em ${minutes} minutos.`,
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const leadsRouter = Router();

leadsRouter.post('/contact', contactRateLimit, contactController);

export default leadsRouter;
