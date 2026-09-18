import Head from 'expo-router/head';

import { SITE_DESCRIPTION, SITE_TITLE } from '@/constants/site-meta';

type PageMetaProps = {
  title?: string;
  description?: string;
};

/**
 * Per-route title and share tags.
 *
 * This has to go through `expo-router/head`, not `+html.tsx`: Expo Router's
 * head manager injects its own `<title>` after hydration and an empty one wins,
 * which leaves the browser tab showing the bare hostname even though the
 * prerendered HTML had the right title. See the note in `+html.tsx`.
 */
export function PageMeta({ title = SITE_TITLE, description = SITE_DESCRIPTION }: PageMetaProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_TITLE} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:locale" content="en_PH" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
}
