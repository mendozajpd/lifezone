import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type Auth,
} from 'firebase/auth';
import {
  collection,
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Firestore,
} from 'firebase/firestore';
import {
  connectStorageEmulator,
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes,
  type FirebaseStorage,
} from 'firebase/storage';

import {
  assertFirebaseConfigured,
  EMULATOR_HOST,
  EMULATOR_PORTS,
  FIREBASE_CONFIG,
  USE_EMULATORS,
} from '@/constants/firebase';
import { DEFAULT_SLOT_ID, SITE_ID, SNAPSHOT_PATH } from '@/constants/site';
import { DEFAULT_VERSION } from '@/schema/defaults';
import { SCHEMA_VERSION, type SiteVersion } from '@/schema/types';

/**
 * The single lazy entry point to Firebase.
 *
 * Everything the admin app needs is re-exported from here, and callers reach it
 * only through `await import('@/lib/firebase')`. Metro creates one async chunk
 * per distinct dynamic-import specifier and hoists anything shared by two or
 * more of them into the eagerly loaded `__common` chunk — importing
 * `firebase/auth` from several call sites is enough to push the whole SDK into
 * the bundle every visitor downloads. One specifier keeps it out.
 */

export type AuthUser = {
  email: string | null;
  displayName: string | null;
};

/** A save slot: a complete, independently editable copy of the site. */
export type SlotSummary = {
  id: string;
  name: string;
  /** The shipped slot. Protected from deletion. */
  isDefault: boolean;
  updatedAt: number | null;
};

export type SiteState = {
  slots: SlotSummary[];
  /** Slot currently published to visitors, if any. */
  liveSlotId: string | null;
  publishedAt: number | null;
};

type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
};

let services: FirebaseServices | null = null;

function getFirebase(): FirebaseServices {
  if (services) return services;

  assertFirebaseConfigured();

  const app = getApps()[0] ?? initializeApp(FIREBASE_CONFIG);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  if (USE_EMULATORS) {
    connectAuthEmulator(auth, `http://${EMULATOR_HOST}:${EMULATOR_PORTS.auth}`, {
      disableWarnings: true,
    });
    connectFirestoreEmulator(db, EMULATOR_HOST, EMULATOR_PORTS.firestore);
    connectStorageEmulator(storage, EMULATOR_HOST, EMULATOR_PORTS.storage);
  }

  services = { app, auth, db, storage };
  return services;
}

/* -------------------------------------------------------------------------- */
/* Auth                                                                       */
/* -------------------------------------------------------------------------- */

export function watchAuth(onChange: (user: AuthUser | null) => void): () => void {
  const { auth } = getFirebase();
  return onAuthStateChanged(auth, (user) => {
    onChange(user ? { email: user.email, displayName: user.displayName } : null);
  });
}

export async function signInWithGoogle(): Promise<void> {
  const { auth } = getFirebase();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  await signInWithPopup(auth, provider);
}

export async function signOutUser(): Promise<void> {
  await signOut(getFirebase().auth);
}

/**
 * Whether this account is on the editor allowlist. A UX affordance, not the
 * security boundary — the rules run the same check on every read and write.
 */
export async function isAllowlisted(email: string): Promise<boolean> {
  const { db } = getFirebase();
  return (await getDoc(doc(db, 'admins', email))).exists();
}

/* -------------------------------------------------------------------------- */
/* Save slots                                                                 */
/* -------------------------------------------------------------------------- */

function siteRef(db: Firestore) {
  return doc(db, 'sites', SITE_ID);
}

function slotRef(db: Firestore, slotId: string) {
  return doc(db, 'sites', SITE_ID, 'versions', slotId);
}

/**
 * Firestore rejects `undefined`, and optional schema fields are undefined all
 * over the tree. A JSON round-trip drops them, which is the semantics we want:
 * an absent override means "inherit from the theme".
 */
function clean<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function toMillis(value: unknown): number | null {
  if (value && typeof value === 'object' && 'toMillis' in value) {
    return (value as { toMillis: () => number }).toMillis();
  }
  return null;
}

/** Lists every slot, seeding the protected default one on first run. */
export async function loadSiteState(): Promise<SiteState> {
  const { db } = getFirebase();

  const [siteSnap, slotsSnap] = await Promise.all([
    getDoc(siteRef(db)),
    getDocs(collection(db, 'sites', SITE_ID, 'versions')),
  ]);

  if (slotsSnap.empty) {
    await saveSlot(DEFAULT_SLOT_ID, {
      ...DEFAULT_VERSION,
      id: DEFAULT_SLOT_ID,
      name: 'Default',
      isDefault: true,
    });
    return {
      slots: [{ id: DEFAULT_SLOT_ID, name: 'Default', isDefault: true, updatedAt: null }],
      liveSlotId: siteSnap.data()?.liveSlotId ?? null,
      publishedAt: toMillis(siteSnap.data()?.publishedAt),
    };
  }

  const slots = slotsSnap.docs
    .map((snapshot) => {
      const data = snapshot.data();
      return {
        id: snapshot.id,
        name: (data.name as string) ?? snapshot.id,
        isDefault: snapshot.id === DEFAULT_SLOT_ID,
        updatedAt: toMillis(data.updatedAt),
      };
    })
    // Default first, then newest-updated.
    .sort((a, b) => {
      if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
      return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
    });

  return {
    slots,
    liveSlotId: siteSnap.data()?.liveSlotId ?? null,
    publishedAt: toMillis(siteSnap.data()?.publishedAt),
  };
}

