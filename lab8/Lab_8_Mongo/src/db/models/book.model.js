import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true, index: true },
    year: { type: Number, required: true, min: 1 },
    genre: { type: String, required: true, trim: true, default: 'Unknown' },
    image: { type: String, default: null },
  },
  { timestamps: true },
);

export const Book = mongoose.model('Book', bookSchema);
