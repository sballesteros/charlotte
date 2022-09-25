import { describe, test, expect } from '@jest/globals';
import { probeImage } from '../images';

describe('probeImage', () => {
  test('probe image', async () => {
    const meta = await probeImage('lenna.png', __dirname);
    expect(meta).toHaveProperty('width');
    expect(meta).toHaveProperty('height');
  });
});
