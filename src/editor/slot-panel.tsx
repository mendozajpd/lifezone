import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { DEFAULT_SLOT_ID } from '@/constants/site';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import type { PublishStatus } from '@/editor/use-editor-document';
import type { SlotSummary } from '@/lib/firebase';

/**
 * Save slots: independent copies of the whole site.
 *
 * The default slot is padlocked — it is the "known good" the site shipped with,
 * so it can be edited and published but never deleted. Exactly one slot is live
 * at a time, marked here and set with "Show as website".
 */
export function SlotPanel({
  slots,
  activeSlotId,
  liveSlotId,
  publishStatus,
  publishError,
  busy,
  onSelect,
  onAdd,
  onDuplicate,
  onRename,
  onDelete,
  onPublish,
}: {
  slots: SlotSummary[];
  activeSlotId: string;
  liveSlotId: string | null;
  publishStatus: PublishStatus;
  publishError: string | null;
  busy: boolean;
  onSelect: (slotId: string) => void;
  onAdd: (name: string) => void;
  onDuplicate: (name: string) => void;
  onRename: (name: string) => void;
  onDelete: (slotId: string) => void;
  onPublish: () => void;
}) {
  const [renaming, setRenaming] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const active = slots.find((slot) => slot.id === activeSlotId);
  const activeIsLive = liveSlotId === activeSlotId;

  const nextName = (base: string) => {
    const taken = new Set(slots.map((slot) => slot.name));
    let n = 1;
    let candidate = base;
    while (taken.has(candidate)) candidate = `${base} ${++n}`;
    return candidate;
  };

  return (
    <View style={styles.panel}>
      <View style={styles.headingRow}>
        <Text style={styles.heading}>Saves</Text>
        <Pressable
          accessibilityLabel="New save slot"
          disabled={busy}
          onPress={() => onAdd(nextName('New save'))}
          style={({ pressed }) => [styles.add, pressed && styles.addPressed, busy && styles.dim]}>
          <Text style={styles.addLabel}>+</Text>
        </Pressable>
      </View>

      <View style={styles.list}>
        {slots.map((slot) => {
          const selected = slot.id === activeSlotId;
          const isLive = slot.id === liveSlotId;

          return (
            <Pressable
              key={slot.id}
              disabled={busy}
              onPress={() => onSelect(slot.id)}
              style={[styles.slot, selected && styles.slotSelected]}>
              <Text numberOfLines={1} style={styles.slotName}>
                {slot.isDefault ? '🔒 ' : ''}
                {slot.name}
              </Text>
              {isLive && (
                <View style={styles.liveTag}>
                  <Text style={styles.liveTagLabel}>LIVE</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {active && (
        <View style={styles.actions}>
          {renaming ? (
            <View style={styles.renameRow}>
              <TextInput
                value={draftName}
                onChangeText={setDraftName}
                autoFocus
                placeholder="Save name"
                placeholderTextColor={Colors.textMuted}
                style={styles.renameInput}
                onSubmitEditing={() => {
                  if (draftName.trim()) onRename(draftName.trim());
                  setRenaming(false);
                }}
              />
              <SmallButton
                label="Save"
                onPress={() => {
                  if (draftName.trim()) onRename(draftName.trim());
                  setRenaming(false);
                }}
              />
            </View>
          ) : (
            <View style={styles.buttonRow}>
              <SmallButton
                label="Rename"
                disabled={busy}
                onPress={() => {
                  setDraftName(active.name);
                  setRenaming(true);
                }}
              />
              <SmallButton
                label="Duplicate"
                disabled={busy}
                onPress={() => onDuplicate(nextName(`${active.name} copy`))}
              />
            </View>
          )}

          {!active.isDefault &&
            (confirmDelete === active.id ? (
              <SmallButton
                label="Tap again to delete this save"
                danger
                onPress={() => {
                  onDelete(active.id);
                  setConfirmDelete(null);
                }}
              />
            ) : (
              <SmallButton
                label="Delete save"
                disabled={busy}
                onPress={() => setConfirmDelete(active.id)}
              />
            ))}

          <Pressable
            disabled={busy || publishStatus === 'publishing'}
            onPress={onPublish}
            style={({ pressed }) => [
              styles.publish,
              pressed && styles.publishPressed,
              (busy || publishStatus === 'publishing') && styles.dim,
            ]}>
            <Text style={styles.publishLabel}>
              {publishStatus === 'publishing'
                ? 'Publishing…'
                : activeIsLive
                  ? 'Update the website'
                  : 'Show this as the website'}
            </Text>
          </Pressable>

          {publishStatus === 'published' && (
            <Text style={styles.note}>Published. Visitors see this save now.</Text>
          )}
          {publishStatus === 'error' && <Text style={styles.error}>{publishError}</Text>}
          {active.isDefault && (
            <Text style={styles.note}>The default save is protected and can’t be deleted.</Text>
          )}
        </View>
      )}
    </View>
  );
}

function SmallButton({
  label,
  onPress,
  disabled,
  danger,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.small,
        danger && styles.smallDanger,
        pressed && !disabled && styles.smallPressed,
        disabled && styles.dim,
      ]}>
      <Text style={[styles.smallLabel, danger && styles.smallLabelDanger]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: Spacing.sm,
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  add: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPressed: {
    backgroundColor: Colors.border,
  },
  addLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 18,
    color: Colors.text,
  },
  list: {
    gap: 3,
  },
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingVertical: 8,
    paddingHorizontal: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  slotSelected: {
    borderColor: Colors.text,
    backgroundColor: Colors.background,
  },
  slotName: {
    flex: 1,
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    color: Colors.text,
  },
  liveTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  liveTagLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 9,
    letterSpacing: 0.5,
    color: '#052E16',
  },
  actions: {
    gap: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  renameRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    alignItems: 'center',
  },
  renameInput: {
    flex: 1,
    fontFamily: Fonts.bodyRegular,
    fontSize: 13,
    color: Colors.text,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  small: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  smallDanger: {
    borderColor: '#F87171',
  },
  smallPressed: {
    backgroundColor: Colors.border,
  },
  smallLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    color: Colors.text,
    textAlign: 'center',
  },
  smallLabelDanger: {
    color: '#F87171',
  },
  publish: {
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.text,
    alignItems: 'center',
  },
  publishPressed: {
    opacity: 0.85,
  },
  publishLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.background,
  },
  dim: {
    opacity: 0.45,
  },
  note: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 11,
    lineHeight: 16,
    color: Colors.textMuted,
  },
  error: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 16,
    color: '#F87171',
  },
});

export { DEFAULT_SLOT_ID };
