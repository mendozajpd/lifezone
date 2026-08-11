import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Section } from '@/components/layout/section';
import { MINISTRY_CONTENT } from '@/constants/content';
import { Colors, Fonts, Spacing } from '@/constants/theme';

export function Ministry() {
  return (
    <Section id="ministry" bordered style={styles.section}>
      <Text style={styles.title}>{MINISTRY_CONTENT.title}</Text>
      <View style={styles.grid}>
        {MINISTRY_CONTENT.pillars.map((pillar) => (
          <View key={pillar.title} style={styles.card}>
            <Image source={pillar.image} style={styles.cardImage} contentFit="cover" />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{pillar.title}</Text>
              <Text style={styles.cardBody}>{pillar.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.lg,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 28,
    color: Colors.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  card: {
    flexGrow: 1,
    flexBasis: 240,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    aspectRatio: 16 / 10,
  },
  cardContent: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  cardTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 17,
    color: Colors.text,
  },
  cardBody: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 14,
    lineHeight: 21,
    color: Colors.textMuted,
  },
});
