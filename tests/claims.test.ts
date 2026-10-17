import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { claimCounts, createClaim, isAdmin, listClaims, reviewClaim, targetExists, validateClaim } from '@/lib/claims';
import { closeDb, getDb } from '@/lib/db';
import { registry } from '@/lib/registry';

const r = registry();
const valid = { kind: 'dispute', target: 'derivation:quicksort>introsort', name: 'tester', contact: 'secret@example.com', statement: 'The introsort paper also cites median-of-3 quicksort explicitly.', evidence: 'https://doi.org/10.1002/x https://example.org/y' };

beforeAll(() => { closeDb(); getDb(':memory:'); });
afterAll(() => closeDb());

describe('claim validation', () => {
  it('accepts a well-formed dispute and splits evidence URLs', () => {
    const v = validateClaim(r, valid);
    expect(v.ok && v.value.evidence).toEqual(['https://doi.org/10.1002/x', 'https://example.org/y']);
  });
  it('rejects unknown targets, short statements and missing evidence', () => {
    const v = validateClaim(r, { ...valid, target: 'algorithm:nope', statement: 'short', evidence: 'not-a-url' });
    expect(v.ok).toBe(false);
    if (!v.ok) expect(Object.keys(v.errors).sort()).toEqual(['evidence', 'statement', 'target']);
  });
  it('knows every target type', () => {
    expect(targetExists(r, 'algorithm:quicksort')).toBe(true);
    expect(targetExists(r, 'author:hoare')).toBe(true);
    expect(targetExists(r, 'derivation:quicksort>introsort')).toBe(true);
    expect(targetExists(r, 'author:')).toBe(false);
  });
});

describe('claim store', () => {
  it('stores claims but never exposes contact details', () => {
    const v = validateClaim(r, valid);
    if (!v.ok) throw new Error('invalid');
    const c = createClaim(v.value);
    expect(c).not.toHaveProperty('contact');
    expect(JSON.stringify(listClaims())).not.toContain('secret@example.com');
    expect(listClaims({ target: valid.target })).toHaveLength(1);
    expect(claimCounts()).toEqual({ pending: 1, accepted: 0, rejected: 0 });
  });
  it('records review decisions', () => {
    const [c] = listClaims();
    const done = reviewClaim(c.id, 'accepted', 'Evidence confirmed')!;
    expect(done).toMatchObject({ status: 'accepted', resolution: 'Evidence confirmed' });
    expect(done.updatedAt).toBeTruthy();
    expect(reviewClaim(9999, 'rejected', 'x')).toBeNull();
    expect(listClaims({ status: 'pending' })).toEqual([]);
  });
  it('checks admin tokens in constant time and stays closed without a token', () => {
    expect(isAdmin('Bearer abc', 'abc')).toBe(true);
    expect(isAdmin('Bearer abd', 'abc')).toBe(false);
    expect(isAdmin('Bearer abc', undefined)).toBe(false);
    expect(isAdmin(null, 'abc')).toBe(false);
  });
});
