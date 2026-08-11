import { StyleSheet, Text } from 'react-native';

import { Section } from '@/components/layout/section';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { HERO_CONTENT, SECTION_BACKGROUNDS } from '@/constants/content';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { useScroll } from '@/context/scroll-context';

export function Hero() {
  const { scrollToSection } = useScroll();

  return (
    <Section id="hero" style={styles.section} backgroundImage={SECTION_BACKGROUNDS.hero}>
      <Logo size="lg" />
      {/* <Text style={styles.eyebrow}>{HERO_CONTENT.eyebrow}</Text> */}
      <Text style={styles.headline}>{HERO_CONTENT.headline}</Text>
      <Text style={styles.subheadline}>{HERO_CONTENT.subheadline}</Text>
      <Button label={HERO_CONTENT.ctaLabel} onPress={() => scrollToSection(HERO_CONTENT.ctaTarget)} />
    </Section>
  );
}

const styles = StyleSheet.create({
  section: {
    alignItems: 'center',
    gap: Spacing.lg,
    minHeight: 560,
    justifyContent: 'center',
  },
  eyebrow: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.textMuted,
    marginTop: Spacing.md,
  },
  headline: {
    fontFamily: Fonts.display,
    fontSize: 48,
    color: Colors.text,
    textAlign: 'center',
    paddingLeft: 2
  },
  subheadline: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 17,
    lineHeight: 26,
    color: Colors.textMuted,
    textAlign: 'center',
    maxWidth: 560,
  },
});
