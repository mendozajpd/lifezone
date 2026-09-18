import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { BlockList, splitLeadingImage } from '@/render/blocks/block-list';
import { ImageBlock } from '@/render/blocks/image-block';
import { useSiteTheme } from '@/render/context';
import { SectionShell } from '@/render/section-shell';
import type { TemplateProps } from '@/render/templates/types';

/** Wrapping grid of equal-height photo tiles. */
export function GalleryGrid({ section }: TemplateProps) {
  const theme = useSiteTheme();
  const items = section.items ?? [];

  return (
    <SectionShell section={section}>
      <BlockList sectionId={section.id} blocks={section.blocks} />

      <View style={styles.grid}>
        {items.map((item) => {
          if (item.hidden) return null;
          const { media } = splitLeadingImage(item.blocks);
          if (!media) return null;

          return (
            <View
              key={item.id}
              style={[
                styles.tile,
                {
                  aspectRatio: media.aspectRatio ?? 4 / 3,
                  borderRadius: media.borderRadius ?? theme.radius.image,
                  backgroundColor: theme.colors.surface,
                },
              ]}>
              <ImageBlock block={media} fill />
            </View>
          );
        })}
      </View>
    </SectionShell>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  tile: {
    flexGrow: 1,
    flexBasis: 260,
    overflow: 'hidden',
  },
});
