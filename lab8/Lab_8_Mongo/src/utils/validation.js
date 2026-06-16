export const validateImportItem = (item) => {
  const errors = [];
  const currentYear = new Date().getFullYear();

  if (typeof item.title !== 'string' || item.title.trim().length === 0) {
    errors.push('title must be a non-empty string');
  }

  if (typeof item.author !== 'string' || item.author.trim().length === 0) {
    errors.push('author must be a non-empty string');
  }

  const year = Number(item.year);
  if (!Number.isInteger(year) || year < 1 || year > currentYear) {
    errors.push('year must be a valid integer');
  }

  if (item.genre !== undefined && (typeof item.genre !== 'string' || item.genre.trim().length === 0)) {
    errors.push('genre must be a non-empty string');
  }

  return {
    valid: errors.length === 0,
    errors,
    data: {
      title: typeof item.title === 'string' ? item.title.trim() : item.title,
      author: typeof item.author === 'string' ? item.author.trim() : item.author,
      year,
      genre: typeof item.genre === 'string' ? item.genre.trim() : 'unknown',
    },
  };
};
