import { createContext, useContext, type PropsWithChildren } from 'react';

/** Addresses any editable node in the tree. */
export type EditorTarget = {
  sectionId: string;
  itemId?: string;
  blockId?: string;
};

export type EditorApi = {
  selected: EditorTarget | null;
  select: (target: EditorTarget) => void;
};

/**
 * The seam between the public site and the editor. Templates render identically
 * either way; the editor supplies this context to add selection and drag chrome
 * on top. Keeping one renderer is what stops the preview from drifting away
 * from the live page.
 */
const EditorContext = createContext<EditorApi | null>(null);

export function EditorProvider({ value, children }: PropsWithChildren<{ value: EditorApi }>) {
  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

/** Returns null on the public site. */
export function useEditor(): EditorApi | null {
  return useContext(EditorContext);
}

export function isSameTarget(a: EditorTarget | null, b: EditorTarget): boolean {
  return (
    a !== null && a.sectionId === b.sectionId && a.itemId === b.itemId && a.blockId === b.blockId
  );
}
