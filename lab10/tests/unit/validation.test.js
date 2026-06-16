import { describe, expect, it } from 'vitest';
import { validateImportItem } from '#utils/validation';

describe('validation utils', () => {
  it('accepts valid book import item', () => {
    const result = validateImportItem({
      title: 'Kobzar',
      author: 'Shevchenko',
      year: '1840',
      genre: 'Poetry',
    });
    expect(result.valid).toBe(true);
    expect(result.data.year).toBe(1840);
  });

  it('rejects invalid book import item', () => {
    const result = validateImportItem({ title: '', author: '', year: 'abc' });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
