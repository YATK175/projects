const toApiBook = (doc) => {
  if (!doc) return null;
  const item = doc.toObject ? doc.toObject() : doc;
  const { _id, __v, createdAt, updatedAt, ...rest } = item;
  return { id: String(_id), ...rest };
};

const buildFilter = (author) => {
  if (!author) return {};
  return { author: { $regex: author, $options: 'i' } };
};

export const createItemsRepository = (Book) => ({
  async findAll(author) {
    const docs = await Book.find(buildFilter(author)).sort({ createdAt: 1 }).lean();
    return docs.map(toApiBook);
  },

  async *streamAll(author) {
    const cursor = Book.find(buildFilter(author)).sort({ createdAt: 1 }).lean().cursor();
    for await (const doc of cursor) {
      yield toApiBook(doc);
    }
  },

  async findById(id) {
    const doc = await Book.findById(id).lean();
    return toApiBook(doc);
  },

  async create(data) {
    const doc = await Book.create({ ...data, image: data.image ?? null });
    return toApiBook(doc);
  },

  async patch(id, updates) {
    const doc = await Book.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true }).lean();
    return toApiBook(doc);
  },

  async replace(id, data) {
    const current = await Book.findById(id).lean();
    if (!current) return null;

    const doc = await Book.findByIdAndUpdate(
      id,
      { $set: { ...data, image: current.image ?? null } },
      { new: true, runValidators: true },
    ).lean();

    return toApiBook(doc);
  },

  async delete(id) {
    const result = await Book.findByIdAndDelete(id).lean();
    return Boolean(result);
  },

  async count() {
    return Book.countDocuments();
  },

  async clear() {
    return Book.deleteMany({});
  },
});
