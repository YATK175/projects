import { Transform } from 'stream';

export class NdjsonTransform extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  _transform(record, encoding, callback) {
    callback(
      null,
      `${JSON.stringify(record)}
`,
    );
  }
}
