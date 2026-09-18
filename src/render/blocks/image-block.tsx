import { Image } from 'expo-image';

import { resolveMediaSource } from '@/render/media';
import { resolveSpacing } from '@/render/style';
import type { Block } from '@/schema/types';

type ImageBlockData = Extract<Block, { kind: 'image' }>;

export function ImageBlock({ block, fill }: { block: ImageBlockData; fill?: boolean }) {
  const { media } = block;

  return (
    <Image
      source={resolveMediaSource(media)}
      alt={media.alt}
      contentFit="cover"
      transition={block.transition}
      placeholder={media.kind === 'uploaded' ? media.placeholder : undefined}
      style={[
        fill
          ? { width: '100%', height: '100%' }
          : {
              flexGrow: block.grow,
              flexBasis: block.basis,
              width: block.grow === undefined && block.basis === undefined ? '100%' : undefined,
              aspectRatio: block.aspectRatio,
              borderRadius: block.borderRadius,
            },
        resolveSpacing(block),
      ]}
    />
  );
}
