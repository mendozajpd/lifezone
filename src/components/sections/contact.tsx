import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Section } from '@/components/layout/section';
import { ContactForm } from '@/components/sections/contact-form';
import { CONTACT_CONTENT, CONTACT_INFO, SECTION_BACKGROUNDS } from '@/constants/content';
import { Colors, Fonts, Spacing } from '@/constants/theme';

export function Contact() {
  return (
    <Section id="contact" bordered style={styles.section} backgroundImage={SECTION_BACKGROUNDS.contact}>
      <Text style={styles.title}>{CONTACT_CONTENT.title}</Text>
      {CONTACT_CONTENT.paragraphs.map((paragraph, index) => (
        <Text key={index} style={styles.paragraph}>
          {paragraph}
        </Text>
      ))}

      <View style={styles.rows}>
        <View>
          <Text style={styles.rowLabel}>Address</Text>
          <Text style={styles.rowValue}>{CONTACT_INFO.address}</Text>
        </View>
      </View>

      <ContactForm />

      <View style={styles.social}>
        {CONTACT_INFO.social.map((link) => (
          <Pressable key={link.label} onPress={() => Linking.openURL(link.url)}>
            <Text style={styles.socialText}>
              {link.label} · {link.handle}
            </Text>
          </Pressable>
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
  paragraph: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 16,
    lineHeight: 25,
    color: Colors.textMuted,
    maxWidth: 560,
  },
  rows: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xl,
  },
  rowLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  rowValue: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 16,
    color: Colors.text,
  },
  social: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  socialText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    color: Colors.text,
  },
});
