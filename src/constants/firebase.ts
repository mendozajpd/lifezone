/**
 * Firebase web config.
 *
 * None of these values are secret — they identify the project to Google's
 * endpoints and ship in every Firebase web app. Access control lives in the
 * Firestore/Storage rules, not in hiding these strings.
 *
 * The public site never loads Firebase at all; only the `/admin` routes do.
 */

/** Set `EXPO_PUBLIC_USE_EMULATORS=1` to point the admin app at local emulators. */
export const USE_EMULATORS = process.env.EXPO_PUBLIC_USE_EMULATORS === '1';

export const EMULATOR_HOST = process.env.EXPO_PUBLIC_EMULATOR_HOST ?? 'localhost';

/**
 * Host-side ports from docker-compose. Firestore is published on 8082 rather
 * than its default 8080 to avoid clashing with other local services, so this
 * has to be stated explicitly.
 */
export const EMULATOR_PORTS = {
  auth: Number(process.env.EXPO_PUBLIC_EMULATOR_AUTH_PORT ?? 9099),
  firestore: Number(process.env.EXPO_PUBLIC_EMULATOR_FIRESTORE_PORT ?? 8082),
  storage: Number(process.env.EXPO_PUBLIC_EMULATOR_STORAGE_PORT ?? 9199),
} as const;

const PROJECT_ID = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? 'nltac-lifezone';

export const FIREBASE_CONFIG = {
  // The emulators accept any non-empty API key, so local dev works with no
  // console setup. Real values are required for anything else.
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? (USE_EMULATORS ? 'demo-api-key' : ''),
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? `${PROJECT_ID}.firebaseapp.com`,
  projectId: PROJECT_ID,
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? `${PROJECT_ID}.firebasestorage.app`,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? (USE_EMULATORS ? 'demo-app-id' : ''),
} as const;

/**
 * Fails loudly rather than letting a misconfigured production build present a
 * sign-in button that can never work.
 */
export function assertFirebaseConfigured() {
  if (USE_EMULATORS) return;

  const missing = (['apiKey', 'appId'] as const).filter((key) => !FIREBASE_CONFIG[key]);
  if (missing.length > 0) {
    throw new Error(
      `Firebase is not configured: missing ${missing
        .map((key) => `EXPO_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`)
        .join(', ')}. See .env.example.`
    );
  }
}
