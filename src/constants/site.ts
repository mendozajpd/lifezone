import { EMULATOR_HOST, FIREBASE_CONFIG, USE_EMULATORS } from '@/constants/firebase';

/** Firestore document ids for this site's content. */
export const SITE_ID = 'lifezone';

/** The save slot that ships with the site and can never be deleted. */
export const DEFAULT_SLOT_ID = 'default';

/** Storage object holding the snapshot visitors fetch. */
export const SNAPSHOT_PATH = 'published/site.json';

const STORAGE_EMULATOR_PORT = Number(
  process.env.EXPO_PUBLIC_EMULATOR_STORAGE_PORT ?? 9199
);

/**
 * Public URL of the published snapshot.
 *
 * Deliberately a plain HTTPS URL rather than an SDK call: visitors fetch this
 * with one `fetch()` and never download the Firebase SDK. `alt=media` returns
 * the object body itself, and the path has to be percent-encoded because
 * Storage treats the whole object name as a single path segment.
 */
export function publishedSnapshotUrl(): string {
  const bucket = FIREBASE_CONFIG.storageBucket;
  const object = encodeURIComponent(SNAPSHOT_PATH);

  const origin = USE_EMULATORS
    ? `http://${EMULATOR_HOST}:${STORAGE_EMULATOR_PORT}`
    : 'https://firebasestorage.googleapis.com';

  return `${origin}/v0/b/${bucket}/o/${object}?alt=media`;
}
