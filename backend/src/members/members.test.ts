import { describe, it, expect } from 'vitest';
import { EMAIL_RE, MemberServiceError } from './members.service.js';

describe('members email validation regex', () => {
  it('should pass valid email formats', () => {
    expect(EMAIL_RE.test('test@example.com')).toBe(true);
    expect(EMAIL_RE.test('user.name+tag@crianex.com.br')).toBe(true);
    expect(EMAIL_RE.test('first.last@company.org')).toBe(true);
  });

  it('should reject invalid email formats', () => {
    expect(EMAIL_RE.test('test@')).toBe(false);
    expect(EMAIL_RE.test('@example.com')).toBe(false);
    expect(EMAIL_RE.test('test@example')).toBe(false);
    expect(EMAIL_RE.test('test space@example.com')).toBe(false);
    expect(EMAIL_RE.test('')).toBe(false);
  });
});

describe('MemberServiceError', () => {
  it('should preserve message and status properties', () => {
    const error = new MemberServiceError('Custom error message', 400);
    expect(error.message).toBe('Custom error message');
    expect(error.status).toBe(400);
    expect(error.name).toBe('MemberServiceError');
  });
});
