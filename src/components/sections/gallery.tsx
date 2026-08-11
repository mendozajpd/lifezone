import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Section } from '@/components/layout/section';
import { GALLERY_IMAGES } from '@/constants/content';
import { Colors, Fonts, Spacing } from '@/constants/theme';

export function Gallery() {
  return (
    <Section id="gallery" bordered style={styles.section}>
      <Text style={styles.title}>Gallery</Text>
      <Text style={styles.caption}>A few moments from Lifezone.</Text>
      <View style={styles.grid}>
        {GALLERY_IMAGES.map((photo) => (
          <View key={photo.id} style={styles.tile}>
            <Image
              source={photo.source}
              style={styles.image}
              contentFit="cover"
              transition={200}
              alt={photo.caption}
            />
          </View>
        ))}
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.md,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 28,
    color: Colors.text,
  },
  caption: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  tile: {
    flexGrow: 1,
    flexBasis: 260,
    aspectRatio: 4 / 3,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
