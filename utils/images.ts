import fs from 'fs';
import path from 'path';
import probeImageSize from 'probe-image-size';

const isProd = process.env.NODE_ENV === 'production';

export async function probe(fileName: string) {
  if (!isProd) {
    return probeImageSize(
      fs.createReadStream(path.join(process.cwd(), 'public', 'media', fileName))
    );
  }

  return probeImageSize(`${process.env.NEXT_PUBLIC_STATIC}/media/${fileName}`);
}
