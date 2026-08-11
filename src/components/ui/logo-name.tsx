import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';

type LogoNameProps = {
  size?: 'sm' | 'md' | 'lg';
};

const FONT_SIZE_MAP = { sm: 16, md: 22, lg: 36 } as const;

export function LogoName({ size = 'md' }: LogoNameProps) {
  const fontSize = FONT_SIZE_MAP[size];
  const markSize = fontSize * 1.1;
  const logoSize = fontSize * 3.5;

  return (
    <View style={styles.row}>
      <Image
        source={require('@/assets/images/logo-mark-1.png')}
        style={{ width: logoSize, height: logoSize }}
        contentFit="contain"
      />
      <Text style={[styles.text, { fontSize, lineHeight: fontSize * 1.2 }]}></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    fontFamily: Fonts.wordmark,
    color: Colors.text,
    letterSpacing: 3,
  },
});
