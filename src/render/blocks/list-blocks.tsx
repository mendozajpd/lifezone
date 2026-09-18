import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useSiteRender } from '@/render/context';
import { resolveSpacing, resolveTextStyle } from '@/render/style';
import type { Block } from '@/schema/types';

type BadgeListData = Extract<Block, { kind: 'badgeList' }>;
type SocialLinksData = Extract<Block, { kind: 'socialLinks' }>;
type InfoListData = Extract<Block, { kind: 'infoList' }>;

export function BadgeListBlock({ block }: { block: BadgeListData }) {
  const { theme, breakpoint } = useSiteRender();
  const textStyle = resolveTextStyle(theme, breakpoint, block.role ?? 'chip', block.style);

  return (
    <View style={[styles.wrap, resolveSpacing(block)]}>
      {block.items.map((item) => (
        <View
          key={item}
          style={[
            styles.badge,
            { borderColor: theme.colors.border, borderRadius: theme.radius.pill },
          ]}>
          <Text style={textStyle}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function SocialLinksBlock({ block }: { block: SocialLinksData }) {
  const { theme, breakpoint } = useSiteRender();
  const textStyle = resolveTextStyle(theme, breakpoint, block.role ?? 'link', block.style);

  return (
    <View
      style={[styles.social, { borderTopColor: theme.colors.border }, resolveSpacing(block)]}>
      {block.links.map((link) => (
        <Pressable
          key={link.id}
          accessibilityRole="link"
          onPress={() => Linking.openURL(link.url)}>
          <Text style={textStyle}>
            {link.label} · {link.handle}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export function InfoListBlock({ block }: { block: InfoListData }) {
  const { theme, breakpoint } = useSiteRender();
  const labelStyle = resolveTextStyle(theme, breakpoint, 'eyebrow');
  const valueStyle = resolveTextStyle(theme, breakpoint, block.role ?? 'infoValue', block.style);

  return (
    <View style={[styles.rows, resolveSpacing(block)]}>
      {block.items.map((item) => (
        <View key={item.id}>
          <Text style={[labelStyle, styles.rowLabel]}>{item.label}</Text>
          <Text style={valueStyle}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  badge: {
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  social: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  rows: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xl,
  },
  rowLabel: {
    marginBottom: Spacing.xs,
  },
});
