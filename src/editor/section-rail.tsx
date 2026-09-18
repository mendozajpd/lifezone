import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Spacing } from '@/constants/theme';
import type { EditorAction } from '@/editor/state';
import type { SiteVersion } from '@/schema/types';

/**
 * The page outline: every section in order, with visibility and ordering.
 *
 * Ordering is by explicit move controls for now; pointer dragging lands with
 * the rest of the drag work, and these keep the rail usable by keyboard either
 * way.
 */
export function SectionRail({
  version,
  selectedSectionId,
  onSelect,
  dispatch,
}: {
  version: SiteVersion;
  selectedSectionId: string | null;
  onSelect: (sectionId: string) => void;
  dispatch: (action: EditorAction) => void;
}) {
  return (
    <View style={styles.rail}>
      <Text style={styles.heading}>Sections</Text>
      <ScrollView contentContainerStyle={styles.list}>
        {version.sections.map((section, index) => {
          const selected = section.id === selectedSectionId;
          return (
            <Pressable
              key={section.id}
              onPress={() => onSelect(section.id)}
              style={[styles.row, selected && styles.rowSelected]}>
              <View style={styles.rowMain}>
                <Text
                  numberOfLines={1}
                  style={[styles.label, !section.visible && styles.labelHidden]}>
                  {section.label}
                </Text>
                <Text style={styles.type}>{section.type}</Text>
              </View>

              <View style={styles.controls}>
                <MiniButton
                  label={section.visible ? '👁' : '🚫'}
                  hint={section.visible ? 'Hide section' : 'Show section'}
                  onPress={() =>
                    dispatch({
                      type: 'patchSection',
                      sectionId: section.id,
                      patch: { visible: !section.visible },
                    })
                  }
                />
                <MiniButton
                  label="↑"
                  hint="Move up"
                  disabled={index === 0}
                  onPress={() => dispatch({ type: 'moveSection', sectionId: section.id, delta: -1 })}
                />
                <MiniButton
                  label="↓"
                  hint="Move down"
                  disabled={index === version.sections.length - 1}
                  onPress={() => dispatch({ type: 'moveSection', sectionId: section.id, delta: 1 })}
                />
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function MiniButton({
  label,
  hint,
  onPress,
  disabled,
}: {
  label: string;
  hint: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={hint}
      style={({ pressed }) => [
        styles.mini,
        pressed && !disabled && styles.miniPressed,
        disabled && styles.miniDisabled,
      ]}>
      <Text style={styles.miniLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  rail: {
    width: 260,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  heading: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.textMuted,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  list: {
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.md,
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rowSelected: {
    borderColor: Colors.text,
    backgroundColor: Colors.background,
  },
  rowMain: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    color: Colors.text,
  },
  labelHidden: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  type: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 11,
    color: Colors.textMuted,
  },
  controls: {
    flexDirection: 'row',
    gap: 2,
  },
  mini: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  miniPressed: {
    backgroundColor: Colors.border,
  },
  miniDisabled: {
    opacity: 0.3,
  },
  miniLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    color: Colors.text,
  },
});
