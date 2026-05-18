import { describe, expect, it } from 'vitest';
import { demoUsers, artworks, documents } from './demoData';

describe('Bultman portal prototype data model', () => {
  it('ships all required role previews', () => {
    expect(demoUsers.map((user) => user.role)).toEqual(['Owner', 'Advisor', 'Client']);
  });

  it('has collection inventory and secure document examples', () => {
    expect(artworks.length).toBeGreaterThanOrEqual(3);
    expect(documents.some((doc) => doc.storagePath.startsWith('clients/'))).toBe(true);
  });

  it('keeps valuation data numeric for reporting', () => {
    expect(artworks.reduce((sum, art) => sum + art.valuation, 0)).toBeGreaterThan(1_000_000);
  });
});
