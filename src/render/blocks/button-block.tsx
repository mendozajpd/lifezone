import { Linking, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { useScroll } from '@/context/scroll-context';
import { resolveSpacing } from '@/render/style';
import type { Block } from '@/schema/types';

type ButtonBlockData = Extract<Block, { kind: 'button' }>;

export function ButtonBlock({ block }: { block: ButtonBlockData }) {
  const { scrollToSection } = useScroll();

  const handlePress = () => {
    if (block.action.kind === 'scrollTo') {
      scrollToSection(block.action.sectionId);
      return;
    }
    Linking.openURL(block.action.url);
  };

  return (
    <View style={resolveSpacing(block)}>
      <Button label={block.label} variant={block.variant ?? 'solid'} onPress={handlePress} />
    </View>
  );
}
