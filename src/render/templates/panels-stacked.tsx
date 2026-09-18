import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { BlockList } from '@/render/blocks/block-list';
import { SectionShell } from '@/render/section-shell';
import type { TemplateProps } from '@/render/templates/types';

/** Section heading over full-width panels stacked down the page. */
export function PanelsStacked({ section }: TemplateProps) {
  const items = section.items ?? [];

  return (
    <SectionShell section={section}>
      <BlockList sectionId={section.id} blocks={section.blocks} />

      {items.map((item) =>
        item.hidden ? null : (
          <View key={item.id} style={styles.panel}>
            <BlockList sectionId={section.id} itemId={item.id} blocks={item.blocks} />
          </View>
        )
      )}
    </SectionShell>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: Spacing.sm,
  },
});
