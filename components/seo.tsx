import Head from 'next/head';

interface SeoProps {
  title: string;
  description: string;
  keywords: string;
  url: string;
  work: { file: string };
}

export default function Seo({
  title,
  description,
  keywords,
  work,
  url,
}: SeoProps) {
  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* OPEN GRAPH / FACEBOOK */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta
        property="og:image"
        content={`${process.env.NEXT_PUBLIC_STATIC || ''}/media/${work.file}`}
      />

      {/* TWITTER */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content={`${process.env.NEXT_PUBLIC_STATIC || ''}/media/${work.file}`}
      />
    </Head>
  );
}
