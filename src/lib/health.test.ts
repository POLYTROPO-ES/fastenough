import { describe, expect, it } from 'vitest';
import { formatHealthTimestamp, parseHealthPayload } from './health';

describe('health helpers', () => {
  it('parses a valid payload', () => {
    const payload = {
      ok: true,
      service: 'fastenough',
      timestamp: '2026-01-01T00:00:00.000Z',
      version: '0.1.0',
      environment: 'development',
    };

    expect(parseHealthPayload(payload)).toEqual(payload);
  });

  it('throws for missing required fields', () => {
    expect(() => parseHealthPayload({ ok: true })).toThrowError(/service/i);
  });

  it('formats ISO timestamps for display', () => {
    const formatted = formatHealthTimestamp('2026-01-01T00:00:00.000Z');
    expect(formatted.length).toBeGreaterThan(0);
    expect(formatted).not.toBe('2026-01-01T00:00:00.000Z');
  });
});
