export const buildImageUrl = (request, imagePath) => {
  if (!imagePath) {
    return null;
  }

  const protocol = request.protocol || 'http';
  const host = request.headers.host;
  return `${protocol}://${host}/uploads${imagePath}`;
};

export const attachImageUrl = (request, item) => ({
  ...item,
  image: buildImageUrl(request, item.image),
});

export const attachImageUrls = (request, items) =>
  items.map((item) => attachImageUrl(request, item));
