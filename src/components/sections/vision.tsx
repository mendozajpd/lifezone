import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Section } from '@/components/layout/section';
import { ABOUT_IMAGE, VISION_CONTENT } from '@/constants/content';
import { Colors, Fonts, Spacing } from '@/constants/theme';

export function Vision() {
  return (
    <Section id="vision" bordered>
      <View style={styles.row}>
        <Image source={ABOUT_IMAGE} style={styles.image} contentFit="cover" />
        <View style={styles.textCol}>
          <Text style={styles.title}>{VISION_CONTENT.title1}</Text>
          {VISION_CONTENT.paragraphs1.map((paragraph, index) => (
            <Text key={index} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}
          <Text style={styles.title}>{VISION_CONTENT.title2}</Text>
          {VISION_CONTENT.paragraphs2.map((paragraph, index) => (
            <Text key={index} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}
        </View>
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  image: {
    flexGrow: 1,
    flexBasis: 280,
    aspectRatio: 4 / 3,
    borderRadius: 16,
  },
  textCol: {
    flexGrow: 2,
    flexBasis: 320,
    gap: Spacing.md,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 28,
    color: Colors.text,
  },
  paragraph: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 16,
    lineHeight: 26,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
});
