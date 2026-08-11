import { Image } from 'expo-image';
import type { PropsWithChildren } from 'react';
import {
  StyleSheet,
  View,
  type ImageSourcePropType,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { MAX_CONTENT_WIDTH } from '@/constants/layout';
import { Colors, Spacing } from '@/constants/theme';
import { useScroll } from '@/context/scroll-context';

type SectionProps = PropsWithChildren<{
  id: string;
  bordered?: boolean;
  style?: StyleProp<ViewStyle>;
  backgroundImage?: ImageSourcePropType;
}>;

export function Section({ id, bordered, style, backgroundImage, children }: SectionProps) {
  const { registerSection } = useScroll();

  const handleLayout = (event: LayoutChangeEvent) => {
    registerSection(id, event.nativeEvent.layout.y);
  };

  return (
    <View onLayout={handleLayout} style={[styles.outer, bordered && styles.bordered]}>
      {backgroundImage && (
        <>
          <Image source={backgroundImage} style={StyleSheet.absoluteFill} contentFit="cover" />
          <View style={[StyleSheet.absoluteFill, styles.overlay]} />
        </>
      )}
      <View style={[styles.inner, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
  },
  bordered: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  overlay: {
    backgroundColor: 'rgba(10, 10, 10, 0.82)',
  },
  inner: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
  },
});
