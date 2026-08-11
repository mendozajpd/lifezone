import { StyleSheet, Text, View } from 'react-native';

import { Logo } from '@/components/ui/logo';
import { CONTACT_INFO } from '@/constants/content';
import { Colors, Fonts, Spacing } from '@/constants/theme';

export function Footer() {
  return (
    <View style={styles.wrapper}>
      <Logo size="sm" />
      <Text style={styles.text}>{CONTACT_INFO.address}</Text>
      <Text style={styles.copyright}>
        © {new Date().getFullYear()} Lifezone Tacloban. All rights reserved.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  text: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 13,
    color: Colors.textMuted,
  },
  copyright: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: Spacing.md,
  },
});
