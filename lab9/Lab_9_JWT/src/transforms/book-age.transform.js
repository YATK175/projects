import { Transform } from 'stream';

export class BookAgeTransform extends Transform {
  constructor() {
    super({ objectMode: true });
    this.currentYear = new Date().getFullYear();
  }

  _transform(book, encoding, callback) {
    callback(null, {
      ...book,
      age: this.currentYear - book.year,
    });
  }
}
