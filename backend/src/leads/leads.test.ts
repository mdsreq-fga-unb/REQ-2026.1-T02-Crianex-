import { describe, it, expect } from 'vitest';
import { hashIp, validate, sanitizeInput } from './leads.service.js';

describe('hashIp', () => {
  it('returns a 64-char hex SHA-256', () => {
    const h = hashIp('192.168.1.1');
    expect(h).toHaveLength(64);
    expect(h).toMatch(/^[0-9a-f]+$/);
  });

  it('is deterministic', () => {
    expect(hashIp('10.0.0.1')).toBe(hashIp('10.0.0.1'));
  });

  it('produces different hashes for different IPs', () => {
    expect(hashIp('1.1.1.1')).not.toBe(hashIp('8.8.8.8'));
  });

  it('handles empty string without throwing', () => {
    expect(() => hashIp('')).not.toThrow();
    expect(hashIp('')).toHaveLength(64);
  });
});

describe('sanitizeInput', () => {
  it('strips HTML tags from all fields', () => {
    const result = sanitizeInput({
      name: '<b>Ana</b>',
      email: 'ana@empresa.com',
      message: '<script>alert(1)</script>Olá',
    });
    expect(result.name).toBe('Ana');
    expect(result.message).toBe('Olá');
  });

  it('lowercases email', () => {
    const result = sanitizeInput({ name: 'x', email: 'ANA@EMPRESA.COM', message: 'y' });
    expect(result.email).toBe('ana@empresa.com');
  });

  it('omits company when empty after sanitization', () => {
    const result = sanitizeInput({ name: 'x', email: 'x@x.com', message: 'y', company: '<b></b>' });
    expect(result.company).toBeUndefined();
  });

  it('strips HTML-only name to empty string', () => {
    const result = sanitizeInput({ name: '<b></b>', email: 'x@x.com', message: 'y' });
    expect(result.name).toBe('');
  });
});

describe('validate (opera sobre ContactInput pós-sanitização)', () => {
  const valid = { name: 'Ana', email: 'ana@empresa.com', message: 'Olá' };

  it('returns no errors for valid input', () => {
    expect(validate(valid)).toHaveLength(0);
  });

  it('requires name', () => {
    const errors = validate({ ...valid, name: '' });
    expect(errors.some((e) => e.field === 'name')).toBe(true);
  });

  it('requires valid email', () => {
    const errors = validate({ ...valid, email: 'not-an-email' });
    expect(errors.some((e) => e.field === 'email')).toBe(true);
  });

  it('requires message', () => {
    const errors = validate({ ...valid, message: '' });
    expect(errors.some((e) => e.field === 'message')).toBe(true);
  });

  it('accepts optional company and product_interest', () => {
    expect(validate({ ...valid, company: 'Acme', product_interest: 'avali' })).toHaveLength(0);
  });

  it('rejects name longer than 100 chars', () => {
    const errors = validate({ ...valid, name: 'a'.repeat(101) });
    expect(errors.some((e) => e.field === 'name')).toBe(true);
  });

  it('rejects message longer than 2000 chars', () => {
    const errors = validate({ ...valid, message: 'a'.repeat(2001) });
    expect(errors.some((e) => e.field === 'message')).toBe(true);
  });

  it('rejects company longer than 150 chars', () => {
    const errors = validate({ ...valid, company: 'a'.repeat(151) });
    expect(errors.some((e) => e.field === 'company')).toBe(true);
  });

  it('HTML-only name sanitizes to empty and fails validation', () => {
    const sanitized = sanitizeInput({ name: '<b></b>', email: 'x@x.com', message: 'oi' });
    const errors = validate(sanitized);
    expect(errors.some((e) => e.field === 'name')).toBe(true);
  });

  it('HTML-only message sanitizes to empty and fails validation', () => {
    const sanitized = sanitizeInput({ name: 'Ana', email: 'x@x.com', message: '<i></i>' });
    const errors = validate(sanitized);
    expect(errors.some((e) => e.field === 'message')).toBe(true);
  });
});
