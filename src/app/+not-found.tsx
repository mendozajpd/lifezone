import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PageMeta } from '@/components/layout/page-meta';
import { Colors, Fonts } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <PageMeta />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn&apos;t exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.background,
    gap: 16,
  },
  title: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 18,
    color: Colors.text,
  },
  link: {
    paddingVertical: 8,
  },
  linkText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 15,
    color: Colors.textMuted,
    textDecorationLine: 'underline',
  },
});
