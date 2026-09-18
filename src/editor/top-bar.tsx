import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Spacing } from '@/constants/theme';
import type { SaveStatus } from '@/editor/use-editor-document';
import type { Breakpoint } from '@/schema/types';

const DEVICES: { key: Breakpoint; label: string }[] = [
  { key: 'desktop', label: 'Desktop' },
  { key: 'tablet', label: 'Tablet' },
  { key: 'base', label: 'Phone' },
];

function saveLabel(status: SaveStatus, dirty: boolean): string {
  if (status === 'saving') return 'Saving…';
  if (dirty) return 'Unsaved changes';
  // Covers both "just loaded, nothing changed" and "everything written".
  return 'Up to date';
}

export function TopBar({
  email,
  device,
  onDeviceChange,
  saveStatus,
  saveError,
  dirty,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSignOut,
}: {
  email: string | null;
  device: Breakpoint;
  onDeviceChange: (device: Breakpoint) => void;
  saveStatus: SaveStatus;
  saveError: string | null;
  dirty: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSignOut: () => void;
}) {
  return (
    <View style={styles.bar}>
      <View style={styles.group}>
        <Text style={styles.brand}>Site editor</Text>
        <Text style={[styles.status, saveStatus === 'error' && styles.statusError]}>
          {saveError ?? saveLabel(saveStatus, dirty)}
        </Text>
      </View>

      <View style={styles.segmented}>
        {DEVICES.map((option) => (
          <Pressable
            key={option.key}
            onPress={() => onDeviceChange(option.key)}
            style={[styles.segment, device === option.key && styles.segmentActive]}>
            <Text style={[styles.segmentLabel, device === option.key && styles.segmentLabelActive]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.group}>
        <IconButton label="Undo" disabled={!canUndo} onPress={onUndo} />
        <IconButton label="Redo" disabled={!canRedo} onPress={onRedo} />
        {email && <Text style={styles.email}>{email}</Text>}
        <IconButton label="Sign out" onPress={onSignOut} />
      </View>
    </View>
  );
}

function IconButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.iconButton,
        pressed && !disabled && styles.iconButtonPressed,
        disabled && styles.iconButtonDisabled,
      ]}>
      <Text style={styles.iconLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  brand: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    color: Colors.text,
  },
  status: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 12,
    color: Colors.textMuted,
  },
  statusError: {
    color: '#F87171',
  },
  email: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 12,
    color: Colors.textMuted,
  },
  segmented: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 999,
    padding: 2,
  },
  segment: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  segmentActive: {
    backgroundColor: Colors.text,
  },
  segmentLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    color: Colors.textMuted,
  },
  segmentLabelActive: {
    color: Colors.background,
  },
  iconButton: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconButtonPressed: {
    backgroundColor: Colors.border,
  },
  iconButtonDisabled: {
    opacity: 0.4,
  },
  iconLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    color: Colors.text,
  },
});
