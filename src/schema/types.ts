/**
 * The content schema.
 *
 * Everything the public site renders comes from a `SiteVersion`. The bundled
 * default version lives in `@/schema/defaults` and doubles as the "restore to
 * defaults" source of truth; published versions are fetched as JSON at runtime.
 *
 * Bump `SCHEMA_VERSION` whenever a stored document would need migrating, and add
 * the migration to `@/schema/migrate`.
 */

export const SCHEMA_VERSION = 1;

/* -------------------------------------------------------------------------- */
/* Media                                                                      */
/* -------------------------------------------------------------------------- */

/** Keys into the static bundled-asset registry in `@/schema/media-registry`. */
export type BundledMediaKey =
  | 'gallery-1'
  | 'gallery-2'
  | 'gallery-3'
  | 'gallery-4'
  | 'gallery-5'
  | 'gallery-6'
  | 'gallery-7'
  | 'gallery-8'
  | 'gallery-9'
  | 'gallery-10'
  | 'gallery-11'
  | 'gallery-12';

/** One rendition produced by the upload pipeline. */
export type MediaVariant = {
  width: number;
  url: string;
};

/**
 * Images are either shipped in the app bundle (the defaults) or uploaded to
 * Firebase Storage by an editor. Metro can only resolve `require` with a static
 * literal, so bundled images are referenced by key and looked up in a registry.
 */
export type MediaRef =
  | {
      kind: 'bundled';
      key: BundledMediaKey;
      width: number;
      height: number;
      alt?: string;
      /** Normalized 0..1 crop anchor. Defaults to dead centre. */
      focal?: { x: number; y: number };
    }
  | {
      kind: 'uploaded';
      mediaId: string;
      url: string;
      width: number;
      height: number;
      alt?: string;
      focal?: { x: number; y: number };
      /** Ascending by width; the renderer picks the smallest adequate one. */
      variants?: MediaVariant[];
      /** Thumbhash/blurhash string used as a placeholder while loading. */
      placeholder?: string;
    };

/* -------------------------------------------------------------------------- */
/* Typography                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Named typographic slots. A block names a role and inherits that role's style
 * from the theme; anything the editor changes is written to the block as an
 * override. Clearing the override restores the themed look, which is what makes
 * per-block "reset styles" a one-key delete.
 */
export type TextRole =
  | 'display'
  | 'lead'
  | 'sectionTitle'
  | 'subTitle'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'eyebrow'
  | 'cardTitle'
  | 'cardBody'
  | 'chip'
  | 'tagline'
  | 'infoValue'
  | 'link'
  | 'footerText'
  | 'footerFine';

export type TextStyleSpec = {
  fontFamily?: string;
  fontSize?: number;
  lineHeight?: number;
  letterSpacing?: number;
  fontWeight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  fontStyle?: 'normal' | 'italic';
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  maxWidth?: number;
};

/**
 * A style plus optional overrides that kick in at wider viewports. Storing type
 * scale per breakpoint is what stops an editor's desktop font size from
 * wrecking the phone layout.
 */
export type ResponsiveTextStyle = TextStyleSpec & {
  tablet?: TextStyleSpec;
  desktop?: TextStyleSpec;
};

export type Breakpoint = 'base' | 'tablet' | 'desktop';

/* -------------------------------------------------------------------------- */
/* Blocks                                                                     */
/* -------------------------------------------------------------------------- */

export type BlockSpacing = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

type BlockBase = {
  id: string;
  /** Themed typography slot. Ignored by blocks that render no text. */
  role?: TextRole;
  /** Per-block overrides layered over the role. */
  style?: ResponsiveTextStyle;
  spacing?: BlockSpacing;
  hidden?: boolean;
};

export type BlockAction =
  | { kind: 'scrollTo'; sectionId: string }
  | { kind: 'url'; url: string };

export type Block =
  | (BlockBase & { kind: 'heading'; text: string; level?: 1 | 2 | 3 })
  | (BlockBase & { kind: 'paragraph'; text: string })
  | (BlockBase & {
      kind: 'button';
      label: string;
      action: BlockAction;
      variant?: 'solid' | 'outline';
    })
  | (BlockBase & {
      kind: 'image';
      media: MediaRef;
      aspectRatio?: number;
      borderRadius?: number;
      /** Cross-fade duration in ms as the image decodes. Omit for no fade. */
      transition?: number;
      /** Flex sizing inside row templates. */
      grow?: number;
      basis?: number;
    })
  | (BlockBase & { kind: 'badgeList'; items: string[] })
  | (BlockBase & {
      kind: 'socialLinks';
      links: { id: string; label: string; handle: string; url: string }[];
    })
  | (BlockBase & {
      kind: 'infoList';
      items: { id: string; label: string; value: string }[];
    })
  | (BlockBase & { kind: 'contactForm' })
  | (BlockBase & { kind: 'logo'; size: 'sm' | 'md' | 'lg'; variant?: 'mark' | 'name' })
  | (BlockBase & { kind: 'divider' })
  | (BlockBase & { kind: 'spacer'; height: number });

export type BlockKind = Block['kind'];

/* -------------------------------------------------------------------------- */
/* Sections                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * One repeated entry inside a section: a ministry card, a gallery photo, a
 * "get involved" panel. Keeping them uniform means the editor gets "add card",
 * "add photo" and drag-reorder from a single implementation.
 */
export type SectionItem = {
  id: string;
  blocks: Block[];
  hidden?: boolean;
};

export type SectionBackground = {
  kind: 'none' | 'color' | 'image';
  color?: string;
  media?: MediaRef;
  /** Scrim drawn over a background image so text stays readable. */
  overlayColor?: string;
  /** 0..1 */
  overlayOpacity?: number;
  blur?: number;
};

export type SectionType =
  | 'hero'
  | 'text'
  | 'cards'
  | 'gallery'
  | 'panels'
  | 'contact'
  | 'footer';

export type SectionLayout = {
  paddingVertical?: number;
  paddingHorizontal?: number;
  minHeight?: number;
  maxWidth?: number;
  gap?: number;
  align?: 'left' | 'center';
};

export type Section = {
  id: string;
  type: SectionType;
  /** Registry key, e.g. `hero.centered`. Must belong to `type`. */
  template: string;
  /** Editor label, and the nav label when `showInNav` is set. */
  label: string;
  visible: boolean;
  showInNav: boolean;
  bordered?: boolean;
  background: SectionBackground;
  layout?: SectionLayout;
  /** Section-level content: titles, intro copy, calls to action. */
  blocks: Block[];
  /** Repeated content the template lays out as a grid, list or carousel. */
  items?: SectionItem[];
  /** Hides the section outside this window. Both bounds are ISO dates. */
  schedule?: { start?: string; end?: string };
};

/* -------------------------------------------------------------------------- */
/* Theme + version                                                            */
/* -------------------------------------------------------------------------- */

export type ThemeColors = {
  background: string;
  surface: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
};

export type ThemeRadius = {
  card: number;
  image: number;
  pill: number;
};

export type Theme = {
  colors: ThemeColors;
  radius: ThemeRadius;
  roles: Record<TextRole, TextStyleSpec>;
};

export type SiteMeta = {
  title: string;
  description: string;
  ogMedia?: MediaRef;
};

/**
 * A complete, self-contained site. This is what a "saved template" is: the user
 * can keep as many as they like, duplicate them, and pick which one is live.
 */
export type SiteVersion = {
  schemaVersion: number;
  id: string;
  name: string;
  /** Set on the bundled default so the editor can mark it read-only. */
  isDefault?: boolean;
  theme: Theme;
  meta: SiteMeta;
  sections: Section[];
};