export async function loadSlot(slotId: string): Promise<SiteVersion> {
  const { db } = getFirebase();
  const snapshot = await getDoc(slotRef(db, slotId));

  if (!snapshot.exists()) {
    throw new Error(`Save slot "${slotId}" no longer exists.`);
  }

  const data = snapshot.data() as SiteVersion;
  if (data.schemaVersion !== SCHEMA_VERSION) {
    throw new Error(
      `This slot was saved with schema v${data.schemaVersion}, but this build expects ` +
        `v${SCHEMA_VERSION}. A migration is needed before it can be edited.`
    );
  }
  return data;
}

export async function saveSlot(slotId: string, version: SiteVersion): Promise<void> {
  const { db } = getFirebase();
  await setDoc(slotRef(db, slotId), { ...clean(version), updatedAt: serverTimestamp() });
}

/** Creates an empty-ish slot seeded from the shipped defaults. */
export async function createSlot(name: string): Promise<SlotSummary> {
  const id = `slot-${Date.now().toString(36)}`;
  await saveSlot(id, { ...DEFAULT_VERSION, id, name, isDefault: false });
  return { id, name, isDefault: false, updatedAt: Date.now() };
}

export async function duplicateSlot(sourceId: string, name: string): Promise<SlotSummary> {
  const source = await loadSlot(sourceId);
  const id = `slot-${Date.now().toString(36)}`;
  await saveSlot(id, { ...source, id, name, isDefault: false });
  return { id, name, isDefault: false, updatedAt: Date.now() };
}

export async function renameSlot(slotId: string, name: string): Promise<void> {
  const { db } = getFirebase();
  await updateDoc(slotRef(db, slotId), { name, updatedAt: serverTimestamp() });
}

export async function deleteSlot(slotId: string): Promise<void> {
  if (slotId === DEFAULT_SLOT_ID) {
    throw new Error('The default slot cannot be deleted.');
  }
  const { db } = getFirebase();
  await deleteDoc(slotRef(db, slotId));
}

/* -------------------------------------------------------------------------- */
/* Publishing                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Writes a slot to the public snapshot and records which slot is live.
 *
 * The snapshot is a plain JSON object in Storage, so the public site reads it
 * with one `fetch()` and no SDK.
 */
export async function publishSlot(slotId: string, version: SiteVersion): Promise<void> {
  const { db, storage } = getFirebase();

  const payload = JSON.stringify({
    ...clean(version),
    publishedAt: new Date().toISOString(),
    publishedFrom: slotId,
  });

  await uploadBytes(storageRef(storage, SNAPSHOT_PATH), new Blob([payload]), {
    contentType: 'application/json',
    // Visitors should pick up a publish quickly; a minute of CDN caching is a
    // reasonable trade against hammering Storage on every page view.
    cacheControl: 'public, max-age=60',
  });

  await setDoc(
    siteRef(db),
    { liveSlotId: slotId, publishedAt: serverTimestamp() },
    { merge: true }
  );
}

/* -------------------------------------------------------------------------- */
/* Media                                                                      */
/* -------------------------------------------------------------------------- */

export type UploadedImage = {
  mediaId: string;
  url: string;
  width: number;
  height: number;
};

/**
 * Uploads an image and returns a public URL plus its intrinsic size, which the
 * schema needs so layouts can reserve space before the file loads.
 */
export async function uploadImage(file: File): Promise<UploadedImage> {
  const { storage } = getFirebase();

  const mediaId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const extension = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
  const path = `media/${mediaId}.${extension}`;

  const { width, height } = await readImageSize(file);
  await uploadBytes(storageRef(storage, path), file, { contentType: file.type });
  const url = await getDownloadURL(storageRef(storage, path));

  return { mediaId, url, width, height };
}

function readImageSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(objectUrl);
    };
    image.onerror = () => {
      // Fall back to a sane 3:2 so the block still renders.
      resolve({ width: 1600, height: 1067 });
      URL.revokeObjectURL(objectUrl);
    };
    image.src = objectUrl;
  });
}

export const isFirebaseAvailable = true;
