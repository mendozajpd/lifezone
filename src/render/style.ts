import type { TextStyle } from 'react-native';

import type {
  Block,
  Breakpoint,
  ResponsiveTextStyle,
  Theme,
  TextStyleSpec,
} from '@/schema/types';

/**
 * Breakpoint overrides cascade upward like min-width media queries: a tablet
 * override also applies on desktop unless desktop overrides it again.
 */
function layersFor(style: ResponsiveTextStyle, breakpoint: Breakpoint): TextStyleSpec[] {
  const { tablet, desktop, ...base } = style;
  const layers: TextStyleSpec[] = [base];

  if (tablet && (breakpoint === 'tablet' || breakpoint === 'desktop')) {
    layers.push(tablet);
  }
  if (desktop && breakpoint === 'desktop') {
    layers.push(desktop);
  }
  return layers;
}

/**
 * Resolves a block's typography: the theme's role style first, then the block's
 * own overrides, then its breakpoint overrides. A block with no override renders
 * exactly as the theme intends, which is what makes "reset to theme" a delete.
 */
export function resolveTextStyle(
  theme: Theme,
  breakpoint: Breakpoint,
  role?: Block['role'],
  override?: ResponsiveTextStyle
): TextStyle {
  const base: TextStyleSpec = role ? theme.roles[role] : {};
  const resolved: TextStyleSpec = { ...base };

  if (override) {
    for (const layer of layersFor(override, breakpoint)) {
      for (const [key, value] of Object.entries(layer)) {
        // An explicit `undefined` should not erase the themed value.
        if (value !== undefined) {
          (resolved as Record<string, unknown>)[key] = value;
        }
      }
    }
  }

  return resolved as TextStyle;
}

/** Block-level margins, kept separate from typography so both stay editable. */
export function resolveSpacing(block: Block) {
  const { spacing } = block;
  if (!spacing) return undefined;
  return {
    marginTop: spacing.top,
    marginBottom: spacing.bottom,
    marginLeft: spacing.left,
    marginRight: spacing.right,
  };
}

const TOKENS: Record<string, () => string> = {
  year: () => String(new Date().getFullYear()),
};

/**
 * Substitutes `{{token}}` placeholders so content like a copyright year stays
 * correct without an editor having to update it every January.
 */
export function interpolateText(text: string): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, token: string) => {
    const resolve = TOKENS[token];
    return resolve ? resolve() : match;
  });
}
