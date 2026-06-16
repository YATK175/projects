import { Transform } from 'stream';
import { attachImageUrl } from '#utils/image-url';

export class ImageUrlTransform extends Transform {
  constructor(request) {
    super({ objectMode: true });
    this.request = request;
  }

  _transform(book, encoding, callback) {
    callback(null, attachImageUrl(this.request, book));
  }
}
