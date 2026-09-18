import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducer } from 'react';

import { DEFAULT_SLOT_ID } from '@/constants/site';
import { editorReducer, initialState, type EditorAction } from '@/editor/state';
import type { SlotSummary } from '@/lib/firebase';
import { DEFAULT_VERSION } from '@/schema/defaults';
import type { SiteVersion } from '@/schema/types';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
export type PublishStatus = 'idle' | 'publishing' | 'published' | 'error';

export type EditorDocument = {
  loading: boolean;
  loadError: string | null;

  slots: SlotSummary[];
  activeSlotId: string;
  liveSlotId: string | null;

  version: SiteVersion;
  dispatch: (action: EditorAction) => void;
  canUndo: boolean;
  canRedo: boolean;

  saveStatus: SaveStatus;
  saveError: string | null;
  dirty: boolean;
  saveNow: () => void;

  publishStatus: PublishStatus;
  publishError: string | null;

  selectSlot: (slotId: string) => void;
  addSlot: (name: string) => Promise<void>;
  duplicateActiveSlot: (name: string) => Promise<void>;
  renameActiveSlot: (name: string) => Promise<void>;
  deleteSlot: (slotId: string) => Promise<void>;
  publishActiveSlot: () => Promise<void>;
};

const AUTOSAVE_DELAY_MS = 900;

