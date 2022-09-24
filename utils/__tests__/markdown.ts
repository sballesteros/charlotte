import path from 'path';
import { describe, test, expect } from '@jest/globals';
import { parseMarkdown } from '../markdown';

describe('markdown utils', () => {
  test('parse YAML metadata', async () => {
    const result = await parseMarkdown(path.resolve(__dirname, 'fixture.md'));

    expect(result).toEqual({
      data: { foo: 'boar' },
      html: '<h1>Hello md</h1>\n',
    });
  });
});
