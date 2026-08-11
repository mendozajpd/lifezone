import { StyleSheet, Text, View } from 'react-native';

import { Section } from '@/components/layout/section';
import { GET_INVOLVED } from '@/constants/content';
import { Colors, Fonts, Spacing } from '@/constants/theme';

export function GetInvolved() {
  return (
    <Section id="get-involved" bordered style={styles.section}>
      <Text style={styles.title}>{GET_INVOLVED.title}</Text>

      <View style={styles.block}>
        <Text style={styles.heading}>{GET_INVOLVED.collegeCrew.heading}</Text>
        <Text style={styles.body}>{GET_INVOLVED.collegeCrew.body}</Text>

        <Text style={styles.campusesLabel}>{GET_INVOLVED.collegeCrew.campusesLabel}</Text>
        <View style={styles.campusGrid}>
          {GET_INVOLVED.collegeCrew.campuses.map((campus) => (
            <View key={campus} style={styles.campusChip}>
              <Text style={styles.campusText}>{campus}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.block}>
        <Text style={styles.heading}>{GET_INVOLVED.catchUp.heading}</Text>
        <Text style={styles.body}>{GET_INVOLVED.catchUp.body}</Text>
        <Text style={styles.tagline}>{GET_INVOLVED.catchUp.tagline}</Text>
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.xl,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 28,
    color: Colors.text,
  },
  block: {
    gap: Spacing.sm,
  },
  heading: {
    fontFamily: Fonts.display,
    fontSize: 20,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  body: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 15,
    lineHeight: 23,
    color: Colors.textMuted,
    maxWidth: 560,
  },
  campusesLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  campusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  campusChip: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  campusText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    letterSpacing: 0.5,
    color: Colors.text,
  },
  tagline: {
    fontFamily: Fonts.bodyRegular,
    fontStyle: 'italic',
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
});
