import { Platform } from 'react-native';

import type { SiteVersion } from '@/schema/types';

/**
 * Fonts an editor can choose from.
 *
 * The six bundled families ship in the app binary. The rest are fetched from
 * Google Fonts at runtime, on demand — loading every family up front would cost
 * megabytes, so `ensureFontsLoaded` pulls in only the ones a version actually
 * uses. This is also why the editor is web-only: native would need every family
 * bundled at build time.
 */
export type FontOption = {
  /** The value stored in content and passed to `fontFamily`. */
  value: string;
  label: string;
  source: 'bundled' | 'google';
  category: 'sans' | 'serif' | 'display' | 'mono' | 'handwriting';
  /** Google family name, when it differs from the stored value. */
  google?: string;
};

export const BUNDLED_FONTS: FontOption[] = [
  { value: 'ArchivoBlack_400Regular', label: 'Archivo Black (site display)', source: 'bundled', category: 'display' },
  { value: 'Archivo_300Light', label: 'Archivo Light', source: 'bundled', category: 'sans' },
  { value: 'Inter_400Regular', label: 'Inter Regular (site body)', source: 'bundled', category: 'sans' },
  { value: 'Inter_500Medium', label: 'Inter Medium', source: 'bundled', category: 'sans' },
  { value: 'Inter_600SemiBold', label: 'Inter SemiBold', source: 'bundled', category: 'sans' },
  { value: 'Inter_700Bold', label: 'Inter Bold', source: 'bundled', category: 'sans' },
];

const GOOGLE_FAMILIES: { name: string; category: FontOption['category'] }[] = [
  { name: 'Poppins', category: 'sans' },
  { name: 'Montserrat', category: 'sans' },
  { name: 'Raleway', category: 'sans' },
  { name: 'Work Sans', category: 'sans' },
  { name: 'DM Sans', category: 'sans' },
  { name: 'Manrope', category: 'sans' },
  { name: 'Outfit', category: 'sans' },
  { name: 'Plus Jakarta Sans', category: 'sans' },
  { name: 'Figtree', category: 'sans' },
  { name: 'Nunito', category: 'sans' },
  { name: 'Rubik', category: 'sans' },
  { name: 'Lato', category: 'sans' },
  { name: 'Open Sans', category: 'sans' },
  { name: 'Source Sans 3', category: 'sans' },
  { name: 'Barlow', category: 'sans' },
  { name: 'Karla', category: 'sans' },
  { name: 'Playfair Display', category: 'serif' },
  { name: 'Merriweather', category: 'serif' },
  { name: 'Lora', category: 'serif' },
  { name: 'Cormorant Garamond', category: 'serif' },
  { name: 'Libre Baskerville', category: 'serif' },
  { name: 'Crimson Pro', category: 'serif' },
  { name: 'Bitter', category: 'serif' },
  { name: 'Spectral', category: 'serif' },
  { name: 'Anton', category: 'display' },
  { name: 'Bebas Neue', category: 'display' },
  { name: 'Oswald', category: 'display' },
  { name: 'Archivo Black', category: 'display' },
  { name: 'Righteous', category: 'display' },
  { name: 'Alfa Slab One', category: 'display' },
  { name: 'Teko', category: 'display' },
  { name: 'Fjalla One', category: 'display' },
  { name: 'JetBrains Mono', category: 'mono' },
  { name: 'IBM Plex Mono', category: 'mono' },
  { name: 'Space Mono', category: 'mono' },
  { name: 'Caveat', category: 'handwriting' },
  { name: 'Dancing Script', category: 'handwriting' },
  { name: 'Pacifico', category: 'handwriting' },
  { name: 'Permanent Marker', category: 'handwriting' },
  { name: 'Shadows Into Light', category: 'handwriting' },
];

export const GOOGLE_FONTS: FontOption[] = GOOGLE_FAMILIES.map(({ name, category }) => ({
  value: name,
  label: name,
  source: 'google',
  category,
  google: name,
}));

export const ALL_FONTS: FontOption[] = [...BUNDLED_FONTS, ...GOOGLE_FONTS];

const BY_VALUE = new Map(ALL_FONTS.map((font) => [font.value, font]));

export function findFont(value: string | undefined): FontOption | undefined {
  return value ? BY_VALUE.get(value) : undefined;
}

/* -------------------------------------------------------------------------- */
/* Runtime loading                                                            */
/* -------------------------------------------------------------------------- */

const loaded = new Set<string>();

/** Injects the Google Fonts stylesheet for one family, once per document. */
export function ensureFontLoaded(value: string | undefined): void {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;

  const font = findFont(value);
  if (!font || font.source !== 'google' || loaded.has(font.value)) return;

  loaded.add(font.value);

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href =
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.google!).replace(/%20/g, '+')}` +
    ':ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&display=swap';
  document.head.appendChild(link);
}

/** Walks a version and loads every non-bundled family it references. */
export function ensureFontsLoaded(version: SiteVersion): void {
  if (Platform.OS !== 'web') return;

  for (const role of Object.values(version.theme.roles)) {
    ensureFontLoaded(role.fontFamily);
  }

  for (const section of version.sections) {
    const blocks = [...section.blocks, ...(section.items ?? []).flatMap((item) => item.blocks)];
    for (const block of blocks) {
      ensureFontLoaded(block.style?.fontFamily);
      ensureFontLoaded(block.style?.tablet?.fontFamily);
      ensureFontLoaded(block.style?.desktop?.fontFamily);
    }
  }
}
