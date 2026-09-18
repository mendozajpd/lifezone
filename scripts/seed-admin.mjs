#!/usr/bin/env node
/**
 * Adds an email to the editor allowlist in the *Firestore emulator*.
 *
 *   node scripts/seed-admin.mjs you@example.com
 *
 * There is deliberately no production path here: the live allowlist is edited
 * in the Firebase console, so a stray script run can never hand out access to
 * the real site. The emulator accepts unauthenticated REST writes with the
 * "owner" bearer token, so this needs no dependencies and no service account.
 */

const email = process.argv[2];

if (!email || !email.includes('@')) {
  console.error('Usage: node scripts/seed-admin.mjs <email>');
  process.exit(1);
}

const host = process.env.FIRESTORE_EMULATOR_HOST ?? 'localhost:8082';
const projectId = process.env.FIREBASE_PROJECT_ID ?? 'nltac-lifezone';

const url =
  `http://${host}/v1/projects/${projectId}/databases/(default)/documents/admins` +
  `?documentId=${encodeURIComponent(email)}`;

const body = {
  fields: {
    email: { stringValue: email },
    addedAt: { timestampValue: new Date().toISOString() },
    note: { stringValue: 'Seeded for local development' },
  },
};

try {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer owner',
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();

  if (response.status === 409 || text.includes('ALREADY_EXISTS')) {
    console.log(`✓ ${email} is already on the editor allowlist.`);
    process.exit(0);
  }

  if (!response.ok) {
    console.error(`✗ Firestore emulator returned ${response.status}:\n${text}`);
    process.exit(1);
  }

  console.log(`✓ Added ${email} to the editor allowlist (emulator, project ${projectId}).`);
} catch (error) {
  console.error(
    `✗ Could not reach the Firestore emulator at ${host}.\n` +
      '  Start it with `docker compose up firebase` and try again.\n' +
      `  ${error instanceof Error ? error.message : error}`
  );
  process.exit(1);
}
