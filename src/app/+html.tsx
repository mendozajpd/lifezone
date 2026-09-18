import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * Document shell.
 *
 * Deliberately carries no `<title>`, description or og tags. Expo Router's head
 * manager injects its own `<title>` after hydration and an empty one wins, so a
 * title written here survives only until the bundle runs and then the tab falls
 * back to the bare hostname. Page metadata lives in
 * `components/layout/page-meta.tsx`.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#0A0A0A" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: 'body { background-color: #0A0A0A; }' }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
