import path from 'node:path';
import type { GetStaticProps, GetStaticPaths } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { probeImage } from '../utils/images';
import { parseMarkdown } from '../utils/markdown';
import Layout from '../components/layout';
import Seo from '../components/seo';
import Gallery from '../components/gallery';
import type { SiteDataType, GalleryType } from '../content/content-types';

interface GalleryPageProps {
  data: SiteDataType;
  gallery: GalleryType;
  galleryIndex: number;
}

export default function GalleryPage({
  data,
  gallery,
  galleryIndex,
}: GalleryPageProps) {
  const { galleries } = data;
  const router = useRouter();

  useEffect(() => {
    // handle keyboards events
    function handleKeydown(e: KeyboardEvent) {
      switch (e.key) {
        case 'ArrowUp':
          if (galleryIndex > 0) {
            const prev = galleries[galleryIndex - 1];
            void router.push(`/${prev.slug}`);
          }
          break;

        case 'ArrowDown':
          if (galleryIndex < galleries.length - 1) {
            const next = galleries[galleryIndex + 1];
            void router.push(`/${next.slug}`);
          }
          break;

        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeydown, false);
    return () => {
      window.removeEventListener('keydown', handleKeydown, false);
    };
  }, [galleryIndex, galleries, router]);

  return (
    <Layout title={data.title} galleries={data.galleries} email={data.email}>
      <Seo
        title={`${data.title} • ${gallery.name}`}
        description={data.description}
        keywords={data.keywords}
        url={data.url}
        work={data.work[0]}
      />
      <Gallery key={gallery.slug} {...gallery} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async function getStaticProps({
  params,
}) {
  const { data } = (await parseMarkdown(
    path.join(process.cwd(), 'content', 'galleries.md')
  )) as { data: SiteDataType };

  const galleryIndex = data.galleries.findIndex(
    (g) => g.slug === params?.gallery
  );

  const gallery = data.galleries[galleryIndex];

  for (const w of gallery.work) {
    const parts =
      w.type === 'MultiPartPhotograph'
        ? w.parts
        : w.type === 'Photograph'
        ? [w]
        : [];

    for (const p of parts) {
      const stats = await probeImage(p.file);
      p.width = stats.width;
      p.height = stats.height;
    }
  }

  return { props: { data, gallery, galleryIndex } };
};

export const getStaticPaths: GetStaticPaths = async function () {
  const { data } = (await parseMarkdown(
    path.join(process.cwd(), 'content', 'galleries.md')
  )) as { data: SiteDataType };

  return {
    paths: data.galleries.map((gallery) => {
      return { params: { gallery: gallery.slug } };
    }),
    fallback: false,
  };
};
