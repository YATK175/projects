import { describe, expect, it } from 'vitest';
import { attachImageUrl, attachImageUrls, buildImageUrl } from '#utils/image-url';

describe('image-url utils', () => {
  const request = {
    protocol: 'http',
    headers: { host: 'localhost:3000' },
  };

  it('returns null when image is absent', () => {
    expect(buildImageUrl(request, null)).toBeNull();
  });

  it('builds full image URL from relative path', () => {
    expect(buildImageUrl(request, '/1/image.jpg')).toBe(
      'http://localhost:3000/uploads/1/image.jpg',
    );
  });

  it('attaches URL to one item and to item list', () => {
    const book = { id: 1, title: 'Kobzar', image: '/1/image.jpg' };
    expect(attachImageUrl(request, book).image).toContain('/uploads/1/image.jpg');
    expect(attachImageUrls(request, [book])).toHaveLength(1);
  });
});
