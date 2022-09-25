import fs from 'node:fs';
import path from 'node:path';
import probeImageSize from 'probe-image-size';

const isProd = process.env.NODE_ENV === 'production';

export async function probeImage(
  fileName: string,
  rootPath?: string
): Promise<probeImageSize.ProbeResult> {
  if (!isProd) {
    return probeImageSize(
      fs.createReadStream(
        rootPath
          ? path.join(rootPath, fileName)
          : path.join(process.cwd(), 'public', 'media', fileName)
      )
    );
  }

  return probeImageSize(
    rootPath
      ? path.join(rootPath, fileName)
      : `${process.env.NEXT_PUBLIC_STATIC || ''}/media/${fileName}`
  );
}
