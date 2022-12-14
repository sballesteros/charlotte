import path from 'node:path';
import type { GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { probeImage } from '../utils/images';
import { parseMarkdown } from '../utils/markdown';
import Layout from '../components/layout';
import Seo from '../components/seo';
import styles from './index.module.css';
import { PhotographType, SiteDataType } from '../content/content-types';

export default function HomePage({
  title,
  email,
  description,
  keywords,
  url,
  work,
  galleries,
}: SiteDataType) {
  const [splash, setSplash] = useState<PhotographType>();
  useEffect(() => {
    setSplash(work[Math.floor(work.length * Math.random())]);
  }, [work]);

  return (
    <Layout title={title} galleries={galleries} email={email}>
      <Seo
        title={title}
        description={description}
        keywords={keywords}
        url={url}
        work={work[0]}
      />

      {!!splash && (
        <div className={styles.splash}>
          <div className={styles.splashImg}>
            <Image
              src={`${process.env.NEXT_PUBLIC_STATIC || ''}/media/${
                splash.file
              }`}
              layout="fill"
              objectFit="contain"
              alt="splah image"
            />
          </div>
        </div>
      )}
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async function getStaticProps() {
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
