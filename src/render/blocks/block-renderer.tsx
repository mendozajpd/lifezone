import { Pressable, StyleSheet, View } from 'react-native';

import { ButtonBlock } from '@/render/blocks/button-block';
import { ImageBlock } from '@/render/blocks/image-block';
import { BadgeListBlock, InfoListBlock, SocialLinksBlock } from '@/render/blocks/list-blocks';
import {
  ContactFormBlock,
  DividerBlock,
  LogoBlock,
  SpacerBlock,
} from '@/render/blocks/misc-blocks';
import { TextBlock } from '@/render/blocks/text-block';
import { useSiteTheme } from '@/render/context';
import { isSameTarget, useEditor, type EditorTarget } from '@/render/editor-context';
import type { Block } from '@/schema/types';

function BlockBody({ block }: { block: Block }) {
  switch (block.kind) {
    case 'heading':
    case 'paragraph':
      return <TextBlock block={block} />;
    case 'button':
      return <ButtonBlock block={block} />;
    case 'image':
      return <ImageBlock block={block} />;
    case 'badgeList':
      return <BadgeListBlock block={block} />;
    case 'socialLinks':
      return <SocialLinksBlock block={block} />;
    case 'infoList':
      return <InfoListBlock block={block} />;
    case 'contactForm':
      return <ContactFormBlock block={block} />;
    case 'logo':
      return <LogoBlock block={block} />;
    case 'divider':
      return <DividerBlock block={block} />;
    case 'spacer':
      return <SpacerBlock block={block} />;
  }
}

/**
 * Renders one block, plus selection chrome when an editor is mounted.
 *
 * On the public site `useEditor()` is null and this is a pure pass-through. In
 * the editor the wrapper inherits the block's flex sizing and draws its
 * selection ring as an absolutely positioned overlay, so the canvas lays out
 * pixel-for-pixel the same as the live page.
 */
export function BlockRenderer({ block, target }: { block: Block; target: EditorTarget }) {
  const editor = useEditor();
  const theme = useSiteTheme();

  if (block.hidden && !editor) {
    return null;
  }

  if (!editor) {
    return <BlockBody block={block} />;
  }

  const selected = isSameTarget(editor.selected, target);
  const flex =
    block.kind === 'image' ? { flexGrow: block.grow, flexBasis: block.basis } : undefined;

  return (
    <Pressable style={flex} onPress={() => editor.select(target)}>
      <View style={[styles.wrapper, block.hidden && styles.hidden]}>
        <BlockBody block={block} />
        {selected && (
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, styles.ring, { borderColor: theme.colors.accent }]}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  ring: {
    borderWidth: 2,
    borderRadius: 4,
  },
  hidden: {
    opacity: 0.35,
  },
});
