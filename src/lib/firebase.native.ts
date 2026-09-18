/**
 * Native stub. Metro resolves `@/lib/firebase` to this file on iOS/Android, so
 * the SDK never enters a native bundle. The editor is web-only by design —
 * runtime font loading, image upload and the drag interactions all depend on it.
 */
import type { SiteVersion } from '@/schema/types';

export type AuthUser = {
  email: string | null;
  displayName: string | null;
};

export type SlotSummary = {
  id: string;
  name: string;
  isDefault: boolean;
  updatedAt: number | null;
};

export type SiteState = {
  slots: SlotSummary[];
  liveSlotId: string | null;
  publishedAt: number | null;
};

export type UploadedImage = {
  mediaId: string;
  url: string;
  width: number;
  height: number;
};

const UNSUPPORTED = 'The site editor is only available on the web.';

function unsupported(): never {
  throw new Error(UNSUPPORTED);
}

export function watchAuth(_onChange: (user: AuthUser | null) => void): () => void {
  return unsupported();
}

export async function signInWithGoogle(): Promise<void> {
  return unsupported();
}

export async function signOutUser(): Promise<void> {
  return unsupported();
}

export async function isAllowlisted(_email: string): Promise<boolean> {
  return unsupported();
}

export async function loadSiteState(): Promise<SiteState> {
  return unsupported();
}

export async function loadSlot(_slotId: string): Promise<SiteVersion> {
  return unsupported();
}

export async function saveSlot(_slotId: string, _version: SiteVersion): Promise<void> {
  return unsupported();
}

export async function createSlot(_name: string): Promise<SlotSummary> {
  return unsupported();
}

export async function duplicateSlot(_sourceId: string, _name: string): Promise<SlotSummary> {
  return unsupported();
}

export async function renameSlot(_slotId: string, _name: string): Promise<void> {
  return unsupported();
}

export async function deleteSlot(_slotId: string): Promise<void> {
  return unsupported();
}

export async function publishSlot(_slotId: string, _version: SiteVersion): Promise<void> {
  return unsupported();
}

export async function uploadImage(_file: File): Promise<UploadedImage> {
  return unsupported();
}

export const isFirebaseAvailable = false;
