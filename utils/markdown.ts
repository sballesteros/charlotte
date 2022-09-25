import { promises as fs } from 'node:fs';
import { micromark } from 'micromark';
import { frontmatter, frontmatterHtml } from 'micromark-extension-frontmatter';
import matter from 'gray-matter';

export async function parseMarkdown(filePath: string) {
  const markdown = await fs.readFile(filePath, 'utf8');

  const html = micromark(markdown, {
    extensions: [frontmatter()],
    htmlExtensions: [frontmatterHtml()],
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { data }: { data: unknown } = matter(markdown);

  return { data, html };
}
