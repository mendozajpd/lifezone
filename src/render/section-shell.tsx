import { Image } from 'expo-image';
import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';

import { MAX_CONTENT_WIDTH } from '@/constants/layout';
import { Spacing } from '@/constants/theme';
import { useScroll } from '@/context/scroll-context';
import { resolveMediaSource } from '@/render/media';
import { useSiteTheme } from '@/render/context';
import type { Section } from '@/schema/types';

/**
 * The frame every section renders inside: background, scrim, top border,
 * padding and the centred content column. Templates only lay out their blocks.
 */
export function SectionShell({
  section,
  contentStyle,
  children,
}: PropsWithChildren<{ section: Section; contentStyle?: StyleProp<ViewStyle> }>) {
  const { registerSection } = useScroll();
  const theme = useSiteTheme();
  const layout = section.layout;
  const background = section.background;

  const handleLayout = (event: LayoutChangeEvent) => {
    registerSection(section.id, event.nativeEvent.layout.y);
  };

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.outer,
        {
          paddingVertical: layout?.paddingVertical ?? Spacing.xxxl,
          paddingHorizontal: layout?.paddingHorizontal ?? Spacing.lg,
        },
        section.bordered && { borderTopWidth: 1, borderTopColor: theme.colors.border },
        background.kind === 'color' && { backgroundColor: background.color },
      ]}>
      {background.kind === 'image' && background.media && (
        <>
          <Image
            source={resolveMediaSource(background.media)}
            alt={background.media.alt}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            blurRadius={background.blur}
          />
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: background.overlayColor ?? theme.colors.background,
                opacity: background.overlayOpacity ?? 0,
              },
            ]}
          />
        </>
      )}

      <View
        style={[
          styles.inner,
          {
            maxWidth: layout?.maxWidth ?? MAX_CONTENT_WIDTH,
            minHeight: layout?.minHeight,
            gap: layout?.gap,
          },
          layout?.align === 'center' && styles.centered,
          contentStyle,
        ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
  },
  inner: {
    width: '100%',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
