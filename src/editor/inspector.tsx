import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { TextField } from '@/components/ui/text-field';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { ImagePicker } from '@/editor/image-picker';
import { findBlock, findSection, hasDefault, type EditorAction } from '@/editor/state';
import { TypographyControls } from '@/editor/typography-controls';
import { getTemplate, templatesForType } from '@/render/registry';
import type { EditorTarget } from '@/render/editor-context';
import type { Block, SiteVersion } from '@/schema/types';

/** Blocks that render text and therefore get the type controls. */
const TEXTUAL = new Set<Block['kind']>([
  'heading',
  'paragraph',
  'button',
  'badgeList',
  'socialLinks',
  'infoList',
]);

export function Inspector({
  version,
  selected,
  dispatch,
  onDeleteSection,
}: {
  version: SiteVersion;
  selected: EditorTarget | null;
  dispatch: (action: EditorAction) => void;
  onDeleteSection: (sectionId: string) => void;
}) {
  if (!selected) {
    return (
      <View style={styles.panel}>
        <Text style={styles.empty}>
          Pick a section on the left, or click anything on the page to edit it.
        </Text>
      </View>
    );
  }

  const section = findSection(version, selected.sectionId);
  if (!section) {
    return (
      <View style={styles.panel}>
        <Text style={styles.empty}>That section no longer exists.</Text>
      </View>
    );
  }

  const block =
    selected.blockId !== undefined
      ? findBlock(version, {
          sectionId: selected.sectionId,
          itemId: selected.itemId,
          blockId: selected.blockId,
        })
      : undefined;

  const template = getTemplate(section.template);

  return (
    <View style={styles.panel}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.panelContent}>
        {block && selected.blockId !== undefined && (
          <Group title={`${blockTitle(block)} block`}>
            <BlockFields
              block={block}
              path={{
                sectionId: selected.sectionId,
                itemId: selected.itemId,
                blockId: selected.blockId,
              }}
              dispatch={dispatch}
            />
            {TEXTUAL.has(block.kind) && (
              <TypographyControls
                role={block.role}
                style={block.style}
                theme={version.theme}
                onChange={(style) =>
                  dispatch({
                    type: 'setBlockStyle',
                    path: {
                      sectionId: selected.sectionId,
                      itemId: selected.itemId,
                      blockId: selected.blockId!,
                    },
                    style,
                  })
                }
              />
            )}
            <Toggle
              label="Hidden"
              hint="Keeps the block in the draft but off the live page."
              value={block.hidden ?? false}
              onChange={() =>
                dispatch({
                  type: 'toggleBlockHidden',
                  path: {
                    sectionId: selected.sectionId,
                    itemId: selected.itemId,
                    blockId: selected.blockId!,
                  },
                })
              }
            />
        </Group>
        )}

        <Group title="Section">
          <TextField
            label="Name"
            value={section.label}
            onChangeText={(label) =>
              dispatch({ type: 'patchSection', sectionId: section.id, patch: { label } })
            }
            placeholder="Shown in the menu"
          />
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Layout</Text>
            <View style={styles.segmented}>
              {templatesForType(section.type).map((option) => (
                <Pressable
                  key={option.id}
                  onPress={() =>
                    dispatch({
                      type: 'patchSection',
                      sectionId: section.id,
                      patch: { template: option.id },
                    })
                  }
                  style={[styles.segment, option.id === section.template && styles.segmentActive]}>
                  <Text
                    style={[
                      styles.segmentLabel,
                      option.id === section.template && styles.segmentLabelActive,
                    ]}>
                    {option.name}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.meta}>{template?.description ?? section.template}</Text>
          </View>
          <Toggle
            label="Visible"
            hint="Hidden sections disappear from the live site."
            value={section.visible}
            onChange={(visible) =>
              dispatch({ type: 'patchSection', sectionId: section.id, patch: { visible } })
            }
          />
          <Toggle
            label="Show in menu"
            value={section.showInNav}
            onChange={(showInNav) =>
              dispatch({ type: 'patchSection', sectionId: section.id, patch: { showInNav } })
            }
          />
          {hasDefault(section.id) && (
            <ConfirmButton
              label="Restore this section to its original"
              confirmLabel="Tap again to restore — this discards your edits"
              onConfirm={() => dispatch({ type: 'resetSection', sectionId: section.id })}
            />
          )}
          <ConfirmButton
            label="Delete this section"
            confirmLabel="Tap again to delete this section"
            onConfirm={() => onDeleteSection(section.id)}
          />
        </Group>
      </ScrollView>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Per-block fields                                                           */
/* -------------------------------------------------------------------------- */

function blockTitle(block: Block): string {
  switch (block.kind) {
    case 'heading':
      return 'Heading';
    case 'paragraph':
      return 'Text';
    case 'button':
      return 'Button';
    case 'image':
      return 'Image';
    case 'badgeList':
      return 'Tag list';
    case 'socialLinks':
      return 'Social links';
    case 'infoList':
      return 'Details';
    case 'contactForm':
      return 'Contact form';
    case 'logo':
      return 'Logo';
    case 'divider':
      return 'Divider';
    case 'spacer':
      return 'Spacer';
  }
}

function BlockFields({
  block,
  path,
  dispatch,
}: {
  block: Block;
  path: { sectionId: string; itemId?: string; blockId: string };
  dispatch: (action: EditorAction) => void;
}) {
  switch (block.kind) {
    case 'heading':
    case 'paragraph':
      return (
        <TextField
          label="Text"
          value={block.text}
          multiline={block.kind === 'paragraph'}
          onChangeText={(text) => dispatch({ type: 'setBlockText', path, text })}
        />
      );

    case 'button':
      return (
        <TextField
          label="Label"
          value={block.label}
          onChangeText={(label) => dispatch({ type: 'setBlockLabel', path, label })}
        />
      );

    case 'badgeList':
      return (
        <>
          <TextField
            label="Items (one per line)"
            value={block.items.join('\n')}
            multiline
            onChangeText={(text) =>
              dispatch({
                type: 'setBadgeItems',
                path,
                items: text.split('\n').map((item) => item.trim()).filter(Boolean),
              })
            }
          />
          <Text style={styles.meta}>{block.items.length} items</Text>
        </>
      );

    case 'socialLinks':
      return (
        <>
          {block.links.map((link) => (
            <View key={link.id} style={styles.subGroup}>
              <TextField
                label="Name"
                value={link.label}
                onChangeText={(value) =>
                  dispatch({ type: 'setLinkField', path, linkId: link.id, field: 'label', value })
                }
              />
              <TextField
                label="Handle"
                value={link.handle}
                onChangeText={(value) =>
                  dispatch({ type: 'setLinkField', path, linkId: link.id, field: 'handle', value })
                }
              />
              <TextField
                label="Link"
                value={link.url}
                onChangeText={(value) =>
                  dispatch({ type: 'setLinkField', path, linkId: link.id, field: 'url', value })
                }
              />
            </View>
          ))}
        </>
      );

    case 'infoList':
      return (
        <>
          {block.items.map((item) => (
            <View key={item.id} style={styles.subGroup}>
              <TextField
                label="Label"
                value={item.label}
                onChangeText={(value) =>
                  dispatch({ type: 'setInfoField', path, itemId: item.id, field: 'label', value })
                }
              />
              <TextField
                label="Value"
                value={item.value}
                multiline
                onChangeText={(value) =>
                  dispatch({ type: 'setInfoField', path, itemId: item.id, field: 'value', value })
                }
              />
            </View>
          ))}
        </>
      );

    case 'image':
      return (
        <>
          <ImagePicker
            media={block.media}
            onChange={(media) => dispatch({ type: 'setBlockMedia', path, media })}
          />
          <TextField
            label="Description (for screen readers)"
            value={block.media.alt ?? ''}
            onChangeText={(alt) =>
              dispatch({ type: 'setBlockMedia', path, media: { ...block.media, alt } })
            }
          />
        </>
      );

    default:
      return <Text style={styles.meta}>This block has no text to edit.</Text>;
  }
}

/* -------------------------------------------------------------------------- */
/* Small pieces                                                               */
/* -------------------------------------------------------------------------- */

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Toggle({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleText}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {hint && <Text style={styles.meta}>{hint}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: Colors.text, false: Colors.border }}
        thumbColor={Colors.background}
      />
    </View>
  );
}

/**
 * Two-step confirmation. `Alert` is a no-op on react-native-web and
 * `window.confirm` blocks the thread, so destructive actions ask inline.
 */
function ConfirmButton({
  label,
  confirmLabel,
  onConfirm,
}: {
  label: string;
  confirmLabel: string;
  onConfirm: () => void;
}) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(timer);
  }, [armed]);

  return (
    <Pressable
      onPress={() => {
        if (armed) {
          onConfirm();
          setArmed(false);
        } else {
          setArmed(true);
        }
      }}
      style={({ pressed }) => [
        styles.danger,
        armed && styles.dangerArmed,
        pressed && styles.dangerPressed,
      ]}>
      <Text style={[styles.dangerLabel, armed && styles.dangerLabelArmed]}>
        {armed ? confirmLabel : label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  panel: {
    // react-native-web's ScrollView ignores a bare `width` inside a flex row
    // and grows to its content, so the fixed size lives on this wrapper.
    width: 320,
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 320,
    overflow: 'hidden',
    borderLeftWidth: 1,
    borderLeftColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  scroll: {
    flex: 1,
  },
  panelContent: {
    padding: Spacing.md,
    gap: Spacing.lg,
  },
  empty: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textMuted,
    padding: Spacing.md,
  },
  group: {
    gap: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  groupTitle: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  subGroup: {
    gap: Spacing.sm,
    paddingLeft: Spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: Colors.border,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  segmented: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  segment: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  segmentActive: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  segmentLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    color: Colors.textMuted,
  },
  segmentLabelActive: {
    color: Colors.background,
  },
  meta: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textMuted,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  toggleText: {
    flex: 1,
    gap: 2,
  },
  toggleLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    color: Colors.text,
  },
  danger: {
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  dangerArmed: {
    borderColor: '#F87171',
  },
  dangerPressed: {
    backgroundColor: Colors.border,
  },
  dangerLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  dangerLabelArmed: {
    color: '#F87171',
  },
});
