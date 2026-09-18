import { DEFAULT_VERSION } from '@/schema/defaults';
import type {
  Block,
  MediaRef,
  ResponsiveTextStyle,
  Section,
  SiteVersion,
} from '@/schema/types';

/** Addresses a block anywhere in the tree. */
export type BlockPath = {
  sectionId: string;
  itemId?: string;
  blockId: string;
};

export type EditorAction =
  | { type: 'replace'; version: SiteVersion }
  | { type: 'setBlockText'; path: BlockPath; text: string }
  | { type: 'setBlockLabel'; path: BlockPath; label: string }
  | { type: 'setBadgeItems'; path: BlockPath; items: string[] }
  | { type: 'setLinkField'; path: BlockPath; linkId: string; field: 'label' | 'handle' | 'url'; value: string }
  | { type: 'setInfoField'; path: BlockPath; itemId: string; field: 'label' | 'value'; value: string }
  | { type: 'toggleBlockHidden'; path: BlockPath }
  | { type: 'setBlockMedia'; path: BlockPath; media: MediaRef }
  | { type: 'setBlockStyle'; path: BlockPath; style: ResponsiveTextStyle }
  | { type: 'patchSection'; sectionId: string; patch: Partial<Section> }
  | { type: 'addSection'; section: Section; afterSectionId?: string }
  | { type: 'removeSection'; sectionId: string }
  | { type: 'moveSection'; sectionId: string; delta: number }
  | { type: 'reorderSections'; from: number; to: number }
  | { type: 'resetSection'; sectionId: string }
  | { type: 'undo' }
  | { type: 'redo' };

export type EditorState = {
  version: SiteVersion;
  past: SiteVersion[];
  future: SiteVersion[];
  /** Bumped on every content change so autosave knows there is work to do. */
  revision: number;
};

const HISTORY_LIMIT = 50;

export function initialState(version: SiteVersion): EditorState {
  return { version, past: [], future: [], revision: 0 };
}

/* -------------------------------------------------------------------------- */
/* Tree helpers                                                               */
/* -------------------------------------------------------------------------- */

function mapBlocks(blocks: Block[], blockId: string, update: (block: Block) => Block): Block[] {
  return blocks.map((block) => (block.id === blockId ? update(block) : block));
}

/** Applies `update` to one block, whether it sits on the section or an item. */
function updateBlock(
  version: SiteVersion,
  path: BlockPath,
  update: (block: Block) => Block
): SiteVersion {
  return {
    ...version,
    sections: version.sections.map((section) => {
      if (section.id !== path.sectionId) return section;

      if (path.itemId === undefined) {
        return { ...section, blocks: mapBlocks(section.blocks, path.blockId, update) };
      }

      return {
        ...section,
        items: section.items?.map((item) =>
          item.id === path.itemId
            ? { ...item, blocks: mapBlocks(item.blocks, path.blockId, update) }
            : item
        ),
      };
    }),
  };
}

export function findSection(version: SiteVersion, sectionId: string): Section | undefined {
  return version.sections.find((section) => section.id === sectionId);
}

export function findBlock(version: SiteVersion, path: BlockPath): Block | undefined {
  const section = findSection(version, path.sectionId);
  if (!section) return undefined;

  const blocks =
    path.itemId === undefined
      ? section.blocks
      : section.items?.find((item) => item.id === path.itemId)?.blocks;

  return blocks?.find((block) => block.id === path.blockId);
}

/** Whether this section exists in the shipped defaults, i.e. can be reset. */
export function hasDefault(sectionId: string): boolean {
  return DEFAULT_VERSION.sections.some((section) => section.id === sectionId);
}

/* -------------------------------------------------------------------------- */
/* Reducer                                                                    */
/* -------------------------------------------------------------------------- */

