import { Pressable, StyleSheet, Text, type GestureResponderEvent } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';

type ButtonProps = {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: 'solid' | 'outline';
};

export function Button({ label, onPress, variant = 'solid' }: ButtonProps) {
  const isOutline = variant === 'outline';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isOutline ? styles.outline : styles.solid,
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.label, isOutline && styles.outlineLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: {
    backgroundColor: Colors.text,
  },
  outline: {
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 15,
    color: Colors.background,
  },
  outlineLabel: {
    color: Colors.text,
  },
});