function message(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

/**
 * Owns the editor's document: which save slot is open, its content, undo
 * history, autosave, and publishing.
 *
 * Firebase is reached only through `await import('@/lib/firebase')` — see the
 * note in that module about why a single import specifier matters.
 */
export function useEditorDocument(): EditorDocument {
  const [state, dispatch] = useReducer(editorReducer, initialState(DEFAULT_VERSION));
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [slots, setSlots] = useState<SlotSummary[]>([]);
  const [activeSlotId, setActiveSlotId] = useState(DEFAULT_SLOT_ID);
  const [liveSlotId, setLiveSlotId] = useState<string | null>(null);

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [publishStatus, setPublishStatus] = useState<PublishStatus>('idle');
  const [publishError, setPublishError] = useState<string | null>(null);

  /**
   * Revision already persisted. Held as a ref (read inside async writes without
   * stale closures) and as state (so the dirty indicator re-renders).
   */
  const savedRevision = useRef(0);
  const [savedRevisionState, setSavedRevisionState] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(state);
  latest.current = state;
  const activeSlotRef = useRef(activeSlotId);
  activeSlotRef.current = activeSlotId;

  const markSaved = useCallback((revision: number) => {
    savedRevision.current = revision;
    setSavedRevisionState(revision);
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                */
  /* ---------------------------------------------------------------------- */

  const openSlot = useCallback(
    async (slotId: string) => {
      const { loadSlot } = await import('@/lib/firebase');
      const version = await loadSlot(slotId);
      dispatch({ type: 'replace', version });
      markSaved(0);
      setSaveStatus('idle');
      setSaveError(null);
    },
    [markSaved]
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { loadSiteState } = await import('@/lib/firebase');
        const site = await loadSiteState();
        if (cancelled) return;

        setSlots(site.slots);
        setLiveSlotId(site.liveSlotId);

        // Open whatever is live, so the editor starts on what visitors see.
        const initial =
          site.slots.find((slot) => slot.id === site.liveSlotId)?.id ??
          site.slots[0]?.id ??
          DEFAULT_SLOT_ID;

        setActiveSlotId(initial);
        activeSlotRef.current = initial;
        await openSlot(initial);
      } catch (error) {
        if (!cancelled) setLoadError(message(error, 'Could not load your save slots.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [openSlot]);

  /* ---------------------------------------------------------------------- */
  /* Saving                                                                 */
  /* ---------------------------------------------------------------------- */

  const write = useCallback(async () => {
    const snapshot = latest.current;
    if (snapshot.revision === savedRevision.current) return;

    const revisionBeingSaved = snapshot.revision;
    const slotId = activeSlotRef.current;
    setSaveStatus('saving');
    setSaveError(null);

    try {
      const { saveSlot } = await import('@/lib/firebase');
      await saveSlot(slotId, snapshot.version);
      // A slot switch mid-write would make this revision meaningless.
      if (activeSlotRef.current !== slotId) return;
      markSaved(revisionBeingSaved);
      setSaveStatus(latest.current.revision === revisionBeingSaved ? 'saved' : 'idle');
    } catch (error) {
      setSaveStatus('error');
      setSaveError(message(error, 'Could not save.'));
    }
  }, [markSaved]);

  // Debounced autosave; writing per keystroke would burn quota and race itself.
  useEffect(() => {
    if (loading || state.revision === savedRevision.current) return;

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(write, AUTOSAVE_DELAY_MS);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [state.revision, loading, write]);

  const saveNow = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    void write();
  }, [write]);

  /* ---------------------------------------------------------------------- */
  /* Slot operations                                                        */
  /* ---------------------------------------------------------------------- */

  const refreshSlots = useCallback(async () => {
    const { loadSiteState } = await import('@/lib/firebase');
    const site = await loadSiteState();
    setSlots(site.slots);
    setLiveSlotId(site.liveSlotId);
  }, []);

  const selectSlot = useCallback(
    (slotId: string) => {
      if (slotId === activeSlotRef.current) return;

      // Flush pending edits to the slot being left before swapping content.
      if (timer.current) clearTimeout(timer.current);
      const pending = write();

      setActiveSlotId(slotId);
      activeSlotRef.current = slotId;
      setLoading(true);

      void (async () => {
        try {
          await pending;
          await openSlot(slotId);
        } catch (error) {
          setLoadError(message(error, 'Could not open that save slot.'));
        } finally {
          setLoading(false);
        }
      })();
    },
    [openSlot, write]
  );

  const addSlot = useCallback(
    async (name: string) => {
      const { createSlot } = await import('@/lib/firebase');
      const slot = await createSlot(name);
      await refreshSlots();
      selectSlot(slot.id);
    },
    [refreshSlots, selectSlot]
  );

  const duplicateActiveSlot = useCallback(
    async (name: string) => {
      saveNow();
      const { duplicateSlot } = await import('@/lib/firebase');
      const slot = await duplicateSlot(activeSlotRef.current, name);
      await refreshSlots();
      selectSlot(slot.id);
    },
    [refreshSlots, saveNow, selectSlot]
  );

  const renameActiveSlot = useCallback(
    async (name: string) => {
      const { renameSlot } = await import('@/lib/firebase');
      await renameSlot(activeSlotRef.current, name);
      await refreshSlots();
    },
    [refreshSlots]
  );

  const removeSlot = useCallback(
    async (slotId: string) => {
      const { deleteSlot } = await import('@/lib/firebase');
      await deleteSlot(slotId);
      await refreshSlots();
      if (slotId === activeSlotRef.current) selectSlot(DEFAULT_SLOT_ID);
    },
    [refreshSlots, selectSlot]
  );

  const publishActiveSlot = useCallback(async () => {
    setPublishStatus('publishing');
    setPublishError(null);
    try {
      saveNow();
      const { publishSlot } = await import('@/lib/firebase');
      await publishSlot(activeSlotRef.current, latest.current.version);
      setLiveSlotId(activeSlotRef.current);
      setPublishStatus('published');
    } catch (error) {
      setPublishStatus('error');
      setPublishError(message(error, 'Could not publish.'));
    }
  }, [saveNow]);

  return {
    loading,
    loadError,
    slots,
    activeSlotId,
    liveSlotId,
    version: state.version,
    dispatch,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    saveStatus,
    saveError,
    dirty: state.revision !== savedRevisionState,
    saveNow,
    publishStatus,
    publishError,
    selectSlot,
    addSlot,
    duplicateActiveSlot,
    renameActiveSlot,
    deleteSlot: removeSlot,
    publishActiveSlot,
  };
}
