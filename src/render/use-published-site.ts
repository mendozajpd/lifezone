import { useEffect, useState } from 'react';

import { publishedSnapshotUrl } from '@/constants/site';
import { DEFAULT_VERSION } from '@/schema/defaults';
import { SCHEMA_VERSION, type SiteVersion } from '@/schema/types';

/**
 * Loads whatever an editor last published.
 *
 * Deliberately a bare `fetch` of a JSON file in Storage — no Firebase SDK, no
 * auth, no Firestore read per visit. The bundled defaults render immediately
 * and stay on screen if the snapshot is missing, stale-schema or unreachable,
 * so the site is never blank and never depends on Firebase being up.
 */
export function usePublishedSite(): { version: SiteVersion; loaded: boolean } {
  const [version, setVersion] = useState<SiteVersion>(DEFAULT_VERSION);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch(publishedSnapshotUrl(), { cache: 'no-cache' });
        if (!response.ok) return; // 404 simply means nothing published yet.

        const data = (await response.json()) as SiteVersion;
        if (cancelled) return;

        if (data?.schemaVersion !== SCHEMA_VERSION || !Array.isArray(data.sections)) {
          // Published by a newer or older build than this one; the bundled
          // defaults are safer than half-rendering an unknown shape.
          return;
        }

        setVersion(data);
      } catch {
        // Offline or blocked — keep the bundled defaults.
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { version, loaded };
}
