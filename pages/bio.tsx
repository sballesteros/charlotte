import path from 'node:path';
import type { GetStaticProps } from 'next';
import { probeImage } from '../utils/images';
import { parseMarkdown } from '../utils/markdown';
import Layout from '../components/layout';
import Seo from '../components/seo';
import styles from './bio.module.css';
import type { SiteDataType } from '../content/content-types';

export default function BioPage({
  data: { title, description, keywords, url, email, work, galleries },
  html,
}: {
  data: SiteDataType;
  html: string;
}) {
  return (
    <Layout title={title} galleries={galleries} email={email}>
      <Seo
        title={`${title} • Bio`}
        description={description}
        keywords={keywords}
        url={url}
        work={work[0]}
      />

      <div className={styles.root}>
        <article>
          <div className={styles.sectionWrapper}>
            <section dangerouslySetInnerHTML={{ __html: html }}></section>
          </div>
        </article>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async function getStaticProps() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { html } = (await parseMarkdown(
    path.join(process.cwd(), 'content', 'bio.md')
  )) as { html: string };

  const { data } = (await parseMarkdown(
    path.join(process.cwd(), 'content', 'galleries.md')
  )) as { data: SiteDataType };

  for (const w of data.work) {
    const stats = await probeImage(w.file);
    w.width = stats.width;
    w.height = stats.height;
  }

  return { props: { html, data } };
};
