import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { BlockList, splitLeadingImage } from '@/render/blocks/block-list';
import { BlockRenderer } from '@/render/blocks/block-renderer';
import { useSiteTheme } from '@/render/context';
import { SectionShell } from '@/render/section-shell';
import type { TemplateProps } from '@/render/templates/types';

/** Section heading over a wrapping grid of image-topped cards. */
export function CardsGrid({ section }: TemplateProps) {
  const theme = useSiteTheme();
  const items = section.items ?? [];

  return (
    <SectionShell section={section}>
      <BlockList sectionId={section.id} blocks={section.blocks} />

      <View style={styles.grid}>
        {items.map((item) => {
          if (item.hidden) return null;
          const { media, rest } = splitLeadingImage(item.blocks);

          return (
            <View
              key={item.id}
              style={[
                styles.card,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.card,
                },
              ]}>
              {media && (
                <BlockRenderer
                  block={media}
                  target={{ sectionId: section.id, itemId: item.id, blockId: media.id }}
                />
              )}
              <View style={styles.content}>
                <BlockList sectionId={section.id} itemId={item.id} blocks={rest} />
              </View>
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
  card: {
    flexGrow: 1,
    flexBasis: 240,
    borderWidth: 1,
    overflow: 'hidden',
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
});
