import { Text, type TextProps } from 'react-native';

import { useSiteRender } from '@/render/context';
import { interpolateText, resolveSpacing, resolveTextStyle } from '@/render/style';
import type { Block } from '@/schema/types';

type TextBlockData = Extract<Block, { kind: 'heading' | 'paragraph' }>;

export function TextBlock({ block }: { block: TextBlockData }) {
  const { theme, breakpoint } = useSiteRender();
  const style = resolveTextStyle(theme, breakpoint, block.role, block.style);

  // react-native-web maps these onto role="heading" + aria-level, so headings
  // stay real headings for crawlers and screen readers.
  const headingProps: TextProps & Record<string, unknown> =
    block.kind === 'heading'
      ? { accessibilityRole: 'header', 'aria-level': block.level ?? 2 }
      : {};

  return (
    <Text {...headingProps} style={[style, resolveSpacing(block)]}>
      {interpolateText(block.text)}
    </Text>
  );
}
