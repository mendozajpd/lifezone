import type { ImageSourcePropType } from 'react-native';

import { BUNDLED_MEDIA } from '@/schema/media-registry';
import type { MediaRef } from '@/schema/types';

/**
 * Turns a stored media reference into something `expo-image` can render.
 * Bundled images come from the static registry; uploaded ones resolve to the
 * smallest generated variant that still covers the display width.
 */
export function resolveMediaSource(media: MediaRef, displayWidth?: number): ImageSourcePropType {
  if (media.kind === 'bundled') {
    return BUNDLED_MEDIA[media.key];
  }

  const variants = media.variants;
  if (variants?.length && displayWidth) {
    // Variants are stored ascending by width.
    const match = variants.find((variant) => variant.width >= displayWidth);
    return { uri: (match ?? variants[variants.length - 1]).url };
  }

  return { uri: media.url };
}

/** `expo-image` places a background image using percentage-based focal points. */
export function focalPosition(media: MediaRef) {
  const focal = media.focal;
  if (!focal) return undefined;
  return { top: `${focal.y * 100}%`, left: `${focal.x * 100}%` } as const;
}

export function mediaAspectRatio(media: MediaRef): number | undefined {
  if (!media.width || !media.height) return undefined;
  return media.width / media.height;
}
