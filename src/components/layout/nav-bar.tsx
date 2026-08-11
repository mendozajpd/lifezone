import { Platform, Pressable, ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { LogoName } from '@/components/ui/logo-name';
import { NAV_ITEMS } from '@/constants/content';
import { HEADER_HEIGHT, MAX_CONTENT_WIDTH } from '@/constants/layout';
import { Colors, Fonts } from '@/constants/theme';
import { useScroll } from '@/context/scroll-context';

// react-native-web supports `position: 'fixed'`; core RN's ViewStyle type doesn't list it.
const fixedOnWeb = (Platform.OS === 'web' ? { position: 'fixed' } : { position: 'relative' }) as ViewStyle;

export function NavBar() {
  const { scrollToSection } = useScroll();

  return (
    <View style={[styles.wrapper, fixedOnWeb]}>
      <View style={styles.inner}>
        <Pressable onPress={() => scrollToSection('hero')} hitSlop={8}>
          <LogoName size="sm" />
        </Pressable>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.links}>
          {NAV_ITEMS.slice(1).map((item) => (
            <Pressable key={item.id} onPress={() => scrollToSection(item.id)} hitSlop={8}>
              <Text style={styles.link}>{item.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 50,
    backgroundColor: 'rgba(10, 10, 10, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  links: {
    flexDirection: 'row',
    gap: 24,
  },
  link: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
});
