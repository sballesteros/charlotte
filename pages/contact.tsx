import path from 'node:path';
import type { GetStaticProps } from 'next';
import { probeImage } from '../utils/images';
import { parseMarkdown } from '../utils/markdown';
import Layout from '../components/layout';
import Seo from '../components/seo';
import styles from './contact.module.css';
import type { SiteDataType } from '../content/content-types';

export default function ContactPage({
  title,
  description,
  keywords,
  url,
  email,
  work,
  galleries,
}: SiteDataType) {
  return (
    <Layout title={title} galleries={galleries} email={email}>
      <Seo
        title={`${title} • Contact`}
        description={description}
        keywords={keywords}
        url={url}
        work={work[0]}
      />

      <div className={styles.wrapper}>
        <article>
          <header>
            <h2>Contact</h2>
          </header>
          <section>
            <p>
              <a href={`mailto:${email}`}>{email}</a>
            </p>
          </section>
        </article>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async function getStaticProps() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { data } = (await parseMarkdown(
    path.join(process.cwd(), 'content', 'galleries.md')
  )) as { data: SiteDataType };

  for (const w of data.work) {
    const stats = await probeImage(w.file);
    w.width = stats.width;
    w.height = stats.height;
  }

  return { props: data };
};