/** Wraps a content change so it lands in the undo history. */
function commit(state: EditorState, version: SiteVersion): EditorState {
  return {
    version,
    past: [...state.past, state.version].slice(-HISTORY_LIMIT),
    future: [],
    revision: state.revision + 1,
  };
}

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'replace':
      // Loading from storage is not an edit, so it resets history rather than
      // becoming an undoable step.
      return initialState(action.version);

    case 'setBlockText':
      return commit(
        state,
        updateBlock(state.version, action.path, (block) =>
          block.kind === 'heading' || block.kind === 'paragraph'
            ? { ...block, text: action.text }
            : block
        )
      );

    case 'setBlockLabel':
      return commit(
        state,
        updateBlock(state.version, action.path, (block) =>
          block.kind === 'button' ? { ...block, label: action.label } : block
        )
      );

    case 'setBadgeItems':
      return commit(
        state,
        updateBlock(state.version, action.path, (block) =>
          block.kind === 'badgeList' ? { ...block, items: action.items } : block
        )
      );

    case 'setLinkField':
      return commit(
        state,
        updateBlock(state.version, action.path, (block) =>
          block.kind === 'socialLinks'
            ? {
                ...block,
                links: block.links.map((link) =>
                  link.id === action.linkId ? { ...link, [action.field]: action.value } : link
                ),
              }
            : block
        )
      );

    case 'setInfoField':
      return commit(
        state,
        updateBlock(state.version, action.path, (block) =>
          block.kind === 'infoList'
            ? {
                ...block,
                items: block.items.map((item) =>
                  item.id === action.itemId ? { ...item, [action.field]: action.value } : item
                ),
              }
            : block
        )
      );

    case 'setBlockMedia':
      return commit(
        state,
        updateBlock(state.version, action.path, (block) =>
          block.kind === 'image' ? { ...block, media: action.media } : block
        )
      );

    case 'setBlockStyle':
      return commit(
        state,
        updateBlock(state.version, action.path, (block) => ({ ...block, style: action.style }))
      );

    case 'toggleBlockHidden':
      return commit(
        state,
        updateBlock(state.version, action.path, (block) => ({ ...block, hidden: !block.hidden }))
      );

    case 'patchSection':
      return commit(state, {
        ...state.version,
        sections: state.version.sections.map((section) =>
          section.id === action.sectionId ? { ...section, ...action.patch } : section
        ),
      });

    case 'addSection': {
      const sections = [...state.version.sections];
      const at = action.afterSectionId
        ? sections.findIndex((s) => s.id === action.afterSectionId) + 1
        : sections.length;
      // New sections land above the footer, which readers expect to stay last.
      const footerIndex = sections.findIndex((s) => s.type === 'footer');
      const index =
        action.afterSectionId || footerIndex === -1 ? at : Math.min(at, footerIndex);
      sections.splice(index, 0, action.section);
      return commit(state, { ...state.version, sections });
    }

    case 'removeSection':
      return commit(state, {
        ...state.version,
        sections: state.version.sections.filter((s) => s.id !== action.sectionId),
      });

    case 'reorderSections': {
      const { from, to } = action;
      if (from === to || from < 0 || to < 0) return state;
      const sections = [...state.version.sections];
      if (from >= sections.length || to >= sections.length) return state;
      const [moved] = sections.splice(from, 1);
      sections.splice(to, 0, moved);
      return commit(state, { ...state.version, sections });
    }

    case 'moveSection': {
      const index = state.version.sections.findIndex((s) => s.id === action.sectionId);
      const target = index + action.delta;
      if (index === -1 || target < 0 || target >= state.version.sections.length) {
        return state;
      }
      const sections = [...state.version.sections];
      const [moved] = sections.splice(index, 1);
      sections.splice(target, 0, moved);
      return commit(state, { ...state.version, sections });
    }

    case 'resetSection': {
      const original = DEFAULT_VERSION.sections.find((s) => s.id === action.sectionId);
      if (!original) return state;
      return commit(state, {
        ...state.version,
        sections: state.version.sections.map((section) =>
          // Structured-clone so later edits never mutate the shared default.
          section.id === action.sectionId ? structuredClone(original) : section
        ),
      });
    }

    case 'undo': {
      const previous = state.past[state.past.length - 1];
      if (!previous) return state;
      return {
        version: previous,
        past: state.past.slice(0, -1),
        future: [state.version, ...state.future].slice(0, HISTORY_LIMIT),
        revision: state.revision + 1,
      };
    }

    case 'redo': {
      const next = state.future[0];
      if (!next) return state;
      return {
        version: next,
        past: [...state.past, state.version].slice(-HISTORY_LIMIT),
        future: state.future.slice(1),
        revision: state.revision + 1,
      };
    }
  }
}
