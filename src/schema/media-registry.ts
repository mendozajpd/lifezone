import type { ImageSourcePropType } from 'react-native';

import type { BundledMediaKey, MediaRef } from '@/schema/types';

/**
 * Metro resolves `require` at build time from a string literal, so bundled
 * images cannot be looked up by a path stored in Firestore. Content references
 * them by key instead and they are resolved through this static map.
 */
export const BUNDLED_MEDIA: Record<BundledMediaKey, ImageSourcePropType> = {
  'gallery-1': require('@/assets/images/gallery/gallery-1.jpg'),
  'gallery-2': require('@/assets/images/gallery/gallery-2.jpg'),
  'gallery-3': require('@/assets/images/gallery/gallery-3.jpg'),
  'gallery-4': require('@/assets/images/gallery/gallery-4.jpg'),
  'gallery-5': require('@/assets/images/gallery/gallery-5.jpg'),
  'gallery-6': require('@/assets/images/gallery/gallery-6.jpg'),
  'gallery-7': require('@/assets/images/gallery/gallery-7.jpg'),
  'gallery-8': require('@/assets/images/gallery/gallery-8.jpg'),
  'gallery-9': require('@/assets/images/gallery/gallery-9.jpg'),
  'gallery-10': require('@/assets/images/gallery/gallery-10.jpg'),
  'gallery-11': require('@/assets/images/gallery/gallery-11.jpg'),
  'gallery-12': require('@/assets/images/gallery/gallery-12.jpg'),
};

const BUNDLED_DIMENSIONS: Record<BundledMediaKey, { width: number; height: number }> = {
  'gallery-1': { width: 1439, height: 959 },
  'gallery-2': { width: 1415, height: 961 },
  'gallery-3': { width: 2730, height: 1820 },
  'gallery-4': { width: 2730, height: 1820 },
  'gallery-5': { width: 3461, height: 2595 },
  'gallery-6': { width: 3455, height: 2591 },
  'gallery-7': { width: 2624, height: 1749 },
  'gallery-8': { width: 2730, height: 1820 },
  'gallery-9': { width: 2730, height: 1820 },
  'gallery-10': { width: 2730, height: 1820 },
  'gallery-11': { width: 2730, height: 1820 },
  'gallery-12': { width: 2730, height: 1820 },
};

/** Convenience constructor so `defaults.ts` stays readable. */
export function bundled(key: BundledMediaKey, alt: string): MediaRef {
  return { kind: 'bundled', key, ...BUNDLED_DIMENSIONS[key], alt };
}

export const BUNDLED_MEDIA_KEYS = Object.keys(BUNDLED_MEDIA) as BundledMediaKey[];
