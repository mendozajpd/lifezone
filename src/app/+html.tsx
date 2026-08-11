import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta
          name="description"
          content="Lifezone — the college ministry of Lifezone Tacloban. Doing life together."
        />
        <meta property="og:title" content="Lifezone Campus - New Life Tacloban" />
        <meta
          property="og:description"
          content="Lifezone — the college ministry of Lifezone Tacloban. Doing life together."
        />
        <title>Lifezone Campus - New Life Tacloban</title>
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: 'body { background-color: #0A0A0A; }' }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
