import path from 'node:path';
import type { GetStaticProps } from 'next';
import Image from 'next/image';
import { probeImage } from '../utils/images';
import { parseMarkdown } from '../utils/markdown';
import Layout from '../components/layout';
import Seo from '../components/seo';
import styles from './journal.module.css';
import type {
  GalleryType,
  JournalEntryType,
  SiteDataType,
} from '../content/content-types';

export default function JournalPage({
  data: { title, description, email, keywords, url, work, galleries },
  post,
}: {
  data: SiteDataType;
  post: JournalEntryType;
}) {
  const [postWork] = post.work;

  return (
    <Layout title={title} galleries={galleries} email={email}>
      <Seo
        title={`${title} • Journal`}
        description={description}
        keywords={keywords}
        url={url}
        work={work[0]}
      />
      <article className={styles.post}>
        <header>
          <h2>{post.title}</h2>
        </header>

        <figure>
          <div className={styles.imageWrapper}>
            <div className={styles.image}>
              <Image
                src={`${process.env.NEXT_PUBLIC_STATIC || ''}/media/${
                  postWork.file
                }`}
                layout="intrinsic"
                width={postWork.width}
                height={postWork.height}
                priority={true}
                alt={postWork.name}
              />
            </div>
          </div>
          <figcaption>{postWork.name}</figcaption>
        </figure>
      </article>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async function getStaticProps() {
  const { data } = (await parseMarkdown(
    path.join(process.cwd(), 'content', 'galleries.md')
  )) as { data: GalleryType };

  const { data: post } = (await parseMarkdown(
    path.join(process.cwd(), 'content', 'journal-entry-1.md')
  )) as { data: JournalEntryType };

  for (const w of post.work) {
    const stats = await probeImage(w.file);
    w.width = stats.width;
    w.height = stats.height;
  }

  return { props: { data, post } };
};
