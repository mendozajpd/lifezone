import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { BlockList, splitLeadingImage } from '@/render/blocks/block-list';
import { BlockRenderer } from '@/render/blocks/block-renderer';
import { SectionShell } from '@/render/section-shell';
import type { TemplateProps } from '@/render/templates/types';

/** Photo beside a column of copy; wraps to stacked on narrow screens. */
export function TextMediaSplit({ section }: TemplateProps) {
  const { media, rest } = splitLeadingImage(section.blocks);

  return (
    <SectionShell section={section}>
      <View style={styles.row}>
        {media && (
          <BlockRenderer
            block={media}
            target={{ sectionId: section.id, blockId: media.id }}
          />
        )}
        <View style={styles.textCol}>
          <BlockList sectionId={section.id} blocks={rest} />
        </View>
      </View>
    </SectionShell>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  textCol: {
    flexGrow: 2,
    flexBasis: 320,
    gap: Spacing.md,
  },
});
