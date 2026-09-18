import { Fragment } from 'react';

import { BlockRenderer } from '@/render/blocks/block-renderer';
import type { Block } from '@/schema/types';

/** Renders a run of blocks, wiring each one's editor target. */
export function BlockList({
  sectionId,
  itemId,
  blocks,
}: {
  sectionId: string;
  itemId?: string;
  blocks: Block[];
}) {
  return (
    <>
      {blocks.map((block) => (
        <Fragment key={block.id}>
          <BlockRenderer block={block} target={{ sectionId, itemId, blockId: block.id }} />
        </Fragment>
      ))}
    </>
  );
}

/**
 * Splits a block run into its leading image and the rest.
 *
 * Several templates follow the same convention — the first image is the
 * template's media slot (a card cover, the photo beside the vision copy) and
 * everything after it is body content. Centralising the rule keeps templates
 * interchangeable: the same item renders sensibly whichever one is chosen.
 */
export function splitLeadingImage(blocks: Block[]) {
  const index = blocks.findIndex((block) => block.kind === 'image');
  if (index === -1) {
    return { media: undefined, rest: blocks };
  }
  return {
    media: blocks[index] as Extract<Block, { kind: 'image' }>,
    rest: blocks.filter((_, i) => i !== index),
  };
}
